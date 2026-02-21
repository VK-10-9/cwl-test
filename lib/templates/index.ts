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

export const templates: Record<DocumentType, DocumentTemplate> = {
    nda: ndaTemplate,
    mou: mouTemplate,
    "consultancy-agreement": consultancyAgreementTemplate,
    "service-agreement": serviceAgreementTemplate,
    "offer-letter": offerLetterTemplate,
    "appointment-letter": appointmentLetterTemplate,
    "relieving-letter": relievingLetterTemplate,
    "termination-letter": terminationLetterTemplate,
    "experience-letter": experienceLetterTemplate,
    "internship-letter": internshipLetterTemplate,
    "payment-reminder": paymentReminderTemplate,
    "esop-grant": esopGrantTemplate,
    "share-allotment": shareAllotmentTemplate,
    "legal-notice": legalNoticeTemplate,
    "breach-notice": breachNoticeTemplate,
    "ip-assignment": ipAssignmentTemplate,
    loi: loiTemplate,
    "vendor-onboarding": vendorOnboardingTemplate,
    "co-founder-agreement": coFounderAgreementTemplate,
    "startup-india": startupIndiaTemplate,
    "gst-bank-letter": gstBankLetterTemplate,
    "board-resolution": boardResolutionTemplate,
};

export function getTemplate(type: DocumentType): DocumentTemplate {
    return templates[type];
}

export {
    ndaTemplate,
    mouTemplate,
    consultancyAgreementTemplate,
    serviceAgreementTemplate,
    offerLetterTemplate,
    appointmentLetterTemplate,
    relievingLetterTemplate,
    terminationLetterTemplate,
    experienceLetterTemplate,
    internshipLetterTemplate,
    paymentReminderTemplate,
    esopGrantTemplate,
    shareAllotmentTemplate,
    legalNoticeTemplate,
    breachNoticeTemplate,
    ipAssignmentTemplate,
    loiTemplate,
    vendorOnboardingTemplate,
    coFounderAgreementTemplate,
    startupIndiaTemplate,
    gstBankLetterTemplate,
    boardResolutionTemplate,
};
