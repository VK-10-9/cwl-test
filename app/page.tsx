"use client";

import HeroDemo from "@/components/HeroDemo";
import Features from "@/components/Features";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative">

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroDemo />

      {/* Divider */}
      <div className="relative z-10 w-full">
        <div className="max-w-5xl mx-auto px-8">
          <div className="section-divider" />
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 w-full bg-background">
        <Features />
      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
}
