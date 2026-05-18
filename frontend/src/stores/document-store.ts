import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { AnalysisResultResponse, ProcessingStatusResponse } from "@/types/api";
import type { ProcessingStatus } from "@/types/document";

interface DocumentStore {
  // Upload state
  uploadedFile: File | null;
  documentId: string | null;
  targetLanguage: string;

  // Processing state
  processingStatus: ProcessingStatus;
  processingProgress: number;
  currentStep: string;
  processingError: string | null;

  // Result state
  result: AnalysisResultResponse | null;

  // Actions
  setUploadedFile: (file: File) => void;
  setDocumentId: (id: string) => void;
  setTargetLanguage: (lang: string) => void;
  updateProcessingStatus: (status: ProcessingStatusResponse) => void;
  setResult: (result: AnalysisResultResponse) => void;
  setError: (error: string) => void;
  reset: () => void;
}

const initialState = {
  uploadedFile: null,
  documentId: null,
  targetLanguage: "en",
  processingStatus: "pending" as ProcessingStatus,
  processingProgress: 0,
  currentStep: "",
  processingError: null,
  result: null,
};

export const useDocumentStore = create<DocumentStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setUploadedFile: (file) => set({ uploadedFile: file }),
      setDocumentId: (id) => set({ documentId: id }),
      setTargetLanguage: (lang) => set({ targetLanguage: lang }),

      updateProcessingStatus: (status) =>
        set({
          processingStatus: status.status,
          processingProgress: status.progress_pct,
          currentStep: status.current_step,
        }),

      setResult: (result) =>
        set({
          result,
          processingStatus: "complete",
          processingProgress: 100,
        }),

      setError: (error) =>
        set({
          processingError: error,
          processingStatus: "error",
        }),

      reset: () => set(initialState),
    }),
    { name: "document-store" }
  )
);
