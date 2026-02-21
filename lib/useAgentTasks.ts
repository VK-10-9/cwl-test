"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { AgentTask, AgentMessageSection, Blueprint, BlueprintClause } from "@/types";

// ─── Response Parser ─────────────────────────────────────────────────────────
// Parses structured XML tags from the AI's streaming response

export function parseAgentResponse(text: string): AgentMessageSection[] {
    const sections: AgentMessageSection[] = [];
    let remaining = text;

    // Extract <thinking>...</thinking>
    const thinkingMatch = remaining.match(/<thinking>([\s\S]*?)<\/thinking>/);
    if (thinkingMatch) {
        sections.push({ type: "thinking", content: thinkingMatch[1].trim() });
        remaining = remaining.replace(thinkingMatch[0], "");
    }

    // Extract all <tool_call name="...">...</tool_call>
    const toolCallRegex = /<tool_call\s+name="([^"]+)">([\s\S]*?)<\/tool_call>/g;
    let toolMatch;
    while ((toolMatch = toolCallRegex.exec(remaining)) !== null) {
        sections.push({ type: "tool_call", tool: toolMatch[1], input: toolMatch[2].trim() });
    }
    remaining = remaining.replace(/<tool_call\s+name="[^"]+">([\s\S]*?)<\/tool_call>/g, "");

    // Extract <analysis>...</analysis>
    const analysisMatch = remaining.match(/<analysis>([\s\S]*?)<\/analysis>/);
    if (analysisMatch) {
        sections.push({ type: "analysis", content: analysisMatch[1].trim() });
        remaining = remaining.replace(analysisMatch[0], "");
    }

    // Remaining text — could be plain text or JSON
    const finalText = remaining.trim();
    if (finalText) {
        // Check if it's a JSON blueprint update
        const jsonMatch = finalText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const data = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
                if (data.clauses && Array.isArray(data.clauses)) {
                    sections.push({
                        type: "blueprint_update",
                        clauses: data.clauses as BlueprintClause[],
                        message: (data.message as string) || "Blueprint updated.",
                    });
                } else {
                    sections.push({ type: "text", content: finalText });
                }
            } catch {
                sections.push({ type: "text", content: finalText });
            }
        } else if (finalText.length > 5) {
            sections.push({ type: "text", content: finalText });
        }
    }

    return sections;
}

// ─── Streaming Parser State ──────────────────────────────────────────────────
// Tracks partial streaming text to extract sections progressively

export interface StreamingAgentState {
    thinking: string | null;
    toolCalls: { tool: string; input: string }[];
    analysis: string | null;
    isThinking: boolean;
    isAnalyzing: boolean;
    activeTools: string[];
}

export function parseStreamingState(partialText: string): StreamingAgentState {
    const state: StreamingAgentState = {
        thinking: null,
        toolCalls: [],
        analysis: null,
        isThinking: false,
        isAnalyzing: false,
        activeTools: [],
    };

    // Check if thinking section exists
    const thinkingOpen = partialText.indexOf("<thinking>");
    const thinkingClose = partialText.indexOf("</thinking>");
    if (thinkingOpen !== -1) {
        if (thinkingClose !== -1) {
            state.thinking = partialText.slice(thinkingOpen + 10, thinkingClose).trim();
        } else {
            state.isThinking = true;
            state.thinking = partialText.slice(thinkingOpen + 10).trim();
        }
    }

    // Check for tool calls
    const completedToolRegex = /<tool_call\s+name="([^"]+)">([\s\S]*?)<\/tool_call>/g;
    let match;
    while ((match = completedToolRegex.exec(partialText)) !== null) {
        state.toolCalls.push({ tool: match[1], input: match[2].trim() });
    }

    // Check for in-progress tool call
    const partialToolMatch = partialText.match(/<tool_call\s+name="([^"]+)">(?![\s\S]*<\/tool_call>)/);
    if (partialToolMatch) {
        state.activeTools = [partialToolMatch[1]];
    }

    // Check for analysis
    const analysisOpen = partialText.indexOf("<analysis>");
    const analysisClose = partialText.indexOf("</analysis>");
    if (analysisOpen !== -1) {
        if (analysisClose !== -1) {
            state.analysis = partialText.slice(analysisOpen + 10, analysisClose).trim();
        } else {
            state.isAnalyzing = true;
            state.analysis = partialText.slice(analysisOpen + 10).trim();
        }
    }

    return state;
}

// ─── Document Workflow Tasks ─────────────────────────────────────────────────
// Generates dynamic task lists based on the blueprint state

