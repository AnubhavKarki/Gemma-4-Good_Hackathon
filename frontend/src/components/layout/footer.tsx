import { Sparkles, Heart } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t-2 border-black bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary border border-black">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">{APP_NAME}</span>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            Built with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> for people who deserve to understand.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by Gemma 4 E4B · Runs locally · Private by design
          </p>
        </div>
      </div>
    </footer>
  );
}
