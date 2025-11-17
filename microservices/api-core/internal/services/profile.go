package services

import (
	"database/sql"
	"fmt"

	"github.com/lib/pq"
	"github.com/workmatch/api-core/internal/models"
)

type ProfileService struct {
	db *sql.DB
}

func NewProfileService(db *sql.DB) *ProfileService {
	return &ProfileService{db: db}
}

func (s *ProfileService) GetUserProfile(userID int) (*models.User, error) {
	var user models.User

	err := s.db.QueryRow(`
		SELECT id, email, role, is_verified, created_at
		FROM users
		WHERE id = $1
	`, userID).Scan(
		&user.ID, &user.Email, &user.Role, &user.IsVerified, &user.CreatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("error querying user: %w", err)
	}

	return &user, nil
}

func (s *ProfileService) GetProviderProfile(userID int) (*models.ProviderProfile, error) {
	var profile models.ProviderProfile
	var services pq.StringArray

	err := s.db.QueryRow(`
		SELECT id, user_id, services, radius_km, lat, lon, rating, created_at, updated_at
		FROM provider_profiles
		WHERE user_id = $1
	`, userID).Scan(
		&profile.ID,
		&profile.UserID,
		&services,
		&profile.RadiusKM,
		&profile.Lat,
		&profile.Lon,
		&profile.Rating,
		&profile.CreatedAt,
		&profile.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("provider profile not found")
		}
		return nil, fmt.Errorf("error querying provider profile: %w", err)
	}

	profile.Services = services

	return &profile, nil
}

func (s *ProfileService) UpdateProviderProfile(userID int, req models.UpdateProviderProfileRequest) (*models.ProviderProfile, error) {
	// Verify user is a provider
	var role string
	err := s.db.QueryRow("SELECT role FROM users WHERE id = $1", userID).Scan(&role)
	if err != nil {
		return nil, fmt.Errorf("error querying user: %w", err)
	}

	if role != "Proveedor" {
		return nil, fmt.Errorf("user is not a provider")
	}

	// Update provider profile
	_, err = s.db.Exec(`
		UPDATE provider_profiles
		SET services = $1, radius_km = $2, lat = $3, lon = $4, updated_at = CURRENT_TIMESTAMP
		WHERE user_id = $5
	`, pq.Array(req.Services), req.RadiusKM, req.Lat, req.Lon, userID)

	if err != nil {
		return nil, fmt.Errorf("error updating provider profile: %w", err)
	}

	// Return updated profile
	return s.GetProviderProfile(userID)
}
