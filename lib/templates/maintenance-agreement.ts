import { DocumentTemplate } from "@/types";

export const maintenanceAgreementTemplate: DocumentTemplate = {
    type: "maintenance-agreement",
    label: "AMC / Maintenance Agreement",
    description: "Post-delivery support, maintenance, and AMC terms for software or IT infrastructure.",
    isTwoParty: true,
    fields: [
        {
            name: "serviceScope",
            label: "Scope of Maintenance",
            type: "textarea",
            required: true,
            placeholder: "e.g Bug fixes, security patches, hardware support."
        },
        {
            name: "maintenanceFee",
            label: "Annual Maintenance Fee (INR)",
            type: "number",
            required: true
        }
    ],
    defaultClauses: [
        "Scope of Services",
        "Response and Resolution Times",
        "System Accessibility",
        "Exclusions from Service",
        "Fees and Payment Terms",
        "Term and Renewal",
        "Termination for Convenience",
        "Independent Contractor Status",
        "Governing Law"
    ]
};
