import type { DocumentAnalysis, ProcessingStatus } from "./document";

// API request/response shapes

export interface UploadDocumentResponse {
  document_id: string;
  status: ProcessingStatus;
  message: string;
}

export interface ProcessingStatusResponse {
  document_id: string;
  status: ProcessingStatus;
  progress_pct: number;
  current_step: string;
  error?: string;
}

export interface AnalysisResultResponse {
  document_id: string;
  filename: string;
  analysis: DocumentAnalysis;
}

export interface ExplainSnippetResponse {
  explanation: string;
}

export interface ApiError {
  detail: string;
  status_code: number;
}

export interface HealthCheckResponse {
  status: "healthy" | "degraded";
  ollama_connected: boolean;
  model_loaded: string;
  version: string;
}
