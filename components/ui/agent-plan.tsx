"use client";

import React, { useState } from "react";
import {
    CheckCircle2,
    Circle,
    CircleDotDashed,
    CircleX,
    Cpu,
    Zap,
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import type { AgentTask, AgentSubtask, AgentTaskStatus } from "@/types";

// ─── Status Rendering ────────────────────────────────────────────────────────

function StatusIcon({ status, size = "md" }: { status: AgentTaskStatus; size?: "sm" | "md" }) {
    const cls = size === "sm" ? "h-3.5 w-3.5" : "h-4.5 w-4.5";
    switch (status) {
        case "completed":
            return <CheckCircle2 className={`${cls} text-green-500`} />;
        case "in-progress":
            return <CircleDotDashed className={`${cls} text-blue-500 animate-spin`} style={{ animationDuration: "3s" }} />;
        case "failed":
            return <CircleX className={`${cls} text-red-500`} />;
        default:
            return <Circle className={`${cls} text-muted-foreground`} />;
    }
}

function statusColor(status: AgentTaskStatus): string {
    switch (status) {
        case "completed": return "bg-green-500/10 text-green-400 border-green-500/20";
        case "in-progress": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
        case "failed": return "bg-red-500/10 text-red-400 border-red-500/20";
        default: return "bg-muted text-muted-foreground border-border/50";
    }
}

// ─── Animation Variants ──────────────────────────────────────────────────────

const taskVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 500, damping: 30 },
    },
    exit: { opacity: 0, y: -5, transition: { duration: 0.15 } },
};

const subtaskListVariants = {
    hidden: { opacity: 0, height: 0, overflow: "hidden" as const },
    visible: {
        height: "auto" as const,
        opacity: 1,
        overflow: "visible" as const,
        transition: {
            duration: 0.25,
            staggerChildren: 0.05,
            when: "beforeChildren" as const,
            ease: [0.2, 0.65, 0.3, 0.9] as [number, number, number, number],
        },
    },
    exit: {
        height: 0,
        opacity: 0,
        overflow: "hidden" as const,
        transition: { duration: 0.2, ease: [0.2, 0.65, 0.3, 0.9] as [number, number, number, number] },
    },
};

const subtaskVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { type: "spring" as const, stiffness: 500, damping: 25 },
    },
    exit: { opacity: 0, x: -10, transition: { duration: 0.15 } },
};

const subtaskDetailsVariants = {
    hidden: { opacity: 0, height: 0, overflow: "hidden" as const },
    visible: {
        opacity: 1,
        height: "auto" as const,
        overflow: "visible" as const,
        transition: { duration: 0.25, ease: [0.2, 0.65, 0.3, 0.9] as [number, number, number, number] },
    },
};

// ─── Progress Bar ────────────────────────────────────────────────────────────

function ProgressBar({ tasks }: { tasks: AgentTask[] }) {
    const allSubtasks = tasks.flatMap((t) => t.subtasks);
    const total = allSubtasks.length || 1;
    const completed = allSubtasks.filter((s) => s.status === "completed").length;
    const inProgress = allSubtasks.filter((s) => s.status === "in-progress").length;
    const pct = Math.round(((completed + inProgress * 0.5) / total) * 100);

    return (
        <div className="px-4 pt-3 pb-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-1.5">
                <span className="flex items-center gap-1.5">
                    <Cpu className="h-3 w-3 text-primary" />
                    EXECUTION PROGRESS
                </span>
                <span className="text-primary">{pct}%</span>
            </div>
            <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-[9px] font-mono text-muted-foreground/70">
                <span>{completed} done</span>
                <span>{inProgress} active</span>
                <span>{total - completed - inProgress} pending</span>
            </div>
        </div>
    );
}

// ─── Subtask Row ─────────────────────────────────────────────────────────────

