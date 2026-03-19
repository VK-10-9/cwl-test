import { DocumentTemplate } from "@/types";

export const rentAgreementTemplate: DocumentTemplate = {
    type: "rent-agreement",
    label: "Residential Rent Agreement",
    description: "Standard residential rent terms for India, covering security deposit, monthly rent, and maintenance.",
    isTwoParty: true,
    fields: [
        {
            name: "propertyAddress",
            label: "Property Address",
            type: "textarea",
            required: true,
            placeholder: "Full address including flat no, building, and area."
        },
        {
            name: "monthlyRent",
            label: "Monthly Rent (INR)",
            type: "number",
            required: true,
            placeholder: "e.g. 25000"
        },
        {
            name: "securityDeposit",
            label: "Security Deposit (INR)",
            type: "number",
            required: true,
            placeholder: "e.g. 100000"
        },
        {
            name: "leaseDuration",
            label: "Lease Duration (Months)",
            type: "number",
            required: true,
            placeholder: "e.g. 11"
        },
        {
            name: "annualEscalation",
            label: "Annual Rent Escalation (%)",
            type: "number",
            required: false,
            placeholder: "e.g. 5"
        },
        {
            name: "noticePeriod",
            label: "Notice Period (Days)",
            type: "number",
            required: true,
            placeholder: "e.g. 30"
        }
    ],
    defaultClauses: [
        "Description of Premises",
        "Term of Lease",
        "Rent, Taxes and Charges",
        "Security Deposit and Refund",
        "Maintenance and Utility Bills",
        "Use and Restrictions",
        "Repairs and Alterations",
        "Landlord's Right of Entry",
        "Termination and Notice",
        "Consequences of Expiry",
        "Dispute Resolution and Jurisdiction"
    ]
};
