import { FormDefinition } from "../schema";

export const BNSS_FORM_1: FormDefinition = {
    id: "BNSS_2023_SCH2_FORM_1",
    act: "Bharatiya Nagarik Suraksha Sanhita, 2023",
    sectionReference: "Section 64",
    formNumber: "FORM 1",
    title: "SUMMONS TO AN ACCUSED PERSON",
    version: 1,
    effectiveDate: "2024-07-01", // BNSS effective date
    guardrails: [
        {
            id: "G-BNSS-F1-01",
            severity: "warning",
            message: "This summons must be served by a police officer, or an officer of the court, or other public servant. (See Section 65(1))",
        },
        {
            id: "G-BNSS-F1-02",
            severity: "critical",
            message: "Ensure the exact details of the offence are mentioned briefly. Misrepresentation can invalidate the summons.",
        },
    ],
    fields: [
        {
            key: "accusedName",
            label: "Name of Accused",
            type: "person_name",
            required: true,
            placeholder: "e.g., Rajesh Kumar",
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
            label: "Statement of Offence Charged",
            type: "textarea",
            required: true,
            placeholder: "State shortly the offence charged",
        },
        {
            key: "courtOrMagistrate",
            label: "Magistrate / Court Name",
            type: "court_name",
            required: true,
            placeholder: "e.g., Chief Judicial Magistrate",
        },
        {
            key: "appearanceDate",
            label: "Date of Appearance",
            type: "date",
            required: true,
        },
        {
            key: "issueDate",
            label: "Date of Issue",
            type: "date",
            required: true,
        },
    ],
    templateText: `
To {{accusedName}} of {{accusedAddress}}

WHEREAS your attendance is necessary to answer to a charge of {{offenceDescription}}, you are hereby required to appear in person (or by pleader, as the case may be) before the {{courtOrMagistrate}}, on the {{appearanceDate}}. 

Herein fail not.

Dated, this {{issueDate}}.

(Seal of the Court)                                       (Signature)
  `,
};
