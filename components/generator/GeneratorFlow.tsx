"use client";

import { useReducer, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DetailsForm from "./steps/DetailsForm";
import BlueprintReview from "./steps/BlueprintReview";
import DocumentEditor from "./steps/DocumentEditor";
import type { DocumentType, Blueprint, WorkflowStage } from "@/types";
import { CheckCircle2 } from "lucide-react";

interface GeneratorFlowProps {
    docType: DocumentType;
}

type FormData = Record<string, string | number | boolean>;

type State = {
    stage: WorkflowStage;
    blueprint: Blueprint | null;
    formData: FormData | null;
    fullText: string | null;
    isLoading: boolean;
    isExporting: boolean;
    error: string | null;
};

const initialState: State = {
    stage: "form",
    blueprint: null,
    formData: null,
    fullText: null,
    isLoading: false,
    isExporting: false,
    error: null,
};

type Action =
    | { type: "START_LOADING" }
    | { type: "SET_BLUEPRINT"; payload: { blueprint: Blueprint; formData: FormData } }
    | { type: "TOGGLE_CLAUSE"; payload: string }
    | { type: "SET_DOCUMENT"; payload: string }
    | { type: "SET_ERROR"; payload: string }
    | { type: "START_EXPORT" }
    | { type: "END_EXPORT" }
    | { type: "GO_BACK" }
    | { type: "SET_STATE"; payload: Partial<State> };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "START_LOADING": return { ...state, isLoading: true, error: null };
        case "SET_BLUEPRINT": return {
            ...state,
            isLoading: false,
            blueprint: action.payload.blueprint,
            formData: action.payload.formData,
            stage: "blueprint"
        };
        case "TOGGLE_CLAUSE":
            if (!state.blueprint) return state;
            const updatedClauses = state.blueprint.clauses.map(c =>
                c.id === action.payload ? { ...c, included: !c.included } : c
            );
            return { ...state, blueprint: { ...state.blueprint, clauses: updatedClauses } };
        case "SET_DOCUMENT": return { ...state, isLoading: false, fullText: action.payload, stage: "preview" };
        case "SET_ERROR": return { ...state, isLoading: false, isExporting: false, error: action.payload };
        case "START_EXPORT": return { ...state, isExporting: true, error: null };
        case "END_EXPORT": return { ...state, isExporting: false };
        case "GO_BACK":
            if (state.stage === "preview") return { ...state, stage: "blueprint" };
            if (state.stage === "blueprint") return { ...state, stage: "form" };
            return state;
        case "SET_STATE":
            return { ...state, ...action.payload, isLoading: false, isExporting: false, error: null };
        default: return state;
    }
}

