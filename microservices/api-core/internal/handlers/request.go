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

type RequestHandler struct {
	requestService *services.RequestService
}

func NewRequestHandler(requestService *services.RequestService) *RequestHandler {
	return &RequestHandler{requestService: requestService}
}

func (h *RequestHandler) CreateRequest(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(middleware.UserContextKey).(jwt.MapClaims)
	userID := int(claims["user_id"].(float64))

	var req models.CreateServiceRequestRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	serviceRequest, err := h.requestService.CreateRequest(userID, req)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	respondWithJSON(w, http.StatusCreated, serviceRequest)
}

func (h *RequestHandler) GetPendingRequests(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(middleware.UserContextKey).(jwt.MapClaims)
	userID := int(claims["user_id"].(float64))

	requests, err := h.requestService.GetPendingRequests(userID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, requests)
}

func (h *RequestHandler) AcceptRequest(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(middleware.UserContextKey).(jwt.MapClaims)
	userID := int(claims["user_id"].(float64))

	vars := mux.Vars(r)
	requestID, err := strconv.Atoi(vars["requestID"])
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request ID")
		return
	}

	serviceRequest, err := h.requestService.AcceptRequest(requestID, userID)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, serviceRequest)
}

func (h *RequestHandler) CompleteRequest(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(middleware.UserContextKey).(jwt.MapClaims)
	userID := int(claims["user_id"].(float64))

	vars := mux.Vars(r)
	requestID, err := strconv.Atoi(vars["requestID"])
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request ID")
		return
	}

	serviceRequest, err := h.requestService.CompleteRequest(requestID, userID)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, serviceRequest)
}

func (h *RequestHandler) GetUserRequests(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(middleware.UserContextKey).(jwt.MapClaims)
	userID := int(claims["user_id"].(float64))

	requests, err := h.requestService.GetUserRequests(userID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, requests)
}

func (h *RequestHandler) SearchRequests(w http.ResponseWriter, r *http.Request) {
	var params models.SearchRequestsParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	requests, err := h.requestService.SearchRequests(params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, requests)
}
