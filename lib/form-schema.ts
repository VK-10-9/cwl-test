import { z } from "zod";
import { DocumentTemplate, FormFieldDefinition } from "@/types";

export function generateFormSchema(template: DocumentTemplate): z.ZodObject<Record<string, z.ZodTypeAny>> {
    const shape: Record<string, z.ZodTypeAny> = {};

    // 1. Party A Fields (Always present)
    shape["partyA_name"] = z.string().min(1, "Name is required");
    shape["partyA_signatory"] = z.string().min(1, "Signatory is required");
    shape["partyA_address"] = z.string().optional();

    // 2. Party B Fields (If applicable)
    if (template.isTwoParty) {
        shape["partyB_name"] = z.string().min(1, "Name is required");
        shape["partyB_signatory"] = z.string().optional();
        shape["partyB_address"] = z.string().optional();
    }

    // 3. Common Fields
    shape["effectiveDate"] = z.string().min(1, "Date is required");

    // 4. Dynamic Fields from Template
    template.fields.forEach((field: FormFieldDefinition) => {
        let schema: z.ZodTypeAny;

        switch (field.type) {
            case "checkbox":
                schema = z.boolean().default(false);
                break;
            case "date":
                schema = z.date({
                    required_error: "Date is required.",
                }).or(z.string().min(1, "Date is required"));
                break;
            case "number":
                schema = z.coerce.number();
                if (field.required) {
                    schema = z.coerce.number().min(1, "Value is required");
                }
                break;
            default: // text, textarea, select
                if (field.required) {
                    schema = z.string().min(1, `${field.label} is required`);
                } else {
                    schema = z.string().optional();
                }
                break;
        }

        shape[field.name] = schema;
    });

    return z.object(shape);
}

export function generateDefaultValues(template: DocumentTemplate): Record<string, string | boolean | number> {
    const defaults: Record<string, string | boolean | number> = {
        partyA_name: "",
        partyA_signatory: "",
        partyA_address: "",
        effectiveDate: new Date().toISOString().split('T')[0],
    };

    if (template.isTwoParty) {
        defaults.partyB_name = "";
        defaults.partyB_signatory = "";
        defaults.partyB_address = "";
    }

    template.fields.forEach((field) => {
        if (field.type === 'checkbox') {
            defaults[field.name] = false;
        } else if (field.type === 'number') {
            defaults[field.name] = 0;
        } else {
            defaults[field.name] = "";
        }
    });

    return defaults;
}
