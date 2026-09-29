# Samvidhan Archive — Build Segments

Paste ONE segment at a time into Antigravity. Finish and test each before starting the next. Every segment assumes `PROJECT.md` is in the repo root and has been read.

**Shared footer (already implied in every segment):** when done, summarize what you built, list exact steps for me to test it, note any decisions in `/docs/decisions.md`, then stop and wait.

---

## Segment 0 — Kickoff & plan

```
Read PROJECT.md fully. Do not write code yet.
Give me: (1) a short build plan for all segments, (2) any stack changes you'd 
recommend and why, (3) questions you need answered, (4) the list of assets I must 
provide (chakra frames zip, Ambedkar photos, sample licensed documents, API keys).
Then wait for my approval.
```

**Done when:** you've approved the plan and answered its questions.

---

## Segment 1 — Scaffold, database, UI migration

```
Build Segment 1.
- Create the monorepo layout from PROJECT.md. Add Docker Compose for Postgres 
  (with pgvector), Redis, MinIO, API, web.
- FastAPI app with health endpoint, config from .env, DB migrations (Alembic), 
  and the Item data model with Dublin Core fields, tags, collections, rights_status.
- Migrate ambedkar-archive-ui.html into React + Vite + TypeScript components. 
  Keep every design token, animation and interaction exactly as designed 
  (tie pull-down, scroll-locked book, chakra, kiosk tabs, backgrounds). 
- Add routing: /, /search, /collections/:type, /item/:id, /timeline, /constitution, /ask, /admin.
- Seed a small set of clearly-labelled SAMPLE items. Basic item CRUD API and 
  public browse + item detail pages backed by real data.
```

**Done when:** `docker compose up` works, the UI looks identical to the design, and browse pages show seeded data.

---

## Segment 2 — Upload, OCR, full-text search

```
Build Segment 2.
- Admin upload (PDF/TIFF/JPG/PNG) to MinIO with SHA-256 checksum; originals immutable.
- Background OCR pipeline: deskew/denoise, Tesseract (English/Hindi/Marathi), 
  per-page text, word boxes, confidence. Engine must be pluggable.
- Admin "verify & correct" screen: page image left, editable text right, 
  low-confidence words highlighted, versioned edits.
- Postgres full-text search with filters (type, date, language, collection, topic) 
  and highlighted snippets. Searchable-PDF export.
```

**Done when:** an uploaded scan becomes searchable text you can correct and find via search.

---

## Segment 3 — Semantic search & knowledge map

```
Build Segment 3.
- Chunk documents on paragraph/section boundaries; generate embeddings; store in pgvector.
- Hybrid search (keyword + semantic, reciprocal rank fusion) with the same filters.
- Entity extraction (people, places, events, works, Constitution articles) and an 
  interactive force-directed knowledge graph in the site theme; clicking a node 
  filters/opens related items.
- "Related items" panel on each item page (embedding similarity + shared tags).
```

**Done when:** a natural-language query finds relevant items without exact keywords, and the graph is explorable.

---

## Segment 4 — Reader, summaries, AI Research Assistant

```
Build Segment 4.
- Item reader: zoomable page images, synced text layer, in-document search, 
  bookmarks, citation export (APA/MLA/Chicago/BibTeX).
- AI summaries (short + detailed), labelled AI-generated, cached, linked to source, 
  routed through the admin review queue before going public.
- RAG assistant via the Anthropic API, proxied by the backend only. 
  Answers cite specific items/pages/timestamps as clickable source chips. 
  If retrieval finds nothing, say so. No invented quotes.
- Modes: quick answer, deep dive, compare two ideas, explain like I'm a student. 
  Session memory, "Sources used" panel, thumbs up/down feedback, anonymised query log.
- Wire it into the existing Ask AI tab and /ask page.
```

**Done when:** questions return grounded, cited answers and an unanswerable question is refused honestly.

---

## Segment 5 — Multilingual & narration

