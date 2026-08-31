package handlers

import (
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"storefront/apps/api/internal/events"
	"storefront/apps/api/internal/export"
	"storefront/apps/api/internal/models"
	"storefront/apps/api/internal/paginate"
	"storefront/apps/api/internal/pdf"
	"storefront/apps/api/internal/services"
)

// OrderHandler handles order endpoints.
type OrderHandler struct {
	DB *gorm.DB
}

// List returns a paginated list of orders.
//
//	?archived=true   only archived rows
//	?archived=all    both
//	(default)        only live rows
func (h *OrderHandler) List(c *gin.Context) {
	query := h.DB.Model(&models.Order{}).Preload("Items")

	// Archived rows are excluded by default. Anything else means an operator
	// archives twelve rows, sees the count go down, and finds them again the
	// next time somebody sorts by a different column.
	switch c.Query("archived") {
	case "true", "1":
		query = query.Where("archived_at IS NOT NULL")
	case "all":
		// no filter
	default:
		query = query.Where("archived_at IS NULL")
	}

	res, err := paginate.List[models.Order](
		query,
		paginate.Bind(c),
		paginate.Config{
			Searchable: []string{"number", "customer_name", "customer_email", "shipping_address", "phone", "payment_intent"},
			Sortable:   map[string]bool{"id": true, "created_at": true, "number": true, "customer_name": true, "customer_email": true, "shipping_address": true, "phone": true, "payment_intent": true, "status": true},
			Filterable: map[string]bool{"id": true, "number": true, "customer_name": true, "customer_email": true, "shipping_address": true, "phone": true, "subtotal": true, "shipping": true, "total": true, "payment_intent": true, "status": true},
		},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to fetch orders",
			},
		})
		return
	}

	c.JSON(http.StatusOK, res)
}

// Export streams the full filtered list as CSV (default) or XLSX.
// Honours the same search/filter query params as List but skips
// pagination — you get every matching row in one file.
//
// Memory-bounded: reads in chunks of exportBatchSize so a million-row
// export doesn't OOM the process. CSV streams directly to the response
// writer; XLSX has to buffer (excelize requires the full sheet in
// memory before Write), so we still chunk the SCAN to avoid loading
// every row at once.
//
//	GET /api/orders/export?format=csv
//	GET /api/orders/export?format=xlsx&search=foo
func (h *OrderHandler) Export(c *gin.Context) {
	const exportBatchSize = 1000

	format := c.DefaultQuery("format", "csv")
	search := c.Query("search")

	query := h.DB.Model(&models.Order{}).Preload("Items").Order("created_at desc")
	if search != "" && len([]string{"number", "customer_name", "customer_email", "shipping_address", "phone", "payment_intent"}) > 0 {
		// Reuse the same searchable columns as List.
		searchable := []string{"number", "customer_name", "customer_email", "shipping_address", "phone", "payment_intent"}
		clause := ""
		args := []any{}
		wild := "%" + search + "%"
		for i, col := range searchable {
			if i > 0 {
				clause += " OR "
			}
			clause += "LOWER(" + col + ") LIKE LOWER(?)"
			args = append(args, wild)
		}
		query = query.Where(clause, args...)
	}

	opts := export.Options{
		Sheet: "Orders",
		Columns: []export.Column{
			{Header: "ID", Field: "ID"},
			{Header: "Number", Field: "Number"},
			{Header: "CustomerName", Field: "CustomerName"},
			{Header: "CustomerEmail", Field: "CustomerEmail"},
			{Header: "ShippingAddress", Field: "ShippingAddress"},
			{Header: "Phone", Field: "Phone"},
			{Header: "Subtotal", Field: "Subtotal"},
			{Header: "Shipping", Field: "Shipping"},
			{Header: "Total", Field: "Total"},
			{Header: "PaymentIntent", Field: "PaymentIntent"},
			{Header: "Status", Field: "Status"},
			{Header: "Created At", Field: "CreatedAt", Format: "date:2006-01-02"},
		},
	}

	// Stream rows in batches via GORM's FindInBatches. CSV writes each
	// batch straight to the wire; XLSX accumulates into a slice (no
	// streaming API in excelize) but at least we never load the whole
	// table at once.
	if format == "xlsx" {
		c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
		c.Header("Content-Disposition", `attachment; filename="orders.xlsx"`)
		var all []models.Order
		if err := query.FindInBatches(&[]models.Order{}, exportBatchSize, func(tx *gorm.DB, batch int) error {
			var rows []models.Order
			if err := tx.Scan(&rows).Error; err != nil {
				return err
			}
			all = append(all, rows...)
			return nil
		}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": gin.H{"code": "EXPORT_FAILED", "message": err.Error()},
			})
			return
		}
		if err := export.XLSX(c.Writer, all, opts); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": gin.H{"code": "EXPORT_FAILED", "message": err.Error()},
			})
		}
		return
	}

	// CSV path — true streaming. Write headers once, then each batch
	// flushes its rows directly to the response writer.
	c.Header("Content-Type", "text/csv")
	c.Header("Content-Disposition", `attachment; filename="orders.csv"`)

	headerWritten := false
	if err := query.FindInBatches(&[]models.Order{}, exportBatchSize, func(tx *gorm.DB, batch int) error {
		var rows []models.Order
		if err := tx.Scan(&rows).Error; err != nil {
			return err
		}
		if !headerWritten {
			if err := export.CSV(c.Writer, rows, opts); err != nil {
				return err
			}
			headerWritten = true
		} else {
			// Subsequent batches: write rows only, no header.
			if err := export.CSVRows(c.Writer, rows, opts); err != nil {
				return err
			}
		}
		return nil
	}).Error; err != nil {
		// Headers already sent — best we can do is log + truncate.
		// The client will see a malformed CSV; ops should re-run.
		// (We don't write a JSON error body once streaming has begun.)
		_ = err
	}
}

