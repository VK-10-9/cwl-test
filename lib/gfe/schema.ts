import { z } from "zod";

// --- LAYER 1: CANONICAL FORM REPOSITORY SCHEMA ---

/**
 * Ensures strict typing of the exact Indian legislation the form originates from.
 */
export const ActEnum = z.enum([
    "Bharatiya Nagarik Suraksha Sanhita, 2023",
    "Bharatiya Nyaya Sanhita, 2023",
    "Bharatiya Sakshya Adhiniyam, 2023",
    "Companies Act, 2013",
    "Negotiable Instruments Act, 1881",
]);

/**
 * Field types supported by the Dynamic Engine
 */
export const FieldTypeEnum = z.enum([
    "text",
    "textarea",
    "date",
    "time",
    "select",
    "address",
    "number",
    "person_name",
    "police_station",
    "court_name",
    "signature",
]);

export const CoreFieldSchema = z.object({
    key: z.string(), // e.g. "accusedName"
    label: z.string(),
    type: FieldTypeEnum,
    required: z.boolean().default(true),
    placeholder: z.string().optional(),
    validationMessage: z.string().optional(),
});

/**
 * Contextual warning or mandatory legal requirement for issuing this form.
 */
export const LegalGuardrailSchema = z.object({
    id: z.string(),
    severity: z.enum(["info", "warning", "critical"]),
    condition: z.string().optional(), // Logic string to parse ("issuer != 'officer_in_charge'")
    message: z.string(), // "This form can only be issued by..."
});

/**
 * The ultimate definition of a statutory form.
 */
export const FormDefinitionSchema = z.object({
    id: z.string(), // e.g. "BNSS_2023_SCH2_FORM_1"
    act: ActEnum,
    sectionReference: z.string(), // e.g. "Section 64"
    formNumber: z.string(), // e.g. "Form 1"
    title: z.string(), // e.g. "SUMMONS TO AN ACCUSED PERSON"
    version: z.number().default(1),
    effectiveDate: z.string(),
    guardrails: z.array(LegalGuardrailSchema).default([]),

    // The variables that change per user/case
    fields: z.array(CoreFieldSchema),

    // The canonical text template utilizing Handlebars or identical syntax for interpolation
    templateText: z.string(),
});

export type FormDefinition = z.infer<typeof FormDefinitionSchema>;
export type FormField = z.infer<typeof CoreFieldSchema>;
