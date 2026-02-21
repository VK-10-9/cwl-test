import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://clausewala.vishwadev.tech";

  const staticPages = [
    "",
    "/about",
    "/pricing",
    "/contact",
    "/privacy",
    "/terms",
    "/generate",
    "/signin",
  ];

  const docTypes = [
    "nda",
    "mou",
    "consultancy-agreement",
    "service-agreement",
    "offer-letter",
    "appointment-letter",
    "relieving-letter",
    "termination-letter",
    "experience-letter",
    "internship-letter",
    "payment-reminder",
    "esop-grant",
    "share-allotment",
    "legal-notice",
    "breach-notice",
    "ip-assignment",
    "loi",
    "vendor-onboarding",
    "co-founder-agreement",
    "startup-india",
    "gst-bank-letter",
    "board-resolution",
  ];

  const now = new Date().toISOString();

  return [
    ...staticPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1.0 : path === "/generate" ? 0.9 : 0.7,
    })),
    ...docTypes.map((type) => ({
      url: `${baseUrl}/generate/${type}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
