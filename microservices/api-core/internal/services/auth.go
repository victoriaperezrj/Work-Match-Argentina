package services

import (
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/workmatch/api-core/internal/models"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	db        *sql.DB
	jwtSecret []byte
}

func NewAuthService(db *sql.DB, jwtSecret string) *AuthService {
	return &AuthService{
		db:        db,
		jwtSecret: []byte(jwtSecret),
	}
}

func (s *AuthService) Register(req models.RegisterRequest) (*models.User, error) {
	// Validate role
	if req.Role != "Demandante" && req.Role != "Proveedor" {
		return nil, errors.New("invalid role: must be 'Demandante' or 'Proveedor'")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("error hashing password: %w", err)
	}

	// Insert user
	var user models.User
	err = s.db.QueryRow(`
		INSERT INTO users (email, password_hash, role, is_verified)
		VALUES ($1, $2, $3, $4)
		RETURNING id, email, role, is_verified, created_at
	`, req.Email, string(hashedPassword), req.Role, false).Scan(
		&user.ID, &user.Email, &user.Role, &user.IsVerified, &user.CreatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("error creating user: %w", err)
	}

	// If user is a provider, create provider profile
	if req.Role == "Proveedor" {
		_, err = s.db.Exec(`
			INSERT INTO provider_profiles (user_id, services, radius_km, rating)
			VALUES ($1, $2, $3, $4)
		`, user.ID, "{}", 10, 0.0)

		if err != nil {
			return nil, fmt.Errorf("error creating provider profile: %w", err)
		}
	}

	return &user, nil
}

func (s *AuthService) Login(req models.LoginRequest) (*models.User, string, error) {
	var user models.User
	var passwordHash string

	err := s.db.QueryRow(`
		SELECT id, email, password_hash, role, is_verified, created_at
		FROM users
		WHERE email = $1
	`, req.Email).Scan(
		&user.ID, &user.Email, &passwordHash, &user.Role, &user.IsVerified, &user.CreatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, "", errors.New("invalid credentials")
		}
		return nil, "", fmt.Errorf("error querying user: %w", err)
	}

	// Verify password
	err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password))
	if err != nil {
		return nil, "", errors.New("invalid credentials")
	}

	// Generate JWT token
	token, err := s.generateToken(user.ID, user.Email, user.Role)
	if err != nil {
		return nil, "", fmt.Errorf("error generating token: %w", err)
	}

	return &user, token, nil
}

func (s *AuthService) generateToken(userID int, email, role string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"email":   email,
		"role":    role,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.jwtSecret)
}

func (s *AuthService) ValidateToken(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return s.jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}
