"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Upload,
  Clock,
  Send,
  FileCheck,
  FileX,
  ShieldAlert,
  Gavel,
  FileText,
  Search,
  Copy,
  Check,
  Eye,
  Calendar,
  Building,
  ChevronRight,
  Scale,
} from "lucide-react";
import { CaseItem, DocumentItem, HearingItem, InternalNoteItem } from "@/lib/mock-data";

interface CaseDetailProps {
  caseItem: CaseItem;
  onBack: () => void;
  onAdvanceStage: (caseId: string, nextStage: CaseItem["statusStage"]) => void;
  onAddNote: (caseId: string, content: string, isPrivileged: boolean, tag?: string) => void;
  onUploadDocClick: () => void;
  onScheduleHearingClick: () => void;
  onAuditDocClick: (doc: DocumentItem) => void;
  onPreviewDocClick?: (doc: DocumentItem) => void;
  onLogOutcomeClick: (hearing: HearingItem) => void;
  onViewContract?: () => void;
}

export function CaseDetail({
  caseItem,
  onBack,
  onAdvanceStage,
  onAddNote,
  onUploadDocClick,
  onScheduleHearingClick,
  onAuditDocClick,
  onPreviewDocClick,
  onLogOutcomeClick,
  onViewContract,
}: CaseDetailProps) {
  const [activeSubTab, setActiveSubTab] = useState<"vault" | "hearings" | "notes" | "dossier">("vault");
  const [vaultSearch, setVaultSearch] = useState("");
  const [vaultOriginFilter, setVaultOriginFilter] = useState<"all" | "client" | "office">("all");
  const [copiedCaseNum, setCopiedCaseNum] = useState(false);

  // New Note composer state
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteTag, setNewNoteTag] = useState<InternalNoteItem["tag"]>("Case Strategy");

  const stages: CaseItem["statusStage"][] = [
    "Intake",
    "Discovery",
    "Pleadings",
    "Hearings",
    "Settlement",
    "Closed",
  ];
  const currentStageIndex = stages.indexOf(caseItem.statusStage);

  // Find next upcoming hearing
  const upcomingHearings = caseItem.hearings.filter((h) => h.status === "Upcoming");
  const nextHearing = upcomingHearings[0];

  // Filter vault documents
  const filteredDocs = caseItem.documents.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(vaultSearch.toLowerCase()) ||
      (d.category && d.category.toLowerCase().includes(vaultSearch.toLowerCase()));

    const matchesOrigin =
      vaultOriginFilter === "all" ||
      (vaultOriginFilter === "client" && d.type === "Client Upload") ||
      (vaultOriginFilter === "office" && d.type === "Office Upload");

    return matchesSearch && matchesOrigin;
  });

  const handleCopyCaseNum = () => {
    navigator.clipboard?.writeText(caseItem.caseNumber);
    setCopiedCaseNum(true);
    setTimeout(() => setCopiedCaseNum(false), 2000);
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    onAddNote(caseItem.id, newNoteContent.trim(), true, newNoteTag);
    setNewNoteContent("");
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-200">
      {/* 1. Sleek, Minimal Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cases</span>
          </button>
          <span className="text-gray-300">/</span>
          <span className="font-mono text-gray-400">{caseItem.caseNumber}</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-medium truncate max-w-[260px]">
            {caseItem.clientName}
          </span>
        </div>

        {/* Quiet Quick Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onScheduleHearingClick}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Gavel className="w-3.5 h-3.5 text-gray-500" />
            <span>Schedule</span>
          </button>

          <button
            type="button"
            onClick={onUploadDocClick}
            className="px-3.5 py-1.5 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* 2. Refined Matter Overview Dossier */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-5 sm:p-6 flex flex-col gap-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Title & Metadata Top */}
        <div className="flex flex-col gap-1.5">
          {/* Eyebrow info */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <button
              type="button"
              onClick={handleCopyCaseNum}
              className="font-mono text-[11px] font-medium text-gray-600 hover:text-gray-900 inline-flex items-center gap-1 transition-colors cursor-pointer bg-gray-100 hover:bg-gray-200/70 px-2 py-0.5 rounded"
              title="Copy docket number"
            >
              <span>{caseItem.caseNumber}</span>
              {copiedCaseNum ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3 text-gray-400" />
              )}
            </button>
            <span className="text-gray-300">·</span>
            <span className="text-gray-600 font-medium">{caseItem.practiceArea}</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-400">Opened {caseItem.openedDate}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mt-0.5">
            {caseItem.title}
          </h1>
        </div>

        {/* Clean Key-Value Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 py-3 px-4 rounded-xl bg-gray-50/70 border border-gray-100 text-xs">
          <div>
            <span className="block text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
              Client
            </span>
            <span className="font-semibold text-gray-900 truncate block mt-0.5">
              {caseItem.clientName}
            </span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
              Lead Counsel
            </span>
            <span className="font-medium text-gray-800 truncate block mt-0.5">
              {caseItem.assignedLawyer}
            </span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
              Judicial Forum
            </span>
            <span className="font-medium text-gray-800 truncate block mt-0.5">
              {caseItem.courtChamber}
            </span>
          </div>
          {caseItem.matterValue && (
            <div>
              <span className="block text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
                Claim Value
              </span>
              <span className="font-mono font-medium text-gray-900 truncate block mt-0.5">
                {caseItem.matterValue}
              </span>
            </div>
          )}
          <div>
            <span className="block text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
              Current Stage
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-gray-900 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {caseItem.statusStage} Stage
            </span>
          </div>
        </div>

        {/* Next Scheduled Hearing: Calm, Integrated Callout */}
        {nextHearing && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-gray-200/80 bg-white">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-gray-900">
                    Next Court Session: {nextHearing.date} at {nextHearing.time}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                    {nextHearing.sessionType || "Judicial Hearing"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {nextHearing.chamber} · Presiding: {nextHearing.judge}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {nextHearing.remindersSent && (
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  WhatsApp confirmed
                </span>
              )}
              <button
                type="button"
                onClick={() => onLogOutcomeClick(nextHearing)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
              >
                Log Outcome
              </button>
            </div>
          </div>
        )}

        {/* Milestone Pipeline: Sleek, Low-Profile Segmented Rail */}
        <div className="flex flex-col gap-2 pt-1 border-t border-gray-100">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-gray-400 uppercase tracking-wider">
              Litigation Pipeline
            </span>
            <span className="text-gray-400">
              Click stage to advance
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1 bg-gray-50/80 p-1 rounded-xl border border-gray-200/60">
            {stages.map((stg, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <button
                  key={stg}
                  type="button"
                  onClick={() => onAdvanceStage(caseItem.id, stg)}
                  className={`py-2 px-2.5 rounded-lg text-left flex items-center justify-between transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-white text-gray-900 font-semibold shadow-xs border border-gray-200/90"
                      : isPast
                      ? "text-gray-700 hover:bg-white/70 font-medium"
                      : "text-gray-400 hover:text-gray-600 hover:bg-white/40"
                  }`}
                >
                  <span className="text-xs truncate">{stg}</span>
                  {isPast && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-gray-900 shrink-0" />}
                  {!isPast && !isCurrent && (
                    <span className="text-[10px] font-mono text-gray-400 shrink-0">0{idx + 1}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Sub-Workstation Underline Tabs Bar */}
      <div className="flex items-center gap-6 border-b border-gray-200 text-xs px-1 overflow-x-auto custom-scrollbar">
        <button
          type="button"
          onClick={() => setActiveSubTab("vault")}
          className={`pb-2.5 font-medium transition-colors flex items-center gap-2 cursor-pointer border-b-2 -mb-px whitespace-nowrap shrink-0 ${
            activeSubTab === "vault"
              ? "border-gray-900 text-gray-900 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <span>Documents</span>
          <span className="font-mono text-[11px] px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-600">
            {caseItem.documents.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("hearings")}
          className={`pb-2.5 font-medium transition-colors flex items-center gap-2 cursor-pointer border-b-2 -mb-px whitespace-nowrap shrink-0 ${
            activeSubTab === "hearings"
              ? "border-gray-900 text-gray-900 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <span>Hearings</span>
          <span className="font-mono text-[11px] px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-600">
            {caseItem.hearings.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("notes")}
          className={`pb-2.5 font-medium transition-colors flex items-center gap-2 cursor-pointer border-b-2 -mb-px whitespace-nowrap shrink-0 ${
            activeSubTab === "notes"
              ? "border-gray-900 text-gray-900 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <span>Notes</span>
          <span className="font-mono text-[11px] px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-600">
            {caseItem.internalNotes.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("dossier")}
          className={`pb-2.5 font-medium transition-colors flex items-center gap-2 cursor-pointer border-b-2 -mb-px whitespace-nowrap shrink-0 ${
            activeSubTab === "dossier"
              ? "border-gray-900 text-gray-900 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <span>Details</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: EVIDENCE & PLEADING VAULT */}
      {/* ========================================================================= */}
      {activeSubTab === "vault" && (
        <div className="bg-white border border-gray-200/80 rounded-xl overflow-hidden flex flex-col gap-4 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          {/* Vault Top Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 tracking-tight">
                Documents
              </h2>
              <p className="text-xs text-gray-500">
                Pleadings, powers of attorney, valuations, and exhibits
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onUploadDocClick}
                className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
            </div>
          </div>

          {/* Search & Origin Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2 border-t border-gray-100">
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={vaultSearch}
                onChange={(e) => setVaultSearch(e.target.value)}
                className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-white hover:bg-gray-50/50 focus:bg-white border border-gray-200/90 focus:border-gray-900 rounded-lg focus:outline-none text-gray-900 placeholder:text-gray-400 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200/80 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setVaultOriginFilter("all")}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    vaultOriginFilter === "all" ? "bg-white text-gray-900 shadow-2xs font-semibold" : "text-gray-500"
                  }`}
                >
                  All ({caseItem.documents.length})
                </button>
                <button
                  type="button"
                  onClick={() => setVaultOriginFilter("client")}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    vaultOriginFilter === "client" ? "bg-white text-gray-900 shadow-2xs font-semibold" : "text-gray-500"
                  }`}
                >
                  Client
                </button>
                <button
                  type="button"
                  onClick={() => setVaultOriginFilter("office")}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    vaultOriginFilter === "office" ? "bg-white text-gray-900 shadow-2xs font-semibold" : "text-gray-500"
                  }`}
                >
                  Chambers
                </button>
              </div>
            </div>
          </div>

          {/* Documents Table */}
          <div className="border border-gray-200/80 rounded-xl overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse table-fixed text-xs min-w-[900px]">
                <colgroup>
                  <col className="w-[280px]" />
                  <col className="w-[170px]" />
                  <col className="w-[100px]" />
                  <col className="w-[180px]" />
                  <col className="w-[170px]" />
                </colgroup>
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500">
                    <th className="py-2.5 px-4">Title</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4">Size</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right pr-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredDocs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400">
                        No documents found.
                      </td>
                    </tr>
                  ) : (
                    filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-4 align-middle">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span
                                onClick={() => onPreviewDocClick && onPreviewDocClick(doc)}
                                className="font-semibold text-gray-900 block truncate hover:text-gray-600 cursor-pointer"
                              >
                                {doc.title}
                              </span>
                              <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                                <span>{doc.uploadDate}</span>
                                <span>•</span>
                                <span className="font-medium text-gray-600">{doc.type}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 align-middle whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-800 border border-gray-200/70 inline-block">
                            {doc.category || "Legal Memorandum"}
                          </span>
                        </td>

                        <td className="py-3 px-4 align-middle whitespace-nowrap font-mono text-gray-600 text-[11.5px] tabular-nums">
                          {doc.size}
                        </td>

                        <td className="py-3 px-4 align-middle whitespace-nowrap">
                          {doc.status === "Validated" && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full">
                              <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              Validated
                            </span>
                          )}
                          {doc.status === "Pending" && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200/70 px-2.5 py-0.5 rounded-full">
                              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              Pending
                            </span>
                          )}
                          {doc.status === "Rejected" && (
                            <span
                              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-rose-800 bg-rose-50 border border-rose-200/70 px-2.5 py-0.5 rounded-full cursor-help"
                              title={doc.rejectionReason}
                            >
                              <FileX className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                              Rejected
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 align-middle text-right pr-5 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {onPreviewDocClick && (
                              <button
                                type="button"
                                onClick={() => onPreviewDocClick(doc)}
                                className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-full border border-gray-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                                title="Preview Certified Document"
                              >
                                <Eye className="w-3.5 h-3.5 text-gray-500" />
                                <span>Preview</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => onAuditDocClick(doc)}
                              className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-full border border-gray-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                              title="Inspect Forensic Audit Trail"
                            >
                              <ShieldAlert className="w-3.5 h-3.5 text-gray-600" />
                              <span>Audit</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: JUDICIAL HEARINGS & COURT DOCKET */}
      {/* ========================================================================= */}
      {activeSubTab === "hearings" && (
        <div className="bg-white border border-gray-200/80 rounded-xl overflow-hidden flex flex-col gap-4 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 tracking-tight">
                Hearings
              </h2>
              <p className="text-xs text-gray-500">
                Judicial sessions and reminders
              </p>
            </div>

            <button
              type="button"
              onClick={onScheduleHearingClick}
              className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>Schedule</span>
            </button>
          </div>

          {/* Hearings Stream */}
          <div className="space-y-3 pt-2">
            {caseItem.hearings.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center">
                No hearings scheduled.
              </p>
            ) : (
              caseItem.hearings.map((h) => (
                <div
                  key={h.id}
                  className={`p-4 rounded-xl border flex flex-col gap-2.5 transition-colors ${
                    h.status === "Upcoming"
                      ? "bg-white border-gray-200 shadow-2xs"
                      : "bg-gray-50/60 border-gray-200/70"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 border border-gray-200/60 flex items-center justify-center font-bold shrink-0">
                        <Gavel className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs sm:text-sm text-gray-900">
                            {h.date} at {h.time}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                              h.status === "Completed"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200/70"
                                : "bg-gray-100 text-gray-700 border border-gray-200"
                            }`}
                          >
                            {h.status}
                          </span>
                          {h.sessionType && (
                            <span className="text-[10px] font-medium text-gray-500">
                              • {h.sessionType}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-500 mt-0.5">
                          {h.chamber} · Judge: <strong>{h.judge}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {h.remindersSent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/70 whitespace-nowrap">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Sent
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600 whitespace-nowrap">
                          Queued
                        </span>
                      )}

                      {h.status === "Upcoming" && (
                        <button
                          type="button"
                          onClick={() => onLogOutcomeClick(h)}
                          className="px-2.5 py-1 rounded-md bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-medium cursor-pointer transition-colors"
                        >
                          Log Outcome
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Recorded Outcome */}
                  {h.outcome && (
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200/80 text-xs text-gray-700 flex flex-col gap-1 mt-1">
                      <span className="font-semibold text-gray-900 text-[11px] uppercase tracking-wider">
                        Official Bench Ruling & Order:
                      </span>
                      <p className="text-gray-700 leading-relaxed ps-2 border-s-2 border-gray-900">
                        {h.outcome}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: PRIVILEGED STRATEGY NOTES */}
      {/* ========================================================================= */}
      {activeSubTab === "notes" && (
        <div className="bg-white border border-gray-200/80 rounded-xl overflow-hidden flex flex-col gap-4 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          {/* Legal Confidentiality Banner */}
          <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 text-gray-600 text-xs flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            <span>Privileged attorney work-product.</span>
          </div>

          {/* New Note Composer */}
          <form onSubmit={handleAddNoteSubmit} className="p-4 rounded-xl border border-gray-200/80 bg-gray-50/50 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-semibold text-gray-800">
                Privileged Note:
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500 font-medium">Tag:</span>
                <select
                  value={newNoteTag}
                  onChange={(e) => setNewNoteTag(e.target.value as InternalNoteItem["tag"])}
                  className="px-2 py-1 text-[11px] bg-white border border-gray-200 rounded-lg text-gray-800 font-medium focus:outline-none focus:border-gray-900 transition-colors"
                >
                  <option value="Case Strategy">Strategy</option>
                  <option value="Procedural Motion">Motion</option>
                  <option value="Discovery Finding">Discovery</option>
                  <option value="Client Conference">Conference</option>
                  <option value="Hearing Debrief">Debrief</option>
                </select>
              </div>
            </div>

            <textarea
              rows={3}
              placeholder="Enter note..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="w-full p-2.5 text-xs border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
            />

            <div className="flex items-center justify-end pt-1">
              <button
                type="submit"
                disabled={!newNoteContent.trim()}
                className="px-3.5 py-1.5 rounded-lg bg-gray-900 hover:bg-black disabled:opacity-40 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </form>

          {/* Notes Stream */}
          <div className="space-y-3 pt-2">
            {caseItem.internalNotes.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No notes logged.</p>
            ) : (
              caseItem.internalNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-xl border border-gray-200/80 bg-white flex flex-col gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{note.author}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                        {note.role}
                      </span>
                      {note.tag && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                          {note.tag}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-400 text-[11px] font-mono tabular-nums">
                      {note.date}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: MATTER FILE & PARTIES DIRECTORY */}
      {/* ========================================================================= */}
      {activeSubTab === "dossier" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Parties & Judicial Forum */}
          <div className="bg-white border border-gray-200/80 rounded-xl p-5 flex flex-col gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h2 className="text-sm font-semibold text-gray-900 tracking-tight flex items-center gap-2">
              <Scale className="w-4 h-4 text-gray-600" />
              <span>Parties & Forum</span>
            </h2>

            <div className="space-y-3 text-xs divide-y divide-gray-100">
              <div className="pt-2 flex flex-col gap-0.5">
                <span className="text-[10.5px] uppercase font-semibold text-gray-400">Client</span>
                <span className="font-semibold text-gray-900">{caseItem.clientName}</span>
                <span className="text-gray-500 font-mono text-[11px]">{caseItem.clientPhone} · {caseItem.clientEmail}</span>
              </div>

              <div className="pt-3 flex flex-col gap-0.5">
                <span className="text-[10.5px] uppercase font-semibold text-gray-400">Opposing Party</span>
                <span className="font-semibold text-gray-900">{caseItem.opposingParty || "None"}</span>
              </div>

              <div className="pt-3 flex flex-col gap-0.5">
                <span className="text-[10.5px] uppercase font-semibold text-gray-400">Chamber</span>
                <span className="font-semibold text-gray-900">{caseItem.courtChamber}</span>
                <span className="text-gray-600 text-[11px]">Judge: {caseItem.presidingJudge || "Assigned by Chamber"}</span>
              </div>

              <div className="pt-3 flex flex-col gap-0.5">
                <span className="text-[10.5px] uppercase font-semibold text-gray-400">Counsel</span>
                <span className="font-semibold text-gray-900">{caseItem.assignedLawyer}</span>
              </div>
            </div>
          </div>

          {/* Financials & Engagement Retainer */}
          <div className="bg-white border border-gray-200/80 rounded-xl p-5 flex flex-col gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h2 className="text-sm font-semibold text-gray-900 tracking-tight flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-600" />
              <span>Scope & Retainer</span>
            </h2>

            <div className="space-y-3 text-xs divide-y divide-gray-100">
              <div className="pt-2 flex flex-col gap-0.5">
                <span className="text-[10.5px] uppercase font-semibold text-gray-400">Value</span>
                <span className="font-mono font-bold text-gray-900 text-sm">
                  {caseItem.matterValue || "Corporate Retainer"}
                </span>
              </div>

              <div className="pt-3 flex flex-col gap-0.5">
                <span className="text-[10.5px] uppercase font-semibold text-gray-400">Opened</span>
                <span className="font-medium text-gray-800">{caseItem.openedDate}</span>
              </div>

              <div className="pt-3 flex flex-col gap-0.5">
                <span className="text-[10.5px] uppercase font-semibold text-gray-400">Activity</span>
                <span className="text-gray-700">{caseItem.lastActivity}</span>
              </div>

              {onViewContract && (
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={onViewContract}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 font-medium text-xs flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span>View Agreement</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
