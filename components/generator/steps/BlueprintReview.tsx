"use client";

import { useState, useCallback, useMemo } from "react";
import type { Blueprint, BlueprintClause } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
    Check, X, MessageSquareText, Wand2, ArrowLeft, ArrowRight, Bot, ListTodo,
    Shield, AlertTriangle, ChevronDown, ChevronUp, Loader2, Eye, ShieldCheck,
    Sparkles, FileCheck, LayoutList, ChevronRight, CircleDot, Circle,
    CheckCircle2, Info, TriangleAlert, Zap, FileText,
} from "lucide-react";
import Plan from "@/components/ui/agent-plan";
import BlueprintChat from "./BlueprintChat";
import { useAgentTasks, updateTasksFromChat, type StreamingAgentState } from "@/lib/useAgentTasks";

// ─── Sub-step definitions ────────────────────────────────────────────────────

type ReviewSubStep = "overview" | "clauses" | "risk" | "refine" | "approve";

const REVIEW_STEPS: { id: ReviewSubStep; label: string; shortLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "overview", label: "Overview & Summary", shortLabel: "Overview", icon: Eye },
    { id: "clauses", label: "Clause Selection", shortLabel: "Clauses", icon: LayoutList },
    { id: "risk", label: "Risk Assessment", shortLabel: "Risk", icon: ShieldCheck },
    { id: "refine", label: "AI Refinement", shortLabel: "Refine", icon: Sparkles },
    { id: "approve", label: "Final Approval", shortLabel: "Approve", icon: FileCheck },
];

// ─── Utility functions ───────────────────────────────────────────────────────

function getRiskStats(clauses: BlueprintClause[]) {
    const included = clauses.filter((c) => c.included);
    return {
        total: clauses.length,
        included: included.length,
        excluded: clauses.length - included.length,
        high: included.filter((c) => c.risk === "high").length,
        medium: included.filter((c) => c.risk === "medium").length,
        low: included.filter((c) => c.risk === "low").length,
        riskScore: included.reduce((sum, c) => sum + (c.risk === "high" ? 3 : c.risk === "medium" ? 2 : 1), 0),
    };
}

