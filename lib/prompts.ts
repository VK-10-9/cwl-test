import type { DocumentType, OrganisationData, BlueprintClause } from "@/types";
import { DOCUMENT_TYPE_LABELS } from "@/types";
import { getTemplate } from "@/lib/templates";
import { STANDARD_CLAUSES } from "@/lib/clause-library";

// ─── Blueprint Generation Prompt ─────────────────────────────────────────────

export function buildBlueprintPrompt(
    documentType: DocumentType,
    orgA: OrganisationData,
    orgB: OrganisationData | undefined,
    formData: Record<string, any>
): string {
    const template = getTemplate(documentType);
    const typeLabel = DOCUMENT_TYPE_LABELS[documentType];

    const orgBSection = orgB
        ? `
**Party B (Second Party):**
- Name: ${orgB.name}
- Address: ${orgB.address || "Not provided"}
- Jurisdiction: ${orgB.jurisdiction || "Not specified"}
- Signatory: ${orgB.signatoryName || "Not provided"}`
        : "";

    const formFields = Object.entries(formData)
        .map(([key, value]) => `- ${key}: ${value}`)
        .join("\n");

    return `You are an expert Indian legal document drafting assistant. You specialise in generating structured document blueprints for organisations.

**Task:** Generate a blueprint (clause-by-clause plan) for a ${typeLabel}.

**Party A (Primary Party):**
- Name: ${orgA.name}
- Address: ${orgA.address || "Not provided"}
- Jurisdiction: ${orgA.jurisdiction || "Not specified"}
- Signatory: ${orgA.signatoryName || "Not provided"}
${orgBSection}

**Document-Specific Information:**
${formFields}

**Default Clause Structure for ${typeLabel}:**
${template.defaultClauses.map((c, i) => `${i + 1}. ${c}`).join("\n")}

**Instructions:**
1. Generate a JSON array of clause objects for this ${typeLabel}.
2. Each clause must have these exact fields:
   - "id": a unique snake_case identifier (e.g., "definition_confidential_info")
   - "title": the clause title in plain English
   - "description": a 1-2 sentence plain-English explanation of what the clause covers and why it matters
   - "included": boolean — whether this clause should be included (default true for standard clauses)
   - "risk": "low" | "medium" | "high" — the risk level if this clause is omitted or poorly drafted
3. Include all standard clauses listed above, plus any additional clauses relevant based on the specific details provided.
4. For Indian jurisdiction: reference relevant Indian laws (The Indian Contract Act, 1872; The Arbitration and Conciliation Act, 1996; The Information Technology Act, 2000) where applicable in clause descriptions.
5. Keep descriptions simple and jargon-free — the user should understand what each clause means.
6. **CRITICAL:** Use the provided 'disclosureType' and 'relationshipType' to structure the agreement.
   - If 'disclosureType' is 'Unilateral', obligations fall primarily on the Receiving Party.
   - If 'disclosureType' is 'Mutual', ensure confidentiality obligations are reciprocal.
   - If 'includeNonCompete' is TRUE/YES, you MUST include a robust Non-Compete clause.
   - If 'includeNonSolicit' is TRUE/YES, you MUST include a Non-Solicitation clause.
   - If 'includeIPAssignment' is TRUE/YES, you MUST include an IP Assignment/Work-for-Hire clause.

**Response Format:**
Respond with ONLY a valid JSON object with this structure:
{
  "summary": "Brief 1-2 sentence summary of the document plan",
  "clauses": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "included": true/false,
      "risk": "low" | "medium" | "high"
    }
  ]
}

Do NOT include any text before or after the JSON. The response must be valid parseable JSON.`;
}

// ─── Full Document Expansion Prompt ──────────────────────────────────────────

