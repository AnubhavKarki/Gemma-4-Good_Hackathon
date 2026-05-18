"use client";

import { motion } from "framer-motion";
import { Check, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { threshold: 0, label: "Extracting text from document" },
  { threshold: 25, label: "Identifying document type" },
  { threshold: 50, label: "Simplifying complex language" },
  { threshold: 70, label: "Finding deadlines & risks" },
  { threshold: 90, label: "Preparing your results" },
];

interface ProcessingStepListProps {
  progress: number;
}

export function ProcessingStepList({ progress }: ProcessingStepListProps) {
  return (
    <div className="text-left space-y-3">
      {STEPS.map((step, i) => {
        const isComplete = progress > step.threshold + 20;
        const isActive = progress >= step.threshold && !isComplete;

        return (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: progress >= step.threshold ? 1 : 0.35, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3"
          >
            <div
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border-2 shrink-0 transition-all duration-300",
                isComplete
                  ? "bg-primary border-black"
                  : isActive
                  ? "border-primary bg-primary/10"
                  : "border-border bg-muted"
              )}
            >
              {isComplete ? (
                <Check className="h-3.5 w-3.5 text-white" />
              ) : isActive ? (
                <Loader2 className="h-3 w-3 text-primary animate-spin" />
              ) : (
                <Circle className="h-2.5 w-2.5 text-muted-foreground" />
              )}
            </div>
            <span
              className={cn(
                "text-sm font-medium transition-colors duration-300",
                isComplete
                  ? "text-foreground line-through opacity-60"
                  : isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
