package routes

import (
	"storefront/apps/api/internal/handlers"
)

// Categories routes.
//
// Moved out of routes.go by hand when this project was upgraded past v3.185.0.
// The lines are the ones that were already there, carried across unchanged.
//
// This is the whole surface for categories: the handler, and every path that
// reaches it. Add a route by adding a line here. Remove the resource by
// deleting this file; nothing else refers to it.
func init() {
	RegisterRoutes(func(m *Mount) {
		h := &handlers.CategoryHandler{
			DB:      m.DB,
			Storage: m.Svc.Storage,
		}

		m.Public.GET("/categories/tree", h.TreePublic)
		m.Public.GET("/categories", h.ListPublic)
		m.Public.GET("/categories/:key", h.GetPublic)
		m.Public.GET("/categories/:key/related", h.RelatedPublic)
		m.Protected.GET("/categories", h.List)
		m.Protected.GET("/categories/export", h.Export)
		m.Protected.POST("/categories/import", h.Import)
		m.Protected.GET("/categories/import/template", h.Template)
		m.Protected.GET("/categories/:id", h.GetByID)
		m.Protected.GET("/categories/:id/pdf", h.PDF)
		m.Protected.POST("/categories", h.Create)
		m.Protected.PUT("/categories/:id", h.Update)
		m.Protected.PATCH("/categories/:id", h.Patch)
		m.Admin.DELETE("/categories/:id", h.Delete)
		m.Admin.POST("/categories/bulk", h.Bulk)

		// The --tree endpoints. Their own handler, so it stays next to the
		// routes it serves rather than in a custom block at the end of
		// routes.go, which is where the generator used to leave it.
		tree := handlers.NewCategoryTreeHandler(m.DB)
		m.Protected.GET("/categories/tree", tree.GetTree)
		m.Protected.GET("/categories/:id/breadcrumbs", tree.GetBreadcrumbs)
		m.Protected.PATCH("/categories/:id/move", tree.Move)
		m.Protected.POST("/categories/reorder", tree.Reorder)
		m.Protected.POST("/categories/rebuild-tree", tree.RebuildPaths)
	})
}
