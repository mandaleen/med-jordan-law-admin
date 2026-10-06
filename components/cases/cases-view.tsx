"use client";

import React, { useState } from "react";
import {
  Briefcase,
  FileText,
  Lock,
  Calendar,
  Search,
  Plus,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Clock,
  Send,
  Eye,
  FileCheck,
  FileX,
  ShieldAlert,
  ChevronRight,
  Gavel,
  Bell,
  Scale,
  Sparkles,
} from "lucide-react";
import { CaseItem, DocumentItem, InternalNoteItem, HearingItem, INITIAL_CASES } from "@/lib/mock-data";

export function CasesView() {
  const [cases, setCases] = useState<CaseItem[]>(INITIAL_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [activeSubTab, setActiveSubTab] = useState<"vault" | "notes" | "hearings">("vault");

  // Sub-features state
  const [newNoteContent, setNewNoteContent] = useState("");
  const [vaultFilter, setVaultFilter] = useState<"all" | "client" | "office">("all");
  
  // Modals
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [newCaseClient, setNewCaseClient] = useState("");
  const [newCaseTitle, setNewCaseTitle] = useState("");
  const [newCaseLawyer, setNewCaseLawyer] = useState("Tariq Qudah");
  const [newCaseArea, setNewCaseArea] = useState("Commercial Litigation");

  const [outcomeModalHearing, setOutcomeModalHearing] = useState<HearingItem | null>(null);
  const [hearingOutcomeText, setHearingOutcomeText] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const selectedCase = cases.find((c) => c.id === selectedCaseId);

  // Advance case stage
  const handleAdvanceStage = (caseId: string, nextStage: CaseItem["statusStage"]) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              statusStage: nextStage,
              lastActivity: `Stage updated to ${nextStage} (Client auto-notified via WhatsApp)`,
            }
          : c
      )
    );
    showToast(`✓ Case stage advanced to "${nextStage}". Client notification dispatched via WhatsApp.`);
  };

  // Add internal privileged note
  const handleAddInternalNote = () => {
    if (!newNoteContent.trim() || !selectedCaseId) return;
    const newNote: InternalNoteItem = {
      id: Date.now().toString(),
      author: "Tariq Qudah",
      role: "Senior Partner",
      date: "Just now",
      content: newNoteContent,
      isPrivileged: true,
    };

    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCaseId
          ? {
              ...c,
              internalNotes: [newNote, ...c.internalNotes],
              lastActivity: "Internal attorney work-product note added",
            }
          : c
      )
    );
    setNewNoteContent("");
    showToast("✓ Privileged internal note logged. Encrypted & hidden from client portal.");
  };

  // Log hearing outcome
  const handleSaveHearingOutcome = () => {
    if (!outcomeModalHearing || !selectedCaseId) return;

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === selectedCaseId) {
          return {
            ...c,
            hearings: c.hearings.map((h) =>
              h.id === outcomeModalHearing.id
                ? {
                    ...h,
                    status: "Completed",
                    outcome: hearingOutcomeText || "Session held. Proceedings recorded.",
                  }
                : h
            ),
            lastActivity: `Hearing outcome logged: ${hearingOutcomeText.slice(0, 40)}...`,
          };
        }
        return c;
      })
    );

    showToast("✓ Hearing outcome saved and logged to matter timeline.");
    setOutcomeModalHearing(null);
    setHearingOutcomeText("");
  };

  // Create new case from consultation
  const handleCreateCase = () => {
    if (!newCaseClient || !newCaseTitle) return;
    const newCase: CaseItem = {
      id: `case-${Date.now()}`,
      caseNumber: `MJL-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: newCaseTitle,
      clientName: newCaseClient,
      clientId: `cl-${Date.now()}`,
      clientPhone: "+962 7 9000 1122",
      clientEmail: "client@office.jo",
      assignedLawyer: newCaseLawyer,
      practiceArea: newCaseArea,
      statusStage: "Intake",
      lastActivity: "Matter created post-consultation intake",
      openedDate: "Today, Oct 6",
      courtChamber: "Amman Court of First Instance",
      documents: [
        {
          id: `doc-${Date.now()}`,
          title: "Initial Consultation Retainer Agreement",
          type: "Client Upload",
          uploadDate: "Today",
          size: "1.2 MB",
          status: "Validated",
          isOfficeVisibleToClient: true,
        },
      ],
      internalNotes: [],
      hearings: [],
    };

    setCases([newCase, ...cases]);
    setIsNewCaseModalOpen(false);
    setSelectedCaseId(newCase.id);
    showToast(`✓ Case ${newCase.caseNumber} opened from consultation.`);
  };

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.assignedLawyer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === "all" || c.statusStage.toLowerCase() === stageFilter.toLowerCase();
    return matchesSearch && matchesStage;
  });

  const stagesList: CaseItem["statusStage"][] = [
    "Intake",
    "Discovery",
    "Pleadings",
    "Hearings",
    "Settlement",
    "Closed",
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-[#0A2342] text-white rounded-xl shadow-lg flex items-center justify-between text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* MASTER VIEW: CASE LIST */}
      {!selectedCase ? (
        <div className="flex flex-col gap-4">
          {/* Header Bar */}
          <div className="apple-glass-card p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-10 h-10 rounded-xl bg-[#0A2342] text-white flex items-center justify-center font-bold shadow-xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[17px] font-bold text-[#0A2342] tracking-tight">Cases & Documents</h2>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#007AFF] border border-blue-200/50">
                    {cases.length} Active Matters
                  </span>
                </div>
                <p className="text-[12px] text-slate-400">Post-consultation litigation matters, vault & attorney work-product</p>
              </div>
            </div>

            {/* Filter and New Case Button */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search case #, client, matter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A2342] text-[#0A2342]"
                />
              </div>

              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-[#0A2342] font-medium"
              >
                <option value="all">All Stages</option>
                <option value="intake">Intake</option>
                <option value="discovery">Discovery</option>
                <option value="pleadings">Pleadings</option>
                <option value="hearings">Hearings</option>
                <option value="settlement">Settlement</option>
                <option value="closed">Closed</option>
              </select>

              <button
                type="button"
                onClick={() => setIsNewCaseModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#0A2342] hover:bg-blue-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Open Case from Consultation
              </button>
            </div>
          </div>

          {/* Cases Table */}
          <div className="apple-glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1020px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4 whitespace-nowrap">Case Number</th>
                    <th className="py-3 px-4 whitespace-nowrap">Matter Title & Client</th>
                    <th className="py-3 px-4 whitespace-nowrap">Lead Counsel</th>
                    <th className="py-3 px-4 whitespace-nowrap">Stage / Status</th>
                    <th className="py-3 px-4 whitespace-nowrap">Vault Documents</th>
                    <th className="py-3 px-4 whitespace-nowrap">Last Activity</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredCases.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCaseId(c.id)}
                      className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                    >
                      {/* Case Number */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0A2342] text-[13px] whitespace-nowrap">
                        {c.caseNumber}
                      </td>

                      {/* Matter & Client */}
                      <td className="py-3.5 px-4 max-w-[280px]">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#0A2342] text-[13px] group-hover:text-blue-600 transition-colors truncate">
                            {c.title}
                          </span>
                          <span className="text-[11px] text-slate-500 whitespace-nowrap">{c.clientName} · {c.practiceArea}</span>
                        </div>
                      </td>

                      {/* Lawyer */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-700">{c.assignedLawyer}</span>
                      </td>

                      {/* Stage */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 whitespace-nowrap shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
                          {c.statusStage}
                        </span>
                      </td>

                      {/* Vault Files */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <span className="text-[11px] text-slate-600 font-medium whitespace-nowrap">
                            {c.documents.length} files
                          </span>
                          {c.documents.some((d) => d.status === "Rejected") && (
                            <span className="px-1.5 py-0.2 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold whitespace-nowrap shrink-0">
                              1 Flagged
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Last Activity */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {c.lastActivity}
                      </td>

                      {/* Open Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          className="px-3 py-1 rounded-lg bg-slate-100 group-hover:bg-[#0A2342] group-hover:text-white text-slate-700 text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1 ml-auto whitespace-nowrap shrink-0"
                        >
                          Workspace
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* DETAIL VIEW: DEDICATED CASE WORKSPACE */
        <div className="flex flex-col gap-4">
          {/* Header Back & Overview Card */}
          <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedCaseId(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A2342] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Cases Directory
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Opened: {selectedCase.openedDate}</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-bold text-slate-700">{selectedCase.courtChamber}</span>
              </div>
            </div>

            {/* Matter Title & Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex flex-col">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {selectedCase.caseNumber}
                  </span>
                  <h2 className="text-lg font-bold text-[#0A2342]">{selectedCase.title}</h2>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>Client: <strong className="text-slate-800">{selectedCase.clientName}</strong></span>
                  <span>·</span>
                  <span>Counsel: <strong className="text-slate-800">{selectedCase.assignedLawyer}</strong></span>
                  <span>·</span>
                  <span>Area: <strong className="text-slate-800">{selectedCase.practiceArea}</strong></span>
                </div>
              </div>

              {/* Current Stage Indicator */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Current Stage</span>
                  <span className="text-sm font-bold text-blue-700">{selectedCase.statusStage}</span>
                </div>
              </div>
            </div>

            {/* INTERACTIVE STAGE STEPPER (Triggers Client WhatsApp Notification) */}
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0A2342] flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-blue-600" />
                  Matter Stage Pipeline (Client Portal Synced)
                </span>
                <span className="text-[11px] text-slate-400">
                  Advancing stage auto-dispatches an encrypted WhatsApp notification to the client.
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 pt-1">
                {stagesList.map((st, idx) => {
                  const currentIdx = stagesList.indexOf(selectedCase.statusStage);
                  const isCurrent = st === selectedCase.statusStage;
                  const isPast = idx < currentIdx;

                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleAdvanceStage(selectedCase.id, st)}
                      className={`p-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        isCurrent
                          ? "bg-[#0A2342] text-white font-bold shadow-xs scale-102"
                          : isPast
                          ? "bg-blue-100/70 text-blue-900 font-semibold"
                          : "bg-white border border-slate-200/60 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-wider font-mono opacity-80 whitespace-nowrap">
                        0{idx + 1}
                      </span>
                      <span className="text-xs whitespace-nowrap">{st}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* THREE TAB WORKSPACES */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl w-fit flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setActiveSubTab("vault")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeSubTab === "vault"
                  ? "bg-white text-[#0A2342] shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <FileCheck className="w-4 h-4" />
              Shared Document Vault ({selectedCase.documents.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab("notes")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeSubTab === "notes"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Lock className="w-4 h-4" />
              Internal Notes (Office-Only)
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab("hearings")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeSubTab === "hearings"
                  ? "bg-white text-[#0A2342] shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Gavel className="w-4 h-4" />
              Hearing & Session Tracking ({selectedCase.hearings.length})
            </button>
          </div>

          {/* SUB-TAB 1: SHARED DOCUMENT VAULT */}
          {activeSubTab === "vault" && (
            <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-[#0A2342]">Shared Document Vault</h3>
                  <p className="text-xs text-slate-400">
                    Client uploads are automatically validated. Invalid files are rejected with a clear reason shown to the client.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs">
                    <button
                      onClick={() => setVaultFilter("all")}
                      className={`px-2.5 py-1 rounded-lg cursor-pointer ${vaultFilter === "all" ? "bg-white text-[#0A2342] font-bold shadow-xs" : "text-slate-500"}`}
                    >
                      All ({selectedCase.documents.length})
                    </button>
                    <button
                      onClick={() => setVaultFilter("client")}
                      className={`px-2.5 py-1 rounded-lg cursor-pointer ${vaultFilter === "client" ? "bg-white text-[#0A2342] font-bold shadow-xs" : "text-slate-500"}`}
                    >
                      Client Uploads
                    </button>
                    <button
                      onClick={() => setVaultFilter("office")}
                      className={`px-2.5 py-1 rounded-lg cursor-pointer ${vaultFilter === "office" ? "bg-white text-[#0A2342] font-bold shadow-xs" : "text-slate-500"}`}
                    >
                      Office Uploads
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => showToast("Upload modal ready: Select file to push to client vault.")}
                    className="px-3 py-1.5 rounded-xl bg-[#0A2342] text-white hover:bg-blue-900 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Office Doc
                  </button>
                </div>
              </div>

              {/* Documents List */}
              <div className="flex flex-col gap-3">
                {selectedCase.documents
                  .filter((d) => {
                    if (vaultFilter === "client") return d.type === "Client Upload";
                    if (vaultFilter === "office") return d.type === "Office Upload";
                    return true;
                  })
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col gap-2.5 ${
                        doc.status === "Rejected"
                          ? "bg-rose-50/40 border-rose-200"
                          : "bg-white border-slate-200/80 shadow-xs hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              doc.status === "Rejected"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {doc.status === "Rejected" ? (
                              <FileX className="w-4 h-4" />
                            ) : (
                              <FileCheck className="w-4 h-4" />
                            )}
                          </div>

                          <div className="flex flex-col">
                            <span className="font-bold text-[#0A2342] text-xs">{doc.title}</span>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span className="font-medium text-slate-600">{doc.type}</span>
                              <span>·</span>
                              <span>{doc.size}</span>
                              <span>·</span>
                              <span>Uploaded {doc.uploadDate}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Pills */}
                        <div className="flex items-center gap-2">
                          {doc.type === "Office Upload" && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold whitespace-nowrap shrink-0">
                              Visible in Client Portal
                            </span>
                          )}

                          {doc.status === "Validated" ? (
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold whitespace-nowrap shrink-0">
                              ✓ Auto-Validated
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold animate-pulse whitespace-nowrap shrink-0">
                              Rejected (Reason Provided)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Explicit Rejection Reason Banner Shown to Client */}
                      {doc.status === "Rejected" && doc.rejectionReason && (
                        <div className="p-3 rounded-xl bg-rose-100/70 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                          <div className="flex flex-col">
                            <span className="font-bold">Rejection Reason (Visible to Client in Portal):</span>
                            <p className="mt-0.5 text-[11px] leading-relaxed text-rose-800">
                              {doc.rejectionReason}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 2: INTERNAL NOTES (OFFICE-ONLY VISUAL LOCK & SEPARATION) */}
          {activeSubTab === "notes" && (
            <div className="relative rounded-xl border-2 border-amber-400 bg-gradient-to-b from-[#1C1917] via-[#0C0A09] to-[#1C1917] p-6 text-white shadow-xl flex flex-col gap-5 overflow-hidden">
              {/* Security Banner Header with Explicit Visual Lock */}
              <div className="relative z-10 flex items-start justify-between pb-4 border-b border-amber-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center font-bold">
                    <Lock className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-amber-300 tracking-tight">
                        ATTORNEY-CLIENT PRIVILEGED WORK-PRODUCT
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-400/30">
                        OFFICE ONLY · NEVER VISIBLE TO CLIENT
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Strict visual perimeter. This work-product is physically air-gapped from the client portal API.
                    </p>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-xl bg-stone-900/80 border border-stone-800 text-[11px] font-mono text-amber-200/80">
                  Enclosure ID: MJL-SEC-PRIVILEGE
                </div>
              </div>

              {/* Note Composer */}
              <div className="relative z-10 flex flex-col gap-2 p-3 rounded-xl bg-stone-900/90 border border-amber-500/20">
                <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  Add Privileged Internal Note
                </label>
                <textarea
                  rows={3}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Record confidential trial strategies, judicial sentiment notes, or internal witness assessments..."
                  className="w-full p-2.5 text-xs bg-black/60 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-400 font-sans"
                />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-stone-500">
                    Restricted to authenticated partners & designated litigation associates.
                  </span>
                  <button
                    type="button"
                    onClick={handleAddInternalNote}
                    className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Save Privileged Note
                  </button>
                </div>
              </div>

              {/* Notes List */}
              <div className="relative z-10 flex flex-col gap-3">
                {selectedCase.internalNotes.length === 0 ? (
                  <div className="py-8 text-center text-stone-500 text-xs">
                    No privileged notes recorded for this matter yet.
                  </div>
                ) : (
                  selectedCase.internalNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-xl bg-stone-900/70 border border-stone-800 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-300">{note.author}</span>
                          <span className="text-stone-500 text-[11px]">({note.role})</span>
                        </div>
                        <span className="text-stone-500 text-[11px] font-mono">{note.date}</span>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed font-sans">{note.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SUB-TAB 3: HEARING / SESSION TRACKING */}
          {activeSubTab === "hearings" && (
            <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-[#0A2342]">Court Hearings & Session Outcomes</h3>
                  <p className="text-xs text-slate-400">
                    Track trial dates, automated client reminder triggers, and recorded judicial outcomes.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => showToast("Hearing schedule modal ready.")}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0A2342] text-white hover:bg-blue-900 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Schedule Court Hearing
                </button>
              </div>

              {/* Hearings List */}
              <div className="flex flex-col gap-3">
                {selectedCase.hearings.map((h) => (
                  <div
                    key={h.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0A2342] flex items-center justify-center font-bold shrink-0">
                          <Gavel className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#0A2342] text-xs">
                              {h.date} at {h.time}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                h.status === "Upcoming"
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {h.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-600 mt-0.5">
                            {h.chamber} · Presiding: <strong>{h.judge}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Reminder Status */}
                      <div className="flex items-center gap-2">
                        {h.remindersSent ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            WhatsApp Reminder Sent (Delivered)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 whitespace-nowrap shrink-0">
                            Reminder Queued (48h prior)
                          </span>
                        )}

                        {h.status === "Upcoming" && (
                          <button
                            type="button"
                            onClick={() => {
                              setOutcomeModalHearing(h);
                              setHearingOutcomeText(h.outcome || "");
                            }}
                            className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs whitespace-nowrap shrink-0"
                          >
                            Log Outcome
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Logged Outcome */}
                    {h.outcome && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex flex-col gap-1">
                        <span className="font-bold text-[#0A2342] text-[11px] uppercase tracking-wider">
                          Logged Session Outcome:
                        </span>
                        <p className="text-slate-600">{h.outcome}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: LOG HEARING OUTCOME */}
      {outcomeModalHearing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Gavel className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0A2342]">Log Hearing Outcome</h3>
                <p className="text-xs text-slate-400">
                  {outcomeModalHearing.date} · {outcomeModalHearing.chamber}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Official Outcome / Bench Ruling:</label>
              <textarea
                rows={3}
                placeholder="e.g. Adjourned to Nov 12 for expert witness cross-examination; evidence accepted by court."
                value={hearingOutcomeText}
                onChange={(e) => setHearingOutcomeText(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setOutcomeModalHearing(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveHearingOutcome}
                className="px-4 py-2 text-xs font-bold bg-[#0A2342] hover:bg-blue-900 text-white rounded-xl shadow-xs cursor-pointer whitespace-nowrap shrink-0"
              >
                Record Outcome
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: OPEN CASE FROM CONSULTATION */}
      {isNewCaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0A2342] flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0A2342]">Open Case from Consultation</h3>
                <p className="text-xs text-slate-400">Convert intake consultation into active legal matter</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Client / Company Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Sara Odeh (Odeh Industrial Group)"
                  value={newCaseClient}
                  onChange={(e) => setNewCaseClient(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Matter Title / Dispute:</label>
                <input
                  type="text"
                  placeholder="e.g. Commercial Shareholder Restructuring & Asset Defense"
                  value={newCaseTitle}
                  onChange={(e) => setNewCaseTitle(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Assigned Lead Counsel:</label>
                  <select
                    value={newCaseLawyer}
                    onChange={(e) => setNewCaseLawyer(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 mt-1"
                  >
                    <option value="Tariq Qudah">Tariq Qudah (Senior Partner)</option>
                    <option value="Sara Al-Majali">Sara Al-Majali (Partner)</option>
                    <option value="Kareem Masri">Kareem Masri (Senior Associate)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Practice Area:</label>
                  <select
                    value={newCaseArea}
                    onChange={(e) => setNewCaseArea(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-200 rounded-xl bg-slate-50 mt-1"
                  >
                    <option value="Corporate & M&A">Corporate & M&A</option>
                    <option value="Commercial Litigation">Commercial Litigation</option>
                    <option value="Real Estate & Construction">Real Estate & Construction</option>
                    <option value="Patent & IP">Patent & IP</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsNewCaseModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCase}
                className="px-4 py-2 text-xs font-bold bg-[#0A2342] hover:bg-blue-900 text-white rounded-xl shadow-xs cursor-pointer whitespace-nowrap shrink-0"
              >
                Open Case Matter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