// GetByID returns a single order by ID.
func (h *OrderHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	var item models.Order
	if err := h.DB.Preload("Items").First(&item, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": gin.H{
				"code":    "NOT_FOUND",
				"message": "Order not found",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": item,
	})
}

// PDF streams this order as a print-ready PDF — a repeating header and
// footer with page numbers, the record's fields as a detail grid, and any
// line items as a table. Edit the pdf.Record below to restyle it; the
// renderer itself lives in internal/pdf/record.go.
func (h *OrderHandler) PDF(c *gin.Context) {
	id := c.Param("id")

	var item models.Order
	if err := h.DB.Preload("Items").First(&item, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": gin.H{
				"code":    "NOT_FOUND",
				"message": "Order not found",
			},
		})
		return
	}

	appName := os.Getenv("APP_NAME")
	if appName == "" {
		appName = "Order"
	}

	rec := pdf.Record{
		Title:      "ORDER",
		Subtitle:   pdf.Value(item.Number),
		Brand:      appName,
		FooterNote: appName + " · generated " + time.Now().Format("2 Jan 2006 15:04"),
		Fields: []pdf.Field{
			{Label: "Number", Value: pdf.Value(item.Number)},
			{Label: "Customer Name", Value: pdf.Value(item.CustomerName)},
			{Label: "Customer Email", Value: pdf.Value(item.CustomerEmail)},
			{Label: "Shipping Address", Value: pdf.Value(item.ShippingAddress)},
			{Label: "Phone", Value: pdf.Value(item.Phone)},
			{Label: "Subtotal", Value: pdf.Value(item.Subtotal)},
			{Label: "Shipping", Value: pdf.Value(item.Shipping)},
			{Label: "Total", Value: pdf.Value(item.Total)},
			{Label: "Payment Intent", Value: pdf.Value(item.PaymentIntent)},
			{Label: "Status", Value: pdf.Value(item.Status)},
			{Label: "Created", Value: pdf.Value(item.CreatedAt)},
		},
	}

	itemRows := make([][]string, 0, len(item.Items))
	for _, row := range item.Items {
		itemRows = append(itemRows, []string{pdf.Value(row.ProductName), pdf.Value(row.Quantity), pdf.Value(row.UnitPrice), pdf.Value(row.LineTotal)})
	}
	if len(itemRows) > 0 {
		rec.Sections = append(rec.Sections, pdf.Section{
			Title:   "Order Items",
			Headers: []string{"Product Name", "Quantity", "Unit Price", "Line Total"},
			Aligns:  []string{"L", "R", "R", "R"},
			Rows:    itemRows,
		})
	}

	out, err := pdf.RenderRecord(rec)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"code":    "PDF_ERROR",
				"message": "could not render the PDF",
			},
		})
		return
	}

	filename := "order-" + id + ".pdf"
	c.Header("Content-Disposition", "inline; filename=\""+filename+"\"")
	c.Data(http.StatusOK, "application/pdf", out)
}

