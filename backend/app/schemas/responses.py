from pydantic import BaseModel
from typing import Optional
from .document import DocumentAnalysis, ProcessingStatus


class UploadDocumentResponse(BaseModel):
    document_id: str
    status: ProcessingStatus
    message: str


class ProcessingStatusResponse(BaseModel):
    document_id: str
    status: ProcessingStatus
    progress_pct: int
    current_step: str
    error: Optional[str] = None


class AnalysisResultResponse(BaseModel):
    document_id: str
    filename: str
    analysis: DocumentAnalysis


class ExplainSnippetRequest(BaseModel):
    snippet: str
    target_language: str = "en"


class ExplainSnippetResponse(BaseModel):
    explanation: str


class HealthCheckResponse(BaseModel):
    status: str
    ollama_connected: bool
    model_loaded: str
    version: str = "0.1.0"
