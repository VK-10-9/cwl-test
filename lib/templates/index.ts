import type { DocumentTemplate, DocumentType } from "@/types";
import { ndaTemplate } from "./nda";
import { mouTemplate } from "./mou";
import { consultancyAgreementTemplate } from "./consultancy-agreement";
import { serviceAgreementTemplate } from "./service-agreement";
import { offerLetterTemplate } from "./offer-letter";
import { appointmentLetterTemplate } from "./appointment-letter";
import { relievingLetterTemplate } from "./relieving-letter";
import { terminationLetterTemplate } from "./termination-letter";
import { experienceLetterTemplate } from "./experience-letter";
import { internshipLetterTemplate } from "./internship-letter";
import { paymentReminderTemplate } from "./payment-reminder";
import { esopGrantTemplate } from "./esop-grant";
import { shareAllotmentTemplate } from "./share-allotment";
import { legalNoticeTemplate } from "./legal-notice";
import { breachNoticeTemplate } from "./breach-notice";
import { ipAssignmentTemplate } from "./ip-assignment";
import { loiTemplate } from "./loi";
import { vendorOnboardingTemplate } from "./vendor-onboarding";
import { coFounderAgreementTemplate } from "./co-founder-agreement";
import { startupIndiaTemplate } from "./startup-india";
import { gstBankLetterTemplate } from "./gst-bank-letter";
import { boardResolutionTemplate } from "./board-resolution";
import { isafeNoteTemplate } from "./isafe-note";
import { shaTemplate } from "./sha";
import { termSheetTemplate } from "./term-sheet";
import { foundersDeedTemplate } from "./founders-deed";
import { rentAgreementTemplate } from "./rent-agreement";
import { commercialLeaseTemplate } from "./commercial-lease";
import { saasAgreementTemplate } from "./saas-agreement";
import { softwareLicenseTemplate } from "./software-license";
import { ethicsCodeTemplate } from "./ethics-code";
import { fnfSettlementTemplate } from "./fnf-settlement";
import { poshPolicyTemplate } from "./posh-policy";
import { influencerAgreementTemplate } from "./influencer-agreement";
import { section138NoticeTemplate } from "./section-138-notice";
import { genericMarketingTemplate } from "./marketing-generic";
import { gpaTemplate } from "./gpa";
import { dataBreachNoticeTemplate } from "./data-breach-notice";
import { whiteLabelTemplate } from "./white-label-agreement";
import { maintenanceAgreementTemplate } from "./maintenance-agreement";
import { leaveLicenseTemplate } from "./leave-license";
import { evictionNoticeTemplate } from "./eviction-notice";