function getRiskColor(risk: string) {
    switch (risk) {
        case "high": return { text: "text-red-600", bg: "bg-red-50", border: "border-red-200", badge: "bg-red-500" };
        case "medium": return { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-500" };
        default: return { text: "text-green-600", bg: "bg-green-50", border: "border-green-200", badge: "bg-green-500" };
    }
}

// ─── Sub-step Components ─────────────────────────────────────────────────────

// ── Step 1: Overview ─────────────────────────────────────────────────────────

function OverviewStep({ blueprint }: { blueprint: Blueprint }) {
    const stats = getRiskStats(blueprint.clauses || []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
        >
            {/* Document Summary */}
            {blueprint.summary && (
                <div className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                            <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-foreground mb-1.5 uppercase tracking-wide">Document Summary</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed font-mono">{blueprint.summary}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Total Clauses" value={stats.total} icon={<LayoutList className="h-4 w-4" />} color="text-primary" />
                <StatCard label="Included" value={stats.included} icon={<Check className="h-4 w-4" />} color="text-green-600" />
                <StatCard label="High Risk" value={stats.high} icon={<Shield className="h-4 w-4" />} color="text-red-600" />
                <StatCard label="Medium Risk" value={stats.medium} icon={<AlertTriangle className="h-4 w-4" />} color="text-amber-600" />
            </div>

            {/* Risk Score Meter */}
            <div className="bg-card border border-border rounded-xl p-5">
                <h4 className="text-xs font-mono text-muted-foreground mb-3 uppercase tracking-wider">Risk Score</h4>
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-muted/50 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((stats.riskScore / (stats.included * 3)) * 100, 100)}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                                stats.high > 0 ? "bg-gradient-to-r from-yellow-500 to-red-500"
                                    : stats.medium > 0 ? "bg-gradient-to-r from-green-500 to-yellow-500"
                                        : "bg-green-500"
                            }`}
                        />
                    </div>
                    <span className={`text-sm font-bold font-mono tabular-nums ${
                        stats.high > 0 ? "text-red-600" : stats.medium > 0 ? "text-amber-600" : "text-green-600"
                    }`}>
                        {stats.included > 0 ? ((stats.riskScore / (stats.included * 3)) * 100).toFixed(0) : 0}%
                    </span>
                </div>
                <p className="text-[11px] text-muted-foreground/70 mt-2 font-mono">
                    {stats.high > 0
                        ? `${stats.high} high-risk clause${stats.high > 1 ? "s" : ""} require${stats.high === 1 ? "s" : ""} careful review in the next step.`
                        : stats.medium > 0
                            ? "No high-risk clauses detected. Review medium-risk items for optimal coverage."
                            : "All clauses assessed as low risk. Looking good!"}
                </p>
            </div>

            {/* Clause Preview List (compact) */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                    <h4 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Clause Breakdown</h4>
                </div>
                <div className="divide-y divide-border max-h-[280px] overflow-y-auto">
                    {(blueprint.clauses || []).map((clause, i) => {
                        const colors = getRiskColor(clause.risk);
                        return (
                            <div
                                key={clause.id}
                                className={`flex items-center gap-3 px-4 py-2.5 text-xs ${!clause.included ? "opacity-40" : ""}`}
                            >
                                <span className="text-muted-foreground/50 font-mono w-5 text-right">{String(i + 1).padStart(2, "0")}</span>
                                <span className={`h-2 w-2 rounded-full shrink-0 ${colors.badge}`} />
                                <span className="font-mono truncate flex-1">{clause.title}</span>
                                <span className={`text-[10px] font-mono uppercase ${colors.text}`}>{clause.risk}</span>
                                {!clause.included && (
                                    <span className="text-[10px] font-mono text-muted-foreground/60">EXCLUDED</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
    return (
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col items-center text-center">
            <div className={`mb-2 ${color}`}>{icon}</div>
            <span className="text-2xl font-bold tabular-nums">{value}</span>
            <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mt-1">{label}</span>
        </div>
    );
}

// ── Step 2: Clause Selection ─────────────────────────────────────────────────

function ClauseSelectionStep({
    blueprint,
    onToggleClause,
    suggestedInput,
    setSuggestedInput,
    setActiveTab,
    onNavigateToRefine,
}: {
    blueprint: Blueprint;
    onToggleClause: (id: string) => void;
    suggestedInput: { text: string; ts: number } | null;
    setSuggestedInput: (v: { text: string; ts: number } | null) => void;
    setActiveTab: (tab: "chat" | "plan") => void;
    onNavigateToRefine: (message: string) => void;
}) {
    const [expandedClause, setExpandedClause] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "included" | "excluded">("all");

    const filteredClauses = useMemo(() => {
        const clauses = blueprint.clauses || [];
        if (filter === "included") return clauses.filter((c) => c.included);
        if (filter === "excluded") return clauses.filter((c) => !c.included);
        return clauses;
    }, [blueprint.clauses, filter]);

    const stats = getRiskStats(blueprint.clauses || []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
        >
            {/* Filter Bar */}
            <div className="flex items-center gap-2">
                {(["all", "included", "excluded"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-md border transition-all ${
                            filter === f
                                ? "bg-primary/15 text-primary border-primary/30"
                                : "bg-muted/50 text-muted-foreground border-border hover:border-foreground/30"
                        }`}
                    >
                        {f === "all" ? `ALL (${stats.total})` : f === "included" ? `INCLUDED (${stats.included})` : `EXCLUDED (${stats.excluded})`}
                    </button>
                ))}
            </div>

            {/* Improve All Risk Button */}
            <button
                onClick={() => {
                    const included = (blueprint.clauses || []).filter((c) => c.included);
                    const highCount = included.filter((c) => c.risk === "high").length;
                    const medCount = included.filter((c) => c.risk === "medium").length;
                    onNavigateToRefine(
                        `Analyze ALL ${included.length} included clauses and improve their risk factors. There are currently ${highCount} high-risk and ${medCount} medium-risk clauses. For each clause: (1) identify specific weaknesses, (2) suggest concrete improvements to reduce risk, (3) rewrite descriptions with better protective language. Return the complete updated clause list with improved risk levels where possible.`
                    );
                }}
                className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 hover:from-primary/10 hover:via-primary/15 hover:to-primary/10 hover:border-primary/40 transition-all duration-300"
            >
                <div className="h-9 w-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Wand2 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 text-left">
                    <p className="text-xs font-mono font-bold text-primary">IMPROVE ALL RISK FACTORS</p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                        AI will analyze every clause and suggest improvements to reduce risk exposure
                    </p>
                </div>
                <ArrowRight className="h-4 w-4 text-primary/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Instruction hint */}
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/10 rounded-lg">
                <Info className="h-3.5 w-3.5 text-primary shrink-0" />
                <p className="text-[11px] text-muted-foreground font-mono">
                    Toggle clauses on/off, or use the chat/wand icons to discuss or improve individual clauses with the AI.
                </p>
            </div>

            {/* Clause cards */}
            <div className="space-y-3 max-h-[calc(100vh-420px)] overflow-y-auto pr-1 scrollbar-hide pb-4">
                {filteredClauses.map((clause, index) => {
                    const isExpanded = expandedClause === clause.id;
                    const realIndex = (blueprint.clauses || []).findIndex((c) => c.id === clause.id);

                    return (
                        <Card
                            key={clause.id}
                            className={`transition-all duration-300 relative overflow-hidden group ${
                                clause.included
                                    ? "border-primary/20 bg-primary/5 hover:border-primary/40"
                                    : "border-border opacity-50 bg-muted/30 hover:opacity-70"
                            }`}
                        >
                            {clause.included && (
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                            )}

                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 relative z-10 w-full">
                                <div className="space-y-1 w-full pr-12">
                                    <CardTitle className="text-base font-mono flex items-center gap-2 flex-wrap">
                                        <span className="text-primary/50 text-xs font-normal">
                                            {String(realIndex + 1).padStart(2, "0")}
                                        </span>
                                        <span className="mr-2">{clause.title}</span>
                                        {clause.risk === "high" && (
                                            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-none border border-red-200 bg-red-50 text-red-600 font-mono uppercase tracking-wider">
                                                <Shield className="h-2.5 w-2.5" /> HIGH_RISK
                                            </span>
                                        )}
                                        {clause.risk === "medium" && (
                                            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-none border border-amber-200 bg-amber-50 text-amber-600 font-mono uppercase tracking-wider">
                                                <AlertTriangle className="h-2.5 w-2.5" /> MEDIUM
                                            </span>
                                        )}
                                        {clause.risk === "low" && (
                                            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-none border border-green-200 bg-green-50 text-green-600 font-mono uppercase tracking-wider">
                                                OK
                                            </span>
                                        )}
                                    </CardTitle>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                        onClick={() => {
                                            setActiveTab("chat");
                                            setSuggestedInput({
                                                text: `Why is the "${clause.title}" clause important here?`,
                                                ts: Date.now(),
                                            });
                                        }}
                                        title="Discuss with AI"
                                    >
                                        <MessageSquareText className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                        onClick={() => {
                                            setActiveTab("chat");
                                            setSuggestedInput({
                                                text: `Suggest a more favorable version of the "${clause.title}" clause.`,
                                                ts: Date.now(),
                                            });
                                        }}
                                        title="Improve Clause"
                                    >
                                        <Wand2 className="h-4 w-4" />
                                    </Button>
                                    <div className="w-px h-4 bg-border/50 mx-1" />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onToggleClause(clause.id)}
                                        className={`h-8 w-8 p-0 rounded-none border ${
                                            clause.included
                                                ? "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30"
                                                : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                                        }`}
                                    >
                                        {clause.included ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10 pt-2">
                                <p className="text-sm text-muted-foreground leading-relaxed font-mono opacity-80 pl-4 border-l-2 border-primary/10">
                                    {clause.description}
                                </p>
                                {clause.content && (
                                    <div className="mt-3">
                                        <button
                                            onClick={() => setExpandedClause(isExpanded ? null : clause.id)}
                                            className="flex items-center gap-1 text-[10px] font-mono text-primary/60 hover:text-primary transition-colors"
                                        >
                                            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                            {isExpanded ? "HIDE DRAFT" : "VIEW DRAFT"}
                                        </button>
                                        {isExpanded && (
                                            <div className="mt-2 p-3 bg-secondary rounded border border-border text-xs text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                                                {clause.content}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </motion.div>
    );
}

// ── Step 3: Risk Assessment ──────────────────────────────────────────────────

function RiskAssessmentStep({
    blueprint,
    setSuggestedInput,
    setActiveTab,
    onNavigateToRefine,
}: {
    blueprint: Blueprint;
    setSuggestedInput: (v: { text: string; ts: number }) => void;
    setActiveTab: (tab: "chat" | "plan") => void;
    onNavigateToRefine: (message: string) => void;
}) {
    const stats = getRiskStats(blueprint.clauses || []);
    const included = (blueprint.clauses || []).filter((c) => c.included);

    // Group by risk
    const highRisk = included.filter((c) => c.risk === "high");
    const mediumRisk = included.filter((c) => c.risk === "medium");
    const lowRisk = included.filter((c) => c.risk === "low");

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-5"
        >
            {/* Risk Distribution */}
            <div className="bg-card border border-border rounded-xl p-5">
                <h4 className="text-xs font-mono text-muted-foreground mb-4 uppercase tracking-wider">Risk Distribution</h4>
                <div className="flex gap-2 h-8 rounded-full overflow-hidden bg-muted/30">
                    {stats.high > 0 && (
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(stats.high / stats.included) * 100}%` }}
                            transition={{ duration: 0.6, delay: 0 }}
                            className="bg-red-500/80 flex items-center justify-center"
                        >
                            <span className="text-[9px] font-bold text-white font-mono">{stats.high}</span>
                        </motion.div>
                    )}
                    {stats.medium > 0 && (
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(stats.medium / stats.included) * 100}%` }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-yellow-500/80 flex items-center justify-center"
                        >
                            <span className="text-[9px] font-bold text-white font-mono">{stats.medium}</span>
                        </motion.div>
                    )}
                    {stats.low > 0 && (
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(stats.low / stats.included) * 100}%` }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-green-500/80 flex items-center justify-center"
                        >
                            <span className="text-[9px] font-bold text-white font-mono">{stats.low}</span>
                        </motion.div>
                    )}
                </div>
                <div className="flex items-center gap-4 mt-3 text-[10px] font-mono text-muted-foreground">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /> High ({stats.high})</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-yellow-500" /> Medium ({stats.medium})</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" /> Low ({stats.low})</span>
                </div>
            </div>

            {/* Improve All Risk Button */}
            {(stats.high > 0 || stats.medium > 0) && (
                <button
                    onClick={() => {
                        const riskClauses = included.filter((c) => c.risk === "high" || c.risk === "medium");
                        const clauseNames = riskClauses.map((c) => `"${c.title}" (${c.risk})`).join(", ");
                        onNavigateToRefine(
                            `I need you to improve the risk factors for these flagged clauses: ${clauseNames}. For each one: (1) explain what makes it risky, (2) rewrite the clause description with stronger protective language, (3) if a HIGH risk clause can be reduced to MEDIUM through better drafting, do so. Return the full updated clause list.`
                        );
                    }}
                    className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-200 bg-gradient-to-r from-red-50/50 via-amber-50/50 to-green-50/50 hover:from-red-50 hover:via-amber-50 hover:to-green-50 hover:border-red-300 transition-all duration-300"
                >
                    <div className="h-9 w-9 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <ShieldCheck className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-xs font-mono font-bold text-foreground">IMPROVE {stats.high + stats.medium} FLAGGED CLAUSES</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                            AI will analyze {stats.high > 0 ? `${stats.high} high` : ""}{stats.high > 0 && stats.medium > 0 ? " & " : ""}{stats.medium > 0 ? `${stats.medium} medium` : ""} risk clauses and suggest improvements
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                        <Sparkles className="h-3.5 w-3.5 text-primary/50 group-hover:text-primary transition-colors" />
                        <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                </button>
            )}

            {/* Risk Groups */}
            <div className="space-y-4 max-h-[calc(100vh-440px)] overflow-y-auto pr-1 scrollbar-hide pb-4">
                {highRisk.length > 0 && (
                    <RiskGroup
                        title="High Risk Clauses"
                        subtitle="These clauses have significant legal implications if omitted or poorly drafted"
                        clauses={highRisk}
                        color="red"
                        icon={<Shield className="h-4 w-4 text-red-600" />}
                        onAsk={(title) => {
                            setActiveTab("chat");
                            setSuggestedInput({ text: `Analyze the risk of the "${title}" clause and suggest ways to mitigate it.`, ts: Date.now() });
                        }}
                    />
                )}
                {mediumRisk.length > 0 && (
                    <RiskGroup
                        title="Medium Risk Clauses"
                        subtitle="These clauses should be reviewed for completeness"
                        clauses={mediumRisk}
                        color="yellow"
                        icon={<AlertTriangle className="h-4 w-4 text-amber-600" />}
                        onAsk={(title) => {
                            setActiveTab("chat");
                            setSuggestedInput({ text: `What could go wrong if the "${title}" clause is weak?`, ts: Date.now() });
                        }}
                    />
                )}
                {lowRisk.length > 0 && (
                    <RiskGroup
                        title="Low Risk Clauses"
                        subtitle="Standard clauses with well-established legal precedent"
                        clauses={lowRisk}
                        color="green"
                        icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
                        onAsk={(title) => {
                            setActiveTab("chat");
                            setSuggestedInput({ text: `Explain the "${title}" clause in simple terms.`, ts: Date.now() });
                        }}
                    />
                )}

                {stats.included === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm font-mono">
                        No included clauses to assess. Go back and select some clauses.
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function RiskGroup({
    title,
    subtitle,
    clauses,
    color,
    icon,
    onAsk,
}: {
    title: string;
    subtitle: string;
    clauses: BlueprintClause[];
    color: "red" | "yellow" | "green";
    icon: React.ReactNode;
    onAsk: (title: string) => void;
}) {
    const borderColor = color === "red" ? "border-red-500/20" : color === "yellow" ? "border-yellow-500/20" : "border-green-500/20";
    const headerBg = color === "red" ? "bg-red-500/5" : color === "yellow" ? "bg-yellow-500/5" : "bg-green-500/5";

    return (
        <div className={`border ${borderColor} rounded-xl overflow-hidden`}>
            <div className={`px-4 py-3 ${headerBg} border-b ${borderColor} flex items-center gap-2`}>
                {icon}
                <div>
                    <h4 className="text-xs font-bold font-mono">{title}</h4>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{subtitle}</p>
                </div>
            </div>
            <div className="divide-y divide-border/20">
                {clauses.map((clause) => (
                    <div key={clause.id} className="px-4 py-3 flex items-start gap-3 group hover:bg-muted/20 transition-colors">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-mono font-medium">{clause.title}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-1 font-mono opacity-80">{clause.description}</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onAsk(clause.title)}
                            className="h-7 px-2 text-[10px] font-mono text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        >
                            <Zap className="h-3 w-3 mr-1" /> ASSESS
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Step 4: AI Refinement ────────────────────────────────────────────────────

function RefinementStep({
    blueprint,
    setBlueprint,
    suggestedInput,
    handleStreamingStateChange,
    displayTasks,
}: {
    blueprint: Blueprint;
    setBlueprint: (b: Blueprint) => void;
    suggestedInput: { text: string; ts: number } | null;
    handleStreamingStateChange: (state: StreamingAgentState) => void;
    displayTasks: ReturnType<typeof updateTasksFromChat>;
}) {
    const [activePanel, setActivePanel] = useState<"chat" | "plan">("chat");

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4"
        >
            {/* Instruction */}
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/10 rounded-lg">
                <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                <p className="text-[11px] text-muted-foreground font-mono">
                    Chat with the AI agent to refine clauses, ask legal questions, or request changes. The agent uses specialized tools to analyze and improve your document.
                </p>
            </div>

            {/* Agent Panel (full-height embedded) */}
            <div className="flex flex-col bg-card rounded-xl border border-border overflow-hidden shadow-lg h-[calc(100vh-420px)] min-h-[400px]">
                {/* Tab Switcher */}
                <div className="flex items-center p-1 bg-muted/60 border-b border-border gap-1 shrink-0">
                    <button
                        onClick={() => setActivePanel("chat")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-mono font-medium rounded transition-all duration-200 ${
                            activePanel === "chat"
                                ? "bg-background shadow-sm text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        }`}
                    >
                        <Bot className="w-3.5 h-3.5" />
                        AGENT_CHAT
                    </button>
                    <button
                        onClick={() => setActivePanel("plan")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-mono font-medium rounded transition-all duration-200 ${
                            activePanel === "plan"
                                ? "bg-background shadow-sm text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        }`}
                    >
                        <ListTodo className="w-3.5 h-3.5" />
                        EXECUTION_PLAN
                    </button>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    {activePanel === "chat" ? (
                        <BlueprintChat
                            blueprint={blueprint}
                            onUpdateBlueprint={(newBlueprint: Blueprint) => setBlueprint(newBlueprint)}
                            embedded={true}
                            suggestedInput={suggestedInput}
                            onStreamingStateChange={handleStreamingStateChange}
                        />
                    ) : (
                        <div className="h-full w-full overflow-hidden flex flex-col">
                            <Plan tasks={displayTasks} />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ── Step 5: Final Approval ───────────────────────────────────────────────────

function ApprovalStep({
    blueprint,
    onApprove,
    isLoading,
}: {
    blueprint: Blueprint;
    onApprove: () => void;
    isLoading: boolean;
}) {
    const stats = getRiskStats(blueprint.clauses || []);
    const included = (blueprint.clauses || []).filter((c) => c.included);

    // Approval checks
    const checks = [
        { label: "At least one clause is included", passed: stats.included > 0 },
        { label: "All high-risk clauses reviewed", passed: true }, // always true after reaching this step
        { label: "Document structure validated", passed: stats.included >= 3 },
        { label: "Risk assessment completed", passed: true },
    ];

    const allPassed = checks.every((c) => c.passed);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
        >
            {/* Pre-flight Checks */}
            <div className="bg-card border border-border rounded-xl p-5">
                <h4 className="text-xs font-mono text-muted-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    PRE-FLIGHT CHECKS
                </h4>
                <div className="space-y-3">
                    {checks.map((check, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                                check.passed ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                            }`}>
                                {check.passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            </div>
                            <span className={`text-sm font-mono ${check.passed ? "text-foreground" : "text-muted-foreground"}`}>
                                {check.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Final Summary */}
            <div className="bg-card border border-border rounded-xl p-5">
                <h4 className="text-xs font-mono text-muted-foreground mb-3 uppercase tracking-wider">Final Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <span className="text-2xl font-bold tabular-nums text-green-600">{stats.included}</span>
                        <p className="text-[10px] text-muted-foreground font-mono mt-1">INCLUDED</p>
                    </div>
                    <div>
                        <span className="text-2xl font-bold tabular-nums text-muted-foreground">{stats.excluded}</span>
                        <p className="text-[10px] text-muted-foreground font-mono mt-1">EXCLUDED</p>
                    </div>
                    <div>
                        <span className={`text-2xl font-bold tabular-nums ${
                            stats.high > 0 ? "text-red-600" : stats.medium > 0 ? "text-amber-600" : "text-green-600"
                        }`}>{stats.high + stats.medium}</span>
                        <p className="text-[10px] text-muted-foreground font-mono mt-1">FLAGGED</p>
                    </div>
                </div>
            </div>

            {/* Included clauses final listing */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                    <h4 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Clauses to Compile</h4>
                </div>
                <div className="divide-y divide-border max-h-[200px] overflow-y-auto">
                    {included.map((clause, i) => {
                        const colors = getRiskColor(clause.risk);
                        return (
                            <div key={clause.id} className="flex items-center gap-3 px-4 py-2 text-xs">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                                <span className="font-mono truncate flex-1">{clause.title}</span>
                                <span className={`text-[10px] font-mono uppercase ${colors.text}`}>{clause.risk}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Compile Button */}
            <div className="flex justify-center pt-2">
                <LiquidButton
                    disabled={isLoading || !allPassed}
                    onClick={onApprove}
                    size="lg"
                    className="h-12 px-10 text-sm"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            COMPILING DOCUMENT...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <FileCheck className="h-4 w-4" />
                            COMPILE FINAL DOCUMENT
                        </span>
                    )}
                </LiquidButton>
            </div>
        </motion.div>
    );
}

// ─── Stepper UI ──────────────────────────────────────────────────────────────

function ReviewStepper({
    currentStep,
    onStepClick,
    completedSteps,
}: {
    currentStep: ReviewSubStep;
    onStepClick: (step: ReviewSubStep) => void;
    completedSteps: Set<ReviewSubStep>;
}) {
    const currentIndex = REVIEW_STEPS.findIndex((s) => s.id === currentStep);

    return (
        <div className="flex items-center gap-1 w-full overflow-x-auto py-1">
            {REVIEW_STEPS.map((step, idx) => {
                const isActive = step.id === currentStep;
                const isCompleted = completedSteps.has(step.id);
                const isPast = idx < currentIndex;
                const Icon = step.icon;

                return (
                    <div key={step.id} className="flex items-center flex-1 min-w-0">
                        <button
                            onClick={() => onStepClick(step.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left w-full transition-all duration-200 group ${
                                isActive
                                    ? "bg-primary/10 border border-primary/30"
                                    : isCompleted || isPast
                                        ? "hover:bg-muted/40 border border-transparent"
                                        : "hover:bg-muted/20 border border-transparent opacity-60"
                            }`}
                        >
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold transition-all ${
                                isActive
                                    ? "bg-primary text-primary-foreground ring-2 ring-primary/20"
                                    : isCompleted
                                        ? "bg-green-50 text-green-600"
                                        : isPast
                                            ? "bg-muted text-muted-foreground"
                                            : "bg-muted/50 text-muted-foreground/50"
                            }`}>
                                {isCompleted ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                            </div>
                            <div className="min-w-0 hidden sm:block">
                                <p className={`text-[10px] font-mono truncate ${
                                    isActive ? "text-primary font-bold" : isCompleted ? "text-foreground" : "text-muted-foreground"
                                }`}>
                                    {step.shortLabel}
                                </p>
                            </div>
                        </button>
                        {idx < REVIEW_STEPS.length - 1 && (
                            <ChevronRight className={`h-3 w-3 shrink-0 mx-0.5 ${
                                isPast || isCompleted ? "text-primary/40" : "text-border"
                            }`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface BlueprintReviewProps {
    blueprint: Blueprint;
    onToggleClause: (id: string) => void;
    onApprove: () => void;
    isLoading: boolean;
    setBlueprint: (blueprint: Blueprint) => void;
    onBack: () => void;
}

export default function BlueprintReview({
    blueprint,
    onToggleClause,
    onApprove,
    isLoading,
    setBlueprint,
    onBack,
}: BlueprintReviewProps) {
    const [currentStep, setCurrentStep] = useState<ReviewSubStep>("overview");
    const [completedSteps, setCompletedSteps] = useState<Set<ReviewSubStep>>(new Set());
    const [suggestedInput, setSuggestedInput] = useState<{ text: string; ts: number } | null>(null);
    const [activeTab, setActiveTab] = useState<"chat" | "plan">("chat");
    const [chatIsLoading, setChatIsLoading] = useState(false);
    const [messageCount, setMessageCount] = useState(0);

    // Dynamic agent tasks from blueprint state
    const { baseTasks, streamingState, updateStreamingState } = useAgentTasks(blueprint);
    const displayTasks = updateTasksFromChat(baseTasks, streamingState, chatIsLoading, messageCount);

    const handleStreamingStateChange = useCallback((state: StreamingAgentState) => {
        updateStreamingState("");
        if (state.isThinking || state.isAnalyzing || state.activeTools.length > 0) {
            setChatIsLoading(true);
        }
    }, [updateStreamingState]);

    const stats = getRiskStats(blueprint.clauses || []);
    const currentIndex = REVIEW_STEPS.findIndex((s) => s.id === currentStep);

    // Navigation
    const goToStep = useCallback((step: ReviewSubStep) => {
        // Mark current step as completed when leaving
        setCompletedSteps((prev) => new Set([...prev, currentStep]));
        setCurrentStep(step);
    }, [currentStep]);

    const goNext = useCallback(() => {
        if (currentIndex < REVIEW_STEPS.length - 1) {
            goToStep(REVIEW_STEPS[currentIndex + 1].id);
        }
    }, [currentIndex, goToStep]);

    const goPrev = useCallback(() => {
        if (currentIndex > 0) {
            goToStep(REVIEW_STEPS[currentIndex - 1].id);
        } else {
            onBack();
        }
    }, [currentIndex, goToStep, onBack]);

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] gap-3 animate-fade-in w-full max-w-5xl mx-auto">
            {/* Top Header */}
            <div className="flex items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-sm shrink-0">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={goPrev}
                        className="h-8 w-8 border border-input bg-background shadow-sm hover:bg-accent"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-sm font-bold flex items-center gap-2 font-mono">
                            <span className="text-primary">&#9889;</span> BLUEPRINT REVIEW
                        </h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground font-mono px-1.5 py-0.5 rounded bg-muted border border-border">
                                {stats.included}/{stats.total} ACTIVE
                            </span>
                            {stats.high > 0 && (
                                <span className="text-[10px] text-red-600 font-mono px-1.5 py-0.5 rounded bg-red-50 border border-red-200 flex items-center gap-1">
                                    <TriangleAlert className="h-2.5 w-2.5" /> {stats.high} HIGH
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Step indicator (compact) */}
                <span className="text-[10px] text-muted-foreground font-mono hidden sm:block">
                    STEP {currentIndex + 1} / {REVIEW_STEPS.length}
                </span>
            </div>

            {/* Step Navigation Bar */}
            <div className="bg-card border border-border rounded-xl px-2 py-1 shrink-0">
                <ReviewStepper
                    currentStep={currentStep}
                    onStepClick={goToStep}
                    completedSteps={completedSteps}
                />
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <AnimatePresence mode="wait">
                    {currentStep === "overview" && (
                        <OverviewStep key="overview" blueprint={blueprint} />
                    )}
                    {currentStep === "clauses" && (
                        <ClauseSelectionStep
                            key="clauses"
                            blueprint={blueprint}
                            onToggleClause={onToggleClause}
                            suggestedInput={suggestedInput}
                            setSuggestedInput={setSuggestedInput}
                            setActiveTab={setActiveTab}
                            onNavigateToRefine={(message) => {
                                setSuggestedInput({ text: message, ts: Date.now() });
                                goToStep("refine");
                            }}
                        />
                    )}
                    {currentStep === "risk" && (
                        <RiskAssessmentStep
                            key="risk"
                            blueprint={blueprint}
                            setSuggestedInput={(v) => setSuggestedInput(v)}
                            setActiveTab={setActiveTab}
                            onNavigateToRefine={(message) => {
                                setSuggestedInput({ text: message, ts: Date.now() });
                                goToStep("refine");
                            }}
                        />
                    )}
                    {currentStep === "refine" && (
                        <RefinementStep
                            key="refine"
                            blueprint={blueprint}
                            setBlueprint={setBlueprint}
                            suggestedInput={suggestedInput}
                            handleStreamingStateChange={handleStreamingStateChange}
                            displayTasks={displayTasks}
                        />
                    )}
                    {currentStep === "approve" && (
                        <ApprovalStep
                            key="approve"
                            blueprint={blueprint}
                            onApprove={onApprove}
                            isLoading={isLoading}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Navigation Bar */}
            <div className="flex items-center justify-between bg-card p-3 rounded-xl border border-border shadow-sm shrink-0">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={goPrev}
                    className="text-xs font-mono h-8"
                >
                    <ArrowLeft className="h-3 w-3 mr-1.5" />
                    {currentIndex === 0 ? "BACK TO FORM" : REVIEW_STEPS[currentIndex - 1]?.shortLabel.toUpperCase()}
                </Button>

                {/* Step dots (mobile visual) */}
                <div className="flex items-center gap-1.5">
                    {REVIEW_STEPS.map((step, idx) => (
                        <button
                            key={step.id}
                            onClick={() => goToStep(step.id)}
                            className={`rounded-full transition-all ${
                                idx === currentIndex
                                    ? "h-2 w-6 bg-primary"
                                    : completedSteps.has(step.id)
                                        ? "h-2 w-2 bg-green-500/50"
                                        : "h-2 w-2 bg-muted"
                            }`}
                        />
                    ))}
                </div>

                {currentIndex < REVIEW_STEPS.length - 1 ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={goNext}
                        className="text-xs font-mono h-8 text-primary hover:text-primary"
                    >
                        {REVIEW_STEPS[currentIndex + 1]?.shortLabel.toUpperCase()}
                        <ArrowRight className="h-3 w-3 ml-1.5" />
                    </Button>
                ) : (
                    <LiquidButton
                        disabled={isLoading}
                        onClick={onApprove}
                        size="sm"
                        className="h-8 px-4 text-xs"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-1.5">
                                <Loader2 className="h-3 w-3 animate-spin" /> COMPILING...
                            </span>
                        ) : (
                            "COMPILE →"
                        )}
                    </LiquidButton>
                )}
            </div>
        </div>
    );
}
