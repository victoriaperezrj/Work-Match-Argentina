package models

import (
	"database/sql"
	"time"
)

type Report struct {
	ID          int           `json:"id"`
	ReporterID  int           `json:"reporter_id"`
	ReportedID  int           `json:"reported_id"`
	RequestID   sql.NullInt64 `json:"request_id,omitempty"`
	Reason      string        `json:"reason"` // 'spam', 'inappropriate', 'fraud', 'harassment', 'other'
	Description string        `json:"description"`
	Status      string        `json:"status"` // 'pending', 'reviewed', 'resolved', 'dismissed'
	CreatedAt   time.Time     `json:"created_at"`
	UpdatedAt   time.Time     `json:"updated_at"`
}

type CreateReportRequest struct {
	ReportedID  int    `json:"reported_id"`
	RequestID   *int   `json:"request_id,omitempty"`
	Reason      string `json:"reason"`
	Description string `json:"description"`
}

type ReportResponse struct {
	ID          int       `json:"id"`
	ReporterID  int       `json:"reporter_id"`
	ReportedID  int       `json:"reported_id"`
	RequestID   *int      `json:"request_id,omitempty"`
	Reason      string    `json:"reason"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (r *Report) ToResponse() ReportResponse {
	resp := ReportResponse{
		ID:          r.ID,
		ReporterID:  r.ReporterID,
		ReportedID:  r.ReportedID,
		Reason:      r.Reason,
		Description: r.Description,
		Status:      r.Status,
		CreatedAt:   r.CreatedAt,
		UpdatedAt:   r.UpdatedAt,
	}

	if r.RequestID.Valid {
		rid := int(r.RequestID.Int64)
		resp.RequestID = &rid
	}

	return resp
}
