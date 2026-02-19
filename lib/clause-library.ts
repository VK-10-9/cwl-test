
export const STANDARD_CLAUSES = {
    // ─── General / Boilerplate ───────────────────────────────────────────────

    governing_law_india: `
**Governing Law and Jurisdiction.** 
This Agreement shall be governed by and construed in accordance with the laws of India. The courts at [JURISDICTION_CITY] shall have exclusive jurisdiction to adjudicate any dispute arising out of or in connection with this Agreement. The parties hereby submit to the exclusive jurisdiction of such courts.
    `.trim(),

    severability: `
**Severability.** 
If any provision of this Agreement is held to be invalid, illegal or unenforceable, the validity, legality and enforceability of the remaining provisions shall not in any way be affected or impaired thereby. The parties shall replace the invalid provision with a valid provision that comes closest to the intention of the invalid provision.
    `.trim(),

    entire_agreement: `
**Entire Agreement.** 
This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior or contemporaneous oral or written agreements, negotiations, understandings, and representations. This Agreement may not be amended except by a written instrument signed by duly authorized representatives of both parties.
    `.trim(),

    waiver: `
**Waiver.** 
No failure or delay by either party in exercising any right, power, or remedy under this Agreement shall operate as a waiver thereof, nor shall any single or partial exercise of any such right, power, or remedy preclude any other or further exercise thereof or the exercise of any other right, power, or remedy.
    `.trim(),

    // ─── NDA Specific ────────────────────────────────────────────────────────

    // ─── NDA Specific ────────────────────────────────────────────────────────

    confidentiality_definition_broad: `
**Definition of Confidential Information.** 
"Confidential Information" means all non-public, proprietary, or confidential information, whether technical, financial, commercial, or otherwise, disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, or in electronic form, that is designated as confidential OR that a reasonable person would understand to be confidential given the nature of the information and the circumstances of disclosure.
    `.trim(),

    exceptions_standard: `
**Exceptions to Confidential Information.** 
Confidential Information shall not include information that:
(a) is or becomes generally available to the public other than as a result of a disclosure by the Receiving Party;
(b) was available to the Receiving Party on a non-confidential basis prior to its disclosure by the Disclosing Party;
(c) becomes available to the Receiving Party on a non-confidential basis from a person who is not bound by a confidentiality agreement; or
(d) is required to be disclosed by law, court order, or governmental authority, provided that the Receiving Party gives prompt prior written notice to the Disclosing Party (where legally permitted) to enable the Disclosing Party to seek a protective order.
    `.trim(),

    obligations_unilateral: `
**Obligations of Receiving Party.** 
The Receiving Party agrees to:
(a) keep the Confidential Information strictly confidential and not disclose it to any third party without the prior written consent of the Disclosing Party;
(b) use the Confidential Information solely for the Purpose stated in this Agreement;
(c) limit access to the Confidential Information to its employees, directors, or advisors who have a "need to know" and are bound by confidentiality obligations no less restrictive than those contained herein; and
(d) use the same degree of care to protect the Confidential Information as it uses to protect its own confidential information of a similar nature, but in no event less than a reasonable degree of care.
    `.trim(),

    obligations_mutual: `
**Obligations of Parties.** 
Each party (as "Receiving Party") agrees to:
(a) maintain the confidentiality of the Confidential Information of the other party (as "Disclosing Party") and not disclose it to any third party without prior written consent;
(b) use such Confidential Information solely for the Purpose set forth in this Agreement;
(c) restrict access to such Information to its personnel who require access for the Purpose and are bound by confidentiality agreements; and
(d) protect such Information with at least the same degree of care as it uses to protect its own proprietary information, being no less than reasonable care.
    `.trim(),

    obligations_employee: `
**Obligations of Employee.** 
The Employee understands and agrees that their role provides access to the Company's Confidential Information. As such, the Employee agrees to:
(a) Use the Confidential Information solely for the performance of their duties for the Employer;
(b) Not reverse engineer, decompile, or disassemble any software, formulas, or trade secrets of the Employer;
(c) Maintain strict confidentiality and not disclose any such information to third parties; and
(d) Act with a duty of loyalty to the Employer and refrain from any actions that could harm the Employer's business interests or reputation.
    `.trim(),

    remedies_arbitration: `
**Dispute Resolution (Arbitration).** 
Any dispute arising out of or in connection with this Agreement, including any question regarding its existence, validity, or termination, shall be referred to and finally resolved by arbitration in accordance with the Arbitration and Conciliation Act, 1996. The seat and venue of the arbitration shall be [CITY], India. The language of the arbitration shall be English.
    `.trim(),

    remedies_court: `
**Dispute Resolution (Courts).** 
Any dispute arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts at [CITY], India. The parties hereby waive any objection to such venue based on forum non conveniens.
    `.trim(),

    return_of_materials: `
**Return or Destruction of Materials.** 
Upon the termination of this Agreement or written request by the Disclosing Party, the Receiving Party shall promptly return or, at the Disclosing Party's option, destroy all copies of the Confidential Information in its possession or control and certify such return or destruction in writing within fifteen (15) days.
    `.trim(),

    survival_clause: `
**Survival.** 
The obligations of confidentiality under this Agreement shall survive the termination or expiration of this Agreement for a period of [DURATION] years from the date of disclosure, or in perpetuity for trade secrets.
    `.trim(),

    no_license: `
**No License.** 
Nothing in this Agreement shall be construed as granting any rights to the Receiving Party, by license or otherwise, to any Confidential Information or intellectual property rights of the Disclosing Party, except as expressly set forth herein.
    `.trim(),

    data_protection: `
**Data Protection.** 
To the extent that any Confidential Information includes "Personal Information" or "Sensitive Personal Data or Information" (SPDI) as defined under the Information Technology Act, 2000 and the SPDI Rules, 2011, the Receiving Party agrees to comply with all applicable data protection laws and implement reasonable security practices and procedures.
    `.trim(),

    // ─── Risk Controls ───────────────────────────────────────────────────────

    non_solicit: `
**Non-Solicitation.** 
During the Term of this Agreement and for a period of [PERIOD] months thereafter, the Receiving Party shall not, directly or indirectly, solicit, recruit, induce, or attempt to persuade any employee, consultant, or customer of the Disclosing Party to terminate their relationship with the Disclosing Party within India, or to enter into a relationship with the Receiving Party or any third party.
    `.trim(),

    non_compete: `
**Non-Compete.** 
The Receiving Party acknowledges that access to the Confidential Information provides a competitive advantage. Accordingly, during the Term and for a period of [PERIOD] months thereafter, the Receiving Party shall not, directly or indirectly, engage in, invest in, or provide services to any business that competes with the business of the Disclosing Party within [TERRITORY], provided that this restriction shall apply only to the extent enforceable under applicable law (Section 27 of the Indian Contract Act, 1872 or relevant local statute).
    `.trim(),

    ip_assignment_strong: `
**Intellectual Property Assignment.** 
The Receiving Party hereby irrevocably assigns, transfers, and conveys to the Disclosing Party all right, title, and interest in and to any work product created in the course of the relationship, including all intellectual property rights therein, worldwide and in perpetuity. The Receiving Party waives any moral rights to the extent permitted under applicable law (including Section 19(4) of the Copyright Act, 1957) and agrees to execute any further documents necessary to perfect such assignment.
    `.trim(),
};
