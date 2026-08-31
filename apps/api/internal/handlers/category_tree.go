package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"storefront/apps/api/internal/services"
)

// CategoryTreeHandler serves the hierarchy: the whole tree for a picker, the
// breadcrumbs for a detail page, and the two writes a drag-and-drop tree makes.
type CategoryTreeHandler struct {
	DB   *gorm.DB
	Tree *services.CategoryTreeService
}

func NewCategoryTreeHandler(db *gorm.DB) *CategoryTreeHandler {
	return &CategoryTreeHandler{DB: db, Tree: services.NewCategoryTreeService(db)}
}

// GetTree handles GET /api/v1/categories/tree.
func (h *CategoryTreeHandler) GetTree(c *gin.Context) {
	nodes, err := h.Tree.Tree()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{
			"code": "INTERNAL_ERROR", "message": "Failed to load the tree",
		}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": nodes})
}

// GetBreadcrumbs handles GET /api/v1/categories/:id/breadcrumbs.
func (h *CategoryTreeHandler) GetBreadcrumbs(c *gin.Context) {
	rows, err := h.Tree.Breadcrumbs(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": gin.H{
			"code": "NOT_FOUND", "message": err.Error(),
		}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": rows})
}

// Move handles PATCH /api/v1/categories/:id/move.
//
// parent_id is a pointer so the JSON can distinguish "move to the root"
// (parent_id: "") from "leave the parent alone" (field absent). Without that
// distinction a reorder within one parent would silently promote the node.
func (h *CategoryTreeHandler) Move(c *gin.Context) {
	var req struct {
		ParentID *string `json:"parent_id"`
		Position int     `json:"position"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{
			"code": "VALIDATION_ERROR", "message": err.Error(),
		}})
		return
	}

	id := c.Param("id")
	parentID := ""
	if req.ParentID != nil {
		parentID = *req.ParentID
	} else {
		// Field absent: keep the parent it has, and treat this as a reorder.
		var current struct{ ParentID string }
		if err := h.DB.Table("categories").Select("parent_id").Where("id = ?", id).Scan(&current).Error; err == nil {
			parentID = current.ParentID
		}
	}

	if err := h.Tree.Move(id, parentID, req.Position); err != nil {
		// A refused move is the caller's mistake, not a server fault: it is
		// almost always an attempt to drop a node inside its own subtree.
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": gin.H{
			"code": "INVALID_MOVE", "message": err.Error(),
		}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Moved"})
}

// RebuildPaths handles POST /api/v1/categories/rebuild-tree.
//
// Exists for one specific moment: --tree was added to a resource that already
// had rows, so every one of them has a NULL path and the tree renders flat.
// Also the repair for a bulk import that went around the hooks.
func (h *CategoryTreeHandler) RebuildPaths(c *gin.Context) {
	if err := h.Tree.RebuildPaths(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{
			"code": "INTERNAL_ERROR", "message": err.Error(),
		}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Paths rebuilt"})
}

// Reorder handles POST /api/v1/categories/reorder, the ids of one parent's children
// in their new order.
func (h *CategoryTreeHandler) Reorder(c *gin.Context) {
	var req struct {
		ParentID string   `json:"parent_id"`
		IDs      []string `json:"ids" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{
			"code": "VALIDATION_ERROR", "message": err.Error(),
		}})
		return
	}
	if err := h.Tree.Reorder(req.ParentID, req.IDs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{
			"code": "INTERNAL_ERROR", "message": "Failed to reorder",
		}})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Reordered"})
}
