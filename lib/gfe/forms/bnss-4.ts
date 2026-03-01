import { FormDefinition } from "../schema";

export const BNSS_FORM_4: FormDefinition = {
    id: "BNSS_2023_SCH2_FORM_4",
    act: "Bharatiya Nagarik Suraksha Sanhita, 2023",
    sectionReference: "Section 84",
    formNumber: "FORM 4",
    title: "PROCLAMATION REQUIRING THE APPEARANCE OF A PERSON ACCUSED",
    version: 1,
    effectiveDate: "2024-07-01",
    guardrails: [
        {
            id: "G-BNSS-F4-01",
            severity: "critical",
            message: "The time specified for appearance must not be less than thirty days from the date of publishing such proclamation. (See Section 84(1))",
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
            label: "Statement of Offence",
            type: "textarea",
            required: true,
            placeholder: "Details of the complaint",
        },
        {
            key: "appearanceLocation",
            label: "Place of Appearance",
            type: "court_name",
            required: true,
            placeholder: "e.g., Chief Judicial Magistrate Court",
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
WHEREAS complaint has been made before me that {{accusedName}} of {{accusedAddress}} has committed (or is suspected to have committed) the offence of {{offenceDescription}}, punishable under _ of the _, and it has been returned to a warrant of arrest thereupon issued that the said {{accusedName}} cannot be found, and whereas it has been shown to my satisfaction that the said {{accusedName}} has absconded (or is concealing himself to avoid the service of the said warrant);

Proclamation is hereby made that the said {{accusedName}} is required to appear at {{appearanceLocation}} before this Court (or before me) to answer the said complaint on the {{appearanceDate}}.

Dated, this {{issueDate}}.

(Seal of the Court)                                       (Signature)
  `,
};
