import { FormDefinition } from "../schema";

export const BNSS_FORM_3: FormDefinition = {
    id: "BNSS_2023_SCH2_FORM_3",
    act: "Bharatiya Nagarik Suraksha Sanhita, 2023",
    sectionReference: "Section 73",
    formNumber: "FORM 3",
    title: "BOND AND BAIL-BOND AFTER ARREST UNDER A WARRANT",
    version: 1,
    effectiveDate: "2024-07-01",
    guardrails: [
        {
            id: "G-BNSS-F3-01",
            severity: "warning",
            message: "Ensure the sureties named are verified before releasing the accused. (See Section 73)",
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
            key: "officerName",
            label: "Name of Arresting Officer",
            type: "person_name",
            required: true,
            placeholder: "e.g., Inspector Vikram Singh",
        },
        {
            key: "courtName",
            label: "Name of Court",
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
            key: "bondAmount",
            label: "Bond Amount",
            type: "number",
            required: true,
            placeholder: "Amount in Rupees",
        },
        {
            key: "surety1Name",
            label: "Name of Surety 1",
            type: "person_name",
            required: true,
        },
        {
            key: "surety1Address",
            label: "Address of Surety 1",
            type: "address",
            required: true,
        },
        {
            key: "issueDate",
            label: "Date of Execution",
            type: "date",
            required: true,
        },
    ],
    templateText: `
I, {{accusedName}}, of {{accusedAddress}}, being brought before the District Magistrate of (or as the case may be) under a warrant issued to compel my appearance to answer to the charge of _, do hereby bind myself to attend in the Court of {{courtName}} at _ on the {{appearanceDate}} day of _ next, to answer to the said charge, and to continue so to attend until otherwise directed by the Court; and, in case of my making default herein, I bind myself to forfeit, to State Government, the sum of rupees {{bondAmount}}.

Dated, this {{issueDate}}.

(Signature)

I do hereby declare myself surety for the above-named {{accusedName}} of {{accusedAddress}}, that he shall attend before {{courtName}} on the {{appearanceDate}} day of _ next, to answer to the charge on which he has been arrested, and shall continue so to attend until otherwise directed by the Court; and, in case of his making default therein, I bind myself to forfeit, to State Government, the sum of rupees {{bondAmount}}.

Dated, this {{issueDate}}.

(Signature)
  `,
};
