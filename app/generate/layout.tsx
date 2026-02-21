"use client";

import RequireAuth from "@/components/RequireAuth";

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
