package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/golang-jwt/jwt/v5"
	"github.com/workmatch/api-core/internal/middleware"
	"github.com/workmatch/api-core/internal/models"
	"github.com/workmatch/api-core/internal/services"
)

type ProfileHandler struct {
	profileService *services.ProfileService
}

func NewProfileHandler(profileService *services.ProfileService) *ProfileHandler {
	return &ProfileHandler{profileService: profileService}
}

func (h *ProfileHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(middleware.UserContextKey).(jwt.MapClaims)
	userID := int(claims["user_id"].(float64))

	user, err := h.profileService.GetUserProfile(userID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, err.Error())
		return
	}

	// If user is a provider, also get provider profile
	if user.Role == "Proveedor" {
		providerProfile, err := h.profileService.GetProviderProfile(userID)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, err.Error())
			return
		}

		response := map[string]interface{}{
			"user":    user,
			"profile": providerProfile,
		}
		respondWithJSON(w, http.StatusOK, response)
		return
	}

	respondWithJSON(w, http.StatusOK, map[string]interface{}{"user": user})
}

func (h *ProfileHandler) UpdateProviderProfile(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(middleware.UserContextKey).(jwt.MapClaims)
	userID := int(claims["user_id"].(float64))

	var req models.UpdateProviderProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	profile, err := h.profileService.UpdateProviderProfile(userID, req)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, profile)
}
