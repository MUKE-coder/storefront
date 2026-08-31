package services

import (
	"fmt"
	"math"

	"gorm.io/gorm"

	"storefront/apps/api/internal/models"
)

// CategoryService handles business logic for categories.
type CategoryService struct {
	DB *gorm.DB
}

// CategoryListParams holds pagination and filter parameters.
type CategoryListParams struct {
	Page      int
	PageSize  int
	Search    string
	SortBy    string
	SortOrder string
}

// List returns a paginated list of categories.
func (s *CategoryService) List(params CategoryListParams) ([]models.Category, int64, int, error) {
	if params.Page < 1 {
		params.Page = 1
	}
	if params.PageSize < 1 || params.PageSize > 100 {
		params.PageSize = 20
	}
	if params.SortOrder != "asc" && params.SortOrder != "desc" {
		params.SortOrder = "desc"
	}
	// SortBy is interpolated into ORDER BY below, so it MUST be whitelisted
	// against real columns — never trust a client-supplied sort column.
	sortableCategory := map[string]bool{"id": true, "created_at": true, "updated_at": true, "name": true, "slug": true, "description": true, "featured": true, "parent_id": true}
	if !sortableCategory[params.SortBy] {
		params.SortBy = "created_at"
	}

	query := s.DB.Model(&models.Category{})

	if params.Search != "" {
		query = query.Where("LOWER(name) LIKE LOWER(?) OR LOWER(slug) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?) OR LOWER(parent) LIKE LOWER(?)", "%"+params.Search+"%", "%"+params.Search+"%", "%"+params.Search+"%", "%"+params.Search+"%")
	}

	var total int64
	query.Count(&total)

	var items []models.Category
	offset := (params.Page - 1) * params.PageSize
	if err := query.Order(params.SortBy + " " + params.SortOrder).Offset(offset).Limit(params.PageSize).Find(&items).Error; err != nil {
		return nil, 0, 0, fmt.Errorf("fetching categories: %w", err)
	}

	pages := int(math.Ceil(float64(total) / float64(params.PageSize)))
	return items, total, pages, nil
}

// GetByID returns a single category by ID.
func (s *CategoryService) GetByID(id string) (*models.Category, error) {
	var item models.Category
	if err := s.DB.First(&item, "id = ?", id).Error; err != nil {
		return nil, fmt.Errorf("category not found: %w", err)
	}
	return &item, nil
}

// Create creates a new category.
func (s *CategoryService) Create(item *models.Category) error {
	if err := s.DB.Create(item).Error; err != nil {
		return fmt.Errorf("creating category: %w", err)
	}
	return nil
}

// Update modifies an existing category. Two queries: First() loads
// the row + verifies existence; Updates() persists the diff. The
// loaded struct is mutated by Updates() so we can return it directly
// without a third refetch.
func (s *CategoryService) Update(id string, updates map[string]interface{}) (*models.Category, error) {
	var item models.Category
	if err := s.DB.First(&item, "id = ?", id).Error; err != nil {
		return nil, fmt.Errorf("category not found: %w", err)
	}

	if err := s.DB.Model(&item).Updates(updates).Error; err != nil {
		return nil, fmt.Errorf("updating category: %w", err)
	}

	return &item, nil
}

// Delete soft-deletes a category. One query — we don't need to load
// the row first; GORM's Delete is atomic and rows-affected tells us
// whether it existed.
func (s *CategoryService) Delete(id string) error {
	res := s.DB.Where("id = ?", id).Delete(&models.Category{})
	if res.Error != nil {
		return fmt.Errorf("deleting category: %w", res.Error)
	}
	if res.RowsAffected == 0 {
		return fmt.Errorf("category not found")
	}
	return nil
}