export function buildExpansionPrompt(
    documentType: DocumentType,
    orgA: OrganisationData,
    orgB: OrganisationData | undefined,
    formData: Record<string, any>,
    clauses: BlueprintClause[]
): string {
    const typeLabel = DOCUMENT_TYPE_LABELS[documentType];

    const includedClauses = clauses
        .filter((c) => c.included)
        .map((c, i) => `${i + 1}. ${c.title}: ${c.description}`)
        .join("\n");

    const orgBSection = orgB
        ? `
**Party B:** ${orgB.name}
- Address: ${orgB.address || "Not provided"}
- Signatory: ${orgB.signatoryName || "Not provided"}`
        : "";

    const formFields = Object.entries(formData)
        .map(([key, value]) => `- ${key}: ${value}`)
        .join("\n");

    // Determine Party Labels based on Relationship Type logic
    const relationshipType = formData.relationshipType;
    let partyALabel = "Disclosing Party";
    let partyBLabel = "Receiving Party";

    if (relationshipType === 'employee') {
        partyALabel = "Employer";
        partyBLabel = "Employee";
    } else if (relationshipType === 'contractor') {
        partyALabel = "Company";
        partyBLabel = "Contractor";
    } else if (relationshipType === 'investor') {
        partyALabel = "Company";
        partyBLabel = "Investor";
    }

    // Logic for Mutual NDA labels
    if (formData.disclosureType === 'mutual') {
        partyALabel = "Party A";
        partyBLabel = "Party B";
    }

    // Logic for Obligations: Employee vs Standard
    let obligationsClause = formData.disclosureType === 'mutual' ? STANDARD_CLAUSES.obligations_mutual : STANDARD_CLAUSES.obligations_unilateral;
    if (relationshipType === 'employee') {
        obligationsClause = STANDARD_CLAUSES.obligations_employee;
    }

    // Logic for Dispute Resolution
    const remediesClause = formData.disputeResolution === 'arbitration'
        ? STANDARD_CLAUSES.remedies_arbitration
        : STANDARD_CLAUSES.remedies_court;

    // Logic for Survival Duration
    const confidentialityYears = formData.confidentialityDuration || "5"; // Default to 5
    const survivalClause = STANDARD_CLAUSES.survival_clause.replace("[DURATION]", confidentialityYears);

    return `You are an expert Indian legal document drafter. Expand the following approved blueprint into a complete, professionally formatted ${typeLabel}.

**Party A (${partyALabel}):** ${orgA.name}
- Address: ${orgA.address || "Not provided"}
- Signatory: ${orgA.signatoryName || "Not provided"}
${orgBSection} (Label: ${partyBLabel})

**Document Details:**
${formFields}

**Approved Clauses to Expand:**

        ${includedClauses}

** MANDATORY STANDARD CLAUSE TEXT(USE EXACTLY AS PROVIDED):**
        1. Governing Law: "${STANDARD_CLAUSES.governing_law_india}"
    2. Severability: "${STANDARD_CLAUSES.severability}"
    3. Entire Agreement: "${STANDARD_CLAUSES.entire_agreement}"
    4. Confidentiality Def: "${STANDARD_CLAUSES.confidentiality_definition_broad}"
    5. Exceptions: "${STANDARD_CLAUSES.exceptions_standard}"
    6. Survival: "${survivalClause}"
    7. Obligations: "${obligationsClause}"
    8. Dispute Resolution: "${remediesClause}"

        ** RISK CONTROL CLAUSES(Inject ONLY if relevant flag is TRUE):**
            - Non - Solicit(Standard): "${STANDARD_CLAUSES.non_solicit}"
                - Non - Compete(Standard): "${STANDARD_CLAUSES.non_compete}"
                    - IP Assignment(Strong): "${STANDARD_CLAUSES.ip_assignment_strong}"
                        - Data Protection(If needed): "${STANDARD_CLAUSES.data_protection}"
                            - No License(Standard): "${STANDARD_CLAUSES.no_license}"

                                ** Instructions:**
                                    1. ** Structure & Parties:**
                                        - Document Title: Use a clear title(e.g., "${relationshipType === 'employee' ? 'EMPLOYEE CONFIDENTIALITY AGREEMENT' : 'NON-DISCLOSURE AGREEMENT'}").
    - ** Letterhead Compatibility:** Start the document IMMEDIATELY with the Agreement Title.Do NOT include any placeholder for "Company Logo", "Date", or "Ref No" at the very top.
    - Preamble: Explicitly define ${orgA.name} as "${partyALabel}" and[Party B Name] as "${partyBLabel}".
    - consistency: Use these defined labels("${partyALabel}" and "${partyBLabel}") consistently throughout the document.

2. ** Core Clauses:**
        - Use the MANDATORY STANDARD CLAUSE TEXT provided above.
    - ** Obligations:** The provided obligations clause is already tailored to the relationship(${relationshipType}).Use it exactly.
    - ** Dispute Resolution:** Use the provided clause(either Arbitration or Court).Ensure the[CITY] placeholder is filled with the venue city(defaulting to ${orgA.address ? orgA.address.split(',').pop()?.trim() : 'Bangalore'}).

3. ** Risk Controls(Logic):**
        - IF 'includeNonCompete' is TRUE: Insert the Non - Compete standard clause.Fill[PERIOD] and[TERRITORY] with reasonable defaults(e.g. 12 months, India) if not specified.
    - IF 'includeNonSolicit' is TRUE: Insert the Non - Solicitation standard clause.
    - IF 'includeIPAssignment' is TRUE: Insert the 'IP Assignment (Strong)' clause.
    - For Employee / Contractor agreements, ALWAYS include the 'No License' clause.

4. ** Jurisdiction & Venue:**
        - Governing Law is India.
    - Venue: Use the city provided in Party A's address (e.g., "${orgA.address ? orgA.address.split(', ').pop()?.trim() : 'Bangalore'}") as the exclusive jurisdiction city.

    5. ** Formatting:**
        - Number all clauses sequentially.
    - Use clear, professional formatting. 
    - End with a proper signature block for ${partyALabel} and ${partyBLabel}.

** Output:** Provide ONLY the complete document text.`;
}

