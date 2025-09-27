Centsi — AI Finance Coach for Students

This workspace contains two folders:

- `web` — Vite + React + TypeScript demo UI (Tailwind-ready)
- `api` — FastAPI demo backend with core endpoints (get_balance, simulate_purchase, create_goal, ai/respond)

Quick start (Windows PowerShell):

# Backend
cd api
python -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python db_init.py
uvicorn app:app --reload --port 8000

# Frontend (new shell)
cd web
npm install
npm run dev

Open http://localhost:5173/ — the frontend calls the API at /api; if you run the backend on port 8000, configure a proxy in Vite or launch the frontend with a small proxy setting.

Proxy note (dev): add this to `web/vite.config.ts` if you run API on port 8000:

// inside defineConfig server: { proxy: { '/api': 'http://localhost:8000' } }

The demo intentionally uses simple local logic instead of Azure services; to wire Azure OpenAI or Azure Speech, follow the comments in the web components and `api/app.py` to add keys and service calls.
