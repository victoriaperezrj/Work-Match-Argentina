package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	"github.com/workmatch/api-core/internal/middleware"
	"github.com/workmatch/api-core/internal/models"
	"github.com/workmatch/api-core/internal/services"
)

type ReportHandler struct {
	reportService *services.ReportService
}

func NewReportHandler(reportService *services.ReportService) *ReportHandler {
	return &ReportHandler{reportService: reportService}
}

func (h *ReportHandler) CreateReport(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(middleware.UserContextKey).(jwt.MapClaims)
	userID := int(claims["user_id"].(float64))

	var req models.CreateReportRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	report, err := h.reportService.CreateReport(userID, req)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	respondWithJSON(w, http.StatusCreated, report)
}

func (h *ReportHandler) GetMyReports(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(middleware.UserContextKey).(jwt.MapClaims)
	userID := int(claims["user_id"].(float64))

	reports, err := h.reportService.GetUserReports(userID, true)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, reports)
}

func (h *ReportHandler) GetReportByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	reportID, err := strconv.Atoi(vars["reportID"])
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid report ID")
		return
	}

	report, err := h.reportService.GetReportByID(reportID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, report)
}