```
Build Segment 5.
- i18n with JSON locale files and a global language switcher (English, Hindi, 
  Marathi first; architecture ready for Tamil, Bengali, Gujarati, Punjabi, Telugu, Kannada).
- On-demand translation of items, cached, labelled machine-translated, 
  original shown alongside.
- Text-to-speech narration with play/pause/seek/speed and word highlighting where possible. 
  Pluggable TTS backend. Jobs run in the queue with progress state.
- On-screen keyboard with Hindi and Marathi layouts for kiosk search.
- The AI assistant answers in the language asked, citing original-language sources.
```

**Done when:** you can switch language, translate an item, and hear it narrated.

---

## Segment 6 — Audio/video archive

```
Build Segment 6.
- Upload and stream audio/video (HLS or MP4 with range requests).
- Auto-transcribe with Whisper: time-coded transcript and WebVTT subtitles, 
  translatable subtitles.
- Transcript-synced player: click a sentence to seek, search inside a recording, 
  auto chapters. Cross-link recordings to the documents they discuss.
- Include recordings in search and in RAG citations (with timestamps).
```

**Done when:** a recording plays with a searchable, clickable transcript.

---

## Segment 7 — Timeline, stories, collection tray

```
Build Segment 7.
- Data-driven timeline (date, description, media, sources, related items) 
  editable in admin, rendered in the existing scroll-driven style.
- Story module builder: admin composes chapters (text, images, audio, linked items). 
  Stories play like the Constitution book section, with scroll-lock-until-finished 
  as an optional per-story setting.
- Visitor collection tray: save items/passages/quotes, reorder, add notes, 
  export a PDF booklet, print, or open on a phone via QR code. 
  Sessions auto-expire; no personal data without consent.
```

**Done when:** you can author a story and a visitor can compile and download a booklet.

---

## Segment 8 — Kiosk mode

```
Build Segment 8.
- Kiosk mode (?kiosk=1 or env flag): fullscreen, 48px+ touch targets, swipe gestures, 
  disabled text selection/context menu/zoom.
- Idle detection: attract-mode loop, then reset session, state and language.
- Accessibility bar: text size, high contrast, screen-reader support, audio-first mode. 
  WCAG 2.2 AA.
- PWA/service worker with local content cache so the kiosk survives network drops.
- Smart-display route for large passive screens (rotating quotes, timeline highlights).
- Chromium kiosk launch config (Linux + Windows), auto-restart on crash, 
  heartbeat endpoint each kiosk reports to.
```

**Done when:** a kiosk resets after idle, works offline for cached content, and passes the accessibility audit.

---

## Segment 9 — Admin, roles, review queues, analytics

```
Build Segment 9.
- Roles: super admin, archivist, editor, viewer. Full audit log.
- Batch upload and metadata editing; CSV/JSON/Dublin Core XML import/export; 
  duplicate detection; rights and embargo tracking.
- Review queue for AI outputs (OCR corrections, summaries, translations, tags) 
  with approve/reject/edit before publishing.
- Dashboard: collection stats, job queue, kiosk health, top searches, 
  most viewed items, assistant feedback.
```

**Done when:** each role sees only what it should, and nothing AI-generated goes public without approval.

---

## Segment 10 — Preservation, security, hardening, docs

```
Build Segment 10.
- Scheduled SHA-256 integrity checks, PREMIS-style event log, versioned derivatives.
- Encrypted automated backups with rotation and a tested restore procedure.
- Security pass: HTTPS, rate limiting, input validation, CSRF/XSS protection, 
  secure headers, least-privilege service accounts, dependency scanning.
- Load test search and the assistant; fix bottlenecks.
- Unit tests (search, OCR pipeline, RAG citation logic) and end-to-end tests 
  for the main visitor journeys.
- Write the README: setup, architecture, env vars, adding content, kiosk deployment, 
  backup/restore, adding a language.
```

**Done when:** every item in "Definition of done" in `PROJECT.md` passes.

---

## Shortcut: hackathon MVP

Build only **Segments 0, 1, 3, 4, 8**. That gives you real data, semantic search, a grounded AI assistant, and a working kiosk mode. Use SAMPLE data and skip OCR/audio/admin depth.

## Tips

- Give assets when asked: chakra frames zip in `/assets/chakra-frames/`, photos in `/assets/background/`, API keys in `.env` only.
- If a segment goes off the rails, paste it again with "Only fix X, don't touch anything else."
- Commit to git after every approved segment so you can roll back.
