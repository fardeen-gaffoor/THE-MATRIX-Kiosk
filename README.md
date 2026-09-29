# Samvidhan Archive — Ambedkar Digital Heritage

The Ambedkar Digital Heritage platform is an open-source, interactive digital archive preserving and narrating the life, work, and constitutional legacy of Dr. B. R. Ambedkar. It is designed to run both as an immersive local museum kiosk and a globally accessible web archive.

## Architecture

This is a monolithic repository utilizing a modern React/Python stack.

- **Frontend**: React (Vite), Tailwind v4, Zustand/Context, React Router.
- **Backend**: FastAPI (Python), providing REST APIs and background task workers.
- **Database**: PostgreSQL with `pgvector` for semantic search and graph-based relationships.
- **Storage**: MinIO (S3-compatible) for raw asset storage (PDFs, images, audio, video).
- **AI/ML**: Integrated with Anthropic (RAG & Summary) and OpenAI Whisper (transcription).

## Setup & Local Development

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose

### 1. Environment Variables
Copy `.env.example` to `.env` in the root and fill in the necessary keys (e.g. Anthropic/OpenAI API keys). Never commit this file.

### 2. Infrastructure (PostgreSQL & MinIO)
Run the backing services using Docker Compose:
```bash
docker-compose -f infra/docker-compose.yml up -d
```

### 3. Backend (FastAPI)
```bash
cd apps/api
python -m venv venv
# Activate venv
pip install -r requirements.txt
uvicorn main:app --reload
```

### 4. Frontend (React)
```bash
cd apps/web
npm install
npm run dev
```
The site will be available at `http://localhost:5173`.

## Kiosk Deployment

The platform includes a dedicated hardware kiosk mode that disables browser features and implements a robust idle reset loop.

1. Ensure the app is running on the host machine.
2. Execute the kiosk launch script:
```bash
.\infra\launch-kiosk.bat
```
This script launches Chromium in native `--kiosk` mode, disables pinch-to-zoom and translation popups, and includes a watchdog loop that automatically restarts the browser if a crash occurs.

## Adding Content & Supported Languages

**Adding Content**: 
Content can be added via the Super Admin / Archivist dashboard at `http://localhost:5173/admin`. You can upload PDFs or images which will be automatically queued for OCR transcription and vectorized for the RAG assistant.

**Adding Languages**:
The application relies on `react-i18next`. To add a new language (e.g., Tamil):
1. Create a new locale JSON file in `apps/web/src/locales/ta.json`.
2. Register the language in `apps/web/src/i18n.ts`.
3. Add the language toggle to the `App.tsx` global header.

## Backup and Restore

Scripts for routine maintenance are located in the `/infra` directory:
- `backup.sh`: Dumps the PostgreSQL database and mirrors the MinIO bucket, encrypting the output with GPG.
- `restore.sh`: Decrypts and restores the database and blob storage.
- `integrity-check.py`: Recomputes SHA-256 hashes of the blob store to verify against the PREMIS event log.
