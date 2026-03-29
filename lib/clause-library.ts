// ═══════════════════════════════════════════════════════════════════════════════
// ClauseWala. — India-Centric NDA Clause Library
// ═══════════════════════════════════════════════════════════════════════════════
//
// Aligned with:
//   • Indian Contract Act, 1872
//   • Arbitration and Conciliation Act, 1996
//   • Information Technology Act, 2000
//   • Copyright Act, 1957
//   • Companies Act, 2013 (where applicable)
//   • Digital Personal Data Protection Act, 2023
//
// Clause categories:
//   CORE_STRUCTURAL       — Essential in almost every NDA (1–4)
//   CONFIDENTIALITY       — The heart of the NDA (5–7)
//   TERM_SURVIVAL         — Duration and post-termination survival (8–10)
//   PROTECTIVE            — Enforcement and remedies (11–13)
//   DISPUTE_LEGAL         — Governing law, jurisdiction, arbitration (14–16)
//   BUSINESS_PROTECTION   — Non-compete, non-solicit, non-circumvent (17–19)
//   IP                    — Intellectual property clauses (20–21)
//   DATA_COMPLIANCE       — Data protection, trade secrets (22–23)
//   STRUCTURAL_SAFETY     — Boilerplate (severability, waiver, etc.) (24–30)
//   ADVANCED              — Enterprise / optional clauses (31–35)
// ═══════════════════════════════════════════════════════════════════════════════

export type ClauseCategory =
    | "CORE_STRUCTURAL"
    | "CONFIDENTIALITY"
    | "TERM_SURVIVAL"
    | "PROTECTIVE"
    | "DISPUTE_LEGAL"
    | "BUSINESS_PROTECTION"
    | "IP"
    | "DATA_COMPLIANCE"
    | "STRUCTURAL_SAFETY"
    | "ADVANCED";

export type ClauseCondition =
    | "mandatory"   // Always included
    | "conditional" // Included based on form toggles / context
    | "contextual"; // AI decides based on relationship type, purpose, etc.