export const templates: Record<DocumentType, DocumentTemplate> = {
    nda: ndaTemplate,
    "pitch-deck-nda": { ...genericMarketingTemplate, type: "pitch-deck-nda", label: "Pitch Deck NDA" },
    mou: mouTemplate,
    "consultancy-agreement": consultancyAgreementTemplate,
    "independent-contractor": { ...genericMarketingTemplate, type: "independent-contractor", label: "Independent Contractor Agreement" },
    "service-agreement": serviceAgreementTemplate,
    msa: { ...genericMarketingTemplate, type: "msa", label: "Master Service Agreement" },
    "franchise-agreement": { ...genericMarketingTemplate, type: "franchise-agreement", label: "Franchise Agreement" },
    "saas-agreement": saasAgreementTemplate,
    eula: { ...genericMarketingTemplate, type: "eula", label: "End User License Agreement" },
    "software-license": softwareLicenseTemplate,
    "white-label-agreement": whiteLabelTemplate,
    "maintenance-agreement": maintenanceAgreementTemplate,
    "offer-letter": offerLetterTemplate,
    "appointment-letter": appointmentLetterTemplate,
    "non-compete": { ...genericMarketingTemplate, type: "non-compete", label: "Non-Compete Agreement" },
    "non-solicitation": { ...genericMarketingTemplate, type: "non-solicitation", label: "Non-Solicitation Agreement" },
    "esop-policy": { ...genericMarketingTemplate, type: "esop-policy", label: "ESOP Policy Document" },
    "relieving-letter": relievingLetterTemplate,
    "termination-letter": terminationLetterTemplate,
    "experience-letter": experienceLetterTemplate,
    "internship-offer-letter": { ...genericMarketingTemplate, type: "internship-offer-letter", label: "Internship Offer Letter" },
    "internship-letter": internshipLetterTemplate,
    "employee-handbook": { ...genericMarketingTemplate, type: "employee-handbook", label: "Employee Handbook" },
    "remote-work-agreement": { ...genericMarketingTemplate, type: "remote-work-agreement", label: "Remote Work Agreement" },
    "warning-letter": { ...genericMarketingTemplate, type: "warning-letter", label: "Warning Letter" },
    "promotion-letter": { ...genericMarketingTemplate, type: "promotion-letter", label: "Promotion Letter" },
    "posh-policy": poshPolicyTemplate,
    "ethics-code": ethicsCodeTemplate,
    "fnf-settlement": fnfSettlementTemplate,
    "term-sheet": termSheetTemplate,
    "safe-note": { ...genericMarketingTemplate, type: "safe-note", label: "SAFE Note" },
    "convertible-note": { ...genericMarketingTemplate, type: "convertible-note", label: "Convertible Note" },
    "investor-rights": { ...genericMarketingTemplate, type: "investor-rights", label: "Investor Rights Agreement" },
    "due-diligence-request": { ...genericMarketingTemplate, type: "due-diligence-request", label: "Due Diligence Request Letter" },
    "founder-declaration": { ...genericMarketingTemplate, type: "founder-declaration", label: "Founder Declaration Letter" },
    "payment-reminder": paymentReminderTemplate,
    "esop-grant": esopGrantTemplate,
    "share-allotment": shareAllotmentTemplate,
    "cap-table": { ...genericMarketingTemplate, type: "cap-table", label: "Cap Table Template" },
    "isafe-note": isafeNoteTemplate,
    sha: shaTemplate,
    "founder-vesting": { ...genericMarketingTemplate, type: "founder-vesting", label: "Founder Vesting Agreement" },
    "founder-exit": { ...genericMarketingTemplate, type: "founder-exit", label: "Founder Exit Agreement" },
    "buyback-agreement": { ...genericMarketingTemplate, type: "buyback-agreement", label: "Buyback Agreement" },
    "subscription-agreement": { ...genericMarketingTemplate, type: "subscription-agreement", label: "Subscription Agreement" },
    "founders-deed": foundersDeedTemplate,
    "fast-agreement": { ...genericMarketingTemplate, type: "fast-agreement", label: "FAST Agreement" },
    "advisory-board": { ...genericMarketingTemplate, type: "advisory-board", label: "Advisory Board Agreement" },
    loi: loiTemplate,
    "vendor-onboarding": vendorOnboardingTemplate,
    "co-founder-agreement": coFounderAgreementTemplate,
    "reseller-agreement": { ...genericMarketingTemplate, type: "reseller-agreement", label: "Reseller Agreement" },
    "influencer-agreement": influencerAgreementTemplate,
    "affiliate-agreement": { ...genericMarketingTemplate, type: "affiliate-agreement", label: "Affiliate Agreement" },
    "sponsorship-agreement": { ...genericMarketingTemplate, type: "sponsorship-agreement", label: "Sponsorship Agreement" },
    "sales-commission": { ...genericMarketingTemplate, type: "sales-commission", label: "Sales Commission Agreement" },
    "channel-partner": { ...genericMarketingTemplate, type: "channel-partner", label: "Channel Partner Agreement" },
    "marketing-retainer": { ...genericMarketingTemplate, type: "marketing-retainer", label: "Marketing Retainer Agreement" },
    "rent-agreement": rentAgreementTemplate,
    "commercial-lease": commercialLeaseTemplate,
    "leave-license": leaveLicenseTemplate,
    "eviction-notice": evictionNoticeTemplate,
    "startup-india": startupIndiaTemplate,
    "gst-bank-letter": gstBankLetterTemplate,
    "founder-minutes": { ...genericMarketingTemplate, type: "founder-minutes", label: "Founders' Meeting Minutes" },
    "share-transfer": { ...genericMarketingTemplate, type: "share-transfer", label: "Share Transfer Agreement" },
    "nominee-director": { ...genericMarketingTemplate, type: "nominee-director", label: "Nominee Director Agreement" },
    "employment-bond": { ...genericMarketingTemplate, type: "employment-bond", label: "Employment Bond Agreement" },
    "confidentiality-reminder": { ...genericMarketingTemplate, type: "confidentiality-reminder", label: "Confidentiality Reminder Notice" },
    "board-resolution": boardResolutionTemplate,
    "director-resignation": { ...genericMarketingTemplate, type: "director-resignation", label: "Director Resignation Letter" },
    "founder-loan": { ...genericMarketingTemplate, type: "founder-loan", label: "Founder Loan Agreement" },
    "inter-corporate-loan": { ...genericMarketingTemplate, type: "inter-corporate-loan", label: "Inter-Corporate Loan Agreement" },
    "loan-acknowledgement": { ...genericMarketingTemplate, type: "loan-acknowledgement", label: "Loan Acknowledgement Letter" },
    "settlement-agreement": { ...genericMarketingTemplate, type: "settlement-agreement", label: "Settlement Agreement" },
    "arbitration-notice": { ...genericMarketingTemplate, type: "arbitration-notice", label: "Arbitration Notice" },
    "demand-payment": { ...genericMarketingTemplate, type: "demand-payment", label: "Demand for Payment Notice" },
    "notice-of-default": { ...genericMarketingTemplate, type: "notice-of-default", label: "Notice of Default" },
    "legal-notice": legalNoticeTemplate,
    "breach-notice": breachNoticeTemplate,
    "cease-and-desist": { ...genericMarketingTemplate, type: "cease-and-desist", label: "Cease & Desist Notice" },
    "website-disclaimer": { ...genericMarketingTemplate, type: "website-disclaimer", label: "Website Disclaimer" },
    "bug-bounty": { ...genericMarketingTemplate, type: "bug-bounty", label: "Bug Bounty Policy" },
    "dmca-takedown": { ...genericMarketingTemplate, type: "dmca-takedown", label: "DMCA Takedown Notice" },
    "ip-assignment": ipAssignmentTemplate,
    gpa: gpaTemplate,
    "data-breach-notice": dataBreachNoticeTemplate,
    "section-138-notice": section138NoticeTemplate,
    "data-processing-agreement": { ...genericMarketingTemplate, type: "data-processing-agreement", label: "Data Processing Agreement" },
    "software-development": { ...genericMarketingTemplate, type: "software-development", label: "Software Development Agreement" },
    "api-usage-agreement": { ...genericMarketingTemplate, type: "api-usage-agreement", label: "API Usage Agreement" },
    "open-source-contribution": { ...genericMarketingTemplate, type: "open-source-contribution", label: "Open Source Contribution" },
    "tech-transfer": { ...genericMarketingTemplate, type: "tech-transfer", label: "Technology Transfer Agreement" },
    "international-nda": { ...genericMarketingTemplate, type: "international-nda", label: "International NDA" },
    "export-agreement": { ...genericMarketingTemplate, type: "export-agreement", label: "Export Agreement" },
    "cross-border-service": { ...genericMarketingTemplate, type: "cross-border-service", label: "Cross-Border Service Agreement" },
};

