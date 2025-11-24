package services

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"time"

	"github.com/lib/pq"
	"github.com/workmatch/api-core/internal/models"
)

type RequestService struct {
	db           *sql.DB
	aiServiceURL string
}

func NewRequestService(db *sql.DB, aiServiceURL string) *RequestService {
	return &RequestService{
		db:           db,
		aiServiceURL: aiServiceURL,
	}
}

type PricePredictionRequest struct {
	ServiceType string  `json:"service_type"`
	Description string  `json:"description"`
	Lat         float64 `json:"lat"`
	Lon         float64 `json:"lon"`
}

type PricePredictionResponse struct {
	PriceQuoted float64 `json:"price_quoted"`
}

func (s *RequestService) CreateRequest(demandanteID int, req models.CreateServiceRequestRequest) (*models.ServiceRequestResponse, error) {
	// Verify user is a demandante
	var role string
	err := s.db.QueryRow("SELECT role FROM users WHERE id = $1", demandanteID).Scan(&role)
	if err != nil {
		return nil, fmt.Errorf("error querying user: %w", err)
	}

	if role != "Demandante" {
		return nil, fmt.Errorf("user is not a demandante")
	}

	// Get price prediction from AI service
	priceQuoted, err := s.getPricePrediction(req)
	if err != nil {
		// Log error but continue with null price
		fmt.Printf("Warning: failed to get price prediction: %v\n", err)
		priceQuoted = 0
	}

	// Insert service request
	var serviceRequest models.ServiceRequest
	err = s.db.QueryRow(`
		INSERT INTO service_requests (demandante_id, description, service_type, lat, lon, status, price_quoted)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, demandante_id, provider_id, description, service_type, lat, lon, status, price_quoted, created_at, updated_at
	`, demandanteID, req.Description, req.ServiceType, req.Lat, req.Lon, "Pendiente", priceQuoted).Scan(
		&serviceRequest.ID,
		&serviceRequest.DemandanteID,
		&serviceRequest.ProviderID,
		&serviceRequest.Description,
		&serviceRequest.ServiceType,
		&serviceRequest.Lat,
		&serviceRequest.Lon,
		&serviceRequest.Status,
		&serviceRequest.PriceQuoted,
		&serviceRequest.CreatedAt,
		&serviceRequest.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("error creating service request: %w", err)
	}

	response := serviceRequest.ToResponse()
	return &response, nil
}

func (s *RequestService) getPricePrediction(req models.CreateServiceRequestRequest) (float64, error) {
	predReq := PricePredictionRequest{
		ServiceType: req.ServiceType,
		Description: req.Description,
		Lat:         req.Lat,
		Lon:         req.Lon,
	}

	jsonData, err := json.Marshal(predReq)
	if err != nil {
		return 0, err
	}

	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Post(
		fmt.Sprintf("%s/api/v1/predict_price", s.aiServiceURL),
		"application/json",
		bytes.NewBuffer(jsonData),
	)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return 0, fmt.Errorf("AI service returned status: %d", resp.StatusCode)
	}

	var predResp PricePredictionResponse
	if err := json.NewDecoder(resp.Body).Decode(&predResp); err != nil {
		return 0, err
	}

	return predResp.PriceQuoted, nil
}