export interface ClauseDefinition {
    id: string;
    title: string;
    category: ClauseCategory;
    condition: ClauseCondition;
    /** When this clause should be included (human-readable rule) */
    includeWhen: string;
    /** Default risk level — AI can override based on context */
    defaultRisk: "low" | "medium" | "high";
    /** Indian legal references */
    legalRefs: string[];
    /** The actual clause text template (with [PLACEHOLDERS]) */
    text: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// NDA Clause Definitions — 35 clauses, India-centric
// ─────────────────────────────────────────────────────────────────────────────

export const NDA_CLAUSE_LIBRARY: ClauseDefinition[] = [

    // ═══ 1–4: CORE STRUCTURAL CLAUSES ═══════════════════════════════════════

    {
        id: "confidential_header",
        title: "Confidentiality & Privilege Notice",
        category: "CORE_STRUCTURAL",
        condition: "conditional",
        includeWhen: "Always for NDAs, SHA, and Term Sheets",
        defaultRisk: "low",
        legalRefs: ["Indian Evidence Act, 1872 — S.126"],
        text: `**PRIVILEGED AND CONFIDENTIAL**
This document and its contents are legally privileged and strictly confidential, governed by the provisions of Section 126 of the Indian Evidence Act, 1872. Unauthorized review, use, disclosure, or distribution is prohibited.`,
    },

    {
        id: "title_effective_date",
        title: "Title and Effective Date",
        category: "CORE_STRUCTURAL",
        condition: "mandatory",
        includeWhen: "Always",
        defaultRisk: "low",
        legalRefs: ["Indian Contract Act, 1872 — S.2(h)"],
        text: `# NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of [EFFECTIVE_DATE] ("Effective Date").`,
    },

    {
        id: "parties_clause",
        title: "Parties Clause",
        category: "CORE_STRUCTURAL",
        condition: "mandatory",
        includeWhen: "Always",
        defaultRisk: "high",
        legalRefs: ["Indian Contract Act, 1872 — S.10, S.11", "Companies Act, 2013 — S.2(20)"],
        text: `**Parties.**
(a) "[PARTY_A_LABEL]" means [PARTY_A_NAME], having its registered office at [PARTY_A_ADDRESS], acting through its authorized signatory [PARTY_A_SIGNATORY].
(b) "[PARTY_B_LABEL]" means [PARTY_B_NAME], having its address at [PARTY_B_ADDRESS], acting through [PARTY_B_SIGNATORY].
The [PARTY_A_LABEL] and [PARTY_B_LABEL] are individually referred to as a "Party" and collectively as "Parties."`,
    },

    {
        id: "recitals_background",
        title: "Recitals / Background",
        category: "CORE_STRUCTURAL",
        condition: "mandatory",
        includeWhen: "Always",
        defaultRisk: "low",
        legalRefs: [],
        text: `**WHEREAS:**
(A) The Parties wish to explore a potential [RELATIONSHIP_CONTEXT] and, in connection therewith, the Disclosing Party may disclose certain Confidential Information to the Receiving Party; and
(B) The Parties wish to define their rights and obligations regarding such Confidential Information.
**NOW, THEREFORE**, in consideration of the mutual covenants herein, the Parties agree as follows:`,
    },

    {
        id: "purpose_clause",
        title: "Purpose Clause",
        category: "CORE_STRUCTURAL",
        condition: "mandatory",
        includeWhen: "Always",
        defaultRisk: "high",
        legalRefs: ["Indian Contract Act, 1872 — S.23 (lawful object)"],
        text: `**Purpose.**
The Confidential Information shall be disclosed and used solely for the purpose of [PURPOSE] ("Purpose"). The Receiving Party shall not use the Confidential Information for any purpose other than the Purpose without the prior written consent of the Disclosing Party.`,
    },

    // ═══ 5–7: CONFIDENTIALITY FRAMEWORK ═════════════════════════════════════

    {
        id: "definition_confidential_info",
        title: "Definition of Confidential Information",
        category: "CONFIDENTIALITY",
        condition: "mandatory",
        includeWhen: "Always",
        defaultRisk: "high",
        legalRefs: ["IT Act, 2000 — S.43A", "SPDI Rules, 2011"],
        text: `**Definition of Confidential Information.**
"Confidential Information" means all non-public, proprietary, or confidential information disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, electronically, or by any other means, including but not limited to:
(a) technical data, source code, algorithms, system architecture, and trade secrets;
(b) financial data, projections, pricing models, and business plans;
(c) customer lists, vendor lists, marketing strategies, and sales data;
(d) information conveyed orally that is identified as confidential at the time of disclosure and summarized in writing within fifteen (15) days;
(e) derivatives, analyses, compilations, notes, and summaries prepared by the Receiving Party that contain or are derived from Confidential Information;
(f) any information that a reasonable person would understand to be confidential given the nature of the information and circumstances of disclosure.`,
    },

    {
        id: "exclusions_exceptions",
        title: "Exclusions from Confidential Information",
        category: "CONFIDENTIALITY",
        condition: "mandatory",
        includeWhen: "Always",
        defaultRisk: "high",
        legalRefs: ["Indian Contract Act, 1872 — S.10"],
        text: `**Exclusions.**
Confidential Information shall not include information that:
(a) is or becomes generally available to the public other than as a result of a disclosure by the Receiving Party;
(b) was in the Receiving Party's possession on a non-confidential basis prior to disclosure, as demonstrated by written records;
(c) is independently developed by the Receiving Party without use of or reference to the Confidential Information;
(d) becomes available from a source not bound by a confidentiality obligation to the Disclosing Party; or
(e) is required to be disclosed by law, regulation, or court order, provided that the Receiving Party shall: (i) give prompt prior written notice to the Disclosing Party; (ii) cooperate in seeking a protective order; and (iii) disclose only the legally required portion.`,
    },

    {
        id: "obligations_receiving_party",
        title: "Obligations of Receiving Party",
        category: "CONFIDENTIALITY",
        condition: "mandatory",
        includeWhen: "Always — text varies by disclosureType and relationshipType",
        defaultRisk: "high",
        legalRefs: ["Indian Contract Act, 1872 — S.73, S.74"],
        text: `**Obligations of the Receiving Party.**
The Receiving Party agrees to:
(a) keep the Confidential Information strictly confidential and not disclose it to any third party without prior written consent;
(b) use the Confidential Information solely for the Purpose;
(c) limit access to its employees, directors, or advisors who have a genuine "need to know" and are bound by confidentiality obligations no less restrictive than herein;
(d) use at least the same degree of care as it uses to protect its own confidential information, but no less than reasonable care;
(e) not reverse engineer, decompile, or disassemble any product embodying the Confidential Information;
(f) promptly notify the Disclosing Party of any unauthorized disclosure or use.`,
    },

    // ═══ 8–10: TERM & SURVIVAL ══════════════════════════════════════════════

    {
        id: "term_of_agreement",
        title: "Term of Agreement",
        category: "TERM_SURVIVAL",
        condition: "mandatory",
        includeWhen: "Always — varies by relationshipType",
        defaultRisk: "medium",
        legalRefs: ["Indian Contract Act, 1872 — S.62"],
        text: `**Term.**
This Agreement shall become effective on the Effective Date and shall remain in full force and effect for a period of [TERM] from the Effective Date, unless earlier terminated in accordance with this Agreement.`,
    },

    {
        id: "survival_of_confidentiality",
        title: "Survival of Confidentiality Obligations",
        category: "TERM_SURVIVAL",
        condition: "mandatory",
        includeWhen: "Always",
        defaultRisk: "high",
        legalRefs: [],
        text: `**Survival.**
The obligations of confidentiality shall survive for a period of [SURVIVAL_DURATION] years from the date of disclosure. For trade secrets, the obligations survive in perpetuity for so long as such information qualifies as a trade secret.`,
    },

    {
        id: "termination",
        title: "Termination",
        category: "TERM_SURVIVAL",
        condition: "mandatory",
        includeWhen: "Always — text varies by relationshipType",
        defaultRisk: "medium",
        legalRefs: ["Indian Contract Act, 1872 — S.62, S.63"],
        text: `**Termination.**
Either party may terminate this Agreement by providing [NOTICE_PERIOD] days' prior written notice. Termination shall not affect: (a) accrued rights or obligations; (b) confidentiality obligations per the Survival clause; or (c) any provisions intended to survive termination.`,
    },

    // ═══ 11–13: PROTECTIVE & ENFORCEMENT ════════════════════════════════════

    {
        id: "return_destruction_materials",
        title: "Return or Destruction of Information",
        category: "PROTECTIVE",
        condition: "mandatory",
        includeWhen: "Always",
        defaultRisk: "high",
        legalRefs: [],
        text: `**Return or Destruction of Materials.**
Upon termination or written request by the Disclosing Party, the Receiving Party shall promptly:
(a) return all originals and copies of Confidential Information;
(b) permanently delete all electronic copies; and
(c) provide a signed written certification confirming return or destruction within fifteen (15) days.
The Receiving Party may retain copies required by law, subject to continued confidentiality obligations.`,
    },

    {
        id: "remedies",
        title: "Remedies",
        category: "PROTECTIVE",
        condition: "mandatory",
        includeWhen: "Always",
        defaultRisk: "high",
        legalRefs: ["Indian Contract Act, 1872 — S.73, S.74", "Specific Relief Act, 1963 — S.36–42"],
        text: `**Remedies.**
The Receiving Party acknowledges that unauthorized disclosure may cause irreparable harm for which monetary damages alone would be inadequate. The Disclosing Party shall be entitled to seek injunctive or equitable relief in addition to any other remedies at law, without the necessity of proving actual damages or posting any bond.`,
    },

    {
        id: "indemnity",
        title: "Indemnity",
        category: "PROTECTIVE",
        condition: "contextual",
        includeWhen: "Employee, contractor, or investor relationships; high-value IP",
        defaultRisk: "medium",
        legalRefs: ["Indian Contract Act, 1872 — S.124, S.125"],
        text: `**Indemnity.**
The Receiving Party shall indemnify and hold harmless the Disclosing Party, its affiliates, officers, directors, employees, and agents from all losses, damages, liabilities, costs, and expenses (including reasonable attorney's fees) arising from any breach of this Agreement by the Receiving Party.`,
    },

    // ═══ 14–16: DISPUTE & LEGAL FRAMEWORK (India-Specific) ══════════════════

    {
        id: "governing_law",
        title: "Governing Law",
        category: "DISPUTE_LEGAL",
        condition: "mandatory",
        includeWhen: "Always",
        defaultRisk: "medium",
        legalRefs: ["Indian Contract Act, 1872"],
        text: `**Governing Law.**
This Agreement shall be governed by and construed in accordance with the laws of India.`,
    },

    {
        id: "jurisdiction",
        title: "Jurisdiction (Courts)",
        category: "DISPUTE_LEGAL",
        condition: "conditional",
        includeWhen: "When disputeResolution = 'court'",
        defaultRisk: "medium",
        legalRefs: ["Code of Civil Procedure, 1908 — S.20"],
        text: `**Jurisdiction.**
Any dispute arising out of this Agreement shall be subject to the exclusive jurisdiction of the courts at [JURISDICTION_CITY], India.`,
    },

    {
        id: "arbitration",
        title: "Arbitration Clause",
        category: "DISPUTE_LEGAL",
        condition: "conditional",
        includeWhen: "When disputeResolution = 'arbitration'",
        defaultRisk: "medium",
        legalRefs: ["Arbitration and Conciliation Act, 1996 — S.7, S.11"],
        text: `**Arbitration.**
Any dispute arising out of this Agreement shall be resolved by arbitration under the Arbitration and Conciliation Act, 1996:
(a) Sole arbitrator mutually appointed by the Parties (or per the Act if no agreement within 30 days);
(b) Seat and venue: [JURISDICTION_CITY], India;
(c) Language: English;
(d) The award shall be final and binding;
(e) Either Party may seek interim relief from courts at [JURISDICTION_CITY] pending arbitration.`,
    },

    // ═══ 17–19: BUSINESS PROTECTION (Conditional) ═══════════════════════════

    {
        id: "non_compete",
        title: "Non-Compete",
        category: "BUSINESS_PROTECTION",
        condition: "conditional",
        includeWhen: "When includeNonCompete = true",
        defaultRisk: "medium",
        legalRefs: ["Indian Contract Act, 1872 — S.27"],
        text: `**Non-Compete.**
During the Term and for [NON_COMPETE_PERIOD] months thereafter, the Receiving Party shall not directly or indirectly engage in any business competing with the Disclosing Party within [NON_COMPETE_TERRITORY].

**Enforceability Notice (S.27, Indian Contract Act):** Post-employment non-compete covenants are generally void under Indian law. This clause may be enforceable during the agreement term but its post-termination application is limited. Seek independent legal counsel.`,
    },

    {
        id: "non_solicitation",
        title: "Non-Solicitation",
        category: "BUSINESS_PROTECTION",
        condition: "conditional",
        includeWhen: "When includeNonSolicit = true",
        defaultRisk: "medium",
        legalRefs: ["Indian Contract Act, 1872 — S.27 (more enforceable than non-compete)"],
        text: `**Non-Solicitation.**
During the Term and for [NON_SOLICIT_PERIOD] months thereafter, the Receiving Party shall not directly or indirectly:
(a) solicit or recruit any employee, officer, or consultant of the Disclosing Party;
(b) solicit or divert any customer or client of the Disclosing Party with whom the Receiving Party had contact during this Agreement.`,
    },

    {
        id: "non_circumvention",
        title: "Non-Circumvention",
        category: "BUSINESS_PROTECTION",
        condition: "contextual",
        includeWhen: "Business partnerships, investor deals, or joint ventures",
        defaultRisk: "medium",
        legalRefs: ["Indian Contract Act, 1872 — S.73"],
        text: `**Non-Circumvention.**
The Receiving Party shall not circumvent, avoid, or bypass the Disclosing Party to deal directly with any contacts or business opportunities introduced by the Disclosing Party during or in connection with the Purpose. This obligation applies during the Term and for [NON_CIRCUMVENT_PERIOD] months after termination.`,
    },

    // ═══ 20–21: INTELLECTUAL PROPERTY (Conditional) ═════════════════════════

    {
        id: "ip_assignment",
        title: "Intellectual Property Assignment",
        category: "IP",
        condition: "conditional",
        includeWhen: "When includeIPAssignment = true; vital for employee/contractor NDAs",
        defaultRisk: "high",
        legalRefs: ["Copyright Act, 1957 — S.17, S.18, S.19(4), S.57", "Patents Act, 1970 — S.68"],
        text: `**Intellectual Property Assignment.**
(a) The Receiving Party irrevocably assigns to the Disclosing Party all right, title, and interest in any work product created in connection with the Purpose, including all IP rights, worldwide and in perpetuity.
(b) The Receiving Party waives moral rights under S.57 of the Copyright Act, 1957 to the extent permitted by law.
(c) The Receiving Party shall execute any documents necessary to perfect the Disclosing Party's rights.
(d) For employees, S.17(c) of the Copyright Act applies — copyright in works made during employment vests in the Employer.`,
    },

    {
        id: "no_license",
        title: "No License",
        category: "IP",
        condition: "mandatory",
        includeWhen: "Always",
        defaultRisk: "low",
        legalRefs: ["Copyright Act, 1957 — S.18", "Patents Act, 1970"],
        text: `**No License.**
Nothing in this Agreement grants any rights by license, implied license, estoppel, or otherwise to any Confidential Information or IP of the Disclosing Party, except the limited right to use the Confidential Information for the Purpose.`,
    },

    // ═══ 22–23: DATA & COMPLIANCE ═══════════════════════════════════════════

    {
        id: "data_protection",
        title: "Data Protection",
        category: "DATA_COMPLIANCE",
        condition: "contextual",
        includeWhen: "When personal data or SPDI is involved; recommended for employee/tech NDAs",
        defaultRisk: "medium",
        legalRefs: ["IT Act, 2000 — S.43A", "SPDI Rules, 2011", "DPDP Act, 2023"],
        text: `**Data Protection.**
Where Confidential Information includes Personal Data (DPDP Act, 2023) or SPDI (IT Act, 2000):
(a) The Receiving Party shall comply with all applicable Indian data protection laws;
(b) implement reasonable security practices per S.43A of the IT Act;
(c) not transfer such data outside India except per applicable law; and
(d) immediately notify the Disclosing Party of any data breach.`,
    },

    {
        id: "trade_secrets",
        title: "Trade Secrets",
        category: "DATA_COMPLIANCE",
        condition: "contextual",
        includeWhen: "When trade secrets (formulas, processes, source code) are involved",
        defaultRisk: "high",
        legalRefs: ["Indian Contract Act, 1872 — S.27", "IT Act, 2000 — S.72A"],
        text: `**Trade Secrets.**
Certain Confidential Information constitutes trade secrets. The Receiving Party's obligations with respect to trade secrets shall continue in perpetuity, irrespective of the Term, for so long as such information retains its trade secret character under applicable law.`,
    },

    // ═══ 24–30: STRUCTURAL & SAFETY (Boilerplate) ═══════════════════════════

    {
        id: "severability",
        title: "Severability",
        category: "STRUCTURAL_SAFETY",
        condition: "mandatory",
        includeWhen: "Always",
        defaultRisk: "low",
        legalRefs: ["Indian Contract Act, 1872 — S.24"],
        text: `**Severability.**
If any provision is held invalid or unenforceable, the remaining provisions shall remain in full force. The Parties shall replace the invalid provision with a valid one approximating the original intent.`,
    },

    {
        id: "entire_agreement",
        title: "Entire Agreement",
        category: "STRUCTURAL_SAFETY",
        condition: "mandatory",
        includeWhen: "Always",
        defaultRisk: "low",
        legalRefs: ["Indian Contract Act, 1872 — S.92"],
        text: `**Entire Agreement.**
This Agreement constitutes the entire agreement between the Parties regarding its subject matter and supersedes all prior oral or written agreements, negotiations, and representations.`,
    },

    {
        id: "amendment",
        title: "Amendment",
        category: "STRUCTURAL_SAFETY",
        condition: "mandatory",
        includeWhen: "Always",
        defaultRisk: "low",
        legalRefs: ["Indian Contract Act, 1872 — S.62"],
        text: `**Amendment.**
This Agreement may not be amended except by a written instrument signed by authorized representatives of both Parties.`,
    },

    {
        id: "waiver",
        title: "Waiver",
        category: "STRUCTURAL_SAFETY",
        condition: "mandatory",
        includeWhen: "Always",
        defaultRisk: "low",
        legalRefs: ["Indian Contract Act, 1872 — S.63"],
        text: `**Waiver.**
No failure or delay in exercising any right under this Agreement shall operate as a waiver thereof. All waivers must be in writing and signed by the waiving Party.`,
    },

    {
        id: "assignment",
        title: "Assignment",
        category: "STRUCTURAL_SAFETY",
        condition: "mandatory",
        includeWhen: "Always",
        defaultRisk: "low",
        legalRefs: ["Indian Contract Act, 1872 — S.37"],
        text: `**Assignment.**
Neither Party may assign its rights or obligations without prior written consent, except that either Party may assign in connection with a merger, acquisition, or sale of substantially all assets.`,
    },

    {
        id: "notices",
        title: "Notices",
        category: "STRUCTURAL_SAFETY",
        condition: "mandatory",
        includeWhen: "Always",
        defaultRisk: "low",
        legalRefs: ["IT Act, 2000 — S.13"],
        text: `**Notices.**
All notices shall be in writing and deemed given: (a) when delivered personally; (b) one business day after overnight courier; (c) on receipt if sent by registered post/speed post with acknowledgement due; or (d) on the date sent by email if confirmed by recipient. Notices shall be sent to the addresses stated herein.`,
    },

    {
        id: "counterparts_electronic",
        title: "Counterparts and Electronic Signatures",
        category: "STRUCTURAL_SAFETY",
        condition: "mandatory",
        includeWhen: "Always",
        defaultRisk: "low",
        legalRefs: ["IT Act, 2000 — S.5, S.10A"],
        text: `**Counterparts and Electronic Signatures.**
This Agreement may be executed in counterparts, each deemed an original. Electronic signatures under the IT Act, 2000 shall be valid for all purposes.`,
    },

    // ═══ 31–35: ADVANCED / ENTERPRISE (Optional) ════════════════════════════

    {
        id: "residual_knowledge",
        title: "Residual Knowledge",
        category: "ADVANCED",
        condition: "contextual",
        includeWhen: "Consulting or technical collaborations where knowledge bleeds into general expertise",
        defaultRisk: "low",
        legalRefs: [],
        text: `**Residual Knowledge.**
Nothing prevents the Receiving Party from using general knowledge retained in unaided memory, provided this does not constitute a license to any IP and does not relieve the obligation not to disclose Confidential Information.`,
    },

    {
        id: "audit_rights",
        title: "Audit Rights",
        category: "ADVANCED",
        condition: "contextual",
        includeWhen: "Enterprise contracts, high-value dealings, or regulatory compliance requirements",
        defaultRisk: "medium",
        legalRefs: [],
        text: `**Audit Rights.**
The Disclosing Party may, upon ten (10) business days' written notice, audit the Receiving Party's records and systems to verify compliance with this Agreement, during normal business hours and without unreasonable interference.`,
    },

    {
        id: "limitation_of_liability",
        title: "Limitation of Liability",
        category: "ADVANCED",
        condition: "contextual",
        includeWhen: "Enterprise/vendor NDAs to cap exposure",
        defaultRisk: "medium",
        legalRefs: ["Indian Contract Act, 1872 — S.73, S.74"],
        text: `**Limitation of Liability.**
Except for willful misconduct, fraud, or breach of confidentiality obligations, neither Party shall be liable for indirect, incidental, special, consequential, or punitive damages. This does not limit the right to seek injunctive relief.`,
    },

    {
        id: "force_majeure",
        title: "Force Majeure",
        category: "ADVANCED",
        condition: "contextual",
        includeWhen: "Long-term agreements with ongoing obligations",
        defaultRisk: "low",
        legalRefs: ["Indian Contract Act, 1872 — S.56"],
        text: `**Force Majeure.**
Neither Party shall be liable for failure caused by events beyond reasonable control (acts of God, pandemics, war, government action). The affected Party shall notify the other promptly. If such event continues for 90+ days, either Party may terminate.`,
    },

    {
        id: "independent_contractor",
        title: "Independent Contractor / No Agency",
        category: "ADVANCED",
        condition: "conditional",
        includeWhen: "Contractor/vendor NDAs — clarifies no employment or agency relationship",
        defaultRisk: "low",
        legalRefs: ["Indian Contract Act, 1872 — S.182–S.238"],
        text: `**Independent Contractor.**
Nothing in this Agreement creates a partnership, joint venture, agency, or employer-employee relationship. Each Party is an independent contractor with no authority to bind the other.`,
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

export function getMandatoryClauses(): ClauseDefinition[] {
    return NDA_CLAUSE_LIBRARY.filter((c) => c.condition === "mandatory");
}

export function getConditionalClauses(): ClauseDefinition[] {
    return NDA_CLAUSE_LIBRARY.filter((c) => c.condition === "conditional");
}

export function getContextualClauses(): ClauseDefinition[] {
    return NDA_CLAUSE_LIBRARY.filter((c) => c.condition === "contextual");
}

export function getClauseById(id: string): ClauseDefinition | undefined {
    return NDA_CLAUSE_LIBRARY.find((c) => c.id === id);
}

export function getClausesByCategory(category: ClauseCategory): ClauseDefinition[] {
    return NDA_CLAUSE_LIBRARY.filter((c) => c.category === category);
}

// ─────────────────────────────────────────────────────────────────────────────
// BACKWARD COMPATIBILITY — Legacy STANDARD_CLAUSES used by prompts.ts
// ─────────────────────────────────────────────────────────────────────────────

export const STANDARD_CLAUSES = {
    // Confidentiality framework
    confidentiality_definition_broad: NDA_CLAUSE_LIBRARY.find(c => c.id === "definition_confidential_info")!.text,
    exceptions_standard: NDA_CLAUSE_LIBRARY.find(c => c.id === "exclusions_exceptions")!.text,

    // Obligations by type
    obligations_unilateral: `**Obligations of Receiving Party.**
The Receiving Party agrees to:
(a) keep the Confidential Information strictly confidential and not disclose it to any third party without prior written consent;
(b) use the Confidential Information solely for the Purpose;
(c) limit access to employees, directors, or advisors with a "need to know" bound by equivalent obligations;
(d) use at least the same degree of care as for its own confidential information, but no less than reasonable care;
(e) not reverse engineer, decompile, or disassemble any product embodying the Confidential Information;
(f) promptly notify the Disclosing Party of any unauthorized disclosure.`,

    obligations_mutual: `**Obligations of Parties.**
Each party (as "Receiving Party") agrees to:
(a) maintain confidentiality and not disclose the other party's Confidential Information without prior written consent;
(b) use such Information solely for the Purpose;
(c) restrict access to personnel who require it and are bound by equivalent confidentiality obligations;
(d) protect such Information with at least the same care as its own, being no less than reasonable care;
(e) not reverse engineer any product embodying the other party's Confidential Information;
(f) promptly notify of any unauthorized disclosure.`,

    obligations_employee: `**Obligations of Employee.**
The Employee agrees to:
(a) use Confidential Information solely for the performance of duties for the Employer;
(b) not reverse engineer, decompile, or disassemble any software, formulas, or trade secrets;
(c) maintain strict confidentiality and not disclose to third parties;
(d) act with a duty of loyalty and refrain from actions harmful to the Employer;
(e) return all Confidential Information upon termination of employment.`,

    // Dispute resolution
    remedies_arbitration: NDA_CLAUSE_LIBRARY.find(c => c.id === "arbitration")!.text,
    remedies_court: NDA_CLAUSE_LIBRARY.find(c => c.id === "jurisdiction")!.text,

    // Governing law
    governing_law_india: `**Governing Law and Jurisdiction.**
This Agreement shall be governed by the laws of India. The courts at [JURISDICTION_CITY] shall have exclusive jurisdiction.`,

    governing_law_with_arbitration: `**Governing Law and Jurisdiction.**
This Agreement shall be governed by the laws of India. Subject to the Arbitration clause, courts at [JURISDICTION_CITY] shall have jurisdiction solely for: (a) interim/injunctive relief; and (b) enforcement of arbitral awards.`,

    // Core clauses
    return_of_materials: NDA_CLAUSE_LIBRARY.find(c => c.id === "return_destruction_materials")!.text,
    survival_clause: NDA_CLAUSE_LIBRARY.find(c => c.id === "survival_of_confidentiality")!.text,
    severability: NDA_CLAUSE_LIBRARY.find(c => c.id === "severability")!.text,
    entire_agreement: NDA_CLAUSE_LIBRARY.find(c => c.id === "entire_agreement")!.text,
    waiver: NDA_CLAUSE_LIBRARY.find(c => c.id === "waiver")!.text,
    no_license: NDA_CLAUSE_LIBRARY.find(c => c.id === "no_license")!.text,
    data_protection: NDA_CLAUSE_LIBRARY.find(c => c.id === "data_protection")!.text,

    // Business protection
    non_compete: NDA_CLAUSE_LIBRARY.find(c => c.id === "non_compete")!.text,
    non_solicit: NDA_CLAUSE_LIBRARY.find(c => c.id === "non_solicitation")!.text,
    ip_assignment_strong: NDA_CLAUSE_LIBRARY.find(c => c.id === "ip_assignment")!.text,

    // Employment-specific termination
    termination_employment_nda: `**Term and Termination.**
This Agreement shall remain in force for the duration of the Employee's employment. It is not independently terminable by notice. Upon termination of employment, confidentiality obligations and restrictive covenants survive per the Survival clause.`,

    termination_general_nda: `**Term and Termination.**
This Agreement shall remain in effect for [TERM] from the Effective Date. Either party may terminate by providing [NOTICE_PERIOD] days' prior written notice. Termination shall not affect: (a) accrued rights; (b) confidentiality obligations per the Survival clause; or (c) provisions intended to survive.`,
};
