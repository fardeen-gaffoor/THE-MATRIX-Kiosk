# Samvidhan Archive

<p align="center"><strong>Every word he wrote, held in one archive.</strong></p>

<p align="center">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-2f6f4f.svg">
  <img alt="React" src="https://img.shields.io/badge/React-18-1f6feb.svg">
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-Backend-1f6feb.svg">
  <img alt="pgvector" src="https://img.shields.io/badge/Postgres-pgvector-1f6feb.svg">
  <img alt="On-device AI" src="https://img.shields.io/badge/On--device%20AI-Kiosk-6f42c1.svg">
</p>

<p align="center">
  <a href="docs/ARCHITECTURE.md">Architecture</a> ·
  <a href="docs/INSTALLATION.md">Installation</a> ·
  <a href="docs/USER_GUIDE.md">User Guide</a> ·
  <a href="LICENSE">License</a>
</p>

---

## The problem

Dr. B. R. Ambedkar's writings, speeches, constitutional debates and manuscripts are
scattered across libraries, memorials and fragmented digital sources. A visitor at an
institution like the Dr. Ambedkar International Centre has no single, intelligent way
to search his life's work, hear it read aloud in their own language, or ask a question
and get an answer grounded in what he actually wrote — not a generic summary of him.

## What Samvidhan Archive does

Samvidhan Archive is a kiosk-and-web platform that puts the full body of his writing,
speeches and constitutional debates behind one searchable, multilingual, AI-guided
interface:

- **Understands a question, not just a keyword.** Semantic search and a knowledge graph
  connect a query to speeches, manuscripts and debate transcripts across the whole
  collection — not just exact-word matches.
- **Recovers what paper can't hold much longer.** OCR digitization turns fragile scans
  and manuscripts into searchable, preservable text, with an admin "verify & correct"
  screen so nothing goes public uncorrected.
- **Speaks the visitor's language.** On-demand translation and text-to-speech narration
  open every document to visitors in English, Hindi, Marathi and beyond.
- **Never answers past its sources.** The AI Research Assistant is retrieval-grounded:
  every answer cites the exact archive passage it came from, and it says so plainly
  when nothing relevant exists, instead of guessing.
- **Runs on the kiosk floor, not just a browser tab.** Fullscreen touch mode, idle
  attract-loop, offline-capable caching, and a visitor "collection tray" for compiling
  and printing or emailing a personal set of records.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full data model, pipeline
breakdown, and how a single item moves from a scanned page to a cited answer.

## System at a glance

```
   Visitor kiosk / web ─────┐
                             │  search, browse, ask
   Admin panel ─────────────┤  upload, verify, review
                             ▼
                Shared API layer (FastAPI)
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                     ▼
   Postgres + pgvector   Object storage (MinIO)   Job queue (Celery/Redis)
   (metadata, embeddings) (scans, audio, video)   (OCR, embeddings, TTS,
                                                    translation, transcription)
                             │
                             ▼
                  AI Research Assistant (RAG)
             cites archive passages, refuses to guess
```

| Component               | Role                                   | Stack                              |
| ------------------------ | --------------------------------------- | ----------------------------------- |
| **Web / Kiosk frontend** | Visitor-facing search, reader, kiosk UI | React · Vite · TypeScript           |
| **API**                  | Content, search, auth, assistant proxy  | FastAPI (Python, async)             |
| **Database**              | Metadata, full-text, embeddings         | PostgreSQL + pgvector               |
| **Object storage**        | Scans, audio, video, derivatives        | MinIO (S3-compatible)               |
| **Worker**                | OCR, transcription, embeddings, TTS     | Celery/RQ + Redis                   |
| **AI Assistant**          | Retrieval-grounded Q&A                  | Anthropic Claude API (server-side)  |

Full breakdown: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Getting started

```
git clone https://github.com/<your-org>/samvidhan-archive.git
cd samvidhan-archive
docker compose up
```

Each service can also be run independently for development. Full, copy-pasteable
setup for every app and service, plus troubleshooting, is in
[docs/INSTALLATION.md](docs/INSTALLATION.md).

## Using it

[docs/USER_GUIDE.md](docs/USER_GUIDE.md) walks through the platform from each
person's point of view — what a visitor searches and asks, what a kiosk shows when
idle, and what an archivist uploads, corrects and approves.

## Built with

- [Anthropic Claude API](https://docs.claude.com) — retrieval-grounded research assistant
- Tesseract / PaddleOCR — manuscript and document digitization
- PostgreSQL + pgvector — hybrid keyword + semantic search
- React, FastAPI, Celery, MinIO, Redis, Docker

## License

MIT — see [LICENSE](LICENSE). Archive content is third-party historical material with
its own rights status per item; see `docs/RIGHTS.md` for sourcing and licensing notes.