func (s *RequestService) GetPendingRequests(providerID int) ([]models.ServiceRequestResponse, error) {
	// Get provider profile
	var services pq.StringArray
	var radiusKM int
	var providerLat, providerLon float64

	err := s.db.QueryRow(`
		SELECT services, radius_km, lat, lon
		FROM provider_profiles
		WHERE user_id = $1
	`, providerID).Scan(&services, &radiusKM, &providerLat, &providerLon)

	if err != nil {
		return nil, fmt.Errorf("error querying provider profile: %w", err)
	}

	// Get all pending requests
	rows, err := s.db.Query(`
		SELECT id, demandante_id, provider_id, description, service_type, lat, lon, status, price_quoted, created_at, updated_at
		FROM service_requests
		WHERE status = 'Pendiente'
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, fmt.Errorf("error querying pending requests: %w", err)
	}
	defer rows.Close()

	var results []models.ServiceRequestResponse

	for rows.Next() {
		var sr models.ServiceRequest
		err := rows.Scan(
			&sr.ID,
			&sr.DemandanteID,
			&sr.ProviderID,
			&sr.Description,
			&sr.ServiceType,
			&sr.Lat,
			&sr.Lon,
			&sr.Status,
			&sr.PriceQuoted,
			&sr.CreatedAt,
			&sr.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning service request: %w", err)
		}

		// Check if request matches provider's services
		matchesService := false
		for _, service := range services {
			if service == sr.ServiceType {
				matchesService = true
				break
			}
		}

		if !matchesService {
			continue
		}

		// Check if request is within provider's radius
		distance := calculateDistance(providerLat, providerLon, sr.Lat, sr.Lon)
		if distance > float64(radiusKM) {
			continue
		}

		results = append(results, sr.ToResponse())
	}

	return results, nil
}

func (s *RequestService) AcceptRequest(requestID, providerID int) (*models.ServiceRequestResponse, error) {
	// Verify provider role
	var role string
	err := s.db.QueryRow("SELECT role FROM users WHERE id = $1", providerID).Scan(&role)
	if err != nil {
		return nil, fmt.Errorf("error querying user: %w", err)
	}

	if role != "Proveedor" {
		return nil, fmt.Errorf("user is not a provider")
	}

	// Update service request
	var sr models.ServiceRequest
	err = s.db.QueryRow(`
		UPDATE service_requests
		SET provider_id = $1, status = 'Asignado', updated_at = CURRENT_TIMESTAMP
		WHERE id = $2 AND status = 'Pendiente'
		RETURNING id, demandante_id, provider_id, description, service_type, lat, lon, status, price_quoted, created_at, updated_at
	`, providerID, requestID).Scan(
		&sr.ID,
		&sr.DemandanteID,
		&sr.ProviderID,
		&sr.Description,
		&sr.ServiceType,
		&sr.Lat,
		&sr.Lon,
		&sr.Status,
		&sr.PriceQuoted,
		&sr.CreatedAt,
		&sr.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("request not found or already assigned")
		}
		return nil, fmt.Errorf("error accepting request: %w", err)
	}

	response := sr.ToResponse()
	return &response, nil
}

func (s *RequestService) CompleteRequest(requestID, userID int) (*models.ServiceRequestResponse, error) {
	// Update service request (can be completed by either demandante or provider)
	var sr models.ServiceRequest
	err := s.db.QueryRow(`
		UPDATE service_requests
		SET status = 'Completado', updated_at = CURRENT_TIMESTAMP
		WHERE id = $1 AND (demandante_id = $2 OR provider_id = $2) AND status = 'Asignado'
		RETURNING id, demandante_id, provider_id, description, service_type, lat, lon, status, price_quoted, created_at, updated_at
	`, requestID, userID).Scan(
		&sr.ID,
		&sr.DemandanteID,
		&sr.ProviderID,
		&sr.Description,
		&sr.ServiceType,
		&sr.Lat,
		&sr.Lon,
		&sr.Status,
		&sr.PriceQuoted,
		&sr.CreatedAt,
		&sr.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("request not found or not assigned")
		}
		return nil, fmt.Errorf("error completing request: %w", err)
	}

	response := sr.ToResponse()
	return &response, nil
}

func (s *RequestService) GetUserRequests(userID int) ([]models.ServiceRequestResponse, error) {
	rows, err := s.db.Query(`
		SELECT id, demandante_id, provider_id, description, service_type, lat, lon, status, price_quoted, created_at, updated_at
		FROM service_requests
		WHERE demandante_id = $1 OR provider_id = $1
		ORDER BY created_at DESC
	`, userID)
	if err != nil {
		return nil, fmt.Errorf("error querying user requests: %w", err)
	}
	defer rows.Close()

	var results []models.ServiceRequestResponse

	for rows.Next() {
		var sr models.ServiceRequest
		err := rows.Scan(
			&sr.ID,
			&sr.DemandanteID,
			&sr.ProviderID,
			&sr.Description,
			&sr.ServiceType,
			&sr.Lat,
			&sr.Lon,
			&sr.Status,
			&sr.PriceQuoted,
			&sr.CreatedAt,
			&sr.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning service request: %w", err)
		}

		results = append(results, sr.ToResponse())
	}

	return results, nil
}

func (s *RequestService) SearchRequests(params models.SearchRequestsParams) ([]models.ServiceRequestResponse, error) {
	query := `
		SELECT id, demandante_id, provider_id, description, service_type, lat, lon, status, price_quoted, created_at, updated_at
		FROM service_requests
		WHERE 1=1
	`
	args := []interface{}{}
	argCount := 0

	// Build dynamic WHERE clause
	if params.ServiceType != nil {
		argCount++
		query += fmt.Sprintf(" AND service_type = $%d", argCount)
		args = append(args, *params.ServiceType)
	}

	if params.Status != nil {
		argCount++
		query += fmt.Sprintf(" AND status = $%d", argCount)
		args = append(args, *params.Status)
	}

	if params.MinPrice != nil {
		argCount++
		query += fmt.Sprintf(" AND price_quoted >= $%d", argCount)
		args = append(args, *params.MinPrice)
	}

	if params.MaxPrice != nil {
		argCount++
		query += fmt.Sprintf(" AND price_quoted <= $%d", argCount)
		args = append(args, *params.MaxPrice)
	}

	// Add sorting
	sortBy := "created_at"
	if params.SortBy != nil {
		switch *params.SortBy {
		case "created_at", "price":
			sortBy = *params.SortBy
		case "price_quoted":
			sortBy = "price_quoted"
		}
	}

	sortOrder := "DESC"
	if params.SortOrder != nil && *params.SortOrder == "asc" {
		sortOrder = "ASC"
	}

	query += fmt.Sprintf(" ORDER BY %s %s", sortBy, sortOrder)

	// Add pagination
	limit := 50
	if params.Limit != nil && *params.Limit > 0 && *params.Limit <= 100 {
		limit = *params.Limit
	}
	argCount++
	query += fmt.Sprintf(" LIMIT $%d", argCount)
	args = append(args, limit)

	if params.Offset != nil && *params.Offset > 0 {
		argCount++
		query += fmt.Sprintf(" OFFSET $%d", argCount)
		args = append(args, *params.Offset)
	}

	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("error searching requests: %w", err)
	}
	defer rows.Close()

	var results []models.ServiceRequestResponse

	for rows.Next() {
		var sr models.ServiceRequest
		err := rows.Scan(
			&sr.ID,
			&sr.DemandanteID,
			&sr.ProviderID,
			&sr.Description,
			&sr.ServiceType,
			&sr.Lat,
			&sr.Lon,
			&sr.Status,
			&sr.PriceQuoted,
			&sr.CreatedAt,
			&sr.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning service request: %w", err)
		}

		// If location filter is provided, check distance
		if params.Lat != nil && params.Lon != nil && params.RadiusKM != nil {
			distance := calculateDistance(*params.Lat, *params.Lon, sr.Lat, sr.Lon)
			if distance > float64(*params.RadiusKM) {
				continue
			}
		}

		results = append(results, sr.ToResponse())
	}

	return results, nil
}

// calculateDistance calculates the distance between two coordinates in kilometers
// using the Haversine formula
func calculateDistance(lat1, lon1, lat2, lon2 float64) float64 {
	const R = 6371 // Earth's radius in kilometers

	dLat := (lat2 - lat1) * math.Pi / 180
	dLon := (lon2 - lon1) * math.Pi / 180

	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Cos(lat1*math.Pi/180)*math.Cos(lat2*math.Pi/180)*
			math.Sin(dLon/2)*math.Sin(dLon/2)

	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	return R * c
}
