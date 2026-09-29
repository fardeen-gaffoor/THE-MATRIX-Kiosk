# Installation & Setup Guide

This guide walks you through deploying the Samvidhan Archive kiosk components.

## Prerequisites
- **Git**
- **Docker Desktop** (for running the database and object storage)
- **Node.js 20+** (for building the frontend)
- **Python 3.10+** (for running the backend locally outside Docker)

---

## 1. Environment Variables

Before starting, create a `.env` file in the root of the `/apps/api` directory.
You will need to define the following keys (do not commit this file to version control):

```env
# /apps/api/.env
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
MINIO_ROOT_USER=
MINIO_ROOT_PASSWORD=
DATABASE_URL=
ANTHROPIC_API_KEY=
OCR_MODE=cpu  # Set to 'gpu' if running on an NVIDIA machine
```

---

## 2. Infrastructure (Docker)

The fastest way to get the Postgres database (with pgvector), Redis, and MinIO storage running is via the included Docker Compose file.

```bash
cd infra
docker compose up -d db redis minio
```
*Note: If you run `docker compose up -d` without specifying services, it will also attempt to build and run the frontend and API containers.*

---

## 3. Backend API (FastAPI)

For local development or if you need to run the Python OCR engine natively to access your GPU:

```bash
cd apps/api

# Create and activate a virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Install OCR dependencies
pip install pytesseract pillow transformers torch

# Start the server
uvicorn main:app --reload --port 8000
```
The API documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 4. Frontend Web/Kiosk (React)

```bash
cd apps/web

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```
The UI will be available at [http://localhost:5173](http://localhost:5173).

To launch the UI in **Kiosk Mode** (which enables fullscreen styles and accessibility bars), simply append `?kiosk=1` to the URL: [http://localhost:5173/?kiosk=1](http://localhost:5173/?kiosk=1).

---

## Common Troubleshooting

**Issue: Tesseract OCR is failing in `cpu` mode.**
*Fix (Windows):* By default, `pytesseract` looks for Tesseract in your system PATH. If you installed it manually, you must add its location to your PATH, or explicitly define it in `apps/api/ocr_engine.py` (e.g., `pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'`).

**Issue: Florence-2 OCR is extremely slow.**
*Fix:* Ensure you have set `OCR_MODE=gpu` in your environment variables AND ensure you installed the CUDA version of PyTorch (`pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118`). Running Florence-2 on a standard CPU will take minutes per page.

**Issue: The AI Assistant says "I could not find relevant information" for everything.**
*Fix:* The backend is currently utilizing a mocked endpoint for the `/api/chat` route in `main.py` which only responds to specific hardcoded queries (like "caste" or "constitution"). You must un-mock this endpoint and connect it to the Anthropic SDK.
