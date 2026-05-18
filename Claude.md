```text id="4mzb8k"
You are building a production-quality hackathon application called GemmaLens.

GemmaLens is an AI-powered document comprehension platform designed for migrants, regional communities, international workers, non-native speakers, and low-literacy users who struggle to understand important documents after moving to new cities or countries.

This is NOT a generic translator.
This is a comprehension-first system.

The core mission:
“Help people truly understand complex documents in their own language, dialect, and cultural context.”

The emotional tone of the product should feel:
- reassuring
- empowering
- friendly
- human-centered
- safe
- calming
- accessible

The app should feel like:
“Someone patient is sitting beside you explaining the document.”

The product must feel impactful and socially meaningful, not corporate or sterile.

====================================================
PRIMARY USER PROBLEM
====================================================

Many people can technically read translated text but still do not understand:
- legal terminology
- housing contracts
- medical forms
- government paperwork
- immigration forms
- banking documents
- educational documents
- workplace agreements

Current translators fail because they only translate words.
GemmaLens must explain meaning.

Example:
“Bond required before tenancy begins.”

Bad translation:
Literal translation only.

Good GemmaLens explanation:
“A bond is a refundable security deposit paid before renting a property in Australia.”

The app must prioritize:
- comprehension
- simplification
- cultural explanation
- contextual guidance
- readability

====================================================
CORE PRODUCT EXPERIENCE
====================================================

The entire app should feel frictionless and intuitive.

User flow:
1. User uploads a PDF, scan, screenshot, or image
2. OCR extracts document text
3. Backend classifies document type
4. Gemma 4 E4B processes the content locally through Ollama
5. User receives:
   - simplified explanation
   - translated version
   - cultural/contextual clarification
   - important deadlines/actions
   - highlighted risks/warnings
6. Output is displayed in an extremely readable structured UI

The product should never feel like a chatbot.
Avoid endless chat interfaces.

Instead:
- structured cards
- sections
- highlights
- timelines
- action lists
- warning boxes
- expandable explanations

====================================================
TECH STACK
====================================================

Frontend:
- Next.js (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion
- Lucide Icons

Backend:
- FastAPI
- Python
- Uvicorn

AI Runtime:
- Ollama
- Gemma 4 E4B

OCR + Parsing:
- PaddleOCR
- PyMuPDF
- pdfplumber

Optional local storage:
- SQLite

Optional vector/RAG:
- ChromaDB
- sentence-transformers

Deployment:
- Dockerized setup
- optimized for local-first execution

====================================================
ARCHITECTURE
====================================================

Build clean modular architecture.

Frontend responsibilities:
- document upload
- PDF/image preview
- results visualization
- interactive UI
- progress indicators
- settings/preferences
- language/dialect selection

Backend responsibilities:
- OCR pipeline
- file parsing
- prompt orchestration
- model communication
- document classification
- structured JSON outputs

AI responsibilities:
- simplify text
- explain meaning
- translate
- identify risks
- summarize actions
- generate contextual clarifications

====================================================
IMPORTANT PRODUCT PRINCIPLES
====================================================

1. COMPREHENSION > TRANSLATION

The app should prioritize understanding over literal translation.

2. STRUCTURED OUTPUTS

Never dump raw AI paragraphs.

Outputs should include:
- summary
- important points
- deadlines
- risks
- action items
- simplified explanation
- glossary

3. FRIENDLY EXPERIENCE

The UI should reduce anxiety.
Reading difficult documents is stressful.

The app should feel emotionally supportive.

4. LOCAL-FIRST

The app should strongly communicate:
- privacy
- offline capability
- local AI processing

5. HIGH VISUAL CLARITY

Typography and spacing are critical.

Large readable text.
Strong hierarchy.
Minimal clutter.

====================================================
UI / UX DIRECTION
====================================================

The UI should combine:
- modern accessibility
- slight neobrutalist design
- playful interactions
- warmth
- strong typography
- card-based layouts

Visual direction:
- bold borders
- clean shadows
- oversized headings
- high contrast
- rounded cards
- playful microinteractions

The interface should feel:
- memorable
- youthful
- human
- modern
- trustworthy

Avoid:
- generic AI chatbot appearance
- corporate dashboards
- overcomplicated enterprise UI

====================================================
KEY SCREENS
====================================================

1. Landing Page
- emotional storytelling
- drag-and-drop upload
- mission-focused copy
- animated hero section
- showcase examples

2. Upload Experience
- drag/drop zone
- PDF preview
- scan preview
- upload progress

3. Processing Screen
- delightful loading states
- animated processing pipeline
- “Simplifying your document...”
- “Explaining important terms...”
- “Finding important deadlines...”

4. Results Screen
MOST IMPORTANT SCREEN.

Must include:
- plain language summary
- translated version
- highlighted key terms
- action checklist
- warning/risk section
- expandable explanations
- “Explain This Better” interactions

5. History / Saved Documents
Optional but useful.

====================================================
FUN / INTERACTIVE ELEMENTS
====================================================

The app should not feel dry.

Add small delightful interactions:
- animated cards
- hover effects
- progress mascots/icons
- “You’re all caught up!” states
- simple educational tooltips
- explain-like-I’m-new-here button

Optional fun ideas:
- glossary popups
- simplified reading modes
- confidence meter
- document difficulty meter

====================================================
DOCUMENT TYPES
====================================================

Prioritize:
- rental agreements
- government forms
- healthcare paperwork
- banking forms
- employment contracts

Do NOT attempt every document type.

Hackathon strategy:
focus on 1–2 polished flows.

====================================================
AI OUTPUT FORMAT
====================================================

Responses from backend should return structured JSON.

Example:
{
  "document_type": "",
  "summary": "",
  "important_points": [],
  "deadlines": [],
  "risks": [],
  "simplified_sections": [],
  "glossary": [],
  "action_items": []
}

Never return unstructured text blobs.

====================================================
PROMPT ENGINEERING STRATEGY
====================================================

Use layered prompting.

Tasks:
1. classify document
2. simplify language
3. explain culturally
4. extract deadlines
5. identify obligations
6. summarize actions

Prompt tone:
- clear
- calm
- non-judgmental
- beginner-friendly

====================================================
HACKATHON STRATEGY
====================================================

This app is being built quickly in a vibe-coding workflow.
Prioritize:
- speed
- polish
- emotional impact
- UX quality
- demo readiness

Do not overengineer unnecessary backend systems.

Focus on:
- impressive demo flow
- clean architecture
- believable AI functionality
- visually memorable UI

The final product should feel like a real startup prototype that could genuinely help millions of people.

====================================================
NON-NEGOTIABLE GOALS
====================================================

The app must:
- feel emotionally impactful
- demonstrate meaningful social value
- clearly showcase Gemma 4 E4B
- visibly use local AI inference through Ollama
- have exceptional UI polish
- feel intuitive immediately
- produce structured readable outputs
- be demo-friendly
- feel like a future real-world product

The user should finish using GemmaLens feeling:
“I finally understand what this document actually means.”
```
