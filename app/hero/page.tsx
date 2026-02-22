import HeroDemo from "@/components/HeroDemo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hero Showcase",
  description: "Visual showcase page for the ClauseWala hero section.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HeroPage() {
  return <HeroDemo />;
}
