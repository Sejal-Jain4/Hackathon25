from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Centsi API",
    description="API for Centsi - AI Finance Coach for Students",
    version="0.1.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routers
from app.routers import auth, users, goals, budgets, transactions, insights, ai_coach

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(goals.router)
app.include_router(budgets.router)
app.include_router(transactions.router)
app.include_router(insights.router)
app.include_router(ai_coach.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Centsi API - Your AI Finance Coach"}