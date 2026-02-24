import { DocumentTemplate } from "@/types";

export const leaveLicenseTemplate: DocumentTemplate = {
    type: "leave-license",
    label: "Leave & License Agreement",
    description: "Specific residential or commercial format for states like Maharashtra.",
    isTwoParty: true,
    fields: [
        {
            name: "premisesDetails",
            label: "Premises Details",
            type: "textarea",
            required: true
        },
        {
            name: "licenseFee",
            label: "Monthly License Fee (INR)",
            type: "number",
            required: true
        },
        {
            name: "securityDeposit",
            label: "Refundable Security Deposit (INR)",
            type: "number",
            required: true
        }
    ],
    defaultClauses: [
        "License to Use Premises",
        "Licence Fee and Taxes",
        "Security Deposit and Refund",
        "Duration of License",
        "Use and Restrictions",
        "Maintenance and Repairs",
        "No Tenancy Created",
        "Termination and Possession",
        "Registration and Stamp Duty",
        "Governing Law"
    ]
};
