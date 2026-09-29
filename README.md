# Samvidhan Archive

<p align="center"><strong>Every word he wrote, held in one archive.</strong></p>

<p align="center">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2f6f4f.svg">
  <img alt="React" src="https://img.shields.io/badge/React-19-1f6feb.svg">
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-Backend-1f6feb.svg">
  <img alt="pgvector" src="https://img.shields.io/badge/Postgres-pgvector-1f6feb.svg">
  <img alt="On-device AI" src="https://img.shields.io/badge/On--device%20AI-Florence--2-6f42c1.svg">
</p>

<p align="center">
  <a href="docs/ARCHITECTURE.md">Architecture</a> ·
  <a href="docs/INSTALLATION.md">Installation</a> ·
  <a href="docs/USER_GUIDE.md">User Guide</a> ·
  <a href="LICENSE">License</a>
</p>

---

## The problem

Dr. B. R. Ambedkar's writings, speeches, constitutional debates, and manuscripts are scattered across libraries, memorials, and fragmented digital sources. A visitor at an institution like the Dr. Ambedkar International Centre has no single, intelligent way to search his life's work, hear it read aloud in their own language, or ask a question and get an answer grounded in what he actually wrote rather than a generic historical summary.

## What Samvidhan Archive does

- **Connects ideas across the entire collection.** A hybrid search engine allows visitors to query the archive and find relevant speeches, manuscripts, and debate transcripts even if they don't use the exact keywords.
- **Digitizes fragile historical records.** The system processes uploaded document scans using on-device vision models, extracting text locally so that previously unsearchable archival PDFs and images can be searched and read.
- **Speaks the visitor's language.** Visitors can switch the interface between English, Hindi, and Marathi, with support for on-demand text translation and text-to-speech audio narration.
- **Operates safely as a public kiosk.** The interface is built for robust touchscreen use on the museum floor, featuring accessibility controls (high contrast, text sizing), offline caching for network resilience, and idle session timeouts that clear user data automatically.

## System at a glance

```text
   Visitor kiosk / web ─────┐
                             │  search, browse, ask
   Admin panel ─────────────┤  upload, verify, review
                             ▼
                Shared API layer (FastAPI)
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
   Postgres + pgvector   Object storage (MinIO)   Background Tasks (FastAPI)
   (metadata, mock emb)  (scans, audio, video)    (Florence-2/Tesseract OCR)
```

| Component               | Role                                   | Stack                                      |
| ----------------------- | -------------------------------------- | ------------------------------------------ |
| **Web / Kiosk frontend**| Visitor-facing search, reader, kiosk UI| React 19 · Vite · Tailwind 4 · TypeScript  |
| **API**                 | Content, search, admin endpoints       | FastAPI (Python) · SQLAlchemy              |
| **Database**            | Metadata storage                       | PostgreSQL + pgvector                      |
| **Object storage**      | Scans, audio, video, derivatives       | MinIO (S3-compatible)                      |
| **OCR Engine**          | Extracts text from uploaded scans      | Tesseract (CPU) or Florence-2 (NVIDIA GPU) |

*Note: The AI Q&A and semantic embedding pipelines are currently mocked in the backend API to facilitate frontend development and testing.*

## Getting started

```bash
git clone https://github.com/fardeen-gaffoor/THE-MATRIX-Kiosk.git
cd THE-MATRIX-Kiosk
docker compose -f infra/docker-compose.yml up
```

For full setup instructions, including how to run the apps locally for development and configure the Florence-2 OCR engine, see [docs/INSTALLATION.md](docs/INSTALLATION.md).

## Using it

Read the [docs/USER_GUIDE.md](docs/USER_GUIDE.md) to walk through the platform from the perspective of a kiosk visitor exploring the archive and an administrator uploading new historical manuscripts.

## Built with

- **React 19 & Vite** — Frontend framework and build tooling
- **Tailwind CSS v4** — Utility-first styling alongside custom design tokens
- **FastAPI** — High-performance async Python API
- **PostgreSQL & pgvector** — Relational data and vector embedding storage
- **Microsoft Florence-2 & Tesseract** — Local on-device optical character recognition
- **MinIO & Redis** — Local object storage and caching infrastructure

## License

MIT — see [LICENSE](LICENSE). Archive content is third-party historical material with its own rights status per item; see [docs/RIGHTS.md](docs/RIGHTS.md) for sourcing and licensing notes.
