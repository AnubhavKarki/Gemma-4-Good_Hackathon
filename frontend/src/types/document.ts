// Core document types that mirror the backend Pydantic schemas

export type DocumentType =
  | "rental_agreement"
  | "government_form"
  | "healthcare"
  | "banking"
  | "employment_contract"
  | "immigration"
  | "educational"
  | "unknown";

export type RiskLevel = "low" | "medium" | "high";

export interface GlossaryItem {
  term: string;
  definition: string;
  cultural_note?: string;
}

export interface SimplifiedSection {
  original: string;
  simplified: string;
  section_title?: string;
}

export interface Deadline {
  description: string;
  date?: string;
  urgency: RiskLevel;
}

export interface Risk {
  description: string;
  level: RiskLevel;
  recommendation?: string;
}

export interface ActionItem {
  action: string;
  priority: RiskLevel;
  due_by?: string;
}

export interface DocumentAnalysis {
  document_type: DocumentType;
  language_detected: string;
  summary: string;
  important_points: string[];
  deadlines: Deadline[];
  risks: Risk[];
  simplified_sections: SimplifiedSection[];
  glossary: GlossaryItem[];
  action_items: ActionItem[];
  full_translation?: string;
  confidence_score: number;
  processing_time_ms: number;
}

export interface UploadedDocument {
  id: string;
  filename: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
  status: ProcessingStatus;
  analysis?: DocumentAnalysis;
}

export type ProcessingStatus =
  | "pending"
  | "extracting_text"
  | "classifying"
  | "analyzing"
  | "complete"
  | "error";

export interface ProcessingStep {
  id: string;
  label: string;
  description: string;
  status: "pending" | "active" | "complete" | "error";
}

export const PROCESSING_STEPS: ProcessingStep[] = [
  {
    id: "extract",
    label: "Reading Document",
    description: "Extracting text from your document...",
    status: "pending",
  },
  {
    id: "classify",
    label: "Identifying Document Type",
    description: "Figuring out what kind of document this is...",
    status: "pending",
  },
  {
    id: "simplify",
    label: "Simplifying Language",
    description: "Translating complex terms into plain language...",
    status: "pending",
  },
  {
    id: "analyze",
    label: "Finding Key Information",
    description: "Identifying deadlines, risks, and actions for you...",
    status: "pending",
  },
  {
    id: "complete",
    label: "Preparing Your Results",
    description: "Almost done! Getting everything ready...",
    status: "pending",
  },
];