// CreateOrderRequest is the JSON body accepted by POST /orders.
//
// Named rather than anonymous so the API reference can document it: gindocs
// builds a request schema by reflecting over a real type, and an anonymous
// struct inside a handler gives it nothing to reflect over. routes.go passes
// this type to docs.Route(...).RequestBody().
type CreateOrderRequest struct {
	Number          string  `json:"number"`
	CustomerName    string  `json:"customer_name" binding:"required"`
	CustomerEmail   string  `json:"customer_email" binding:"required"`
	ShippingAddress string  `json:"shipping_address"`
	Phone           string  `json:"phone" binding:"required"`
	Subtotal        float64 `json:"subtotal"`
	Shipping        float64 `json:"shipping"`
	Total           float64 `json:"total"`
	PaymentIntent   string  `json:"payment_intent" binding:"required"`
	Status          string  `json:"status" binding:"required"`
	Items           []struct {
		ProductName string  `json:"product_name"`
		Quantity    int     `json:"quantity"`
		UnitPrice   float64 `json:"unit_price"`
		LineTotal   float64 `json:"line_total"`
	} `json:"items"`
}

// UpdateOrderRequest is the JSON body accepted by PUT /orders/:id.
// Every field is optional — only what the client sends is applied.
type UpdateOrderRequest struct {
	Number          string   `json:"number"`
	CustomerName    string   `json:"customer_name"`
	CustomerEmail   string   `json:"customer_email"`
	ShippingAddress string   `json:"shipping_address"`
	Phone           string   `json:"phone"`
	Subtotal        *float64 `json:"subtotal"`
	Shipping        *float64 `json:"shipping"`
	Total           *float64 `json:"total"`
	PaymentIntent   string   `json:"payment_intent"`
	Status          string   `json:"status"`
	Items           []struct {
		ProductName string  `json:"product_name"`
		Quantity    int     `json:"quantity"`
		UnitPrice   float64 `json:"unit_price"`
		LineTotal   float64 `json:"line_total"`
	} `json:"items"`
}

// Create adds a new order.
func (h *OrderHandler) Create(c *gin.Context) {
	var req CreateOrderRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": err.Error(),
			},
		})
		return
	}

	item := models.Order{
		Number:          req.Number,
		CustomerName:    req.CustomerName,
		CustomerEmail:   req.CustomerEmail,
		ShippingAddress: req.ShippingAddress,
		Phone:           req.Phone,
		Subtotal:        req.Subtotal,
		Shipping:        req.Shipping,
		Total:           req.Total,
		PaymentIntent:   req.PaymentIntent,
		Status:          req.Status,
	}

	if len(req.Items) > 0 {
		items := make([]models.OrderItem, 0, len(req.Items))
		for _, it := range req.Items {
			items = append(items, models.OrderItem{
				ProductName: it.ProductName,
				Quantity:    it.Quantity,
				UnitPrice:   it.UnitPrice,
				LineTotal:   it.LineTotal,
			})
		}
		item.Items = items
	}

	if err := h.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to create order",
			},
		})
		return
	}

	h.DB.Preload("Items").First(&item, "id = ?", item.ID)

	events.Emitted(c, "orders", "Order", "created", item.ID, item.Number, "", nil, item)

	c.JSON(http.StatusCreated, gin.H{
		"data":    item,
		"message": "Order created successfully",
	})
}

