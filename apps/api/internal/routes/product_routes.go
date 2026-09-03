package routes

import (
	"storefront/apps/api/internal/handlers"
)

// Products routes.
//
// Moved out of routes.go by hand when this project was upgraded past v3.185.0.
// The lines are the ones that were already there, carried across unchanged.
//
// This is the whole surface for products: the handler, and every path that
// reaches it. Add a route by adding a line here. Remove the resource by
// deleting this file; nothing else refers to it.
func init() {
	RegisterRoutes(func(m *Mount) {
		h := &handlers.ProductHandler{
			DB:      m.DB,
			Storage: m.Svc.Storage,
		}

		m.Public.GET("/products", h.ListPublic)
		m.Public.GET("/products/:key", h.GetPublic)
		m.Public.GET("/products/:key/related", h.RelatedPublic)
		m.Protected.GET("/products", h.List)
		m.Protected.GET("/products/export", h.Export)
		m.Protected.POST("/products/import", h.Import)
		m.Protected.GET("/products/import/template", h.Template)
		m.Protected.GET("/products/:id", h.GetByID)
		m.Protected.GET("/products/:id/pdf", h.PDF)
		m.Protected.POST("/products", h.Create)
		m.Protected.PUT("/products/:id", h.Update)
		m.Protected.PATCH("/products/:id", h.Patch)
		m.Admin.DELETE("/products/:id", h.Delete)
		m.Admin.POST("/products/bulk", h.Bulk)
	})
}
