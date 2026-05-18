import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RISK_LEVEL_CONFIG } from "@/lib/constants";
import type { Risk } from "@/types/document";
import { cn } from "@/lib/utils";

interface RisksCardProps {
  risks: Risk[];
}

export function RisksCard({ risks }: RisksCardProps) {
  return (
    <Card className="border-2 border-black shadow-brutal">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2.5 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 border border-black">
            <AlertTriangle className="h-4 w-4 text-black" />
          </div>
          Watch out for
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {risks.map((risk, i) => {
          const config = RISK_LEVEL_CONFIG[risk.level];
          return (
            <div
              key={i}
              className={cn("rounded-xl border p-4 space-y-2", config.bg, config.border)}
            >
              <div className="flex items-start gap-2">
                <div className={cn("mt-1 h-2 w-2 rounded-full shrink-0", config.dot)} />
                <p className={cn("text-sm font-semibold leading-relaxed", config.color)}>
                  {risk.description}
                </p>
              </div>
              {risk.recommendation && (
                <p className="text-xs text-muted-foreground pl-4 leading-relaxed">
                  Tip: {risk.recommendation}
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
