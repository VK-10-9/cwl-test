import type { DocumentType, OrganisationData, BlueprintClause } from "@/types";
import { DOCUMENT_TYPE_LABELS } from "@/types";
import { getTemplate } from "@/lib/templates";
import { STANDARD_CLAUSES, NDA_CLAUSE_LIBRARY } from "@/lib/clause-library";

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
**NDA-Specific Rules (India-Centric, 35-Clause Library):**

**Legal Framework:** Indian Contract Act 1872, Arbitration and Conciliation Act 1996, IT Act 2000, Copyright Act 1957, Companies Act 2013, DPDP Act 2023, SPDI Rules 2011, Specific Relief Act 1963.

**CLAUSE CATEGORIES (generate clauses from ALL relevant categories):**
1. CORE STRUCTURAL (1–4): Title, Parties, Recitals, Purpose — ALWAYS include, HIGH risk for Parties and Purpose.
2. CONFIDENTIALITY (5–7): Definition of CI, Exclusions, Obligations — ALWAYS include, ALL HIGH risk.
3. TERM & SURVIVAL (8–10): Term, Survival, Termination — ALWAYS include, Survival is HIGH risk.
4. PROTECTIVE (11–13): Return/Destruction, Remedies (injunctive relief), Indemnity — 11-12 mandatory, 13 contextual.
5. DISPUTE & LEGAL (14–16): Governing Law, Jurisdiction or Arbitration — 14 mandatory, 15-16 conditional on disputeResolution.
6. BUSINESS PROTECTION (17–19): Non-Compete, Non-Solicitation, Non-Circumvention — ALL conditional on form toggles.
7. IP (20–21): IP Assignment, No License — 20 conditional on includeIPAssignment, 21 mandatory.
8. DATA & COMPLIANCE (22–23): Data Protection (DPDP/IT Act), Trade Secrets — contextual.
9. STRUCTURAL SAFETY (24–30): Severability, Entire Agreement, Amendment, Waiver, Assignment, Notices, E-Signatures — ALWAYS include, LOW risk.
10. ADVANCED/ENTERPRISE (31–35): Residual Knowledge, Audit Rights, Limitation of Liability, Force Majeure, Independent Contractor — contextual.

**DISCLOSURE TYPE RULES:**
- If disclosureType is "Mutual", ALL obligations must be reciprocal (both parties are Disclosing AND Receiving).
- If disclosureType is "Unilateral", obligations fall on the Receiving Party only.

**CRITICAL RISK RULES:**
- Definition of "Confidential Information" is the MOST CRITICAL clause — mark as HIGH risk.
- Non-compete clauses are generally unenforceable post-employment in India (S.27, Indian Contract Act) — flag this.
- ALWAYS include: Return/Destruction of Materials, Survival period, Remedies (injunctive relief).

