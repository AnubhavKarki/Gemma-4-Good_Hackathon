import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { ProcessingPageContent } from "@/features/processing/processing-page-content";

export const metadata = { title: "Analysing Your Document..." };

export default function ProcessingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Loading...</div>}>
          <ProcessingPageContent />
        </Suspense>
      </main>
    </div>
  );
}
