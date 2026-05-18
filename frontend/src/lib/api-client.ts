import axios, { type AxiosInstance, type AxiosError } from "axios";
import type {
  UploadDocumentResponse,
  ProcessingStatusResponse,
  AnalysisResultResponse,
  ExplainSnippetResponse,
  HealthCheckResponse,
} from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const httpClient: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 120_000, // 2 min — AI processing can take time
  headers: {
    Accept: "application/json",
  },
});

httpClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const message =
      (error.response?.data as { detail?: string })?.detail ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

export const apiClient = {
  health: {
    check: (): Promise<HealthCheckResponse> =>
      httpClient.get("/health").then((r) => r.data),
  },

  documents: {
    upload: (file: File, targetLanguage = "en"): Promise<UploadDocumentResponse> => {
      const form = new FormData();
      form.append("file", file);
      form.append("target_language", targetLanguage);
      return httpClient
        .post("/documents/upload", form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => r.data);
    },

    getStatus: (documentId: string): Promise<ProcessingStatusResponse> =>
      httpClient.get(`/documents/${documentId}/status`).then((r) => r.data),

    getResult: (documentId: string): Promise<AnalysisResultResponse> =>
      httpClient.get(`/documents/${documentId}/result`).then((r) => r.data),

    explainSnippet: (
      documentId: string,
      snippet: string,
      targetLanguage = "en"
    ): Promise<ExplainSnippetResponse> =>
      httpClient
        .post(`/documents/${documentId}/explain`, { snippet, target_language: targetLanguage })
        .then((r) => r.data),

    pollUntilComplete: async (
      documentId: string,
      onProgress: (status: ProcessingStatusResponse) => void,
      intervalMs = 1500
    ): Promise<AnalysisResultResponse> => {
      return new Promise((resolve, reject) => {
        const poll = async () => {
          try {
            const status = await apiClient.documents.getStatus(documentId);
            onProgress(status);

            if (status.status === "complete") {
              const result = await apiClient.documents.getResult(documentId);
              resolve(result);
            } else if (status.status === "error") {
              reject(new Error(status.error || "Processing failed"));
            } else {
              setTimeout(poll, intervalMs);
            }
          } catch (err) {
            reject(err);
          }
        };
        poll();
      });
    },
  },
};
