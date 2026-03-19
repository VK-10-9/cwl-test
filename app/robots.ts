import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://clausewala.vishwadev.tech";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/pricing", "/contact", "/privacy", "/terms"],
        disallow: ["/api/", "/dashboard/", "/generate/", "/signin", "/demo/", "/hero"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
