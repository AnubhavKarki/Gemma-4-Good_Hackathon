import { ListChecks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RISK_LEVEL_CONFIG } from "@/lib/constants";
import type { ActionItem } from "@/types/document";
import { cn } from "@/lib/utils";

interface ActionItemsCardProps {
  items: ActionItem[];
}

export function ActionItemsCard({ items }: ActionItemsCardProps) {
  const sorted = [...items].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <Card className="border-2 border-black shadow-brutal bg-brand-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2.5 text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary border border-black">
            <ListChecks className="h-4 w-4 text-white" />
          </div>
          What you need to do
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {sorted.map((item, i) => {
            const config = RISK_LEVEL_CONFIG[item.priority];
            return (
              <li
                key={i}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-4",
                  config.bg,
                  config.border
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 h-5 w-5 rounded-full border-2 border-current flex items-center justify-center shrink-0",
                    config.color
                  )}
                >
                  <span className="text-xs font-black">{i + 1}</span>
                </div>
                <div className="flex-1 space-y-1">
                  <p className={cn("text-sm font-semibold leading-relaxed", config.color)}>
                    {item.action}
                  </p>
                  {item.due_by && (
                    <p className="text-xs font-medium opacity-70">Due: {item.due_by}</p>
                  )}
                </div>
                <Badge
                  variant={
                    item.priority === "high"
                      ? "danger"
                      : item.priority === "medium"
                      ? "warning"
                      : "success"
                  }
                  className="shrink-0 text-xs"
                >
                  {config.label}
                </Badge>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
