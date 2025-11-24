package models

import (
	"database/sql"
	"time"
)

type ServiceRequest struct {
	ID           int            `json:"id"`
	DemandanteID int            `json:"demandante_id"`
	ProviderID   sql.NullInt64  `json:"provider_id"`
	Description  string         `json:"description"`
	ServiceType  string         `json:"service_type"`
	Lat          float64        `json:"lat"`
	Lon          float64        `json:"lon"`
	Status       string         `json:"status"` // 'Pendiente', 'Asignado', 'Completado', 'Cancelado'
	PriceQuoted  sql.NullFloat64 `json:"price_quoted"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
}

type CreateServiceRequestRequest struct {
	Description string  `json:"description"`
	ServiceType string  `json:"service_type"`
	Lat         float64 `json:"lat"`
	Lon         float64 `json:"lon"`
}

type SearchRequestsParams struct {
	ServiceType  *string  `json:"service_type,omitempty"`
	Status       *string  `json:"status,omitempty"`
	MinPrice     *float64 `json:"min_price,omitempty"`
	MaxPrice     *float64 `json:"max_price,omitempty"`
	Lat          *float64 `json:"lat,omitempty"`
	Lon          *float64 `json:"lon,omitempty"`
	RadiusKM     *int     `json:"radius_km,omitempty"`
	SortBy       *string  `json:"sort_by,omitempty"` // created_at, price, distance
	SortOrder    *string  `json:"sort_order,omitempty"` // asc, desc
	Limit        *int     `json:"limit,omitempty"`
	Offset       *int     `json:"offset,omitempty"`
}

type ServiceRequestResponse struct {
	ID           int       `json:"id"`
	DemandanteID int       `json:"demandante_id"`
	ProviderID   *int      `json:"provider_id"`
	Description  string    `json:"description"`
	ServiceType  string    `json:"service_type"`
	Lat          float64   `json:"lat"`
	Lon          float64   `json:"lon"`
	Status       string    `json:"status"`
	PriceQuoted  *float64  `json:"price_quoted"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

func (sr *ServiceRequest) ToResponse() ServiceRequestResponse {
	resp := ServiceRequestResponse{
		ID:           sr.ID,
		DemandanteID: sr.DemandanteID,
		Description:  sr.Description,
		ServiceType:  sr.ServiceType,
		Lat:          sr.Lat,
		Lon:          sr.Lon,
		Status:       sr.Status,
		CreatedAt:    sr.CreatedAt,
		UpdatedAt:    sr.UpdatedAt,
	}

	if sr.ProviderID.Valid {
		pid := int(sr.ProviderID.Int64)
		resp.ProviderID = &pid
	}

	if sr.PriceQuoted.Valid {
		resp.PriceQuoted = &sr.PriceQuoted.Float64
	}

	return resp
}
