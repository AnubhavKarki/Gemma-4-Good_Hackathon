import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/features/landing/hero-section";
import { HowItWorksSection } from "@/features/landing/how-it-works-section";
import { DocumentTypesSection } from "@/features/landing/document-types-section";
import { PrivacySection } from "@/features/landing/privacy-section";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <DocumentTypesSection />
        <PrivacySection />
      </main>
      <Footer />
    </div>
  );
}
