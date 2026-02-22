import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/signin",
  },
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
