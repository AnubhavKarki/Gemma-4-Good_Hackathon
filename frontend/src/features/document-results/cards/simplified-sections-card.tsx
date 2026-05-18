"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Languages, ChevronDown, Sparkles, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SimplifiedSection } from "@/types/document";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

interface SimplifiedSectionsCardProps {
  sections: SimplifiedSection[];
  fullTranslation?: string;
  documentId?: string;
  targetLanguage?: string;
}

// ── Fallback section item (used when no full_translation) ──────────────────
function SectionItem({ section, index }: { section: SimplifiedSection; index: number }) {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div className="rounded-2xl border-2 border-black overflow-hidden shadow-brutal-sm">
      {section.section_title && (
        <div className="bg-muted px-4 py-2 border-b border-border">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Section {index + 1}: {section.section_title}
          </p>
        </div>
      )}
      <div className="p-4 space-y-4">
        <div className="space-y-1.5">
          <p className="text-xs font-bold text-primary uppercase tracking-wide">Plain language</p>
          <p className="text-sm leading-relaxed text-foreground">{section.simplified}</p>
        </div>
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showOriginal && "rotate-180")} />
          {showOriginal ? "Hide" : "Show"} original text
        </button>
        <AnimatePresence>
          {showOriginal && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl bg-muted/60 border border-border px-4 py-3">
                <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                  {section.original}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Explanation modal ──────────────────────────────────────────────────────
interface ExplainModalProps {
  snippet: string;
  explanation: string;
  loading: boolean;
  onClose: () => void;
}

function ExplainModal({ snippet, explanation, loading, onClose }: ExplainModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="w-full max-w-md rounded-3xl border-2 border-black bg-white shadow-brutal p-6 space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500 border border-black shrink-0">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <p className="font-black text-base">Explaining this phrase</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 hover:bg-muted transition-colors shrink-0"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Selected snippet */}
          <div className="rounded-xl bg-violet-50 border border-violet-200 px-4 py-2.5">
            <p className="text-xs font-bold text-violet-600 uppercase tracking-wide mb-1">
              You selected
            </p>
            <p className="text-sm font-semibold text-violet-900 italic leading-relaxed line-clamp-3">
              &ldquo;{snippet}&rdquo;
            </p>
          </div>

          {/* Explanation */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-foreground uppercase tracking-wide">
              What this means
            </p>
            {loading ? (
              <div className="flex items-center gap-2.5 py-4 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                <span className="text-sm">Asking Gemma to explain this…</span>
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-foreground">{explanation}</p>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full font-semibold border-2 border-black"
            onClick={onClose}
          >
            Got it
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Floating "Explain" button ─────────────────────────────────────────────
interface FloatingExplainBtnProps {
  x: number;
  y: number;
  onClick: () => void;
}

function FloatingExplainBtn({ x, y, onClick }: FloatingExplainBtnProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.12 }}
      style={{ position: "fixed", left: x, top: y, transform: "translate(-50%, -100%)" }}
      className="z-40 flex items-center gap-1.5 rounded-full bg-violet-600 border-2 border-black px-3 py-1.5 text-xs font-bold text-white shadow-brutal-sm hover:bg-violet-700 active:scale-95 transition-all"
      onMouseDown={(e) => {
        e.preventDefault(); // prevent selection from clearing before click fires
        onClick();
      }}
    >
      <Sparkles className="h-3 w-3" />
      Explain this
    </motion.button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export function SimplifiedSectionsCard({
  sections,
  fullTranslation,
  documentId,
  targetLanguage = "en",
}: SimplifiedSectionsCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [floatingBtn, setFloatingBtn] = useState<{ x: number; y: number } | null>(null);
  const [selectedSnippet, setSelectedSnippet] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [explaining, setExplaining] = useState(false);

  const handleSelectionChange = useCallback(() => {
    const sel = window.getSelection();
    const text = sel?.toString().trim() ?? "";

    if (text.length < 4 || !sel?.rangeCount) {
      setFloatingBtn(null);
      return;
    }

    // Only show button if selection is inside our container
    const range = sel.getRangeAt(0);
    if (containerRef.current && !containerRef.current.contains(range.commonAncestorContainer)) {
      setFloatingBtn(null);
      return;
    }

    const rect = range.getBoundingClientRect();
    setSelectedSnippet(text);
    setFloatingBtn({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [handleSelectionChange]);

  const handleExplainClick = useCallback(async () => {
    if (!selectedSnippet || !documentId) return;
    setFloatingBtn(null);
    setExplanation("");
    setExplaining(true);
    setModalOpen(true);

    try {
      const res = await apiClient.documents.explainSnippet(documentId, selectedSnippet, targetLanguage);
      setExplanation(res.explanation);
    } catch {
      setExplanation("Sorry, couldn't get an explanation right now. Try again in a moment.");
    } finally {
      setExplaining(false);
    }
  }, [selectedSnippet, documentId, targetLanguage]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setExplanation("");
  }, []);

  const hasFullTranslation = !!fullTranslation?.trim();

  return (
    <>
      <Card className="border-2 border-black shadow-brutal">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2.5 text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 border border-black">
              <Languages className="h-4 w-4 text-white" />
            </div>
            {hasFullTranslation ? "Full document translation" : "Section by section"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasFullTranslation ? (
            <>
              <div className="flex items-center gap-2 rounded-xl bg-violet-50 border border-violet-200 px-4 py-2.5">
                <Sparkles className="h-4 w-4 text-violet-500 shrink-0" />
                <p className="text-xs font-semibold text-violet-700">
                  Select any text to get an instant explanation from Gemma
                </p>
              </div>
              <div
                ref={containerRef}
                className="rounded-2xl border-2 border-black bg-muted/30 p-5 text-sm leading-8 text-foreground whitespace-pre-wrap select-text cursor-text"
                style={{ userSelect: "text" }}
              >
                {fullTranslation}
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Each section of your document, rewritten in plain language.
              </p>
              {sections.map((section, i) => (
                <SectionItem key={i} section={section} index={i} />
              ))}
            </>
          )}
        </CardContent>
      </Card>

      {/* Floating explain button */}
      <AnimatePresence>
        {floatingBtn && !modalOpen && (
          <FloatingExplainBtn
            x={floatingBtn.x}
            y={floatingBtn.y}
            onClick={handleExplainClick}
          />
        )}
      </AnimatePresence>

      {/* Explanation modal */}
      {modalOpen && (
        <ExplainModal
          snippet={selectedSnippet}
          explanation={explanation}
          loading={explaining}
          onClose={closeModal}
        />
      )}
    </>
  );
}
