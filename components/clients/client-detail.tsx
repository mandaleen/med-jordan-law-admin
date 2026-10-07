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
  Building2,
  ShieldCheck,
  Scale,
  Printer,
  Plus,
  Lock,
  ExternalLink,
  Clock,
  ChevronRight,
} from "lucide-react";
import { ClientProfile, InternalNoteItem } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TaxInvoiceData } from "@/components/modals/tax-invoice-modal";
import { usePractice } from "@/lib/practice-context";

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
  const { setActiveNav, setSelectedCaseId } = usePractice();
  const [activeTab, setActiveTab] = useState<"overview" | "cases" | "invoices" | "agreements" | "notes">("overview");

  // Local state for interactive privileged notes
  const [notes, setNotes] = useState<InternalNoteItem[]>(
    client.internalNotes || [
      {
        id: "cn-default",
        author: client.assignedPartner ? client.assignedPartner.split(",")[0] : "Tariq Qudah",
        role: "Senior Partner",
        date: client.joinedDate,
        content: `Official onboarding dossier established for ${client.name}. Conflict check cleared and initial representation scope confirmed.`,
        isPrivileged: true,
      },
    ]
  );
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isNotePrivileged, setIsNotePrivileged] = useState(true);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    const newNote: InternalNoteItem = {
      id: `cn-${Date.now()}`,
      author: "Tariq Qudah",
      role: "Senior Partner",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      content: newNoteContent.trim(),
      isPrivileged: isNotePrivileged,
    };

    setNotes([newNote, ...notes]);
    setNewNoteContent("");
    onToast("Privileged attorney note added to client record.");
  };

  const handleOpenCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveNav("cases");
  };

  const handleWhatsAppClick = () => {
    const cleanPhone = client.phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}`, "_blank");
  };

  return (
    <div className="flex-1 flex flex-col gap-5 min-h-0 animate-in fade-in duration-150">
      {/* 1. Dossier Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col gap-5 shrink-0">
        {/* Navigation Breadcrumb & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-navy-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Clients Directory</span>
            <span className="text-gray-300">/</span>
            <span className="text-navy-900 font-semibold">{client.name}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="h-8 px-3 rounded-lg border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
            <a
              href={`tel:${client.phone}`}
              className="h-8 px-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span>Call</span>
            </a>
            <button
              type="button"
              onClick={() => {
                onShowInvoice({
                  invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
                  issueDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                  clientName: client.name,
                  clientCompany: client.company,
                  clientNationalId: client.nationalId,
                  clientPhone: client.phone,
                  clientEmail: client.email,
                  serviceDescription: "Executive Legal Counsel & Retainer Statement",
                  lawyerName: client.assignedPartner || "Tariq Qudah",
                  grossAmount: 5000,
                  taxRatePercent: 16,
                  paymentMethod: "Visa / MasterCard (HyperPay)",
                  gatewayRef: `HP-${Math.floor(100000 + Math.random() * 900000)}-JO`,
                  status: "Paid via Gateway",
                });
              }}
              className="h-8 px-3.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-gold-300" />
              <span>Issue Tax Invoice</span>
            </button>
          </div>
        </div>

        {/* Identity & Legal Standing Strip */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <Avatar className="w-14 h-14 rounded-xl ring-1 ring-gray-200 shrink-0">
              <AvatarImage src={client.avatar} alt={client.name} className="object-cover" />
              <AvatarFallback className="bg-navy-950 text-gold-300 font-bold text-base rounded-xl">
                {client.initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-navy-900 leading-tight">
                  {client.name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                    client.status === "Retained"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : client.status === "Active"
                      ? "bg-blue-50 text-blue-800 border-blue-200"
                      : "bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      client.status === "Retained"
                        ? "bg-emerald-600"
                        : client.status === "Active"
                        ? "bg-blue-600"
                        : "bg-gray-400"
                    }`}
                  />
                  {client.status === "Retained"
                    ? "Retained Counsel"
                    : client.status === "Active"
                    ? "Active Litigation"
                    : "Prospective Onboarding"}
                </span>

                <span className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200/60 font-medium">
                  {client.entityType || (client.company ? "Corporate Entity" : "Individual Client")}
                </span>
              </div>

              {client.company && (
                <p className="text-xs text-gray-500 mt-1 font-medium">{client.company}</p>
              )}

              {/* Legal Reference Data Strip */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-600 mt-2 font-numeric">
                <span className="flex items-center gap-1.5">
                  <span className="text-gray-400">National / Reg ID:</span>
                  <strong className="font-mono text-gray-900">{client.nationalId}</strong>
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-gray-400">Tax ID:</span>
                  <strong className="font-mono text-gray-900">{client.taxNumber || "TAX-JO-881920"}</strong>
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-800 font-medium">
                    {client.poaStatus === "Verified on File" ? "POA Verified (Notary Stamped)" : "POA Pending Notarization"}
                  </span>
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-400">
                  Client since <span className="text-gray-800 font-medium">{client.joinedDate}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-3 border-t lg:border-t-0 lg:border-s border-gray-100 pt-4 lg:pt-0 lg:ps-6 shrink-0">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">
                Total Billed
              </span>
              <span className="text-base font-bold text-navy-900 font-mono tabular-nums mt-0.5">
                {client.totalBilled}
              </span>
              <span className="text-[10px] text-gray-500 mt-0.5">YTD Collections</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">
                Active Dockets
              </span>
              <span className="text-base font-bold text-navy-900 font-mono tabular-nums mt-0.5">
                {client.activeCasesCount}
              </span>
              <span className="text-[10px] text-gray-500 mt-0.5">Amman Courts</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">
                Consultations
              </span>
              <span className="text-base font-bold text-navy-900 font-mono tabular-nums mt-0.5">
                {client.lifetimeBookingsCount}
              </span>
              <span className="text-[10px] text-gray-500 mt-0.5">Lifetime Sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Workspace Tabs Navigation */}
      <div className="border-b border-gray-200 flex items-center gap-1 overflow-x-auto custom-scrollbar shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === "overview"
              ? "border-navy-900 text-navy-900"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Legal KYC & Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cases")}
          className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === "cases"
              ? "border-navy-900 text-navy-900"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Court Matters ({client.linkedCases.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("invoices")}
          className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === "invoices"
              ? "border-navy-900 text-navy-900"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Invoices & Jordan E-Fawateer ({client.invoices.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("agreements")}
          className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === "agreements"
              ? "border-navy-900 text-navy-900"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Executed Agreements ({client.signedAgreements.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === "notes"
              ? "border-navy-900 text-navy-900"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Privileged Notes ({notes.length})</span>
        </button>
      </div>

      {/* 3. TAB CONTENTS */}

      {/* TAB 1: KYC & LEGAL PROFILE */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Entity & Regulatory Standing */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-semibold text-sm text-navy-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gold-500" />
                Ministry Registration & Corporate Governance
              </h3>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 font-medium">
                Active Legal Entity
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-gray-50/80 rounded-lg border border-gray-200/70">
                <span className="text-gray-500 text-[11px] block">Commercial Register (السجل التجاري)</span>
                <span className="font-mono font-semibold text-gray-900 text-sm mt-0.5 block">
                  {client.commercialReg || client.nationalId}
                </span>
                <span className="text-[10px] text-gray-500 mt-1 block">Ministry of Industry & Trade</span>
              </div>

              <div className="p-3 bg-gray-50/80 rounded-lg border border-gray-200/70">
                <span className="text-gray-500 text-[11px] block">National Tax ID (الرقم الضريبي)</span>
                <span className="font-mono font-semibold text-gray-900 text-sm mt-0.5 block">
                  {client.taxNumber || `TAX-JO-${client.nationalId.slice(-6)}`}
                </span>
                <span className="text-[10px] text-gray-500 mt-1 block">Income & Sales Tax Department</span>
              </div>

              <div className="p-3 bg-gray-50/80 rounded-lg border border-gray-200/70">
                <span className="text-gray-500 text-[11px] block">Chamber of Commerce / Industry</span>
                <span className="font-medium text-gray-900 text-xs mt-0.5 block">
                  {client.chamberOfCommerce || "Amman Chamber of Commerce"}
                </span>
                <span className="text-[10px] text-gray-500 mt-1 block">Verified Active Member</span>
              </div>

              <div className="p-3 bg-gray-50/80 rounded-lg border border-gray-200/70">
                <span className="text-gray-500 text-[11px] block">Lead Responsible Partner</span>
                <span className="font-semibold text-navy-900 text-xs mt-0.5 block">
                  {client.assignedPartner || "Tariq Qudah, Senior Partner"}
                </span>
                <span className="text-[10px] text-gray-500 mt-1 block">Head of Corporate & Litigation</span>
              </div>
            </div>

            {/* Power of Attorney Details */}
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Power of Attorney on Record / سند الوكالة العدلية
                </span>
                <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {client.poaStatus || "Verified on File"}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Scope: <strong>{client.poaType || "Litigation POA (وكالة خاصة بالخصومة)"}</strong>. Registered with{" "}
                <code className="text-gray-800 font-mono">{client.poaNumber || "Amman Notary Public / POA-2025-1194"}</code>. Authorizes Med Jordan Law partners to represent entity before Amman Courts and Arbitration Tribunals.
              </p>
            </div>
          </div>

          {/* Contact Details & Engagement Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="font-semibold text-sm text-navy-900 pb-3 border-b border-gray-100 flex items-center gap-2">
              <Phone className="w-4 h-4 text-navy-700" />
              Verified Communication Channels
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 text-[11px] block">Primary Phone / WhatsApp</span>
                <span className="font-mono font-medium text-gray-900 block mt-0.5">{client.phone}</span>
                <span className="text-[10px] text-emerald-600 font-medium">✓ Verified WhatsApp Delivery Channel</span>
              </div>

              <div>
                <span className="text-gray-400 text-[11px] block">Official Email</span>
                <a href={`mailto:${client.email}`} className="text-navy-700 hover:underline block mt-0.5">
                  {client.email}
                </a>
              </div>

              <div>
                <span className="text-gray-400 text-[11px] block">Retainer Arrangement</span>
                <span className="font-semibold text-navy-900 block mt-0.5">
                  {client.retainerTier || "Tier 1 General Counsel Retainer"}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <span className="text-gray-400 text-[11px] block">Recent Correspondence Status</span>
                <span className="text-gray-700 text-xs block mt-1">
                  Last automated notice delivered via WhatsApp on{" "}
                  <strong>{client.messageLog[0]?.timestamp || "Oct 6, 2026"}</strong>.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LINKED COURT MATTERS */}
      {activeTab === "cases" && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-semibold text-sm text-navy-900">Active Litigation & Matter Files</h3>
              <p className="text-xs text-gray-500">Legal dockets currently pending before Jordanian judicial bodies</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-gray-100 text-gray-700">
              {client.linkedCases.length} Matters
            </span>
          </div>

          {client.linkedCases.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              No active court litigation matters currently open for this client.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {client.linkedCases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleOpenCase(c.id)}
                  className="p-4 rounded-xl border border-gray-200 hover:border-navy-900/40 hover:shadow-xs transition-all cursor-pointer bg-white group flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold text-navy-900 group-hover:text-navy-700">
                        {c.caseNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
                        {c.statusStage}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-xs group-hover:text-navy-900 leading-snug">
                      {c.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Chamber: {c.courtChamber || "Palace of Justice (Amman)"} · Counsel: {c.assignedLawyer}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-gray-500">
                      Hearings: <strong>{c.hearings.length}</strong> logged
                    </span>
                    <span className="text-xs font-medium text-navy-800 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Open Docket <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INVOICES & FAWATEER */}
      {activeTab === "invoices" && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-semibold text-sm text-navy-900">National Tax Invoices & Payment Ledger</h3>
              <p className="text-xs text-gray-500">
                Jordan National E-Invoicing System (نظام الفوترة الوطني) receipts & gateway transactions
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {client.invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-3.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-gray-900 text-xs">
                      {inv.invoiceNumber} · {inv.service}
                    </span>
                    <span className="text-[11px] text-gray-500 mt-0.5 font-numeric">
                      {inv.date} · Gateway Ref: <code className="font-mono text-gray-700">{inv.gatewayRef}</code>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-gray-900 font-mono text-sm tabular-nums">
                    {inv.amount}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
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
                        lawyerName: client.assignedPartner || "Tariq Qudah",
                        grossAmount: parseFloat(inv.amount.replace(/[^0-9.]/g, "") || "250"),
                        taxRatePercent: 16,
                        paymentMethod: "Visa / MasterCard (HyperPay)",
                        gatewayRef: inv.gatewayRef,
                        status: inv.status === "Paid via Gateway" ? "Paid via Gateway" : "Settled",
                      })
                    }
                    className="h-7 px-3 rounded-md bg-navy-900 hover:bg-navy-800 text-white text-xs font-medium cursor-pointer shadow-2xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5 text-gold-300" />
                    <span>Print Invoice</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SIGNED AGREEMENTS */}
      {activeTab === "agreements" && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <div className="pb-3 border-b border-gray-100">
            <h3 className="font-semibold text-sm text-navy-900">Signed Consultation & Retainer Agreements</h3>
            <p className="text-xs text-gray-500">
              Legally binding executed agreements delivered and verified via encrypted WhatsApp dispatch
            </p>
          </div>

          <div className="space-y-3">
            {client.signedAgreements.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                No signed agreements on record for this client.
              </div>
            ) : (
              client.signedAgreements.map((sa) => (
                <div
                  key={sa.id}
                  className="p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs bg-white"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-900 flex items-center justify-center font-bold shrink-0">
                      <FileText className="w-4 h-4 text-navy-900" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 text-xs">{sa.title}</span>
                      <span className="text-[11px] text-gray-500 mt-0.5 font-numeric">
                        Executed: {sa.signedDate} · File: <code className="font-mono text-gray-700">{sa.pdfName}</code>
                      </span>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          Delivered to {client.phone} on {sa.deliveryTimestamp} (Receipt: {sa.deliveryReceipt})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onToast(`Downloading ${sa.pdfName}...`)}
                      className="h-8 px-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-gray-400" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onToast(`Retainer agreement resent to ${client.phone} via WhatsApp.`)}
                      className="h-8 px-3 rounded-lg bg-navy-900 text-white hover:bg-navy-800 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5 text-gold-300" />
                      <span>Resend WhatsApp</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: PRIVILEGED NOTES & COMMS AUDIT */}
      {activeTab === "notes" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Note Composer & Notes Stream */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-semibold text-sm text-navy-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gold-600" />
                  Attorney-Client Privileged Internal Notes
                </h3>
                <p className="text-xs text-gray-500">
                  Confidential legal strategy, hearing evaluations, and partner instructions
                </p>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-700 bg-gold-100/70 border border-gold-300/60 px-2 py-0.5 rounded">
                Privileged & Confidential
              </span>
            </div>

            {/* Note Composer Form */}
            <form onSubmit={handleAddNote} className="space-y-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
              <textarea
                rows={3}
                required
                placeholder="Enter confidential memorandum, partner assessment, or retainer note..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-navy-900"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNotePrivileged}
                    onChange={(e) => setIsNotePrivileged(e.target.checked)}
                    className="rounded border-gray-300 text-navy-900 focus:ring-navy-900 w-3.5 h-3.5"
                  />
                  <span>Stamp as Attorney-Client Privileged (سرية مهنية)</span>
                </label>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-medium cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-gold-300" />
                  <span>Record Note</span>
                </button>
              </div>
            </form>

            {/* Notes List */}
            <div className="space-y-3 pt-2">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="p-3.5 rounded-xl border border-gray-200/90 bg-white space-y-1.5 text-xs shadow-2xs"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <strong className="text-navy-900 font-semibold">{n.author}</strong>
                      <span className="text-gray-400">({n.role})</span>
                    </div>
                    <div className="flex items-center gap-2 font-numeric text-gray-400">
                      <span>{n.date}</span>
                      {n.isPrivileged && (
                        <span className="px-1.5 py-0.2 rounded bg-gold-100 text-gold-800 border border-gold-300/50 text-[10px] font-semibold">
                          Privileged
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed font-sans">{n.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Omnichannel Dispatch Audit Log */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="font-semibold text-sm text-navy-900 pb-3 border-b border-gray-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-navy-700" />
              Automated Communications Trail
            </h3>

            <div className="space-y-3 text-xs">
              {client.messageLog.map((msg) => (
                <div key={msg.id} className="p-3 rounded-lg bg-gray-50 border border-gray-200/70 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span
                      className={`font-semibold ${
                        msg.channel === "WhatsApp" ? "text-emerald-700" : "text-blue-700"
                      }`}
                    >
                      {msg.channel} · {msg.type}
                    </span>
                    <span className="text-gray-400 font-numeric">{msg.timestamp}</span>
                  </div>
                  <p className="text-gray-600 leading-normal text-[11px]">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
