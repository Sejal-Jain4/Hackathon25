# Centsi - AI Finance Coach for Students

A personal finance management app designed specifically for students, featuring AI-powered financial coaching and personalized insights.

## Features

- **AI Finance Coach**: Get personalized financial advice and insights
- **Budget Tracking**: Create and manage budgets by category
- **Goal Setting**: Set and track financial goals with visual progress indicators
- **Spending Analysis**: Visualize spending patterns and trends
- **Gamification**: Earn rewards and achievements for good financial habits

## Project Structure

### Frontend (React Native + Expo)

```
frontend/
├── app.json          # Expo configuration
├── App.tsx           # Main app component
├── tsconfig.json     # TypeScript configuration
├── assets/           # Images, fonts, and other static assets
└── src/
    ├── components/   # Reusable UI components
    ├── constants/    # App constants and configuration
    ├── hooks/        # Custom React hooks
    ├── navigation/   # Navigation structure
    ├── screens/      # App screens
    ├── services/     # API and other services
    ├── types/        # TypeScript type definitions
    └── utils/        # Utility functions
```

### Backend (FastAPI + SQLAlchemy)

```
backend/
└── app/
    ├── database/     # Database configuration
    ├── models/       # Database models
    ├── routers/      # API routes
    └── services/     # Business logic services
```

## Getting Started

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```
   uvicorn app.main:app --reload
   ```

## API Documentation

Once the backend is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Hackathon Notes

This project was initially developed for a 30-hour hackathon. Some features are implemented as MVPs and would need further development for production use.