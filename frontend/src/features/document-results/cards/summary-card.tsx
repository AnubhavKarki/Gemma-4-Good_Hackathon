import { BookOpen, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryCardProps {
  summary: string;
  importantPoints: string[];
}

export function SummaryCard({ summary, importantPoints }: SummaryCardProps) {
  return (
    <Card className="border-2 border-black shadow-brutal">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2.5 text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary border border-black">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          What this document is about
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-base leading-relaxed text-foreground">{summary}</p>

        {importantPoints.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
              Key points
            </p>
            <ul className="space-y-2.5">
              {importantPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
