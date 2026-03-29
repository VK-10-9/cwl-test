"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Fingerprint, 
  Smartphone, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Loader2,
  Lock,
  ArrowRight
} from "lucide-react";

interface ESignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (signatureId: string) => void;
  documentTitle: string;
}

export default function ESignModal({ isOpen, onClose, onSuccess, documentTitle }: ESignModalProps) {
  const [step, setStep] = useState<"init" | "otp" | "signing" | "success">("init");
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (step === "otp" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeLeft]);

  const handleRequestOtp = () => {
    if (aadhaar.length !== 12) return;
    setStep("otp");
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) return;
    setStep("signing");
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onSuccess(`CW-SIG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
      }, 2000);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[150]"
          />
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[151] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="w-full max-w-md bg-[#0A0A0B] border border-[#1F1F1F] rounded-3xl overflow-hidden pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              {/* Header */}
              <div className="p-6 pb-4 border-b border-white/5 relative">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Fingerprint className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-white">Legal E-Signature</h2>
                    <p className="text-xs text-muted-foreground line-clamp-1">{documentTitle}</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-white/5 text-muted-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Steps Progress */}
              <div className="flex h-1 bg-white/[0.02]">
                <div 
                  className="bg-primary transition-all duration-500" 
                  style={{ width: step === "init" ? "25%" : step === "otp" ? "50%" : step === "signing" ? "75%" : "100%" }} 
                />
              </div>

              {/* Step Content */}
              <div className="p-8 pb-10">
                {step === "init" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="text-center space-y-2 mb-8">
                      <div className="mx-auto w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-4">
                        <Smartphone className="w-8 h-8 text-white/40" />
                      </div>
                      <h3 className="text-white font-medium">Verify Identity</h3>
                      <p className="text-xs text-muted-foreground px-4 leading-relaxed">
                        Enter your 12-digit Aadhaar number to receive a secure OTP via DigiLocker.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="relative group">
                        <input
                          type="text"
                          maxLength={12}
                          value={aadhaar}
                          onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
                          placeholder="0000 0000 0000"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-center text-xl font-mono tracking-[0.2em] text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/10"
                        />
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary/40 transition-colors" />
                      </div>

                      <button
                        onClick={handleRequestOtp}
                        disabled={aadhaar.length !== 12}
                        className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                          aadhaar.length === 12 
                            ? "bg-primary text-black shadow-[0_0_20px_rgba(74,222,128,0.2)] hover:scale-[1.02]" 
                            : "bg-white/5 text-white/20 cursor-not-allowed"
                        }`}
                      >
                        Request OTP <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {step === "otp" && (
                  <div className="space-y-6 animate-in fade-in zoom-in-95">
                    <div className="text-center space-y-2 mb-8">
                      <h3 className="text-white font-medium text-lg">Verification Code</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        We've sent a 6-digit code to the mobile number registered with Aadhaar ending in {aadhaar.slice(-4)}.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-center">
                        <input
                          type="text"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                          className="w-full max-w-[240px] bg-white/[0.03] border border-white/10 rounded-xl px-4 py-4 text-center text-3xl font-mono tracking-[0.3em] text-primary focus:outline-none focus:border-primary transition-all placeholder:text-white/5"
                          autoFocus
                        />
                      </div>

                      <div className="text-center">
                        <button 
                          disabled={timeLeft > 0}
                          className="text-xs text-muted-foreground hover:text-white disabled:opacity-50 transition-colors"
                        >
                          {timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : "Resend OTP"}
                        </button>
                      </div>

                      <button
                        onClick={handleVerifyOtp}
                        disabled={otp.length !== 6}
                        className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                          otp.length === 6 
                            ? "bg-primary text-black" 
                            : "bg-white/5 text-white/20 cursor-not-allowed"
                        }`}
                      >
                        Verify & Sign
                      </button>
                    </div>
                  </div>
                )}

                {step === "signing" && (
                  <div className="py-12 flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
                      <div className="relative w-20 h-20 rounded-full border-2 border-primary border-t-transparent animate-spin flex items-center justify-center">
                         <ShieldCheck className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                       <h3 className="text-white font-medium">Securing Signature...</h3>
                       <p className="text-xs text-muted-foreground">Communicating with DigiLocker gateway</p>
                    </div>
                  </div>
                )}

                {step === "success" && (
                  <div className="py-8 flex flex-col items-center justify-center space-y-6 animate-in zoom-in-95 fade-in duration-500">
                    <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                       <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <div className="text-center space-y-2">
                       <h3 className="text-white text-xl font-medium">Document Signed</h3>
                       <p className="text-xs text-muted-foreground leading-relaxed">
                         Signature successfully attached to the document. <br/>
                         Generating your secure certificate...
                       </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Secure Footer */}
              <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-center gap-2">
                 <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
                 <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                   256-Bit Encrypted Secure Gateway
                 </span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
