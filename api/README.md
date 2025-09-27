Centsi demo API (FastAPI)

Setup

# create virtualenv (recommended) then install
pip install -r requirements.txt

Run

uvicorn app:app --reload --port 8000 --host 0.0.0.0

The web frontend expects the API to be available at /api. For local development, you can run the frontend dev server and proxy requests (or configure a reverse proxy).