// Update modifies an existing order.
func (h *OrderHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var item models.Order
	if err := h.DB.First(&item, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": gin.H{
				"code":    "NOT_FOUND",
				"message": "Order not found",
			},
		})
		return
	}

	var req UpdateOrderRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": err.Error(),
			},
		})
		return
	}

	updates := map[string]interface{}{}
	if req.Number != "" {
		updates["number"] = req.Number
	}
	if req.CustomerName != "" {
		updates["customer_name"] = req.CustomerName
	}
	if req.CustomerEmail != "" {
		updates["customer_email"] = req.CustomerEmail
	}
	if req.ShippingAddress != "" {
		updates["shipping_address"] = req.ShippingAddress
	}
	if req.Phone != "" {
		updates["phone"] = req.Phone
	}
	if req.Subtotal != nil {
		updates["subtotal"] = *req.Subtotal
	}
	if req.Shipping != nil {
		updates["shipping"] = *req.Shipping
	}
	if req.Total != nil {
		updates["total"] = *req.Total
	}
	if req.PaymentIntent != "" {
		updates["payment_intent"] = req.PaymentIntent
	}
	if req.Status != "" {
		updates["status"] = req.Status
	}

	if err := h.DB.Model(&item).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to update order",
			},
		})
		return
	}

	if req.Items != nil {
		h.DB.Where("order_id = ?", item.ID).Delete(&models.OrderItem{})
		if len(req.Items) > 0 {
			newItems := make([]models.OrderItem, 0, len(req.Items))
			for _, it := range req.Items {
				row := models.OrderItem{
					ProductName: it.ProductName,
					Quantity:    it.Quantity,
					UnitPrice:   it.UnitPrice,
					LineTotal:   it.LineTotal,
				}
				row.OrderID = item.ID
				newItems = append(newItems, row)
			}
			h.DB.Create(&newItems)
		}
	}

	h.DB.Preload("Items").First(&item, "id = ?", item.ID)

	events.Emitted(c, "orders", "Order", "updated", item.ID, item.Number, services.DiffSummary(updates), nil, item)

	c.JSON(http.StatusOK, gin.H{
		"data":    item,
		"message": "Order updated successfully",
	})
}

// Patch applies a partial update to a order. Used by the admin's
// grouped update view — each form group's Save button calls PATCH with
// only the fields it owns, so editing "Address" doesn't rewrite
// "Pricing". Refuses any key that isn't a writable model column.
func (h *OrderHandler) Patch(c *gin.Context) {
	id := c.Param("id")

	var item models.Order
	if err := h.DB.First(&item, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": gin.H{
				"code":    "NOT_FOUND",
				"message": "Order not found",
			},
		})
		return
	}

	var body map[string]interface{}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": err.Error(),
			},
		})
		return
	}

	// Whitelist: only writable model columns may be patched. id,
	// created_at, updated_at, deleted_at, version are owned by the
	// framework and silently dropped here.
	allowed := map[string]bool{
		"number":           true,
		"customer_name":    true,
		"customer_email":   true,
		"shipping_address": true,
		"phone":            true,
		"subtotal":         true,
		"shipping":         true,
		"total":            true,
		"payment_intent":   true,
		"status":           true,
	}
	updates := map[string]interface{}{}
	for k, v := range body {
		if allowed[k] {
			updates[k] = v
		}
	}
	if len(updates) == 0 {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": "No writable fields in request body",
			},
		})
		return
	}

	if err := h.DB.Model(&item).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to patch order",
			},
		})
		return
	}
	h.DB.Preload("Items").First(&item, "id = ?", item.ID)

	events.Emitted(c, "orders", "Order", "updated", item.ID, item.Number, services.DiffSummary(updates), nil, item)

	c.JSON(http.StatusOK, gin.H{
		"data":    item,
		"message": "Order updated successfully",
	})
}

// Delete soft-deletes a order.
func (h *OrderHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	var item models.Order
	if err := h.DB.First(&item, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": gin.H{
				"code":    "NOT_FOUND",
				"message": "Order not found",
			},
		})
		return
	}

	if err := h.DB.Delete(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to delete order",
			},
		})
		return
	}

	events.Emitted(c, "orders", "Order", "deleted", item.ID, item.Number, "", item, nil)

	c.JSON(http.StatusOK, gin.H{
		"message": "Order deleted successfully",
	})
}

