"""
AI pipeline — orchestrates Gemma 4 via Ollama.
Runs classification, then full analysis with retry and JSON extraction fallback.
"""

import json
import logging
import re
import time
from typing import Optional

import ollama

from app.config import get_settings
from app.prompts.system_prompts import (
    CLASSIFICATION_PROMPT,
    ANALYSIS_PROMPT,
    ANALYSIS_PROMPT_SIMPLE,
    EXPLAIN_SNIPPET_SYSTEM,
    EXPLAIN_SNIPPET_USER,
)
from app.schemas.document import (
    DocumentAnalysis,
    DocumentType,
    RiskLevel,
    GlossaryItem,
    SimplifiedSection,
    Deadline,
    Risk,
    ActionItem,
)

logger = logging.getLogger(__name__)

LANGUAGE_NAMES = {
    "en": "English",
    "hi": "Hindi",
    "ne": "Nepali",
    "zh": "Chinese (Simplified)",
    "ar": "Arabic",
    "es": "Spanish",
    "fr": "French",
    "vi": "Vietnamese",
    "tl": "Filipino (Tagalog)",
    "ko": "Korean",
    "ja": "Japanese",
    "pt": "Portuguese",
    "de": "German",
    "it": "Italian",
    "ru": "Russian",
    "tr": "Turkish",
    "pl": "Polish",
    "nl": "Dutch",
    "bn": "Bengali",
    "ur": "Urdu",
    "ms": "Malay",
    "id": "Indonesian",
    "th": "Thai",
    "sw": "Swahili",
    "uk": "Ukrainian",
    "ro": "Romanian",
    "el": "Greek",
    "sv": "Swedish",
    "no": "Norwegian",
    "da": "Danish",
    "fi": "Finnish",
    "cs": "Czech",
    "hu": "Hungarian",
    "he": "Hebrew",
    "fa": "Persian (Farsi)",
}

_DEFAULT_SUMMARY = "Analysis complete. Please review the sections below."


def _extract_json(raw: str) -> dict:
    """Extract a JSON object from model output, even if surrounded by prose."""
    raw = raw.strip()
    # Direct parse
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass
    # Find the outermost { ... } block
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass
    # Try closing a truncated JSON object
    for suffix in ["}", "}}", "]}}", "]}}}", '""}']:
        try:
            return json.loads(raw + suffix)
        except json.JSONDecodeError:
            continue
    logger.warning("Could not extract JSON from model output (len=%d)", len(raw))
    return {}


def _is_empty_analysis(data: dict) -> bool:
    """Return True if the model returned essentially nothing useful."""
    summary = data.get("summary", "")
    points = data.get("important_points", [])
    sections = data.get("simplified_sections", [])
    return (
        not summary
        or summary == _DEFAULT_SUMMARY
        or (len(points) == 0 and len(sections) == 0)
    )


def classify_document(text: str, model: str) -> DocumentType:
    """Ask Gemma to classify the document type."""
    try:
        prompt = CLASSIFICATION_PROMPT.format(text=text[:3000])
        response = ollama.generate(
            model=model,
            prompt=prompt,
            options={"temperature": 0.1, "num_predict": 30},
        )
        raw = response["response"].strip().lower().replace("-", "_")
        try:
            return DocumentType(raw)
        except ValueError:
            logger.warning("Unknown document type: %s", raw)
            return DocumentType.UNKNOWN
    except Exception as e:
        logger.error("Classification failed: %s", e)
        return DocumentType.UNKNOWN


def analyze_document(
    text: str,
    document_type: DocumentType,
    target_language: str,
    model: str,
) -> DocumentAnalysis:
    """
    Run full comprehension analysis with retry on empty results.
    Attempt 1: full prompt, up to 5000 chars of text.
    Attempt 2: simple prompt, up to 2500 chars of text.
    Synthesizes full_translation from sections if not returned by the model.
    """
    start_ms = int(time.time() * 1000)
    target_language_name = LANGUAGE_NAMES.get(target_language, "English")

    data = _run_analysis_attempt(
        prompt_template=ANALYSIS_PROMPT,
        text=text[:5000],
        document_type=document_type,
        target_language_name=target_language_name,
        model=model,
        num_predict=6144,
    )

    if _is_empty_analysis(data):
        logger.warning("First analysis attempt returned empty data, retrying with simple prompt…")
        data = _run_analysis_attempt(
            prompt_template=ANALYSIS_PROMPT_SIMPLE,
            text=text[:2500],
            document_type=document_type,
            target_language_name=target_language_name,
            model=model,
            num_predict=2048,
        )

    elapsed_ms = int(time.time() * 1000) - start_ms
    return _build_analysis(data, document_type, elapsed_ms, text)


def _run_analysis_attempt(
    prompt_template: str,
    text: str,
    document_type: DocumentType,
    target_language_name: str,
    model: str,
    num_predict: int,
) -> dict:
    try:
        prompt = prompt_template.format(
            text=text,
            document_type=document_type.value,
            target_language_name=target_language_name,
        )
        response = ollama.generate(
            model=model,
            prompt=prompt,
            options={"temperature": 0.3, "num_predict": num_predict},
            format="json",
        )
        return _extract_json(response.get("response", ""))
    except Exception as e:
        logger.error("Analysis attempt failed: %s", e)
        return {}


