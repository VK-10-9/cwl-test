import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FileText, ArrowRight, Building, Users, Briefcase, FileSignature, Landmark, Shield, Handshake, Scale, TrendingUp, Database, Globe } from "lucide-react";

export const metadata = {
    title: "Document Templates - ClauseWala",
    description: "Create AI-powered legal documents for startups and businesses.",
};

const TEMPLATE_CATEGORIES = [
    {
        name: "Founder & Equity",
        description: "Core agreements defining ownership, roles, and vesting among founders.",
        icon: <Users className="w-5 h-5 text-emerald-500" />,
        templates: [
            { id: "co-founder-agreement", name: "Co-Founder Agreement", description: "Define equity split, vesting, roles, IP ownership, and exit terms between co-founders.", isPopular: true },
            { id: "founder-vesting", name: "Founder Vesting Agreement", description: "Standalone agreement establishing reverse vesting schedules and cliff periods for founder equity.", isPopular: true },
            { id: "founder-exit", name: "Founder Exit Agreement", description: "Formal agreement outlining equity treatment, IP assignment, and transition terms when a co-founder leaves.", isPopular: true },
            { id: "buyback-agreement", name: "Buyback Agreement", description: "Contract specifying the terms under which the company can buy back shares from founders or early employees." },
            { id: "sha", name: "Shareholders' Agreement (SHA)", description: "Establish board seats, voting rights, drag/tag along rights, and protective provisions for major investors.", isPopular: true },
            { id: "subscription-agreement", name: "Subscription Agreement", description: "Formal contract outlining an investor's commitment to purchase shares at a specific price.", isPopular: true },
            { id: "esop-policy", name: "ESOP Policy Document", description: "Draft the comprehensive scheme, pool size, vesting rules, and administration of your startup's ESOP." }
        ]
    },
    {
        name: "Fundraising & Investor Docs",
        description: "From term sheets to due diligence, everything needed to close your round.",
        icon: <Landmark className="w-5 h-5 text-emerald-500" />,
        templates: [
            { id: "term-sheet", name: "Term Sheet (Seed/Series A)", description: "Non-binding agreement setting forth the basic terms, valuation, and conditions of an investment round.", isPopular: true },
            { id: "safe-note", name: "SAFE Note", description: "Simple Agreement for Future Equity for early-stage startup fundraising with valuation caps and discounts.", isPopular: true },
            { id: "convertible-note", name: "Convertible Note", description: "Short-term debt instrument that converts into equity, commonly used in seed investing." },
            { id: "investor-rights", name: "Investor Rights Agreement", description: "Grants specific rights to investors, including information rights, registration rights, and pro-rata rights." },
            { id: "due-diligence-request", name: "Due Diligence Data Request Letter", description: "Standardized checklist and formal request for information required by VCs during the diligence process." },
            { id: "founder-declaration", name: "Founder Declaration Letter", description: "Clean compliance statement and representation letter often required by institutional investors." },
            { id: "pitch-deck-nda", name: "Pitch Deck NDA", description: "A highly specific one-way NDA tailored for sharing your startup's pitch deck, financials, and concepts." }
        ]
    },
    {
        name: "Tech & Data",
        description: "Protecting your software, handling data legally, and licensing IP.",
        icon: <Database className="w-5 h-5 text-emerald-500" />,
        templates: [
            { id: "data-processing-agreement", name: "Data Processing Agreement (DPA)", description: "Critical under DPDP and GDPR, governing how user data is processed and protected by third parties.", isPopular: true },
            { id: "software-development", name: "Software Development Agreement", description: "Contract for engaging outsourced dev shops or freelance developers, ensuring full IP assignment.", isPopular: true },
            { id: "api-usage-agreement", name: "API Usage Agreement", description: "Terms governing how third-party developers can access and use your SaaS platform's API." },
            { id: "open-source-contribution", name: "Open Source Contribution Agreement", description: "Framework for dev-heavy startups accepting code contributions from the community." },
            { id: "tech-transfer", name: "Technology Transfer Agreement", description: "Agreement used when intellectual property, patents, or core tech is licensed or transferred." },
            { id: "saas-agreement", name: "SaaS Subscription Agreement", description: "Standard user terms for SaaS platforms covering licensing, usage limits, and termination." },
            { id: "eula", name: "End User License Agreement (EULA)", description: "Legal contract between a software application publisher and the user regarding software usage limits." },
            { id: "ip-assignment", name: "IP Assignment Agreement", description: "Transfer intellectual property ownership from founders, employees, or contractors to the company." }
        ]
    },
    {
        name: "Sales & Commercial Growth",
        description: "Agreements driving revenue, go-to-market, and brand expansion.",
        icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
        templates: [
            { id: "sales-commission", name: "Sales Commission Agreement", description: "Structure payouts, targets, and conditions for business development and sales teams.", isPopular: true },
            { id: "channel-partner", name: "Channel Partner Agreement", description: "Distribution-heavy agreement authorizing partners to sell or distribute your startup's products." },
            { id: "influencer-agreement", name: "Influencer Agreement", description: "Define deliverables, usage rights, and compensation for brand collaborations with creators.", isPopular: true },
            { id: "marketing-retainer", name: "Marketing Retainer Agreement", description: "Ongoing service agreement for engaging marketing, PR, or performance ad agencies." },
            { id: "sponsorship-agreement", name: "Sponsorship Agreement", description: "Formalize terms for event sponsorships, brand mentions, and co-marketing campaigns.", isPopular: true },
            { id: "msa", name: "Master Service Agreement", description: "Broad agreement covering the overarching relationship, general terms, and dispute resolution with clients." },
            { id: "franchise-agreement", name: "Franchise Agreement", description: "Outline terms for licensing intellectual property, brand standards, and royalty fees to franchisees." }
        ]
    },
    {
        name: "Internal Governance",
        description: "Board management, share transfers, and corporate compliance.",
        icon: <Building className="w-5 h-5 text-emerald-500" />,
        templates: [
            { id: "founder-minutes", name: "Founders' Meeting Minutes Template", description: "Structured template for documenting key decisions at the pre-board stage." },
            { id: "share-transfer", name: "Share Transfer Agreement", description: "Legal framework governing the transfer of shares between existing shareholders or new buyers.", isPopular: true },
            { id: "nominee-director", name: "Nominee Director Agreement", description: "Agreement used when an institutional investor appoints a director to your startup's board." },
            { id: "employment-bond", name: "Employment Bond Agreement", description: "Establish a minimum tenure commitment from employees in exchange for specific training or joining bonuses.", isPopular: true },
            { id: "confidentiality-reminder", name: "Confidentiality Reminder Notice", description: "Internal compliance document periodicially reminding employees of their NDA obligations." },
            { id: "board-resolution", name: "Board Resolution", description: "Draft a board resolution for funding rounds, ESOP pools, bank accounts, or corporate actions." },
            { id: "director-resignation", name: "Director Resignation Letter", description: "Formal resignation document for a company director mentioning effective date and reasons." },
            { id: "founder-loan", name: "Founder Loan Agreement", description: "Formalize an agreement when a founder loans personal money to fund the startup's operations.", isPopular: true },
            { id: "inter-corporate-loan", name: "Inter-Corporate Loan Agreement", description: "Agreement for loans transacted between group companies or subsidiaries." },
            { id: "loan-acknowledgement", name: "Loan Acknowledgement Letter", description: "Simple debt confirmation letter." }
        ]
    },
    {
        name: "Disputes & Risk Control",
        description: "Notices, settlements, and legal action frameworks.",
        icon: <Shield className="w-5 h-5 text-emerald-500" />,
        templates: [
            { id: "settlement-agreement", name: "Settlement Agreement", description: "Formal contract to mutually close disputes, avoiding litigation in exchange for agreed terms.", isPopular: true },
            { id: "arbitration-notice", name: "Arbitration Notice", description: "Formal notice invoking the arbitration clause in an agreement to resolve an ongoing dispute.", isPopular: true },
            { id: "demand-payment", name: "Demand for Payment Notice", description: "Aggressive, final-warning notice demanding overdue payment before legal action is initiated." },
            { id: "notice-of-default", name: "Notice of Default", description: "Formal notification that a party has defaulted on a loan, service agreement, or contractual obligation." },
            { id: "legal-notice", name: "Legal Notice", description: "Send a formal legal notice under Section 80 CPC or general civil/commercial disputes." },
            { id: "breach-notice", name: "Breach Notice", description: "Notify a party of contract breach with cure period, consequences, and legal references." },
            { id: "cease-and-desist", name: "Cease & Desist Notice", description: "Demand an individual or business to legally halt illegal activity, IP infringement, or harassment." }
        ]
    },
    {
        name: "Hiring & Employment",
        description: "From offer to exit — compliant with Indian labour law.",
        icon: <Briefcase className="w-5 h-5 text-emerald-500" />,
        templates: [
            { id: "offer-letter", name: "Offer Letter", description: "Send a professional job offer with compensation, role details, and joining conditions — ready to sign." },
            { id: "appointment-letter", name: "Appointment Letter", description: "Issue a legally compliant appointment letter covering CTC, probation, notice period, and company policies." },
            { id: "non-compete", name: "Non-Compete Agreement", description: "Restrict employees or founders from starting a competing business or joining a direct competitor." },
            { id: "non-solicitation", name: "Non-Solicitation Agreement", description: "Prevent departing employees from poaching clients, vendors, or other staff members." },
            { id: "employee-handbook", name: "Employee Handbook", description: "Comprehensive company policy document covering leave, PoSH, Code of Conduct, and IT policies." },
            { id: "relieving-letter", name: "Relieving Letter", description: "Generate a clean relieving letter confirming an employee's exit, tenure, and clearance status." },
            { id: "termination-letter", name: "Termination Letter", description: "Issue a compliant termination letter citing grounds, notice period, and final settlement details." },
            { id: "experience-letter", name: "Experience Letter", description: "Provide a professional experience certificate detailing role, responsibilities, and tenure." },
            { id: "warning-letter", name: "Warning Letter", description: "Issue formal disciplinary warnings for misconduct, performance issues, or policy violations." }
        ]
    },
    {
        name: "General Contracts & Cross-Border",
        description: "Standard agreements and international compliance docs.",
        icon: <Globe className="w-5 h-5 text-emerald-500" />,
        templates: [
            { id: "nda", name: "Non-Disclosure Agreement", description: "Protect trade secrets, client data, and proprietary information with India-compliant confidentiality clauses.", isPopular: true },
            { id: "international-nda", name: "International NDA", description: "Cross-border compliance NDA tailored for sharing information with foreign entities and jurisdiction clauses." },
            { id: "mou", name: "Memorandum of Understanding", description: "Formalise joint ventures, partnerships, and collaborations with clearly defined responsibilities and exit terms." },
            { id: "consultancy-agreement", name: "Consultancy Agreement", description: "Engage freelancers and consultants with clear scope, payment terms, and TDS compliance." },
            { id: "independent-contractor", name: "Independent Contractor Agreement", description: "Establish terms for engaging self-employed professionals without creating an employer-employee relationship." },
            { id: "export-agreement", name: "Export Agreement", description: "Framework for startups exporting goods or services, covering forex terms and compliance." },
            { id: "cross-border-service", name: "Cross-Border Service Agreement", description: "Service contract tailored for international clients with clear jurisdiction split and payment routing." }
        ]
    }
];

