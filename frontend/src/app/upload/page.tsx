import { Navbar } from "@/components/layout/navbar";
import { UploadPageContent } from "@/features/document-upload/upload-page-content";

export const metadata = { title: "Upload Document" };

export default function UploadPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <UploadPageContent />
      </main>
    </div>
  );
}
