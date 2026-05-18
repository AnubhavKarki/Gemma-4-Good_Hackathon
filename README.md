# GemmaLens

**AI-powered document comprehension for migrants, international workers, and non-native speakers.**

GemmaLens explains *what documents actually mean* — not just translates them. It runs entirely on your machine using Gemma 4 4B via Ollama, so your documents never leave your device.

> Built for the [Gemma 4 Good Hackathon](https://ai.google.dev/competition).

---

## The Problem

Many people can technically read a translated document but still don't understand it. Legal terms, housing contracts, government forms, and medical paperwork use language that trips up even fluent speakers — let alone someone navigating a new country.

Current translators fail because they translate *words*. GemmaLens explains *meaning*.

**Example:**

| Raw text | GemmaLens explains |
|---|---|
| "Bond required before tenancy begins." | "A bond is a refundable security deposit — usually 4 weeks' rent — paid before you move in. You get it back when you leave, as long as you haven't damaged anything." |

---

## Demo

> Record your demo video and add a link here before submitting.

---

## Quick Start — Manual (Recommended)

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Python](https://python.org/) 3.13
- [Ollama](https://ollama.ai/) installed and running
- [Tesseract OCR](https://tesseract-ocr.github.io/tessdoc/Installation.html) — required for image and scanned PDF support

```bash
# macOS
brew install tesseract

# Ubuntu/Debian
sudo apt install tesseract-ocr
```

### 1. Pull the AI model

```bash
ollama pull gemma4:e4b
```

This downloads ~9 GB. Only needed once.

### 2. Start the backend

```bash
cd backend
python3.13 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip3.13 install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`  
API docs at: `http://localhost:8000/docs`

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## Quick Start — Docker

Docker wraps the backend, frontend, and Ollama together. GPU passthrough is configured for NVIDIA cards — remove the `deploy` block in `docker-compose.yml` if you don't have one.

```bash
# 1. Build and start all services
docker compose up --build

# 2. In a separate terminal, pull the model into the running Ollama container
docker exec -it gemma4goodhackathon-ollama-1 ollama pull gemma3:4b

# 3. Open the app
open http://localhost:3000
```

> The model pull (step 2) only needs to run once. Subsequent `docker compose up` starts will find the model already cached in the `ollama_data` volume.

---

## How It Works

```
User uploads document
        ↓
   OCR Pipeline
   ├── pdfplumber   → text-embedded PDFs (fastest)
   ├── PyMuPDF      → fallback PDF extraction
   └── Tesseract    → scanned PDFs and images
        ↓
  Gemma 3 4B (Ollama)
   ├── Step 1: Classify document type
   └── Step 2: Full comprehension analysis
        ↓
  Structured JSON response
   (summary, key points, risks, deadlines, glossary, action items)
        ↓
  Results UI — card-based, readable, never a raw text dump
```

---

## Project Structure

```
GemmaLens/
├── frontend/                     # Next.js 14 (App Router)
│   └── src/
│       ├── app/                  # Pages: /, /upload, /processing, /results
│       ├── components/           # Shared UI primitives (shadcn/ui)
│       ├── features/             # Feature modules
│       │   ├── landing/          # Hero, how-it-works, document types, privacy
│       │   ├── document-upload/  # Drop zone, language selector
│       │   ├── processing/       # Animated progress screen
│       │   └── document-results/ # Result cards (summary, risks, glossary…)
│       ├── animations/           # Framer Motion variants
│       ├── lib/                  # API client, constants, utilities
│       ├── stores/               # Zustand global state
│       └── types/                # TypeScript interfaces
│
├── backend/                      # FastAPI
│   └── app/
│       ├── api/routes/           # HTTP handlers (documents, health)
│       ├── pipelines/            # OCR pipeline, AI pipeline
│       ├── prompts/              # Gemma prompt templates (layered)
│       ├── schemas/              # Pydantic request/response models
│       └── services/             # Document store + processing logic
│
├── docker-compose.yml
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, TailwindCSS, Framer Motion, shadcn/ui, Zustand |
| Backend | FastAPI, Python 3.13, Pydantic v2, Uvicorn |
| AI | Gemma 3 4B via Ollama — runs 100% locally |
| OCR | pdfplumber, PyMuPDF, pytesseract (Tesseract) |
| State | In-memory document store (designed to swap to SQLite) |

---

## API Reference

```
GET  /api/v1/health                   Health check + Ollama connectivity
POST /api/v1/documents/upload         Upload document (multipart/form-data)
                                        Fields: file, target_language (ISO 639-1)
GET  /api/v1/documents/{id}/status    Poll processing status + progress %
GET  /api/v1/documents/{id}/result    Retrieve completed analysis (JSON)
```

### Response shape

```json
{
  "document_type": "rental_agreement",
  "summary": "...",
  "important_points": ["..."],
  "deadlines": [{ "description": "...", "date": "...", "urgency": "high" }],
  "risks": [{ "description": "...", "level": "high", "recommendation": "..." }],
  "simplified_sections": [{ "section_title": "...", "original": "...", "simplified": "..." }],
  "glossary": [{ "term": "...", "definition": "...", "cultural_note": "..." }],
  "action_items": [{ "action": "...", "priority": "high", "due_by": "..." }],
  "confidence_score": 0.92,
  "processing_time_ms": 4821
}
```

---

## Supported File Types

PDF (embedded text or scanned), JPEG, PNG, WEBP, TIFF — max 20 MB

---

## Supported Output Languages

All 35 languages natively supported by Gemma:

| | | | |
|---|---|---|---|
| English | Hindi | Nepali | Bengali |
| Urdu | Arabic | Persian (Farsi) | Hebrew |
| Spanish | Portuguese | French | Italian |
| German | Dutch | Polish | Czech |
| Romanian | Hungarian | Swedish | Norwegian |
| Danish | Finnish | Russian | Ukrainian |
| Greek | Turkish | Indonesian | Malay |
| Thai | Vietnamese | Korean | Japanese |
| Filipino (Tagalog) | Swahili | Chinese (Simplified) | |

---

## Document Types Supported

- Rental / tenancy agreements
- Government forms (tax, council, centrelink)
- Immigration documents (visa, permits, residency)
- Healthcare / medical forms
- Banking and financial documents
- Employment contracts
- Educational enrolment forms

---

## Privacy

- All AI processing runs locally on your machine via Ollama
- No document content is sent to any external server
- No account required, no analytics, no tracking
