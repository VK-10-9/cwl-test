"use client";

import Plan from "@/components/ui/agent-plan";
import type { AgentTask } from "@/types";

const demoTasks: AgentTask[] = [
    {
        id: "1",
        title: "Document Analysis",
        description: "Analyze document requirements",
        status: "completed",
        subtasks: [
            { id: "1.1", title: "Parse document type", description: "Identified as NDA", status: "completed", tools: ["clause-analyzer"] },
            { id: "1.2", title: "Generate clause structure", description: "Generated 8 clauses", status: "completed", tools: ["clause-drafter"] },
        ],
    },
    {
        id: "2",
        title: "Risk Assessment",
        description: "Evaluate risks",
        status: "in-progress",
        subtasks: [
            { id: "2.1", title: "High-risk review", description: "Checking 2 flagged clauses", status: "in-progress", tools: ["risk-assessor"] },
            { id: "2.2", title: "Coverage gap analysis", description: "Pending", status: "pending" },
        ],
    },
];

export default function Demo() {
    return (
        <div className="flex flex-col p-4 w-full h-full">
            <Plan tasks={demoTasks} />
        </div>
    );
}
