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
  User,
  ShieldCheck,
  Download,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Tag,
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
  onToggleDocVisibility?: (docId: string) => void;
  onDeleteDoc?: (docId: string) => void;
  onUpdateDocStatus?: (docId: string, status: DocumentItem["status"], reason?: string) => void;
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
  onToggleDocVisibility,
  onDeleteDoc,
  onUpdateDocStatus,
  onViewContract,
}: CaseDetailProps) {
  const [activeSubTab, setActiveSubTab] = useState<"vault" | "hearings" | "notes" | "dossier">("vault");
  const [vaultSearch, setVaultSearch] = useState("");
  const [vaultCategoryFilter, setVaultCategoryFilter] = useState<string>("all");
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

    const matchesCategory =
      vaultCategoryFilter === "all" ||
      (d.category && d.category.toLowerCase() === vaultCategoryFilter.toLowerCase());

    const matchesOrigin =
      vaultOriginFilter === "all" ||
      (vaultOriginFilter === "client" && d.type === "Client Upload") ||
      (vaultOriginFilter === "office" && d.type === "Office Upload");

    return matchesSearch && matchesCategory && matchesOrigin;
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
    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-700 font-medium border border-gray-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Matters Directory</span>
          </button>
          <span className="text-gray-300">/</span>
          <span className="font-mono text-gray-500 font-medium">{caseItem.caseNumber}</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-semibold truncate max-w-[280px]">
            {caseItem.clientName}
          </span>
        </div>

        {/* Quick Actions Header Toolbar */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onScheduleHearingClick}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Gavel className="w-3.5 h-3.5 text-navy-700" />
            <span>Schedule Hearing</span>
          </button>

          <button
            type="button"
            onClick={onUploadDocClick}
            className="px-3.5 py-1.5 rounded-lg bg-navy-950 hover:bg-navy-900 text-white text-xs font-medium inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Matter Primary Dossier Overview Card */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Title & Core Metadata */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCaseNum}
                className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 hover:bg-gray-200/70 text-gray-900 border border-gray-200/80 inline-flex items-center gap-1 cursor-pointer transition-colors"
                title="Click to copy official court docket number"
              >
                <span>{caseItem.caseNumber}</span>
                {copiedCaseNum ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3 text-gray-400" />
                )}
              </button>

              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-navy-50 text-navy-900 border border-navy-100">
                {caseItem.practiceArea}
              </span>

              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-gray-100 text-gray-700">
                Opened {caseItem.openedDate}
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight mt-1">
              {caseItem.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-0.5">
              <span>
                Client: <strong className="text-gray-900 font-semibold">{caseItem.clientName}</strong>
              </span>
              <span>•</span>
              <span>
                Lead Counsel: <strong className="text-gray-800 font-medium">{caseItem.assignedLawyer}</strong>
              </span>
              <span>•</span>
              <span>
                Forum: <strong className="text-gray-800 font-medium">{caseItem.courtChamber}</strong>
              </span>
              {caseItem.matterValue && (
                <>
                  <span>•</span>
                  <span>
                    Claim Value: <strong className="font-mono text-navy-950 font-semibold">{caseItem.matterValue}</strong>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Current Stage Badge with Advance Dropdown */}
          <div className="flex items-center gap-2 shrink-0 bg-gray-50/80 p-2.5 rounded-xl border border-gray-200/80">
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
                Litigation Status
              </span>
              <span className="text-xs font-bold text-navy-950 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {caseItem.statusStage} Stage
              </span>
            </div>
          </div>
        </div>

        {/* Next Scheduled Hearing Spotlight Banner (if active) */}
        {nextHearing && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-navy-950 to-navy-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center font-bold shrink-0">
                <Gavel className="w-4 h-4 text-amber-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold">
                    Next Court Session: {nextHearing.date} at {nextHearing.time}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-white/10 text-gray-200">
                    {nextHearing.sessionType || "Judicial Hearing"}
                  </span>
                </div>
                <div className="text-xs text-gray-300 mt-0.5 truncate">
                  {nextHearing.chamber} · Presiding: <strong>{nextHearing.judge}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {nextHearing.remindersSent && (
                <span className="text-[11px] font-medium text-emerald-400 inline-flex items-center gap-1 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/80">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  WhatsApp Confirmed
                </span>
              )}
              <button
                type="button"
                onClick={() => onLogOutcomeClick(nextHearing)}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-navy-950 transition-colors cursor-pointer"
              >
                Log Outcome
              </button>
            </div>
          </div>
        )}

        {/* Interactive Compact Milestone Pipeline Stepper */}
        <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-gray-600 uppercase tracking-wider">
              Litigation Milestone Pipeline:
            </span>
            <span className="text-gray-400">
              Click stage to advance matter · Triggers automated client WhatsApp digest
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {stages.map((stg, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <button
                  key={stg}
                  type="button"
                  onClick={() => onAdvanceStage(caseItem.id, stg)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-navy-950 border-navy-950 text-white shadow-xs"
                      : isPast
                      ? "bg-white border-gray-200 text-gray-800 hover:border-gray-400"
                      : "bg-gray-50/70 border-gray-200/70 text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-[10px]">0{idx + 1}</span>
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                  </div>
                  <span className="text-xs font-semibold tracking-tight">{stg}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sub-Workstation Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto custom-scrollbar">
        <button
          type="button"
          onClick={() => setActiveSubTab("vault")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeSubTab === "vault"
              ? "bg-navy-950 text-white shadow-2xs"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Evidence & Pleading Vault</span>
          <span className="font-mono text-[11px] px-1.5 py-0.2 rounded-full bg-white/20 text-current">
            {caseItem.documents.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("hearings")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeSubTab === "hearings"
              ? "bg-navy-950 text-white shadow-2xs"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <Gavel className="w-3.5 h-3.5" />
          <span>Judicial Hearings & Bench</span>
          <span className="font-mono text-[11px] px-1.5 py-0.2 rounded-full bg-white/20 text-current">
            {caseItem.hearings.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("notes")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeSubTab === "notes"
              ? "bg-navy-950 text-white shadow-2xs"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-amber-500" />
          <span>Privileged Strategy Notes</span>
          <span className="font-mono text-[11px] px-1.5 py-0.2 rounded-full bg-white/20 text-current">
            {caseItem.internalNotes.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("dossier")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            activeSubTab === "dossier"
              ? "bg-navy-950 text-white shadow-2xs"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Matter File & Parties</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: EVIDENCE & PLEADING VAULT */}
      {/* ========================================================================= */}
      {activeSubTab === "vault" && (
        <div className="bg-white border border-gray-200/90 rounded-xl overflow-hidden flex flex-col gap-4 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          {/* Vault Top Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 tracking-tight">
                Litigation Evidence & Pleading Vault
              </h2>
              <p className="text-xs text-gray-500">
                Pleadings, certified powers of attorney, expert valuations, and evidentiary exhibits
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onUploadDocClick}
                className="px-3.5 py-1.5 rounded-lg bg-navy-950 hover:bg-navy-900 text-white text-xs font-medium inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload to Vault</span>
              </button>
            </div>
          </div>

          {/* Search & Origin Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2 border-t border-gray-100">
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search case documents..."
                value={vaultSearch}
                onChange={(e) => setVaultSearch(e.target.value)}
                className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-white hover:bg-gray-50/50 focus:bg-white border border-gray-200/90 focus:border-navy-900 rounded-lg focus:outline-none text-gray-900 placeholder:text-gray-400 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs font-medium">
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
                  Client Uploads
                </button>
                <button
                  type="button"
                  onClick={() => setVaultOriginFilter("office")}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    vaultOriginFilter === "office" ? "bg-white text-gray-900 shadow-2xs font-semibold" : "text-gray-500"
                  }`}
                >
                  Chambers Filings
                </button>
              </div>
            </div>
          </div>

          {/* Documents Table */}
          <div className="border border-gray-200/90 rounded-xl overflow-hidden">
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
                  <tr className="bg-gray-50/90 border-b border-gray-200/80 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500">
                    <th className="py-3 px-4">Document Title & Details</th>
                    <th className="py-3 px-4">Classification</th>
                    <th className="py-3 px-4">File Size</th>
                    <th className="py-3 px-4">Audit & Security Status</th>
                    <th className="py-3 px-4 text-right pr-5">Actions & Forensics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredDocs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400">
                        No documents found matching your filter.
                      </td>
                    </tr>
                  ) : (
                    filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-4 align-middle">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span
                                onClick={() => onPreviewDocClick && onPreviewDocClick(doc)}
                                className="font-semibold text-gray-900 block truncate hover:text-navy-700 hover:underline cursor-pointer"
                              >
                                {doc.title}
                              </span>
                              <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                                <span>Uploaded {doc.uploadDate}</span>
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

                        <td className="py-3 px-4 align-middle whitespace-nowrap font-mono text-gray-700 text-[11.5px] tabular-nums">
                          {doc.size}
                        </td>

                        <td className="py-3 px-4 align-middle whitespace-nowrap">
                          {doc.status === "Validated" && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full">
                              <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              Security Validated
                            </span>
                          )}
                          {doc.status === "Pending" && (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200/70 px-2.5 py-0.5 rounded-full">
                              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              Pending Counsel Audit
                            </span>
                          )}
                          {doc.status === "Rejected" && (
                            <span
                              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-rose-800 bg-rose-50 border border-rose-200/70 px-2.5 py-0.5 rounded-full cursor-help"
                              title={doc.rejectionReason}
                            >
                              <FileX className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                              Re-upload Required
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 align-middle text-right pr-5 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {onPreviewDocClick && (
                              <button
                                type="button"
                                onClick={() => onPreviewDocClick(doc)}
                                className="px-2 py-1 text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-md border border-gray-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                                title="Preview Certified Document"
                              >
                                <Eye className="w-3.5 h-3.5 text-gray-500" />
                                <span>Preview</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => onAuditDocClick(doc)}
                              className="px-2 py-1 text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-md border border-gray-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                              title="Inspect Forensic Audit Trail"
                            >
                              <ShieldAlert className="w-3.5 h-3.5 text-navy-700" />
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
        <div className="bg-white border border-gray-200/90 rounded-xl overflow-hidden flex flex-col gap-4 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 tracking-tight">
                Official Court Hearings & Bench Dockets
              </h2>
              <p className="text-xs text-gray-500">
                Judicial sessions before Jordanian court chambers with automated WhatsApp reminders
              </p>
            </div>

            <button
              type="button"
              onClick={onScheduleHearingClick}
              className="px-3.5 py-1.5 rounded-lg bg-navy-950 hover:bg-navy-900 text-white text-xs font-medium inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>Schedule Court Hearing</span>
            </button>
          </div>

          {/* Hearings Stream */}
          <div className="space-y-3 pt-2">
            {caseItem.hearings.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center">
                No court hearings currently scheduled for this matter.
              </p>
            ) : (
              caseItem.hearings.map((h) => (
                <div
                  key={h.id}
                  className={`p-4 rounded-xl border flex flex-col gap-2.5 transition-colors ${
                    h.status === "Upcoming"
                      ? "bg-white border-gray-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                      : "bg-gray-50/60 border-gray-200/70"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-900 border border-navy-100 flex items-center justify-center font-bold shrink-0">
                        <Gavel className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-gray-900">
                            {h.date} at {h.time}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                              h.status === "Completed"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200/70"
                                : "bg-blue-50 text-blue-800 border border-blue-200/70"
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
                        <span className="text-[11px] text-gray-600 mt-0.5">
                          {h.chamber} · Presiding Judge: <strong>{h.judge}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {h.remindersSent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/70 whitespace-nowrap">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          WhatsApp Reminder Dispatched
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600 whitespace-nowrap">
                          Reminder Queued (48h prior)
                        </span>
                      )}

                      {h.status === "Upcoming" && (
                        <button
                          type="button"
                          onClick={() => onLogOutcomeClick(h)}
                          className="px-2.5 py-1 rounded-md bg-navy-950 hover:bg-navy-900 text-white text-xs font-medium cursor-pointer shadow-2xs transition-colors"
                        >
                          Log Ruling
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
                      <p className="text-gray-700 leading-relaxed ps-2 border-s-2 border-navy-900">
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
        <div className="bg-white border border-gray-200/90 rounded-xl overflow-hidden flex flex-col gap-4 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          {/* Legal Confidentiality Banner */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 text-amber-950 text-xs flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Attorney-Client Privilege Notice (Art. 24 Jordan Bar Code):</strong> Notes recorded here
              represent strictly confidential attorney work-product. They are encrypted with the chambers master key
              and excluded from client portal views and statutory discovery requests.
            </div>
          </div>

          {/* New Note Composer */}
          <form onSubmit={handleAddNoteSubmit} className="p-4 rounded-xl border border-gray-200/90 bg-gray-50/60 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-semibold text-gray-800">
                Log Privileged Work-Product Note:
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500 font-medium">Tag Category:</span>
                <select
                  value={newNoteTag}
                  onChange={(e) => setNewNoteTag(e.target.value as InternalNoteItem["tag"])}
                  className="px-2 py-1 text-[11px] bg-white border border-gray-200 rounded-lg text-gray-800 font-medium focus:outline-none focus:border-navy-900 transition-colors"
                >
                  <option value="Case Strategy">Case Strategy (استراتيجية المرافعة)</option>
                  <option value="Procedural Motion">Procedural Motion (دفع شكلي وإجرائي)</option>
                  <option value="Discovery Finding">Discovery Finding (بينة مستجدة)</option>
                  <option value="Client Conference">Client Conference (مداولة مع الموكل)</option>
                  <option value="Hearing Debrief">Hearing Debrief (تقييم مجريات الجلسة)</option>
                </select>
              </div>
            </div>

            <textarea
              rows={3}
              placeholder="e.g. Reviewed opposing counsel's motion to strike. Strategy: Prepare counter-memorial citing Article 124 of Civil Procedures Code..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="w-full p-2.5 text-xs border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-navy-900 transition-colors"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-400 font-mono">
                Encrypted with AES-256 chambers master key
              </span>
              <button
                type="submit"
                disabled={!newNoteContent.trim()}
                className="px-3.5 py-1.5 rounded-lg bg-navy-950 hover:bg-navy-900 disabled:opacity-40 text-white text-xs font-medium inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </button>
            </div>
          </form>

          {/* Notes Stream */}
          <div className="space-y-3 pt-2">
            {caseItem.internalNotes.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No internal notes logged yet.</p>
            ) : (
              caseItem.internalNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-xl border border-gray-200/90 bg-white flex flex-col gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{note.author}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy-50 text-navy-800 font-medium border border-navy-100">
                        {note.role}
                      </span>
                      {note.tag && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
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
          <div className="bg-white border border-gray-200/90 rounded-xl p-5 flex flex-col gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h2 className="text-sm font-semibold text-gray-900 tracking-tight flex items-center gap-2">
              <Scale className="w-4 h-4 text-navy-800" />
              <span>Litigation Parties & Judicial Bench</span>
            </h2>

            <div className="space-y-3 text-xs divide-y divide-gray-100">
              <div className="pt-2 flex flex-col gap-0.5">
                <span className="text-[10.5px] uppercase font-semibold text-gray-400">Claimant / Client</span>
                <span className="font-semibold text-gray-900">{caseItem.clientName}</span>
                <span className="text-gray-500 font-mono text-[11px]">{caseItem.clientPhone} · {caseItem.clientEmail}</span>
              </div>

              <div className="pt-3 flex flex-col gap-0.5">
                <span className="text-[10.5px] uppercase font-semibold text-gray-400">Respondent / Opposing Party</span>
                <span className="font-semibold text-gray-900">{caseItem.opposingParty || "Pending formal service"}</span>
              </div>

              <div className="pt-3 flex flex-col gap-0.5">
                <span className="text-[10.5px] uppercase font-semibold text-gray-400">Presiding Bench / Judicial Chamber</span>
                <span className="font-semibold text-gray-900">{caseItem.courtChamber}</span>
                <span className="text-gray-600 text-[11px]">Judge: {caseItem.presidingJudge || "Assigned by Chamber President"}</span>
              </div>

              <div className="pt-3 flex flex-col gap-0.5">
                <span className="text-[10.5px] uppercase font-semibold text-gray-400">Chambers Lead Counsel</span>
                <span className="font-semibold text-gray-900">{caseItem.assignedLawyer}</span>
                <span className="text-gray-500 text-[11px]">Senior Practice Group</span>
              </div>
            </div>
          </div>

          {/* Financials & Engagement Retainer */}
          <div className="bg-white border border-gray-200/90 rounded-xl p-5 flex flex-col gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <h2 className="text-sm font-semibold text-gray-900 tracking-tight flex items-center gap-2">
              <Building className="w-4 h-4 text-navy-800" />
              <span>Engagement Scope & Financial Retainer</span>
            </h2>

            <div className="space-y-3 text-xs divide-y divide-gray-100">
              <div className="pt-2 flex flex-col gap-0.5">
                <span className="text-[10.5px] uppercase font-semibold text-gray-400">Matter Financial Valuation</span>
                <span className="font-mono font-bold text-gray-900 text-sm">
                  {caseItem.matterValue || "Corporate Advisory Retainer"}
                </span>
              </div>

              <div className="pt-3 flex flex-col gap-0.5">
                <span className="text-[10.5px] uppercase font-semibold text-gray-400">Opened Date</span>
                <span className="font-medium text-gray-800">{caseItem.openedDate}</span>
              </div>

              <div className="pt-3 flex flex-col gap-0.5">
                <span className="text-[10.5px] uppercase font-semibold text-gray-400">Last System Activity</span>
                <span className="text-gray-700">{caseItem.lastActivity}</span>
              </div>

              {onViewContract && (
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={onViewContract}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 font-medium text-xs flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span>View Executed Fee Agreement</span>
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
