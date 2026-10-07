"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Briefcase,
  FileText,
  DollarSign,
  MessageSquare,
  Phone,
  Mail,
  Download,
  CheckCircle2,
  Send,
  FileCheck,
} from "lucide-react";
import { ClientProfile } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TaxInvoiceData } from "@/components/modals/tax-invoice-modal";

interface ClientDetailProps {
  client: ClientProfile;
  onBack: () => void;
  onShowInvoice: (data: TaxInvoiceData) => void;
  onToast: (msg: string) => void;
}

export function ClientDetail({
  client,
  onBack,
  onShowInvoice,
  onToast,
}: ClientDetailProps) {
  const [activeTab, setActiveTab] = useState<"bookings" | "cases" | "agreements" | "invoices" | "messages">("bookings");

  return (
    <div className="flex flex-col gap-4">
      {/* Header & Account Summary */}
      <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-navy-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clients Directory
          </button>

          <span className="text-xs text-slate-400">Client since {client.joinedDate}</span>
        </div>

        {/* Profile Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3.5">
            <Avatar className="w-14 h-14 rounded-full ring-2 ring-slate-200 shadow-xs">
              <AvatarImage src={client.avatar} alt={client.name} />
              <AvatarFallback className="bg-navy-900 text-white font-extrabold text-base">
                {client.initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-navy-900 tracking-tight">{client.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold whitespace-nowrap shrink-0">
                  {client.status}
                </span>
              </div>
              {client.company && (
                <span className="text-xs font-semibold text-slate-500">{client.company}</span>
              )}
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1 font-mono text-[11px] whitespace-nowrap shrink-0">
                  National ID: <strong className="text-slate-800">{client.nationalId}</strong>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 whitespace-nowrap shrink-0">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {client.phone}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 whitespace-nowrap shrink-0">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {client.email}
                </span>
              </div>
            </div>
          </div>

          {/* Stat Rails */}
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200/60 shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block whitespace-nowrap">Total Billed</span>
              <span className="text-sm font-bold text-navy-900 font-mono whitespace-nowrap">{client.totalBilled}</span>
            </div>
            <div className="h-7 w-[1px] bg-slate-200" />
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block whitespace-nowrap">Active Cases</span>
              <span className="text-sm font-bold text-blue-700 font-mono whitespace-nowrap">{client.activeCasesCount}</span>
            </div>
            <div className="h-7 w-[1px] bg-slate-200" />
            <div className="text-center px-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block whitespace-nowrap">Bookings</span>
              <span className="text-sm font-bold text-slate-800 font-mono whitespace-nowrap">{client.lifetimeBookingsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 SUB-TABS */}
      <div className="flex items-center bg-slate-100 p-1 rounded-2xl w-fit flex-wrap gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("bookings")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === "bookings" ? "bg-white text-navy-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Booking History ({client.bookings.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("cases")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === "cases" ? "bg-white text-navy-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Linked Cases ({client.linkedCases.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("agreements")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === "agreements" ? "bg-white text-navy-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          Signed Agreements ({client.signedAgreements.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("invoices")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === "invoices" ? "bg-white text-navy-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          Invoices ({client.invoices.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("messages")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === "messages" ? "bg-white text-navy-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Message Log ({client.messageLog.length})
        </button>
      </div>

      {/* TAB 1: BOOKING HISTORY */}
      {activeTab === "bookings" && (
        <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-3">
          <h3 className="text-sm font-bold text-navy-900">Consultation Booking History</h3>
          <div className="flex flex-col gap-2.5">
            {client.bookings.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-navy-900">{b.practiceArea}</span>
                    <span className="text-[11px] text-slate-500">
                      {b.dateTime} · Counsel: {b.lawyerName} ({b.appointmentType})
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-slate-800 whitespace-nowrap">{b.fee}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap shrink-0">
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LINKED CASES */}
      {activeTab === "cases" && (
        <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-3">
          <h3 className="text-sm font-bold text-navy-900">Linked Legal Matters</h3>
          {client.linkedCases.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No litigation matters opened for this client yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {client.linkedCases.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-700 whitespace-nowrap">{c.caseNumber}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 whitespace-nowrap shrink-0">
                      {c.statusStage}
                    </span>
                  </div>
                  <h4 className="font-bold text-navy-900 text-xs">{c.title}</h4>
                  <p className="text-[11px] text-slate-500">
                    Counsel: {c.assignedLawyer} · {c.practiceArea}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SIGNED AGREEMENTS */}
      {activeTab === "agreements" && (
        <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-navy-900">Signed Consultation Agreements</h3>
            <p className="text-xs text-slate-400">
              Signed PDFs generated automatically during booking intake, executed and delivered via WhatsApp.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {client.signedAgreements.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No signed agreements logged for this client.
              </div>
            ) : (
              client.signedAgreements.map((sa) => (
                <div
                  key={sa.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-navy-900 flex items-center justify-center font-bold shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-navy-900 text-xs">{sa.title}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5">
                        Executed on {sa.signedDate} · File: <code className="text-slate-700 font-mono">{sa.pdfName}</code>
                      </span>
                      {/* Stamped WhatsApp Delivery Receipt */}
                      <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-emerald-700 font-medium bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-200/60 w-fit">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          Delivered via WhatsApp to <strong>{client.phone}</strong> on {sa.deliveryTimestamp} (Status: {sa.deliveryReceipt})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onToast(`Downloading ${sa.pdfName}...`)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => onToast(`Agreement resent to ${client.phone} via WhatsApp.`)}
                      className="px-3 py-1.5 rounded-lg bg-navy-900 text-white hover:bg-navy-800 text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Resend WhatsApp
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: INVOICES */}
      {activeTab === "invoices" && (
        <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-3">
          <h3 className="text-sm font-bold text-navy-900">Invoices & Gateway Receipts</h3>
          <div className="flex flex-col gap-2.5">
            {client.invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-navy-900">{inv.invoiceNumber} · {inv.service}</span>
                    <span className="text-[11px] text-slate-500">
                      {inv.date} · Gateway Ref: <code className="font-mono text-slate-700">{inv.gatewayRef}</code>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="font-bold text-slate-900 font-mono text-[13px] whitespace-nowrap">{inv.amount}</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold whitespace-nowrap shrink-0">
                    {inv.status}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onShowInvoice({
                        invoiceNumber: inv.invoiceNumber,
                        issueDate: inv.date,
                        clientName: client.name,
                        clientCompany: client.company,
                        clientNationalId: client.nationalId,
                        clientPhone: client.phone,
                        clientEmail: client.email,
                        serviceDescription: inv.service,
                        lawyerName: "Tariq Qudah",
                        grossAmount: parseFloat(inv.amount.replace(/[^0-9.]/g, "") || "180"),
                        taxRatePercent: 16,
                        paymentMethod: "Visa / MasterCard (HyperPay)",
                        gatewayRef: inv.gatewayRef,
                        status: inv.status === "Paid via Gateway" ? "Paid via Gateway" : "Settled",
                      })
                    }
                    className="px-2.5 py-1 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors whitespace-nowrap shrink-0"
                  >
                    Official Tax Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MESSAGE LOG */}
      {activeTab === "messages" && (
        <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-navy-900">Omnichannel Communications Log</h3>
            <p className="text-xs text-slate-400">
              Audit trail of every SMS, Email, and WhatsApp sent to this client (confirmations, reminders, reschedule notices, agreements).
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {client.messageLog.map((msg) => (
              <div
                key={msg.id}
                className="p-3.5 rounded-xl bg-gray-50 border border-slate-200/70 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap shrink-0 ${
                        msg.channel === "WhatsApp"
                          ? "bg-emerald-100 text-emerald-800"
                          : msg.channel === "SMS"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-200 text-slate-800"
                      }`}
                    >
                      {msg.channel}
                    </span>
                    <span className="font-bold text-navy-900 whitespace-nowrap">{msg.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] shrink-0">
                    <span className="whitespace-nowrap">{msg.timestamp}</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-semibold whitespace-nowrap">✓ {msg.status}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-sans leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/60 mt-0.5">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
