import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RISK_LEVEL_CONFIG } from "@/lib/constants";
import type { Deadline } from "@/types/document";
import { cn } from "@/lib/utils";

interface DeadlinesCardProps {
  deadlines: Deadline[];
}

export function DeadlinesCard({ deadlines }: DeadlinesCardProps) {
  return (
    <Card className="border-2 border-black shadow-brutal">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2.5 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary border border-black">
            <Clock className="h-4 w-4 text-black" />
          </div>
          Important dates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {deadlines.map((deadline, i) => {
          const config = RISK_LEVEL_CONFIG[deadline.urgency];
          return (
            <div
              key={i}
              className={cn("rounded-xl border p-4 space-y-1", config.bg, config.border)}
            >
              <p className={cn("text-sm font-semibold", config.color)}>
                {deadline.description}
              </p>
              {deadline.date && (
                <p className={cn("text-xs font-bold", config.color)}>
                  📅 {deadline.date}
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
