import type { DocumentType, OrganisationData, BlueprintClause } from "@/types";
import { DOCUMENT_TYPE_LABELS } from "@/types";
import { getTemplate } from "@/lib/templates";
import { STANDARD_CLAUSES, NDA_CLAUSE_LIBRARY } from "@/lib/clause-library";

// ─── Risk Framework ──────────────────────────────────────────────────────────

const RISK_FRAMEWORK = `
**Risk Assessment Criteria — follow these STRICTLY when assigning risk levels:**

CRITICAL RULE: You MUST limit "HIGH" risk designations to an absolute maximum of 3 to 5 clauses per document. Reserve "HIGH" ONLY for absolute deal-breakers.

HIGH risk (max 3-5 clauses per document — absolute critical, immediate financial/legal ruin if omitted):
  - Core payment/consideration terms
  - Fundamental IP ownership/assignment
  - Primary liability caps or uncapped indemnities

MEDIUM risk (important operational/legal clauses — most substantive clauses should be here):
  - Confidentiality, Non-compete, Non-solicit
  - Termination rights, Dispute resolution, Governing law
  - Data protection, Warranties, Reporting

LOW risk (standard/boilerplate):
  - Formatting sections (letterhead, signatures)
  - Boilerplate (severability, entire agreement, notices, force majeure)
  - Cosmetic recitals
`.trim();

// ─── Doc-Type Specific Guidance ──────────────────────────────────────────────

