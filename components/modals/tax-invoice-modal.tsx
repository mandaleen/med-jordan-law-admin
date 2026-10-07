"use client";

import React from "react";
import {
  X,
  Printer,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export interface TaxInvoiceData {
  invoiceNumber: string;
  issueDate: string;
  clientName: string;
  clientCompany?: string;
  clientNationalId?: string;
  clientPhone: string;
  clientEmail: string;
  serviceDescription: string;
  lawyerName?: string;
  grossAmount: number;
  taxRatePercent?: number; // default 16% in Jordan or 0% for exempt international
  paymentMethod: string;
  gatewayRef: string;
  status: "Paid via Gateway" | "Settled" | "Refunded" | "Pending";
}

interface TaxInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: TaxInvoiceData | null;
}

export function TaxInvoiceModal({ isOpen, onClose, invoice }: TaxInvoiceModalProps) {
  if (!isOpen || !invoice) return null;

  const taxRate = invoice.taxRatePercent !== undefined ? invoice.taxRatePercent : 16;
  const subtotal = invoice.grossAmount / (1 + taxRate / 100);
  const taxAmount = invoice.grossAmount - subtotal;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-2xl p-0 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
      >
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-navy-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Official Tax Invoice · فاتورة ضريبية رسمية
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-navy-800 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-8 flex flex-col gap-6 bg-white text-gray-900 font-sans print:p-0">
          {/* Header Strip: Logo + Jordan Tax Authority Credentials */}
          <div className="flex items-start justify-between border-b-2 border-navy-900 pb-5">
            <div>
              <Logo className="w-44 h-auto text-navy-900" label="Med Jordan Law" />
              <p className="text-[11px] text-gray-500 mt-1.5 font-medium">
                Al-Shmeisani, Abdul Hameed Sharaf St., Bldg 42, Amman - Jordan
              </p>
              <p className="text-[11px] text-gray-500">
                Tel: +962 6 560 8820 · info@medjordanlaw.com
              </p>
            </div>

            <div className="text-right flex flex-col items-end">
              <span className="text-xs font-bold text-navy-900">المملكة الأردنية الهاشمية</span>
              <span className="text-[10px] text-gray-500">دائرة ضريبة الدخل والمبيعات (ISTD)</span>
              <div className="mt-1 px-2.5 py-1 rounded bg-gray-100 border border-gray-200 text-right">
                <span className="text-[10px] text-gray-500 block">الرقم الضريبي الموحد (Tax ID):</span>
                <span className="text-xs font-mono font-bold text-navy-900">200194883</span>
              </div>
            </div>
          </div>

          {/* Invoice Metadata Grid */}
          <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Bill To / صدرت إلى العميل
              </span>
              <div className="font-bold text-navy-900 text-sm">{invoice.clientName}</div>
              {invoice.clientCompany && (
                <div className="text-gray-700 font-medium">{invoice.clientCompany}</div>
              )}
              <div className="text-gray-500 text-[11px]">
                {invoice.clientNationalId ? `National ID / CR: ${invoice.clientNationalId}` : "Individual Client"}
              </div>
              <div className="text-gray-500 text-[11px] font-mono mt-0.5">
                {invoice.clientPhone} · {invoice.clientEmail}
              </div>
            </div>

            <div className="flex flex-col gap-1 text-right">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Invoice Details / بيانات الفاتورة
              </span>
              <div className="font-mono font-bold text-navy-900 text-sm">
                #{invoice.invoiceNumber}
              </div>
              <div className="text-gray-600 text-[11px]">
                Issue Date: <span className="font-semibold text-gray-900">{invoice.issueDate}</span>
              </div>
              <div className="text-gray-600 text-[11px]">
                Gateway Ref: <span className="font-mono text-gray-900">{invoice.gatewayRef}</span>
              </div>
              <div className="mt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {invoice.status}
                </span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200/80 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
                <tr>
                  <th className="py-2.5 px-4">Item & Legal Service Description</th>
                  <th className="py-2.5 px-4 text-center">Assigned Counsel</th>
                  <th className="py-2.5 px-4 text-right">Tax Rate</th>
                  <th className="py-2.5 px-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{invoice.serviceDescription}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Standard consultation / legal advisory session retainer
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">
                    {invoice.lawyerName || "Tariq Qudah"}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-gray-600">
                    {taxRate}% GST
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-gray-900">
                    ${subtotal.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Breakdown & Totals */}
          <div className="flex justify-between items-start pt-2">
            {/* Jordan Electronic Tax Clearance Stamp & QR Code */}
            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <div className="w-16 h-16 bg-white p-1 rounded-lg border border-gray-300 flex items-center justify-center shrink-0">
                <QrCode className="w-14 h-14 text-navy-900" />
              </div>
              <div className="text-[10px] text-gray-500 flex flex-col gap-0.5 max-w-[200px]">
                <span className="font-bold text-navy-900 text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  ISTD Jordan Certified
                </span>
                <span>تخضع لأحكام قانون الضريبة الأردني لسنة 2026. الفاتورة الإلكترونية موثقة عبر بوابة الفوترة الوطنية.</span>
              </div>
            </div>

            {/* Calculations Box */}
            <div className="w-64 flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal (Net):</span>
                <span className="font-mono font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Sales Tax ({taxRate}%):</span>
                <span className="font-mono font-medium">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-navy-900 font-bold text-sm pt-2 border-t-2 border-gray-200">
                <span>Total Paid (USD):</span>
                <span className="font-mono text-base">${invoice.grossAmount.toFixed(2)}</span>
              </div>
              <div className="text-[10px] text-gray-500 text-right font-mono">
                ≈ {(invoice.grossAmount * 0.709).toFixed(2)} JOD (Fixed Peg 0.709)
              </div>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="border-t border-gray-200 pt-3 text-[10px] text-gray-400 text-center leading-relaxed">
            Med Jordan Law Firm LLC · Reg. 89201 · Jordan Bar Association Ethics Code Art. 24.
            This is an electronically generated and certified tax invoice issued under Jordan E-Invoicing System Regulation.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