**CONDITIONAL CLAUSE TOGGLES:**
- includeNonCompete → Non-Compete (S.27 enforceability notice required)
- includeNonSolicit → Non-Solicitation
- includeIPAssignment → IP Assignment with moral rights waiver (Copyright Act S.57)
- includeNonCircumvent → Non-Circumvention (for business/investor relationships)
- includeIndemnity → Indemnity clause (S.124-125, Indian Contract Act)
- includeDataProtection → Data Protection (DPDP Act 2023, IT Act S.43A)
- includeTradeSecrets → Trade Secrets (perpetual obligations)
- includeAuditRights → Audit Rights (enterprise/regulatory compliance)
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
    "offer-letter": `
**Offer Letter-Specific Rules (Indian Startup Context):**
- This is a PRE-APPOINTMENT document — it's an offer, not the final appointment.
- CTC breakdown must follow Indian payroll norms: Basic, HRA, Special Allowance, PF (employer + employee), Gratuity.
- Basic salary should be minimum 40-50% of CTC for optimal PF/Gratuity calculation.
- Probation period clause is MEDIUM risk — must clearly state confirmation process.
- Notice period during probation is typically shorter (15 days vs. 1-3 months post-confirmation).
- Mention that appointment letter will follow on joining — this is standard practice.
- If ESOP is mentioned, state it's subject to ESOP plan terms (don't detail full vesting here).
- Offer validity deadline is HIGH risk — must be specific (date, not "soon").
- Reference background verification requirement upfront.
- Don't include detailed policies — just reference that company policies apply.
`,
    "appointment-letter": `
**Appointment Letter-Specific Rules (Indian Labour Law Compliance):**
- This is the DEFINITIVE employment document — must be comprehensive and legally compliant.
- CTC breakdown is HIGH risk — must be accurate and match offer letter.
- Applicable laws: Industrial Disputes Act 1947, Shops & Establishments Act (state-specific), Employees' PF Act 1952, Payment of Gratuity Act 1972, Payment of Bonus Act 1965.
- Probation clause must specify: duration, notice during probation, conditions for confirmation.
- Notice period: Must be clear and reasonable. During probation typically 15-30 days.
- IP Assignment clause is HIGH risk for startups — all work product must belong to company.
- Confidentiality clause should survive termination.
- Non-compete: Note S.27 Indian Contract Act — post-employment non-compete is unenforceable. During-employment restraints are valid.
- Reference company policies (leave, code of conduct) rather than embedding full text.
- Mandatory: PF, ESI (if applicable), Gratuity, Professional Tax deduction notices.
`,
    "relieving-letter": `
**Relieving Letter-Specific Rules:**
- This is an ATTESTATION document — must be issued on the last working date or within 2 days.
- Factual accuracy is paramount — incorrect dates or designation can cause legal issues.
- Must clearly state: employee name, designation, date of joining, last working date.
- Resignation acceptance must be confirmed — reference resignation date.
- Notice period status: Whether served in full, bought out, or waived.
- Clearance: State whether all dues are settled or "subject to final settlement."
- Conduct remark: Keep it positive or neutral. Avoid anything that could be seen as defamatory.
- If combining with experience certificate: Add detailed role, responsibilities, and performance.
- Post-employment NDA reminder: If NDA was signed, reference ongoing obligations.
- Signatory: Must be authorized — typically HR Head or Director. Include designation.
`,
    "payment-reminder": `
**Payment Reminder-Specific Rules (Indian Commercial Context):**
- Tone escalation is critical: First = friendly, Second = firm, Final = legal warning.
- ALWAYS reference specific invoice number, date, amount, and services — vague reminders are ignored.
- First reminder: Professional, assume oversight.
- Second reminder: Reference previous communication, state urgency, mention potential consequences.
- Final notice: Reference contractual late payment terms, applicable interest (S.3, Interest Act 1978), and warn about legal proceedings.
- For cheque bounce: Reference S.138 Negotiable Instruments Act — 30 days statutory notice MANDATORY.
- Include clear payment instructions (bank details, UPI) — make it easy to pay.
- If late payment interest applies: Calculate and state the accrued amount.
- Reference the underlying contract/PO for legitimacy.
- MSME vendors: Reference MSMED Act 2006 provisions for delayed payments (S.15-16).
`,
    "esop-grant": `
**ESOP Grant Letter-Specific Rules (Indian Startup ESOP Framework):**
- Legal framework: Companies Act 2013 (S.62(1)(b), Rule 12 of Companies (Share Capital) Rules 2014).
- Board resolution approving ESOP pool is a PREREQUISITE — reference resolution date.
- Vesting schedule is the MOST CRITICAL section — must be crystal clear.
- Standard startup vesting: 4 years, 1-year cliff, monthly/quarterly thereafter.
- Exercise price: For startups, often at face value (₹10) or at a discount to FMV.
- Tax implications (HIGH risk — employees MUST understand):
  - Perquisite tax at exercise: FMV minus Exercise Price (S.17(2), Income Tax Act).
  - Capital gains at sale: Sale price minus FMV at exercise.
  - Startup exemption: S.80-IAC eligible startups can defer perquisite tax 5 years or until exit (whichever is earlier).
- Exercise window post-termination: Critical for departing employees — 90 days is standard.
- Accelerated vesting: Single trigger (acquisition) vs. double trigger (acquisition + termination).
- Transfer restrictions: Options are non-transferable. Shares post-exercise may have ROFR.
- Reference the master ESOP plan for detailed terms — grant letter is a summary.
`,
    "share-allotment": `
**Share Allotment Letter-Specific Rules (Companies Act 2013 Compliance):**
- Legal framework: Companies Act 2013 (S.39, S.42, S.56, S.62), Companies (Share Capital) Rules 2014.
- Board resolution is MANDATORY — reference resolution date and number.
- For private placements: S.42 compliance required (offer letter, PAS-4 filing).
- Form PAS-3 (Return of Allotment): Must be filed with MCA within 15 days of allotment.
- Share certificate: Must be issued within 2 months of allotment (S.56(4)).
- For CCPS/CCD: Specify conversion terms, anti-dilution protection, and liquidation preference if applicable.
- Sweat equity: Must comply with S.54 and Rule 8 — valuation by registered valuer required.
- ESOP exercise: Reference original ESOP grant, exercise form, and payment confirmation.
- Pre-emption rights (ROFR): Common in shareholder agreements — check and reference.
- Stamp duty: Applicable on share certificates (varies by state).
- Securities premium: Ensure premium is properly accounted in Securities Premium Account.
`,
    "legal-notice": `
**Legal Notice-Specific Rules (Indian Legal Framework):**
- Legal notices must be sent through a registered advocate for maximum impact — include advocate details.
- For S.80 CPC (government bodies): 60 days notice is MANDATORY before filing suit. Non-compliance = suit dismissed.
- For S.138 NI Act (cheque bounce): 30 days notice is MANDATORY after dishonour.
- Factual background must be PRECISE — dates, amounts, reference numbers.
- Demand must be SPECIFIC — exact amount, exact action, exact deadline.
- Always reference specific legal provisions that support your claim.
- Consequences must be stated: civil suit, criminal complaint, arbitration, specific performance.
- Mode of sending: Registered Post with AD (acknowledgement due) is standard — proves delivery.
- "Under instructions from my client" — standard opening when sent through advocate.
- Reservation of all rights — standard closing. Never waive future claims.
- Keep the tone firm but professional — avoid threats or personal attacks.
`,
    "breach-notice": `
**Breach Notice-Specific Rules:**
- A breach notice is a CONTRACTUAL REMEDY — it triggers the cure period defined in the contract.
- Reference the EXACT clause number(s) violated — vague references weaken the notice.
- Describe the breach factually: what obligation was breached, when, how.
- Cure period: Must match the contractual cure period. If contract specifies 30 days, don't demand 7.
- Consequences of failure to cure: Termination rights, damages claims, suspension of obligations.
- Previous communications: Reference all prior attempts to resolve — shows good faith.
- Material breach vs. minor breach: Material breach allows termination; minor breach allows damages claim.
- If contract has liquidated damages clause: Reference the specific contractual penalty.
- Don't claim damages you can't prove — be realistic.
- Reservation of rights: Sending a breach notice doesn't waive the right to terminate or sue.
`,
    loi: `
**Letter of Intent-Specific Rules (Indian Deal-Making Context):**
- Most LOIs are NON-BINDING except for confidentiality, exclusivity, and governing law clauses.
- CLEARLY mark which clauses are binding and which are non-binding — ambiguity is HIGH risk.
- Deal terms: Must be specific enough to form the basis of definitive agreements (SHA, SPA, SSA).
- For investment LOIs: Include valuation, instrument (equity/CCPS/CCD), board seats, investor rights overview.
- Exclusivity period: Standard is 30-60 days. Binding clause — prevent the target from shopping the deal.
- Due diligence: Specify scope, timeline, and who bears costs.
- Conditions precedent: List clearly — satisfactory DD, board approvals, regulatory clearances (SEBI, CCI, RBI).
- Break fee: Optional but powerful — compensates for opportunity cost if deal falls through.
- Expiry: LOIs must have a clear expiry date (typically 30-90 days).
- For M&A: Reference that definitive agreement (SPA/SHA) will supersede the LOI.
- Startup-specific: Angel investors may use LOI as a "term sheet light" — ensure it captures key terms.
`,
    "vendor-onboarding": `
**Vendor Onboarding Letter-Specific Rules:**
- This functions as a mini-contract — it should be comprehensive enough to govern the engagement.
- Scope of work is HIGH risk — vague SOW leads to disputes. Be specific about deliverables, timelines, milestones.
- Payment terms: Tie to deliverables or milestones where possible. Include invoice process.
- GST compliance: Require valid GSTIN-based invoices for Input Tax Credit claiming (S.16, CGST Act 2017).
- TDS: Reference TDS obligations (S.194C/194J/194H IT Act) — deducted at source.
- IP assignment: ALL deliverables must belong to the company — critical for startups.
- Confidentiality: Essential for all vendors handling sensitive data or code.
- SLA: Define measurable metrics — response time, uptime, quality standards.
- Termination: Include both convenience termination (30 days notice) and for-cause termination.
- Indemnification: Vendor should indemnify for IP infringement, data breaches, and non-compliance.
- For freelancers: Clearly establish independent contractor status (not employment) to avoid PF/ESI obligations.
`,
    "startup-india": `
**Startup India Letter-Specific Rules (DPIIT & Regulatory Context):**
- Startup India recognition is granted by DPIIT (Department for Promotion of Industry and Internal Trade).
- Eligibility: Entity < 10 years old, turnover < ₹100 Cr in any FY, working towards innovation/development/improvement.
- Entity must be incorporated as Pvt Ltd, LLP, or Partnership Firm (sole proprietorships don't qualify).
- For DPIIT recognition: Include CIN/LLPIN, nature of innovation, and how it's differentiated from existing products/services.
- Tax benefits (S.80-IAC): 3 consecutive years of tax holiday out of first 10 years. Requires Inter-Ministerial Board certification.
- Angel tax exemption (S.56(2)(viib)): DPIIT-recognized startups with aggregate paid-up share capital < ₹25 Cr are exempt.
- Self-certification under Labour & Environment laws: Valid for 3 years from incorporation.
- Fund of Funds (SIDBI): Available through SEBI-registered VCs that receive FoF allocation.
- Include proper declarations: Not formed by splitting up existing business, not involved in restricted sectors.
- Reference required documents: Certificate of Incorporation, PAN, Audited Financials, Business Plan/Pitch.
`,
    "gst-bank-letter": `
**GST / Bank Letter-Specific Rules (Indian Regulatory Compliance):**
- For GST Registration: Provide PAN, address proof, photo of premises, board resolution, signatory authorization.
- GST registration is mandatory if annual turnover > ₹20L (₹10L for NE states) or if doing inter-state supply.
- For Current Account Opening: Banks require KYC docs — Certificate of Incorporation, MOA/AOA, PAN, Board Resolution appointing authorized signatory.
- RBI guidelines: Companies with turnover < ₹50 Cr — one current account. Above ₹50 Cr — cash credit facility required.
- Address proof for GST: Rent agreement + NOC from landlord (if rented), or ownership proof.
- Board resolution: Required for authorizing bank/GST operations — include resolution date and signatory details.
- For MSME registration (Udyam): Can be self-declared online at udyamregistration.gov.in.
- HSN/SAC codes: Include if known — helps with correct GST rate classification.
- All declarations should include "under penalty of perjury" or equivalent legal affirmation.
- Reference all enclosed documents at the end of the letter.
`,
    "co-founder-agreement": `
**Co-Founder Agreement-Specific Rules (Indian Startup Context):**
- This is the MOST CRITICAL document for any multi-founder startup — disputes between co-founders kill more startups than market failure.
- Legal framework: Indian Contract Act 1872, Companies Act 2013, Indian Partnership Act 1932 (if partnership).
- Equity split is HIGH risk — must be clearly documented with rationale. Avoid 50-50 splits (deadlock risk).
- REVERSE VESTING is essential: Even though founders already "own" shares, a vesting schedule ensures departing founders don't walk away with full equity. Typically 4 years, 1-year cliff.
- Buyback mechanism: Define what happens to unvested shares — company buyback at face value or FMV? ROFR?
- IP Assignment is HIGH risk: ALL pre-existing IP and future IP created by founders MUST be assigned to the company entity. Without this, investors will walk.
- Decision-making must be clearly defined: Board-level vs. operational. Define "reserved matters" requiring unanimous consent (fundraising, equity changes, key hires, pivots, asset sales).
- Deadlock resolution: Critical for 50-50 or 2-founder companies. Mediation → Arbitration → Shotgun clause.
- Non-compete during association is enforceable. Post-exit non-compete: Note S.27, Indian Contract Act — generally unenforceable but include with reasonableness caveat.
- Good leaver vs. Bad leaver: Good leaver (death, disability, mutual agreement) keeps vested equity. Bad leaver (breach, misconduct, competing) forfeits at face value.
- Drag-along / Tag-along: Include for investor fundraising readiness.
- ROFR (Right of First Refusal): Founders cannot sell shares without offering to other founders first.
`,
    "board-resolution": `
**Board Resolution-Specific Rules (Companies Act 2013 Compliance):**
- Legal framework: Companies Act 2013 (S.173-175, S.179, S.188), Companies (Meetings of Board) Rules 2014.
- Quorum: Minimum 2 directors or 1/3rd of total directors, whichever is higher (S.174).
- Circular resolution (S.175): Can be passed without meeting if approved by majority of directors entitled to vote. NOT valid for certain matters (related party transactions, loans, investments in other bodies corporate).
- Board meetings: Minimum 4 per year, gap not exceeding 120 days (S.173).
- Video conference: Allowed for board meetings (Rule 3, Companies (Meetings) Rules 2014). Some matters require physical presence.
- Minutes must be recorded within 30 days (S.118). Maintained at registered office.
- For bank-related resolutions: Include authorized signatory details, specimen signature requirements, and transaction limits.
- For ESOP resolutions: Must comply with S.62(1)(b), define ESOP pool %, exercise price basis, and vesting terms.
- For share allotment: Reference S.42 (private placement) or S.62 (preferential allotment). Include Form PAS-3 filing requirement.
- For director changes: File Form DIR-12 within 30 days (S.170).
- Resolution types: Ordinary Resolution (simple majority) vs. Special Resolution (75% majority). Some matters are board-level only.
- ALWAYS include: Company name, CIN, registered office, meeting details, quorum confirmation, resolution text with "RESOLVED THAT" format, authorization clause.
`,
    "termination-letter": `
**Termination Letter-Specific Rules (Indian Labour Law):**
- Legal framework: Industrial Disputes Act 1947 (for workmen), Shops & Establishments Act (state-specific), Indian Contract Act 1872.
- Termination must be for documented cause — arbitrary termination exposes the company to wrongful termination claims.
- Performance-based: Must reference prior PIP (Performance Improvement Plan), review dates, and specific failures. Without documentation, termination is challengeable.
- Misconduct: Must follow principles of natural justice — show cause notice, opportunity to be heard, enquiry (if applicable), and then termination order.
- Probation failure: Simpler process — reference appointment letter terms, state performance gaps, and terminate with notice.
- Redundancy: Retrenchment provisions apply for "workmen" under ID Act — last-in-first-out, retrenchment compensation (15 days' average pay per year of service).
- Notice period: Must match appointment letter terms. Pay-in-lieu allowed if contractually provided.
- Final settlement: Must include pending salary, earned leave encashment, proportionate bonus, gratuity (if eligible — 5 years continuous service under Payment of Gratuity Act 1972).
- Gratuity: Mandatory after 5 years — 15 days' last drawn salary for each year of service (S.4, Payment of Gratuity Act 1972).
- Company property return: Laptop, access cards, data, documents — provide specific list.
- Post-employment obligations: Reference existing NDA, IP assignment, non-disparagement.
- Right to appeal: Good practice — state internal grievance mechanism.
- Tone: Firm but respectful. Never include personal remarks or unprofessional language.
`,
    "consultancy-agreement": `
**Consultancy Agreement-Specific Rules (Indian Contract & Tax Law):**
- Legal framework: Indian Contract Act 1872, Income Tax Act 1961 (S.194C/194J), GST provisions.
- CRITICAL distinction: Consultant is an INDEPENDENT CONTRACTOR, not an employee. If misclassified, company faces PF/ESI liability, labour law compliance, and tax penalties.
- Indicators of independent contractor: Controls own schedule, uses own tools, works for multiple clients, bears own expenses, no recurring salary.
- Scope of work is HIGH risk — vague SOW leads to scope creep and disputes. Define deliverables, milestones, acceptance criteria.
- TDS compliance is MANDATORY:
  - S.194J: 10% TDS on professional/technical services (for individuals exceeding ₹30,000/year).
  - S.194C: 1% (individual/HUF) or 2% (company/firm) on contractor payments exceeding ₹30,000 per payment or ₹1,00,000/year aggregate.
- GST: If consultant's turnover > ₹20L, they must issue GST invoice. Reverse charge may apply for specified services.
- IP Assignment is CRITICAL for startups — all deliverables (code, designs, documents) must be assigned to the company. Work-for-hire doctrine in India is narrow (Copyright Act S.17(c) only covers employer-employee).
- Confidentiality: Must survive termination. Define what's confidential — code, business plans, client data, strategies.
- Non-solicitation: Enforceable during and for reasonable period after engagement.
- Non-compete during engagement: Enforceable. Post-engagement: Likely unenforceable (S.27, Indian Contract Act) but include with narrow scope.
- Termination: Include both convenience (with notice) and for-cause (immediate) termination rights for both parties.
- Payment on termination: Pro-rata for work completed, within 30 days of final invoice.
`,
    "service-agreement": `
**Service Agreement-Specific Rules (Indian Commercial Law):**
- Legal framework: Indian Contract Act 1872, IT Act 2000 (for digital services), DPDP Act 2023 (data handling), Consumer Protection Act 2019.
- This functions as the PRIMARY commercial agreement for SaaS, IT services, and managed services companies.
- Service Description must be EXHAUSTIVE — include features, scope, exclusions, service hours, and support tiers. Ambiguity here is the #1 source of disputes.
- SLA (Service Level Agreement) is HIGH risk for service/SaaS companies:
  - Define measurable metrics: uptime %, response time, resolution time, performance benchmarks.
  - Include SLA credits: Specify compensation for SLA failures (e.g., pro-rata service credits, not cash refunds).
  - Exclusions: Planned maintenance, force majeure, customer-caused issues.
- Pricing & Payment:
  - For SaaS: Clearly state subscription period, auto-renewal terms, price increase mechanism.
  - GST: Must be charged separately on invoices. Include SAC code for service classification.
  - Late payment interest: Include contractual rate (typically 1.5% per month).
- Data Protection (CRITICAL for SaaS):
  - Reference DPDP Act 2023 (Digital Personal Data Protection) — applicable if processing Indian personal data.
  - IT Act S.43A + SPDI Rules 2011 — "reasonable security practices" for sensitive data.
  - Data ownership: Customer retains ownership of their data. Service provider is a "data processor."
  - Data portability and deletion: Customer can export data and request deletion on termination.
- Limitation of liability: Standard is capped at total fees paid in last 12 months. NEVER accept unlimited liability.
  - Carve-outs: Breach of confidentiality, IP infringement, willful misconduct — typically subject to higher cap or uncapped.
- IP clause: Pre-existing IP retained by creator. Custom deliverables assigned to customer. Platform/SaaS IP remains with provider.
- Termination: Include both convenience (30-60 days notice) and for cause. Data migration period (30-90 days) after termination.
`,
    "ip-assignment": `
**IP Assignment Agreement-Specific Rules (Indian IP Law):**
- Legal framework: Copyright Act 1957, Patents Act 1970, Trademarks Act 1999, Trade Secrets (common law + IT Act 2000), Indian Contract Act 1872.
- This is arguably the MOST IMPORTANT agreement for early-stage startups — without it, the company doesn't actually own its core IP.
- Pre-incorporation IP: Founders often build the initial product before incorporating. This IP MUST be formally assigned post-incorporation. Without this, investors will not invest.
- Copyright assignment: Must be in writing (S.19, Copyright Act 1957). Must specify work, rights, duration, territory, and consideration.
- Work-for-hire: Under Indian law (S.17(c), Copyright Act), employer owns copyright ONLY for works created under a "contract of service" (employment). Works by contractors/freelancers require explicit assignment.
- Moral rights (S.57, Copyright Act): Author's right to attribution and to prevent distortion. CANNOT be fully waived in India — but can be contractually managed (e.g., author agrees not to exercise moral rights).
- Patent assignment: Must be registered with the Patent Office (S.68, Patents Act 1970). Assignment must be in writing.
- Consideration: Essential for valid assignment under Indian Contract Act. Can be nominal (₹1) but must exist. Equity/ESOP can constitute consideration.
- Warranties: Assignor must warrant: (a) IP is original, (b) no third-party claims, (c) no existing licenses/encumbrances, (d) full authority to assign.
- Further assurance: Assignor commits to executing any future documents needed to perfect the transfer (e.g., patent filings, copyright registrations).
- Non-assertion: Assignor agrees not to assert any retained rights against the company.
- Source code handover: For software IP — include all source code, repositories, documentation, access credentials, and build instructions.
- Due diligence: Investors WILL check IP ownership chain. A clean IP assignment is table stakes for fundraising.
`,
    "experience-letter": `
**Experience Letter-Specific Rules:**
- This is an ATTESTATION document — issued to departing employees confirming their employment history.
- Must be issued on company letterhead with proper formatting.
- Format: "To Whom It May Concern" — designed for future employers and third parties.
- Factual accuracy is paramount — incorrect dates, designation, or tenure can cause legal issues for both parties.
- Must include: Employee's full name, employee ID (if applicable), all designations held, date of joining, last working date.
- Responsibilities: Should be detailed enough to give future employers a clear picture of the employee's role.
- Performance remark: Keep positive or neutral. Never include defamatory remarks — exposes company to legal liability.
- If employee was promoted during tenure: List all designations chronologically with dates.
- Skills section: Optional but valuable — list domain expertise, tools, leadership capabilities.
- Projects section: Optional — highlight key contributions without revealing confidential details.
- Signatory: Must be authorized — typically HR Head, Director, or CEO. Include designation and company stamp.
- Close with best wishes for future endeavours — standard professional courtesy.
- This is NOT a relieving letter (which confirms resignation acceptance and clearance). Experience letter focuses on role and performance.
`,
    "internship-letter": `
**Internship Offer Letter-Specific Rules (Indian Startup Context):**
- Distinction from full-time offer: This is a LIMITED-PERIOD engagement, usually for students or early-career professionals.
- Stipend is the norm — not salary. Stipends below ₹2,50,000/year are typically not taxable for the intern.
- For college interns: Reference the academic institution if applicable. Some colleges require a formal internship agreement.
- Project scope must be SPECIFIC — vague internship offers lead to poor outcomes. Define project, deliverables, learning objectives.
- Mentor assignment: Every intern should have a named mentor/reporting manager. This is critical for intern experience.
- Duration: Typically 1-6 months for startups. 2-3 months is standard for summer internships.
- PPO (Pre-Placement Offer): If eligible, state the criteria clearly — performance evaluation, project completion, team fit.
- Confidentiality: Required even for interns — they will access company code, data, and strategies.
- IP assignment: CRITICAL for startups — any code, designs, or work product by interns belongs to the company.
- Working hours should respect labour laws — generally 8 hours/day, 5-6 days/week.
- Certificate: Promise of completion certificate is standard and expected.
- For remote interns: Specify equipment responsibility, communication tools, and availability expectations.
- Termination: Either party can terminate with 7 days notice. For misconduct, immediate termination.
- Tone: Welcoming and enthusiastic — but professional. Startups should sell the learning opportunity.
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
