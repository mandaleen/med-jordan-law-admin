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
} from "lucide-react";
import { CaseItem, DocumentItem, HearingItem } from "@/lib/mock-data";

interface CaseDetailProps {
  caseItem: CaseItem;
  onBack: () => void;
  onAdvanceStage: (caseId: string, nextStage: CaseItem["statusStage"]) => void;
  onAddNote: (caseId: string, content: string, isPrivileged: boolean) => void;
  onUploadDocClick: () => void;
  onScheduleHearingClick: () => void;
  onAuditDocClick: (doc: DocumentItem) => void;
  onLogOutcomeClick: (hearing: HearingItem) => void;
}

export function CaseDetail({
  caseItem,
  onBack,
  onAdvanceStage,
  onAddNote,
  onUploadDocClick,
  onScheduleHearingClick,
  onAuditDocClick,
  onLogOutcomeClick,
}: CaseDetailProps) {
  const [activeSubTab, setActiveSubTab] = useState<"vault" | "notes" | "hearings">("vault");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [vaultFilter, setVaultFilter] = useState<"all" | "client" | "office">("all");

  const stages: CaseItem["statusStage"][] = [
    "Intake",
    "Discovery",
    "Pleadings",
    "Hearings",
    "Settlement",
    "Closed",
  ];
  const currentStageIndex = stages.indexOf(caseItem.statusStage);

  const filteredDocs = caseItem.documents.filter((d) => {
    if (vaultFilter === "client") return d.type === "Client Upload";
    if (vaultFilter === "office") return d.type === "Office Upload";
    return true;
  });

  const handleAddNoteSubmit = () => {
    if (!newNoteContent.trim()) return;
    onAddNote(caseItem.id, newNoteContent.trim(), true);
    setNewNoteContent("");
  };

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
      {/* Header Back & Overview Card */}
      <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-navy-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cases Directory
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Opened: {caseItem.openedDate}</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs font-bold text-gray-700">{caseItem.courtChamber}</span>
          </div>
        </div>

        {/* Matter Title & Summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                {caseItem.caseNumber}
              </span>
              <h2 className="text-lg font-bold text-navy-900">{caseItem.title}</h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
              <span>Client: <strong className="text-gray-800">{caseItem.clientName}</strong></span>
              <span>·</span>
              <span>Counsel: <strong className="text-gray-800">{caseItem.assignedLawyer}</strong></span>
              <span>·</span>
              <span>Area: <strong className="text-gray-800">{caseItem.practiceArea}</strong></span>
            </div>
          </div>

          {/* Current Stage Indicator */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Current Stage</span>
              <span className="text-sm font-bold text-navy-600">{caseItem.statusStage}</span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE STAGE STEPPER */}
        <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">
              Litigation Pipeline & Client Milestone Progress
            </span>
            <span className="text-[11px] text-gray-500">
              Click stage to advance · Automated WhatsApp milestone update dispatched to client
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
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
                      ? "bg-navy-900 border-navy-900 text-white shadow-xs"
                      : isPast
                      ? "bg-white border-gray-200 text-navy-900 hover:border-gray-400"
                      : "bg-gray-100 border-gray-200/80 text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono">0{idx + 1}</span>
                    {isPast && <CheckCircle2 className="w-3 h-3 text-success" />}
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                  </div>
                  <span className="text-xs font-bold tracking-tight">{stg}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Vault vs Privileged Notes vs Court Hearings */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab("vault")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === "vault"
              ? "bg-navy-900 text-white shadow-xs"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Evidence & Pleading Vault ({caseItem.documents.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("notes")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === "notes"
              ? "bg-navy-900 text-white shadow-xs"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-amber-500" />
          <span>Privileged Internal Notes ({caseItem.internalNotes.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("hearings")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === "hearings"
              ? "bg-navy-900 text-white shadow-xs"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <Gavel className="w-3.5 h-3.5 text-navy-700" />
          <span>Court Hearings Docket ({caseItem.hearings.length})</span>
        </button>
      </div>

      {/* TAB 1: EVIDENCE VAULT */}
      {activeSubTab === "vault" && (
        <div className="apple-table-card p-5 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-navy-900">Litigation Document Vault</h3>
              <p className="text-xs text-gray-500">
                Pleadings, authenticated powers of attorney, expert witness affidavits & evidence
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setVaultFilter("all")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    vaultFilter === "all" ? "bg-white text-navy-900 shadow-2xs" : "text-gray-500"
                  }`}
                >
                  All ({caseItem.documents.length})
                </button>
                <button
                  type="button"
                  onClick={() => setVaultFilter("client")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    vaultFilter === "client" ? "bg-white text-navy-900 shadow-2xs" : "text-gray-500"
                  }`}
                >
                  Client Uploads
                </button>
                <button
                  type="button"
                  onClick={() => setVaultFilter("office")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    vaultFilter === "office" ? "bg-white text-navy-900 shadow-2xs" : "text-gray-500"
                  }`}
                >
                  Counsel Filings
                </button>
              </div>

              <button
                type="button"
                onClick={onUploadDocClick}
                className="px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap shrink-0 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Office Document
              </button>
            </div>
          </div>

          {/* Documents Table */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse table-fixed text-xs min-w-[860px]">
              <colgroup>
                <col className="w-[260px]" />
                <col className="w-[140px]" />
                <col className="w-[90px]" />
                <col className="w-[210px]" />
                <col className="w-[160px]" />
              </colgroup>
              <thead>
                <tr className="border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-50/80">
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-4">Source Origin</th>
                  <th className="py-3 px-4">File Size</th>
                  <th className="py-3 px-4">Audit / Validation Status</th>
                  <th className="py-3 px-4 text-right pr-5">Forensic Logs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      No documents found in this category.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-medium text-slate-900 block truncate">{doc.title}</span>
                            <span className="text-[11px] text-slate-400 mt-0.5 block">Uploaded {doc.uploadDate}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                            doc.type === "Client Upload"
                              ? "bg-purple-50 text-purple-700 border-purple-200/60"
                              : "bg-slate-50 text-slate-700 border-slate-200/70"
                          }`}
                        >
                          {doc.type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">{doc.size}</td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {doc.status === "Validated" && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                            <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            Security Validated
                          </span>
                        )}
                        {doc.status === "Pending" && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full">
                            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            Pending Counsel Audit
                          </span>
                        )}
                        {doc.status === "Rejected" && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-rose-700 bg-rose-50 border border-rose-200/60 px-2.5 py-0.5 rounded-full">
                            <FileX className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            Rejected (Re-upload)
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right pr-5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onAuditDocClick(doc)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1.5 border border-slate-200 shadow-none"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          View Audit Trail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRIVILEGED INTERNAL NOTES */}
      {activeSubTab === "notes" && (
        <div className="apple-table-card p-5 flex flex-col gap-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900 text-xs flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <div>
              <strong>Attorney-Client Privilege Notice:</strong> Notes in this section are encrypted and strictly
              hidden from the client portal under Jordan Bar Association Professional Confidentiality rules.
            </div>
          </div>

          {/* New Note Form */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex flex-col gap-2">
            <label className="text-xs font-bold text-navy-900">Add Privileged Work-Product Note:</label>
            <textarea
              rows={3}
              placeholder="e.g. Reviewed opposing counsel's motion to strike. Strategy: Prepare counter-memorial citing Article 124 of Civil Procedures Code..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="w-full p-2.5 text-xs border border-gray-300 rounded-xl bg-white text-navy-900 focus:outline-none focus:ring-1 focus:ring-navy-600"
            />
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-500 font-mono">
                Encrypted with AES-256 chambers master key
              </span>
              <button
                type="button"
                onClick={handleAddNoteSubmit}
                disabled={!newNoteContent.trim()}
                className="px-3.5 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                Log Attorney Note
              </button>
            </div>
          </div>

          {/* Notes History */}
          <div className="space-y-3">
            {caseItem.internalNotes.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No internal notes logged yet.</p>
            ) : (
              caseItem.internalNotes.map((note) => (
                <div key={note.id} className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col gap-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-navy-900">{note.author}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-navy-50 text-navy-700 font-bold border border-navy-100">
                        {note.role}
                      </span>
                    </div>
                    <span className="text-gray-400 text-[11px] font-mono">{note.date}</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed pt-1 whitespace-pre-wrap">{note.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: COURT HEARINGS DOCKET */}
      {activeSubTab === "hearings" && (
        <div className="apple-table-card p-5 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-navy-900">Official Court Hearings & Bench Dockets</h3>
              <p className="text-xs text-gray-500">
                Scheduled court sessions before Jordanian judicial chambers with automated client WhatsApp reminders
              </p>
            </div>

            <button
              type="button"
              onClick={onScheduleHearingClick}
              className="px-3.5 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Gavel className="w-3.5 h-3.5" />
              Schedule Court Hearing
            </button>
          </div>

          {/* Hearings List */}
          <div className="space-y-3">
            {caseItem.hearings.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center">No court hearings currently scheduled.</p>
            ) : (
              caseItem.hearings.map((h) => (
                <div key={h.id} className="p-4 rounded-xl border border-gray-200 bg-white flex flex-col gap-2.5 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center font-bold shrink-0">
                        <Gavel className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-navy-900">{h.date}</span>
                          <span className="text-xs text-gray-500">at {h.time}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              h.status === "Completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {h.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-600 mt-0.5">
                          {h.chamber} · Presiding: <strong>{h.judge}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Reminder Status */}
                    <div className="flex items-center gap-2">
                      {h.remindersSent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-success/10 text-success border border-success/20 whitespace-nowrap shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-success" />
                          WhatsApp Reminder Sent (Delivered)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600 whitespace-nowrap shrink-0">
                          Reminder Queued (48h prior)
                        </span>
                      )}

                      {h.status === "Upcoming" && (
                        <button
                          type="button"
                          onClick={() => onLogOutcomeClick(h)}
                          className="px-3 py-1 rounded-lg bg-navy-600 hover:bg-navy-700 text-white text-xs font-semibold cursor-pointer shadow-xs whitespace-nowrap shrink-0 transition-colors"
                        >
                          Log Outcome
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Logged Outcome */}
                  {h.outcome && (
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 flex flex-col gap-1">
                      <span className="font-bold text-navy-900 text-[11px] uppercase tracking-wider">
                        Logged Session Outcome:
                      </span>
                      <p className="text-gray-600">{h.outcome}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
