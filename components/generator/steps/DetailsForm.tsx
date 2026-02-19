"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import type { DocumentType, FormFieldDefinition } from "@/types";
import { getTemplate } from "@/lib/templates";
import { FormField } from "./FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateFormSchema, generateDefaultValues } from "@/lib/form-schema";
import { useMemo } from "react";

interface DetailsFormProps {
    docType: DocumentType;
    onSubmit: (data: Record<string, string | number | boolean>) => void;
    isLoading: boolean;
}

export default function DetailsForm({ docType, onSubmit, isLoading }: DetailsFormProps) {
    const template = getTemplate(docType);

    const schema = useMemo(() => generateFormSchema(template), [template]);
    const defaultValues = useMemo(() => generateDefaultValues(template), [template]);

    const { register, control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues, // Set default values to prevent uncontrolled input issues
    });

    // --- Dummy Data Helper ---
    const fillDummyData = () => {
        const dummyValues: Record<string, string | boolean> = {
            // Common NDA fields
            partyA_name: "Acme Corp Pvt Ltd",
            partyA_type: "company",
            partyA_address: "123 Tech Park, Whitefield, Bangalore, KA 560066",
            partyA_signatory: "Rajesh Kumar", // Updated key

            partyB_name: "John Doe",
            partyB_type: "individual",
            partyB_address: "456 Palm Grove, Indiranagar, Bangalore, KA 560038",
            partyB_signatory: "John Doe",

            effectiveDate: new Date().toISOString().split('T')[0],
            governingLaw: "India",
            jurisdiction: "Bangalore",

            // NDA Specific
            relationshipType: "employee",
            disclosureType: "unilateral",
            purpose: "Evaluation of potential employment and handling of proprietary software code.",
            duration: "2-years",
            confidentialityDuration: "5",
            disputeResolution: "arbitration",

            includeNonCompete: true, // Checkbox
            includeNonSolicit: true,
            includeIPAssignment: true,
        };

        // Set values dynamically
        Object.entries(dummyValues).forEach(([key, value]) => {
            setValue(key, value);
        });
    };

    return (
        <Card className="w-full max-w-2xl mx-auto glass-card animate-fade-in shadow-xl border-white/10" suppressHydrationWarning>
            <CardHeader>
                <CardTitle>Drafting {template.label}</CardTitle>
                <CardDescription>
                    {template.description}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-8">

                    {/* Section 1: Party A */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider border-b border-border/50 pb-2">
                            Party A (You)
                        </h3>
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
                            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider border-b border-border/50 pb-2">
                                Party B (Other Side)
                            </h3>
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
                        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider border-b border-border/50 pb-2">
                            Agreement Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Standard Effective Date */}
                            <FormField
                                field={{ name: "effectiveDate", label: "Effective Date", type: "date", required: true }}
                                register={register}
                                control={control}
                                errors={errors}
                            />

                            {/* Dynamic Fields */}
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
                <CardFooter className="flex justify-between pt-6 border-t border-border/40">
                    {process.env.NODE_ENV === "development" && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={fillDummyData}
                            className="opacity-50 hover:opacity-100 transition-opacity text-xs"
                        >
                            Fill Test Data
                        </Button>
                    )}

                    <LiquidButton type="submit" disabled={isLoading} size="lg" className="w-full md:w-auto min-w-[200px]">
                        {isLoading ? "Analyzing..." : "Continue to Blueprint →"}
                    </LiquidButton>
                </CardFooter>
            </form>
        </Card>
    );
}
