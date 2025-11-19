package models

import "time"

type Rating struct {
	ID         int       `json:"id"`
	RequestID  int       `json:"request_id"`
	FromUserID int       `json:"from_user_id"`
	ToUserID   int       `json:"to_user_id"`
	Score      int       `json:"score"`
	Comment    *string   `json:"comment,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
}

type RatingSummary struct {
	AverageScore  float64        `json:"average_score"`
	TotalRatings  int            `json:"total_ratings"`
	Distribution  map[int]int    `json:"distribution"`
}

type CreateRatingRequest struct {
	RequestID int     `json:"request_id"`
	Score     int     `json:"score"`
	Comment   *string `json:"comment,omitempty"`
}
