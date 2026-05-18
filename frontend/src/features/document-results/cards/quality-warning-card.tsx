"use client";

import { AlertTriangle, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { DocumentAnalysis } from "@/types/document";

interface QualityWarningCardProps {
  analysis: DocumentAnalysis;
}

function isPartialResult(analysis: DocumentAnalysis): boolean {
  const hasNoContent =
    analysis.important_points.length === 0 &&
    analysis.simplified_sections.length === 0 &&
    !analysis.full_translation;
  return hasNoContent;
}

export function QualityWarningCard({ analysis }: QualityWarningCardProps) {
  if (!isPartialResult(analysis)) return null;

  return (
    <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 shadow-brutal-sm p-5 space-y-3">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 border-2 border-black shrink-0">
          <AlertTriangle className="h-4 w-4 text-white" />
        </div>
        <div className="space-y-1">
          <p className="font-black text-amber-900">Document partially understood</p>
          <p className="text-sm text-amber-800 leading-relaxed">
            Gemma could only partially read this document — likely because it was uploaded as a
            scanned image or photo. The results below may be incomplete.
          </p>
        </div>
      </div>
      <div className="rounded-xl bg-white border border-amber-200 px-4 py-3 flex items-start gap-3">
        <FileText className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-900">
          <span className="font-bold">For better results:</span> Upload a PDF with selectable text
          rather than a photo or scan. PDFs allow Gemma to read every word precisely.
        </p>
      </div>
      <Link href="/upload">
        <Button
          size="sm"
          variant="outline"
          className="border-2 border-amber-400 text-amber-900 hover:bg-amber-100 font-semibold"
        >
          Upload a better version
        </Button>
      </Link>
    </div>
  );
}
