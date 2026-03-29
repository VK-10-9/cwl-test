import { DocumentType, BlueprintClause, RiskLevel } from "@/types";

export interface ClauseSuggestion {
    id: string;
    title: string;
    description: string;
    reason: string;
    risk: RiskLevel;
    content: string;
}

const COMMON_SUGGESTIONS: Record<string, ClauseSuggestion[]> = {
    "rent-agreement": [
        {
            id: "suggest_lock_in",
            title: "Lock-in Period",
            description: "Specify a minimum period during which neither party can terminate the agreement.",
            reason: "Recommended for long-term stability for both owner and tenant.",
            risk: "low",
            content: "Both the Licensor and the Licensee agree that there shall be a lock-in period of [LOCK_IN_MONTHS] months from the commencement date. During this period, neither party shall be entitled to terminate this agreement."
        },
        {
            id: "suggest_maintenance",
            title: "Society Maintenance Charges",
            description: "Clarify who pays the monthly society maintenance fees.",
            reason: "Prevents future disputes over non-rent utility/society costs.",
            risk: "low",
            content: "The monthly society maintenance charges as levied by the Co-operative Housing Society shall be borne and paid exclusively by the [PAYER_PARTY] over and above the monthly license fee."
        },
        {
            id: "suggest_pet_policy",
            title: "Pet Policy",
            description: "Explicitly state whether pets are allowed in the premises.",
            reason: "Highly requested for residential agreements to avoid 'no-pet' eviction threats.",
            risk: "low",
            content: "The Licensee [IS/IS_NOT] permitted to keep domestic pets in the Scheduled Premises. If permitted, the Licensee ensures no nuisance is caused to the neighbors."
        }
    ],
    "nda": [
        {
            id: "suggest_non_solicit",
            title: "Non-Solicitation of Employees",
            description: "Prevents the other party from poaching your employees after seeing your operations.",
            reason: "Crucial for service providers and tech startups sharing IP.",
            risk: "medium",
            content: "During the term of this Agreement and for a period of [MONTHS] months thereafter, neither Party shall directly or indirectly solicit for employment any employee of the other Party involved in the Evaluation."
        },
        {
            id: "suggest_return_info",
            title: "Mandatory Return of Information",
            description: "Requires the other party to return/destroy data upon request.",
            reason: "Essential for physical or high-security data sharing.",
            risk: "low",
            content: "Upon written request by the Disclosing Party, the Receiving Party shall promptly return or destroy all Confidential Information and provide written certification of such destruction."
        }
    ],
    "co-founder-agreement": [
        {
            id: "suggest_vesting",
            title: "Reverse Vesting Schedule",
            description: "Ensures founders earn their equity over time (e.g., 4-year vest).",
            reason: "Protects the company if a founder leaves early with a large chunk of equity.",
            risk: "high",
            content: "The Founder Shares shall be subject to reverse vesting over a period of 48 months with a 12-month cliff. If a Founder leaves before full vesting, the Company has the right to buy back unvested shares at par value."
        },
        {
            id: "suggest_ip_assignment",
            title: "IP Assignment Warranty",
            description: "Guarantees that all IP created for the startup belongs to the company.",
            reason: "Venture Capitalists always look for this during due diligence.",
            risk: "high",
            content: "Each Founder hereby irrevocably assigns to the Company all right, title, and interest in and to any intellectual property created, developed, or conceived in connection with the Startup."
        }
    ]
};

export function getClauseSuggestions(docType: DocumentType, currentClauses: BlueprintClause[]): ClauseSuggestion[] {
    const suggestions = COMMON_SUGGESTIONS[docType as string] || [];
    
    // Filter out suggestions that are already in the blueprint (by title similarity or ID)
    return suggestions.filter(s => 
        !currentClauses.some(c => 
            c.title.toLowerCase().includes(s.title.toLowerCase()) || 
            c.id === s.id
        )
    );
}
