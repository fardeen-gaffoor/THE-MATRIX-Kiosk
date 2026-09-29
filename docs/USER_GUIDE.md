# User Guide

This guide explains how to interact with the Samvidhan Archive platform from the perspective of different user roles based on the current state of the application.

## 1. Visitor / Kiosk User

When a visitor approaches the physical kiosk screen (or visits the public web portal), they are greeted by an immersive, touch-friendly interface.

**Interactive Storytelling:**
- The homepage features a 3D scroll-scrubbed chakra animation and rising text reveals.
- Visitors can pull down the red tie icon in the top corner to reveal a biography panel.
- A unique "Constitution book" section is scroll-locked, meaning the visitor must scroll through all chapters of the story before the page unlocks to continue downward.

**Searching the Archive:**
- Visitors navigate to the **Search** tab to find specific manuscripts, speeches, or constitutional debates.
- A virtual on-screen keyboard (`react-simple-keyboard`) is provided for touch interactions.
- Searches can be done in English, Hindi, or Marathi (via the global language switcher).

**Ask AI:**
- Visitors can use the **Ask AI** tab to ask questions in natural language.
- They can select from different modes: *Quick Answer*, *Deep Dive*, *Compare Two Ideas*, or *Explain like I'm a student*.
- The assistant returns answers coupled with clickable source chips that point directly to the archived documents where the information was found.

**Reading & Media:**
- Clicking on a document opens the **Item Reader**. Here, visitors can view high-resolution scans, read AI-generated summaries in the side panel, and toggle machine translations.
- For audio/video items, a **Synced Media Player** is available. As the video plays, the transcript scrolls alongside it. Visitors can tap any sentence in the transcript to instantly seek the video to that exact timestamp.

**The Collection Tray:**
- Visitors can save documents, timelines, or passages into their personal "Collection Tray", which floats on the screen across routes.
- Before leaving the kiosk, they can export this tray into a digital PDF booklet or scan a dynamic QR code to take the records with them on their mobile device.
- *Note: If the kiosk is idle for 15 seconds, the attract-loop resets the application to English, clears the Collection Tray, and returns to the home screen for the next visitor.*

---

## 2. Archivist / Admin

Archivists manage the ingestion and review of historical materials.

**Dashboard Access:**
- By navigating to the `/admin` route, archivists access a role-based dashboard (features adjust dynamically based on if they are logged in as a `super_admin`, `archivist`, or `editor`).

**Document Upload & OCR:**
- Archivists can upload scanned PDFs or TIFFs via the upload portal. 
- The system processes these uploads in the background, utilizing Tesseract or Florence-2 to perform OCR (Optical Character Recognition) and extract searchable text.
- Archivists can view real-time upload and processing statuses on the dashboard.

**Human-in-the-Loop Review Queue:**
- Before any AI-generated content (like translated texts, AI summaries, or OCR corrections) goes public, it lands in the Review Queue.
- The archivist must manually approve, reject, or edit these items to ensure historical accuracy and zero fabrication.

**Story Builder:**
- Under `/admin/story`, archivists can compose sequential story modules (text, images, linked items) that play on the frontend, similar to the Constitution book section.

---

## 3. Developer

Developers maintain the stack, handle deployments, and manage the mock-to-production transitions.

**Mock Data & APIs:**
- Currently, developers should be aware that the `main.py` FastAPI backend makes use of mocked responses for the Anthropic RAG, Semantic pgvector embeddings, and TTS job queues to facilitate frontend testing.
- The Developer's primary task is un-mocking these routes by providing valid API keys (e.g., `ANTHROPIC_API_KEY`) and wiring them to the respective SDKs.

**Kiosk Configuration:**
- For deploying the application onto physical kiosk hardware, developers use the `infra/launch-kiosk.bat` script (for Windows). This script launches Microsoft Edge/Chromium with `--kiosk` and `--disable-pinch` flags, and contains an auto-restart loop in case of crashes.
- The React application is configured as a PWA (`vite-plugin-pwa`), meaning developers can cache assets locally to ensure the kiosk survives network drops on the museum floor.