// ─── Iteration Prompt ────────────────────────────────────────────────────────

export function buildIterationPrompt(
    documentType: DocumentType,
    currentClauses: BlueprintClause[],
    userMessage: string
): string {
    const typeLabel = DOCUMENT_TYPE_LABELS[documentType];

    const clauseList = currentClauses
        .map(
            (c, i) =>
                `${i + 1}.[${c.included ? "INCLUDED" : "EXCLUDED"}] ${c.title} (risk: ${c.risk}): ${c.description}`
        )
        .join("\n");

    return `You are an expert startup lawyer assisting a founder. Your goal is to explain legal concepts in simple, plain English and protect the founder's interests without over-complicating things. Avoid legalese in your explanations.

**Current Blueprint Clauses:**
${clauseList}

**User's Feedback:**
"${userMessage}"

**Instructions:**
1. Analyze the user's feedback.

2. **SCENARIO A: User asks a QUESTION (e.g., "Why is this needed?", "Explain this risk")**
   - Respond with a clear, concise, plain-English answer.
   - Do NOT use legal jargon.
   - Relate risks to business impact (e.g., "This might scare away potential hires" or "Investors require this").
   - DO NOT return JSON. Just return the text response.

3. **SCENARIO B: User asks for CHANGES (e.g., "Remove non-compete", "Make it stricter")**
   - Update the blueprint clauses accordingly.
   - Respond with **ONLY a valid JSON object** with this structure:
     {
        "message": "Brief, founder-friendly explanation of change.",
        "clauses": [
            { "id": "string", "title": "string", "description": "string", "included": boolean, "risk": "low" | "medium" | "high" }
        ]
     }
   - Preserve all clauses not mentioned (do not delete them, just update the list).
   - If removing, set included: false.
`;
}
