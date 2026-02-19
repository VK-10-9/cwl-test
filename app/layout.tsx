import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocuForge AI — AI-Powered Document Automation",
  description:
    "Generate professionally formatted legal documents in seconds. NDA, MOU, Request Letters, Certificates and more — powered by AI.",
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
        {children}
      </body>
    </html>
  );
}
