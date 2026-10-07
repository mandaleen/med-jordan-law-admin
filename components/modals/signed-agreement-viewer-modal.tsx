"use client";

import React, { useState } from "react";
import {
  FileText,
  ShieldCheck,
  Download,
  Copy,
  Check,
  X,
  Send,
  Lock,
  Smartphone,
  Globe,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface SignedAgreementViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle?: string;
  clientName?: string;
  clientPhone?: string;
  signedDate?: string;
  pdfName?: string;
  docHash?: string;
  clientIp?: string;
  onResendWhatsApp?: () => void;
}

export function SignedAgreementViewerModal({
  isOpen,
  onClose,
  documentTitle = "Med Jordan Law — Legal Consultation Agreement",
  clientName = "Client",
  clientPhone = "+962 7 9000 0000",
  signedDate = "Oct 6, 2026 at 14:15 UTC+3",
  pdfName = "MJL_Agreement_Executed.pdf",
  docHash = "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
  clientIp = "82.212.94.18 (Orange Jordan DSL)",
  onResendWhatsApp,
}: SignedAgreementViewerModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(docHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPdf = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-2xl p-0 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="bg-navy-950 px-6 py-4 text-white flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">
                  Executed E-Signature Dossier
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  VERIFIED AUDIT PROOF
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Tamper-evident legal electronic signature record (Page 6 & 10)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-5 text-xs">
          {/* Document Header Card */}
          <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-navy-950 text-sm block">
                  {documentTitle}
                </span>
                <span className="text-[11px] text-gray-500 font-mono">
                  File: {pdfName}
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px]">
              ✓ Legally Binding
            </span>
          </div>

          {/* Electronic Signature Audit Trail Grid */}
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-gray-700 uppercase tracking-wider text-[11px]">
              E-Signature Forensic Audit Trail (توثيق التوقيع):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-gray-50/70 border border-gray-200/80">
              <div className="flex flex-col gap-1">
                <span className="text-gray-400 font-medium text-[10px] uppercase">
                  Signatory Identity
                </span>
                <span className="font-bold text-navy-950 text-xs">
                  {clientName}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-gray-400 font-medium text-[10px] uppercase">
                  Signature Timestamp
                </span>
                <span className="font-mono font-bold text-gray-800 text-xs">
                  {signedDate}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-gray-400 font-medium text-[10px] uppercase">
                  Client IP & ISP Origin
                </span>
                <span className="font-mono text-gray-700 text-xs flex items-center gap-1">
                  <Globe className="w-3 h-3 text-gray-400" />
                  {clientIp}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-gray-400 font-medium text-[10px] uppercase">
                  Signature Method
                </span>
                <span className="text-gray-700 text-xs">
                  Touchpad Signature + OTP Verification
                </span>
              </div>
            </div>
          </div>

          {/* Cryptographic Hash */}
          <div className="p-3.5 rounded-xl bg-navy-950 text-gray-200 flex flex-col gap-2 border border-navy-800">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Document Cryptographic Fingerprint (بصمة الوثيقة SHA-256):
              </span>
              <button
                type="button"
                onClick={handleCopyHash}
                className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Copy Hash"}</span>
              </button>
            </div>
            <code className="text-[11px] font-mono text-gray-300 break-all bg-black/40 p-2.5 rounded-lg border border-white/5 select-all">
              {docHash}
            </code>
          </div>

          {/* WhatsApp Delivery Proof Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-emerald-950 text-xs">
                  Delivered via WhatsApp Business API
                </span>
                <span className="text-emerald-800 text-[11px]">
                  Delivered to {clientPhone} with direct encrypted PDF download link.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onResendWhatsApp}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap shrink-0 transition-colors"
            >
              <Send className="w-3 h-3" />
              Resend WhatsApp
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50/90 border-t border-gray-200/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="px-4 py-2 text-xs font-semibold bg-navy-950 hover:bg-navy-900 text-white rounded-lg shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Certified PDF</span>
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
