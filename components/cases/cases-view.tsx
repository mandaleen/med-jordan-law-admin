"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Search,
  Plus,
  Clock,
  ChevronRight,
} from "lucide-react";
import { DocumentItem, HearingItem } from "@/lib/mock-data";
import { usePractice } from "@/lib/practice-context";
import { EmptyState } from "@/components/ui/empty-state";
import { UploadDocumentModal } from "@/components/modals/upload-document-modal";
import { ScheduleHearingModal } from "@/components/modals/schedule-hearing-modal";
import { DocumentAuditModal } from "@/components/modals/document-audit-modal";
import { NewCaseModal } from "@/components/cases/new-case-modal";
import { HearingOutcomeModal } from "@/components/cases/hearing-outcome-modal";
import { CaseDetail } from "@/components/cases/case-detail";

export function CasesView() {
  const {
    cases,
    selectedCaseId,
    setSelectedCaseId,
    addCase,
    advanceCaseStage,
    addCaseNote,
    addCaseHearing,
    updateHearingOutcome,
    addCaseDocument,
  } = usePractice();

  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");

  // Sub-modals state
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [outcomeModalHearing, setOutcomeModalHearing] = useState<HearingItem | null>(null);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [isScheduleHearingOpen, setIsScheduleHearingOpen] = useState(false);
  const [auditDoc, setAuditDoc] = useState<DocumentItem | null>(null);

  const selectedCase = cases.find((c) => c.id === selectedCaseId);

  // Filter cases
  const filteredCases = cases.filter((c) => {
    const matchesQuery =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.assignedLawyer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage =
      stageFilter === "all" || c.statusStage.toLowerCase() === stageFilter.toLowerCase();

    return matchesQuery && matchesStage;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full animate-in fade-in duration-200">
      {!selectedCase ? (
        /* LIST VIEW: CASheader & Table Directory */
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          {/* Header & Filter Bar */}
          <div className="apple-glass-card p-3.5 sm:p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-900 border border-navy-200 flex items-center justify-center font-bold shadow-2xs shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-navy-900 tracking-tight">Active Litigation & Matter Files</h2>
                <p className="text-xs text-gray-500">
                  Comprehensive court docket tracking, encrypted vaults, and judicial hearings
                </p>
              </div>
            </div>

            {/* Actions & Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[200px] flex-1 sm:flex-none">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search docket, client or lawyer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-navy-900 text-gray-900 placeholder:text-gray-400 transition-all"
                />
              </div>

              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-navy-900 text-navy-900 font-medium cursor-pointer"
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
                className="px-3.5 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Open Case Matter
              </button>
            </div>
          </div>

          {/* Cases Table */}
          <div className="apple-table-card flex-1 flex flex-col min-h-[460px]">
            <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse table-fixed min-w-[1220px]">
                <colgroup>
                  <col className="w-[145px]" />
                  <col className="w-[300px]" />
                  <col className="w-[170px]" />
                  <col className="w-[140px]" />
                  <col className="w-[170px]" />
                  <col className="w-[180px]" />
                  <col className="w-[115px]" />
                </colgroup>
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-50 border-b border-gray-300/80 shadow-2xs">
                    <th className="py-3.5 px-4.5 text-[11px] font-bold uppercase tracking-[0.06em] text-gray-500">Case Number</th>
                    <th className="py-3.5 px-4.5 text-[11px] font-bold uppercase tracking-[0.06em] text-gray-500">Matter Title & Client</th>
                    <th className="py-3.5 px-4.5 text-[11px] font-bold uppercase tracking-[0.06em] text-gray-500">Lead Counsel</th>
                    <th className="py-3.5 px-4.5 text-[11px] font-bold uppercase tracking-[0.06em] text-gray-500">Stage / Status</th>
                    <th className="py-3.5 px-4.5 text-[11px] font-bold uppercase tracking-[0.06em] text-gray-500">Vault Documents</th>
                    <th className="py-3.5 px-4.5 text-[11px] font-bold uppercase tracking-[0.06em] text-gray-500">Last Activity</th>
                    <th className="py-3.5 px-4.5 text-[11px] font-bold uppercase tracking-[0.06em] text-gray-500 text-right pr-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredCases.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <EmptyState
                          icon={Briefcase}
                          title="No litigation matters found"
                          description={
                            searchQuery
                              ? `No active cases match "${searchQuery}". Try adjusting your keywords or clearing the stage filter.`
                              : "No cases registered under this filter."
                          }
                          actionLabel={searchQuery || stageFilter !== "all" ? "Reset Filters" : "Open New Case"}
                          onAction={() => {
                            if (searchQuery || stageFilter !== "all") {
                              setSearchQuery("");
                              setStageFilter("all");
                            } else {
                              setIsNewCaseModalOpen(true);
                            }
                          }}
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredCases.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedCaseId(c.id)}
                        className="hover:bg-gray-50/80 transition-colors duration-150 cursor-pointer group"
                      >
                        {/* 1. Case Number */}
                        <td className="py-4 px-4.5 align-middle whitespace-nowrap">
                          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-gray-100 text-navy-900 border border-gray-300 inline-block shadow-2xs">
                            {c.caseNumber}
                          </span>
                        </td>

                        {/* 2. Matter Title & Client */}
                        <td className="py-4 px-4.5 align-middle">
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="font-bold text-navy-900 group-hover:text-navy-600 transition-colors text-xs line-clamp-1">
                              {c.title}
                            </span>
                            <span className="text-[11px] text-gray-500 truncate mt-0.5">
                              Client: <strong className="text-gray-700">{c.clientName}</strong> · {c.practiceArea}
                            </span>
                          </div>
                        </td>

                        {/* 3. Lead Counsel */}
                        <td className="py-4 px-4.5 align-middle whitespace-nowrap">
                          <span className="text-xs font-semibold text-gray-800">{c.assignedLawyer}</span>
                          <span className="block text-[10px] text-gray-400">Senior Chambers</span>
                        </td>

                        {/* 4. Stage / Status */}
                        <td className="py-4 px-4.5 align-middle whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider ${
                              c.statusStage === "Intake"
                                ? "bg-purple-100 text-purple-800 border border-purple-200"
                                : c.statusStage === "Discovery"
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : c.statusStage === "Pleadings"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : c.statusStage === "Hearings"
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {c.statusStage}
                          </span>
                        </td>

                        {/* 5. Vault Documents */}
                        <td className="py-4 px-4.5 align-middle whitespace-nowrap">
                          <span className="text-xs font-medium text-gray-700">
                            <strong>{c.documents.length}</strong> authenticated files
                          </span>
                          <span className="block text-[10px] text-gray-400">
                            {c.documents.filter((d) => d.status === "Validated").length} validated
                          </span>
                        </td>

                        {/* 6. Last Activity */}
                        <td className="py-4 px-4.5 align-middle">
                          <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                            <Clock className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                            <span className="truncate">{c.lastActivity}</span>
                          </div>
                        </td>

                        {/* 7. Action Button */}
                        <td className="py-4 px-4.5 align-middle text-right whitespace-nowrap pr-6">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCaseId(c.id);
                            }}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-navy-900 hover:text-white text-gray-600 transition-colors inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                            title="Open Full Case Dossier"
                          >
                            <span className="text-[11px] font-semibold hidden sm:inline px-1">View</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary Strip */}
            <div className="bg-gray-50 border-t border-gray-300/80 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 mt-auto shrink-0">
              <div className="flex items-center gap-4">
                <span>
                  Showing <strong className="text-navy-900">{filteredCases.length}</strong> of {cases.length} litigation matters
                </span>
                <span className="hidden sm:inline text-gray-300">•</span>
                <span className="hidden sm:inline">
                  Active Vault Docs: <strong className="text-gray-700">{cases.reduce((acc, c) => acc + c.documents.length, 0)}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Total Matters:</span>
                <span className="font-semibold text-navy-900">{cases.length} Registered</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* DETAIL VIEW */
        <CaseDetail
          caseItem={selectedCase}
          onBack={() => setSelectedCaseId(null)}
          onAdvanceStage={advanceCaseStage}
          onAddNote={addCaseNote}
          onUploadDocClick={() => setIsUploadDocOpen(true)}
          onScheduleHearingClick={() => setIsScheduleHearingOpen(true)}
          onAuditDocClick={(doc) => setAuditDoc(doc)}
          onLogOutcomeClick={(hearing) => setOutcomeModalHearing(hearing)}
        />
      )}

      {/* MODAL: LOG HEARING OUTCOME */}
      <HearingOutcomeModal
        hearing={outcomeModalHearing}
        onClose={() => setOutcomeModalHearing(null)}
        onSave={(hearingId, outcomeText) => {
          if (selectedCase) {
            updateHearingOutcome(selectedCase.id, hearingId, outcomeText);
          }
        }}
      />

      {/* MODAL: OPEN CASE */}
      <NewCaseModal
        isOpen={isNewCaseModalOpen}
        onClose={() => setIsNewCaseModalOpen(false)}
        onSubmit={addCase}
      />

      {/* Vault Upload Modal */}
      <UploadDocumentModal
        isOpen={isUploadDocOpen}
        onClose={() => setIsUploadDocOpen(false)}
        caseNumber={selectedCase?.caseNumber}
        onUpload={(doc) => {
          if (selectedCase) addCaseDocument(selectedCase.id, doc);
          setIsUploadDocOpen(false);
        }}
      />

      {/* Hearing Scheduler Modal */}
      <ScheduleHearingModal
        isOpen={isScheduleHearingOpen}
        onClose={() => setIsScheduleHearingOpen(false)}
        caseNumber={selectedCase?.caseNumber}
        onSchedule={(hearing) => {
          if (selectedCase) addCaseHearing(selectedCase.id, hearing);
          setIsScheduleHearingOpen(false);
        }}
      />

      {/* Document Forensic Audit Modal */}
      <DocumentAuditModal
        document={auditDoc}
        onClose={() => setAuditDoc(null)}
      />
    </div>
  );
}
