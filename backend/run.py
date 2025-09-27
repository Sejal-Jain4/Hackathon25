import uvicorn
from app.database.database import Base, engine
from app.models.models import User, Goal, Budget, Transaction

# Create tables in the database
Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)