package services

import (
	"database/sql"
	"fmt"

	"github.com/workmatch/api-core/internal/models"
)

type ReportService struct {
	db *sql.DB
}

func NewReportService(db *sql.DB) *ReportService {
	return &ReportService{db: db}
}

func (s *ReportService) CreateReport(reporterID int, req models.CreateReportRequest) (*models.ReportResponse, error) {
	// Validate reason
	validReasons := map[string]bool{
		"spam":          true,
		"inappropriate": true,
		"fraud":         true,
		"harassment":    true,
		"other":         true,
	}

	if !validReasons[req.Reason] {
		return nil, fmt.Errorf("invalid reason")
	}

	// Prevent self-reporting
	if reporterID == req.ReportedID {
		return nil, fmt.Errorf("cannot report yourself")
	}

	// Verify reported user exists
	var exists bool
	err := s.db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)", req.ReportedID).Scan(&exists)
	if err != nil || !exists {
		return nil, fmt.Errorf("reported user not found")
	}

	// Insert report
	var report models.Report
	query := `
		INSERT INTO reports (reporter_id, reported_id, request_id, reason, description, status)
		VALUES ($1, $2, $3, $4, $5, 'pending')
		RETURNING id, reporter_id, reported_id, request_id, reason, description, status, created_at, updated_at
	`

	err = s.db.QueryRow(query, reporterID, req.ReportedID, req.RequestID, req.Reason, req.Description).Scan(
		&report.ID,
		&report.ReporterID,
		&report.ReportedID,
		&report.RequestID,
		&report.Reason,
		&report.Description,
		&report.Status,
		&report.CreatedAt,
		&report.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("error creating report: %w", err)
	}

	response := report.ToResponse()
	return &response, nil
}

func (s *ReportService) GetUserReports(userID int, asReporter bool) ([]models.ReportResponse, error) {
	var query string
	if asReporter {
		query = `
			SELECT id, reporter_id, reported_id, request_id, reason, description, status, created_at, updated_at
			FROM reports
			WHERE reporter_id = $1
			ORDER BY created_at DESC
		`
	} else {
		query = `
			SELECT id, reporter_id, reported_id, request_id, reason, description, status, created_at, updated_at
			FROM reports
			WHERE reported_id = $1
			ORDER BY created_at DESC
		`
	}

	rows, err := s.db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("error querying reports: %w", err)
	}
	defer rows.Close()

	var results []models.ReportResponse

	for rows.Next() {
		var report models.Report
		err := rows.Scan(
			&report.ID,
			&report.ReporterID,
			&report.ReportedID,
			&report.RequestID,
			&report.Reason,
			&report.Description,
			&report.Status,
			&report.CreatedAt,
			&report.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning report: %w", err)
		}

		results = append(results, report.ToResponse())
	}

	return results, nil
}

func (s *ReportService) GetReportByID(reportID int) (*models.ReportResponse, error) {
	var report models.Report
	query := `
		SELECT id, reporter_id, reported_id, request_id, reason, description, status, created_at, updated_at
		FROM reports
		WHERE id = $1
	`

	err := s.db.QueryRow(query, reportID).Scan(
		&report.ID,
		&report.ReporterID,
		&report.ReportedID,
		&report.RequestID,
		&report.Reason,
		&report.Description,
		&report.Status,
		&report.CreatedAt,
		&report.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("report not found")
		}
		return nil, fmt.Errorf("error querying report: %w", err)
	}

	response := report.ToResponse()
	return &response, nil
}
