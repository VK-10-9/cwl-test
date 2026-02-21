"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import type { DocumentType, FormFieldDefinition } from "@/types";
import { getTemplate } from "@/lib/templates";
import { FormField } from "./FormField";
import FormAssistant from "./FormAssistant";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateFormSchema, generateDefaultValues } from "@/lib/form-schema";
import { useMemo, useCallback } from "react";
import { Building2, Users, FileText, Loader2, Sparkles } from "lucide-react";

interface DetailsFormProps {
    docType: DocumentType;
    onSubmit: (data: Record<string, string | number | boolean>) => void;
    isLoading: boolean;
}

export default function DetailsForm({ docType, onSubmit, isLoading }: DetailsFormProps) {
    const template = getTemplate(docType);

    const schema = useMemo(() => generateFormSchema(template), [template]);
    const defaultValues = useMemo(() => generateDefaultValues(template), [template]);

    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues,
    });

    const errorCount = Object.keys(errors).length;

    // Live form data for the assistant
    const watchedData = watch();
    const currentFormData = useMemo(() => {
        const cleaned: Record<string, string | number | boolean> = {};
        for (const [key, value] of Object.entries(watchedData)) {
            if (value === undefined || value === null) continue;
            if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
                cleaned[key] = value;
            }
        }
        return cleaned;
    }, [watchedData]);

    // Handler for bot-applied fields
    const handleBotApplyFields = useCallback((fields: Record<string, string | number | boolean>) => {
        Object.entries(fields).forEach(([key, value]) => {
            setValue(key, value, { shouldValidate: true, shouldDirty: true });
        });
    }, [setValue]);

    // --- Dummy Data Helper ---
    const fillDummyData = () => {
        const common: Record<string, string | boolean> = {
            effectiveDate: new Date().toISOString().split("T")[0],
            governingLaw: "India",
            jurisdiction: "Bangalore",
        };

        // Only add party fields for two-party templates
        if (template.isTwoParty) {
            common.partyA_name = "Acme Corp Pvt Ltd";
            common.partyA_type = "company";
            common.partyA_address = "123 Tech Park, Whitefield, Bangalore, KA 560066";
            common.partyA_signatory = "Rajesh Kumar";
            common.partyB_name = "Vikram Mehta";
            common.partyB_type = "individual";
            common.partyB_address = "456 Palm Grove, Indiranagar, Bangalore, KA 560038";
            common.partyB_signatory = "Vikram Mehta";
        }

        const perType: Record<string, Record<string, string | boolean>> = {
            nda: {
                relationshipType: "employee",
                disclosureType: "unilateral",
                purpose: "Evaluation of potential employment and handling of proprietary software code.",
                duration: "2-years",
                confidentialityDuration: "5",
                disputeResolution: "arbitration",
                includeNonCompete: true,
                includeNonSolicit: true,
                includeIPAssignment: true,
                includeNonCircumvent: false,
                includeIndemnity: true,
                includeDataProtection: true,
                includeTradeSecrets: true,
                includeAuditRights: false,
            },
            mou: {
                mouType: "joint-venture",
                relationshipContext: "corp-corp",
                jurisdiction: "Bangalore",
                startDate: new Date().toISOString().split("T")[0],
                duration: "2-years",
                renewalTerms: "auto-renew",
                disputeResolution: "arbitration",
                purpose: "Joint development of an AI-powered healthcare analytics platform for rural India.",
                specificObjectives: "1. Develop a working prototype within 6 months.\n2. Pilot the platform in 3 rural clinics within 12 months.\n3. Publish 2 joint research papers on AI in healthcare.",
                responsibilitiesA: "Provide technical infrastructure, engineering resources (3 full-time developers), and cloud hosting. Lead product development and technical architecture.",
                responsibilitiesB: "Contribute domain expertise, clinical data access, regulatory guidance, and on-ground coordination with healthcare facilities.",
                keyPersonnelA: "Dr. Rajesh Kumar (CTO), Anita Singh (Lead Engineer)",
                keyPersonnelB: "Dr. Meera Patel (Medical Director), Vikram Mehta (Project Coordinator)",
                includeConfidentiality: true,
                includeNonCompete: false,
                includeIPClause: true,
                includeDataProtection: true,
                includeForceMajeure: true,
                financialTerms: "Total budget of INR 50,00,000 — split 60/40 between Party A and Party B respectively. Quarterly disbursements based on milestone completion.",
                budgetCap: "₹50,00,000",
                terminationNotice: "60-days",
                terminationConditions: "Material breach of obligations, failure to meet 2 consecutive milestones, mutual written agreement, or insolvency of either party.",
                reportingSchedule: "quarterly",
                steeringCommittee: "Comprising 2 senior members from each party, meeting quarterly to review progress, approve budgets, and resolve disputes.",
                exclusivity: "exclusive-area",
                publicationRights: "academic-allowed",
            },
            "offer-letter": {
                candidateName: "Priya Sharma",
                candidateAddress: "456 Palm Grove, Indiranagar, Bangalore 560038",
                designation: "Senior Software Engineer",
                department: "Engineering",
                reportingTo: "Rajesh Kumar, VP Engineering",
                joiningDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
                ctcAnnual: "₹18,00,000",
                ctcBreakdown: "Basic: ₹7,50,000 | HRA: ₹3,00,000 | Special Allowance: ₹4,50,000 | PF (Employer): ₹1,80,000 | Gratuity: ₹1,20,000",
                employmentType: "full-time",
                probationPeriod: "6-months",
                noticePeriod: "2-months",
                workLocation: "Bangalore (Hybrid — 3 days office, 2 WFH)",
                offerValidUntil: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
                includeEsop: true,
                includeRelocation: false,
                includeJoiningBonus: true,
                joiningBonusAmount: "₹1,00,000",
                additionalTerms: "Offer is subject to successful background verification and submission of academic credentials.",
            },
            "appointment-letter": {
                employeeName: "Vikram Mehta",
                employeeAddress: "789 Lake View Apartments, Koramangala, Bangalore 560034",
                designation: "Product Manager",
                department: "Product",
                dateOfJoining: new Date().toISOString().split("T")[0],
                ctcAnnual: "₹24,00,000",
                ctcBreakdown: "Basic: ₹10,00,000 | HRA: ₹4,00,000 | Special Allowance: ₹5,60,000 | PF (Employer): ₹2,40,000 | Gratuity: ₹2,00,000",
                probationPeriod: "6-months",
                noticePeriod: "2-months",
                workLocation: "Bangalore, Karnataka",
                workingHours: "9:30 AM – 6:30 PM, Monday to Friday",
                leavePolicy: "24 Paid Leaves + 12 Public Holidays + 5 Sick Leaves",
                includeNDA: true,
                includeNonCompete: false,
                includeIPAssignment: true,
                includeCodeOfConduct: true,
                additionalTerms: "Medical insurance coverage for self and family (₹5L cover). Annual performance bonus of up to 15% of CTC.",
            },
            "relieving-letter": {
                employeeName: "Anita Singh",
                employeeId: "EMP-2022-018",
                designation: "Senior Backend Engineer",
                department: "Engineering",
                dateOfJoining: "2022-03-15",
                lastWorkingDate: new Date().toISOString().split("T")[0],
                resignationDate: new Date(Date.now() - 60 * 86400000).toISOString().split("T")[0],
                exitReason: "resignation",
                noticePeriodServed: "full",
                clearanceStatus: "cleared",
                conductRemark: "excellent",
                includeExpCert: true,
                includeNDAReminder: true,
            },
            "payment-reminder": {
                recipientName: "Zenith Solutions Pvt Ltd",
                recipientAddress: "42 MG Road, Connaught Place, New Delhi 110001",
                contactPerson: "Mr. Rahul Verma, Accounts Payable",
                invoiceNumber: "INV-2025-0042",
                invoiceDate: new Date(Date.now() - 45 * 86400000).toISOString().split("T")[0],
                invoiceAmount: "₹3,50,000",
                originalDueDate: new Date(Date.now() - 15 * 86400000).toISOString().split("T")[0],
                reminderLevel: "second",
                paymentMethod: "NEFT to Account: 50200012345678, IFSC: HDFC0001234, Payee: Acme Corp Pvt Ltd",
                serviceDescription: "Web development services for Project Phoenix (Phase 2) — delivered on 15-Jan-2025. Includes UI redesign, API integration, and QA testing.",
                includeInterest: true,
                interestRate: "18%",
                includeLegalNotice: false,
            },
            "esop-grant": {
                employeeName: "Priya Sharma",
                employeeId: "EMP-2023-042",
                designation: "Lead Engineer",
                grantDate: new Date().toISOString().split("T")[0],
                numberOfOptions: "10,000",
                exercisePrice: "₹10",
                currentFMV: "₹250",
                vestingSchedule: "4y-1c-monthly",
                exerciseWindow: "90-days",
                esopPlanName: "Acme Corp ESOP 2024",
                boardResolutionDate: "2024-06-15",
                includeAcceleration: true,
                includeTaxNote: true,
                additionalTerms: "Options are subject to the terms and conditions of the Acme Corp ESOP 2024 plan document.",
            },
            "share-allotment": {
                allotteeName: "Seed Ventures LLP",
                allotteeAddress: "101 Venture Tower, Bandra Kurla Complex, Mumbai 400051",
                allotteeType: "angel",
                numberOfShares: "50,000",
                shareType: "ccps",
                faceValue: "₹10",
                premiumPerShare: "₹490",
                totalConsideration: "₹25,00,000",
                allotmentDate: new Date().toISOString().split("T")[0],
                boardResolutionDate: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0],
                shareholdingPost: "5.2%",
                paymentReceived: "full",
                includeROCFiling: true,
                includeShareCert: true,
            },
            "legal-notice": {
                partyB_name: "Zenith Solutions Pvt Ltd",
                partyB_signatory: "Rahul Verma, Director",
                partyB_address: "42 MG Road, Connaught Place, New Delhi 110001",
                noticeType: "recovery",
                jurisdiction: "Bangalore",
                factualBackground: "On 01-Mar-2025, the Sender entered into a Software Development Agreement with the Recipient for development of a mobile application. The total contract value was ₹15,00,000, of which ₹10,00,000 has been paid. The remaining ₹5,00,000 was due on 01-Jun-2025 upon delivery of the completed application. The application was delivered and accepted on 28-May-2025, but payment has not been received despite multiple follow-ups.",
                grievance: "The Recipient has failed to pay the remaining ₹5,00,000 despite accepting the deliverables and multiple reminders via email (dated 05-Jun, 15-Jun, and 25-Jun-2025). This constitutes a breach of the payment terms under Clause 5 of the Agreement.",
                demandedRelief: "Payment of ₹5,00,000 (outstanding amount) plus ₹45,000 as interest at 18% p.a. from the due date, within 15 days of receipt of this notice.",
                responseDeadline: "15",
                amountClaimed: "₹5,45,000",
                relevantDocuments: "1. Software Development Agreement dated 01-Mar-2025\n2. Delivery acceptance email dated 28-May-2025\n3. Invoice INV-2025-038 dated 01-Jun-2025\n4. Follow-up emails (3 nos.)",
                includeConsequences: true,
                sendVia: "rpad",
            },
            "breach-notice": {
                partyB_name: "CloudHost India Pvt Ltd",
                partyB_signatory: "Amit Patel, CEO",
                partyB_address: "55 Tech Hub, HITEC City, Hyderabad 500081",
                contractTitle: "Cloud Hosting & Managed Services Agreement",
                contractDate: "2024-06-01",
                breachType: "sla-breach",
                breachDescription: "The Service Provider has failed to maintain the guaranteed 99.9% uptime SLA for 3 consecutive months (April, May, June 2025). Actual uptime was 96.2%, 97.1%, and 95.8% respectively, resulting in significant business disruption and lost revenue.",
                contractClauseRef: "Clause 4.2 (Service Level Agreement) and Clause 4.5 (Uptime Guarantee)",
                curePeriod: "15",
                damagesAmount: "₹8,00,000",
                previousReminders: "Email escalation to account manager on 15-Apr-2025, formal complaint to CTO on 01-May-2025, meeting on 15-May-2025 with verbal assurance of resolution.",
                includeTermination: true,
                includeDamagesClaim: true,
                includeLegalProceedings: true,
            },
            loi: {
                partyB_name: "Seed Ventures LLP",
                partyB_signatory: "Meera Patel, Managing Partner",
                partyB_address: "101 Venture Tower, Bandra Kurla Complex, Mumbai 400051",
                loiType: "investment",
                dealSummary: "Seed Ventures intends to invest ₹2,00,00,000 (Two Crores) in Acme Corp Pvt Ltd at a pre-money valuation of ₹10,00,00,000 (Ten Crores), for approximately 16.67% equity on a fully diluted basis, via Compulsorily Convertible Preference Shares (CCPS).",
                keyTerms: "Investment: ₹2 Cr | Valuation: ₹10 Cr pre-money | Instrument: CCPS | Board Seat: 1 observer seat | Anti-dilution: Broad-based weighted average | Liquidation Preference: 1x non-participating",
                exclusivityPeriod: "60-days",
                dueDiligencePeriod: "30-days",
                bindingStatus: "non-binding",
                targetClosingDate: new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
                conditionsPrecedent: "Satisfactory due diligence, board approvals from both parties, execution of SHA/SSA, and regulatory clearances if applicable.",
                jurisdiction: "Bangalore",
                includeConfidentiality: true,
                includeBreakFee: false,
            },
            "vendor-onboarding": {
                partyB_name: "PixelCraft Design Studio",
                partyB_signatory: "Neha Gupta, Founder",
                partyB_address: "34 Design Lane, HSR Layout, Bangalore 560102",
                vendorType: "marketing",
                scopeOfWork: "Complete brand identity redesign including logo, brand guidelines, website UI/UX design (10 pages), social media templates (20 variants), and pitch deck template. 3 rounds of revisions included.",
                contractValue: "₹4,50,000",
                paymentTerms: "milestone",
                contractDuration: "3-months",
                slaRequirements: "First draft within 10 working days. Revision turnaround: 5 working days. Weekly progress calls every Monday.",
                jurisdiction: "Bangalore",
                includeNDA: true,
                includeIPClause: true,
                includeInsurance: false,
                includeGSTCompliance: true,
                complianceDocuments: "GST Certificate, PAN Card, Bank Account Details, Portfolio/Past Work References",
            },
            "startup-india": {
                companyName: "Acme Technologies Pvt Ltd",
                cin: "U72200KA2023PTC175432",
                dateOfIncorporation: "2023-04-15",
                registeredAddress: "123 Tech Park, Whitefield, Bangalore, Karnataka 560066",
                natureOfBusiness: "AI-powered legal document automation platform using large language models to democratize access to legal services for Indian startups and SMEs. Novel approach: two-stage generation (blueprint → full document) with clause-level risk assessment and an India-specific legal knowledge base.",
                turnover: "₹45,00,000",
                numberOfEmployees: "12",
                founderName: "Rajesh Kumar, CEO & Co-Founder",
                letterPurpose: "dpiit-recognition",
                includeFinancials: true,
                includePitchDeck: true,
            },
            "gst-bank-letter": {
                companyName: "Acme Technologies Pvt Ltd",
                cin: "U72200KA2023PTC175432",
                pan: "AABCA1234F",
                registeredAddress: "123 Tech Park, Whitefield, Bangalore, Karnataka 560066",
                bankName: "HDFC Bank, Koramangala Branch, Bangalore",
                authorizedSignatory: "Rajesh Kumar, Director",
                directorsList: "1. Rajesh Kumar (DIN: 12345678) — CEO & Director\n2. Priya Sharma (DIN: 87654321) — CTO & Director",
                natureOfBusiness: "Software Development & SaaS Services (SAC: 998314)",
                expectedTurnover: "₹1,20,00,000",
                letterPurpose: "current-account",
                enclosedDocuments: "1. Certificate of Incorporation\n2. PAN Card\n3. MOA & AOA\n4. Board Resolution (dated 20-Apr-2023)\n5. Address Proof (Rent Agreement + NOC)\n6. KYC of Directors (Aadhaar + PAN)",
            },
            "co-founder-agreement": {
                partyB_name: "Priya Sharma",
                partyB_signatory: "Priya Sharma",
                partyB_address: "456 Palm Grove, Indiranagar, Bangalore 560038",
                startupName: "Acme Technologies Pvt Ltd",
                cin: "U72200KA2023PTC175432",
                businessDescription: "AI-powered legal document automation platform using large language models to democratize access to legal services for Indian startups and SMEs.",
                equitySplit: "Founder A (Rajesh Kumar): 55%, Founder B (Priya Sharma): 45%",
                vestingSchedule: "4y-1c-monthly",
                roleFounderA: "CEO — Business strategy, fundraising, investor relations, partnerships, hiring, and go-to-market execution.",
                roleFounderB: "CTO — Product development, engineering, technical architecture, AI/ML pipeline, and DevOps infrastructure.",
                salaryTerms: "No salary until Series A. Post-Series A: ₹1,50,000/month each, subject to board approval.",
                decisionMaking: "domain",
                deadlockResolution: "mediation-arbitration",
                nonCompetePeriod: "12-months",
                exitTriggers: "Voluntary exit (90 days notice), termination for cause (immediate), death/disability (buyback at FMV), mutual agreement",
                includeIPAssignment: true,
                includeAntiDilution: true,
                includeExpensePolicy: true,
                jurisdiction: "Bangalore",
            },
            "board-resolution": {
                resolutionPurpose: "esop",
                meetingType: "board",
                meetingDate: new Date().toISOString().split("T")[0],
                meetingTime: "11:00 AM IST",
                meetingVenue: "Registered Office — 123 Tech Park, Whitefield, Bangalore 560066",
                directorsPresent: "1. Rajesh Kumar (DIN: 12345678) — Chairperson & CEO\n2. Priya Sharma (DIN: 87654321) — CTO & Director\n3. Meera Patel (DIN: 11223344) — Independent Director",
                quorumConfirmation: true,
                resolutionText: "RESOLVED THAT the Company hereby approves creation of an Employee Stock Option Pool (ESOP Pool) comprising 10% of the fully diluted share capital of the Company, i.e., 1,00,000 equity shares of face value ₹10 each, to be granted to eligible employees, directors, and consultants of the Company as per the ESOP Plan 2025.",
                authorizedPerson: "Rajesh Kumar, CEO & Director",
                additionalNotes: "The ESOP Plan 2025 shall be administered by the Board or a Compensation Committee appointed by the Board.",
                includeROCFiling: true,
            },
            "termination-letter": {
                employeeName: "Amit Verma",
                employeeId: "EMP-2023-027",
                designation: "Marketing Manager",
                department: "Marketing",
                dateOfJoining: "2023-06-01",
                terminationReason: "performance",
                terminationDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
                noticePeriodStatus: "full-notice",
                noticePeriodDays: "30",
                settlementDetails: "Pending salary for the current month, earned leave encashment (12 days), and pro-rata bonus. Gratuity not applicable (tenure < 5 years).",
                assetReturnList: "MacBook Pro (Asset ID: LPT-042), Company ID Card, Building Access Card, Company Email Account, Marketing Tool Licenses (HubSpot, Canva)",
                includeNDAReminder: true,
                includeNonDisparagement: true,
                includeAppealRight: true,
            },
            "consultancy-agreement": {
                partyB_name: "Siddharth Rao",
                partyB_signatory: "Siddharth Rao",
                partyB_address: "78 Tech Residency, Koramangala, Bangalore 560034",
                consultantType: "individual",
                scopeOfWork: "Design and implement a scalable microservices architecture for the ClauseWala backend. Deliverables: (1) Architecture design document, (2) API specifications, (3) Core service implementation (Auth, Document, AI Gateway), (4) CI/CD pipeline setup, (5) Load testing report. 2 rounds of revisions included.",
                engagementDuration: "3-months",
                consultancyFee: "₹3,00,000 (₹1,00,000/month)",
                paymentTerms: "monthly",
                tdsRate: "10-194j",
                workLocation: "Remote (weekly sync calls on Monday)",
                noticePeriod: "15-days",
                includeIPAssignment: true,
                includeNDA: true,
                includeNonSolicit: true,
                includeNonCompete: false,
                includeIndemnity: true,
                additionalTerms: "Consultant will use company-provided GitHub organization for all code. Weekly progress updates via Slack. Access to AWS staging environment will be provided.",
            },
            "service-agreement": {
                partyB_name: "CloudNine Hosting Pvt Ltd",
                partyB_signatory: "Amit Patel, CEO",
                partyB_address: "55 Tech Hub, HITEC City, Hyderabad 500081",
                serviceType: "saas",
                serviceDescription: "Cloud hosting and managed infrastructure services for the ClauseWala platform, including: (1) Production environment on AWS Mumbai region, (2) Auto-scaling compute (2-8 instances), (3) Managed PostgreSQL database with daily backups, (4) CDN for static assets, (5) 24/7 monitoring and incident response, (6) Monthly security patching.",
                pricingModel: "monthly",
                contractValue: "₹75,000/month",
                paymentTerms: "net-30",
                contractDuration: "12-months",
                slaUptime: "99.9",
                slaResponseTime: "P1 (Critical): 30 min, P2 (High): 2 hours, P3 (Medium): 8 hours, P4 (Low): 24 hours",
                liabilityCap: "12-month-fees",
                includeDataProtection: true,
                includeIPClause: true,
                includeConfidentiality: true,
                includeForceMajeure: true,
                includeIndemnity: true,
                disputeResolution: "arbitration",
            },
            "ip-assignment": {
                partyB_name: "Rajesh Kumar",
                partyB_signatory: "Rajesh Kumar",
                partyB_address: "123 Tech Park, Whitefield, Bangalore 560066",
                assignorType: "founder",
                ipDescription: "Complete source code, architecture, UI/UX designs, AI prompt library, clause database, and all documentation for the ClauseWala legal document automation platform — initially developed by the Assignor prior to company incorporation.",
                ipType: "comprehensive",
                creationContext: "pre-incorporation",
                consideration: "₹1 (nominal) + 55% equity stake in Acme Technologies Pvt Ltd as per Co-Founder Agreement dated 15-Apr-2023",
                includeSourceCode: true,
                includeMoralRightsWaiver: true,
                includeWarranties: true,
                includeFurtherAssurance: true,
                includeNonAssertion: true,
                jurisdiction: "Bangalore",
            },
            "experience-letter": {
                employeeName: "Anita Singh",
                employeeId: "EMP-2022-018",
                designation: "Senior Backend Engineer",
                department: "Engineering",
                dateOfJoining: "2022-03-15",
                lastWorkingDate: new Date().toISOString().split("T")[0],
                designationsHeld: "1. Software Engineer (Mar 2022 – Feb 2023)\n2. Senior Software Engineer (Mar 2023 – Nov 2024)\n3. Senior Backend Engineer (Dec 2024 – Present)",
                keyResponsibilities: "Led backend development for the AI document generation pipeline. Designed and implemented microservices architecture handling 10,000+ document generations/month. Mentored 3 junior engineers. Owned CI/CD pipeline and production deployments. Key contributor to the clause library and risk assessment engine.",
                performanceRemark: "excellent",
                includeProjects: true,
                includeSkills: true,
                includeWishNote: true,
            },
            "internship-letter": {
                internName: "Arjun Patel",
                internAddress: "B-12, Harmony Apartments, Aundh, Pune 411007",
                collegeName: "College of Engineering, Pune (COEP)",
                designation: "Software Engineering Intern",
                department: "Engineering — Backend Team",
                projectDescription: "Build a RESTful API layer for the ClauseWala template management system. Expected deliverables: (1) CRUD endpoints for templates and clauses, (2) Search and filtering with Elasticsearch, (3) Unit tests with >80% coverage, (4) API documentation using Swagger/OpenAPI.",
                startDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
                duration: "3-months",
                stipend: "₹25,000",
                workLocation: "Bangalore (Hybrid — 3 days office, 2 days remote)",
                reportingTo: "Priya Sharma, CTO",
                workingHours: "10:00 AM – 6:00 PM, Monday to Friday",
                ppoEligible: "yes-performance",
                includeNDA: true,
                includeIPClause: true,
                includeCertificate: true,
            },
        };

        const dummyValues = { ...common, ...(perType[docType] || {}) };
        Object.entries(dummyValues).forEach(([key, value]) => {
            setValue(key, value, { shouldValidate: true, shouldDirty: true });
        });
    };

    return (
        <>
        <Card className="w-full max-w-2xl mx-auto animate-fade-in bg-card border-border" suppressHydrationWarning>
            <CardHeader className="pb-5">
                <div className="flex items-center gap-3 mb-0.5">
                    <div className="h-9 w-9 rounded-lg bg-foreground/[0.04] border border-border flex items-center justify-center">
                        <FileText className="h-4 w-4 text-foreground/70" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold tracking-tight">Drafting {template.label}</CardTitle>
                        <CardDescription className="mt-0.5 text-[13px]">
                            {template.description}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-8">

                    {/* Section 1: Party A */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2.5 border-b border-border/40 pb-2.5">
                            <div className="h-6 w-6 rounded-md bg-foreground/[0.05] flex items-center justify-center">
                                <Building2 className="h-3.5 w-3.5 text-foreground/60" />
                            </div>
                            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
                                Party A (You)
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                field={{ name: "name", label: "Full Name / Organisation", placeholder: "e.g. Acme Corp", required: true, type: "text" }}
                                prefix="partyA"
                                register={register}
                                control={control}
                                errors={errors}
                            />
                            <FormField
                                field={{ name: "signatory", label: "Signatory Name", placeholder: "e.g. Jane Doe", required: true, type: "text" }}
                                prefix="partyA"
                                register={register}
                                control={control}
                                errors={errors}
                            />
                            <div className="md:col-span-2">
                                <FormField
                                    field={{ name: "address", label: "Address", placeholder: "Full legal address", required: false, type: "text" }}
                                    prefix="partyA"
                                    register={register}
                                    control={control}
                                    errors={errors}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Party B */}
                    {template.isTwoParty && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2.5 border-b border-border/40 pb-2.5">
                                <div className="h-6 w-6 rounded-md bg-foreground/[0.05] flex items-center justify-center">
                                    <Users className="h-3.5 w-3.5 text-foreground/60" />
                                </div>
                                <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
                                    Party B (Other Side)
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    field={{ name: "name", label: "Full Name / Organisation", placeholder: "e.g. John Smith", required: true, type: "text" }}
                                    prefix="partyB"
                                    register={register}
                                    control={control}
                                    errors={errors}
                                />
                                <FormField
                                    field={{ name: "signatory", label: "Signatory Name", placeholder: "e.g. John Smith", required: false, type: "text" }}
                                    prefix="partyB"
                                    register={register}
                                    control={control}
                                    errors={errors}
                                />
                                <div className="md:col-span-2">
                                    <FormField
                                        field={{ name: "address", label: "Address", placeholder: "Full legal address", required: false, type: "text" }}
                                        prefix="partyB"
                                        register={register}
                                        control={control}
                                        errors={errors}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Section 3: Document Details */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2.5 border-b border-border/40 pb-2.5">
                            <div className="h-6 w-6 rounded-md bg-foreground/[0.05] flex items-center justify-center">
                                <Sparkles className="h-3.5 w-3.5 text-foreground/60" />
                            </div>
                            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
                                Agreement Details
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                field={{ name: "effectiveDate", label: "Effective Date", type: "date", required: true }}
                                register={register}
                                control={control}
                                errors={errors}
                            />
                            {template.fields.map((field: FormFieldDefinition) => (
                                <div key={field.name} className={field.type === 'textarea' || field.type === 'text' ? 'md:col-span-2' : ''}>
                                    <FormField
                                        field={field}
                                        register={register}
                                        control={control}
                                        errors={errors}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="flex justify-between items-center pt-5 border-t border-border/60 gap-4">
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={fillDummyData}
                            className="text-xs gap-1.5 border-border/60 text-muted-foreground hover:text-foreground"
                        >
                            <Sparkles className="h-3 w-3" />
                            Fill Dummy Data
                        </Button>
                        {errorCount > 0 && (
                            <span className="text-xs text-destructive font-mono animate-pulse">
                                {errorCount} field{errorCount > 1 ? "s" : ""} need attention
                            </span>
                        )}
                    </div>

                    <LiquidButton type="submit" disabled={isLoading} size="lg" className="min-w-[200px]">
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Analyzing...
                            </span>
                        ) : (
                            <span className="text-sm">Generate Blueprint →</span>
                        )}
                    </LiquidButton>
                </CardFooter>
            </form>
        </Card>

        {/* AI Form Assistant — floating widget, non-blocking */}
        <FormAssistant
            docType={docType}
            currentFormData={currentFormData}
            onApplyFields={handleBotApplyFields}
        />
        </>
    );
}
