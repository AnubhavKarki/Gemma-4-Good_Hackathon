import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { ResultsPageContent } from "@/features/document-results/results-page-content";

export const metadata = { title: "Your Document Explained" };

export default function ResultsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Loading...</div>}>
          <ResultsPageContent />
        </Suspense>
      </main>
    </div>
  );
}
