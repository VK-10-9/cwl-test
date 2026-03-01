import { FormDefinition } from "../schema";

export const BNSS_FORM_55: FormDefinition = {
  id: "BNSS_2023_SCH2_FORM_55",
  act: "Bharatiya Nagarik Suraksha Sanhita, 2023",
  sectionReference: "Second Schedule",
  formNumber: "FORM 55",
  title: "BNSS FORM 55 (Generated Statutory Model)",
  version: 1,
  effectiveDate: "2024-07-01",
  guardrails: [
    {
      id: "G-BNSS-F55-01",
      severity: "info",
      message: "Standard statutory compliance rules apply. Ensure context extraction matches legal requirements.",
    },
  ],
  fields: [
    {
      key: "applicantName",
      label: "Name of Applicant / Accused",
      type: "person_name",
      required: true,
      placeholder: "e.g., Rajesh Kumar",
    },
    {
      key: "addressContext",
      label: "Address Context",
      type: "address",
      required: true,
      placeholder: "Full registered address",
    },
    {
      key: "courtName",
      label: "Jurisdiction / Court",
      type: "court_name",
      required: true,
      placeholder: "e.g., Chief Judicial Magistrate",
    },
    {
      key: "issueDate",
      label: "Date of Issue",
      type: "date",
      required: true,
    },
    {
      key: "offenceDetails",
      label: "Offence Particulars",
      type: "textarea",
      required: false,
      placeholder: "Details of sections...",
    }
  ],
  templateText: `
To {{applicantName}} of {{addressContext}}.

WHEREAS the above context has been brought before the jurisdiction of {{courtName}}.

Details of the matter: {{offenceDetails}}

This document assumes the legal power and structure of Form 55 as per the Second Schedule of the Bharatiya Nagarik Suraksha Sanhita, 2023.

Dated, this {{issueDate}}.

(Seal of the Court)                                       (Signature)
  `,
};
