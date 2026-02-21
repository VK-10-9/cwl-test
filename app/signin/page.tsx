"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const { user, isLoading, login } = useAuth();
  const router = useRouter();

  // If already signed in, redirect to /dashboard
  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="max-w-md mx-auto px-6 sm:px-8 pt-28 md:pt-36 pb-24">
        <div className="animate-fade-in">
          <div className="text-center mb-10">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60 mb-4">
              Welcome
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Sign in to ClauseWala<span className="text-emerald-500">.</span>
            </h1>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              Draft professional Indian legal documents in minutes with AI.
            </p>
          </div>

          {/* Sign-in Card */}
          <div className="rounded-2xl border border-border bg-card p-8">
            <button
              onClick={() => login()}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-foreground text-background font-medium text-[14px] hover:bg-foreground/85 transition-all duration-200 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            <div className="mt-6 text-center">
              <p className="text-[12px] text-muted-foreground/60">
                By signing in, you agree to our{" "}
                <a href="/terms" className="underline hover:text-foreground transition-colors">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="underline hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-2 gap-3 text-[13px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              22 document templates
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              AI-powered drafting
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              Free during early access
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              India-specific clauses
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
