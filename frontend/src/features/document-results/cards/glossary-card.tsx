"use client";

import { BookMarked, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GlossaryItem } from "@/types/document";

interface GlossaryCardProps {
  items: GlossaryItem[];
}

function GlossaryEntry({ item, index }: { item: GlossaryItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border-2 border-black overflow-hidden shadow-brutal-sm"
    >
      {/* Term header */}
      <div className="flex items-center gap-2 bg-purple-50 border-b-2 border-black px-4 py-2.5">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-white text-[10px] font-black shrink-0">
          {index + 1}
        </span>
        <span className="font-black text-sm text-purple-900">{item.term}</span>
      </div>

      {/* Definition */}
      <div className="px-4 py-3 space-y-2.5 bg-white">
        <p className="text-sm leading-relaxed text-foreground">{item.definition}</p>

        {item.cultural_note && (
          <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5">
            <Globe className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <span className="font-bold">In context: </span>
              {item.cultural_note}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function GlossaryCard({ items }: GlossaryCardProps) {
  return (
    <Card className="border-2 border-black shadow-brutal">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2.5 text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500 border border-black">
            <BookMarked className="h-4 w-4 text-white" />
          </div>
          Word glossary
          <span className="ml-auto text-xs font-semibold text-muted-foreground bg-muted rounded-full px-2.5 py-1">
            {items.length} terms
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Technical and legal terms from your document, explained in plain language.
        </p>
        <div className="space-y-3">
          {items.map((item, i) => (
            <GlossaryEntry key={i} item={item} index={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
