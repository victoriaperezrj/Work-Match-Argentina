package services

import (
	"database/sql"
	"errors"

	"github.com/workmatch/api-core/internal/models"
)

type RatingService struct {
	db *sql.DB
}

func NewRatingService(db *sql.DB) *RatingService {
	return &RatingService{db: db}
}

func (s *RatingService) CreateRating(fromUserID int, req models.CreateRatingRequest) (*models.Rating, error) {
	// Validate score
	if req.Score < 1 || req.Score > 5 {
		return nil, errors.New("score must be between 1 and 5")
	}

	// Get the request to find the other user
	var requestID, demandanteID int
	var providerID sql.NullInt64
	var status string
	err := s.db.QueryRow(`
		SELECT id, demandante_id, provider_id, status
		FROM service_requests
		WHERE id = $1
	`, req.RequestID).Scan(&requestID, &demandanteID, &providerID, &status)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("request not found")
		}
		return nil, err
	}

	// Only completed requests can be rated
	if status != "Completado" {
		return nil, errors.New("only completed requests can be rated")
	}

	// Determine who is being rated
	var toUserID int
	if fromUserID == demandanteID {
		// Demandante is rating the provider
		if !providerID.Valid {
			return nil, errors.New("no provider assigned to this request")
		}
		toUserID = int(providerID.Int64)
	} else if providerID.Valid && fromUserID == int(providerID.Int64) {
		// Provider is rating the demandante
		toUserID = demandanteID
	} else {
		return nil, errors.New("you are not part of this request")
	}

	// Check if already rated
	var existingID int
	err = s.db.QueryRow(`
		SELECT id FROM ratings
		WHERE request_id = $1 AND from_user_id = $2
	`, req.RequestID, fromUserID).Scan(&existingID)

	if err == nil {
		return nil, errors.New("you have already rated this request")
	} else if err != sql.ErrNoRows {
		return nil, err
	}

	// Create the rating
	rating := &models.Rating{}
	err = s.db.QueryRow(`
		INSERT INTO ratings (request_id, from_user_id, to_user_id, score, comment)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, request_id, from_user_id, to_user_id, score, comment, created_at
	`, req.RequestID, fromUserID, toUserID, req.Score, req.Comment).Scan(
		&rating.ID, &rating.RequestID, &rating.FromUserID,
		&rating.ToUserID, &rating.Score, &rating.Comment, &rating.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	// Update provider's average rating if the rating is for a provider
	go s.updateProviderRating(toUserID)

	return rating, nil
}

func (s *RatingService) GetUserRatings(userID int) ([]models.Rating, error) {
	rows, err := s.db.Query(`
		SELECT id, request_id, from_user_id, to_user_id, score, comment, created_at
		FROM ratings
		WHERE to_user_id = $1
		ORDER BY created_at DESC
	`, userID)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ratings []models.Rating
	for rows.Next() {
		var r models.Rating
		if err := rows.Scan(&r.ID, &r.RequestID, &r.FromUserID, &r.ToUserID, &r.Score, &r.Comment, &r.CreatedAt); err != nil {
			return nil, err
		}
		ratings = append(ratings, r)
	}

	return ratings, nil
}

func (s *RatingService) GetUserRatingSummary(userID int) (*models.RatingSummary, error) {
	summary := &models.RatingSummary{
		Distribution: make(map[int]int),
	}

	// Get average and count
	err := s.db.QueryRow(`
		SELECT COALESCE(AVG(score), 0), COUNT(*)
		FROM ratings
		WHERE to_user_id = $1
	`, userID).Scan(&summary.AverageScore, &summary.TotalRatings)

	if err != nil {
		return nil, err
	}

	// Get distribution
	rows, err := s.db.Query(`
		SELECT score, COUNT(*)
		FROM ratings
		WHERE to_user_id = $1
		GROUP BY score
		ORDER BY score
	`, userID)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var score, count int
		if err := rows.Scan(&score, &count); err != nil {
			return nil, err
		}
		summary.Distribution[score] = count
	}

	return summary, nil
}

func (s *RatingService) updateProviderRating(userID int) {
	// Update the provider_profiles table with the new average rating
	_, err := s.db.Exec(`
		UPDATE provider_profiles
		SET rating = (
			SELECT COALESCE(AVG(score), 0)
			FROM ratings
			WHERE to_user_id = $1
		)
		WHERE user_id = $1
	`, userID)

	if err != nil {
		// Log the error but don't fail
		// In production, use proper logging
	}
}
