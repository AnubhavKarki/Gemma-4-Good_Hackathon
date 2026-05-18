"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { slideUp, staggerContainer, staggerItem } from "@/animations/variants";
import { DropZone } from "./drop-zone";
import { LanguageSelector } from "./language-selector";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useDocumentStore } from "@/stores/document-store";
import { formatFileSize } from "@/lib/utils";

export function UploadPageContent() {
  const router = useRouter();
  const { setUploadedFile, setDocumentId, setTargetLanguage, targetLanguage } = useDocumentStore();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = (selected: File) => {
    setFile(selected);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      setUploadedFile(file);
      const response = await apiClient.documents.upload(file, targetLanguage);
      setDocumentId(response.document_id);
      router.push(`/processing?id=${response.document_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {/* Header */}
        <motion.div variants={staggerItem} className="space-y-3">
          <h1 className="text-4xl font-black tracking-tight">
            Upload your document
          </h1>
          <p className="text-lg text-muted-foreground">
            Any PDF, photo, or scan. We&apos;ll handle the rest — right here on your device.
          </p>
        </motion.div>

        {/* Drop zone */}
        <motion.div variants={staggerItem}>
          <DropZone onFileSelected={handleFileSelected} selectedFile={file} />
        </motion.div>

        {/* File info */}
        {file && (
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border-2 border-black bg-brand-50 p-4 flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary border border-black shrink-0">
              <span className="text-white text-xs font-bold">PDF</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          </motion.div>
        )}

        {/* Language selector */}
        <motion.div variants={staggerItem} className="space-y-3">
          <label className="text-sm font-bold">
            What language would you like explanations in?
          </label>
          <LanguageSelector
            value={targetLanguage}
            onChange={setTargetLanguage}
          />
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Info className="h-3 w-3 shrink-0" />
            The document itself can be in any language — we&apos;ll detect it automatically.
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
            className="rounded-xl border-2 border-red-300 bg-red-50 p-4 text-sm text-red-700 font-medium"
          >
            {error}
          </motion.div>
        )}

        {/* Submit */}
        <motion.div variants={staggerItem}>
          <Button
            size="xl"
            onClick={handleSubmit}
            disabled={!file || uploading}
            className="w-full gap-2 font-black"
          >
            {uploading ? "Uploading..." : "Analyse My Document"}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
