import type { Metadata } from "next";
import HeroDemo from "@/components/HeroDemo";
import Features from "@/components/Features";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AI Legal Documents for Indian Startups",
  description:
    "Create Indian legal documents in minutes with AI. Generate NDAs, MOUs, offer letters, co-founder agreements, ESOP grants, legal notices, and more.",
  alternates: {
    canonical: "/",
  },
};

export default function LandingPage() {
  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative">
      <Navbar />
      <HeroDemo />
      <div className="relative z-10 w-full">
        <div className="max-w-5xl mx-auto px-8">
          <div className="section-divider" />
        </div>
      </div>
      <div id="features" className="relative z-10 w-full bg-background">
        <Features />
      </div>
      <Footer />
    </div>
  );
}
