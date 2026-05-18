from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional
import uuid
from datetime import datetime


class DocumentType(str, Enum):
    RENTAL_AGREEMENT = "rental_agreement"
    GOVERNMENT_FORM = "government_form"
    HEALTHCARE = "healthcare"
    BANKING = "banking"
    EMPLOYMENT_CONTRACT = "employment_contract"
    IMMIGRATION = "immigration"
    EDUCATIONAL = "educational"
    UNKNOWN = "unknown"


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class GlossaryItem(BaseModel):
    term: str
    definition: str
    cultural_note: Optional[str] = None


class SimplifiedSection(BaseModel):
    original: str
    simplified: str
    section_title: Optional[str] = None


class Deadline(BaseModel):
    description: str
    date: Optional[str] = None
    urgency: RiskLevel = RiskLevel.MEDIUM


class Risk(BaseModel):
    description: str
    level: RiskLevel
    recommendation: Optional[str] = None


class ActionItem(BaseModel):
    action: str
    priority: RiskLevel
    due_by: Optional[str] = None


class DocumentAnalysis(BaseModel):
    document_type: DocumentType
    language_detected: str = "en"
    summary: str
    important_points: list[str] = Field(default_factory=list)
    deadlines: list[Deadline] = Field(default_factory=list)
    risks: list[Risk] = Field(default_factory=list)
    simplified_sections: list[SimplifiedSection] = Field(default_factory=list)
    glossary: list[GlossaryItem] = Field(default_factory=list)
    action_items: list[ActionItem] = Field(default_factory=list)
    full_translation: Optional[str] = None
    confidence_score: float = Field(default=0.85, ge=0.0, le=1.0)
    processing_time_ms: int = 0


class ProcessingStatus(str, Enum):
    PENDING = "pending"
    EXTRACTING_TEXT = "extracting_text"
    CLASSIFYING = "classifying"
    ANALYZING = "analyzing"
    COMPLETE = "complete"
    ERROR = "error"


class DocumentRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    file_size: int
    mime_type: str
    target_language: str = "en"
    status: ProcessingStatus = ProcessingStatus.PENDING
    progress_pct: int = 0
    current_step: str = ""
    error: Optional[str] = None
    analysis: Optional[DocumentAnalysis] = None
    extracted_text: Optional[str] = None
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
