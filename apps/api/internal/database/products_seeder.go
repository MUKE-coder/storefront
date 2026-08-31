package database

import (
	"fmt"
	"log"
	"strings"

	"github.com/brianvoe/gofakeit/v7"
	"gorm.io/gorm"
	"storefront/apps/api/internal/files"
	"storefront/apps/api/internal/models"
)

// SeedProducts inserts fake products using gofakeit.
// Change the count (n) or swap the gofakeit calls for your own values.
func SeedProducts(db *gorm.DB) error {
	var count int64
	db.Model(&models.Product{}).Count(&count)
	if count > 0 {
		log.Println("Products already seeded, skipping...")
		return nil
	}

	// Link each row to an existing parent (loaded once).
	var categoryIDs []string
	db.Model(&models.Category{}).Pluck("id", &categoryIDs)
	if len(categoryIDs) == 0 {
		return fmt.Errorf("cannot seed product: no category rows exist yet. Seed Category first (generate it with --faker, or add rows in the admin), then run grit seed again")
	}

	const n = 40
	for i := 0; i < n; i++ {
		r := models.Product{
			Name:           gofakeit.Name(),
			Sku:            strings.ToUpper("SKU-" + gofakeit.LetterN(4) + gofakeit.DigitN(4)),
			Description:    gofakeit.Sentence(12),
			Price:          gofakeit.Price(1, 1000),
			CompareAtPrice: gofakeit.Price(1, 1000),
			Stock:          gofakeit.Number(1, 100),
			Images:         files.FileRefs{{URL: "https://picsum.photos/seed/" + gofakeit.UUID() + "/600/400", Name: "sample.jpg", MIME: "image/jpeg"}},
			CategoryID:     pickID(categoryIDs),
			Active:         gofakeit.Bool(),
		}
		if err := db.Create(&r).Error; err != nil {
			log.Printf("Warning: failed to seed product: %v", err)
		}
	}
	log.Printf("Seeded %d product", n)
	return nil
}
