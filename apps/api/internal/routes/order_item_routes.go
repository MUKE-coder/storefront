package routes

import (
	"storefront/apps/api/internal/handlers"
)

// Order item routes.
//
// Moved out of routes.go by hand when this project was upgraded past v3.185.0.
// The lines are the ones that were already there, carried across unchanged.
//
// This is the whole surface for order items: the handler, and every path that
// reaches it. Add a route by adding a line here. Remove the resource by
// deleting this file; nothing else refers to it.
func init() {
	RegisterRoutes(func(m *Mount) {
		h := &handlers.OrderItemHandler{
			DB: m.DB,
		}

		m.Protected.GET("/order_items", h.List)
		m.Protected.GET("/order_items/export", h.Export)
		m.Protected.POST("/order_items/import", h.Import)
		m.Protected.GET("/order_items/import/template", h.Template)
		m.Protected.GET("/order_items/:id", h.GetByID)
		m.Protected.GET("/order_items/:id/pdf", h.PDF)
		m.Protected.POST("/order_items", h.Create)
		m.Protected.PUT("/order_items/:id", h.Update)
		m.Protected.PATCH("/order_items/:id", h.Patch)
		m.Admin.DELETE("/order_items/:id", h.Delete)
		m.Admin.POST("/order_items/bulk", h.Bulk)
	})
}
