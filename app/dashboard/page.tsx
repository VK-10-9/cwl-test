"use client";

import { useAuth } from "@/components/AuthProvider";
import { useDocumentStore, type SavedDocument } from "@/components/DocumentStoreProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import {
  Plus, FileText, Clock, Download, Trash2,
  ArrowRight, Sparkles,
} from "lucide-react";
import { DOCUMENT_TYPE_LABELS, DOCUMENT_TYPE_ICONS } from "@/types";
import type { DocumentType } from "@/types";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function StatusBadge({ status }: { status: SavedDocument["status"] }) {
  const styles = {
    draft: "bg-amber-500/10 text-amber-600",
    completed: "bg-emerald-500/10 text-emerald-600",
    exported: "bg-blue-500/10 text-blue-600",
  };
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function DocumentCard({ doc, onDelete }: { doc: SavedDocument; onDelete: (id: string) => void }) {
  const icon = DOCUMENT_TYPE_ICONS[doc.type as DocumentType] || "📄";
  const label = DOCUMENT_TYPE_LABELS[doc.type as DocumentType] || doc.type;

  return (
    <div className="group rounded-xl border border-border bg-card hover:border-foreground/12 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-foreground/[0.04] border border-border flex items-center justify-center text-base">
              {icon}
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-foreground leading-tight">{doc.title}</h3>
              <p className="text-[12px] text-muted-foreground mt-0.5">{label}</p>
            </div>
          </div>
          <StatusBadge status={doc.status} />
        </div>

        <div className="flex items-center gap-4 text-[11px] text-muted-foreground/60 mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(doc.updatedAt)}
          </span>
          {doc.blueprint && (
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {doc.blueprint.clauses.length} clauses
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/generate/${doc.type}`}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-foreground text-background text-[12px] font-medium hover:bg-foreground/85 transition-all"
          >
            Open
            <ArrowRight className="w-3 h-3" />
          </Link>
          <button
            onClick={() => onDelete(doc.id)}
            className="p-2 rounded-lg border border-border hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-muted-foreground/40 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { documents, deleteDocument } = useDocumentStore();

  if (!user) return null;

  const stats = {
    total: documents.length,
    drafts: documents.filter((d) => d.status === "draft").length,
    completed: documents.filter((d) => d.status === "completed").length,
    exported: documents.filter((d) => d.status === "exported").length,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 sm:px-8 pt-28 md:pt-36 pb-24">
        <div className="animate-fade-in">
          {/* Welcome Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              {user.picture ? (
                <Image
                  src={user.picture}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                  unoptimized
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center text-lg font-semibold text-foreground/60">
                  {user.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Welcome back, {user.name.split(" ")[0]}
                </h1>
                <p className="text-[13px] text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Link
              href="/generate"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background font-medium text-[13px] hover:bg-foreground/85 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Document
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {[
              { label: "Total", value: stats.total, color: "text-foreground" },
              { label: "Drafts", value: stats.drafts, color: "text-amber-600" },
              { label: "Completed", value: stats.completed, color: "text-emerald-600" },
              { label: "Exported", value: stats.exported, color: "text-blue-600" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
                <p className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Documents */}
          {documents.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-dashed border-border">
              <div className="w-16 h-16 rounded-2xl bg-foreground/[0.04] border border-border flex items-center justify-center mx-auto mb-5">
                <Sparkles className="w-7 h-7 text-muted-foreground/40" />
              </div>
              <h2 className="text-lg font-semibold mb-2">No documents yet</h2>
              <p className="text-[14px] text-muted-foreground mb-6 max-w-sm mx-auto">
                Create your first legal document with AI — choose from 22 India-specific templates.
              </p>
              <Link
                href="/generate"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background font-medium text-[13px] hover:bg-foreground/85 transition-all"
              >
                <Plus className="w-4 h-4" />
                Create Document
              </Link>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-foreground">Recent Documents</h2>
                <span className="text-[11px] text-muted-foreground/60">{documents.length} document{documents.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {documents.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} onDelete={deleteDocument} />
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-14">
            <h2 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "NDA", type: "nda", icon: "🔒" },
                { label: "Offer Letter", type: "offer-letter", icon: "📨" },
                { label: "Co-Founder Agreement", type: "co-founder-agreement", icon: "👥" },
              ].map((item) => (
                <Link
                  key={item.type}
                  href={`/generate/${item.type}`}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-foreground/12 hover:bg-foreground/[0.02] transition-all group"
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-foreground">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground/60">Draft now</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/0 group-hover:text-muted-foreground transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
