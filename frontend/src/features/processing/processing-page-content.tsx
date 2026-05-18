"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, processingOrb } from "@/animations/variants";
import { Progress } from "@/components/ui/progress";
import { ProcessingStepList } from "./processing-step-list";
import { apiClient } from "@/lib/api-client";
import { useDocumentStore } from "@/stores/document-store";
import { Sparkles } from "lucide-react";

const REASSURING_MESSAGES = [
  "Taking a careful look at your document...",
  "Making sense of the complex parts...",
  "Identifying what's important for you...",
  "Translating into your language...",
  "Almost there — preparing your results...",
];

export function ProcessingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const documentId = searchParams.get("id");
  const { updateProcessingStatus, setResult, processingProgress } = useDocumentStore();
  const hasStarted = useRef(false);

  // Smoothly animated display progress — creeps between backend poll updates
  // so the bar never appears frozen.
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (processingProgress >= 100) {
      setDisplayProgress(100);
      return;
    }
    // Immediately jump to at least the real progress value
    setDisplayProgress((prev) => Math.max(prev, processingProgress));

    // Slowly creep forward until next poll — cap at (realProgress + 32) or 93%
    const ceiling = Math.min(processingProgress + 32, 93);
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev >= ceiling) return prev;
        return Math.min(+(prev + 0.25).toFixed(2), ceiling);
      });
    }, 350);
    return () => clearInterval(interval);
  }, [processingProgress]);

  useEffect(() => {
    if (!documentId) {
      router.replace("/upload");
      return;
    }
    if (hasStarted.current) return;
    hasStarted.current = true;

    apiClient.documents
      .pollUntilComplete(documentId, updateProcessingStatus)
      .then((result) => {
        setResult(result);
        router.push(`/results?id=${documentId}`);
      })
      .catch(() => {
        // Always proceed to results — the results page will fetch whatever is available
        router.push(`/results?id=${documentId}`);
      });
  }, [documentId, router, updateProcessingStatus, setResult]);

  const shownProgress = Math.round(displayProgress);
  const messageIndex = Math.min(
    Math.floor((shownProgress / 100) * REASSURING_MESSAGES.length),
    REASSURING_MESSAGES.length - 1
  );

  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 py-20">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-12 text-center"
      >
        <motion.div variants={staggerItem} className="flex justify-center">
          <motion.div
            variants={processingOrb}
            initial="initial"
            animate="animate"
            className="relative flex h-28 w-28 items-center justify-center rounded-full bg-primary border-4 border-black shadow-brutal"
          >
            <Sparkles className="h-12 w-12 text-white" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 scale-125 animate-ping" />
            <div className="absolute inset-0 rounded-full border border-primary/20 scale-150" />
          </motion.div>
        </motion.div>

        <motion.div variants={staggerItem} className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight">Reading your document</h1>
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg text-muted-foreground"
          >
            {REASSURING_MESSAGES[messageIndex]}
          </motion.p>
        </motion.div>

        <motion.div variants={staggerItem} className="space-y-2">
          <Progress value={shownProgress} className="h-3" />
          <p className="text-sm font-semibold text-muted-foreground">{shownProgress}% complete</p>
        </motion.div>

        <motion.div variants={staggerItem}>
          <ProcessingStepList progress={shownProgress} />
        </motion.div>

        <motion.p variants={staggerItem} className="text-xs text-muted-foreground">
          Gemma 4 is running on your device. This may take up to 60 seconds.
        </motion.p>
      </motion.div>
    </div>
  );
}
