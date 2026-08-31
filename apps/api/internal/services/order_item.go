package services

import (
	"fmt"
	"math"

	"gorm.io/gorm"

	"storefront/apps/api/internal/models"
)

// OrderItemService handles business logic for order_items.
type OrderItemService struct {
	DB *gorm.DB
}

// OrderItemListParams holds pagination and filter parameters.
type OrderItemListParams struct {
	Page      int
	PageSize  int
	Search    string
	SortBy    string
	SortOrder string
}

// List returns a paginated list of order_items.
func (s *OrderItemService) List(params OrderItemListParams) ([]models.OrderItem, int64, int, error) {
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
	sortableOrderItem := map[string]bool{"id": true, "created_at": true, "updated_at": true, "product_id": true, "product_name": true, "quantity": true, "unit_price": true, "line_total": true, "order_id": true}
	if !sortableOrderItem[params.SortBy] {
		params.SortBy = "created_at"
	}

	query := s.DB.Model(&models.OrderItem{})

	if params.Search != "" {
		query = query.Where("LOWER(product) LIKE LOWER(?) OR LOWER(product_name) LIKE LOWER(?) OR LOWER(order) LIKE LOWER(?)", "%"+params.Search+"%", "%"+params.Search+"%", "%"+params.Search+"%")
	}

	var total int64
	query.Count(&total)

	var items []models.OrderItem
	offset := (params.Page - 1) * params.PageSize
	if err := query.Order(params.SortBy + " " + params.SortOrder).Offset(offset).Limit(params.PageSize).Find(&items).Error; err != nil {
		return nil, 0, 0, fmt.Errorf("fetching order_items: %w", err)
	}

	pages := int(math.Ceil(float64(total) / float64(params.PageSize)))
	return items, total, pages, nil
}

// GetByID returns a single orderitem by ID.
func (s *OrderItemService) GetByID(id string) (*models.OrderItem, error) {
	var item models.OrderItem
	if err := s.DB.First(&item, "id = ?", id).Error; err != nil {
		return nil, fmt.Errorf("orderitem not found: %w", err)
	}
	return &item, nil
}

// Create creates a new orderitem.
func (s *OrderItemService) Create(item *models.OrderItem) error {
	if err := s.DB.Create(item).Error; err != nil {
		return fmt.Errorf("creating orderitem: %w", err)
	}
	return nil
}

// Update modifies an existing orderitem. Two queries: First() loads
// the row + verifies existence; Updates() persists the diff. The
// loaded struct is mutated by Updates() so we can return it directly
// without a third refetch.
func (s *OrderItemService) Update(id string, updates map[string]interface{}) (*models.OrderItem, error) {
	var item models.OrderItem
	if err := s.DB.First(&item, "id = ?", id).Error; err != nil {
		return nil, fmt.Errorf("orderitem not found: %w", err)
	}

	if err := s.DB.Model(&item).Updates(updates).Error; err != nil {
		return nil, fmt.Errorf("updating orderitem: %w", err)
	}

	return &item, nil
}

// Delete soft-deletes a orderitem. One query — we don't need to load
// the row first; GORM's Delete is atomic and rows-affected tells us
// whether it existed.
func (s *OrderItemService) Delete(id string) error {
	res := s.DB.Where("id = ?", id).Delete(&models.OrderItem{})
	if res.Error != nil {
		return fmt.Errorf("deleting orderitem: %w", res.Error)
	}
	if res.RowsAffected == 0 {
		return fmt.Errorf("orderitem not found")
	}
	return nil
}
