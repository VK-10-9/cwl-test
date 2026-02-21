"use client";

import type { Blueprint, RiskLevel } from "@/types";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

interface BlueprintViewerProps {
  blueprint: Blueprint;
  onToggleClause: (clauseId: string) => void;
  onApprove: () => void;
  isLoading: boolean;
}

const riskColors: Record<RiskLevel, string> = {
  low: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  medium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  high: "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

export default function BlueprintViewer({ blueprint, onToggleClause, onApprove, isLoading }: BlueprintViewerProps) {
  return (
    <div className="space-y-8 animate-fade-in relative z-10 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Blueprint Review</h2>
        <span className="text-xs text-muted-foreground uppercase tracking-widest">{blueprint.clauses.length} Clauses Generated</span>
      </div>

      <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2">
        {blueprint.clauses.map((clause) => (
          <div
            key={clause.id}
            className="group bg-card border border-border hover:border-primary/30 rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            onClick={() => onToggleClause(clause.id)}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                {clause.title}

              </h3>
              <span className={`px-2 py-1 rounded text-xs font-medium border ${riskColors[clause.risk]}`}>
                {clause.risk.toUpperCase()} Risk
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {clause.content || clause.description}
            </p>

            {/* Toggle Switch */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-4 rounded-full relative transition-colors ${clause.included ? 'bg-primary' : 'bg-muted'}`}>
                <div className={`absolute top-0.5 w-3 h-3 bg-foreground rounded-full transition-transform ${clause.included ? 'left-4.5 translate-x-0' : 'left-0.5'}`} />
              </div>
              <span className="text-xs text-muted-foreground">{clause.included ? 'Included' : 'Excluded'}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-border flex justify-end">
        <LiquidButton
          onClick={onApprove}
          disabled={isLoading}
          className="text-primary-foreground bg-primary hover:bg-primary/90 px-8 py-3"
          size={'lg'}
          variant="default"
        >
          {isLoading ? "Generating Document..." : "Approve & Generate Document →"}
        </LiquidButton>
      </div>
    </div>
  );
}
