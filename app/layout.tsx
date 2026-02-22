import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import DocumentStoreProvider from "@/components/DocumentStoreProvider";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://clausewala.vishwadev.tech"),
  title: {
    default: "ClauseWala. — AI Legal Documents for Indian Startups",
    template: "%s | ClauseWala.",
  },
  description:
    "Draft legally sound Indian contracts in minutes. NDAs, MOUs, offer letters, co-founder agreements, ESOP grants and 16 more — AI-powered, clause-by-clause reviewed, export as PDF or DOCX. Free during public beta.",
  keywords: [
    "legal documents India",
    "NDA generator India",
    "startup contracts India",
    "AI legal drafting",
    "ClauseWala",
    "Indian contract generator",
    "MOU template India",
    "offer letter generator India",
    "ESOP grant letter",
    "co-founder agreement India",
    "legal notice generator",
    "appointment letter India",
    "startup legal documents",
    "Indian startup contracts",
    "free legal templates India",
    "AI contract drafting",
    "board resolution template",
    "IP assignment agreement",
    "relieving letter generator",
    "vendor onboarding letter",
  ],
  authors: [{ name: "ClauseWala" }],
  creator: "ClauseWala",
  publisher: "ClauseWala",
  category: "Legal Technology",
  icons: {
    icon: [
      { url: "/brand/logo-mark.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/logo-mark.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/brand/logo-mark.png",
    shortcut: "/brand/logo-mark.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://clausewala.vishwadev.tech",
    siteName: "ClauseWala.",
    title: "ClauseWala. — AI Legal Documents for Indian Startups",
    description: "Draft legally sound Indian contracts in minutes — NDAs, MOUs, offer letters, co-founder agreements and more. AI-powered, free during public beta.",
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "ClauseWala — AI Legal Documents for Indian Startups",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClauseWala. — AI Legal Documents for Indian Startups",
    description: "Draft legally sound Indian contracts in minutes — NDAs, MOUs, offer letters, co-founder agreements and more. AI-powered, free during public beta.",
    images: ["/brand/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://clausewala.vishwadev.tech",
  },
  verification: {},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "ClauseWala",
              applicationCategory: "LegalService",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
                description: "Free during public beta",
              },
              description:
                "AI-powered legal document generation platform for Indian startups. Draft NDAs, MOUs, offer letters, co-founder agreements and more.",
              url: "https://clausewala.vishwadev.tech",
              author: {
                "@type": "Organization",
                name: "ClauseWala",
                url: "https://clausewala.vishwadev.tech",
              },
              areaServed: {
                "@type": "Country",
                name: "India",
              },
            }),
          }}
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