export default function GenericTemplatesPage() {
    return (
        <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 relative">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-foreground/5 text-foreground/80 border border-border/50 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                        <FileSignature className="w-4 h-4 text-emerald-500" />
                        <span>AI Contract Generator</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading leading-tight tracking-tight mb-6">
                        Business & Startup <span className="text-emerald-500">Templates</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Draft air-tight Indian legal documents in minutes. Provide your context, and our AI drafts custom provisions based on standard legal precedents.
                    </p>
                </div>

                <div className="space-y-16 mb-20">
                    {TEMPLATE_CATEGORIES.map((category, idx) => (
                        <div key={idx}>
                            <div className="flex items-center mb-8 pb-4 border-b border-border/40">
                                <div className="bg-background border border-border/80 w-10 h-10 rounded-lg flex items-center justify-center mr-4 shadow-sm flex-shrink-0">
                                    {category.icon}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-serif text-foreground">
                                        {category.name}
                                    </h2>
                                    {category.description && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {category.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.templates.map((template) => (
                                    <Link
                                        href={`/generate/${template.id}`}
                                        key={template.id}
                                        className="group relative bg-background/50 backdrop-blur-sm border border-border/60 hover:border-emerald-500/50 p-6 rounded-xl shadow-sm transition-all hover:shadow-emerald-500/5 flex flex-col h-full"
                                    >
                                        <div className="relative z-10 flex-1">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                    <FileText className="w-3.5 h-3.5 opacity-70" />
                                                    <span>Contract Generation</span>
                                                </div>
                                                {template.isPopular && (
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                                        Popular
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-heading text-foreground mb-3 leading-snug group-hover:text-emerald-400 transition-colors">
                                                {template.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {template.description}
                                            </p>
                                        </div>
                                        <div className="relative z-10 mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-sm font-semibold text-emerald-500">
                                            <span>Draft with AI</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