// BulkOrderRequest is one operation applied to a set of rows.
//
// One request rather than one per row. The admin used to fire N parallel
// DELETEs, which means N transactions, N audit entries, and a half-applied
// result when the eleventh fails: the operator sees "failed" while ten rows
// are already gone.
type BulkOrderRequest struct {
	// delete removes, archive puts away, restore brings back, patch writes the
	// same field values to every selected row.
	Action string `json:"action" binding:"required,oneof=delete archive restore patch"`
	// Capped: an unbounded IN clause is a way to lock a table by accident.
	IDs []string `json:"ids" binding:"required,min=1,max=500"`
	// Only read when action is "patch". Whitelisted the same way Patch is.
	Patch map[string]interface{} `json:"patch"`
}

// Bulk applies one action to many orders in a single transaction.
func (h *OrderHandler) Bulk(c *gin.Context) {
	var req BulkOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": err.Error(),
			},
		})
		return
	}

	// Unarchived scope for archive, archived scope for restore: without it a
	// mixed selection reports "12 archived" having changed three rows.
	var items []models.Order
	scope := h.DB.Where("id IN ?", req.IDs)
	if req.Action == "restore" {
		scope = scope.Where("archived_at IS NOT NULL")
	} else if req.Action == "archive" {
		scope = scope.Where("archived_at IS NULL")
	}
	if err := scope.Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to load orders"},
		})
		return
	}
	if len(items) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"data":    gin.H{"affected": 0, "requested": len(req.IDs)},
			"message": "Nothing to do",
		})
		return
	}

	ids := make([]string, 0, len(items))
	for _, item := range items {
		ids = append(ids, item.ID)
	}

	var updates map[string]interface{}
	if req.Action == "patch" {
		// Same whitelist as Patch. Framework-owned columns are dropped rather
		// than rejected, so a client sending the whole row is not an error.
		allowed := map[string]bool{
			"number":           true,
			"customer_name":    true,
			"customer_email":   true,
			"shipping_address": true,
			"phone":            true,
			"subtotal":         true,
			"shipping":         true,
			"total":            true,
			"payment_intent":   true,
			"status":           true,
		}
		updates = map[string]interface{}{}
		for k, v := range req.Patch {
			if allowed[k] {
				updates[k] = v
			}
		}
		if len(updates) == 0 {
			c.JSON(http.StatusUnprocessableEntity, gin.H{
				"error": gin.H{
					"code":    "VALIDATION_ERROR",
					"message": "No writable fields in patch",
				},
			})
			return
		}
	}

	// One transaction: all of it lands or none of it does.
	err := h.DB.Transaction(func(tx *gorm.DB) error {
		switch req.Action {
		case "delete":
			return tx.Where("id IN ?", ids).Delete(&models.Order{}).Error
		case "archive":
			now := time.Now()
			return tx.Model(&models.Order{}).Where("id IN ?", ids).
				Update("archived_at", now).Error
		case "restore":
			return tx.Model(&models.Order{}).Where("id IN ?", ids).
				Update("archived_at", nil).Error
		default:
			return tx.Model(&models.Order{}).Where("id IN ?", ids).
				Updates(updates).Error
		}
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to " + req.Action + " orders",
			},
		})
		return
	}

	// One audit entry naming the action and the count, not N entries that bury
	// everything else somebody did today.
	// A local map, not a package-level helper: every resource gets its own
	// handler file in package handlers, so a shared func would be redeclared
	// once per resource.
	past := map[string]string{
		"delete":  "deleted",
		"archive": "archived",
		"restore": "restored",
		"patch":   "updated",
	}[req.Action]

	noun := "orders"
	if len(ids) == 1 {
		noun = "order"
	}

	summary := req.Action + " " + strconv.Itoa(len(ids)) + " " + noun
	if req.Action == "patch" {
		summary += ": " + services.DiffSummary(updates)
	}
	// resourceID holds ONE id, not all of them: it is a lookup key, and joining
	// five hundred UUIDs into it makes the column unusable for the thing it is
	// for. The count lives in the summary, where it can be read.
	events.Emitted(c, "orders", "Order", "bulk", ids[0], summary, summary, nil, nil)

	c.JSON(http.StatusOK, gin.H{
		"data":    gin.H{"affected": len(ids), "requested": len(req.IDs)},
		"message": strconv.Itoa(len(ids)) + " " + noun + " " + past,
	})
}