export default function GeneratorFlow({ docType }: GeneratorFlowProps) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Hydrate state from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(`docfuge_state_${docType}`);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Validate parsed state minimally
                if (parsed && typeof parsed === 'object') {
                    dispatch({ type: "SET_STATE", payload: parsed });
                }
            } catch (e) {
                console.error("Failed to load state", e);
            }
        }
    }, [docType]);

    // Persist state to localStorage on change
    useEffect(() => {
        // Debounce saving slightly or save relevant parts
        const stateToSave = {
            stage: state.stage,
            blueprint: state.blueprint,
            formData: state.formData,
            fullText: state.fullText
        };
        localStorage.setItem(`docfuge_state_${docType}`, JSON.stringify(stateToSave));
    }, [state.stage, state.blueprint, state.formData, state.fullText, docType]);

    // Helper to format data for API consumption
    const getFormattedData = () => {
        return {
            ...(state.formData ?? {}),
            "Party A Name": state.formData?.partyA_name ?? state.formData?.partyA ?? "",
            "Party A Address": state.formData?.partyA_address ?? "",
            "Party A Signatory": state.formData?.partyA_signatory ?? "",
            "Party B Name": state.formData?.partyB_name ?? state.formData?.partyB ?? "",
            "Party B Address": state.formData?.partyB_address ?? "",
            "Party B Signatory": state.formData?.partyB_signatory ?? "",
            "Effective Date": state.formData?.effectiveDate ?? "",
        };
    };

    const handleFormSubmit = async (data: FormData) => {
        dispatch({ type: "START_LOADING" });
        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    documentType: docType,
                    orgA: {
                        name: data.partyA_name || data.partyA, // Fallback for safety
                        address: data.partyA_address,
                        signatoryName: data.partyA_signatory,
                        jurisdiction: data.jurisdiction,
                    },
                    orgB: {
                        name: data.partyB_name || data.partyB,
                        address: data.partyB_address,
                        signatoryName: data.partyB_signatory,
                    },
                    formData: data,
                }),
            });
            if (!res.ok) throw new Error("Failed to generate blueprint");
            const json = await res.json();
            const blueprint = json.blueprint ?? json;
            dispatch({
                type: "SET_BLUEPRINT",
                payload: { blueprint, formData: data }
            });
        } catch (err: unknown) {
            dispatch({ type: "SET_ERROR", payload: err instanceof Error ? err.message : "An unexpected error occurred" });
        }
    };

    const handleGenerateDoc = async () => {
        if (!state.blueprint) return;
        dispatch({ type: "START_LOADING" });
        try {
            // Build a flat formData map for the preview API
            // Map the structured fields back to readable keys for the prompt/API
            const formData = getFormattedData();

            const res = await fetch("/api/preview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    blueprint: state.blueprint,
                    formData,
                }),
            });
            if (!res.ok) throw new Error("Failed to generate document");
            const json = await res.json();
            const text = json.fullText ?? json.content ?? JSON.stringify(json);
            dispatch({ type: "SET_DOCUMENT", payload: text });
        } catch (err: unknown) {
            dispatch({ type: "SET_ERROR", payload: err instanceof Error ? err.message : "An unexpected error occurred" });
        }
    };

    const handleExport = async (format: "pdf" | "docx") => {
        if (!state.blueprint) return;
        dispatch({ type: "START_EXPORT" });
        try {
            const formData = getFormattedData();
            const res = await fetch("/api/export", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    blueprint: state.blueprint,
                    formData,
                    fullText: state.fullText,
                    format
                }),
            });

            if (!res.ok) throw new Error("Failed to export document");

            // Handle blob download
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${state.blueprint.title || "document"}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            dispatch({ type: "END_EXPORT" });
        } catch (err: unknown) {
            dispatch({ type: "SET_ERROR", payload: err instanceof Error ? err.message : "An unexpected error occurred" });
        }
    };

    const handleToggleClause = (id: string) => {
        dispatch({ type: "TOGGLE_CLAUSE", payload: id });
    };

    const handleBack = () => {
        dispatch({ type: "GO_BACK" });
    };

    // For Blueprint update from chat
    const handleSetBlueprint = (blueprint: Blueprint) => {
        dispatch({ type: "SET_STATE", payload: { blueprint } });
    };

    const steps = [{ id: "form", label: "Details" }, { id: "blueprint", label: "Review" }, { id: "preview", label: "Done" }];
    const currentStepIndex = steps.findIndex(s => s.id === state.stage);

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
            {/* Progress Bar */}
            <div className="flex justify-between max-w-lg mx-auto mb-12 relative animate-fade-in">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 -translate-y-1/2 rounded-full" />
                <div className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }} />

                {steps.map((step, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isActive = idx === currentStepIndex;
                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-background p-2 rounded-xl">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isActive || isCompleted ? 'border-primary bg-primary text-primary-foreground' : 'border-muted text-muted-foreground bg-background'}`}>
                                {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                            </div>
                            <span className={`text-xs font-bold uppercase ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{step.label}</span>
                        </div>
                    );
                })}
            </div>

            {state.error && (
                <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center">
                    ⚠️ {state.error}
                </div>
            )}

            <AnimatePresence mode="wait">
                {state.stage === "form" && (
                    <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <DetailsForm docType={docType} onSubmit={handleFormSubmit} isLoading={state.isLoading} />
                    </motion.div>
                )}
                {state.stage === "blueprint" && state.blueprint && (
                    <motion.div key="blueprint" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <BlueprintReview
                            blueprint={state.blueprint}
                            onToggleClause={handleToggleClause}
                            onApprove={handleGenerateDoc}
                            isLoading={state.isLoading}
                            setBlueprint={handleSetBlueprint}
                            onBack={handleBack}
                        />
                    </motion.div>
                )}
                {state.stage === "preview" && state.fullText && (
                    <motion.div key="preview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <DocumentEditor
                            fullText={state.fullText}
                            onExport={handleExport}
                            isExporting={state.isExporting}
                            onBack={handleBack}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
