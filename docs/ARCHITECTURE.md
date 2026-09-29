# System Architecture

The Samvidhan Archive kiosk operates via a decoupled architecture, isolating the React frontend from the FastAPI backend and utilizing background workers for heavy machine-learning processes.

## Full Data Flow & Component Diagram

```text
                                     ┌─────────────────────┐
                                     │   Visitor Kiosk /   │
                                     │   Web Interface     │
                                     │  (React 19, Vite)   │
                                     └─────────┬───────────┘
                                               │
                                       REST API over HTTP
                                               │
                                     ┌─────────▼───────────┐
                                     │    FastAPI Core     │
                                     │   (Python, Async)   │
                                     └────┬────┬────┬──────┘
                                          │    │    │
      ┌───────────────────────────────────┘    │    └─────────────────────────────────────┐
      │                                        │                                          │
┌─────▼──────────────┐                ┌────────▼───────────┐                 ┌────────────▼────────────┐
│  Object Storage    │                │  Relational DB     │                 │   Background Workers    │
│  (MinIO)           │                │  (PostgreSQL +     │                 │   (FastAPI Tasks)       │
│                    │                │   pgvector)        │                 │                         │
│ - Scanned images   │                │ - Item metadata    │                 │ - Tesseract OCR (CPU)   │
│ - MP4 Videos       │                │ - Dublin Core tags │                 │ - Florence-2 OCR (GPU)  │
│ - MP3 Narrations   │                │ - Vector embeddings│                 │                         │
└────────────────────┘                └────────────────────┘                 └─────────────────────────┘
```

*Note: In the current prototype state, certain AI features (like the Anthropic RAG responses, NLP translations, and semantic pgvector lookups) are mocked within the FastAPI layer for UI validation.*

## Folder-by-Folder Breakdown

| Directory | Purpose |
| --- | --- |
| `/apps/web/` | The React 19 frontend application. Contains the UI components, Tailwind CSS styling, routing, and PWA configurations. |
| `/apps/api/` | The FastAPI backend application. Houses the REST API endpoints, the SQLAlchemy models, the mocked AI assistant routes, and the local OCR engine (`ocr_engine.py`). |
| `/assets/` | Contains the raw static image sequences (like the 3D scroll-scrubbed chakra) and high-res portrait backgrounds provided by the archive owners. |
| `/docs/` | Project documentation, including this architecture file, installation guides, user manuals, and the historical `decisions.md` log. |
| `/infra/` | Contains the `docker-compose.yml` for spinning up Postgres, Redis, and MinIO, along with backup scripts and Windows kiosk launch batch files. |

## End-to-End Workflows

### 1. Document Upload & Digitization
1. An archivist accesses the `/admin` portal on the frontend and uploads a scanned historical PDF.
2. The frontend sends a `multipart/form-data` POST request to FastAPI (`/api/admin/upload`).
3. FastAPI immediately returns a 202 Accepted status with an `item_id` and dispatches a background task.
4. The background task (`ocr_engine.py`) intercepts the file bytes in memory. Depending on the `OCR_MODE` environment variable, it parses the text either via Tesseract (CPU) or Florence-2 (GPU).
5. The extracted text and the raw file are saved to PostgreSQL and MinIO, making the document instantly searchable.

### 2. Search & Retrieval
1. A visitor types a query into the Kiosk search bar (assisted by the `react-simple-keyboard` virtual keyboard).
2. The frontend hits `/api/search?q=...`.
3. The backend executes a hybrid search: checking Postgres for exact keyword matches (Title, Description) while simultaneously projecting the query into a vector embedding to find semantically similar documents via `pgvector` (currently mocked).
4. The aggregated, relevance-ranked list is returned to the frontend.

### 3. Ask AI (RAG Q&A)
1. A visitor asks a natural language question in the Ask AI tab (e.g., "What were his views on the caste system?").
2. The query is posted to `/api/chat`.
3. The backend (currently mocked) is designed to retrieve the most semantically relevant text chunks from PostgreSQL.
4. It crafts a prompt for the Anthropic Claude API containing both the visitor's question and the retrieved text chunks, explicitly instructing the model to *only* answer using the provided texts.
5. The response is piped back to the visitor alongside clickable source citation chips.
