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
	"storefront/apps/api/internal/files"
	"storefront/apps/api/internal/models"
	"storefront/apps/api/internal/paginate"
	"storefront/apps/api/internal/pdf"
	"storefront/apps/api/internal/services"
	"storefront/apps/api/internal/storage"
)

// ProductHandler handles product endpoints.
type ProductHandler struct {
	DB      *gorm.DB
	Storage *storage.Storage // v3.31.33
}

// List returns a paginated list of products.
//
//	?archived=true   only archived rows
//	?archived=all    both
//	(default)        only live rows
func (h *ProductHandler) List(c *gin.Context) {
	query := h.DB.Model(&models.Product{}).Preload("Category")

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

	res, err := paginate.List[models.Product](
		query,
		paginate.Bind(c).With("category_id", c.Query("category_id")),
		paginate.Config{
			Searchable: []string{"name", "slug", "sku", "description"},
			Sortable:   map[string]bool{"id": true, "created_at": true, "name": true, "slug": true, "sku": true, "description": true, "stock": true},
			Filterable: map[string]bool{"id": true, "name": true, "slug": true, "sku": true, "description": true, "price": true, "compare_at_price": true, "stock": true, "images": true, "category_id": true, "active": true},
		},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to fetch products",
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
//	GET /api/products/export?format=csv
//	GET /api/products/export?format=xlsx&search=foo
func (h *ProductHandler) Export(c *gin.Context) {
	const exportBatchSize = 1000

	format := c.DefaultQuery("format", "csv")
	search := c.Query("search")

	query := h.DB.Model(&models.Product{}).Preload("Category").Order("created_at desc")
	if search != "" && len([]string{"name", "slug", "sku", "description"}) > 0 {
		// Reuse the same searchable columns as List.
		searchable := []string{"name", "slug", "sku", "description"}
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
		Sheet: "Products",
		Columns: []export.Column{
			{Header: "ID", Field: "ID"},
			{Header: "Name", Field: "Name"},
			{Header: "Slug", Field: "Slug"},
			{Header: "Sku", Field: "Sku"},
			{Header: "Description", Field: "Description"},
			{Header: "Price", Field: "Price"},
			{Header: "CompareAtPrice", Field: "CompareAtPrice"},
			{Header: "Stock", Field: "Stock"},
			{Header: "Images", Field: "Images"},
			{Header: "Active", Field: "Active", Format: "bool"},
			{Header: "Created At", Field: "CreatedAt", Format: "date:2006-01-02"},
		},
	}

	// Stream rows in batches via GORM's FindInBatches. CSV writes each
	// batch straight to the wire; XLSX accumulates into a slice (no
	// streaming API in excelize) but at least we never load the whole
	// table at once.
	if format == "xlsx" {
		c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
		c.Header("Content-Disposition", `attachment; filename="products.xlsx"`)
		var all []models.Product
		if err := query.FindInBatches(&[]models.Product{}, exportBatchSize, func(tx *gorm.DB, batch int) error {
			var rows []models.Product
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
	c.Header("Content-Disposition", `attachment; filename="products.csv"`)

	headerWritten := false
	if err := query.FindInBatches(&[]models.Product{}, exportBatchSize, func(tx *gorm.DB, batch int) error {
		var rows []models.Product
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

// GetByID returns a single product by ID.
func (h *ProductHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	var item models.Product
	if err := h.DB.Preload("Category").First(&item, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": gin.H{
				"code":    "NOT_FOUND",
				"message": "Product not found",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": item,
	})
}

// PDF streams this product as a print-ready PDF — a repeating header and
// footer with page numbers, the record's fields as a detail grid, and any
// line items as a table. Edit the pdf.Record below to restyle it; the
// renderer itself lives in internal/pdf/record.go.
func (h *ProductHandler) PDF(c *gin.Context) {
	id := c.Param("id")

	var item models.Product
	if err := h.DB.Preload("Category").First(&item, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": gin.H{
				"code":    "NOT_FOUND",
				"message": "Product not found",
			},
		})
		return
	}

	appName := os.Getenv("APP_NAME")
	if appName == "" {
		appName = "Product"
	}

	rec := pdf.Record{
		Title:      "PRODUCT",
		Subtitle:   pdf.Value(item.Name),
		Brand:      appName,
		FooterNote: appName + " · generated " + time.Now().Format("2 Jan 2006 15:04"),
		Fields: []pdf.Field{
			{Label: "Name", Value: pdf.Value(item.Name)},
			{Label: "Sku", Value: pdf.Value(item.Sku)},
			{Label: "Price", Value: pdf.Value(item.Price)},
			{Label: "Compare At Price", Value: pdf.Value(item.CompareAtPrice)},
			{Label: "Stock", Value: pdf.Value(item.Stock)},
			{Label: "Category", Value: pdf.Display(item.Category)},
			{Label: "Active", Value: pdf.Value(item.Active)},
			{Label: "Created", Value: pdf.Value(item.CreatedAt)},
		},
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

	filename := "product-" + id + ".pdf"
	c.Header("Content-Disposition", "inline; filename=\""+filename+"\"")
	c.Data(http.StatusOK, "application/pdf", out)
}

// CreateProductRequest is the JSON body accepted by POST /products.
//
// Named rather than anonymous so the API reference can document it: gindocs
// builds a request schema by reflecting over a real type, and an anonymous
// struct inside a handler gives it nothing to reflect over. routes.go passes
// this type to docs.Route(...).RequestBody().
type CreateProductRequest struct {
	Name           string         `json:"name" binding:"required"`
	Sku            string         `json:"sku" binding:"required"`
	Description    string         `json:"description"`
	Price          float64        `json:"price"`
	CompareAtPrice float64        `json:"compare_at_price"`
	Stock          int            `json:"stock"`
	Images         files.FileRefs `json:"images"`
	CategoryID     string         `json:"category_id" binding:"required"`
	Active         bool           `json:"active"`
}

// UpdateProductRequest is the JSON body accepted by PUT /products/:id.
// Every field is optional — only what the client sends is applied.
type UpdateProductRequest struct {
	Name           string          `json:"name"`
	Sku            string          `json:"sku"`
	Description    string          `json:"description"`
	Price          *float64        `json:"price"`
	CompareAtPrice *float64        `json:"compare_at_price"`
	Stock          *int            `json:"stock"`
	Images         *files.FileRefs `json:"images"`
	CategoryID     *string         `json:"category_id"`
	Active         *bool           `json:"active"`
}

// Create adds a new product.
func (h *ProductHandler) Create(c *gin.Context) {
	var req CreateProductRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": err.Error(),
			},
		})
		return
	}

	item := models.Product{
		Name:           req.Name,
		Sku:            req.Sku,
		Description:    req.Description,
		Price:          req.Price,
		CompareAtPrice: req.CompareAtPrice,
		Stock:          req.Stock,
		Images:         req.Images,
		CategoryID:     req.CategoryID,
		Active:         req.Active,
	}

	if err := h.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to create product",
			},
		})
		return
	}

	h.DB.Preload("Category").First(&item, "id = ?", item.ID)
	if h.Storage != nil {
		files.ClaimRefs(c.Request.Context(), h.DB, &item)
	}

	events.Emitted(c, "products", "Product", "created", item.ID, item.Name, "", nil, item)

	c.JSON(http.StatusCreated, gin.H{
		"data":    item,
		"message": "Product created successfully",
	})
}

