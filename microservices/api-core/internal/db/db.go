package db

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"
)

type DB struct {
	*sql.DB
}

func New(databaseURL string) (*DB, error) {
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return nil, fmt.Errorf("error opening database: %w", err)
	}

	// Set connection pool settings
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Test the connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err = db.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("error pinging database: %w", err)
	}

	log.Println("Successfully connected to database")

	return &DB{db}, nil
}

func (db *DB) Migrate() error {
	queries := []string{
		`CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			email VARCHAR(255) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			role VARCHAR(50) NOT NULL CHECK (role IN ('Demandante', 'Proveedor')),
			is_verified BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		`CREATE TABLE IF NOT EXISTS provider_profiles (
			id SERIAL PRIMARY KEY,
			user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			services TEXT[] NOT NULL DEFAULT '{}',
			radius_km INTEGER DEFAULT 10,
			lat DECIMAL(10, 8),
			lon DECIMAL(11, 8),
			rating DECIMAL(3, 2) DEFAULT 0.0,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		`CREATE TABLE IF NOT EXISTS service_requests (
			id SERIAL PRIMARY KEY,
			demandante_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			provider_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
			description TEXT NOT NULL,
			service_type VARCHAR(100) NOT NULL,
			lat DECIMAL(10, 8) NOT NULL,
			lon DECIMAL(11, 8) NOT NULL,
			status VARCHAR(50) NOT NULL DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'Asignado', 'Completado', 'Cancelado')),
			price_quoted DECIMAL(10, 2),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		`CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status)`,
		`CREATE INDEX IF NOT EXISTS idx_service_requests_demandante ON service_requests(demandante_id)`,
		`CREATE INDEX IF NOT EXISTS idx_service_requests_provider ON service_requests(provider_id)`,
		`CREATE INDEX IF NOT EXISTS idx_provider_profiles_location ON provider_profiles(lat, lon)`,
	}

	for _, query := range queries {
		if _, err := db.Exec(query); err != nil {
			return fmt.Errorf("migration error: %w", err)
		}
	}

	log.Println("Database migration completed successfully")
	return nil
}
