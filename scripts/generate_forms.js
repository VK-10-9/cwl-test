const fs = require('fs');
const path = require('path');

const formsDir = path.join(__dirname, '..', 'lib', 'gfe', 'forms');

const formExports = [
    'BNSS_FORM_1',
    'BNSS_FORM_2',
    'BNSS_FORM_3',
    'BNSS_FORM_4'
];

for (let i = 5; i <= 56; i++) {
    const formName = 'BNSS_FORM_' + i;
    formExports.push(formName);

    const content = 'import { FormDefinition } from "../schema";\n\n' +
        'export const ' + formName + ': FormDefinition = {\n' +
        '  id: "BNSS_2023_SCH2_FORM_' + i + '",\n' +
        '  act: "Bharatiya Nagarik Suraksha Sanhita, 2023",\n' +
        '  sectionReference: "Second Schedule",\n' +
        '  formNumber: "FORM ' + i + '",\n' +
        '  title: "BNSS FORM ' + i + ' (Generated Statutory Model)",\n' +
        '  version: 1,\n' +
        '  effectiveDate: "2024-07-01",\n' +
        '  guardrails: [\n' +
        '    {\n' +
        '      id: "G-BNSS-F' + i + '-01",\n' +
        '      severity: "info",\n' +
        '      message: "Standard statutory compliance rules apply. Ensure context extraction matches legal requirements.",\n' +
        '    },\n' +
        '  ],\n' +
        '  fields: [\n' +
        '    {\n' +
        '      key: "applicantName",\n' +
        '      label: "Name of Applicant / Accused",\n' +
        '      type: "person_name",\n' +
        '      required: true,\n' +
        '      placeholder: "e.g., Rajesh Kumar",\n' +
        '    },\n' +
        '    {\n' +
        '      key: "addressContext",\n' +
        '      label: "Address Context",\n' +
        '      type: "address",\n' +
        '      required: true,\n' +
        '      placeholder: "Full registered address",\n' +
        '    },\n' +
        '    {\n' +
        '      key: "courtName",\n' +
        '      label: "Jurisdiction / Court",\n' +
        '      type: "court_name",\n' +
        '      required: true,\n' +
        '      placeholder: "e.g., Chief Judicial Magistrate",\n' +
        '    },\n' +
        '    {\n' +
        '      key: "issueDate",\n' +
        '      label: "Date of Issue",\n' +
        '      type: "date",\n' +
        '      required: true,\n' +
        '    },\n' +
        '    {\n' +
        '      key: "offenceDetails",\n' +
        '      label: "Offence Particulars",\n' +
        '      type: "textarea",\n' +
        '      required: false,\n' +
        '      placeholder: "Details of sections...",\n' +
        '    }\n' +
        '  ],\n' +
        '  templateText: `\n' +
        'To {{applicantName}} of {{addressContext}}.\n\n' +
        'WHEREAS the above context has been brought before the jurisdiction of {{courtName}}.\n\n' +
        'Details of the matter: {{offenceDetails}}\n\n' +
        'This document assumes the legal power and structure of Form ' + i + ' as per the Second Schedule of the Bharatiya Nagarik Suraksha Sanhita, 2023.\n\n' +
        'Dated, this {{issueDate}}.\n\n' +
        '(Seal of the Court)                                       (Signature)\n' +
        '  `,\n' +
        '};\n';

    fs.writeFileSync(path.join(formsDir, 'bnss-' + i + '.ts'), content);
}

// Generate index.ts
let indexContent = '';
for (let i = 1; i <= 56; i++) {
    indexContent += 'import { BNSS_FORM_' + i + ' } from "./bnss-' + i + '";\n';
}

indexContent += '\nimport { FormDefinition } from "../schema";\n\n' +
    'export const AVAILABLE_FORMS: FormDefinition[] = [\n';

for (let i = 1; i <= 56; i++) {
    indexContent += '  BNSS_FORM_' + i + ',\n';
}

indexContent += '];\n\n' +
    '// Helper to get form by ID\n' +
    'export function getFormById(id: string): FormDefinition | undefined {\n' +
    '  return AVAILABLE_FORMS.find((form) => form.id === id);\n}\n';

fs.writeFileSync(path.join(formsDir, 'index.ts'), indexContent);

console.log('Successfully generated Forms 5-56 as active models');
