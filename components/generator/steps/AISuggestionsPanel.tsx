import { motion } from "framer-motion";
import { Sparkles, Plus, AlertCircle, Info, Check } from "lucide-react";
import { ClauseSuggestion } from "@/lib/ai/clause-suggestions";
import { Button } from "@/components/ui/button";

interface AISuggestionsPanelProps {
    suggestions: ClauseSuggestion[];
    onAdd: (suggestion: ClauseSuggestion) => void;
}

export function AISuggestionsPanel({ suggestions, onAdd }: AISuggestionsPanelProps) {
    if (suggestions.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 shrink-0 hidden lg:flex flex-col gap-4 sticky top-4 h-[calc(100vh-420px)]"
        >
            <div className="flex items-center gap-2 px-3 pb-2 border-b border-border/40">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-mono font-bold tracking-widest text-foreground uppercase">AI_SUGGESTIONS</h3>
                <span className="flex items-center justify-center h-4 w-4 rounded-full bg-primary/10 text-[10px] text-primary font-mono">
                    {suggestions.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-hide">
                {suggestions.map((s, i) => (
                    <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 rounded-xl border border-primary/20 bg-primary/[0.02] hover:bg-primary/[0.04] transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Sparkles className="h-3 w-3 text-primary/40 animate-pulse" />
                        </div>
                        
                        <div className="flex items-start gap-3 mb-2">
                             <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Plus className="h-3.5 w-3.5 text-primary" />
                             </div>
                             <h4 className="text-sm font-semibold tracking-tight leading-tight">{s.title}</h4>
                        </div>
                        
                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                            {s.description}
                        </p>

                        <div className="flex items-start gap-2 p-2 rounded bg-background/50 border border-border/40 mb-3">
                            <Info className="h-3 w-3 text-primary/60 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-muted-foreground/80 leading-snug italic">
                                {s.reason}
                            </p>
                        </div>

                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onAdd(s)}
                            className="w-full h-8 text-[11px] font-mono border-primary/20 hover:bg-primary hover:text-black hover:border-transparent transition-all gap-1.5"
                        >
                            <Plus className="h-3 w-3" />
                            ADD_TO_BLUEPRINT
                        </Button>
                    </motion.div>
                ))}
            </div>

            <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                <div className="flex gap-2">
                    <AlertCircle className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                    <p className="text-[10px] text-muted-foreground/60 leading-relaxed italic">
                        These clauses are suggested based on local legal precedents and common disputes in India.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
