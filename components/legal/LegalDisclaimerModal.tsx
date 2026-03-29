"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, FileText, CheckCircle2, ChevronRight, X, AlertCircle } from "lucide-react";

interface LegalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  documentType: string;
}

export default function LegalDisclaimerModal({ isOpen, onClose, onConfirm, documentType }: LegalDisclaimerModalProps) {
  const [checked, setChecked] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-xl bg-[#0E0E0F] border border-[#1F1F1F] rounded-2xl overflow-hidden pointer-events-auto shadow-2xl relative"
            >
              {/* Header */}
              <div className="p-6 pb-0 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                    <ShieldAlert className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif tracking-tight text-white mb-1">
                      Final Legal Review Required
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Confirm your understanding before exporting for {documentType}.
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex gap-4">
                    <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-white/90">1. Draft Status Notification</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          This document is an AI-generated draft based on the Indian legal framework. It is intended for informational purposes and does not substitute professional legal judgment.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-white/90">2. Professional Review Requirement</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          ClauseWala strongly advises that all exported documents be reviewed by a qualified Indian advocate before execution and registration (where applicable).
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-white/90">3. Limitation of Liability</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          ClauseWala assumes no liability for errors, omissions, or the legal validity of this document if presented in a court of law without prior attorney review.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group select-none">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={checked}
                      onChange={(e) => setChecked(e.target.checked)}
                    />
                    <div className={`w-5 h-5 rounded border transition-all duration-200 ${checked ? 'bg-primary border-primary scale-110 shadow-[0_0_15px_rgba(74,222,128,0.4)]' : 'bg-transparent border-white/20 group-hover:border-white/40'}`} />
                    <CheckCircle2 className={`absolute inset-0 w-3 h-3 m-auto text-black font-bold transition-transform duration-200 ${checked ? 'scale-100' : 'scale-0'}`} />
                  </div>
                  <span className="text-sm text-balance text-white/80 transition-colors group-hover:text-white">
                    I acknowledge that this document is a draft and agree to seek professional legal review before signing.
                  </span>
                </label>
              </div>

              {/* Footer */}
              <div className="p-6 pt-2 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl border border-white/5 bg-white/5 text-white font-medium hover:bg-white/10 transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={!checked}
                  className={`flex-[2] py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 text-sm ${
                    checked
                      ? "bg-primary text-black shadow-[0_0_20px_rgba(74,222,128,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-white/5 text-white/40 cursor-not-allowed"
                  }`}
                >
                  Unlock Document & Export
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
