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
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Blueprint Review</h2>
        <span className="text-xs text-slate-400 uppercase tracking-widest">{blueprint.clauses.length} Clauses Generated</span>
      </div>

      <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {blueprint.clauses.map((clause) => (
          <div
            key={clause.id}
            className="group bg-white/5 border border-white/10 hover:border-indigo-500/30 rounded-xl p-5 hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer"
            onClick={() => onToggleClause(clause.id)}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                {clause.title}

              </h3>
              <span className={`px-2 py-1 rounded text-xs font-medium border ${riskColors[clause.risk]}`}>
                {clause.risk.toUpperCase()} Risk
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4 group-hover:text-slate-300 transition-colors">
              {clause.content || clause.description}
            </p>

            {/* Toggle Switch (Visual Only since onToggleClause is passed) */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-4 rounded-full relative transition-colors ${clause.included ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${clause.included ? 'left-4.5 translate-x-0' : 'left-0.5'}`} />
              </div>
              <span className="text-xs text-slate-500">{clause.included ? 'Included' : 'Excluded'}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-white/10 flex justify-end">
        <LiquidButton
          onClick={onApprove}
          disabled={isLoading}
          className="text-white border-white/20 hover:bg-white/10 px-8 py-3"
          size={'lg'}
          variant="ghost"
        >
          {isLoading ? "Generating Document..." : "Approve & Generate Document →"}
        </LiquidButton>
      </div>
    </div>
  );
}
