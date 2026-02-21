import type { DocumentType, OrganisationData, BlueprintClause } from "@/types";
import { DOCUMENT_TYPE_LABELS } from "@/types";
import { getTemplate } from "@/lib/templates";
import { STANDARD_CLAUSES } from "@/lib/clause-library";

// ─── Risk Framework ──────────────────────────────────────────────────────────

const RISK_FRAMEWORK = `
**Risk Assessment Criteria — follow these STRICTLY when assigning risk levels:**

HIGH risk (critical — omitting this clause exposes the party to serious legal, financial, or reputational damage):
  - Clauses that define core obligations (e.g., confidentiality, IP ownership, payment terms)
  - Clauses required by law or regulation for enforceability
  - Clauses that, if missing, could void the entire agreement
  - Indemnification, limitation of liability, termination rights

MEDIUM risk (important — omitting weakens protection but doesn't invalidate the document):
  - Dispute resolution mechanism
  - Non-compete / non-solicitation
  - Data protection provisions
  - Reporting, monitoring, amendment procedures
  - Notice requirements, force majeure

LOW risk (standard — good practice but not legally critical):
  - Formatting sections (letterhead, signatures, dates)
  - Boilerplate clauses (severability, waiver, entire agreement)
  - Cosmetic sections (preamble wording, recitals)
`.trim();

// ─── Doc-Type Specific Guidance ──────────────────────────────────────────────

const DOC_TYPE_GUIDANCE: Record<DocumentType, string> = {
    nda: `
**NDA-Specific Rules:**
- The definition of "Confidential Information" is the MOST CRITICAL clause — mark as HIGH risk.
- If disclosureType is "Mutual", all obligations must be reciprocal (both parties are Disclosing AND Receiving).
- If disclosureType is "Unilateral", obligations fall on the Receiving Party only.
- Reference: Indian Contract Act, 1872 (enforceability); IT Act, 2000 (digital information).
- Non-compete clauses are generally unenforceable in India during employment (Section 27, Indian Contract Act) — flag this as a risk note.
- ALWAYS include: Return/Destruction of Materials, Survival period, Remedies (injunctive relief).
- If includeNonCompete is TRUE, include it but note enforceability limitations under Indian law.
- If includeNonSolicit is TRUE, include a robust Non-Solicitation clause.
- If includeIPAssignment is TRUE, include IP Assignment with moral rights waiver under Copyright Act, 1957.
`,
    mou: `
**MOU-Specific Rules:**
- MOUs are generally non-binding in India unless they contain binding operative clauses.
- ALWAYS clearly state whether the MOU is binding or non-binding in the preamble — HIGH risk if ambiguous.
- Roles and Responsibilities clause is HIGH risk — vague responsibilities cause disputes.
- Financial arrangements must be specific (amounts, timelines, payment methods) — HIGH risk if vague.
- Include IP ownership clause if collaboration produces any work product.
- Termination clause must include notice period, cure period, and consequences.
- Dispute resolution is MEDIUM risk — specify arbitration or mediation before litigation.
- For government MOUs, reference relevant procurement or partnership regulations.
`,
    "request-letter": `
**Request Letter-Specific Rules:**
- This is a formal communication, not a contract — risk levels relate to professional effectiveness.
- Subject line clarity is HIGH risk — unclear subject = ignored letter.
- Justification and supporting evidence are HIGH risk — without them the request will be denied.
- Timeline and urgency must be specific (exact dates, not "soon" or "at your earliest convenience").
- Call to Action must be unambiguous — state exactly what action is needed and by when.
- Tone should match the formality level: government = highly formal, internal = professional but warm.
- Always include reference number for traceability.
`,
    "internship-cert": `
**Internship Certificate-Specific Rules:**
- This is a formal attestation of work done — accuracy is paramount.
- Intern identification (full name, ID) is HIGH risk — errors invalidate the certificate.
- Period of internship (exact start/end dates) is HIGH risk — must be precise for academic credit.
- Performance assessment should be factual and positive (or neutral) — avoid subjective superlatives.
- Skills and responsibilities should list specific technologies, tools, or domains — not generic phrases.
- Must include organization seal/stamp for authenticity.
- Signatory must have authority to issue such certificates (HR head, department manager, director).
- Reference certificate number for verification purposes.
`,
    "sponsorship-letter": `
**Sponsorship Letter-Specific Rules:**
- This is a persuasive business document — effectiveness = risk.
- Event overview must be compelling with concrete data (expected footfall, media coverage, demographics).
- Sponsorship benefits must be SPECIFIC and QUANTIFIED — "brand visibility" alone is worthless.
- Financial terms are HIGH risk — unclear amounts or deliverables cause disputes.
- Include tiered sponsorship options if applicable (Gold, Silver, Bronze).
- Brand visibility details must specify exact placements (stage backdrop, website homepage, social media posts with reach numbers).
- Always include a clear deadline for sponsorship confirmation.
- ROI framing: relate benefits to sponsor's target audience and marketing goals.
`,
};

