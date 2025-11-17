from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import random
import os

app = FastAPI(title="WorkMatch AI Service", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PricePredictionRequest(BaseModel):
    service_type: str
    description: str
    lat: float
    lon: float

class PricePredictionResponse(BaseModel):
    price_quoted: float

# Base prices for different service types (in Argentine Pesos)
BASE_PRICES = {
    "Plomeria": 5000,
    "Electricidad": 6000,
    "Jardineria": 4000,
    "Limpieza": 3500,
    "Pintura": 7000,
    "Carpinteria": 8000,
    "Herreria": 6500,
    "Albañileria": 9000,
    "Techado": 12000,
    "Mudanza": 10000,
}

@app.post("/api/v1/predict_price", response_model=PricePredictionResponse)
async def predict_price(request: PricePredictionRequest):
    """
    Predicts the price for a service request based on:
    - Service type
    - Description complexity (word count)
    - Location (future: could factor in neighborhood affluence)

    This is a placeholder implementation. In production, this would use
    a machine learning model trained on historical data.
    """
    try:
        # Get base price for service type
        base_price = BASE_PRICES.get(request.service_type, 5000)

        # Adjust price based on description length (complexity indicator)
        word_count = len(request.description.split())
        complexity_multiplier = 1 + (word_count / 100)  # More words = more complex

        # Add some randomness to simulate market variation (±20%)
        market_variation = random.uniform(0.8, 1.2)

        # Calculate final price
        final_price = base_price * complexity_multiplier * market_variation

        # Round to nearest 100 pesos
        final_price = round(final_price / 100) * 100

        return PricePredictionResponse(price_quoted=final_price)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error predicting price: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "ai-service"}

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "WorkMatch AI Service",
        "version": "1.0.0",
        "endpoints": {
            "predict_price": "/api/v1/predict_price",
            "health": "/health"
        }
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8081))
    uvicorn.run(app, host="0.0.0.0", port=port)
