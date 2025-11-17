package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/workmatch/api-core/internal/db"
	"github.com/workmatch/api-core/internal/handlers"
	"github.com/workmatch/api-core/internal/middleware"
	"github.com/workmatch/api-core/internal/services"
)

func main() {
	// Get environment variables
	databaseURL := getEnv("DATABASE_URL", "postgres://workmatch:workmatch123@localhost:5432/workmatch?sslmode=disable")
	jwtSecret := getEnv("JWT_SECRET", "your-secret-key-change-in-production")
	port := getEnv("PORT", "8080")
	aiServiceURL := getEnv("AI_SERVICE_URL", "http://localhost:8081")

	// Initialize database
	database, err := db.New(databaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	// Run migrations
	if err := database.Migrate(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Initialize services
	authService := services.NewAuthService(database.DB, jwtSecret)
	profileService := services.NewProfileService(database.DB)
	requestService := services.NewRequestService(database.DB, aiServiceURL)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	profileHandler := handlers.NewProfileHandler(profileService)
	requestHandler := handlers.NewRequestHandler(requestService)

	// Initialize middleware
	authMiddleware := middleware.NewAuthMiddleware(authService)

	// Setup router
	r := mux.NewRouter()

	// Enable CORS
	r.Use(corsMiddleware)

	// API routes
	api := r.PathPrefix("/api/v1").Subrouter()

	// Auth routes (public)
	api.HandleFunc("/auth/register", authHandler.Register).Methods("POST", "OPTIONS")
	api.HandleFunc("/auth/login", authHandler.Login).Methods("POST", "OPTIONS")

	// Profile routes (protected)
	profileRoutes := api.PathPrefix("/profile").Subrouter()
	profileRoutes.Use(authMiddleware.Authenticate)
	profileRoutes.HandleFunc("/me", profileHandler.GetProfile).Methods("GET", "OPTIONS")
	profileRoutes.HandleFunc("/provider", profileHandler.UpdateProviderProfile).Methods("PUT", "OPTIONS")

	// Request routes (protected)
	requestRoutes := api.PathPrefix("/requests").Subrouter()
	requestRoutes.Use(authMiddleware.Authenticate)
	requestRoutes.HandleFunc("/create", requestHandler.CreateRequest).Methods("POST", "OPTIONS")
	requestRoutes.HandleFunc("/pending", requestHandler.GetPendingRequests).Methods("GET", "OPTIONS")
	requestRoutes.HandleFunc("/my-requests", requestHandler.GetUserRequests).Methods("GET", "OPTIONS")
	requestRoutes.HandleFunc("/{requestID}/accept", requestHandler.AcceptRequest).Methods("POST", "OPTIONS")
	requestRoutes.HandleFunc("/{requestID}/complete", requestHandler.CompleteRequest).Methods("POST", "OPTIONS")

	// Health check
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods("GET")

	// Start server
	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