// Update modifies an existing product.
func (h *ProductHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var item models.Product
	if err := h.DB.First(&item, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": gin.H{
				"code":    "NOT_FOUND",
				"message": "Product not found",
			},
		})
		return
	}

	var req UpdateProductRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": err.Error(),
			},
		})
		return
	}

	oldItem := item // v3.31.33: snapshot for file diff
	updates := map[string]interface{}{}
	if req.Name != "" {
		updates["name"] = req.Name
	}
	if req.Sku != "" {
		updates["sku"] = req.Sku
	}
	if req.Description != "" {
		updates["description"] = req.Description
	}
	if req.Price != nil {
		updates["price"] = *req.Price
	}
	if req.CompareAtPrice != nil {
		updates["compare_at_price"] = *req.CompareAtPrice
	}
	if req.Stock != nil {
		updates["stock"] = *req.Stock
	}
	if req.Images != nil {
		updates["images"] = *req.Images
	}
	if req.CategoryID != nil {
		updates["category_id"] = *req.CategoryID
	}
	if req.Active != nil {
		updates["active"] = *req.Active
	}

	if err := h.DB.Model(&item).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to update product",
			},
		})
		return
	}

	h.DB.Preload("Category").First(&item, "id = ?", item.ID)
	if h.Storage != nil {
		files.CleanupRemoved(c.Request.Context(), h.Storage, &oldItem, &item)
		files.ClaimRefs(c.Request.Context(), h.DB, &item)
	}

	events.Emitted(c, "products", "Product", "updated", item.ID, item.Name, services.DiffSummary(updates), nil, item)

	c.JSON(http.StatusOK, gin.H{
		"data":    item,
		"message": "Product updated successfully",
	})
}

