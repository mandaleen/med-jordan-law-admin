"use client";

import React, { useState } from "react";
import {
  FileCheck,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  Send,
  ShieldCheck,
  AlertTriangle,
  X,
  PenTool,
  DollarSign,
  Briefcase,
  FileText,
  User,
  Phone,
  Mail,
  Eye,
} from "lucide-react";
import { FeeContractItem, INITIAL_CONTRACTS } from "@/lib/mock-data";
import { SignedAgreementViewerModal } from "@/components/modals/signed-agreement-viewer-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ContractsViewProps {
  initialClientName?: string;
  onViewClient?: (clientName: string) => void;
}

export function ContractsView({ initialClientName, onViewClient }: ContractsViewProps) {
  const [contracts, setContracts] = useState<FeeContractItem[]>(INITIAL_CONTRACTS);
  const [searchQuery, setSearchQuery] = useState(initialClientName || "");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Detailed Contract Inspection Modal State
  const [selectedContract, setSelectedContract] = useState<FeeContractItem | null>(null);

  // New Contract Modal State
  const [isNewContractOpen, setIsNewContractOpen] = useState(false);
  const [newClientName, setNewClientName] = useState(initialClientName || "");
  const [newClientPhone, setNewClientPhone] = useState("+962 7 9");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newCounsel, setNewCounsel] = useState("Tariq Qudah");
  const [newPracticeArea, setNewPracticeArea] = useState("Corporate & Commercial");
  const [newTemplateType, setNewTemplateType] = useState<FeeContractItem["templateType"]>("Litigation Retainer");
  const [newTotalFee, setNewTotalFee] = useState("15,000");
  const [newRetainerDeposit, setNewRetainerDeposit] = useState("5,000");

  // Certificate Modal State
  const [certificateContract, setCertificateContract] = useState<FeeContractItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Dispatch contract for client signature
  const handleDispatchContract = (contractId: string) => {
    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId
          ? {
              ...c,
              status: "Sent for Signature",
              sentDate: "Today at " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }
          : c
      )
    );
    const target = contracts.find((c) => c.id === contractId);
    showToast(`✓ Contract ${target?.contractNumber} dispatched to ${target?.clientPhone} via secure SMS & Email link.`);
    if (selectedContract?.id === contractId) {
      setSelectedContract((prev) =>
        prev
          ? {
              ...prev,
              status: "Sent for Signature",
              sentDate: "Today at " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }
          : null
      );
    }
  };

  // Countersign & execute by managing partner
  const handleCountersign = (contractId: string) => {
    const updatedBy = "Tariq Qudah (Senior Partner)";
    const updatedAt = "Today, just now";
    const target = contracts.find((c) => c.id === contractId);
    const pdfUrl = target ? `MJL_Executed_${target.contractNumber}.pdf` : "MJL_Executed_Contract.pdf";

    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId
          ? {
              ...c,
              status: "Countersigned & Executed",
              countersignedBy: updatedBy,
              countersignedAt: updatedAt,
              pdfUrl: pdfUrl,
            }
          : c
      )
    );
    showToast(`✓ Contract countersigned by Tariq Qudah. Executed PDF archived into client vault.`);
    if (selectedContract?.id === contractId) {
      setSelectedContract((prev) =>
        prev
          ? {
              ...prev,
              status: "Countersigned & Executed",
              countersignedBy: updatedBy,
              countersignedAt: updatedAt,
              pdfUrl: pdfUrl,
            }
          : null
      );
    }
  };

  // Create new contract
  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const newContract: FeeContractItem = {
      id: `fc-${Date.now()}`,
      contractNumber: `MJL-FEE-2026-0${Math.floor(60 + Math.random() * 30)}`,
      clientName: newClientName,
      clientId: `cl-${Date.now()}`,
      clientPhone: newClientPhone,
      clientEmail: newClientEmail || "client@office.jo",
      assignedLawyer: newCounsel,
      practiceArea: newPracticeArea,
      templateType: newTemplateType,
      totalFee: `$${Number(newTotalFee.replace(/[^0-9]/g, "") || 15000).toLocaleString()}.00`,
      retainerDeposit: `$${Number(newRetainerDeposit.replace(/[^0-9]/g, "") || 5000).toLocaleString()}.00`,
      paymentMilestones: [
        {
          description: "Initial Retainer Deposit Execution",
          amount: `$${Number(newRetainerDeposit.replace(/[^0-9]/g, "") || 5000).toLocaleString()}.00`,
          dueTrigger: "Upon digital signature execution",
        },
        {
          description: "Mid-Term Pleadings & Evidentiary Docket Filing",
          amount: "$5,000.00",
          dueTrigger: "Court filing docket submission",
        },
        {
          description: "Final Judgment or Settlement Execution Closing",
          amount: "$5,000.00",
          dueTrigger: "Formal matter conclusion",
        },
      ],
      status: "Draft",
    };

    setContracts([newContract, ...contracts]);
    setIsNewContractOpen(false);
    showToast(`✓ Fee agreement ${newContract.contractNumber} drafted. Ready for partner dispatch.`);
  };

  // Filter calculations
  const filteredContracts = contracts.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      c.contractNumber.toLowerCase().includes(q) ||
      c.clientName.toLowerCase().includes(q) ||
      c.assignedLawyer.toLowerCase().includes(q) ||
      c.practiceArea.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "draft" && c.status === "Draft") ||
      (statusFilter === "sent" && c.status === "Sent for Signature") ||
      (statusFilter === "awaiting" && c.status === "Signed by Client") ||
      (statusFilter === "executed" && c.status === "Countersigned & Executed") ||
      (statusFilter === "amendment" && c.status === "Amendment Requested");

    return matchesQuery && matchesStatus;
  });

  // Top metric computations
  const totalValueSum = contracts.reduce((acc, c) => {
    const val = parseFloat(c.totalFee.replace(/[^0-9.]/g, "") || "0");
    return acc + val;
  }, 0);

  const retainerSum = contracts.reduce((acc, c) => {
    const val = parseFloat(c.retainerDeposit.replace(/[^0-9.]/g, "") || "0");
    return acc + val;
  }, 0);

  const awaitingCountersignCount = contracts.filter((c) => c.status === "Signed by Client").length;
  const outForSignatureCount = contracts.filter((c) => c.status === "Sent for Signature").length;

  const getStatusBadge = (status: FeeContractItem["status"]) => {
    switch (status) {
      case "Draft":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100/80 text-gray-700 border border-gray-200/60 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
            <span>Draft</span>
          </span>
        );
      case "Sent for Signature":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50/80 text-blue-800 border border-blue-200/60 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
            <span>Sent for Signature</span>
          </span>
        );
      case "Signed by Client":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50/80 text-amber-900 border border-amber-200/70 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            <span>Awaiting Countersign</span>
          </span>
        );
      case "Countersigned & Executed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50/80 text-emerald-800 border border-emerald-200/60 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Fully Executed</span>
          </span>
        );
      case "Amendment Requested":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50/80 text-rose-800 border border-rose-200/60 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            <span>Amendment Requested</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-navy-950 text-white rounded-xl shadow-lg flex items-center justify-between text-xs font-medium animate-in fade-in slide-in-from-top-2 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-navy-950 text-white flex items-center justify-center font-bold shadow-2xs border border-navy-800">
            <FileCheck className="w-5 h-5 text-gray-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Fee Agreements & E-Signature (عقود الأتعاب)
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-navy-50 text-navy-800 border border-navy-100">
                {contracts.length} Agreements
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Contract drafting from firm templates, secure SMS/Email dispatch, cryptographic IP proof & countersigning
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsNewContractOpen(true)}
          className="px-4 py-2 rounded-xl bg-navy-950 hover:bg-navy-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Draft Fee Agreement
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
        <div className="bg-white border border-gray-200/90 rounded-xl p-3.5 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Contract Value</span>
            <div className="text-xl font-bold text-gray-900 mt-0.5 font-mono tabular-nums">
              ${totalValueSum.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <span className="text-[10px] text-gray-400">{contracts.length} total active matters</span>
          </div>
          <div className="w-8.5 h-8.5 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-xl p-3.5 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Retainer Deposits</span>
            <div className="text-xl font-bold text-emerald-700 mt-0.5 font-mono tabular-nums">
              ${retainerSum.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <span className="text-[10px] text-gray-400">Upfront engagement deposits</span>
          </div>
          <div className="w-8.5 h-8.5 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-xl p-3.5 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Awaiting Countersign</span>
            <div className="text-xl font-bold text-amber-600 mt-0.5 font-mono tabular-nums">
              {awaitingCountersignCount}
            </div>
            <span className="text-[10px] text-amber-700 font-medium">Signed by client · partner pending</span>
          </div>
          <div className="w-8.5 h-8.5 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <PenTool className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-gray-200/90 rounded-xl p-3.5 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Out for Signature</span>
            <div className="text-xl font-bold text-blue-600 mt-0.5 font-mono tabular-nums">
              {outForSignatureCount}
            </div>
            <span className="text-[10px] text-blue-600 font-medium">Dispatched via SMS / Email</span>
          </div>
          <div className="w-8.5 h-8.5 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Send className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200/90 rounded-xl p-3 sm:p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search contract #, client name, counsel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-white hover:bg-gray-50/50 focus:bg-white border border-gray-200/90 focus:border-navy-900 rounded-lg focus:outline-none text-gray-900 placeholder:text-gray-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <label className="text-[11px] font-semibold text-gray-500 whitespace-nowrap">Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white hover:bg-gray-50/50 border border-gray-200/90 rounded-lg focus:outline-none focus:border-navy-900 text-gray-800 font-medium cursor-pointer transition-colors"
          >
            <option value="all">All Statuses ({contracts.length})</option>
            <option value="draft">Drafts ({contracts.filter((c) => c.status === "Draft").length})</option>
            <option value="sent">Sent for Signature ({contracts.filter((c) => c.status === "Sent for Signature").length})</option>
            <option value="awaiting">Awaiting Partner Countersign ({contracts.filter((c) => c.status === "Signed by Client").length})</option>
            <option value="executed">Fully Executed ({contracts.filter((c) => c.status === "Countersigned & Executed").length})</option>
            <option value="amendment">Amendment Requested ({contracts.filter((c) => c.status === "Amendment Requested").length})</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-gray-200/90 rounded-xl overflow-hidden flex-1 flex flex-col min-h-[480px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse table-fixed min-w-[1190px]">
            <colgroup>
              <col className="w-[140px]" />
              <col className="w-[210px]" />
              <col className="w-[160px]" />
              <col className="w-[150px]" />
              <col className="w-[130px]" />
              <col className="w-[170px]" />
              <col className="w-[230px]" />
            </colgroup>
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-50/90 backdrop-blur-xs border-b border-gray-200/80">
                <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500">Contract #</th>
                <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500">Client & Practice Area</th>
                <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500">Template Type</th>
                <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500">Fee Structure</th>
                <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500">Lead Counsel</th>
                <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500">Status</th>
                <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500 text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-400">
                    <FileCheck className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="font-semibold text-gray-600">No fee contracts found matching criteria</p>
                    <p className="text-xs text-gray-400">Click &ldquo;Draft Fee Agreement&rdquo; to issue a new contract.</p>
                  </td>
                </tr>
              ) : (
                filteredContracts.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedContract(c)}
                    className="hover:bg-gray-50/60 transition-colors cursor-pointer group"
                  >
                    {/* Contract Number */}
                    <td className="py-3.5 px-4 align-middle font-mono font-medium text-gray-900 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200/70 group-hover:bg-blue-50/70 group-hover:border-blue-200/70 transition-colors inline-block text-xs">
                        {c.contractNumber}
                      </span>
                    </td>

                    {/* Client & Area */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex flex-col min-w-0 pr-2">
                        {onViewClient ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewClient(c.clientName);
                            }}
                            className="font-semibold text-gray-900 hover:text-navy-700 hover:underline text-xs truncate text-start cursor-pointer block leading-tight"
                          >
                            {c.clientName}
                          </button>
                        ) : (
                          <span className="font-semibold text-gray-900 text-xs truncate block leading-tight">
                            {c.clientName}
                          </span>
                        )}
                        <span className="text-[11px] text-gray-500 truncate mt-0.5">
                          {c.practiceArea}
                        </span>
                      </div>
                    </td>

                    {/* Template */}
                    <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50/70 text-blue-800 text-[11px] font-medium border border-blue-200/50 inline-block">
                        {c.templateType}
                      </span>
                    </td>

                    {/* Fee */}
                    <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                      <div className="flex flex-col font-mono">
                        <span className="font-semibold text-gray-900 text-xs tabular-nums">{c.totalFee} Total</span>
                        <span className="text-[11px] text-gray-500 mt-0.5 tabular-nums">Deposit: {c.retainerDeposit}</span>
                      </div>
                    </td>

                    {/* Counsel */}
                    <td className="py-3.5 px-4 align-middle whitespace-nowrap text-gray-700 font-medium text-xs">
                      {c.assignedLawyer}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                      {getStatusBadge(c.status)}
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-4 text-right align-middle whitespace-nowrap pr-5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Draft State Action */}
                        {c.status === "Draft" && (
                          <button
                            type="button"
                            onClick={() => handleDispatchContract(c.id)}
                            className="px-2.5 py-1 rounded-md bg-navy-950 text-white hover:bg-navy-900 text-xs font-medium cursor-pointer transition-colors inline-flex items-center gap-1 shrink-0 shadow-2xs"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Dispatch
                          </button>
                        )}

                        {/* Sent State Action */}
                        {c.status === "Sent for Signature" && (
                          <button
                            type="button"
                            onClick={() => showToast(`Signing link resent to ${c.clientPhone}.`)}
                            className="px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium cursor-pointer transition-colors inline-flex items-center gap-1 shrink-0"
                          >
                            Resend SMS
                          </button>
                        )}

                        {/* Signed by Client -> Countersign */}
                        {c.status === "Signed by Client" && (
                          <button
                            type="button"
                            onClick={() => handleCountersign(c.id)}
                            className="px-2.5 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium cursor-pointer transition-colors inline-flex items-center gap-1 shrink-0 shadow-2xs"
                          >
                            <PenTool className="w-3.5 h-3.5" />
                            Countersign
                          </button>
                        )}

                        {/* Executed / Signed -> Inspect Proof Certificate */}
                        {(c.status === "Signed by Client" || c.status === "Countersigned & Executed") && (
                          <button
                            type="button"
                            onClick={() => setCertificateContract(c)}
                            className="px-2 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/70 text-xs font-medium cursor-pointer transition-colors inline-flex items-center gap-1 shrink-0"
                            title="Inspect forensic audit signature certificate (SHA-256 / IP proof)"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Proof
                          </button>
                        )}

                        {/* Inspect Details Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedContract(c)}
                          className="p-1 rounded-md bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-900 border border-gray-200/80 text-xs font-medium cursor-pointer transition-colors inline-flex items-center justify-center shrink-0"
                          title="View contract details and milestones"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-gray-50/70 border-t border-gray-200/80 px-5 py-3 flex items-center justify-between text-xs text-gray-500 mt-auto">
          <span>Showing <strong className="text-gray-900 font-semibold">{filteredContracts.length}</strong> of {contracts.length} legal fee agreements</span>
          <span className="font-semibold text-gray-700">Med Jordan Law Practice Management (Page 10)</span>
        </div>
      </div>

      {/* MODAL 1: CONTRACT DETAILS & MILESTONES DRAWER */}
      <Dialog open={!!selectedContract} onOpenChange={(open) => !open && setSelectedContract(null)}>
        <DialogContent
          showCloseButton={false}
          className="max-w-2xl p-0 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {selectedContract && (
            <>
              {/* Modal Header */}
              <div className="px-6 py-4.5 bg-gray-50/90 border-b border-gray-200/80 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-navy-950 text-white flex items-center justify-center font-bold shadow-2xs border border-navy-800">
                    <FileText className="w-5 h-5 text-gray-200" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-navy-950">
                        Agreement Details: {selectedContract.contractNumber}
                      </h3>
                      {getStatusBadge(selectedContract.status)}
                    </div>
                    <p className="text-xs text-gray-500">{selectedContract.templateType} · {selectedContract.practiceArea}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedContract(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-navy-900 hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs custom-scrollbar">
                {/* Client & Counsel Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-200/80 space-y-2">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      Client Entity & Contact
                    </span>
                    <div className="font-bold text-gray-900 text-[13px]">{selectedContract.clientName}</div>
                    <div className="text-gray-600 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-mono">{selectedContract.clientPhone}</span>
                    </div>
                    <div className="text-gray-600 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span>{selectedContract.clientEmail}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-200/80 space-y-2">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                      Representation & Engagement
                    </span>
                    <div>
                      <span className="text-gray-500">Lead Counsel:</span>
                      <span className="font-bold text-gray-900 ml-1.5">{selectedContract.assignedLawyer}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Practice Area:</span>
                      <span className="font-medium text-gray-800 ml-1.5">{selectedContract.practiceArea}</span>
                    </div>
                    <div className="pt-1 border-t border-gray-200/60 flex items-center justify-between">
                      <span className="text-gray-500">Total Agreed Fee:</span>
                      <span className="font-mono font-bold text-navy-950 text-[13px]">{selectedContract.totalFee}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Initial Retainer Deposit:</span>
                      <span className="font-mono font-bold text-emerald-700">{selectedContract.retainerDeposit}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Milestones Table */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    Scheduled Fee Payment Milestones
                  </span>
                  <div className="border border-gray-200/80 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        <tr>
                          <th className="py-2.5 px-3">#</th>
                          <th className="py-2.5 px-3">Milestone Deliverable</th>
                          <th className="py-2.5 px-3 text-right">Amount</th>
                          <th className="py-2.5 px-3">Due Condition / Trigger</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs">
                        {selectedContract.paymentMilestones.map((m, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-2.5 px-3 font-mono text-gray-400 font-medium">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-medium text-gray-800">{m.description}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-semibold text-gray-900">{m.amount}</td>
                            <td className="py-2.5 px-3 text-gray-500 text-[11px]">{m.dueTrigger}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Lifecycle & Electronic Signature Telemetry */}
                <div className="p-3.5 rounded-xl bg-navy-50/50 border border-navy-100 space-y-2">
                  <span className="text-[11px] font-bold text-navy-950 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-navy-800" />
                    Electronic Signature & Cryptographic Trail
                  </span>
                  
                  {selectedContract.status === "Draft" && (
                    <p className="text-gray-600 leading-relaxed">
                      Contract is currently in draft format. Once reviewed by lead counsel, dispatch to client via secure SMS and email link for biometric / drawn signature.
                    </p>
                  )}

                  {selectedContract.status === "Sent for Signature" && (
                    <div className="space-y-1">
                      <p className="text-gray-700">
                        Dispatched on <strong className="text-gray-900">{selectedContract.sentDate}</strong> to client number <span className="font-mono">{selectedContract.clientPhone}</span>.
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Awaiting client digital endorsement. Link valid for 7 days with automated SMS reminder intervals.
                      </p>
                    </div>
                  )}

                  {selectedContract.clientSignature && (
                    <div className="space-y-1.5 pt-1 text-gray-700">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
                        <span>Signatory: <strong className="text-gray-900">{selectedContract.clientSignature.signatoryName}</strong></span>
                        <span>IP Address: <span className="font-mono font-bold text-gray-800">{selectedContract.clientSignature.ipAddress}</span></span>
                        <span>Signed Timestamp: <span className="font-mono text-gray-800">{selectedContract.clientSignature.timestamp}</span></span>
                      </div>
                      <div className="text-[10px] font-mono text-gray-600 bg-white/90 p-2 rounded-lg border border-gray-200/80 break-all select-all">
                        SHA-256 Digest: {selectedContract.clientSignature.docHashSha256}
                      </div>
                    </div>
                  )}

                  {selectedContract.countersignedBy && (
                    <div className="pt-2 border-t border-navy-100 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-800 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Countersigned by {selectedContract.countersignedBy}
                      </span>
                      <span className="text-gray-500">{selectedContract.countersignedAt}</span>
                    </div>
                  )}

                  {selectedContract.amendmentNotes && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
                      <strong>Client Amendment Request:</strong> {selectedContract.amendmentNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="px-6 py-4 bg-gray-50/90 border-t border-gray-200/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  {selectedContract.status === "Draft" && (
                    <button
                      type="button"
                      onClick={() => {
                        handleDispatchContract(selectedContract.id);
                      }}
                      className="px-4 py-2 bg-navy-950 hover:bg-navy-900 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Dispatch Contract Now
                    </button>
                  )}

                  {selectedContract.status === "Sent for Signature" && (
                    <button
                      type="button"
                      onClick={() => {
                        showToast(`Signing link resent to ${selectedContract.clientPhone} via WhatsApp.`);
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Resend WhatsApp / SMS
                    </button>
                  )}

                  {selectedContract.status === "Signed by Client" && (
                    <button
                      type="button"
                      onClick={() => {
                        handleCountersign(selectedContract.id);
                      }}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      Countersign Agreement Now
                    </button>
                  )}

                  {(selectedContract.status === "Signed by Client" || selectedContract.status === "Countersigned & Executed") && (
                    <button
                      type="button"
                      onClick={() => {
                        setCertificateContract(selectedContract);
                      }}
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 font-semibold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      View Cryptographic Audit Certificate
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedContract(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL 2: DRAFT NEW FEE AGREEMENT */}
      <Dialog open={isNewContractOpen} onOpenChange={setIsNewContractOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-xl p-6 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col gap-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-navy-50 text-navy-950 border border-navy-100 flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-950">Draft Fee Agreement (عقد أتعاب محاماة)</h3>
                <p className="text-xs text-gray-500">Formal legal retainer contract preparation (Page 10)</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsNewContractOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-navy-900 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateContract} className="flex flex-col gap-3.5 text-xs">
            <div>
              <label className="font-semibold text-gray-700">Client / Company Entity Name:</label>
              <input
                type="text"
                required
                placeholder="e.g. Sara Odeh (Odeh Industrial Group)"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-200/90 rounded-lg mt-1 text-gray-800 font-medium focus:outline-none focus:border-navy-950 focus:ring-1 focus:ring-navy-950/20 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-gray-700">Client WhatsApp / Phone:</label>
                <input
                  type="text"
                  required
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200/90 rounded-lg mt-1 font-mono text-gray-800 focus:outline-none focus:border-navy-950 focus:ring-1 focus:ring-navy-950/20 transition-colors"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700">Client Email Address:</label>
                <input
                  type="email"
                  placeholder="client@company.jo"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200/90 rounded-lg mt-1 text-gray-800 focus:outline-none focus:border-navy-950 focus:ring-1 focus:ring-navy-950/20 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-gray-700">Template Structure:</label>
                <select
                  value={newTemplateType}
                  onChange={(e) => setNewTemplateType(e.target.value as FeeContractItem["templateType"])}
                  className="w-full p-2.5 bg-white border border-gray-200/90 rounded-lg mt-1 text-gray-800 focus:outline-none focus:border-navy-950 focus:ring-1 focus:ring-navy-950/20 transition-colors"
                >
                  <option value="Litigation Retainer">Litigation Retainer (قالب التقاضي)</option>
                  <option value="Corporate General Counsel">Corporate General Counsel (استشارات سنوية)</option>
                  <option value="Arbitration Agreement">Arbitration Agreement (اتفاقية تحكيم)</option>
                  <option value="Custom Upload">Custom Uploaded Draft</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-gray-700">Lead Counsel:</label>
                <select
                  value={newCounsel}
                  onChange={(e) => setNewCounsel(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-200/90 rounded-lg mt-1 text-gray-800 focus:outline-none focus:border-navy-950 focus:ring-1 focus:ring-navy-950/20 transition-colors"
                >
                  <option value="Tariq Qudah">Tariq Qudah (Senior Partner)</option>
                  <option value="Sara Al-Majali">Sara Al-Majali (Partner)</option>
                  <option value="Kareem Masri">Kareem Masri (Senior Associate)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700">Practice Area:</label>
              <input
                type="text"
                value={newPracticeArea}
                onChange={(e) => setNewPracticeArea(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-200/90 rounded-lg mt-1 text-gray-800 focus:outline-none focus:border-navy-950 focus:ring-1 focus:ring-navy-950/20 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50/70 border border-gray-200/80 rounded-xl">
              <div>
                <label className="font-semibold text-gray-700">Total Legal Fee ($):</label>
                <input
                  type="text"
                  value={newTotalFee}
                  onChange={(e) => setNewTotalFee(e.target.value)}
                  className="w-full p-2 bg-white border border-gray-200/90 rounded-lg mt-1 font-mono font-bold text-gray-900 focus:outline-none focus:border-navy-950 focus:ring-1 focus:ring-navy-950/20 transition-colors"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700">Initial Retainer Deposit ($):</label>
                <input
                  type="text"
                  value={newRetainerDeposit}
                  onChange={(e) => setNewRetainerDeposit(e.target.value)}
                  className="w-full p-2 bg-white border border-gray-200/90 rounded-lg mt-1 font-mono font-bold text-emerald-700 focus:outline-none focus:border-navy-950 focus:ring-1 focus:ring-navy-950/20 transition-colors"
                />
              </div>
            </div>

            {/* Legal Notice */}
            <div className="p-3 bg-navy-50/50 border border-navy-100 text-navy-900 rounded-xl text-[11px] leading-relaxed">
              <strong>Legal Compliance Note (Page 10):</strong> Electronic signature is legally documented with IP and SHA-256 fingerprint. Statutory court powers of attorney (الوكالات الرسمية) must be executed before competent court notaries.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsNewContractOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-navy-950 hover:bg-navy-900 text-white rounded-lg shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <FileCheck className="w-3.5 h-3.5" />
                Save Draft Contract
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: INSPECT SIGNATURE AUDIT CERTIFICATE */}
      <SignedAgreementViewerModal
        isOpen={!!certificateContract}
        onClose={() => setCertificateContract(null)}
        documentTitle={`Med Jordan Law — Fee Agreement (${certificateContract?.contractNumber})`}
        clientName={certificateContract?.clientSignature?.signatoryName || certificateContract?.clientName}
        clientPhone={certificateContract?.clientPhone}
        signedDate={certificateContract?.signedDate || "Executed"}
        pdfName={certificateContract?.pdfUrl || "MJL_Executed_Contract.pdf"}
        docHash={certificateContract?.clientSignature?.docHashSha256}
        clientIp={certificateContract?.clientSignature?.ipAddress}
        onResendWhatsApp={() => {
          showToast(`Signed fee agreement dispatched to ${certificateContract?.clientPhone} via WhatsApp Business.`);
        }}
      />
    </div>
  );
}