const DOC_TYPE_GUIDANCE: Partial<Record<DocumentType, string>> = {
    nda: `**NDA-Specific Rules:** Focus on CI definition, return/destruction of materials, and injunctive relief. Post-employment non-compete is unenforceable (S.27).`,
    mou: `**MOU-Specific Rules:** Clearly state binding/non-binding status. Define roles and financial terms precisely.`,
    "offer-letter": `**Offer Letter-Specific Rules:** Pre-appointment summary. Include CTC breakdown (Basic, HRA, PF, Gratuity) and probation terms.`,
    "appointment-letter": `**Appointment Letter-Specific Rules:** Definitive contract. Include full IP assignment and termination grounds. Reference Shops & Establishments Act.`,
    "relieving-letter": `**Relieving Letter-Specific Rules:** Confirmation of exit and clearance. Factual accuracy on dates and notice period served is key.`,
    "experience-letter": `**Experience Letter-Specific Rules:** Role and performance attestation. Detail responsibilities and tenure.`,
    "internship-letter": `**Internship Letter-Specific Rules:** Stipend-based limited engagement. Focus on project scope and learning objectives.`,
    "payment-reminder": `**Payment Reminder-Specific Rules:** Escalating tone (Friendly -> Firm -> Final). Reference invoice numbers and statutory interest (Interest Act 1978).`,
    "esop-grant": `**ESOP Grant-Specific Rules:** Vesting schedule (standard 4 years/1 year cliff) and tax implications (S.17(2) IT Act).`,
    "esop-policy": `**ESOP Policy-Specific Rules:** Ensure compliance with Section 62(1)(b), Companies Act, 2013 and Companies (Share Capital and Debentures) Rules, 2014. Include: Total option pool size, Eligibility criteria, Vesting schedule with minimum 1 year requirement, Maximum vesting period, Exercise period, Lapse conditions, Exit scenarios, Accounting treatment, and Tax treatment (perquisite + capital gains).`,
    "share-allotment": `**Share Allotment-Specific Rules:** Board-resolution ready. Reference Companies Act 2013 (S.39). Include PAS-3 filing notice.`,
    "legal-notice": `**Legal Notice-Specific Rules:** Advocate-led formal demand. S.80 CPC for govt, S.138 for cheque bounce.`,
    "breach-notice": `**Breach Notice-Specific Rules:** Identify specific contractual violations and provide a cure period.`,
    loi: `**LOI-Specific Rules:** Binding vs non-binding sections. Focus on exclusivity/DD period.`,
    "vendor-onboarding": `**Vendor Onboarding-Specific Rules:** Scope, payment terms (TDS), and GST compliance (S.16 CGST Act).`,
    "startup-india": `**Startup India-Specific Rules:** DPIIT recognition criteria. Focus on innovation, scalability, and impact.`,
    "gst-bank-letter": `**GST/Bank Letter-Specific Rules:** Formal request for account/registration with board resolution reference.`,
    "co-founder-agreement": `**Co-Founder Agreement-Specific Rules:** Equity split, reverse vesting, and deadlock resolution. IP assignment is critical.`,
    "board-resolution": `**Board Resolution-Specific Rules:** Formal record of actions. Use 'RESOLVED THAT' format. Reference Companies Act 2013.`,
    "termination-letter": `**Termination Letter-Specific Rules:** Notice period and grounds. Reference PIP for performance or enquiry for misconduct.`,
    "consultancy-agreement": `**Consultancy Agreement-Specific Rules:** Independent contractor status, IP assignment, and professional service fees (S.194J).`,
    "service-agreement": `**Service Agreement-Specific Rules:** Ongoing services, SLA metrics, and aggregated liability caps.`,
    "ip-assignment": `**IP Assignment-Specific Rules:** Unconditional transfer of IP rights. Reference S.19 Copyright Act. Include moral rights waiver.`,
    "isafe-note": `**iSAFE Note-Specific Rules:** Convertible equity instrument. No debt/interest. Focus on Valuation Cap and Discount.`,
    sha: `**SHA-Specific Rules:** Governance agreement. Board seats, veto rights, and exit rights (ROFR, Tag-Along).`,
    "term-sheet": `**Term Sheet-Specific Rules:** Investment summary. Generally non-binding except for exclusivity/confidentiality.`,
    "founders-deed": `**Founders' Deed-Specific Rules:** Pre-incorporation IP assignment and long-term reverse vesting.`,
    "buyback-agreement": `**Buyback Agreement-Specific Rules:** Ensure compliance with Section 68, Companies Act, 2013. Include: Number of shares, Buyback price, Source of funds, Solvency declaration reference, Extinguishment mechanism, and MCA filing compliance.`,
    "saas-agreement": `**SaaS-Specific Rules:** Cloud service terms, SLA uptime, and data privacy (DPDP Act 2023).`,
    "rent-agreement": `**Rent Agreement-Specific Rules:** Residential rent. 11-month term common. Security deposit and maintenance terms.`,
    "commercial-lease": `**Commercial Lease-Specific Rules:** Office rental. CAM charges, escalation, and lock-in periods.`,
    "influencer-agreement": `**Influencer-Specific Rules:** Deliverables, approval process, and social media usage rights.`,
    "posh-policy": `**POSH Policy-Specific Rules:** Mandatory framework under ICC Act 2013. Focus on IC composition.`,
    "section-138-notice": `**Section 138-Specific Rules:** Mandatory notice for cheque bounce. 30 days limit from bank memo.`,
    "data-breach-notice": `**Data Breach Notice-Specific Rules:** Notification regarding security incident. Compliant with DPDP Act.`,
    gpa: `**GPA-Specific Rules:** Authorized signatory delegation. Specific acts must be listed.`,
    "software-license": `**Software License-Specific Rules:** Restrictive usage rights for proprietary software. Define license scope.`,
    "white-label-agreement": `**White-Label-Specific Rules:** Branding rights, reselling commissions, and tech support split.`,
    "maintenance-agreement": `**Maintenance-Specific Rules:** Response times (SLAs) and AMC fee schedules.`,
    "ethics-code": `**Ethics Code-Specific Rules:** Corporate values, conflict of interest, and anti-bribery framework.`,
    "fnf-settlement": `**F&F Settlement-Specific Rules:** Final waiver. Acknowledge full receipt of dues and waive future claims.`,
    "leave-license": `**Leave & License-Specific Rules:** License-based occupation. Emphasize no tenancy creation.`,
    "eviction-notice": `**Eviction Notice-Specific Rules:** Vacate demand citing breach of agreement. Specify deadline.`,
    "affiliate-agreement": `**Affiliate Agreement-Specific Rules:** Commission rates and referral tracking terms.`,
    "sponsorship-agreement": `**Sponsorship-Specific Rules:** Promotion, logo placement, and sponsor benefits.`,
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

${DOC_TYPE_GUIDANCE[documentType] || ""}

**CRITICAL DRAFTING RULES:**
1. DOCUMENT TYPE LOCK:
   - Strictly generate the requested agreement type (${typeLabel}).
   - Do NOT reuse clauses from unrelated agreement types.
   - If required elements for this type are missing, STOP and state what is required.

2. CORPORATE DOCUMENT STRUCTURE (If Applicable):
   - Corporate instruments (ESOP, Buyback, SHA) must be structured as company-level documents (not bilateral service contracts).
   - Include board/shareholder approval references.
   - Protect vested rights.

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
4. For Indian jurisdiction: reference relevant Indian laws where applicable in clause descriptions (e.g., Companies Act 2013).
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

2. **Specificity & NO GENERIC FILLER:** 
   - Replace ALL placeholders with actual values from the provided details:
     - [PARTY_A] → ${orgA.name}
     - [PARTY_B] → ${orgB?.name || "the Second Party"}
     - [DATE] → use the provided effective date or "the date of execution"
     - [CITY] → extract from addresses, default to the jurisdiction city
     - [DURATION] → use provided values, or state reasonable defaults (e.g., "2 years")
   - NEVER leave [BRACKET] placeholders or vague boilerplate in the final output. Define financial thresholds precisely. Clarify tax responsibility where applicable.

3. **Risk Awareness & INDIAN LAW COMPLIANCE:** 
   - HIGH RISK clauses must be drafted with extra precision.
   - Reference correct Indian statutes (Indian Contract Act, 1872; IT Act, 2000; Arbitration Act, 1996; Copyright Act, 1957; Companies Act, 2013; etc.). Ensure non-compete clauses reflect Indian enforceability limitations (S.27).

4. **DISPUTE CLAUSE CONSISTENCY:** 
   - Do not create arbitration + full court jurisdiction conflict. If arbitration is primary, specify the seat and enforcement jurisdiction clearly. The court jurisdiction must be limited to enforcement of arbitral awards and interim relief.

5. **SHARE / CAPITAL DOCUMENTS REQUIRE (If Applicable):**
   - Number of shares/options, Consideration, Valuation basis, Compliance mechanism, Transfer mechanics.

6. **Formatting (Markdown):**
   - Start with # DOCUMENT TITLE (centered, uppercase)
   - Use ## for major sections, ### for sub-sections
   - Number clauses sequentially (1. Definitions, 2. Obligations, etc.)
   - Use (a), (b), (c) for sub-clauses within a section
   - End with a proper signature block with lines for signatures, names, designations, and dates.
   - Use --- horizontal rules to separate major sections.

7. **Tone:** Professional, authoritative, but readable. A founder should be able to read this without a lawyer.

**SELF-VALIDATION STEP:**
Before delivering the final agreement, verify internally:
1. Document type alignment logic is correct.
2. All mandatory clauses for this agreement type are included.
3. No unrelated commercial clauses are inserted.
4. Arbitration vs jurisdiction consistency is maintained.
5. All defined terms are used properly.
6. Compliant with relevant Indian statutory requirements.

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
            const includeNonCircumvent = formData.includeNonCircumvent === true || formData.includeNonCircumvent === "true";
            const includeIndemnity = formData.includeIndemnity === true || formData.includeIndemnity === "true";
            const includeDataProtection = formData.includeDataProtection === true || formData.includeDataProtection === "true";
            const includeTradeSecrets = formData.includeTradeSecrets === true || formData.includeTradeSecrets === "true";
            const includeAuditRights = formData.includeAuditRights === true || formData.includeAuditRights === "true";
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

**CONDITIONAL CLAUSES (based on form toggles):**
${includeNonCompete ? `- Non-Compete: "${STANDARD_CLAUSES.non_compete}" (replace [NON_COMPETE_PERIOD] with "12", [NON_COMPETE_TERRITORY] with "India").
  IMPORTANT: Include the S.27 enforceability note directly in the clause text.` : "- Non-Compete: NOT included."}
${includeNonSolicit ? `- Non-Solicitation: "${STANDARD_CLAUSES.non_solicit}" (replace [NON_SOLICIT_PERIOD] with "12").` : "- Non-Solicitation: NOT included."}
${includeNonCircumvent ? `- Non-Circumvention: "${NDA_CLAUSE_LIBRARY.find(c => c.id === 'non_circumvention')!.text}" (replace [NON_CIRCUMVENT_PERIOD] with "24").` : "- Non-Circumvention: NOT included."}
${includeIPAssignment ? `- IP Assignment: "${STANDARD_CLAUSES.ip_assignment_strong}"` : "- IP Assignment: NOT included."}
${includeIndemnity ? `- Indemnity: "${NDA_CLAUSE_LIBRARY.find(c => c.id === 'indemnity')!.text}"` : "- Indemnity: NOT included (contextual — AI may still recommend it)."}
${includeDataProtection ? `- Data Protection: "${STANDARD_CLAUSES.data_protection}"` : "- Data Protection: NOT included (contextual — AI may recommend if personal data is involved)."}
${includeTradeSecrets ? `- Trade Secrets: "${NDA_CLAUSE_LIBRARY.find(c => c.id === 'trade_secrets')!.text}"` : "- Trade Secrets: NOT included (contextual — AI may recommend if trade secrets are involved)."}
${includeAuditRights ? `- Audit Rights: "${NDA_CLAUSE_LIBRARY.find(c => c.id === 'audit_rights')!.text}"` : "- Audit Rights: NOT included."}
${relationshipType === "employee" || relationshipType === "contractor" ? `- No License: "${STANDARD_CLAUSES.no_license}"
- Independent Contractor: "${NDA_CLAUSE_LIBRARY.find(c => c.id === 'independent_contractor')!.text}"` : ""}

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

        case "offer-letter":
            return `
**OFFER LETTER DRAFTING RULES:**
- Candidate: ${formData.candidateName || "[Candidate Name]"}
- Designation: ${formData.designation || "[Designation]"}, ${formData.department || "[Department]"}
- CTC: ${formData.ctcAnnual || "[CTC]"} per annum
- Employment Type: ${formData.employmentType || "Full-time"}
- Probation: ${formData.probationPeriod || "6 months"}
- Notice Period: ${formData.noticePeriod || "1 month"}
- Joining Date: ${formData.joiningDate || "[Date]"}
- Work Location: ${formData.workLocation || "[Location]"}
- Offer Valid Until: ${formData.offerValidUntil || "[Date]"}
- Format: Professional letter format. Start with company letterhead.
- Address the candidate by name. Open with congratulatory tone.
- CTC breakdown: ${formData.ctcBreakdown || "Include Basic, HRA, Special Allowance, PF (Employer), Gratuity as per Indian payroll norms."}
${formData.includeEsop === true || formData.includeEsop === "true" ? "- ESOP: Mention eligibility subject to ESOP plan terms." : ""}
${formData.includeJoiningBonus === true || formData.includeJoiningBonus === "true" ? `- Joining Bonus: ${formData.joiningBonusAmount || "[Amount]"} — specify clawback conditions (typically 1-year retention).` : ""}
${formData.includeRelocation === true || formData.includeRelocation === "true" ? "- Relocation: Mention relocation assistance as per company policy." : ""}
- End with offer acceptance signature block (acceptance by candidate + deadline).
- Do NOT embed full company policies — reference them instead.
`;

        case "appointment-letter":
            return `
**APPOINTMENT LETTER DRAFTING RULES:**
- Employee: ${formData.employeeName || "[Employee Name]"}
- Designation: ${formData.designation || "[Designation]"}, ${formData.department || "[Department]"}
- Date of Joining: ${formData.dateOfJoining || "[Date]"}
- CTC: ${formData.ctcAnnual || "[CTC]"} per annum
- CTC Breakdown: ${formData.ctcBreakdown || "Basic + HRA + Special Allowance + PF + Gratuity"}
- Probation: ${formData.probationPeriod || "6 months"} — state confirmation process.
- Notice Period: ${formData.noticePeriod || "1 month"} during probation, may differ post-confirmation.
- Work Location: ${formData.workLocation || "[Location]"}
- Working Hours: ${formData.workingHours || "9:30 AM - 6:30 PM, Monday to Friday"}
- Leave Policy: ${formData.leavePolicy || "As per company policy"}
- Format: Formal. This is the DEFINITIVE employment contract.
${formData.includeNDA === true || formData.includeNDA === "true" ? "- Include embedded Confidentiality/NDA clause covering company information, client data, trade secrets." : ""}
${formData.includeIPAssignment === true || formData.includeIPAssignment === "true" ? "- Include IP Assignment: All work product, inventions, and IP created during employment exclusively belong to the Company (Copyright Act 1957)." : ""}
${formData.includeNonCompete === true || formData.includeNonCompete === "true" ? "- Non-Compete: Include during-employment restraint only. Note that post-employment non-compete is unenforceable under S.27, Indian Contract Act 1872." : ""}
${formData.includeCodeOfConduct === true || formData.includeCodeOfConduct === "true" ? "- Reference company Code of Conduct — employee acknowledges having read and agreed." : ""}
- Mention: PF deduction (Employees' PF Act 1952), Gratuity (Payment of Gratuity Act 1972), Professional Tax.
- End with acceptance signature block.
`;

        case "relieving-letter":
            return `
**RELIEVING LETTER DRAFTING RULES:**
- Employee: ${formData.employeeName || "[Employee Name]"} (ID: ${formData.employeeId || "[ID]"})
- Designation: ${formData.designation || "[Designation]"}, ${formData.department || "[Department]"}
- Date of Joining: ${formData.dateOfJoining || "[Date]"}
- Last Working Date: ${formData.lastWorkingDate || "[Date]"}
- Resignation Date: ${formData.resignationDate || "[Date]"}
- Exit Reason: ${formData.exitReason || "Voluntary Resignation"}
- Notice Period: ${formData.noticePeriodServed || "Full notice served"}
- Clearance: ${formData.clearanceStatus || "All dues cleared"}
- Conduct: ${formData.conductRemark || "Good"}
- Format: Formal letter on company letterhead. "To Whom It May Concern" format.
- Open with: "This is to certify that [Employee Name] was employed with [Company] from [DOJ] to [LWD]..."
- Confirm resignation accepted and last working date.
- State notice period status and clearance/settlement status.
${formData.includeExpCert === true || formData.includeExpCert === "true" ? "- Include detailed Experience Certificate section: role, responsibilities, key achievements." : ""}
${formData.includeNDAReminder === true || formData.includeNDAReminder === "true" ? "- Include reminder of ongoing confidentiality obligations post-employment." : ""}
- Close with "We wish [Employee] all the best in their future endeavours."
- Signatory: HR Head or Director with designation and company seal.
`;

        case "payment-reminder": {
            const level = String(formData.reminderLevel || "first");
            return `
**PAYMENT REMINDER DRAFTING RULES:**
- Recipient: ${formData.recipientName || "[Recipient]"}
- Contact: ${formData.contactPerson || "Accounts Department"}
- Invoice: ${formData.invoiceNumber || "[Invoice]"} dated ${formData.invoiceDate || "[Date]"}
- Amount: ${formData.invoiceAmount || "[Amount]"}
- Due Date: ${formData.originalDueDate || "[Date]"}
- Days Overdue: ${formData.daysOverdue || "Not specified"}
- Services: ${formData.serviceDescription || "[Services]"}
- Reminder Level: ${level}
- Tone: ${level === "first" ? "Friendly and professional — assume the delay is an oversight." : level === "second" ? "Firm but respectful — reference previous reminder, state urgency." : "Formal and stern — reference contractual obligations, warn of legal consequences."}
${level === "final" ? `- Include warning about legal proceedings, interest accrual, and potential filing under Order XXXVII CPC (summary suit for recovery).` : ""}
${formData.includeInterest === true || formData.includeInterest === "true" ? `- Reference late payment interest: ${formData.interestRate || "18%"} p.a. as per contract / S.3, Interest Act 1978.` : ""}
${formData.includeLegalNotice === true || formData.includeLegalNotice === "true" ? "- Warn that this is the final attempt at amicable resolution before legal escalation." : ""}
- Include payment instructions: ${formData.paymentMethod || "Bank transfer details"}
- Format: Professional letter. Subject line referencing invoice number.
`;
        }

        case "esop-grant":
            return `
**ESOP GRANT LETTER DRAFTING RULES:**
- Grantee: ${formData.employeeName || "[Employee Name]"} (ID: ${formData.employeeId || "[ID]"})
- Designation: ${formData.designation || "[Designation]"}
- Grant Date: ${formData.grantDate || "[Date]"}
- Number of Options: ${formData.numberOfOptions || "[Number]"}
- Exercise Price: ${formData.exercisePrice || "₹10 (Face Value)"} per option
- Current FMV: ${formData.currentFMV || "As per latest valuation report"}
- Vesting Schedule: ${formData.vestingSchedule || "4 years, 1-year cliff, monthly vesting"}
- Exercise Window (post-termination): ${formData.exerciseWindow || "90 days"}
- ESOP Plan: ${formData.esopPlanName || "[Plan Name]"}
- Board Resolution: ${formData.boardResolutionDate || "[Date]"}
- Format: Formal grant letter. Reference the master ESOP plan throughout.
- Explain vesting clearly: Cliff means NO options vest before cliff ends. Post-cliff: monthly/quarterly vesting.
${formData.includeAcceleration === true || formData.includeAcceleration === "true" ? "- Include Accelerated Vesting: Specify single/double trigger on acquisition, merger, or IPO." : ""}
${formData.includeTaxNote === true || formData.includeTaxNote === "true" ? `- Tax Implications:
  (a) Perquisite tax at exercise: FMV (${formData.currentFMV || "FMV"}) minus Exercise Price (${formData.exercisePrice || "EP"}) taxed as salary (S.17(2), IT Act).
  (b) Capital gains at sale: Sale price minus FMV at exercise.
  (c) DPIIT-recognized startups: Tax deferral up to 5 years or exit, whichever earlier (S.80-IAC).` : ""}
- Transfer restrictions: Options are NON-TRANSFERABLE. Exercised shares may have ROFR.
- Reference Companies Act 2013, S.62(1)(b), Companies (Share Capital) Rules 2014.
- End with acceptance signature block.
`;

        case "share-allotment":
            return `
**SHARE ALLOTMENT LETTER DRAFTING RULES:**
- Allottee: ${formData.allotteeName || "[Name]"} (Type: ${formData.allotteeType || "Investor"})
- Shares: ${formData.numberOfShares || "[Number]"} ${formData.shareType || "Equity"} shares
- Face Value: ${formData.faceValue || "₹10"} | Premium: ${formData.premiumPerShare || "₹0"}
- Total Consideration: ${formData.totalConsideration || "[Amount]"}
- Allotment Date: ${formData.allotmentDate || "[Date]"}
- Board Resolution: ${formData.boardResolutionDate || "[Date]"}
- Post-Allotment Holding: ${formData.shareholdingPost || "As per cap table"}
- Payment: ${formData.paymentReceived || "Full payment received"}
- Format: Formal letter on company letterhead.
- Reference board resolution date and resolution number.
- Detail share type, face value, premium (if any), and total consideration.
${formData.includeROCFiling === true || formData.includeROCFiling === "true" ? "- Reference ROC filing: Form PAS-3 will be filed within 15 days of allotment (S.39, Companies Act 2013)." : ""}
${formData.includeShareCert === true || formData.includeShareCert === "true" ? "- Share certificate will be issued within 2 months of allotment (S.56(4), Companies Act 2013)." : ""}
- For CCPS/CCD: Reference conversion terms as per SHA/Investment Agreement.
- For Sweat Equity: Reference valuation report by registered valuer (S.54, Companies Act 2013).
- Reference Companies Act 2013, Companies (Share Capital and Debentures) Rules 2014.
- Signatory: Director/Company Secretary with company seal.
`;

        case "legal-notice":
            return `
**LEGAL NOTICE DRAFTING RULES:**
- Notice Type: ${formData.noticeType || "General"}
- Jurisdiction: Courts at ${formData.jurisdiction || city}
- Response Deadline: ${formData.responseDeadline || "15"} days from receipt
- Amount Claimed: ${formData.amountClaimed || "Not specified"}
- Facts: ${formData.factualBackground || "[To be provided]"}
- Grievance: ${formData.grievance || "[To be provided]"}
- Demanded Relief: ${formData.demandedRelief || "[To be provided]"}
- Format: Formal legal notice on advocate's letterhead (or company letterhead if sent directly).
- Open with: "Under instructions from my client, [Company Name]..." (if through advocate) or "We, [Company Name]..." (if direct).
- Subject line: "LEGAL NOTICE under [applicable section]"
- Factual background: Chronological, precise, with dates and document references.
- Legal provisions: Cite specific sections of applicable laws.
${String(formData.noticeType) === "s80-cpc" ? "- S.80 CPC: 60-day notice is MANDATORY before filing suit against government. Failure = suit dismissed." : ""}
${String(formData.noticeType) === "cheque-bounce" ? "- S.138 NI Act: Notice must be sent within 30 days of receiving dishonour memo. Must demand payment within 15 days." : ""}
${formData.includeConsequences === true || formData.includeConsequences === "true" ? "- Include detailed consequences: Civil suit, criminal complaint (if applicable), damages, costs." : ""}
- End with: "A copy of this notice is being retained for use as evidence in appropriate legal proceedings."
- Mode of Service: ${formData.sendVia || "Registered Post with AD"}
`;

        case "breach-notice":
            return `
**BREACH NOTICE DRAFTING RULES:**
- Contract: ${formData.contractTitle || "[Contract Title]"} dated ${formData.contractDate || "[Date]"}
- Breach Type: ${formData.breachType || "Non-performance"}
- Violated Clause: ${formData.contractClauseRef || "[Clause Reference]"}
- Cure Period: ${formData.curePeriod || "15"} days
- Damages Claimed: ${formData.damagesAmount || "Not specified"}
- Format: Formal notice on company letterhead.
- Subject: "NOTICE OF BREACH — ${formData.contractTitle || "[Contract]"}"
- Open with reference to the contract (title, date, parties).
- Describe the breach specifically — what was the obligation, what was the failure.
- Reference exact clause(s) violated with quotation if possible.
- Previous attempts: ${formData.previousReminders || "None referenced"}
- Cure period: "${formData.curePeriod === "none" ? "No cure period — breach is incurable." : `${formData.curePeriod || "15"} days to remedy the breach.`}"
${formData.includeTermination === true || formData.includeTermination === "true" ? "- Include: Failure to cure will result in immediate termination of the contract." : ""}
${formData.includeDamagesClaim === true || formData.includeDamagesClaim === "true" ? `- Include damages/compensation demand: ${formData.damagesAmount || "[Amount]"} for losses suffered.` : ""}
${formData.includeLegalProceedings === true || formData.includeLegalProceedings === "true" ? "- Include warning about legal proceedings (arbitration/litigation as per contract's dispute resolution clause)." : ""}
- Close with reservation of all rights and remedies.
`;

        case "loi":
            return `
**LETTER OF INTENT DRAFTING RULES:**
- LOI Type: ${formData.loiType || "Investment"}
- Binding Status: ${formData.bindingStatus || "Non-binding"}
- Deal Summary: ${formData.dealSummary || "[To be provided]"}
- Key Terms: ${formData.keyTerms || "[To be provided]"}
- Exclusivity: ${formData.exclusivityPeriod || "No exclusivity"}
- Due Diligence: ${formData.dueDiligencePeriod || "30 days"}
- Target Closing: ${formData.targetClosingDate || "[Date]"}
- Jurisdiction: Courts at ${formData.jurisdiction || city}
- Format: Professional letter or structured agreement format.
- CLEARLY mark binding vs. non-binding sections — this is the MOST CRITICAL aspect.
${String(formData.bindingStatus) === "non-binding" ? "- Non-binding: State clearly in preamble —  \"This LOI is not intended to create legally binding obligations except as expressly stated herein (Confidentiality, Exclusivity, and Governing Law).\"" : ""}
${String(formData.bindingStatus) === "binding" ? "- Binding: All terms are legally enforceable. Treat as a lightweight contract." : ""}
- Conditions Precedent: ${formData.conditionsPrecedent || "Standard DD, board approval, regulatory clearance."}
${formData.includeConfidentiality === true || formData.includeConfidentiality === "true" ? "- Confidentiality: BINDING — both parties must keep deal terms confidential." : ""}
${formData.includeBreakFee === true || formData.includeBreakFee === "true" ? "- Break fee: Specify amount/percentage and trigger conditions." : ""}
- Include expiry date for the LOI — typically 30-90 days.
- Reference that definitive agreements (SHA, SPA, SSA) will follow.
- End with signature block for both parties.
`;

        case "vendor-onboarding":
            return `
**VENDOR ONBOARDING LETTER DRAFTING RULES:**
- Vendor Type: ${formData.vendorType || "IT Services"}
- Scope: ${formData.scopeOfWork || "[To be provided]"}
- Contract Value: ${formData.contractValue || "[Amount]"}
- Payment Terms: ${formData.paymentTerms || "Net 30"}
- Duration: ${formData.contractDuration || "1 year"}
- SLA: ${formData.slaRequirements || "As per scope"}
- Jurisdiction: Courts at ${formData.jurisdiction || city}
- Format: Formal onboarding letter / lightweight engagement agreement.
- Detail scope of work with clear deliverables and timelines.
- Payment: Specify invoice process, payment method, TDS deduction (S.194C/194J IT Act).
${formData.includeNDA === true || formData.includeNDA === "true" ? "- Include Confidentiality clause — vendor must protect all company information." : ""}
${formData.includeIPClause === true || formData.includeIPClause === "true" ? "- IP Assignment: All deliverables, code, designs, and work product belong exclusively to the Company." : ""}
${formData.includeGSTCompliance === true || formData.includeGSTCompliance === "true" ? "- GST: Vendor must provide valid GSTIN-based invoices. Reference S.16 CGST Act for ITC compliance." : ""}
${formData.includeInsurance === true || formData.includeInsurance === "true" ? "- Require Professional Indemnity Insurance — minimum coverage as per industry standards." : ""}
- Compliance documents: ${formData.complianceDocuments || "GST Certificate, PAN, Bank Details, MSME Registration"}
- Termination: 30 days notice for convenience, immediate for cause (material breach, fraud, insolvency).
- For freelancers: Clearly establish INDEPENDENT CONTRACTOR status — not employment.
- End with acceptance signature block.
`;

        case "startup-india":
            return `
**STARTUP INDIA LETTER DRAFTING RULES:**
- Purpose: ${formData.letterPurpose || "DPIIT Recognition"}
- Company: ${formData.companyName || "[Company Name]"}
- CIN: ${formData.cin || "[CIN]"}
- Incorporated: ${formData.dateOfIncorporation || "[Date]"}
- Address: ${formData.registeredAddress || "[Address]"}
- Innovation: ${formData.natureOfBusiness || "[To be described]"}
- Turnover: ${formData.turnover || "Below ₹100 Cr"}
- DPIIT Number: ${formData.dpiitNumber || "New application"}
- Signatory: ${formData.founderName || "[Founder Name]"}
- Format: Formal application letter addressed to DPIIT / relevant authority.
${String(formData.letterPurpose) === "dpiit-recognition" ? "- DPIIT Recognition: Entity must be < 10 years old, turnover < ₹100 Cr, and working towards innovation/development/improvement of products/services/processes with potential for wealth/employment generation." : ""}
${String(formData.letterPurpose) === "tax-exemption" ? "- S.80-IAC Tax Exemption: Requires DPIIT recognition + Inter-Ministerial Board certification. 3 consecutive years of 100% tax holiday out of first 10 years." : ""}
${String(formData.letterPurpose) === "angel-tax" ? "- Angel Tax Exemption (S.56(2)(viib)): DPIIT-recognized startup with aggregate paid-up capital + share premium < ₹25 Cr." : ""}
${formData.includeFinancials === true || formData.includeFinancials === "true" ? "- Reference enclosed audited financial statements / CA-certified turnover certificate." : ""}
${formData.includePitchDeck === true || formData.includePitchDeck === "true" ? "- Reference enclosed Business Plan / Pitch Deck describing the innovation." : ""}
- Include declaration: Not formed by splitting/reconstruction, not in restricted business.
- List all enclosed documents with serial numbers.
- End with authorized signatory block with designation and company seal.
`;

        case "gst-bank-letter":
            return `
**GST / BANK LETTER DRAFTING RULES:**
- Purpose: ${formData.letterPurpose || "Current Account Opening"}
- Company: ${formData.companyName || "[Company Name]"}
- CIN: ${formData.cin || "[CIN]"}, PAN: ${formData.pan || "[PAN]"}
- GSTIN: ${formData.gstin || "New registration"}
- Address: ${formData.registeredAddress || "[Address]"}
- Bank: ${formData.bankName || "[Bank Name]"}
- Authorized Signatory: ${formData.authorizedSignatory || "[Signatory]"}
- Format: Formal application letter on company letterhead.
${String(formData.letterPurpose) === "current-account" ? "- Current Account Opening: Reference RBI guidelines. Include CIN, PAN, Board Resolution appointing authorized signatory. List all directors with DIN." : ""}
${String(formData.letterPurpose) === "gst-registration" ? "- GST Registration: Include PAN, address proof, board resolution, nature of business (HSN/SAC codes), expected turnover." : ""}
${String(formData.letterPurpose) === "noc-landlord" ? "- NOC: Format as a No Objection Certificate from the landlord/owner of premises, granting permission to use the address for GST registration / bank account." : ""}
${String(formData.letterPurpose) === "loan-request" ? "- Loan/OD Request: Include company profile, nature of business, turnover, purpose of loan, collateral offered (if any), existing banking relationships." : ""}
- Nature of Business: ${formData.natureOfBusiness || "[Description]"}
- Expected Turnover: ${formData.expectedTurnover || "[Amount]"}
- Directors: ${formData.directorsList || "[Director details]"}
- Enclosed Documents: ${formData.enclosedDocuments || "Certificate of Incorporation, PAN, Address Proof, Board Resolution"}
- Include proper declaration/undertaking at the end.
- Signatory with designation and company seal.
`;

        case "co-founder-agreement":
            return `
**CO-FOUNDER AGREEMENT DRAFTING RULES:**
- Startup: ${formData.startupName || "[Startup Name]"}
- CIN: ${formData.cin || "Not yet incorporated"}
- Business: ${formData.businessDescription || "[To be described]"}
- Equity Split: ${formData.equitySplit || "[To be defined]"}
- Vesting: ${formData.vestingSchedule || "4 years, 1-year cliff"}
- Founder A Role: ${formData.roleFounderA || "[To be defined]"}
- Founder B Role: ${formData.roleFounderB || "[To be defined]"}
- Salary: ${formData.salaryTerms || "No salary until funding"}
- Decision Making: ${formData.decisionMaking || "Unanimous"}
- Deadlock: ${formData.deadlockResolution || "Mediation then Arbitration"}
- Non-Compete: ${formData.nonCompetePeriod || "During association only"}
- Jurisdiction: Courts at ${formData.jurisdiction || city}
- Format: Comprehensive founder agreement — this is a BINDING CONTRACT between co-founders.
- Equity split must be clearly stated with percentage breakdown. Reference share certificates or proposed allotment.
- Vesting: ${formData.vestingSchedule === "none" ? "No vesting — all equity vests immediately (NOT recommended for investor readiness)." : `Reverse vesting schedule: ${formData.vestingSchedule || "4 years, 1-year cliff"}. Departing founder forfeits unvested shares.`}
- Good Leaver (resignation with notice, death, disability) vs. Bad Leaver (breach, competing, terminated for cause): Define clearly. Good leaver keeps vested equity; bad leaver forfeits at face value.
- Reserved matters requiring UNANIMOUS consent: Fundraising, equity changes, key hires (CXOs), pivots, asset sales > ₹5L, borrowing > ₹10L, related party transactions.
- Drag-along / Tag-along rights for future fundraising readiness.
- ROFR: No founder may transfer shares without offering to other founders first at same terms.
${formData.includeIPAssignment === true || formData.includeIPAssignment === "true" ? "- IP Assignment: ALL pre-existing IP and future IP created by founders is assigned irrevocably to the company entity. This is NON-NEGOTIABLE for investor readiness." : ""}
${formData.includeAntiDilution === true || formData.includeAntiDilution === "true" ? "- Anti-Dilution: Weighted-average broad-based anti-dilution protection for founders." : ""}
${formData.includeExpensePolicy === true || formData.includeExpensePolicy === "true" ? "- Expense Policy: Business expenses > ₹25,000 require approval from other founder(s). Reimbursement within 15 days of submission with receipts." : ""}
- Exit triggers: ${formData.exitTriggers || "Voluntary exit, termination for cause, death, disability, mutual agreement"}
- Post-exit non-compete: Note S.27, Indian Contract Act — post-employment non-compete is generally unenforceable. Include with reasonableness caveat.
- End with signature blocks for ALL founders.
`;

        case "board-resolution":
            return `
**BOARD RESOLUTION DRAFTING RULES:**
- Purpose: ${formData.resolutionPurpose || "[Resolution Purpose]"}
- Meeting Type: ${formData.meetingType || "Board Meeting"}
- Date: ${formData.meetingDate || "[Date]"}
- Time: ${formData.meetingTime || "[Time]"}
- Venue: ${formData.meetingVenue || "Registered Office"}
- Directors Present: ${formData.directorsPresent || "[Director details]"}
- Authorized Person: ${formData.authorizedPerson || "[Authorized Signatory]"}
- Format: Formal board resolution in standard corporate format.
- Start with company name, CIN, and registered office address.
- Meeting details: Date, time, venue (or "via video conference as permitted under Companies Act 2013").
${formData.meetingType === "circular" ? "- CIRCULAR RESOLUTION: No physical meeting. Resolution passed by circulation among all directors. Record date of circulation and approval. Note: Circular resolutions CANNOT be passed for matters requiring board meeting under S.179(3)." : ""}
${formData.quorumConfirmation === true || formData.quorumConfirmation === "true" ? "- Quorum confirmed as per S.174, Companies Act 2013 (minimum 2 directors or 1/3rd, whichever is higher)." : ""}
${String(formData.resolutionPurpose) === "bank-account" ? "- Bank Resolution: Include authorized signatory details, specimen signature authorization, transaction limits (single/joint), and specific banking operations authorized." : ""}
${String(formData.resolutionPurpose) === "esop" ? "- ESOP Resolution: Reference S.62(1)(b), Companies Act 2013. Specify ESOP pool % of authorized capital, exercise price basis, vesting terms, and administration." : ""}
${String(formData.resolutionPurpose) === "share-allotment" ? "- Share Allotment: Reference S.42/S.62 Companies Act. Include allottee details, shares/instrument type, face value + premium, total consideration. Note PAS-3 filing within 15 days." : ""}
${String(formData.resolutionPurpose) === "director-change" ? "- Director Change: Reference S.152/S.168 Companies Act. Include DIR-12 filing requirement within 30 days." : ""}
${String(formData.resolutionPurpose) === "office-change" ? "- Office Change: Reference S.12 Companies Act. Include new address, effective date, and INC-22 filing requirement." : ""}
${String(formData.resolutionPurpose) === "borrowing" ? "- Borrowing: Reference S.179(3)(d) and S.180(1)(c) Companies Act. Specify borrowing limit, lender, purpose, and security offered." : ""}
- Resolution text: Use "RESOLVED THAT..." format. Be specific about what is authorized.
- Authorization: "FURTHER RESOLVED THAT ${formData.authorizedPerson || "[Name, Designation]"} be and is hereby authorized to do all acts, deeds, and things necessary to give effect to this resolution."
${formData.includeROCFiling === true || formData.includeROCFiling === "true" ? "- Include: \"FURTHER RESOLVED THAT the Company Secretary / Director be authorized to file all necessary forms with the Registrar of Companies within the prescribed timelines.\"" : ""}
- Additional notes: ${formData.additionalNotes || "None"}
- End with: "The meeting concluded with a vote of thanks to the Chair." Signature blocks for Chairperson and all directors present.
`;

        case "termination-letter":
            return `
**TERMINATION LETTER DRAFTING RULES:**
- Employee: ${formData.employeeName || "[Employee Name]"} (ID: ${formData.employeeId || "[ID]"})
- Designation: ${formData.designation || "[Designation]"}, ${formData.department || "[Department]"}
- Date of Joining: ${formData.dateOfJoining || "[Date]"}
- Termination Date: ${formData.terminationDate || "[Date]"}
- Reason: ${formData.terminationReason || "Not specified"}
- Notice Period: ${formData.noticePeriodStatus || "As per appointment letter"}
- Format: Formal termination letter on company letterhead.
- Subject: "Termination of Employment — ${formData.employeeName || "[Employee Name]"}"
- Open with reference to the appointment letter / employment agreement.
${String(formData.terminationReason) === "performance" ? `- Performance termination: Reference PIP dates, review meetings, specific performance gaps, and improvement targets that were not met. Without PIP documentation, termination is challengeable.` : ""}
${String(formData.terminationReason) === "misconduct" ? `- Misconduct termination: Reference show cause notice (date), employee's response (if any), enquiry proceedings (if conducted), and specific misconduct. Follow principles of natural justice.` : ""}
${String(formData.terminationReason) === "redundancy" ? `- Redundancy: Explain business reasons for role elimination. For "workmen" under ID Act 1947: last-in-first-out rule, retrenchment compensation (15 days' average pay per year of service).` : ""}
${String(formData.terminationReason) === "probation-failure" ? `- Probation failure: Reference appointment letter probation terms, state specific areas where performance/fit requirements were not met during probation period.` : ""}
- Notice period: ${formData.noticePeriodStatus === "immediate" ? "Immediate termination for cause — no notice period applicable." : formData.noticePeriodStatus === "pay-in-lieu" ? `Payment of ${formData.noticePeriodDays || "30"} days' salary in lieu of notice period.` : formData.noticePeriodStatus === "garden-leave" ? `Employee placed on garden leave for ${formData.noticePeriodDays || "30"} days — not required to attend office but remains on payroll.` : `${formData.noticePeriodDays || "30"} days notice period — last working date: ${formData.terminationDate || "[Date]"}.`}
- Settlement: ${formData.settlementDetails || "As per company policy — pending salary, earned leave encashment, gratuity (if eligible)."}
- Asset return: ${formData.assetReturnList || "All company property including laptop, ID card, access cards, documents."}
${formData.includeNDAReminder === true || formData.includeNDAReminder === "true" ? "- Remind employee of ongoing confidentiality and NDA obligations that survive termination." : ""}
${formData.includeNonDisparagement === true || formData.includeNonDisparagement === "true" ? "- Both parties agree not to make disparaging remarks about each other." : ""}
${formData.includeAppealRight === true || formData.includeAppealRight === "true" ? "- Include right to appeal: Employee may appeal this decision in writing to [HR Head/Director] within 7 days." : ""}
- Signatory: HR Head or Director with designation.
`;

        case "consultancy-agreement":
            return `
**CONSULTANCY AGREEMENT DRAFTING RULES:**
- Consultant Type: ${formData.consultantType || "Individual"}
- Scope: ${formData.scopeOfWork || "[To be provided]"}
- Duration: ${formData.engagementDuration || "3 months"}
- Fee: ${formData.consultancyFee || "[Amount]"}
- Payment: ${formData.paymentTerms || "Monthly on invoice"}
- TDS: ${formData.tdsRate || "10% S.194J"}
- Notice Period: ${formData.noticePeriod || "15 days"}
- Jurisdiction: Courts at ${city}
- Format: Comprehensive consultancy agreement — this is a BINDING CONTRACT.
- INDEPENDENT CONTRACTOR STATUS (CRITICAL): State explicitly that the consultant is NOT an employee of the company. The company does not control the manner/method of work — only the deliverables. Consultant is responsible for own taxes, PF, insurance.
- Scope of work: Detail deliverables, milestones, acceptance criteria, and revision process. Include a Schedule/Annexure for detailed SOW if needed.
- Fee & payment: ${formData.consultancyFee || "[Amount]"} payable ${formData.paymentTerms || "monthly on submission of invoice"}. Invoice must include PAN, GST (if applicable), and bank details.
- TDS: Company will deduct TDS at ${formData.tdsRate === "10-194j" ? "10% under S.194J" : formData.tdsRate === "2-194c-company" ? "2% under S.194C" : formData.tdsRate === "1-194c-individual" ? "1% under S.194C" : "applicable rate"} from all payments. TDS certificate (Form 16A) will be provided quarterly.
- GST: If consultant is GST-registered, they must issue proper GST invoice. If not registered, mention that no GST is applicable.
${formData.includeIPAssignment === true || formData.includeIPAssignment === "true" ? "- IP Assignment: ALL deliverables (code, designs, documents, inventions) vest exclusively in the Company from the moment of creation. Consultant waives all claims. Work-for-hire under S.17(c) Copyright Act applies only to employees — this requires explicit assignment." : ""}
${formData.includeNDA === true || formData.includeNDA === "true" ? "- Confidentiality: Consultant must keep all company information confidential during and after engagement. Survives termination by 3 years." : ""}
${formData.includeNonSolicit === true || formData.includeNonSolicit === "true" ? "- Non-Solicitation: Consultant shall not solicit company employees or clients for 12 months after engagement ends." : ""}
${formData.includeNonCompete === true || formData.includeNonCompete === "true" ? "- Non-Compete (during engagement only): Consultant shall not provide similar services to direct competitors during the engagement. Post-engagement non-compete: Note S.27 Indian Contract Act enforceability limitation." : ""}
${formData.includeIndemnity === true || formData.includeIndemnity === "true" ? "- Indemnity: Consultant indemnifies company against all claims arising from consultant's work, including IP infringement, data breaches, and professional negligence." : ""}
- Termination: Either party with ${formData.noticePeriod || "15 days"} written notice. Immediate termination for: material breach, fraud, insolvency, or prolonged non-performance.
- End with signature blocks for both parties.
`;

        case "service-agreement":
            return `
**SERVICE AGREEMENT DRAFTING RULES:**
- Service Type: ${formData.serviceType || "IT Services"}
- Description: ${formData.serviceDescription || "[To be provided]"}
- Pricing: ${formData.pricingModel || "Monthly"} — ${formData.contractValue || "[Amount]"}
- Payment Terms: ${formData.paymentTerms || "Net 30"}
- Duration: ${formData.contractDuration || "12 months"}
- SLA Uptime: ${formData.slaUptime || "No SLA"}
- SLA Response: ${formData.slaResponseTime || "Not specified"}
- Liability Cap: ${formData.liabilityCap || "12-month fees"}
- Dispute Resolution: ${formData.disputeResolution || "Arbitration"}
- Jurisdiction: Courts at ${city}
- Format: Comprehensive service agreement — this is the PRIMARY commercial contract.
- Service description must be EXHAUSTIVE: What's included, what's excluded, service hours, support channels.
- SLA section: ${formData.slaUptime && formData.slaUptime !== "none" ? `Guaranteed uptime: ${formData.slaUptime}%. Include SLA credit mechanism for failures (e.g., 5% credit for each 0.1% shortfall). Define measurement period and exclusions (planned maintenance, force majeure).` : "No SLA specified — service is provided on best-efforts basis."}
- Pricing: ${formData.pricingModel || "Monthly"} at ${formData.contractValue || "[Amount]"}. Include: payment currency (INR), GST treatment (18% GST on services — SAC code), invoice process, late payment interest (1.5% per month).
- Payment: ${formData.paymentTerms || "Net 30"} from invoice date. Include TDS deduction provisions (S.194J/194C IT Act).
${formData.includeDataProtection === true || formData.includeDataProtection === "true" ? "- Data Protection: Reference DPDP Act 2023 and IT Act 2000 S.43A. Service provider as data processor — must implement reasonable security, notify breaches within 72 hours, delete data on termination. Data belongs to the customer." : ""}
${formData.includeIPClause === true || formData.includeIPClause === "true" ? "- IP: Pre-existing IP retained by creator. Custom work/deliverables assigned to customer. Platform/SaaS IP remains with provider. No implied license beyond the service term." : ""}
${formData.includeConfidentiality === true || formData.includeConfidentiality === "true" ? "- Confidentiality: Mutual — both parties protect each other's confidential information. Survives termination by 3 years." : ""}
- Liability cap: ${formData.liabilityCap === "12-month-fees" ? "Total aggregate liability capped at fees paid in the preceding 12-month period." : formData.liabilityCap === "total-value" ? "Total aggregate liability capped at total contract value." : formData.liabilityCap === "2x-fees" ? "Total aggregate liability capped at 2x fees paid." : "Unlimited liability (NOT recommended)."} Carve-outs: breach of confidentiality, IP infringement, willful misconduct — subject to higher cap or uncapped.
${formData.includeForceMajeure === true || formData.includeForceMajeure === "true" ? "- Force Majeure: Include pandemic, war, government orders, natural disasters. Party must notify within 48 hours. If FM persists > 90 days, either party may terminate." : ""}
${formData.includeIndemnity === true || formData.includeIndemnity === "true" ? "- Indemnity: Mutual indemnification for IP infringement, data breaches, and breach of reps/warranties." : ""}
- Term: ${formData.contractDuration || "12 months"}. Auto-renewal unless either party gives 30 days notice before expiry.
- Termination: For convenience (30-60 days notice), for cause (material breach with 15-day cure). Data migration period: 30 days post-termination.
- End with signature blocks for both parties.
`;

        case "ip-assignment":
            return `
**IP ASSIGNMENT AGREEMENT DRAFTING RULES:**
- Assignor Type: ${formData.assignorType || "Founder"}
- IP Description: ${formData.ipDescription || "[To be described]"}
- IP Type: ${formData.ipType || "Comprehensive"}
- Context: ${formData.creationContext || "Pre-incorporation"}
- Consideration: ${formData.consideration || "₹1 (nominal)"}
- Jurisdiction: Courts at ${formData.jurisdiction || city}
- Format: Formal IP assignment agreement — this is a CRITICAL legal document for startup ownership.
- Recitals: Explain the context — when IP was created, by whom, under what circumstances, and why assignment is necessary.
- Definition of "Assigned IP": Must be COMPREHENSIVE — include all software (source code, object code, APIs, databases), designs (UI/UX, graphics, logos), documentation, trade secrets, know-how, inventions, domain names, and derivative works.
${String(formData.creationContext) === "pre-incorporation" ? "- PRE-INCORPORATION IP: Founders built the product before the company was incorporated. This assignment retroactively transfers all IP to the company entity. This is CRITICAL for investor due diligence — without it, the company doesn't own its core product." : ""}
${String(formData.creationContext) === "during-engagement" ? "- DURING ENGAGEMENT: IP created during employment/contract should already belong to the company (S.17(c) Copyright Act for employees). This agreement provides belt-and-suspenders protection." : ""}
${String(formData.creationContext) === "commissioned" ? "- COMMISSIONED WORK: Under Indian law, commissioner does NOT automatically own copyright in commissioned work (unlike some jurisdictions). Explicit assignment is REQUIRED." : ""}
- Assignment clause: "The Assignor hereby irrevocably and unconditionally assigns, transfers, and conveys to the Assignee, all right, title, and interest in and to the Assigned IP, including all intellectual property rights therein, throughout the world, in perpetuity."
- Consideration: ${formData.consideration || "₹1 (nominal)"} — valid consideration is required under Indian Contract Act. Acknowledgment of receipt.
${formData.includeMoralRightsWaiver === true || formData.includeMoralRightsWaiver === "true" ? "- Moral Rights (S.57, Copyright Act 1957): Moral rights (right to attribution, right to prevent distortion) CANNOT be fully waived under Indian law. Include: \"The Assignor agrees not to exercise any moral rights under S.57 of the Copyright Act 1957 in a manner that would adversely affect the Assignee's exercise of rights in the Assigned IP.\"" : ""}
${formData.includeWarranties === true || formData.includeWarranties === "true" ? "- Warranties: Assignor represents and warrants that: (a) IP is original work, (b) no third-party infringement, (c) no existing licenses or encumbrances, (d) full right and authority to assign, (e) no pending claims or litigation." : ""}
${formData.includeSourceCode === true || formData.includeSourceCode === "true" ? "- Source Code Handover: Assignor shall deliver all source code, repositories, documentation, access credentials, API keys, deployment scripts, and build instructions within 7 days of execution." : ""}
${formData.includeFurtherAssurance === true || formData.includeFurtherAssurance === "true" ? "- Further Assurance: Assignor agrees to execute any additional documents, file registrations, and take all actions necessary to perfect the IP transfer (including patent/trademark filings)." : ""}
${formData.includeNonAssertion === true || formData.includeNonAssertion === "true" ? "- Non-Assertion: Assignor covenants not to assert any intellectual property rights against the Assignee or its successors in relation to the Assigned IP." : ""}
- End with signature blocks, witness signatures, and schedule listing all assigned IP in detail.
`;

        case "experience-letter":
            return `
**EXPERIENCE LETTER DRAFTING RULES:**
- Employee: ${formData.employeeName || "[Employee Name]"} (ID: ${formData.employeeId || "[ID]"})
- Designation: ${formData.designation || "[Designation]"}, ${formData.department || "[Department]"}
- Date of Joining: ${formData.dateOfJoining || "[Date]"}
- Last Working Date: ${formData.lastWorkingDate || "[Date]"}
- Performance: ${formData.performanceRemark || "Good"}
- Format: Professional experience certificate on company letterhead. "To Whom It May Concern."
- Open with: "This is to certify that ${formData.employeeName || "[Employee Name]"} was employed with [Company Name] from ${formData.dateOfJoining || "[DOJ]"} to ${formData.lastWorkingDate || "[LWD]"} as ${formData.designation || "[Designation]"} in the ${formData.department || "[Department]"} department."
${formData.designationsHeld ? `- Designation history: ${formData.designationsHeld}. List chronologically showing career progression.` : ""}
- Key Responsibilities: ${formData.keyResponsibilities || "[To be provided]"} — describe in 4-6 bullet points, covering core duties, team management (if applicable), and domain areas.
${formData.includeProjects === true || formData.includeProjects === "true" ? "- Notable Projects: Highlight 2-3 key projects the employee contributed to. Describe scope and impact WITHOUT revealing confidential details." : ""}
${formData.includeSkills === true || formData.includeSkills === "true" ? "- Skills & Competencies: List technical skills, tools, languages, and soft skills demonstrated during tenure." : ""}
- Performance & Conduct: "${formData.performanceRemark === "outstanding" ? "During their tenure, [Employee] consistently exceeded expectations and made exceptional contributions to the team and organization." : formData.performanceRemark === "excellent" ? "During their tenure, [Employee] consistently met and often exceeded expectations, demonstrating excellent professional capabilities." : formData.performanceRemark === "good" ? "During their tenure, [Employee] reliably met expectations and was a valued member of the team." : "During their tenure, [Employee] satisfactorily fulfilled their assigned responsibilities."}"
${formData.includeWishNote === true || formData.includeWishNote === "true" ? "- Close with: \"We wish [Employee] all the very best in their future professional endeavours and are confident they will continue to excel.\"" : ""}
- Signatory: HR Head or Director with designation, date, and company stamp/seal.
`;

        case "internship-letter":
            return `
**INTERNSHIP OFFER LETTER DRAFTING RULES:**
- Intern: ${formData.internName || "[Intern Name]"}
- College: ${formData.collegeName || "Not specified"}
- Role: ${formData.designation || "[Internship Role]"}, ${formData.department || "[Department]"}
- Project: ${formData.projectDescription || "[To be described]"}
- Start Date: ${formData.startDate || "[Date]"}
- Duration: ${formData.duration || "3 months"}
- Stipend: ${formData.stipend || "[Amount]"}/month
- Location: ${formData.workLocation || "[Location]"}
- Mentor: ${formData.reportingTo || "[Mentor Name]"}
- PPO: ${formData.ppoEligible || "Not specified"}
- Format: Professional but welcoming offer letter on company letterhead.
- Address the intern by name. Open with congratulatory tone — "We are pleased to offer you an internship opportunity at [Company Name]."
${formData.collegeName ? `- Reference academic institution: "This internship is being offered to you as a student of ${formData.collegeName}."` : ""}
- Project description must be specific: What will the intern work on, what are the expected deliverables, and what will they learn.
- Mentor: ${formData.reportingTo || "[Mentor]"} — the intern's primary point of contact for guidance, feedback, and evaluation.
- Working hours: ${formData.workingHours || "10:00 AM – 6:00 PM, Monday to Friday"}. Respect labour law limits.
- Stipend: ${formData.stipend || "[Amount]"} per month, payable on ${formData.stipend ? "the first week of the following month" : "[payment date]"}. Mention that TDS will be deducted if stipend exceeds taxable threshold.
- PPO: ${formData.ppoEligible === "yes-performance" ? "Eligible for Pre-Placement Offer based on performance evaluation at the end of the internship." : formData.ppoEligible === "yes-guaranteed" ? "Guaranteed Pre-Placement Offer upon successful completion of the internship." : "This internship does not include a PPO component."}
${formData.includeNDA === true || formData.includeNDA === "true" ? "- Confidentiality: Intern must keep all company information, code, data, and strategies strictly confidential. NDA obligations survive the internship." : ""}
${formData.includeIPClause === true || formData.includeIPClause === "true" ? "- IP Assignment: All code, designs, documents, and work product created during the internship belong exclusively to the company." : ""}
${formData.includeCertificate === true || formData.includeCertificate === "true" ? "- Certificate: Upon successful completion, the company will issue an Internship Completion Certificate detailing the role, duration, and project." : ""}
- Termination: Either party may terminate with 7 days written notice. Immediate termination for misconduct.
- End with offer acceptance section — intern must sign and return by [acceptance deadline].
`;

        case "isafe-note":
            return `
**iSAFE NOTE DRAFTING RULES:**
- Investor: ${orgB?.name || "[Investor Name]"}
- Company: ${orgA.name}
- Investment Amount: ₹${formData.investmentAmount || "[Amount]"}
- Valuation Cap: ₹${formData.valuationCap || "[Cap]"}
- Discount Rate: ${formData.discountRate || "20"}%
- Conversion Event: ${formData.conversionEvent || "Equity Financing"}
- Equity Financing Threshold: ₹${formData.equityFinancingThreshold || "50,00,000"}
- Format: Professional investment agreement format.
- Start with a clear title: "INDIA SIMPLE AGREEMENT FOR FUTURE EQUITY (iSAFE)".
- Section 1 (The Investment): Confirm the Company is a private limited company and the Investor is providing the Purchase Amount.
- Section 2 (Liquidity Events): Detail conversion logic during M&A or IPO based on the Valuation Cap.
- Section 3 (Dissolution): Specify that the Investor has priority over common shareholders but is subordinate to debt holders.
- Section 4 (Reps and Warranties): Include standard "clean" startup warranties.
- Section 5 (Miscellaneous): Include Governing Law (India), Jurisdiction (${city}), and dispute resolution.
- IMPORTANT: Clearly state that this instrument is NOT a debt and carries no interest.
`;

        case "sha":
            return `
**SHAREHOLDERS AGREEMENT DRAFTING RULES:**
- Company: ${orgA.name}
- Founders: ${formData.foundersNames || "[Founders]"}
- Investor: ${orgB?.name || "[Investor]"}
- Board Seats: ${formData.boardSeats || "[Seats]"}
- Veto Rights: ${formData.vetoRights || "[Rights]"}
- Exit Rights: Include ROFR, ROFO, Tag-Along, and Drag-Along rights.
- Board Composition: Specify how many directors each party can appoint.
- Transfer Restrictions: Shares are non-transferable during lock-in period.
- Reference Companies Act 2013 and SHAs standard market practice in India.
`;

        case "term-sheet":
            return `
**TERM SHEET DRAFTING RULES:**
- Pre-Money Valuation: ₹${formData.preMoneyValuation || "[Amount]"}
- Round Size: ₹${formData.roundSize || "[Amount]"}
- Instrument: ${formData.instrumentType || "CCPS"}
- Exclusivity: ${formData.exclusivityPeriod || "30 days"}
- Binding Clauses: Confidentiality, Exclusivity, and Governing Law.
- Non-Binding Clauses: Valuation, Board Rights, and other commercial terms.
`;

        case "founders-deed":
            return `
**FOUNDERS' DEED DRAFTING RULES:**
- Founders: ${formData.foundersNames || "[Names]"}
- Equity Split: ${formData.equitySplit || "[Split]"}
- Vesting: ${formData.vestingSchedule || "4 years / 1 year cliff"}
- Role of Founders: Detail technical/business responsibilities.
- IP Assignment: All pre-incorporation work belongs to the future company.
- Reverse Vesting: Essential for long-term commitment.
`;

        case "saas-agreement":
            return `
**SaaS AGREEMENT DRAFTING RULES:**
- Services: ${formData.serviceDescription || "[Services]"}
- Subscription Fee: ₹${formData.subscriptionFee || "[Amount]"}
- SLA: ${formData.slaUptime || "99.9"}% Uptime.
- Data Privacy: Reference DPDP Act 2023 for customer data.
- Ownership: Customer owns data; Provider owns the software.
`;

        case "rent-agreement":
            return `
**RENT AGREEMENT DRAFTING RULES:**
- Property: ${formData.propertyAddress || "[Address]"}
- Rent: ₹${formData.monthlyRent || "[Amount]"}
- Deposit: ₹${formData.securityDeposit || "[Amount]"}
- Term: ${formData.leaseTerm || "11 months"}
- Notice Period: ${formData.noticePeriod || "1 month"}
- Standard Indian residential lease terms. Mention fixtures and fittings.
`;

        case "commercial-lease":
            return `
**COMMERCIAL LEASE DRAFTING RULES:**
- Premises: ${formData.officeAddress || "[Address]"}
- Rent: ₹${formData.monthlyRent || "[Amount]"}
- CAM Charges: ₹${formData.camCharges || "0"}
- Escalation: ${formData.rentEscalation || "5% annual"}
- Security Deposit: ${formData.securityDepositMonths || "6"} months rent.
- Registration: Mandatory if term > 11 months.
`;

        case "influencer-agreement":
            return `
**INFLUENCER AGREEMENT DRAFTING RULES:**
- Campaign: ${formData.campaignTitle || "[Campaign]"}
- Deliverables: ${formData.deliverables || "[Posts/Videos]"}
- Fee: ₹${formData.campaignFee || "[Amount]"}
- Approval: Brand has final approval on all content before posting.
- Usage Rights: Brand can reuse content for ${formData.usageDuration || "1 year"}.
`;

        case "posh-policy":
            return `
**POSH POLICY DRAFTING RULES:**
- Company: ${orgA.name}
- IC Chairperson: ${formData.icChairperson || "[Name]"}
- IC Members: ${formData.icMembersList || "[Names]"}
- Mandatory Policy under Sexual Harassment of Women at Workplace Act 2013.
- Focus on complaint mechanism (IC) and strict timelines for inquiry.
`;

        case "section-138-notice":
            return `
**SECTION 138 NOTICE (CHEQUE BOUNCE) DRAFTING RULES:**
- Cheque Number: ${formData.chequeNumber || "[Number]"}
- Amount: ₹${formData.chequeAmount || "[Amount]"}
- Reason for Dishonour: ${formData.dishonourReason || "Funds Insufficient"}
- Bank Memo Date: ${formData.memoDate || "[Date]"}
- Demand: Payment within 15 days of notice receipt.
- Statutory warning under Negotiable Instruments Act.
`;

        case "data-breach-notice":
            return `
**DATA BREACH NOTICE DRAFTING RULES:**
- Breach Date: ${formData.breachDate || "[Date]"}
- Data Involved: ${formData.natureOfData || "[Types of data]"}
- Actions Taken: ${formData.remedialAction || "[Remedial steps]"}
- DPDP Act 2023 compliance. Notify users of potential risks and mitigation steps.
`;

        case "gpa":
            return `
**GPA DRAFTING RULES:**
- Attorney: ${formData.attorneyName || "[Name]"}
- Scope: ${formData.scopeOfPowers || "[Powers]"}
- Duration: ${formData.isPerpetual === "true" ? "Perpetual until revoked" : "Specific to task"}
- Clearly list authorized acts (Banking, Legal, ROC, etc.).
`;

        case "software-license":
            return `
**SOFTWARE LICENSE DRAFTING RULES:**
- Software: ${formData.softwareName || "[Name]"}
- License Type: ${formData.licenseType || "Proprietary / Restricted"}
- Fee: ₹${formData.licenseFee || "[Amount]"}
- No reverse engineering or unauthorized redistribution.
`;

        case "white-label-agreement":
            return `
**WHITE LABEL AGREEMENT DRAFTING RULES:**
- Tech: ${formData.techDescription || "[Technology]"}
- Rights: ${formData.brandingRights || "[Branding permissions]"}
- Reselling: Multi-tier or direct reselling rights defined.
- Support: Support obligations split between Provider and Partner.
`;

        case "maintenance-agreement":
            return `
**AMC / MAINTENANCE AGREEMENT DRAFTING RULES:**
- Scope: ${formData.serviceScope || "[Scope]"}
- Fee: ₹${formData.maintenanceFee || "[Amount]"} annual.
- SLA: Response and resolution times for bugs/issues.
`;

        case "ethics-code":
            return `
**CODE OF ETHICS DRAFTING RULES:**
- Principles: Integrity, Professionalism, and Transparency.
- Sections: Conflicts of interest, anti-bribery, and asset protection.
`;

        case "fnf-settlement":
            return `
**F&F SETTLEMENT DEED DRAFTING RULES:**
- Employee: ${formData.employeeName || "[Name]"}
- Final Dues: ₹${formData.totalDues || "[Amount]"}
- Waiver: Employee acknowledges full receipt and waives all future claims.
`;

        case "affiliate-agreement":
        case "sponsorship-agreement":
            return `
**MARKETING / AFFILIATE AGREEMENT DRAFTING RULES:**
- Campaign: ${formData.campaignType || "Affiliate"}
- Commission: ${formData.commissionStructure || "[Details]"}
- Exclusivity: ${formData.isExclusive === "true" ? "Exclusive" : "Non-exclusive"}
`;

        case "leave-license":
            return `
**LEAVE & LICENSE DRAFTING RULES:**
- Premises: ${formData.premisesDetails || "[Address]"}
- License Fee: ₹${formData.licenseFee || "[Amount]"}
- Deposit: ₹${formData.securityDeposit || "[Amount]"}
- Nature: License to use, not a tenancy. No transfer of interest.
`;

        case "eviction-notice":
            return `
**EVICTION NOTICE DRAFTING RULES:**
- Reason: ${formData.reasonForEviction || "[Reason]"}
- Deadline: ${formData.vacateDeadline || "15"} days.
- Demand to vacate based on breach of lease terms.
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
