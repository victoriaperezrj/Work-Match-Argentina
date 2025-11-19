package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/workmatch/api-core/internal/models"
	"github.com/workmatch/api-core/internal/services"
)

type RatingHandler struct {
	ratingService *services.RatingService
}

func NewRatingHandler(ratingService *services.RatingService) *RatingHandler {
	return &RatingHandler{ratingService: ratingService}
}

func (h *RatingHandler) CreateRating(w http.ResponseWriter, r *http.Request) {
	// Get user ID from context (set by auth middleware)
	userID, ok := r.Context().Value("userID").(int)
	if !ok {
		http.Error(w, `{"error": "unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req models.CreateRatingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": "invalid request body"}`, http.StatusBadRequest)
		return
	}

	rating, err := h.ratingService.CreateRating(userID, req)
	if err != nil {
		http.Error(w, `{"error": "`+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(rating)
}

func (h *RatingHandler) GetUserRatings(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID, err := strconv.Atoi(vars["userID"])
	if err != nil {
		http.Error(w, `{"error": "invalid user ID"}`, http.StatusBadRequest)
		return
	}

	ratings, err := h.ratingService.GetUserRatings(userID)
	if err != nil {
		http.Error(w, `{"error": "`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	if ratings == nil {
		ratings = []models.Rating{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ratings)
}

func (h *RatingHandler) GetUserRatingSummary(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID, err := strconv.Atoi(vars["userID"])
	if err != nil {
		http.Error(w, `{"error": "invalid user ID"}`, http.StatusBadRequest)
		return
	}

	summary, err := h.ratingService.GetUserRatingSummary(userID)
	if err != nil {
		http.Error(w, `{"error": "`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(summary)
}