// ─── Blueprint Generation Prompt ─────────────────────────────────────────────

export function buildBlueprintPrompt(
    documentType: DocumentType,
    orgA: OrganisationData,
    orgB: OrganisationData | undefined,
    formData: Record<string, string | number | boolean>
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
        .filter(([, value]) => value !== undefined && value !== "")
        .map(([key, value]) => `- ${key}: ${value}`)
        .join("\n");

    return `You are an expert Indian legal document drafting assistant with deep knowledge of Indian contract law, corporate law, and regulatory requirements.

**Task:** Generate a comprehensive blueprint (clause-by-clause plan) for a ${typeLabel}.

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

${RISK_FRAMEWORK}

${DOC_TYPE_GUIDANCE[documentType]}

**Instructions:**
1. Generate a JSON array of clause objects for this ${typeLabel}.
2. Each clause must have these exact fields:
   - "id": a unique snake_case identifier (e.g., "definition_confidential_info")
   - "title": the clause title
   - "description": 2-3 sentences explaining:
     (a) What the clause covers
     (b) WHY it matters for THIS specific document
     (c) What could go wrong if it's weak or missing
   - "included": boolean — true for essential clauses, false for optional ones the user may want to add
   - "risk": "low" | "medium" | "high" — assessed using the RISK FRAMEWORK above, considering THIS specific document's context
3. Include ALL standard clauses listed above, PLUS additional clauses that are relevant based on the specific details provided (party names, jurisdiction, relationship type, etc.).
4. For Indian jurisdiction: reference relevant Indian laws where applicable in clause descriptions.
5. Keep descriptions simple and jargon-free — a founder with no legal background should understand every word.
6. Order clauses logically — from most important/structural to least.

**Response Format:**
Respond with ONLY a valid JSON object:
{
  "summary": "2-3 sentence executive summary of the document plan, including key risks identified",
  "clauses": [
    {
      "id": "string",
      "title": "string",
      "description": "string (2-3 sentences as described above)",
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
    formData: Record<string, string | number | boolean>,
    clauses: BlueprintClause[]
): string {
    const typeLabel = DOCUMENT_TYPE_LABELS[documentType];
    const template = getTemplate(documentType);

    const includedClauses = clauses
        .filter((c) => c.included)
        .map((c, i) => `${i + 1}. [${c.risk.toUpperCase()} RISK] ${c.title}: ${c.description}${c.content ? `\n   Draft text: ${c.content}` : ""}`)
        .join("\n");

    const orgBSection = orgB
        ? `
**Party B:** ${orgB.name}
- Address: ${orgB.address || "Not provided"}
- Signatory: ${orgB.signatoryName || "Not provided"}`
        : "";

    const formFields = Object.entries(formData)
        .filter(([, value]) => value !== undefined && value !== "")
        .map(([key, value]) => `- ${key}: ${value}`)
        .join("\n");

    // ── Document-type-specific expansion rules ──

    const docTypeExpansionRules = buildDocTypeExpansionRules(documentType, formData, orgA, orgB);

    return `You are a senior legal professional drafting a complete, final ${typeLabel} for use in India. This document must be ready for signature — professional, precise, and legally sound.

**Party A:** ${orgA.name}
- Address: ${orgA.address || "Not provided"}
- Signatory: ${orgA.signatoryName || "Not provided"}
${orgBSection}

**Document Details:**
${formFields}

**Approved Clauses to Expand (with risk levels):**
${includedClauses}

${docTypeExpansionRules}

**QUALITY STANDARDS — your output MUST meet ALL of these:**

1. **Completeness:** Every approved clause must be expanded into full, professional text. Do NOT skip or summarize any clause.

2. **Specificity:** Replace ALL placeholders with actual values from the provided details:
   - [PARTY_A] → ${orgA.name}
   - [PARTY_B] → ${orgB?.name || "the Second Party"}
   - [DATE] → use the provided effective date or "the date of execution"
   - [CITY] → extract from addresses, default to the jurisdiction city
   - [DURATION] → use provided values, or state reasonable defaults (e.g., "2 years")
   - NEVER leave [BRACKET] placeholders in the final output.

3. **Risk Awareness:** HIGH RISK clauses must be drafted with extra precision:
   - Use clear, unambiguous language
   - Include specific remedies for breach
   - Reference applicable Indian laws where relevant
   - Add protective sub-clauses (e.g., injunctive relief, indemnification)

4. **Legal Accuracy:** 
   - Reference correct Indian statutes (Indian Contract Act, 1872; IT Act, 2000; Arbitration Act, 1996; Copyright Act, 1957; etc.)
   - Use proper legal terminology while keeping language accessible
   - Ensure enforceability under Indian law

5. **Formatting (Markdown):**
   - Start with # DOCUMENT TITLE (centered, uppercase)
   - Use ## for major sections, ### for sub-sections
   - Number clauses sequentially (1. Definitions, 2. Obligations, etc.)
   - Use (a), (b), (c) for sub-clauses within a section
   - End with a proper signature block with lines for:
     - Signature: _____________________
     - Name: 
     - Designation:
     - Date:
   - Use --- horizontal rules to separate major sections
   - Keep paragraphs justified and well-spaced

6. **Tone:** Professional, authoritative, but readable. A founder should be able to read this without a lawyer.

**Output:** Provide ONLY the complete document text in Markdown format. No preamble, no explanation — just the document.`;
}

// ── Document-type-specific expansion rules ───────────────────────────────────

function buildDocTypeExpansionRules(
    documentType: DocumentType,
    formData: Record<string, string | number | boolean>,
    orgA: OrganisationData,
    orgB: OrganisationData | undefined,
): string {
    const city = orgA.address?.split(",").pop()?.trim() || "Bangalore";

    switch (documentType) {
        case "nda": {
            const relationshipType = String(formData.relationshipType || "business");
            const disclosureType = String(formData.disclosureType || "unilateral");
            const includeNonCompete = formData.includeNonCompete === true || formData.includeNonCompete === "true";
            const includeNonSolicit = formData.includeNonSolicit === true || formData.includeNonSolicit === "true";
            const includeIPAssignment = formData.includeIPAssignment === true || formData.includeIPAssignment === "true";
            const duration = String(formData.confidentialityDuration || "5");

            // Determine party labels
            let partyALabel = "Disclosing Party";
            let partyBLabel = "Receiving Party";
            if (relationshipType === "employee") { partyALabel = "Employer"; partyBLabel = "Employee"; }
            else if (relationshipType === "contractor") { partyALabel = "Company"; partyBLabel = "Contractor"; }
            else if (relationshipType === "investor") { partyALabel = "Company"; partyBLabel = "Investor"; }
            if (disclosureType === "mutual") { partyALabel = "Party A"; partyBLabel = "Party B"; }

            const obligationsClause = disclosureType === "mutual"
                ? STANDARD_CLAUSES.obligations_mutual
                : relationshipType === "employee"
                    ? STANDARD_CLAUSES.obligations_employee
                    : STANDARD_CLAUSES.obligations_unilateral;

            const isArbitration = formData.disputeResolution === "arbitration";
            const remediesClause = isArbitration
                ? STANDARD_CLAUSES.remedies_arbitration
                : STANDARD_CLAUSES.remedies_court;

            // Use arbitration-aware governing law when arbitration is selected to avoid jurisdiction conflict
            const governingLawClause = isArbitration
                ? STANDARD_CLAUSES.governing_law_with_arbitration
                : STANDARD_CLAUSES.governing_law_india;

            const survivalClause = STANDARD_CLAUSES.survival_clause.replace("[DURATION]", duration);

            // Employment NDAs should not be terminable by notice — they're tied to employment status
            const terminationClause = relationshipType === "employee"
                ? STANDARD_CLAUSES.termination_employment_nda
                : STANDARD_CLAUSES.termination_general_nda
                    .replace("[TERM]", String(formData.termDuration || "2 years"))
                    .replace("[NOTICE_PERIOD]", String(formData.terminationNotice || "30"));

            return `
**NDA-SPECIFIC DRAFTING RULES:**

- Define ${orgA.name} as "${partyALabel}" and ${orgB?.name || "Party B"} as "${partyBLabel}" in the preamble.
- Use these labels consistently throughout: "${partyALabel}" and "${partyBLabel}".
- Disclosure type: ${disclosureType} — ${disclosureType === "mutual" ? "obligations are RECIPROCAL" : "obligations fall on the Receiving Party"}.
- Relationship type: ${relationshipType}

**CRITICAL: DISPUTE RESOLUTION & JURISDICTION (avoid conflict):**
${isArbitration ? `- Arbitration is the PRIMARY dispute resolution mechanism.
- The Governing Law clause MUST be subordinate to the Arbitration clause.
- Courts have jurisdiction ONLY for: (a) interim/injunctive relief, and (b) enforcement of arbitral awards.
- Do NOT give courts "exclusive jurisdiction" for all disputes — that conflicts with arbitration.
- Use this exact pattern: "Subject to Clause [N] (Arbitration), the courts at ${city} shall have jurisdiction solely for interim relief and enforcement of arbitral awards."` : `- Courts at ${city} have exclusive jurisdiction for all disputes.
- No arbitration clause is included.`}

**MANDATORY STANDARD CLAUSE TEXT (use these EXACTLY as provided):**
1. Confidentiality Definition: "${STANDARD_CLAUSES.confidentiality_definition_broad}"
2. Exceptions: "${STANDARD_CLAUSES.exceptions_standard}"
3. Obligations: "${obligationsClause}"
4. Term & Termination: "${terminationClause}"
5. Survival: "${survivalClause}"
6. Dispute Resolution: "${remediesClause}" (replace [CITY] with "${city}")
7. Governing Law: "${governingLawClause}" (replace [JURISDICTION_CITY] with "${city}")
8. Return of Materials: "${STANDARD_CLAUSES.return_of_materials}"
9. Severability: "${STANDARD_CLAUSES.severability}"
10. Entire Agreement: "${STANDARD_CLAUSES.entire_agreement}"

${relationshipType === "employee" ? `**EMPLOYMENT NDA RULES:**
- The NDA is tied to the employment relationship — it cannot be terminated independently.
- Termination of employment automatically triggers the post-employment obligations.
- Confidentiality obligations SURVIVE termination of employment (per the Survival clause).
- Do NOT include a generic "30 days notice" termination — that's inappropriate for employment NDAs.
` : ""}

**CONDITIONAL CLAUSES:**
${includeNonCompete ? `- Non-Compete: "${STANDARD_CLAUSES.non_compete}" (replace [PERIOD] with "12 months", [TERRITORY] with "India").
  IMPORTANT: Include the enforceability note directly in the clause text. Under Section 27:Indian Contract Act, post-employment non-competes are generally unenforceable in India. The clause should state this limitation plainly so the user is aware.` : "- Non-Compete: NOT included."}
${includeNonSolicit ? `- Non-Solicitation: "${STANDARD_CLAUSES.non_solicit}" (replace [PERIOD] with "12 months").` : "- Non-Solicitation: NOT included."}
${includeIPAssignment ? `- IP Assignment: "${STANDARD_CLAUSES.ip_assignment_strong}"` : "- IP Assignment: NOT included."}
${relationshipType === "employee" || relationshipType === "contractor" ? `- No License: "${STANDARD_CLAUSES.no_license}"` : ""}

- Start IMMEDIATELY with the Agreement Title. No placeholder for logo/date/ref at top.
- End with signature blocks for both parties.
`;
        }

        case "mou":
            return `
**MOU-SPECIFIC DRAFTING RULES:**

- Clearly state whether this is a BINDING or NON-BINDING memorandum in the preamble.
- MOU Type: ${formData.mouType || "Not specified"} — tailor language accordingly.
- Duration: ${formData.duration || "Not specified"} — include start date and renewal terms.
- Exclusivity: ${formData.exclusivity || "Not specified"}.
- Purpose and objectives must be SPECIFIC — not generic aspirational language.
- Roles & Responsibilities: Draft separate sub-sections for each party's obligations.
- Financial terms: Be specific about amounts, payment schedules, cost-sharing percentages.
- IP ownership: Clearly state who owns what — especially for jointly created work.
- Include a termination clause with notice period (${formData.terminationNotice || "30 days"}) and cure period.
- Dispute resolution: ${formData.disputeResolution || "Arbitration"} at ${city}.
- Governing Law: Laws of India, courts at ${city}.
- End with signature blocks for all parties.
`;

        case "request-letter":
            return `
**REQUEST LETTER DRAFTING RULES:**

- This is a FORMAL communication — tone must match: ${formData.letterTone || "Professional"}.
- Request type: ${formData.requestType || "General"}.
- Urgency: ${formData.urgency || "Normal"} — ${formData.urgency === "urgent" ? "clearly state the deadline and consequences of delay" : "be professional but not pressuring"}.
- Structure:
  1. Sender details at top (name, designation, department, contact)
  2. Date and reference number
  3. Recipient name and organization
  4. Subject line — clear, concise, actionable
  5. Salutation: ${formData.salutation || "Respected Sir/Madam"}
  6. Opening: State who you are and the purpose in the first sentence
  7. Request details: Specific, clear, quantified where possible
  8. Justification: Why this request matters — provide evidence/reasoning  
  9. Call to action: Exactly what you need the recipient to do, and by when
  10. Closing: ${formData.signOff || "Yours sincerely"}
  11. Signature block
- Do NOT use legal clause numbering. Use letter-format paragraphs.
- Keep it concise — 1-2 pages maximum.
`;

        case "internship-cert":
            return `
**INTERNSHIP CERTIFICATE DRAFTING RULES:**

- This is a FORMAL attestation document — accuracy is critical.
- Certificate type: ${formData.certificateTitle || "Internship Completion Certificate"}.
- Performance rating: ${formData.performance || "Not specified"} — describe performance positively and factually.
- Structure:
  1. Organization letterhead (name, address if available)
  2. Certificate title and reference number
  3. "This is to certify that..." opening
  4. Intern's full name: ${formData.internName || "[Intern Name]"}
  5. Educational institution: ${formData.institution || "[Institution]"}
  6. Internship period: exact dates (${formData.startDate || "[Start]"} to ${formData.endDate || "[End]"})
  7. Department and role
  8. Project description — specific and detailed
  9. Skills demonstrated — list technologies, tools, competencies
  10. Performance assessment — factual, professional language
  11. "We wish them all the best in their future endeavours."
  12. Issue date: ${formData.issueDate || "the date hereof"}
  13. Signatory: name, designation
  14. Organization stamp/seal note
- Language: ${formData.certificateLanguage || "English"}.
- Tone: Attestation — authoritative, factual, positive.
- Do NOT use clause numbering. Use flowing paragraphs with clear sections.
`;

        case "sponsorship-letter":
            return `
**SPONSORSHIP LETTER DRAFTING RULES:**

- This is a PERSUASIVE business document — it must sell the sponsorship opportunity.
- Letter type: ${formData.letterType || "Request"} — ${formData.letterType === "confirmation" ? "confirm agreed terms" : "propose and convince"}.
- Tone: ${formData.letterTone || "Professional"}.
- Event: ${formData.eventName || "[Event Name]"} (${formData.eventType || "Event"}) on ${formData.eventDate || "[Date]"}.
- Sponsorship amount: ${formData.sponsorshipAmount || "As discussed"}.
- Structure:
  1. Organization letterhead
  2. Date and reference
  3. Recipient: ${formData.contactPerson || "Sponsorship Manager"}
  4. Subject: Sponsorship ${formData.letterType === "confirmation" ? "Confirmation" : "Proposal"} for ${formData.eventName || "[Event]"}
  5. Warm, professional introduction
  6. Event overview with COMPELLING data (attendees, reach, demographics)
  7. Organizer credibility — past events, track record
  8. Sponsorship opportunity — what's being offered
  9. Benefits — QUANTIFIED: exact banner placements, social media mentions with follower counts, speaking slots, booth space
  10. Brand visibility: ${formData.brandVisibility || "Logo on all promotional materials"}
  11. Financial terms: Amount, payment schedule, deliverables timeline
  12. Deadline: ${formData.sponsorshipDeadline || "14 days from date of letter"}
  13. Clear call to action
  14. Closing with contact details
- Use persuasive but professional language. Back up claims with numbers.
- Do NOT use legal clause numbering. Use business letter format with paragraphs and bullet points for benefits.
`;

        default:
            return "";
    }
}

// ─── Iteration Prompt (Agentic Chat) ─────────────────────────────────────────

export function buildIterationPrompt(
    documentType: DocumentType,
    currentClauses: BlueprintClause[],
    userMessage: string
): string {
    const typeLabel = DOCUMENT_TYPE_LABELS[documentType];

    const clauseList = currentClauses
        .map(
            (c, i) =>
                `${i + 1}. [${c.included ? "INCLUDED" : "EXCLUDED"}] [${c.risk.toUpperCase()} RISK] ${c.title}: ${c.description}`
        )
        .join("\n");

    const includedCount = currentClauses.filter((c) => c.included).length;
    const highRiskCount = currentClauses.filter((c) => c.risk === "high" && c.included).length;
    const mediumRiskCount = currentClauses.filter((c) => c.risk === "medium" && c.included).length;

    return `You are an expert AI legal agent assisting a founder with their ${typeLabel}. You think step-by-step, use specialized analysis tools, and explain legal concepts in simple, plain English. Your job is to PROTECT the founder's interests while keeping the document practical and not over-lawyered.

**Current Blueprint Status:**
- Total clauses: ${currentClauses.length} (${includedCount} included)
- High risk: ${highRiskCount} | Medium risk: ${mediumRiskCount}

**Current Blueprint Clauses:**
${clauseList}

${RISK_FRAMEWORK}

${DOC_TYPE_GUIDANCE[documentType]}

**User's Request:**
"${userMessage}"

**RESPONSE FORMAT — You MUST structure your response using these XML tags:**

<thinking>
Write 2-4 sentences about your reasoning:
1. What exactly is the user asking?
2. Which clauses are affected?
3. What's the risk implication of this change?
4. What approach will best protect the founder?
</thinking>

<tool_call name="TOOL_NAME">BRIEF_DESCRIPTION</tool_call>

Choose the most relevant tool(s) from:
- **clause-analyzer**: Analyzing clause structure, dependencies, gaps, and coverage. Use when evaluating whether the blueprint is comprehensive.
- **risk-assessor**: Evaluating legal and business risk. Use when the user asks about risks, wants to remove a protective clause, or when you need to flag consequences. ALWAYS assess using the Risk Framework above.
- **legal-research**: Looking up relevant Indian legal provisions, case law, and precedents. Use when citing specific laws or when the user asks about enforceability.
- **compliance-checker**: Checking against regulatory requirements (SEBI, RBI, MCA, IT Act, GDPR applicability). Use for compliance questions.
- **plain-english-translator**: Converting legal jargon to plain English. Use when the user asks "what does this mean?" or seems confused.
- **clause-drafter**: Drafting or rewriting clause text. Use when the user asks for changes, improvements, or new clauses.

<analysis>
Your detailed analysis results. MUST include:
1. **What was found:** Key findings from the tool(s) used
2. **Risk impact:** How this affects the document's overall risk profile (use specific risk levels)
3. **Real-world impact:** Relate to actual business scenarios (e.g., "If an employee leaves and starts a competing firm...", "Without this clause, the sponsor could back out without consequence...")
4. **Recommendation:** Your professional recommendation with reasoning
</analysis>

Then provide your final response:

**SCENARIO A: User asks a QUESTION (e.g., "Why is this needed?", "Explain this risk", "What if we remove X?")**
- After the analysis tags, write a clear, concise answer in plain text.
- Use simple language. Give real-world examples.
- If the user asks about removing a HIGH RISK clause, STRONGLY warn about consequences.
- Do NOT return JSON. Just return helpful text.

**SCENARIO B: User asks for CHANGES (e.g., "Remove non-compete", "Add a termination clause", "Make it stricter")**
- After the analysis tags, respond with **ONLY a valid JSON object** with this structure:
  {
     "message": "2-3 sentence explanation of what changed and why, in founder-friendly language.",
     "clauses": [
         { "id": "string", "title": "string", "description": "string (2-3 sentences with risk reasoning)", "included": boolean, "risk": "low" | "medium" | "high" }
     ]
  }
- The clauses array must be the COMPLETE updated list (all clauses, not just changed ones).
- When removing: set included: false (don't delete from list).
- When adding: append new clause(s) with unique IDs.
- When modifying: update the existing clause's fields.
- Re-assess risk levels after changes — a change in one clause may affect another's risk.

**IMPORTANT RULES:**
- ALWAYS start with <thinking> tags
- ALWAYS include at least one <tool_call> tag
- ALWAYS include <analysis> tags with substantive findings
- When risk-assessing, use the RISK FRAMEWORK above — don't make up criteria
- Keep thinking concise (2-4 sentences), analysis detailed (4-8 sentences)
- The final answer (text or JSON) comes AFTER all tags
- NEVER say "I'm just an AI" — you ARE the legal expert assistant
`;
}
