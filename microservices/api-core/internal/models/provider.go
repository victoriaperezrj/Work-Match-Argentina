package models

import "time"

type ProviderProfile struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	Services  []string  `json:"services"`
	RadiusKM  int       `json:"radius_km"`
	Lat       float64   `json:"lat"`
	Lon       float64   `json:"lon"`
	Rating    float64   `json:"rating"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type UpdateProviderProfileRequest struct {
	Services []string `json:"services"`
	RadiusKM int      `json:"radius_km"`
	Lat      float64  `json:"lat"`
	Lon      float64  `json:"lon"`
}
