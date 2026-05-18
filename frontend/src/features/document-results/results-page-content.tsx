"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations/variants";
import { useDocumentStore } from "@/stores/document-store";
import { apiClient } from "@/lib/api-client";
import type { AnalysisResultResponse } from "@/types/api";
import { SummaryCard } from "./cards/summary-card";
import { ActionItemsCard } from "./cards/action-items-card";
import { RisksCard } from "./cards/risks-card";
import { DeadlinesCard } from "./cards/deadlines-card";
import { GlossaryCard } from "./cards/glossary-card";
import { SimplifiedSectionsCard } from "./cards/simplified-sections-card";
import { DocumentHeaderBadge } from "./document-header-badge";
import { Button } from "@/components/ui/button";
import { Upload, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export function ResultsPageContent() {
  const searchParams = useSearchParams();
  const documentId = searchParams.get("id");
  const {
    result: storeResult,
    reset,
    setResult,
    targetLanguage: storeLanguage,
  } = useDocumentStore();
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // If store is empty (e.g. page refresh), re-fetch from API
  useEffect(() => {
    if (storeResult || !documentId) return;
    setLoading(true);
    apiClient.documents
      .getResult(documentId)
      .then((data: AnalysisResultResponse) => {
        setResult(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setFetchError(err.message);
        setLoading(false);
      });
  }, [documentId, storeResult, setResult]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading your results...
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 border-2 border-red-300 mx-auto">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black">Couldn&apos;t load results</h1>
          <p className="text-sm text-muted-foreground">{fetchError}</p>
        </div>
        <Link href="/upload">
          <Button className="gap-2">
            <Upload className="h-4 w-4" /> Try again
          </Button>
        </Link>
      </div>
    );
  }

  if (!storeResult) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center space-y-6">
        <h1 className="text-3xl font-black">No results yet</h1>
        <p className="text-muted-foreground">Upload a document to get started.</p>
        <Link href="/upload">
          <Button size="lg" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload a Document
          </Button>
        </Link>
      </div>
    );
  }

  const { analysis, filename } = storeResult;

  // The target language is whatever the user chose at upload time.
  // storeLanguage is reliable during the same session; falls back to "en" on refresh.
  const targetLanguage = storeLanguage || "en";

  const hasTranslationContent =
    !!analysis.full_translation || analysis.simplified_sections.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* ── 1. Header ── */}
        <motion.div variants={staggerItem} className="space-y-4">
          <DocumentHeaderBadge
            documentType={analysis.document_type}
            filename={filename}
            language={analysis.language_detected}
            confidence={analysis.confidence_score}
          />
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black flex-1">Your document, explained.</h1>
            <Button variant="outline" size="sm" onClick={reset} asChild>
              <Link href="/upload" className="gap-2">
                <RefreshCw className="h-4 w-4" /> New Document
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* ── 2. Summary + key points ── */}
        <motion.div variants={staggerItem}>
          <SummaryCard
            summary={analysis.summary}
            importantPoints={analysis.important_points}
          />
        </motion.div>

        {/* ── 4. Action items ── */}
        {analysis.action_items.length > 0 && (
          <motion.div variants={staggerItem}>
            <ActionItemsCard items={analysis.action_items} />
          </motion.div>
        )}

        {/* ── 5. Risks + Deadlines side by side ── */}
        {(analysis.risks.length > 0 || analysis.deadlines.length > 0) && (
          <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis.risks.length > 0 && <RisksCard risks={analysis.risks} />}
            {analysis.deadlines.length > 0 && <DeadlinesCard deadlines={analysis.deadlines} />}
          </motion.div>
        )}

        {/* ── 6. Full translation / section-by-section ── */}
        {hasTranslationContent && (
          <motion.div variants={staggerItem}>
            <SimplifiedSectionsCard
              sections={analysis.simplified_sections}
              fullTranslation={analysis.full_translation}
              documentId={storeResult.document_id}
              targetLanguage={targetLanguage}
            />
          </motion.div>
        )}

        {/* ── 7. Glossary ── */}
        {analysis.glossary.length > 0 && (
          <motion.div variants={staggerItem}>
            <GlossaryCard items={analysis.glossary} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
