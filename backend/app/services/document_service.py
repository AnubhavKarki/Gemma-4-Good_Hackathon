"""
Document service — in-memory document store + processing orchestration.
For a production system, swap the dict for SQLite/Postgres.
"""

import asyncio
import logging
from typing import Optional

from app.config import get_settings
from app.pipelines.ocr_pipeline import extract_text
from app.pipelines.ai_pipeline import classify_document, analyze_document
from app.schemas.document import DocumentRecord, ProcessingStatus

logger = logging.getLogger(__name__)

# Simple in-memory store (document_id → DocumentRecord)
_store: dict[str, DocumentRecord] = {}


def get_document(document_id: str) -> Optional[DocumentRecord]:
    return _store.get(document_id)


def store_document(record: DocumentRecord) -> None:
    _store[record.id] = record


def _update_status(
    document_id: str,
    status: ProcessingStatus,
    progress_pct: int,
    current_step: str,
) -> None:
    record = _store.get(document_id)
    if record:
        record.status = status
        record.progress_pct = progress_pct
        record.current_step = current_step


async def _tick_progress(document_id: str, start: int, end: int, duration_s: float) -> None:
    """
    Smoothly advance progress_pct from start→end over duration_s seconds.
    Runs concurrently while the AI executor is working so the frontend never
    sees the bar frozen at 55%.
    """
    steps = end - start
    if steps <= 0:
        return
    delay = duration_s / steps
    for i in range(steps):
        await asyncio.sleep(delay)
        record = _store.get(document_id)
        if record and record.status == ProcessingStatus.ANALYZING:
            record.progress_pct = start + i + 1
        else:
            break


async def process_document(record: DocumentRecord, file_bytes: bytes) -> None:
    """
    Background processing pipeline:
      1. OCR → extract text
      2. Classify document type
      3. AI analysis (progress ticks 55→90% concurrently)
      4. Store result
    """
    settings = get_settings()
    document_id = record.id

    try:
        # Step 1: OCR
        _update_status(document_id, ProcessingStatus.EXTRACTING_TEXT, 10, "Extracting text from document")
        await asyncio.sleep(0)
        text = await asyncio.get_event_loop().run_in_executor(
            None, extract_text, file_bytes, record.mime_type
        )

        if not text.strip():
            logger.warning("No text extracted from %s — using placeholder for AI", record.filename)
            text = (
                f"[Document filename: {record.filename}. "
                "The text could not be automatically extracted from this file. "
                "It may be a scanned image, a photo of a document, or a PDF with no selectable text. "
                "Please analyse based on whatever context you can infer from the filename and document type, "
                "and explain to the user that the document could not be read clearly.]"
            )

        logger.info("Extracted %d chars from %s", len(text), record.filename)
        record.extracted_text = text

        # Step 2: classify
        _update_status(document_id, ProcessingStatus.CLASSIFYING, 30, "Identifying document type")
        document_type = await asyncio.get_event_loop().run_in_executor(
            None, classify_document, text, settings.ollama_model
        )
        logger.info("Classified as: %s", document_type)

        # Step 3: full analysis
        # Tick 55→90% slowly over 50s while the AI call blocks the executor thread
        _update_status(document_id, ProcessingStatus.ANALYZING, 55, "Analysing and simplifying content")
        ticker = asyncio.create_task(_tick_progress(document_id, 55, 90, 50.0))
        try:
            analysis = await asyncio.get_event_loop().run_in_executor(
                None, analyze_document, text, document_type, record.target_language, settings.ollama_model
            )
        finally:
            ticker.cancel()

        # Step 4: complete
        record.status = ProcessingStatus.COMPLETE
        record.progress_pct = 100
        record.current_step = "Done"
        record.analysis = analysis
        logger.info("Processing complete for %s in %dms", document_id, analysis.processing_time_ms)

    except Exception as e:
        logger.exception("Processing failed for %s: %s", document_id, e)
        record.status = ProcessingStatus.ERROR
        record.error = str(e)
        record.current_step = "Error"
