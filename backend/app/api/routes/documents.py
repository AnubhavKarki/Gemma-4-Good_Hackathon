import asyncio
import logging
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from app.config import get_settings
from app.schemas.document import DocumentRecord, ProcessingStatus, DocumentType
from app.schemas.responses import (
    UploadDocumentResponse,
    ProcessingStatusResponse,
    AnalysisResultResponse,
    ExplainSnippetRequest,
    ExplainSnippetResponse,
)
from app.services.document_service import get_document, process_document
from app.pipelines.ai_pipeline import explain_snippet

router = APIRouter(prefix="/documents")
logger = logging.getLogger(__name__)

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/tiff",
}


@router.post("/upload", response_model=UploadDocumentResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    target_language: str = Form(default="en"),
):
    settings = get_settings()

    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type: {file.content_type}. Allowed: PDF, JPEG, PNG, WEBP, TIFF",
        )

    file_bytes = await file.read()

    if len(file_bytes) > settings.max_file_size_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {settings.max_file_size_mb}MB",
        )

    record = DocumentRecord(
        filename=file.filename or "document",
        file_size=len(file_bytes),
        mime_type=file.content_type,
        target_language=target_language,
    )

    # Store immediately so status polling works right away
    from app.services.document_service import _store
    _store[record.id] = record

    # Process in background
    background_tasks.add_task(process_document, record, file_bytes)

    logger.info("Queued document %s (%s)", record.id, record.filename)

    return UploadDocumentResponse(
        document_id=record.id,
        status=ProcessingStatus.PENDING,
        message="Document uploaded successfully. Processing started.",
    )


@router.get("/{document_id}/status", response_model=ProcessingStatusResponse)
async def get_status(document_id: str):
    record = get_document(document_id)
    if not record:
        raise HTTPException(status_code=404, detail="Document not found")

    return ProcessingStatusResponse(
        document_id=document_id,
        status=record.status,
        progress_pct=record.progress_pct,
        current_step=record.current_step,
        error=record.error,
    )


@router.get("/{document_id}/result", response_model=AnalysisResultResponse)
async def get_result(document_id: str):
    record = get_document(document_id)
    if not record:
        raise HTTPException(status_code=404, detail="Document not found")
    if record.status == ProcessingStatus.ERROR:
        raise HTTPException(status_code=422, detail=record.error or "Processing failed")
    if record.status != ProcessingStatus.COMPLETE or not record.analysis:
        raise HTTPException(status_code=202, detail="Processing not complete yet")

    return AnalysisResultResponse(
        document_id=document_id,
        filename=record.filename,
        analysis=record.analysis,
    )


@router.post("/{document_id}/explain", response_model=ExplainSnippetResponse)
async def explain_document_snippet(document_id: str, body: ExplainSnippetRequest):
    record = get_document(document_id)
    if not record:
        raise HTTPException(status_code=404, detail="Document not found")
    if record.status != ProcessingStatus.COMPLETE:
        raise HTTPException(status_code=409, detail="Document processing not complete")
    if not body.snippet.strip():
        raise HTTPException(status_code=400, detail="snippet must not be empty")

    settings = get_settings()
    document_type = record.analysis.document_type if record.analysis else DocumentType.UNKNOWN
    context = record.extracted_text or ""
    # Always use the language the user chose at upload time — never the source language
    target_language = record.target_language

    explanation = await asyncio.get_event_loop().run_in_executor(
        None,
        explain_snippet,
        body.snippet,
        context,
        document_type,
        target_language,
        settings.ollama_model,
    )

    if not explanation:
        explanation = "Gemma wasn't able to explain this phrase right now. Please try selecting a shorter section of text."

    return ExplainSnippetResponse(explanation=explanation)
