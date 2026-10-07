"use client";

import React, { useState, useMemo } from "react";
import {
  Briefcase,
  Search,
  Plus,
  Clock,
  ChevronRight,
  Gavel,
  FileText,
  Lock,
  Eye,
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  FileX,
  Layers,
  LayoutGrid,
  List,
  Filter,
  CheckCircle2,
  Calendar,
  Building,
  Scale,
  Upload,
  ArrowUpRight,
  SlidersHorizontal,
} from "lucide-react";
import { DocumentItem, HearingItem, CaseItem } from "@/lib/mock-data";
import { usePractice } from "@/lib/practice-context";
import { EmptyState } from "@/components/ui/empty-state";
import { UploadDocumentModal } from "@/components/modals/upload-document-modal";
import { ScheduleHearingModal } from "@/components/modals/schedule-hearing-modal";
import { DocumentAuditModal } from "@/components/modals/document-audit-modal";
import { DocumentPreviewModal } from "@/components/modals/document-preview-modal";
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
    toggleCaseDocumentVisibility,
    updateCaseDocumentStatus,
    deleteCaseDocument,
    setActiveNav,
  } = usePractice();

  // Dual-mode Workspace Segmented Controller: Matters List vs Master Document Vault
  const [activeWorkspaceMode, setActiveWorkspaceMode] = useState<"matters" | "vault">("matters");

  // Matters filters & layout
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [forumFilter, setForumFilter] = useState<string>("all");
  const [mattersLayout, setMattersLayout] = useState<"table" | "board">("table");

  // Vault-specific filters
  const [vaultSearch, setVaultSearch] = useState("");
  const [vaultCategoryFilter, setVaultCategoryFilter] = useState<string>("all");
  const [vaultStatusFilter, setVaultStatusFilter] = useState<string>("all");
  const [vaultVisibilityFilter, setVaultVisibilityFilter] = useState<string>("all");

  // Modals state
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [outcomeModalHearing, setOutcomeModalHearing] = useState<HearingItem | null>(null);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [targetCaseForUpload, setTargetCaseForUpload] = useState<CaseItem | null>(null);
  const [isScheduleHearingOpen, setIsScheduleHearingOpen] = useState(false);
  const [targetCaseForHearing, setTargetCaseForHearing] = useState<CaseItem | null>(null);
  const [auditDoc, setAuditDoc] = useState<DocumentItem | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{
    doc: DocumentItem;
    caseNumber: string;
    clientName: string;
  } | null>(null);

  const selectedCase = cases.find((c) => c.id === selectedCaseId);

  // Filter cases
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        c.title.toLowerCase().includes(q) ||
        c.clientName.toLowerCase().includes(q) ||
        c.caseNumber.toLowerCase().includes(q) ||
        c.assignedLawyer.toLowerCase().includes(q) ||
        (c.opposingParty && c.opposingParty.toLowerCase().includes(q)) ||
        (c.courtChamber && c.courtChamber.toLowerCase().includes(q));

      const matchesStage =
        stageFilter === "all" || c.statusStage.toLowerCase() === stageFilter.toLowerCase();

      const matchesForum =
        forumFilter === "all" ||
        (c.courtChamber && c.courtChamber.toLowerCase().includes(forumFilter.toLowerCase()));

      return matchesQuery && matchesStage && matchesForum;
    });
  }, [cases, searchQuery, stageFilter, forumFilter]);

  // Aggregate all documents across all cases for the Master Document Vault
  const allVaultDocuments = useMemo(() => {
    const list: Array<{
      document: DocumentItem;
      caseItem: CaseItem;
    }> = [];

    cases.forEach((c) => {
      c.documents.forEach((d) => {
        list.push({
          document: d,
          caseItem: c,
        });
      });
    });

    return list;
  }, [cases]);

  // Filtered vault documents
  const filteredVaultDocuments = useMemo(() => {
    return allVaultDocuments.filter(({ document: d, caseItem: c }) => {
      const q = vaultSearch.toLowerCase();
      const matchesSearch =
        d.title.toLowerCase().includes(q) ||
        c.caseNumber.toLowerCase().includes(q) ||
        c.clientName.toLowerCase().includes(q) ||
        (d.category && d.category.toLowerCase().includes(q)) ||
        (d.docHash && d.docHash.toLowerCase().includes(q));

      const matchesCategory =
        vaultCategoryFilter === "all" ||
        (d.category && d.category.toLowerCase().includes(vaultCategoryFilter.toLowerCase()));

      const matchesStatus =
        vaultStatusFilter === "all" ||
        d.status.toLowerCase() === vaultStatusFilter.toLowerCase();

      const matchesVisibility =
        vaultVisibilityFilter === "all" ||
        (vaultVisibilityFilter === "visible" && d.isOfficeVisibleToClient) ||
        (vaultVisibilityFilter === "internal" && !d.isOfficeVisibleToClient);

      return matchesSearch && matchesCategory && matchesStatus && matchesVisibility;
    });
  }, [allVaultDocuments, vaultSearch, vaultCategoryFilter, vaultStatusFilter, vaultVisibilityFilter]);

  // Executive Metric Computations
  const totalMattersCount = cases.length;
  const activeHearingsCount = cases.reduce(
    (acc, c) => acc + c.hearings.filter((h) => h.status === "Upcoming").length,
    0
  );
  const totalDocumentsCount = allVaultDocuments.length;
  const validatedDocumentsCount = allVaultDocuments.filter(
    (item) => item.document.status === "Validated"
  ).length;
  const pendingAuditDocumentsCount = allVaultDocuments.filter(
    (item) => item.document.status === "Pending"
  ).length;
  const rejectedDocumentsCount = allVaultDocuments.filter(
    (item) => item.document.status === "Rejected"
  ).length;

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full animate-in fade-in duration-200">
      {!selectedCase ? (
        /* ===================================================================== */
        /* DIRECTORY VIEW: MATTERS & MASTER VAULT */
        /* ===================================================================== */
        <div className="flex-1 flex flex-col gap-3.5 min-h-0">
          {/* Top Executive Header & View Controller */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-950 border border-navy-100 flex items-center justify-center font-bold shrink-0">
                  <Scale className="w-5 h-5 text-navy-900" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                      Litigation Matters & Evidence Vault (القضايا والوثائق)
                    </h1>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {totalMattersCount} Matters Registered
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Judicial dockets, courtroom hearing management, client milestone tracking, and cryptographic document vaults
                  </p>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setTargetCaseForUpload(null);
                    setIsUploadDocOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-navy-700" />
                  <span>Upload Document</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsNewCaseModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-navy-950 hover:bg-navy-900 text-white text-xs font-medium inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Open Matter File</span>
                </button>
              </div>
            </div>

            {/* Metric Summary Ribbon */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-3 border-t border-gray-100">
              <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
                    Active Matters
                  </span>
                  <div className="text-base font-bold text-gray-900 font-mono tabular-nums mt-0.5">
                    {totalMattersCount} Litigation Files
                  </div>
                  <span className="text-[10.5px] text-gray-500">
                    {cases.filter((c) => c.statusStage === "Pleadings" || c.statusStage === "Hearings").length} in court action
                  </span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-white border border-gray-200/80 flex items-center justify-center text-navy-900 shrink-0">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
                    Judicial Hearings
                  </span>
                  <div className="text-base font-bold text-amber-700 font-mono tabular-nums mt-0.5">
                    {activeHearingsCount} Upcoming Sessions
                  </div>
                  <span className="text-[10.5px] text-gray-500">
                    Automated WhatsApp alerts active
                  </span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-white border border-gray-200/80 flex items-center justify-center text-amber-600 shrink-0">
                  <Gavel className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
                    Vault Documents
                  </span>
                  <div className="text-base font-bold text-gray-900 font-mono tabular-nums mt-0.5">
                    {totalDocumentsCount} Indexed Files
                  </div>
                  <span className="text-[10.5px] text-emerald-700 font-medium">
                    {validatedDocumentsCount} Security Validated
                  </span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-white border border-gray-200/80 flex items-center justify-center text-emerald-700 shrink-0">
                  <FileCheck className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
                    Compliance & Audits
                  </span>
                  <div className="text-base font-bold text-navy-950 font-mono tabular-nums mt-0.5">
                    {pendingAuditDocumentsCount} Pending Review
                  </div>
                  <span className="text-[10.5px] text-gray-500">
                    {rejectedDocumentsCount > 0 ? (
                      <span className="text-rose-700 font-medium">{rejectedDocumentsCount} re-upload needed</span>
                    ) : (
                      "All client filings audited"
                    )}
                  </span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-white border border-gray-200/80 flex items-center justify-center text-navy-800 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Segmented Mode Switcher: Litigation Matters vs Master Document Vault */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveWorkspaceMode("matters")}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeWorkspaceMode === "matters"
                      ? "bg-white text-navy-950 shadow-2xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Litigation Matters Docket ({filteredCases.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveWorkspaceMode("vault")}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeWorkspaceMode === "vault"
                      ? "bg-white text-navy-950 shadow-2xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Master Document Vault ({allVaultDocuments.length})</span>
                </button>
              </div>

              {activeWorkspaceMode === "matters" && (
                <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setMattersLayout("table")}
                    className={`p-1 rounded-md cursor-pointer transition-colors ${
                      mattersLayout === "table" ? "bg-white text-navy-950 shadow-2xs" : "text-gray-500 hover:text-gray-900"
                    }`}
                    title="Table View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMattersLayout("board")}
                    className={`p-1 rounded-md cursor-pointer transition-colors ${
                      mattersLayout === "board" ? "bg-white text-navy-950 shadow-2xs" : "text-gray-500 hover:text-gray-900"
                    }`}
                    title="Pipeline Board View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* =================================================================== */}
          {/* VIEW MODE 1: LITIGATION MATTERS */}
          {/* =================================================================== */}
          {activeWorkspaceMode === "matters" && (
            <div className="flex-1 flex flex-col gap-3 min-h-0">
              {/* Matters Filters Bar */}
              <div className="bg-white border border-gray-200/90 rounded-xl p-3 sm:p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <div className="relative w-full md:w-80">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search docket #, client, title, judge, forum..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-white hover:bg-gray-50/50 focus:bg-white border border-gray-200/90 focus:border-navy-900 rounded-lg focus:outline-none text-gray-900 placeholder:text-gray-400 transition-colors"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                  <select
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white hover:bg-gray-50/50 border border-gray-200/90 rounded-lg focus:outline-none focus:border-navy-900 text-gray-800 font-medium cursor-pointer transition-colors"
                  >
                    <option value="all">All Stages ({cases.length})</option>
                    <option value="intake">Intake</option>
                    <option value="discovery">Discovery</option>
                    <option value="pleadings">Pleadings</option>
                    <option value="hearings">Hearings</option>
                    <option value="settlement">Settlement</option>
                    <option value="closed">Closed / Concluded</option>
                  </select>

                  <select
                    value={forumFilter}
                    onChange={(e) => setForumFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white hover:bg-gray-50/50 border border-gray-200/90 rounded-lg focus:outline-none focus:border-navy-900 text-gray-800 font-medium cursor-pointer transition-colors"
                  >
                    <option value="all">All Judicial Forums</option>
                    <option value="appeal">Court of Appeal (محكمة الاستئناف)</option>
                    <option value="first instance">Court of First Instance (البداية)</option>
                    <option value="companies">Companies Controller (مراقبة الشركات)</option>
                    <option value="property">IP Protection Directorate (الملكية الفكرية)</option>
                    <option value="cassation">Court of Cassation (التمييز)</option>
                  </select>
                </div>
              </div>

              {/* TABLE VIEW */}
              {mattersLayout === "table" ? (
                <div className="bg-white border border-gray-200/90 rounded-xl overflow-hidden flex-1 flex flex-col min-h-[460px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse table-fixed min-w-[1240px]">
                      <colgroup>
                        <col className="w-[145px]" />
                        <col className="w-[320px]" />
                        <col className="w-[160px]" />
                        <col className="w-[140px]" />
                        <col className="w-[190px]" />
                        <col className="w-[160px]" />
                        <col className="w-[125px]" />
                      </colgroup>
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-gray-50/90 backdrop-blur-xs border-b border-gray-200/80">
                          <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500">
                            Docket Number
                          </th>
                          <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500">
                            Matter Title & Client
                          </th>
                          <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500">
                            Lead Counsel
                          </th>
                          <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500">
                            Stage / Status
                          </th>
                          <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500">
                            Next Hearing Session
                          </th>
                          <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500">
                            Vault Documents
                          </th>
                          <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500 text-right pr-5">
                            Actions
                          </th>
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
                                  searchQuery || stageFilter !== "all" || forumFilter !== "all"
                                    ? "No active cases match your filters. Try clearing your search keywords or resetting filters."
                                    : "No legal matters registered in the docket."
                                }
                                actionLabel={
                                  searchQuery || stageFilter !== "all" || forumFilter !== "all"
                                    ? "Reset Filters"
                                    : "Open New Case"
                                }
                                onAction={() => {
                                  if (searchQuery || stageFilter !== "all" || forumFilter !== "all") {
                                    setSearchQuery("");
                                    setStageFilter("all");
                                    setForumFilter("all");
                                  } else {
                                    setIsNewCaseModalOpen(true);
                                  }
                                }}
                              />
                            </td>
                          </tr>
                        ) : (
                          filteredCases.map((c) => {
                            const upcomingH = c.hearings.find((h) => h.status === "Upcoming");
                            return (
                              <tr
                                key={c.id}
                                onClick={() => setSelectedCaseId(c.id)}
                                className="hover:bg-gray-50/60 transition-colors cursor-pointer group"
                              >
                                {/* 1. Docket Number & Forum */}
                                <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-900 border border-gray-200/70 inline-block group-hover:bg-navy-50 group-hover:border-navy-200 transition-colors">
                                    {c.caseNumber}
                                  </span>
                                  <span className="block text-[10.5px] text-gray-400 mt-1 truncate">
                                    {c.courtChamber.split("-")[0].trim()}
                                  </span>
                                </td>

                                {/* 2. Title & Client */}
                                <td className="py-3.5 px-4 align-middle">
                                  <div className="flex flex-col min-w-0 pr-2">
                                    <span className="font-semibold text-gray-900 group-hover:text-navy-700 transition-colors text-xs line-clamp-1">
                                      {c.title}
                                    </span>
                                    <span className="text-[11px] text-gray-500 truncate mt-0.5">
                                      Client: <strong className="text-gray-800 font-medium">{c.clientName}</strong> · {c.practiceArea}
                                    </span>
                                    {c.opposingParty && (
                                      <span className="text-[10px] text-gray-400 truncate mt-0.5">
                                        vs. {c.opposingParty}
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* 3. Lead Counsel */}
                                <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                                  <span className="text-xs font-medium text-gray-900">{c.assignedLawyer}</span>
                                  <span className="block text-[10.5px] text-gray-400 mt-0.5">Senior Practice Group</span>
                                </td>

                                {/* 4. Stage Status */}
                                <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                                      c.statusStage === "Intake"
                                        ? "bg-purple-50/80 text-purple-800 border-purple-200/60"
                                        : c.statusStage === "Discovery"
                                        ? "bg-blue-50/80 text-blue-800 border-blue-200/60"
                                        : c.statusStage === "Pleadings"
                                        ? "bg-amber-50/80 text-amber-900 border-amber-200/70"
                                        : c.statusStage === "Hearings"
                                        ? "bg-rose-50/80 text-rose-800 border-rose-200/60"
                                        : c.statusStage === "Settlement"
                                        ? "bg-teal-50/80 text-teal-800 border-teal-200/60"
                                        : "bg-emerald-50/80 text-emerald-800 border-emerald-200/60"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                        c.statusStage === "Intake"
                                          ? "bg-purple-500"
                                          : c.statusStage === "Discovery"
                                          ? "bg-blue-500"
                                          : c.statusStage === "Pleadings"
                                          ? "bg-amber-500"
                                          : c.statusStage === "Hearings"
                                          ? "bg-rose-500 animate-pulse"
                                          : c.statusStage === "Settlement"
                                          ? "bg-teal-500"
                                          : "bg-emerald-500"
                                      }`}
                                    />
                                    <span>{c.statusStage}</span>
                                  </span>
                                </td>

                                {/* 5. Next Hearing */}
                                <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                                  {upcomingH ? (
                                    <div className="flex flex-col">
                                      <span className="font-semibold text-gray-900 text-xs">
                                        {upcomingH.date}
                                      </span>
                                      <span className="text-[10.5px] text-amber-700 font-medium mt-0.5">
                                        at {upcomingH.time} · Bench Hearing
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-[11px] text-gray-400">
                                      No session scheduled
                                    </span>
                                  )}
                                </td>

                                {/* 6. Vault Documents */}
                                <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                                  <span className="text-xs font-semibold text-gray-800">
                                    {c.documents.length} files
                                  </span>
                                  <span className="block text-[10.5px] text-emerald-700 mt-0.5">
                                    {c.documents.filter((d) => d.status === "Validated").length} validated
                                  </span>
                                </td>

                                {/* 7. Actions */}
                                <td className="py-3.5 px-4 align-middle text-right whitespace-nowrap pr-5">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedCaseId(c.id);
                                    }}
                                    className="px-2.5 py-1 rounded-md bg-gray-100 hover:bg-navy-950 hover:text-white text-gray-700 transition-colors inline-flex items-center gap-1 cursor-pointer text-xs font-medium"
                                  >
                                    <span>Dossier</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Footer */}
                  <div className="bg-gray-50/70 border-t border-gray-200/80 px-4 py-3 flex items-center justify-between text-xs text-gray-500 mt-auto shrink-0">
                    <span>
                      Showing <strong className="text-gray-900 font-semibold">{filteredCases.length}</strong> of {cases.length} litigation matters
                    </span>
                    <span className="font-medium text-navy-900">Med Jordan Law Judicial Docket</span>
                  </div>
                </div>
              ) : (
                /* PIPELINE BOARD VIEW (Kanban-style by Stage) */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 flex-1 min-h-[460px] overflow-x-auto custom-scrollbar pb-2">
                  {(["Intake", "Discovery", "Pleadings", "Hearings", "Settlement", "Closed"] as CaseItem["statusStage"][]).map(
                    (stageName) => {
                      const stageCases = filteredCases.filter((c) => c.statusStage === stageName);
                      return (
                        <div
                          key={stageName}
                          className="bg-gray-50/70 border border-gray-200/80 rounded-xl p-3 flex flex-col gap-2.5 min-w-[200px]"
                        >
                          <div className="flex items-center justify-between pb-1.5 border-b border-gray-200/80">
                            <span className="text-xs font-semibold text-gray-800">
                              {stageName}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white border border-gray-200 text-gray-600 font-semibold">
                              {stageCases.length}
                            </span>
                          </div>

                          <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
                            {stageCases.length === 0 ? (
                              <div className="p-4 text-center text-gray-400 text-[11px]">
                                No matters in {stageName}
                              </div>
                            ) : (
                              stageCases.map((c) => (
                                <div
                                  key={c.id}
                                  onClick={() => setSelectedCaseId(c.id)}
                                  className="p-3 bg-white rounded-lg border border-gray-200 hover:border-navy-900 transition-colors shadow-2xs cursor-pointer flex flex-col gap-1.5 group"
                                >
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="font-mono font-semibold text-gray-700 bg-gray-100 px-1.5 py-0.2 rounded">
                                      {c.caseNumber}
                                    </span>
                                    <span className="text-gray-400">{c.practiceArea.split("&")[0].trim()}</span>
                                  </div>
                                  <h4 className="text-xs font-semibold text-gray-900 group-hover:text-navy-700 line-clamp-2 leading-tight">
                                    {c.title}
                                  </h4>
                                  <div className="text-[11px] text-gray-500 font-medium">
                                    {c.clientName}
                                  </div>
                                  <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                                    <span>{c.documents.length} docs</span>
                                    <span className="text-navy-900 font-semibold group-hover:underline inline-flex items-center gap-0.5">
                                      View <ChevronRight className="w-3 h-3" />
                                    </span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          )}

          {/* =================================================================== */}
          {/* VIEW MODE 2: MASTER DOCUMENT VAULT */}
          {/* =================================================================== */}
          {activeWorkspaceMode === "vault" && (
            <div className="flex-1 flex flex-col gap-3 min-h-0">
              {/* Vault Search and Filters Bar */}
              <div className="bg-white border border-gray-200/90 rounded-xl p-3 sm:p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <div className="relative w-full md:w-80">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documents by title, case #, client, or hash..."
                    value={vaultSearch}
                    onChange={(e) => setVaultSearch(e.target.value)}
                    className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-white hover:bg-gray-50/50 focus:bg-white border border-gray-200/90 focus:border-navy-900 rounded-lg focus:outline-none text-gray-900 placeholder:text-gray-400 transition-colors"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                  <select
                    value={vaultCategoryFilter}
                    onChange={(e) => setVaultCategoryFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white hover:bg-gray-50/50 border border-gray-200/90 rounded-lg focus:outline-none focus:border-navy-900 text-gray-800 font-medium cursor-pointer transition-colors"
                  >
                    <option value="all">All Classifications</option>
                    <option value="pleading">Pleadings & Memoranda (لوائح دعوى)</option>
                    <option value="power of attorney">Powers of Attorney (وكالات عدلية)</option>
                    <option value="commercial register">Commercial Register Extracts (شهادات تسجيل)</option>
                    <option value="expert financial">Expert Financial Reports (تقارير خبرة)</option>
                    <option value="evidentiary">Evidentiary Exhibits (أدلة وعقود)</option>
                    <option value="court decrees">Court Decrees & Orders (قرارات قضائية)</option>
                  </select>

                  <select
                    value={vaultStatusFilter}
                    onChange={(e) => setVaultStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white hover:bg-gray-50/50 border border-gray-200/90 rounded-lg focus:outline-none focus:border-navy-900 text-gray-800 font-medium cursor-pointer transition-colors"
                  >
                    <option value="all">All Audit Statuses</option>
                    <option value="validated">Security Validated ({validatedDocumentsCount})</option>
                    <option value="pending">Pending Audit ({pendingAuditDocumentsCount})</option>
                    <option value="rejected">Re-upload Required ({rejectedDocumentsCount})</option>
                  </select>

                  <select
                    value={vaultVisibilityFilter}
                    onChange={(e) => setVaultVisibilityFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white hover:bg-gray-50/50 border border-gray-200/90 rounded-lg focus:outline-none focus:border-navy-900 text-gray-800 font-medium cursor-pointer transition-colors"
                  >
                    <option value="all">All Visibilities</option>
                    <option value="visible">Visible in Client Portal</option>
                    <option value="internal">Chambers Internal Only</option>
                  </select>
                </div>
              </div>

              {/* Master Documents Table */}
              <div className="bg-white border border-gray-200/90 rounded-xl overflow-hidden flex-1 flex flex-col min-h-[460px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse table-fixed min-w-[1240px]">
                    <colgroup>
                      <col className="w-[300px]" />
                      <col className="w-[190px]" />
                      <col className="w-[170px]" />
                      <col className="w-[110px]" />
                      <col className="w-[170px]" />
                      <col className="w-[150px]" />
                      <col className="w-[150px]" />
                    </colgroup>
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-gray-50/90 backdrop-blur-xs border-b border-gray-200/80">
                        <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500">
                          Document Title
                        </th>
                        <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500">
                          Litigation Matter
                        </th>
                        <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500">
                          Classification
                        </th>
                        <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500">
                          Payload Size
                        </th>
                        <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500">
                          Validation Status
                        </th>
                        <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500">
                          Client Portal
                        </th>
                        <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500 text-right pr-5">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                      {filteredVaultDocuments.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-16 text-center">
                            <EmptyState
                              icon={Lock}
                              title="No vault documents found"
                              description="No documents match your active search or classification filters."
                              actionLabel="Reset Vault Filters"
                              onAction={() => {
                                setVaultSearch("");
                                setVaultCategoryFilter("all");
                                setVaultStatusFilter("all");
                                setVaultVisibilityFilter("all");
                              }}
                            />
                          </td>
                        </tr>
                      ) : (
                        filteredVaultDocuments.map(({ document: doc, caseItem: c }) => (
                          <tr key={`${c.id}-${doc.id}`} className="hover:bg-gray-50/60 transition-colors group">
                            {/* 1. Document Title */}
                            <td className="py-3.5 px-4 align-middle">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <span
                                    onClick={() =>
                                      setPreviewDoc({
                                        doc,
                                        caseNumber: c.caseNumber,
                                        clientName: c.clientName,
                                      })
                                    }
                                    className="font-semibold text-gray-900 block truncate hover:text-navy-700 hover:underline cursor-pointer"
                                  >
                                    {doc.title}
                                  </span>
                                  <span className="text-[10.5px] text-gray-400 block mt-0.5 font-mono">
                                    Uploaded {doc.uploadDate} · {doc.type}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* 2. Linked Case */}
                            <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => setSelectedCaseId(c.id)}
                                className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-900 hover:bg-navy-950 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
                                title="Open Parent Case Dossier"
                              >
                                <span>{c.caseNumber}</span>
                                <ArrowUpRight className="w-3 h-3 opacity-60" />
                              </button>
                              <span className="block text-[11px] text-gray-500 mt-1 truncate max-w-[170px]">
                                {c.clientName}
                              </span>
                            </td>

                            {/* 3. Classification */}
                            <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-800 border border-gray-200/70 inline-block">
                                {doc.category || "Legal Memorandum"}
                              </span>
                            </td>

                            {/* 4. Payload Size */}
                            <td className="py-3.5 px-4 align-middle whitespace-nowrap font-mono text-gray-700 tabular-nums">
                              {doc.size}
                            </td>

                            {/* 5. Validation Status */}
                            <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                              {doc.status === "Validated" && (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full">
                                  <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  Validated
                                </span>
                              )}
                              {doc.status === "Pending" && (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200/70 px-2.5 py-0.5 rounded-full">
                                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                  Pending Audit
                                </span>
                              )}
                              {doc.status === "Rejected" && (
                                <span
                                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-rose-800 bg-rose-50 border border-rose-200/70 px-2.5 py-0.5 rounded-full cursor-help"
                                  title={doc.rejectionReason}
                                >
                                  <FileX className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                  Re-upload
                                </span>
                              )}
                            </td>

                            {/* 6. Client Portal Visibility Toggle */}
                            <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => toggleCaseDocumentVisibility(c.id, doc.id)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-semibold cursor-pointer border transition-colors ${
                                  doc.isOfficeVisibleToClient
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200/70 hover:bg-emerald-100"
                                    : "bg-gray-100 text-gray-700 border-gray-200/80 hover:bg-gray-200"
                                }`}
                                title="Click to toggle client portal access"
                              >
                                {doc.isOfficeVisibleToClient ? (
                                  <>
                                    <Eye className="w-3 h-3 text-emerald-600" />
                                    <span>Client Visible</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3 h-3 text-gray-500" />
                                    <span>Chambers Only</span>
                                  </>
                                )}
                              </button>
                            </td>

                            {/* 7. Actions */}
                            <td className="py-3.5 px-4 align-middle text-right pr-5 whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPreviewDoc({
                                      doc,
                                      caseNumber: c.caseNumber,
                                      clientName: c.clientName,
                                    })
                                  }
                                  className="px-2 py-1 rounded-md bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 transition-colors text-xs font-medium cursor-pointer inline-flex items-center gap-1"
                                  title="Preview Certified Document"
                                >
                                  <Eye className="w-3.5 h-3.5 text-gray-500" />
                                  <span>Preview</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setAuditDoc(doc)}
                                  className="px-2 py-1 rounded-md bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 transition-colors text-xs font-medium cursor-pointer inline-flex items-center gap-1"
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

                {/* Vault Table Footer */}
                <div className="bg-gray-50/70 border-t border-gray-200/80 px-4 py-3 flex items-center justify-between text-xs text-gray-500 mt-auto shrink-0">
                  <span>
                    Showing <strong className="text-gray-900 font-semibold">{filteredVaultDocuments.length}</strong> of {allVaultDocuments.length} total vault documents
                  </span>
                  <span className="font-medium text-navy-900">100% SHA-256 Tamper-Evident Security Seal</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ===================================================================== */
        /* CASE DOSSIER DETAIL VIEW */
        /* ===================================================================== */
        <CaseDetail
          caseItem={selectedCase}
          onBack={() => setSelectedCaseId(null)}
          onAdvanceStage={advanceCaseStage}
          onAddNote={addCaseNote}
          onUploadDocClick={() => {
            setTargetCaseForUpload(selectedCase);
            setIsUploadDocOpen(true);
          }}
          onScheduleHearingClick={() => {
            setTargetCaseForHearing(selectedCase);
            setIsScheduleHearingOpen(true);
          }}
          onAuditDocClick={(doc) => setAuditDoc(doc)}
          onPreviewDocClick={(doc) =>
            setPreviewDoc({
              doc,
              caseNumber: selectedCase.caseNumber,
              clientName: selectedCase.clientName,
            })
          }
          onLogOutcomeClick={(hearing) => setOutcomeModalHearing(hearing)}
          onToggleDocVisibility={(docId) => toggleCaseDocumentVisibility(selectedCase.id, docId)}
          onDeleteDoc={(docId) => deleteCaseDocument(selectedCase.id, docId)}
          onUpdateDocStatus={(docId, status, reason) =>
            updateCaseDocumentStatus(selectedCase.id, docId, status, reason)
          }
          onViewContract={() => setActiveNav("contracts")}
        />
      )}

      {/* ===================================================================== */}
      {/* GLOBAL MODALS */}
      {/* ===================================================================== */}

      {/* 1. New Litigation Matter Modal */}
      <NewCaseModal
        isOpen={isNewCaseModalOpen}
        onClose={() => setIsNewCaseModalOpen(false)}
        onSubmit={addCase}
      />

      {/* 2. Log Hearing Bench Ruling Modal */}
      <HearingOutcomeModal
        hearing={outcomeModalHearing}
        onClose={() => setOutcomeModalHearing(null)}
        onSave={(hearingId, outcomeText) => {
          if (selectedCase) {
            updateHearingOutcome(selectedCase.id, hearingId, outcomeText);
          }
        }}
      />

      {/* 3. Upload Document to Vault Modal */}
      <UploadDocumentModal
        isOpen={isUploadDocOpen}
        onClose={() => {
          setIsUploadDocOpen(false);
          setTargetCaseForUpload(null);
        }}
        caseNumber={targetCaseForUpload?.caseNumber || selectedCase?.caseNumber}
        availableCases={cases}
        selectedCaseId={targetCaseForUpload?.id || selectedCase?.id}
        onUpload={(doc, targetCaseId) => {
          const finalCaseId = targetCaseId || targetCaseForUpload?.id || selectedCase?.id;
          if (finalCaseId) {
            addCaseDocument(finalCaseId, doc);
          }
        }}
      />

      {/* 4. Schedule Court Hearing Modal */}
      <ScheduleHearingModal
        isOpen={isScheduleHearingOpen}
        onClose={() => {
          setIsScheduleHearingOpen(false);
          setTargetCaseForHearing(null);
        }}
        caseNumber={targetCaseForHearing?.caseNumber || selectedCase?.caseNumber}
        onSchedule={(hearing) => {
          const finalCaseId = targetCaseForHearing?.id || selectedCase?.id;
          if (finalCaseId) {
            addCaseHearing(finalCaseId, hearing);
          }
          setIsScheduleHearingOpen(false);
          setTargetCaseForHearing(null);
        }}
      />

      {/* 5. Document Forensic Audit Trail Modal */}
      <DocumentAuditModal
        document={auditDoc}
        onClose={() => setAuditDoc(null)}
      />

      {/* 6. Document Certified Preview Modal */}
      <DocumentPreviewModal
        document={previewDoc?.doc || null}
        caseNumber={previewDoc?.caseNumber}
        clientName={previewDoc?.clientName}
        onClose={() => setPreviewDoc(null)}
        onOpenAuditTrail={(doc) => {
          setPreviewDoc(null);
          setAuditDoc(doc);
        }}
        onToggleVisibility={(docId) => {
          if (selectedCase) {
            toggleCaseDocumentVisibility(selectedCase.id, docId);
          }
        }}
      />
    </div>
  );
}