export function generateWorkflowTasks(blueprint: Blueprint): AgentTask[] {
    const clauses = blueprint.clauses || [];
    const includedClauses = clauses.filter((c) => c.included);
    const highRiskClauses = includedClauses.filter((c) => c.risk === "high");
    const medRiskClauses = includedClauses.filter((c) => c.risk === "medium");

    const tasks: AgentTask[] = [
        {
            id: "1",
            title: "Document Analysis",
            description: "Analyze document requirements and generate initial structure",
            status: "completed",
            subtasks: [
                {
                    id: "1.1",
                    title: "Parse document type requirements",
                    description: `Identified document type: ${blueprint.documentType}`,
                    status: "completed",
                    tools: ["clause-analyzer"],
                },
                {
                    id: "1.2",
                    title: "Generate clause structure",
                    description: `Generated ${clauses.length} clauses for the blueprint`,
                    status: "completed",
                    tools: ["clause-drafter"],
                },
                {
                    id: "1.3",
                    title: "Produce document summary",
                    description: blueprint.summary || "Summary generated",
                    status: "completed",
                    tools: ["plain-english-translator"],
                },
            ],
        },
        {
            id: "2",
            title: "Risk Assessment",
            description: "Evaluate risk levels for all included clauses",
            status: highRiskClauses.length > 0 ? "in-progress" : "completed",
            subtasks: [
                {
                    id: "2.1",
                    title: `High-risk clause review (${highRiskClauses.length})`,
                    description: highRiskClauses.length > 0
                        ? `Flagged: ${highRiskClauses.map((c) => c.title).join(", ")}`
                        : "No high-risk clauses detected",
                    status: highRiskClauses.length > 0 ? "in-progress" : "completed",
                    tools: ["risk-assessor"],
                },
                {
                    id: "2.2",
                    title: `Medium-risk clause review (${medRiskClauses.length})`,
                    description: medRiskClauses.length > 0
                        ? `Monitoring: ${medRiskClauses.map((c) => c.title).join(", ")}`
                        : "No medium-risk clauses detected",
                    status: medRiskClauses.length > 0 ? "in-progress" : "completed",
                    tools: ["risk-assessor"],
                },
                {
                    id: "2.3",
                    title: "Coverage gap analysis",
                    description: `${includedClauses.length}/${clauses.length} clauses active — check for missing protections`,
                    status: includedClauses.length < clauses.length ? "in-progress" : "completed",
                    tools: ["compliance-checker"],
                },
            ],
        },
        {
            id: "3",
            title: "Legal Compliance",
            description: "Verify compliance with Indian legal framework",
            status: "pending",
            subtasks: [
                {
                    id: "3.1",
                    title: "Indian Contract Act, 1872 check",
                    description: "Verify enforceability under Indian contract law",
                    status: "pending",
                    tools: ["legal-research", "compliance-checker"],
                },
                {
                    id: "3.2",
                    title: "Jurisdiction validation",
                    description: "Confirm jurisdiction clauses are properly scoped",
                    status: "pending",
                    tools: ["legal-research"],
                },
            ],
        },
        {
            id: "4",
            title: "Ready for Compilation",
            description: "Finalize blueprint and prepare for full document generation",
            status: "pending",
            subtasks: [
                {
                    id: "4.1",
                    title: "User review pending",
                    description: "Waiting for user to review and approve all clauses",
                    status: "pending",
                },
                {
                    id: "4.2",
                    title: "Compile final document",
                    description: "Expand all approved clauses into formal legal language",
                    status: "pending",
                    tools: ["clause-drafter", "plain-english-translator"],
                },
            ],
        },
    ];

    return tasks;
}

// ─── Chat-Driven Task Updates ────────────────────────────────────────────────
// Updates tasks based on what the AI agent is currently doing

export function updateTasksFromChat(
    baseTasks: AgentTask[],
    streamingState: StreamingAgentState,
    isLoading: boolean,
    messageCount: number
): AgentTask[] {
    if (!isLoading && messageCount === 0) return baseTasks;

    return baseTasks.map((task) => {
        // If loading and we have active tools, mark related tasks
        if (isLoading && streamingState.activeTools.length > 0) {
            const hasActiveTool = task.subtasks.some(
                (sub) => sub.tools?.some((t) => streamingState.activeTools.includes(t))
            );
            if (hasActiveTool && task.status !== "completed") {
                return {
                    ...task,
                    status: "in-progress" as const,
                    subtasks: task.subtasks.map((sub) => {
                        const isActive = sub.tools?.some((t) => streamingState.activeTools.includes(t));
                        if (isActive && sub.status !== "completed") {
                            return { ...sub, status: "in-progress" as const };
                        }
                        return sub;
                    }),
                };
            }
        }

        // Mark completed tool calls as done
        if (streamingState.toolCalls.length > 0) {
            const completedToolNames = streamingState.toolCalls.map((tc) => tc.tool);
            const hasCompletedTool = task.subtasks.some(
                (sub) => sub.tools?.some((t) => completedToolNames.includes(t))
            );
            if (hasCompletedTool) {
                const updatedSubtasks = task.subtasks.map((sub) => {
                    const toolDone = sub.tools?.some((t) => completedToolNames.includes(t));
                    if (toolDone && sub.status !== "completed") {
                        return { ...sub, status: "completed" as const };
                    }
                    return sub;
                });
                const allDone = updatedSubtasks.every((s) => s.status === "completed");
                return {
                    ...task,
                    status: allDone ? "completed" as const : task.status,
                    subtasks: updatedSubtasks,
                };
            }
        }

        return task;
    });
}

// ─── useAgentTasks Hook ──────────────────────────────────────────────────────

export function useAgentTasks(blueprint: Blueprint) {
    const [baseTasks, setBaseTasks] = useState<AgentTask[]>(() =>
        generateWorkflowTasks(blueprint)
    );
    const [streamingState, setStreamingState] = useState<StreamingAgentState>({
        thinking: null,
        toolCalls: [],
        analysis: null,
        isThinking: false,
        isAnalyzing: false,
        activeTools: [],
    });

    // Regenerate base tasks when blueprint changes
    const prevBlueprintRef = useRef(blueprint);
    useEffect(() => {
        if (prevBlueprintRef.current !== blueprint) {
            setBaseTasks(generateWorkflowTasks(blueprint));
            prevBlueprintRef.current = blueprint;
        }
    }, [blueprint]);

    const updateStreamingState = useCallback((partialText: string) => {
        setStreamingState(parseStreamingState(partialText));
    }, []);

    const resetStreamingState = useCallback(() => {
        setStreamingState({
            thinking: null,
            toolCalls: [],
            analysis: null,
            isThinking: false,
            isAnalyzing: false,
            activeTools: [],
        });
    }, []);

    return {
        baseTasks,
        streamingState,
        updateStreamingState,
        resetStreamingState,
        setBaseTasks,
    };
}
