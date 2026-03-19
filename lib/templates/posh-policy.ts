import { DocumentTemplate } from "@/types";

export const poshPolicyTemplate: DocumentTemplate = {
    type: "posh-policy",
    label: "POSH Policy",
    description: "Mandatory sexual harassment prevention policy compliant with the Sexual Harassment of Women at Workplace Act, 2013.",
    isTwoParty: false,
    fields: [
        {
            name: "iccMembers",
            label: "Internal Committee (IC) Members",
            type: "textarea",
            required: true,
            placeholder: "List names and designations of IC members."
        },
        {
            name: "presidingOfficer",
            label: "Presiding Officer Name",
            type: "text",
            required: true,
            placeholder: "Must be a senior level woman donor/employee."
        },
        {
            name: "contactEmail",
            label: "Grievance Contact Email",
            type: "text",
            required: true,
            placeholder: "e.g. posh@company.com"
        }
    ],
    defaultClauses: [
        "Objective and Scope",
        "Definition of Sexual Harassment",
        "Internal Committee (IC) Composition",
        "Complaint Mechanism and Redressal",
        "Inquiry Process and Timelines",
        "Confidentiality and Protection against Victimization",
        "Conciliation and Settlement",
        "Action for Misconduct",
        "Employer Responsibilities",
        "Awareness and Training Programs"
    ]
};