function SubtaskRow({ subtask, taskId, expandedSubtasks, toggleSubtaskExpansion }: {
    subtask: AgentSubtask;
    taskId: string;
    expandedSubtasks: Record<string, boolean>;
    toggleSubtaskExpansion: (taskId: string, subtaskId: string) => void;
}) {
    const subtaskKey = `${taskId}-${subtask.id}`;
    const isSubtaskExpanded = expandedSubtasks[subtaskKey];

    return (
        <motion.li
            key={subtask.id}
            className="group flex flex-col py-0.5 pl-6"
            onClick={() => toggleSubtaskExpansion(taskId, subtask.id)}
            variants={subtaskVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
        >
            <motion.div
                className="flex flex-1 items-center rounded-md p-1 cursor-pointer"
                whileHover={{
                    backgroundColor: "rgba(255,255,255,0.03)",
                    transition: { duration: 0.2 },
                }}
                layout
            >
                <div className="mr-2 flex-shrink-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={subtask.status}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2, ease: [0.2, 0.65, 0.3, 0.9] }}
                        >
                            <StatusIcon status={subtask.status} size="sm" />
                        </motion.div>
                    </AnimatePresence>
                </div>
                <span className={`text-sm ${subtask.status === "completed" ? "text-muted-foreground line-through" : ""}`}>
                    {subtask.title}
                </span>
                {subtask.status === "in-progress" && (
                    <span className="ml-auto text-[9px] font-mono text-blue-400 animate-pulse">RUNNING</span>
                )}
            </motion.div>

            <AnimatePresence mode="wait">
                {isSubtaskExpanded && (
                    <motion.div
                        className="text-muted-foreground border-foreground/20 mt-1 ml-1.5 border-l border-dashed pl-5 text-xs overflow-hidden"
                        variants={subtaskDetailsVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        layout
                    >
                        <p className="py-1">{subtask.description}</p>
                        {subtask.tools && subtask.tools.length > 0 && (
                            <div className="mt-0.5 mb-1 flex flex-wrap items-center gap-1.5">
                                <span className="text-muted-foreground font-medium text-[10px]">Tools:</span>
                                <div className="flex flex-wrap gap-1">
                                    {subtask.tools.map((tool, idx) => (
                                        <motion.span
                                            key={idx}
                                            className="bg-primary/10 text-primary/80 rounded px-1.5 py-0.5 text-[10px] font-mono font-medium border border-primary/20"
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                transition: { duration: 0.2, delay: idx * 0.05 },
                                            }}
                                            whileHover={{
                                                y: -1,
                                                backgroundColor: "rgba(255,255,255,0.1)",
                                                transition: { duration: 0.2 },
                                            }}
                                        >
                                            {tool}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.li>
    );
}

// ─── Main Plan Component ─────────────────────────────────────────────────────

interface PlanProps {
    tasks: AgentTask[];
}

export default function Plan({ tasks }: PlanProps) {
    const [expandedTasks, setExpandedTasks] = useState<string[]>(() =>
        tasks.filter((t) => t.status === "in-progress").map((t) => t.id)
    );
    const [expandedSubtasks, setExpandedSubtasks] = useState<Record<string, boolean>>({});

    const toggleTaskExpansion = (taskId: string) => {
        setExpandedTasks((prev) =>
            prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
        );
    };

    const toggleSubtaskExpansion = (taskId: string, subtaskId: string) => {
        const key = `${taskId}-${subtaskId}`;
        setExpandedSubtasks((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <Zap className="h-8 w-8 text-muted-foreground/30 mb-3" />
                <p className="text-xs font-mono text-muted-foreground/50">NO ACTIVE TASKS</p>
                <p className="text-[10px] text-muted-foreground/30 mt-1">
                    Start a conversation to see the agent&apos;s execution plan
                </p>
            </div>
        );
    }

    return (
        <div className="bg-background text-foreground h-full overflow-auto p-2">
            <ProgressBar tasks={tasks} />

            <motion.div
                className="bg-card border-border rounded-lg border shadow overflow-hidden mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.3, ease: [0.2, 0.65, 0.3, 0.9] },
                }}
            >
                <LayoutGroup>
                    <div className="p-3 overflow-hidden">
                        <ul className="space-y-1 overflow-hidden">
                            {tasks.map((task, index) => {
                                const isExpanded = expandedTasks.includes(task.id);
                                const isCompleted = task.status === "completed";
                                const completedSubs = task.subtasks.filter((s) => s.status === "completed").length;

                                return (
                                    <motion.li
                                        key={task.id}
                                        className={index !== 0 ? "mt-1 pt-2 border-t border-border/20" : ""}
                                        initial="hidden"
                                        animate="visible"
                                        variants={taskVariants}
                                    >
                                        {/* Task header row */}
                                        <motion.div
                                            className="group flex items-center px-2 py-1.5 rounded-md cursor-pointer"
                                            onClick={() => toggleTaskExpansion(task.id)}
                                            whileHover={{
                                                backgroundColor: "rgba(255,255,255,0.03)",
                                                transition: { duration: 0.2 },
                                            }}
                                        >
                                            <div className="mr-2 flex-shrink-0">
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={task.status}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        transition={{ duration: 0.2, ease: [0.2, 0.65, 0.3, 0.9] }}
                                                    >
                                                        <StatusIcon status={task.status} />
                                                    </motion.div>
                                                </AnimatePresence>
                                            </div>

                                            <div className="flex min-w-0 flex-grow items-center justify-between">
                                                <div className="mr-2 flex-1 truncate">
                                                    <span className={`text-sm ${isCompleted ? "text-muted-foreground line-through" : ""}`}>
                                                        {task.title}
                                                    </span>
                                                </div>
                                                <div className="flex flex-shrink-0 items-center space-x-2 text-xs">
                                                    {task.subtasks.length > 0 && (
                                                        <span className="text-[10px] font-mono text-muted-foreground/60">
                                                            {completedSubs}/{task.subtasks.length}
                                                        </span>
                                                    )}
                                                    <motion.span
                                                        className={`rounded px-1.5 py-0.5 text-[10px] font-mono border ${statusColor(task.status)}`}
                                                        key={task.status}
                                                        initial={{ scale: 1 }}
                                                        animate={{
                                                            scale: [1, 1.08, 1],
                                                            transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
                                                        }}
                                                    >
                                                        {task.status}
                                                    </motion.span>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Subtasks */}
                                        <AnimatePresence mode="wait">
                                            {isExpanded && task.subtasks.length > 0 && (
                                                <motion.div
                                                    className="relative overflow-hidden"
                                                    variants={subtaskListVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="hidden"
                                                    layout
                                                >
                                                    <div className="absolute top-0 bottom-0 left-[16px] border-l-2 border-dashed border-muted-foreground/20" />
                                                    <ul className="mt-1 mr-2 mb-1.5 ml-2 space-y-0.5">
                                                        {task.subtasks.map((subtask) => (
                                                            <SubtaskRow
                                                                key={subtask.id}
                                                                subtask={subtask}
                                                                taskId={task.id}
                                                                expandedSubtasks={expandedSubtasks}
                                                                toggleSubtaskExpansion={toggleSubtaskExpansion}
                                                            />
                                                        ))}
                                                    </ul>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.li>
                                );
                            })}
                        </ul>
                    </div>
                </LayoutGroup>
            </motion.div>
        </div>
    );
}
