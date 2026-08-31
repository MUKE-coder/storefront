package services

import (
	"fmt"
	"math"

	"gorm.io/gorm"

	"storefront/apps/api/internal/models"
)

// OrderService handles business logic for orders.
type OrderService struct {
	DB *gorm.DB
}

// OrderListParams holds pagination and filter parameters.
type OrderListParams struct {
	Page      int
	PageSize  int
	Search    string
	SortBy    string
	SortOrder string
}

// List returns a paginated list of orders.
func (s *OrderService) List(params OrderListParams) ([]models.Order, int64, int, error) {
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
	sortableOrder := map[string]bool{"id": true, "created_at": true, "updated_at": true, "number": true, "customer_name": true, "customer_email": true, "shipping_address": true, "phone": true, "subtotal": true, "shipping": true, "total": true, "payment_intent": true, "status": true}
	if !sortableOrder[params.SortBy] {
		params.SortBy = "created_at"
	}

	query := s.DB.Model(&models.Order{})

	if params.Search != "" {
		query = query.Where("LOWER(number) LIKE LOWER(?) OR LOWER(customer_name) LIKE LOWER(?) OR LOWER(customer_email) LIKE LOWER(?) OR LOWER(shipping_address) LIKE LOWER(?) OR LOWER(phone) LIKE LOWER(?) OR LOWER(payment_intent) LIKE LOWER(?) OR LOWER(status) LIKE LOWER(?)", "%"+params.Search+"%", "%"+params.Search+"%", "%"+params.Search+"%", "%"+params.Search+"%", "%"+params.Search+"%", "%"+params.Search+"%", "%"+params.Search+"%")
	}

	var total int64
	query.Count(&total)

	var items []models.Order
	offset := (params.Page - 1) * params.PageSize
	if err := query.Order(params.SortBy + " " + params.SortOrder).Offset(offset).Limit(params.PageSize).Find(&items).Error; err != nil {
		return nil, 0, 0, fmt.Errorf("fetching orders: %w", err)
	}

	pages := int(math.Ceil(float64(total) / float64(params.PageSize)))
	return items, total, pages, nil
}

// GetByID returns a single order by ID.
func (s *OrderService) GetByID(id string) (*models.Order, error) {
	var item models.Order
	if err := s.DB.First(&item, "id = ?", id).Error; err != nil {
		return nil, fmt.Errorf("order not found: %w", err)
	}
	return &item, nil
}

// Create creates a new order.
func (s *OrderService) Create(item *models.Order) error {
	if err := s.DB.Create(item).Error; err != nil {
		return fmt.Errorf("creating order: %w", err)
	}
	return nil
}

// Update modifies an existing order. Two queries: First() loads
// the row + verifies existence; Updates() persists the diff. The
// loaded struct is mutated by Updates() so we can return it directly
// without a third refetch.
func (s *OrderService) Update(id string, updates map[string]interface{}) (*models.Order, error) {
	var item models.Order
	if err := s.DB.First(&item, "id = ?", id).Error; err != nil {
		return nil, fmt.Errorf("order not found: %w", err)
	}

	if err := s.DB.Model(&item).Updates(updates).Error; err != nil {
		return nil, fmt.Errorf("updating order: %w", err)
	}

	return &item, nil
}

// Delete soft-deletes a order. One query — we don't need to load
// the row first; GORM's Delete is atomic and rows-affected tells us
// whether it existed.
func (s *OrderService) Delete(id string) error {
	res := s.DB.Where("id = ?", id).Delete(&models.Order{})
	if res.Error != nil {
		return fmt.Errorf("deleting order: %w", res.Error)
	}
	if res.RowsAffected == 0 {
		return fmt.Errorf("order not found")
	}
	return nil
}
