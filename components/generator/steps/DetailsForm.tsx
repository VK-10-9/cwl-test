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
            common.partyB_name = "John Doe";
            common.partyB_type = "individual";
            common.partyB_address = "456 Palm Grove, Indiranagar, Bangalore, KA 560038";
            common.partyB_signatory = "John Doe";
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
            },
            mou: {
                mouType: "joint-venture",
                relationshipContext: "corp-corp",
                jurisdiction: "India",
                startDate: new Date().toISOString().split("T")[0],
                duration: "2-years",
                renewalTerms: "auto-renew",
                disputeResolution: "arbitration",
                purpose: "Joint development of an AI-powered healthcare analytics platform for rural India.",
                specificObjectives: "1. Develop a working prototype within 6 months.\n2. Pilot the platform in 3 rural clinics within 12 months.\n3. Publish 2 joint research papers on AI in healthcare.",
                responsibilitiesA: "Provide technical infrastructure, engineering resources (3 full-time developers), and cloud hosting. Lead product development and technical architecture.",
                responsibilitiesB: "Contribute domain expertise, clinical data access, regulatory guidance, and on-ground coordination with healthcare facilities.",
                keyPersonnelA: "Dr. Rajesh Kumar (CTO), Anita Singh (Lead Engineer)",
                keyPersonnelB: "Dr. Meera Patel (Medical Director), John Doe (Project Coordinator)",
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
            "request-letter": {
                senderName: "Dr. Rajesh Kumar",
                senderDesignation: "Head of Department, Computer Science",
                senderDepartment: "Department of Computer Science, Acme University",
                senderContact: "rajesh.kumar@acmeuniv.edu\n+91-9876543210\n123 Tech Park, Whitefield, Bangalore",
                recipientName: "The Dean, Academic Affairs",
                recipientOrganisation: "Indian Institute of Technology, Delhi",
                recipientAddress: "IIT Campus, Hauz Khas, New Delhi 110016",
                letterDate: new Date().toISOString().split("T")[0],
                subject: "Request for Permission to Conduct Research Survey on Campus",
                requestType: "permission",
                salutation: "respected",
                openingParagraph: "I am writing to formally request permission to conduct a research survey among final-year B.Tech students at your esteemed institution. Our department is undertaking a study on placement preparedness and industry skill gaps.",
                requestDetails: "We wish to conduct an anonymous, voluntary online survey over a 2-week window targeting approximately 500 final-year students across all engineering departments. The survey consists of 25 questions and takes approximately 10 minutes to complete.",
                justification: "This research will contribute to improving industry-academia alignment and help educational institutions better prepare students for the workforce. The findings will be shared with your institution.",
                urgency: "standard",
                closing: "thank-consideration",
                signOff: "sincerely",
                offerToDiscuss: true,
            },
            "internship-cert": {
                certificateTitle: "internship",
                internName: "Priya Sharma",
                internId: "INT-2026-042",
                internEmail: "priya.sharma@example.com",
                institution: "Indian Institute of Technology, Delhi",
                degreeProgram: "B.Tech Computer Science",
                yearOfStudy: "3",
                internshipType: "full-time",
                department: "Engineering — Web Platform Team",
                role: "Full Stack Developer Intern",
                startDate: "2025-06-01",
                endDate: "2025-12-01",
                duration: "6 months",
                projectTitle: "Real-time Notification Microservice",
                projectDescription: "Designed and implemented a scalable real-time notification microservice using Node.js and WebSockets. Contributed to 3 production releases including a dashboard redesign using React and TypeScript.",
                skillsDeveloped: "React, TypeScript, Node.js, WebSockets, PostgreSQL, Docker, CI/CD with GitHub Actions",
                responsibilities: "Built frontend components, wrote unit tests, participated in code reviews, and led a sprint demo presentation.",
                performance: "outstanding",
                attendance: "excellent",
                teamwork: "excellent",
                technicalSkills: "excellent",
                comments: "Priya demonstrated exceptional initiative and code quality. She independently built a real-time notification system that is now in production. Highly recommended for future roles.",
                stipendPaid: "yes",
                stipendAmount: "₹25,000 per month",
                issueDate: new Date().toISOString().split("T")[0],
                certificateLanguage: "english",
                signatoryName: "Rajesh Kumar",
                signatoryDesignation: "VP of Engineering",
                signatoryDepartment: "Engineering",
            },
            "sponsorship-letter": {
                eventName: "TechConf India 2026",
                eventType: "tech-conference",
                eventDate: "2026-03-15",
                eventVenue: "Bengaluru International Exhibition Centre, Bangalore",
                eventDescription: "TechConf India is an annual technology conference bringing together 2000+ developers, startup founders, and industry leaders for 2 days of talks, workshops, and networking.",
                expectedAttendance: "2000+ participants",
                organizerName: "Acme Corp Pvt Ltd",
                sponsorshipType: "gold",
                sponsorshipAmount: "₹2,50,000",
                brandVisibility: "Logo on main stage banner, event website, all digital communications, event merchandise (t-shirts, bags), and social media posts (10+ mentions).",
                boothSpace: "10x10 feet premium booth in expo hall",
                speakingOpportunity: "keynote",
                networkingAccess: true,
                sponsorshipDeadline: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
                paymentTerms: "50-50",
                contactPerson: "Amit Verma",
                contactDesignation: "Sponsorship Coordinator",
                contactEmail: "sponsor@techconfindia.com",
                contactPhone: "+91-9876543210",
                letterType: "request",
                letterTone: "formal",
            },
        };

        const dummyValues = { ...common, ...(perType[docType] || {}) };
        Object.entries(dummyValues).forEach(([key, value]) => {
            setValue(key, value, { shouldValidate: true, shouldDirty: true });
        });
    };

    return (
        <Card className="w-full max-w-2xl mx-auto animate-fade-in bg-card border-border shadow-lg" suppressHydrationWarning>
            <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-1">
                    <div className="h-10 w-10 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">Drafting {template.label}</CardTitle>
                        <CardDescription className="mt-0.5">
                            {template.description}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-8">

                    {/* Section 1: Party A */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2.5 border-b border-border/50 pb-2">
                            <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                                <Building2 className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
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
                            <div className="flex items-center gap-2.5 border-b border-border/50 pb-2">
                                <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                                    <Users className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
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
                        <div className="flex items-center gap-2.5 border-b border-border/50 pb-2">
                            <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                                <Sparkles className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
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
                <CardFooter className="flex justify-between items-center pt-6 border-t border-border/40 gap-4">
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={fillDummyData}
                            className="text-xs gap-1.5"
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

                    <LiquidButton type="submit" disabled={isLoading} size="lg" className="min-w-[220px]">
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Analyzing...
                            </span>
                        ) : (
                            "Generate Blueprint →"
                        )}
                    </LiquidButton>
                </CardFooter>
            </form>

            {/* AI Form Assistant Bot */}
            <FormAssistant
                docType={docType}
                currentFormData={currentFormData}
                onApplyFields={handleBotApplyFields}
            />
        </Card>
    );
}
