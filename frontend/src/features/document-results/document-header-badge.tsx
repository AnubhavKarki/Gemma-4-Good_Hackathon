import { Badge } from "@/components/ui/badge";
import { FileText, Globe, Gauge } from "lucide-react";
import { DOCUMENT_TYPE_LABELS } from "@/lib/constants";
import type { DocumentType } from "@/types/document";

interface DocumentHeaderBadgeProps {
  documentType: DocumentType;
  filename: string;
  language: string;
  confidence: number;
}

export function DocumentHeaderBadge({
  documentType,
  filename,
  language,
  confidence,
}: DocumentHeaderBadgeProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default" className="gap-1.5 text-xs py-1 px-3">
        <FileText className="h-3 w-3" />
        {DOCUMENT_TYPE_LABELS[documentType] || "Document"}
      </Badge>
      <Badge variant="muted" className="gap-1.5 text-xs py-1 px-3">
        <Globe className="h-3 w-3" />
        {language.toUpperCase()}
      </Badge>
      <Badge
        variant={confidence > 0.8 ? "success" : "warning"}
        className="gap-1.5 text-xs py-1 px-3"
      >
        <Gauge className="h-3 w-3" />
        {Math.round(confidence * 100)}% confidence
      </Badge>
      <span className="text-xs text-muted-foreground truncate max-w-[200px]">{filename}</span>
    </div>
  );
}