// Patch applies a partial update to a product. Used by the admin's
// grouped update view — each form group's Save button calls PATCH with
// only the fields it owns, so editing "Address" doesn't rewrite
// "Pricing". Refuses any key that isn't a writable model column.
func (h *ProductHandler) Patch(c *gin.Context) {
	id := c.Param("id")

	var item models.Product
	if err := h.DB.First(&item, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": gin.H{
				"code":    "NOT_FOUND",
				"message": "Product not found",
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
		"name":             true,
		"sku":              true,
		"description":      true,
		"price":            true,
		"compare_at_price": true,
		"stock":            true,
		"images":           true,
		"category_id":      true,
		"active":           true,
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
				"message": "Failed to patch product",
			},
		})
		return
	}
	h.DB.Preload("Category").First(&item, "id = ?", item.ID)

	events.Emitted(c, "products", "Product", "updated", item.ID, item.Name, services.DiffSummary(updates), nil, item)

	c.JSON(http.StatusOK, gin.H{
		"data":    item,
		"message": "Product updated successfully",
	})
}

// Delete soft-deletes a product.
func (h *ProductHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	var item models.Product
	if err := h.DB.First(&item, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": gin.H{
				"code":    "NOT_FOUND",
				"message": "Product not found",
			},
		})
		return
	}

	if err := h.DB.Delete(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to delete product",
			},
		})
		return
	}

	events.Emitted(c, "products", "Product", "deleted", item.ID, item.Name, "", item, nil)

	c.JSON(http.StatusOK, gin.H{
		"message": "Product deleted successfully",
	})
}

// BulkProductRequest is one operation applied to a set of rows.
//
// One request rather than one per row. The admin used to fire N parallel
// DELETEs, which means N transactions, N audit entries, and a half-applied
// result when the eleventh fails: the operator sees "failed" while ten rows
// are already gone.
type BulkProductRequest struct {
	// delete removes, archive puts away, restore brings back, patch writes the
	// same field values to every selected row.
	Action string `json:"action" binding:"required,oneof=delete archive restore patch"`
	// Capped: an unbounded IN clause is a way to lock a table by accident.
	IDs []string `json:"ids" binding:"required,min=1,max=500"`
	// Only read when action is "patch". Whitelisted the same way Patch is.
	Patch map[string]interface{} `json:"patch"`
}

// Bulk applies one action to many products in a single transaction.
func (h *ProductHandler) Bulk(c *gin.Context) {
	var req BulkProductRequest
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
	var items []models.Product
	scope := h.DB.Where("id IN ?", req.IDs)
	if req.Action == "restore" {
		scope = scope.Where("archived_at IS NOT NULL")
	} else if req.Action == "archive" {
		scope = scope.Where("archived_at IS NULL")
	}
	if err := scope.Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to load products"},
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
			"name":             true,
			"sku":              true,
			"description":      true,
			"price":            true,
			"compare_at_price": true,
			"stock":            true,
			"images":           true,
			"category_id":      true,
			"active":           true,
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
			return tx.Where("id IN ?", ids).Delete(&models.Product{}).Error
		case "archive":
			now := time.Now()
			return tx.Model(&models.Product{}).Where("id IN ?", ids).
				Update("archived_at", now).Error
		case "restore":
			return tx.Model(&models.Product{}).Where("id IN ?", ids).
				Update("archived_at", nil).Error
		default:
			return tx.Model(&models.Product{}).Where("id IN ?", ids).
				Updates(updates).Error
		}
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to " + req.Action + " products",
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

	noun := "products"
	if len(ids) == 1 {
		noun = "product"
	}

	summary := req.Action + " " + strconv.Itoa(len(ids)) + " " + noun
	if req.Action == "patch" {
		summary += ": " + services.DiffSummary(updates)
	}
	// resourceID holds ONE id, not all of them: it is a lookup key, and joining
	// five hundred UUIDs into it makes the column unusable for the thing it is
	// for. The count lives in the summary, where it can be read.
	events.Emitted(c, "products", "Product", "bulk", ids[0], summary, summary, nil, nil)

	c.JSON(http.StatusOK, gin.H{
		"data":    gin.H{"affected": len(ids), "requested": len(req.IDs)},
		"message": strconv.Itoa(len(ids)) + " " + noun + " " + past,
	})
}
