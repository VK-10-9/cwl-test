import { FormDefinition } from "../schema";

export const BNSS_FORM_2: FormDefinition = {
    id: "BNSS_2023_SCH2_FORM_2",
    act: "Bharatiya Nagarik Suraksha Sanhita, 2023",
    sectionReference: "Section 72",
    formNumber: "FORM 2",
    title: "WARRANT OF ARREST",
    version: 1,
    effectiveDate: "2024-07-01",
    guardrails: [
        {
            id: "G-BNSS-F2-01",
            severity: "critical",
            message: "This warrant must be directed to one or more police officers. (See Section 72(1))",
        },
        {
            id: "G-BNSS-F2-02",
            severity: "warning",
            message: "Endorsement (if any) should be made only under the direction of the Court issuing the warrant. (See Section 73)",
        },
    ],
    fields: [
        {
            key: "officerName",
            label: "Name of Police Officer",
            type: "person_name",
            required: true,
            placeholder: "e.g., Inspector Vikram Singh",
        },
        {
            key: "officerDesignation",
            label: "Designation of Police Officer",
            type: "text",
            required: true,
            placeholder: "e.g., Inspector of Police",
        },
        {
            key: "accusedName",
            label: "Name of Accused",
            type: "person_name",
            required: true,
            placeholder: "e.g., Ramesh Patel",
        },
        {
            key: "accusedAddress",
            label: "Address of Accused",
            type: "address",
            required: true,
            placeholder: "Full residential address",
        },
        {
            key: "offenceDescription",
            label: "Statement of Offence",
            type: "textarea",
            required: true,
            placeholder: "Charge for which arrest is ordered",
        },
        {
            key: "issueDate",
            label: "Date of Issue",
            type: "date",
            required: true,
        },
        {
            key: "endorsementAmount",
            label: "Bail Endorsement Amount (Optional)",
            type: "number",
            required: false,
            placeholder: "Amount in Rupees",
            validationMessage: "Leave blank if non-bailable",
        },
        {
            key: "endorsementSuretyCount",
            label: "Number of Sureties (Optional)",
            type: "number",
            required: false,
            placeholder: "e.g., 2",
        }
    ],
    templateText: `
To {{officerName}}, {{officerDesignation}}.

WHEREAS {{accusedName}} of {{accusedAddress}} stands charged with the offence of {{offenceDescription}}, you are hereby directed to arrest the said {{accusedName}}, and to produce him before me. Herein fail not.

Dated, this {{issueDate}}.

(Seal of the Court)                                       (Signature)

------------------------------------------------------------------------------------------------
ENDORSEMENT (If Any)

This warrant may be endorsed as follows:—

If the said {{accusedName}} shall give bail himself in the sum of rupees {{endorsementAmount}} with {{endorsementSuretyCount}} surety/sureties each in the like sum, to attend before me on the date fixed and to continue so to attend until otherwise directed by me, he may be released.

Dated, this {{issueDate}}.

(Seal of the Court)                                       (Signature)
  `,
};
