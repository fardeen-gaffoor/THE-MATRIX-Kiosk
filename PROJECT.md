# Samvidhan Archive — Project Spec

AI-powered Digital Heritage Archive and Knowledge Platform for Dr. B. R. Ambedkar's writings, speeches, constitutional debates, manuscripts and records. Deployed on touch-screen kiosks, smart displays and a public web portal for institutions such as the Dr. Ambedkar International Centre.

> This file is the source of truth. Read it fully before starting any segment. If a segment prompt conflicts with this file, ask before proceeding.

---

## 1. Goals

1. AI semantic search and knowledge mapping
2. Full-text and summarized access to writings and speeches
3. OCR digitization of old documents and manuscripts
4. Multilingual translation and audio narration
5. Audio-video archive (lectures, documentaries, interviews)
6. Interactive timeline and memorial storytelling
7. AI Research Assistant for questions on his works and constitutional ideas
8. Secure digital preservation, metadata tagging, archival management
9. Kiosk deployment with visitor "collection tray"

## 2. Existing UI (already designed, do not regress)

The UI exists as `ambedkar-archive-ui.html` (single file). Migrate it into React components and preserve:

- **Palette tokens:** `--suit-navy #101c33`, `--suit-navy-2 #1c2f52`, `--suit-navy-3 #28406b`, `--tie-red #8f1b2b`, `--tie-red-2 #b3283a`, `--gold #c9a24b`, `--paper #f3ecdf`, `--paper-dim #e6dcc7`, `--ink #1a1410`
- **Fonts:** Marcellus (display), Source Sans Pro (body)
- **Signature interactions:**
  - Scroll-scrubbed 3D chakra (canvas image sequence, frames supplied by the owner)
  - Pull-down red tie in the top-right corner that reveals a biography panel
  - Scroll-locked "Constitution book" story section (visitor must reach the last chapter before the page continues)
  - Tabbed kiosk mockup (Home / Search / Timeline / Ask AI)
  - Abstract monument silhouette + Ambedkar photo backgrounds under a dark navy overlay
  - Rise-in reveal animations. Respect `prefers-reduced-motion`.
- **Surface rules:** paper-cream for long reading text, navy for chrome, gold for highlights, red for primary actions.
- Do NOT generate or draw a likeness of Dr. Ambedkar. Use only photographs supplied by the owner in `/assets/background/`.

## 3. Architecture

| Layer | Choice |
|---|---|
| Frontend | React + Vite + TypeScript, CSS variables for tokens, i18n via JSON locale files |
| API | Python FastAPI (async), auto OpenAPI docs |
| Database | PostgreSQL + pgvector (metadata, full-text, embeddings) |
| Keyword search | Postgres FTS first; Meilisearch optional |
| Object storage | MinIO (S3-compatible) |
| Jobs | Celery or RQ + Redis |
| AI | Anthropic Claude API via backend proxy only |
| OCR | Tesseract (pluggable, Hindi/Marathi/English packs) |
| Transcription | Whisper or equivalent |
| Auth | OAuth2/JWT for admin, public read-only |
| Deploy | Docker Compose (local + on-prem), documented production path |

Suggested repo layout:

```
/apps/web        React frontend
/apps/api        FastAPI backend
/apps/worker     background jobs (OCR, embeddings, TTS, transcription)
/infra           docker-compose, nginx, backup scripts
/docs            decisions.md, runbooks, kiosk setup
/assets          chakra-frames, background images (owner supplied)
```

## 4. Data model (Dublin Core base)

Item types: `book, speech, manuscript, letter, constitutional_debate, photograph, audio, video, journal_article, document`.

Fields: `title, creator, date, description, subject, language, rights, source, identifier` plus `collection, location, people[], places[], topics[], related_constitution_articles[], provenance, rights_status, ocr_confidence, digitization_date, checksum_sha256`.

Every item MUST carry `rights_status` and a source/licence citation.

## 5. Non-negotiable rules

1. **No fabrication.** Never invent historical facts, quotes, sources or citations in seed data or AI output. Label placeholder content clearly as `SAMPLE`.
2. **Rights.** Only ingest content the owner holds or that is public-domain/licensed. Track rights per item.
3. **RAG grounding.** The AI assistant answers only from retrieved archive passages, with clickable citations. If nothing relevant is found, it says so. It never answers from memory and never invents quotes.
4. **Secrets.** API keys and storage credentials live in `.env` and server-side only. Never in the browser or in git.
5. **Neutrality.** Sensitive topics (caste, religion, politics) are handled factually, with documented perspectives, and no views are attributed to Dr. Ambedkar beyond what sources support.
6. **Originals are immutable.** Scans are stored untouched with SHA-256 checksums. Derivatives live separately.
7. **Accessibility.** WCAG 2.2 AA. Kiosk touch targets at least 48px.
8. **Privacy.** Minimal data collection, anonymised analytics, kiosk sessions auto-expire.
9. **Process.** After each segment, stop, summarize what was built, list how to test it, and wait for approval. Log major decisions in `/docs/decisions.md`. Ask before major stack changes.

## 6. Definition of done (whole project)

- `docker compose up` starts the full stack with seeded SAMPLE data
- A scanned page uploaded in admin becomes searchable text, is reviewable, and appears in search with a highlighted snippet
- A Hindi question returns a grounded answer with working citations; an unsupported question says so
- A recording plays with a synced searchable transcript and translated subtitles
- Kiosk mode resets on idle, works offline for cached content, and scores 95+ on Lighthouse/axe accessibility
- README covers setup, architecture, env vars, adding content, kiosk deployment, backup/restore, adding a language
- Unit tests for search, OCR pipeline and RAG citation logic; end-to-end tests for main visitor journeys
