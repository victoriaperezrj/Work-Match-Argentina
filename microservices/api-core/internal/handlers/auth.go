package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/workmatch/api-core/internal/models"
	"github.com/workmatch/api-core/internal/services"
)

type AuthHandler struct {
	authService *services.AuthService
}

func NewAuthHandler(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req models.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	user, err := h.authService.Register(req)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	// Auto-login after registration
	loginReq := models.LoginRequest{
		Email:    req.Email,
		Password: req.Password,
	}

	_, token, err := h.authService.Login(loginReq)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Registration successful but login failed")
		return
	}

	response := models.AuthResponse{
		Token: token,
		User:  *user,
	}

	respondWithJSON(w, http.StatusCreated, response)
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	user, token, err := h.authService.Login(req)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, err.Error())
		return
	}

	response := models.AuthResponse{
		Token: token,
		User:  *user,
	}

	respondWithJSON(w, http.StatusOK, response)
}

func respondWithError(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, map[string]string{"error": message})
}

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(payload)
}
