package routes

import (
	"storefront/apps/api/internal/handlers"
)

// Orders routes.
//
// Moved out of routes.go by hand when this project was upgraded past v3.185.0.
// The lines are the ones that were already there, carried across unchanged.
//
// This is the whole surface for orders: the handler, and every path that
// reaches it. Add a route by adding a line here. Remove the resource by
// deleting this file; nothing else refers to it.
func init() {
	RegisterRoutes(func(m *Mount) {
		h := &handlers.OrderHandler{
			DB: m.DB,
		}

		m.Protected.GET("/orders", h.List)
		m.Protected.GET("/orders/export", h.Export)
		m.Protected.POST("/orders/import", h.Import)
		m.Protected.GET("/orders/import/template", h.Template)
		m.Protected.GET("/orders/:id", h.GetByID)
		m.Protected.GET("/orders/:id/pdf", h.PDF)
		m.Protected.POST("/orders", h.Create)
		m.Protected.PUT("/orders/:id", h.Update)
		m.Protected.PATCH("/orders/:id", h.Patch)
		m.Admin.DELETE("/orders/:id", h.Delete)
		m.Admin.POST("/orders/bulk", h.Bulk)
	})
}
