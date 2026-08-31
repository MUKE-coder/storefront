package database

import (
	"log"

	"github.com/brianvoe/gofakeit/v7"
	"gorm.io/gorm"
	"storefront/apps/api/internal/files"
	"storefront/apps/api/internal/models"
)

// SeedCategories inserts fake categories using gofakeit.
// Change the count (n) or swap the gofakeit calls for your own values.
func SeedCategories(db *gorm.DB) error {
	var count int64
	db.Model(&models.Category{}).Count(&count)
	if count > 0 {
		log.Println("Categories already seeded, skipping...")
		return nil
	}

	const n = 6
	for i := 0; i < n; i++ {
		r := models.Category{
			Name:        gofakeit.Name(),
			Description: gofakeit.Sentence(12),
			Image:       &files.FileRef{URL: "https://picsum.photos/seed/" + gofakeit.UUID() + "/600/400", Name: "sample.jpg", MIME: "image/jpeg"},
			Featured:    gofakeit.Bool(),
		}
		if err := db.Create(&r).Error; err != nil {
			log.Printf("Warning: failed to seed category: %v", err)
		}
	}
	log.Printf("Seeded %d category", n)
	return nil
}