export function getTemplate(type: DocumentType): DocumentTemplate {
    const template = templates[type];
    if (!template) {
        throw new Error(`Template for type ${type} not found`);
    }
    return template;
}

export {
    ndaTemplate,
    mouTemplate,
    consultancyAgreementTemplate,
    serviceAgreementTemplate,
    saasAgreementTemplate,
    softwareLicenseTemplate,
    whiteLabelTemplate,
    maintenanceAgreementTemplate,
    offerLetterTemplate,
    appointmentLetterTemplate,
    relievingLetterTemplate,
    terminationLetterTemplate,
    experienceLetterTemplate,
    internshipLetterTemplate,
    poshPolicyTemplate,
    ethicsCodeTemplate,
    fnfSettlementTemplate,
    paymentReminderTemplate,
    esopGrantTemplate,
    shareAllotmentTemplate,
    isafeNoteTemplate,
    shaTemplate,
    termSheetTemplate,
    foundersDeedTemplate,
    loiTemplate,
    vendorOnboardingTemplate,
    coFounderAgreementTemplate,
    influencerAgreementTemplate,
    genericMarketingTemplate,
    rentAgreementTemplate,
    commercialLeaseTemplate,
    leaveLicenseTemplate,
    evictionNoticeTemplate,
    startupIndiaTemplate,
    gstBankLetterTemplate,
    boardResolutionTemplate,
    legalNoticeTemplate,
    breachNoticeTemplate,
    ipAssignmentTemplate,
    gpaTemplate,
    dataBreachNoticeTemplate,
    section138NoticeTemplate,
};