def _build_analysis(data: dict, document_type: DocumentType, elapsed_ms: int, raw_text: str = "") -> DocumentAnalysis:
    """Parse raw AI JSON into validated Pydantic schema, with text-based fallbacks so results are never empty."""

    def safe_risk(val: str) -> RiskLevel:
        try:
            return RiskLevel(val.lower())
        except (ValueError, AttributeError):
            return RiskLevel.MEDIUM

    glossary = [
        GlossaryItem(
            term=g.get("term", ""),
            definition=g.get("definition", ""),
            cultural_note=g.get("cultural_note") or None,
        )
        for g in data.get("glossary", [])
        if g.get("term") and g.get("definition")
    ]

    sections = [
        SimplifiedSection(
            original=s.get("original", ""),
            simplified=s.get("simplified", ""),
            section_title=s.get("section_title") or None,
        )
        for s in data.get("simplified_sections", [])
        if s.get("simplified")
    ]

    deadlines = [
        Deadline(
            description=d.get("description", ""),
            date=d.get("date") or None,
            urgency=safe_risk(d.get("urgency", "medium")),
        )
        for d in data.get("deadlines", [])
        if d.get("description")
    ]

    risks = [
        Risk(
            description=r.get("description", ""),
            level=safe_risk(r.get("level", "medium")),
            recommendation=r.get("recommendation") or None,
        )
        for r in data.get("risks", [])
        if r.get("description")
    ]

    action_items = [
        ActionItem(
            action=a.get("action", ""),
            priority=safe_risk(a.get("priority", "medium")),
            due_by=a.get("due_by") or None,
        )
        for a in data.get("action_items", [])
        if a.get("action")
    ]

    # ── Text-based fallbacks when the AI returned nothing useful ──────────────

    # Sections fallback: split raw text into paragraphs
    if not sections and raw_text.strip():
        paragraphs = [p.strip() for p in raw_text.split("\n\n") if len(p.strip()) > 30]
        if not paragraphs:
            paragraphs = [p.strip() for p in raw_text.split("\n") if len(p.strip()) > 30]
        sections = [
            SimplifiedSection(
                original=p[:600],
                simplified=p[:600],
                section_title=f"Section {i + 1}",
            )
            for i, p in enumerate(paragraphs[:8])
        ]
        logger.info("Built %d sections from raw text fallback", len(sections))

    # Important points fallback: pull first meaningful lines
    important_points = data.get("important_points", [])
    if not important_points and raw_text.strip():
        lines = [l.strip() for l in raw_text.splitlines() if len(l.strip()) > 25]
        important_points = lines[:4]

    # Summary fallback: build from actual document content
    raw_summary = data.get("summary", "").strip()
    if raw_summary and raw_summary != _DEFAULT_SUMMARY:
        summary = raw_summary
    elif important_points:
        summary = " ".join(str(p) for p in important_points[:2])
    elif sections:
        summary = sections[0].simplified[:300]
    elif raw_text.strip():
        summary = raw_text.strip()[:300]
    else:
        summary = _DEFAULT_SUMMARY

    # Full translation fallback
    full_translation: Optional[str] = None
    raw_translation = data.get("full_translation")
    if raw_translation and isinstance(raw_translation, str) and len(raw_translation.strip()) > 50:
        full_translation = raw_translation.strip()
    elif sections:
        full_translation = "\n\n".join(
            f"{s.section_title + chr(10) if s.section_title else ''}{s.simplified}"
            for s in sections
        )
        logger.info("Synthesized full_translation from %d sections", len(sections))

    confidence = 0.85
    try:
        confidence = float(data.get("confidence_score", 0.85))
    except (TypeError, ValueError):
        pass

    return DocumentAnalysis(
        document_type=document_type,
        language_detected=data.get("language_detected", "en"),
        summary=summary,
        important_points=important_points,
        deadlines=deadlines,
        risks=risks,
        simplified_sections=sections,
        glossary=glossary,
        action_items=action_items,
        full_translation=full_translation,
        confidence_score=confidence,
        processing_time_ms=elapsed_ms,
    )


def explain_snippet(
    snippet: str,
    context: str,
    document_type: DocumentType,
    target_language: str,
    model: str,
) -> str:
    """Ask Gemma to explain a user-highlighted snippet in the target language."""
    target_language_name = LANGUAGE_NAMES.get(target_language, "English")
    snippet_truncated = snippet[:800]
    user_message = EXPLAIN_SNIPPET_USER.format(
        snippet=snippet_truncated,
        context=context[:2000],
        document_type=document_type.value,
        target_language_name=target_language_name,
    )
    try:
        response = ollama.chat(
            model=model,
            messages=[
                {"role": "system", "content": EXPLAIN_SNIPPET_SYSTEM},
                {"role": "user", "content": user_message},
            ],
            options={"temperature": 0.3, "num_predict": 1024},
            format="json",
        )
        raw = (response.message.content or "").strip()
        logger.info("explain_snippet raw response (len=%d): %.200s", len(raw), raw)

        data = _extract_json(raw)
        # Use `or ""` to safely handle null/None returned by the model
        explanation = (data.get("explanation") or "").strip()

        # Regex fallback if JSON parsing lost the value
        if not explanation:
            match = re.search(r'"explanation"\s*:\s*"(.*?)(?:"}|"$)', raw, re.DOTALL)
            if match:
                explanation = match.group(1).strip()

        # Last resort: return raw model output rather than nothing
        if not explanation and raw:
            explanation = raw[:800]

        if not explanation:
            logger.warning("explain_snippet returned empty for snippet (len=%d)", len(snippet_truncated))

        return explanation
    except Exception as e:
        logger.error("explain_snippet failed: %s", e, exc_info=True)
        return ""
