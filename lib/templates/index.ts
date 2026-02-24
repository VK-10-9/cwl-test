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
    mou: mouTemplate,
    "consultancy-agreement": consultancyAgreementTemplate,
    "service-agreement": serviceAgreementTemplate,
    "saas-agreement": saasAgreementTemplate,
    "software-license": softwareLicenseTemplate,
    "white-label-agreement": whiteLabelTemplate,
    "maintenance-agreement": maintenanceAgreementTemplate,
    "offer-letter": offerLetterTemplate,
    "appointment-letter": appointmentLetterTemplate,
    "relieving-letter": relievingLetterTemplate,
    "termination-letter": terminationLetterTemplate,
    "experience-letter": experienceLetterTemplate,
    "internship-letter": internshipLetterTemplate,
    "posh-policy": poshPolicyTemplate,
    "ethics-code": ethicsCodeTemplate,
    "fnf-settlement": fnfSettlementTemplate,
    "payment-reminder": paymentReminderTemplate,
    "esop-grant": esopGrantTemplate,
    "share-allotment": shareAllotmentTemplate,
    "isafe-note": isafeNoteTemplate,
    sha: shaTemplate,
    "term-sheet": termSheetTemplate,
    "founders-deed": foundersDeedTemplate,
    loi: loiTemplate,
    "vendor-onboarding": vendorOnboardingTemplate,
    "co-founder-agreement": coFounderAgreementTemplate,
    "influencer-agreement": influencerAgreementTemplate,
    "affiliate-agreement": { ...genericMarketingTemplate, type: "affiliate-agreement", label: "Affiliate Agreement" },
    "sponsorship-agreement": { ...genericMarketingTemplate, type: "sponsorship-agreement", label: "Sponsorship Agreement" },
    "rent-agreement": rentAgreementTemplate,
    "commercial-lease": commercialLeaseTemplate,
    "leave-license": leaveLicenseTemplate,
    "eviction-notice": evictionNoticeTemplate,
    "startup-india": startupIndiaTemplate,
    "gst-bank-letter": gstBankLetterTemplate,
    "board-resolution": boardResolutionTemplate,
    "legal-notice": legalNoticeTemplate,
    "breach-notice": breachNoticeTemplate,
    "ip-assignment": ipAssignmentTemplate,
    gpa: gpaTemplate,
    "data-breach-notice": dataBreachNoticeTemplate,
    "section-138-notice": section138NoticeTemplate,
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
