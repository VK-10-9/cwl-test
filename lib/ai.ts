import Groq from "groq-sdk";
import {
    Blueprint,
    OrganisationData,
    BlueprintClause,
    DocumentType
} from "@/types";
import { getTemplate } from "@/lib/templates";
import {
    buildBlueprintPrompt,
    buildExpansionPrompt,
    buildIterationPrompt
} from "@/lib/prompts";

// Initialize Groq client
// Fail loudly if GROQ_API_KEY is missing rather than silently using a dummy key
if (!process.env.GROQ_API_KEY) {
    console.warn("[lib/ai] GROQ_API_KEY environment variable is not set. AI calls will fail.");
}

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "",
});

const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"; // User-requested model

// --- Helper to enforce JSON output from Groq ---
async function generateJson<T>(
    systemPrompt: string,
    userPrompt: string,
    outputSchemaDescription: string
): Promise<T> {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `${systemPrompt}\n\nIMPORTANT: You must output ONLY valid JSON matching this structure: ${outputSchemaDescription}. Do not include markdown formatting or explanation.`,
                },
                { role: "user", content: userPrompt },
            ],
            model: MODEL,
            temperature: 0.1,
            // Note: response_format removed — Llama-4 Scout uses prompt-based JSON enforcement
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error("No content received from AI");

        // Strip markdown code fences if the model wraps JSON in ```json ... ```
        const cleaned = content
            .trim()
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/, "")
            .trim();

        return JSON.parse(cleaned) as T;
    } catch (error) {
        console.error("AI JSON Generation Error:", error);
        throw new Error("Failed to generate structured data from AI.");
    }
}

// --- Helper for text output ---
async function generateText(
    systemPrompt: string,
    userPrompt: string
): Promise<string> {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            model: MODEL,
            temperature: 0.7,
        });

        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("AI Text Generation Error:", error);
        throw new Error("Failed to generate text from AI.");
    }
}

// 1. Generate Blueprint
export async function generateBlueprint(
    docType: string,
    orgA: OrganisationData,
    orgB: OrganisationData | undefined,
    formData: Record<string, any>
): Promise<Blueprint> {
    const prompt = buildBlueprintPrompt(
        docType as DocumentType,
        orgA,
        orgB,
        formData
    );

    const system =
        "You are an expert legal drafter for the Indian jurisdiction. Your task is to plan a document structure. Generate a comprehensive list of clauses.";

    const schemaDesc = `{
    "title": "Document Title",
    "documentType": "${docType}",
    "summary": "Executive summary of the document",
    "clauses": [
      { "id": "unique_id", "title": "Clause Title", "description": "Plain English explanation", "content": "Full Legal Text of the Clause", "risk": "low|medium|high", "included": true }
    ]
  }`;

    try {
        const rawResult = await generateJson<Partial<Blueprint>>(system, prompt, schemaDesc);

        // Robust fallback if AI creates messy structure
        const safeClauses = Array.isArray(rawResult.clauses) ? rawResult.clauses : [];

        // Map clauses to ensure they have all required fields
        const validatedClauses: BlueprintClause[] = safeClauses.map((c, index) => {
            const clause = c as unknown as Record<string, unknown>;
            return {
                id: String(clause.id || `clause-${index}`),
                title: String(clause.title || "Untitled Clause"),
                description: String(clause.description || ""),
                content: String(clause.content || clause.text || ""),
                risk: ["low", "medium", "high"].includes(String(clause.risk)) ? (clause.risk as "low" | "medium" | "high") : "low",
                included: clause.included !== false
            };
        });

        // Use default clauses from template if AI returns empty
        if (validatedClauses.length === 0) {
            console.log("AI returned 0 clauses. Falling back to template defaults.");
            const template = getTemplate(docType as DocumentType);
            if (template && template.defaultClauses) {
                validatedClauses.push(...template.defaultClauses.map((title, i) => ({
                    id: `default-${i}`,
                    title: title,
                    description: `Standard ${title} clause for ${template.label}`,
                    content: "",
                    risk: "low",
                    included: true
                } as BlueprintClause)));
            }
        }

        return {
            title: rawResult.title || "Generated Document",
            documentType: (docType as DocumentType),
            summary: rawResult.summary || "Generated by ClauseWala.",
            clauses: validatedClauses
        };

    } catch (e) {
        console.error("Blueprint Generation Failed", e);
        // Return a safe fallback to prevent frontend crash
        return {
            title: "Error Generating Blueprint",
            documentType: (docType as DocumentType),
            summary: "The AI failed to generate a valid blueprint. Please try again.",
            clauses: []
        };
    }
}

// 2. Expand Document
export async function expandDocument(
    docType: string,
    orgA: OrganisationData,
    orgB: OrganisationData | undefined,
    formData: Record<string, any>,
    clauses: BlueprintClause[]
): Promise<string> {
    const prompt = buildExpansionPrompt(
        docType as DocumentType,
        orgA,
        orgB,
        formData,
        clauses
    );
    const system =
        "You are a senior lawyer drafting a final legal document. Output strictly the full legal text formatted in Markdown.";

    return generateText(system, prompt);
}

// 3. Iterate
export async function iterateBlueprint(
    currentBlueprint: Blueprint,
    userMessage: string
): Promise<{ blueprint: Blueprint; aiMessage: string }> {
    // Fix: Pass 3 arguments: documentType, clauses, userMessage
    const prompt = buildIterationPrompt(
        currentBlueprint.documentType,
        currentBlueprint.clauses,
        userMessage
    );

    const system =
        "You are a legal modification assistant. You update the document plan based on user feedback.";

    const schemaDesc = `{
      "blueprint": { ...same struct as before... },
      "aiMessage": "string explaining changes"
    }`;

    // Use a different schema for iteration output since the prompt expects:
    // { message: string, clauses: [] }
    // But my iterateBlueprint return type is { blueprint, aiMessage }.
    // I need to map the AI response to my return type.

    const aiResponse = await generateJson<{ message: string; clauses: BlueprintClause[] }>(
        system,
        prompt,
        `{ "message": "explanation", "clauses": [ ... ] }`
    );

    return {
        blueprint: {
            ...currentBlueprint,
            clauses: aiResponse.clauses
        },
        aiMessage: aiResponse.message
    };
}
