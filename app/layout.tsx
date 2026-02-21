import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import DocumentStoreProvider from "@/components/DocumentStoreProvider";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://clausewala.com"),
  title: {
    default: "ClauseWala. — Contracts. Simplified.",
    template: "%s — ClauseWala.",
  },
  description:
    "AI-powered legal documents for Indian startups. Draft NDAs, MOUs, offer letters, co-founder agreements and 18 more — clause by clause, export-ready.",
  keywords: [
    "legal documents India",
    "NDA generator India",
    "startup contracts",
    "AI legal drafting",
    "ClauseWala",
    "Indian contract generator",
    "MOU template India",
    "offer letter generator",
    "ESOP grant letter",
    "co-founder agreement",
  ],
  authors: [{ name: "ClauseWala" }],
  creator: "ClauseWala",
  icons: {
    icon: "/brand/logo-mark.png",
    apple: "/brand/logo-mark.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://clausewala.com",
    siteName: "ClauseWala.",
    title: "ClauseWala. — Contracts. Simplified.",
    description: "AI-powered legal documents for Indian startups. Draft contracts in minutes, not days.",
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "ClauseWala — Contracts. Simplified.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClauseWala. — Contracts. Simplified.",
    description: "AI-powered legal documents for Indian startups. Draft contracts in minutes, not days.",
    images: ["/brand/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Ideally use next/font, but keeping existing link for compatibility */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <DocumentStoreProvider>
            {children}
          </DocumentStoreProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
