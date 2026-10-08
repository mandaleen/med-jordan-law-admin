"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Calendar,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  X,
  UserX,
  Plus,
  Download,
  Building2,
  User,
  ShieldCheck,
  FileText,
  DollarSign,
  ArrowUpDown,
  LayoutGrid,
  Table as TableIcon,
  MessageSquare,
  ChevronDown,
  Scale,
  Landmark,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { ClientProfile, INITIAL_CLIENTS } from "@/lib/mock-data";
import { ClientAvatar } from "@/components/ui/client-avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatTile, StatGrid } from "@/components/ui/stat-tile";
import { ActionButton } from "@/components/ui/action-button";
import { Segmented } from "@/components/ui/segmented";
import { TaxInvoiceModal, TaxInvoiceData } from "@/components/modals/tax-invoice-modal";
import { ClientDetail } from "./client-detail";
import { NewClientModal } from "./new-client-modal";
import { usePractice } from "@/lib/practice-context";

type FilterTab = "all" | "corporate" | "individual" | "retained" | "active-matters";
type SortOption = "billed-desc" | "cases-desc" | "name-asc" | "date-desc";
type ViewMode = "cards" | "table";

export function ClientsView() {
  const { setActiveNav, setSelectedCaseId } = usePractice();
  const [clients, setClients] = useState<ClientProfile[]>(INITIAL_CLIENTS);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [sortBy, setSortBy] = useState<SortOption>("billed-desc");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [taxInvoiceModalData, setTaxInvoiceModalData] = useState<TaxInvoiceData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAddClient = (newClient: ClientProfile) => {
    setClients((prev) => [newClient, ...prev]);
    showToast(`✓ Onboarded client ${newClient.name} successfully.`);
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  // Compute KPI summary figures
  const totalBilledNum = useMemo(() => {
    return clients.reduce((acc, c) => {
      const num = parseFloat(c.totalBilled.replace(/[^0-9.]/g, "") || "0");
      return acc + num;
    }, 0);
  }, [clients]);

  const totalActiveCases = useMemo(() => {
    return clients.reduce((acc, c) => acc + c.activeCasesCount, 0);
  }, [clients]);

  const corporateCount = useMemo(() => {
    return clients.filter((c) => c.entityType === "Corporate" || !!c.company).length;
  }, [clients]);

  const individualCount = useMemo(() => {
    return clients.filter((c) => c.entityType === "Individual" || !c.company).length;
  }, [clients]);

  const retainedCount = useMemo(() => {
    return clients.filter((c) => c.status === "Retained").length;
  }, [clients]);

  const activeMattersClientsCount = useMemo(() => {
    return clients.filter((c) => c.activeCasesCount > 0).length;
  }, [clients]);

  // Filter & sort clients
  const filteredAndSortedClients = useMemo(() => {
    return clients
      .filter((c) => {
        // Tab filter
        if (activeFilter === "corporate" && !(c.entityType === "Corporate" || !!c.company)) {
          return false;
        }
        if (activeFilter === "individual" && !(c.entityType === "Individual" || !c.company)) {
          return false;
        }
        if (activeFilter === "retained" && c.status !== "Retained") {
          return false;
        }
        if (activeFilter === "active-matters" && c.activeCasesCount <= 0) {
          return false;
        }

        // Search query
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          (c.company && c.company.toLowerCase().includes(q)) ||
          c.nationalId.includes(q) ||
          (c.taxNumber && c.taxNumber.toLowerCase().includes(q)) ||
          (c.commercialReg && c.commercialReg.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === "billed-desc") {
          const aNum = parseFloat(a.totalBilled.replace(/[^0-9.]/g, "") || "0");
          const bNum = parseFloat(b.totalBilled.replace(/[^0-9.]/g, "") || "0");
          return bNum - aNum;
        }
        if (sortBy === "cases-desc") {
          return b.activeCasesCount - a.activeCasesCount;
        }
        if (sortBy === "name-asc") {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [clients, activeFilter, searchQuery, sortBy]);

  // Export CSV handler
  const handleExportRegistry = () => {
    const headers = [
      "Client ID",
      "Legal Name",
      "Company / Group",
      "Entity Type",
      "National ID / Commercial Reg",
      "Tax Number",
      "POA Status",
      "Assigned Partner",
      "Retainer Status",
      "Active Cases",
      "Total Billed",
      "Phone",
      "Email",
    ];

    const rows = clients.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.company || "Individual"}"`,
      c.entityType || (c.company ? "Corporate" : "Individual"),
      c.nationalId,
      c.taxNumber || "N/A",
      c.poaStatus || "Verified on File",
      `"${c.assignedPartner || "Tariq Qudah"}"`,
      c.status,
      c.activeCasesCount,
      `"${c.totalBilled}"`,
      `"${c.phone}"`,
      c.email,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MJL_Clients_Registry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("✓ Exported client registry ledger to CSV.");
  };

  const handleOpenCase = (caseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCaseId(caseId);
    setActiveNav("cases");
  };

  const handleOpenWhatsApp = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const clean = phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${clean}`, "_blank");
  };

  return (
    <div className="flex-1 flex flex-col gap-5 min-h-0">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 end-6 z-50 p-3.5 bg-navy-950 text-white rounded-xl shadow-[var(--shadow-float)] border border-navy-800 flex items-center justify-between text-xs font-medium animate-in fade-in slide-in-from-bottom-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* VIEW SEPARATION: DIRECTORY vs CLIENT 360 WORKSPACE */}
      {!selectedClient ? (
        <div className="flex-1 flex flex-col gap-6 min-h-0">
          {/* 1. Executive Architectural Page Header */}
          <PageHeader
            title="Clients"
            description="Client accounts, corporate entities, retainers, and billing."
            actions={
              <>
                <ActionButton icon={<Download className="w-4 h-4" />} onClick={handleExportRegistry}>
                  Export
                </ActionButton>
                <ActionButton variant="primary" icon={<Plus className="w-4 h-4" strokeWidth={2.4} />} onClick={() => setIsNewClientOpen(true)}>
                  New Client
                </ActionButton>
              </>
            }
          />

          <StatGrid>
            <StatTile
              dark
              title="Total Clients"
              icon={Users}
              value={clients.length}
              unit="Registered"
              caption={`${corporateCount} corporate · ${individualCount} individual`}
              selected={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
            />
            <StatTile
              title="Retainers"
              icon={DollarSign}
              value={`$${totalBilledNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              chip={<><Sparkles className="w-3 h-3" />{retainedCount} active</>}
              chipTone="success"
              selected={activeFilter === "retained"}
              onClick={() => setActiveFilter("retained")}
              delay={60}
            />
            <StatTile
              title="Active Cases"
              icon={Scale}
              value={totalActiveCases}
              unit="Matters"
              chip={<><Landmark className="w-3 h-3" />In court</>}
              selected={activeFilter === "active-matters"}
              onClick={() => setActiveFilter("active-matters")}
              delay={120}
            />
            <StatTile
              title="Compliance"
              icon={ShieldCheck}
              value="100%"
              chip={<><CheckCircle2 className="w-3 h-3" />Verified</>}
              chipTone="success"
              caption="POA & KYC"
              onClick={() => showToast("✓ All client POA mandates & Bar Council KYC documents are active and verified.")}
              delay={180}
            />
          </StatGrid>

          {/* 3. Executive Filter & Command Center */}
          <div className="flex flex-col gap-3 shrink-0">
            {/* Top Row: Segmented Filter Tabs & Quick Registry Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <Segmented
                label="Client filter"
                value={activeFilter}
                onChange={setActiveFilter}
                options={[
                  { id: "all", label: "All", icon: <Users className="w-3.5 h-3.5" />, count: clients.length },
                  { id: "corporate", label: "Corporate", icon: <Building2 className="w-3.5 h-3.5" />, count: corporateCount },
                  { id: "individual", label: "Individual", icon: <User className="w-3.5 h-3.5" />, count: individualCount },
                  { id: "retained", label: "Retained", icon: <ShieldCheck className="w-3.5 h-3.5" />, count: retainedCount },
                  { id: "active-matters", label: "Active Cases", icon: <Briefcase className="w-3.5 h-3.5" />, count: activeMattersClientsCount },
                ]}
              />

              {/* Live Filter Summary & Reset Pill */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 font-medium">
                  Showing <strong className="text-navy-950 font-semibold">{filteredAndSortedClients.length}</strong> of{" "}
                  {clients.length} accounts
                </span>
                {(activeFilter !== "all" || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFilter("all");
                      setSearchQuery("");
                    }}
                    className="text-[11px] font-semibold text-navy-700 hover:text-navy-950 bg-navy-50 hover:bg-navy-100 border border-navy-200/60 px-2 py-0.5 rounded-full transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Row: Search, Sort Selector & View Mode Switcher */}
            <div className="surface-card p-2 sm:p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-2.5">
              {/* Full-featured Search Bar */}
              <div className="relative flex-1 min-w-[260px]">
                <Search className="w-4 h-4 text-gray-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full ps-9 pe-16 py-2 text-xs bg-gray-50 hover:bg-gray-50 focus:bg-white border border-navy-900/10 focus:border-navy-900 focus:ring-2 focus:ring-navy-900/10 rounded-full text-gray-900 placeholder:text-gray-400 transition-all outline-none"
                />
                <div className="absolute end-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-gray-400 bg-white border border-gray-200 rounded shadow-2xs">
                      /
                    </kbd>
                  )}
                </div>
              </div>

              {/* Controls Right: Sort & View Toggle */}
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                {/* Sort Dropdown */}
                <div className="relative inline-flex items-center">
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-500 absolute start-2.5 pointer-events-none" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="h-8.5 ps-8 pe-7 text-xs font-medium bg-gray-50/80 hover:bg-gray-50 border border-gray-200/90 rounded-lg text-gray-700 hover:text-navy-950 focus:outline-none focus:border-navy-900 focus:bg-white transition-colors cursor-pointer appearance-none"
                  >
                    <option value="billed-desc">Billed (High to Low)</option>
                    <option value="cases-desc">Active Cases</option>
                    <option value="name-asc">Name (A–Z)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute end-2 pointer-events-none" />
                </div>

                {/* View Toggle (Cards vs Table) */}
                <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200/70 shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewMode("cards")}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      viewMode === "cards"
                        ? "bg-white text-navy-950 shadow-xs font-semibold ring-1 ring-black/5"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                    title="Detailed Dossier Cards"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Dossiers</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      viewMode === "table"
                        ? "bg-white text-navy-950 shadow-xs font-semibold ring-1 ring-black/5"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                    title="Compact Ledger Table"
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Ledger</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Directory Presentation (Cards vs Compact Table) */}
          {filteredAndSortedClients.length === 0 ? (
            <div className="surface-card p-12 text-center">
              <EmptyState
                icon={UserX}
                title="No client accounts found"
                description={
                  searchQuery
                    ? `No client matches "${searchQuery}". Verify national ID, commercial registration, or contact details.`
                    : "No client records matching the selected filter."
                }
                actionLabel={searchQuery ? "Clear Search" : "Reset Filter"}
                onAction={() => {
                  setSearchQuery("");
                  setActiveFilter("all");
                }}
              />
            </div>
          ) : viewMode === "cards" ? (
            /* DETAILED DOSSIER CARDS (Anti-slop, rich legal context) */
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredAndSortedClients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => setSelectedClientId(client.id)}
                  className="bg-white border border-gray-200/80 hover:border-navy-900/30 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between gap-4"
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <ClientAvatar
                          name={client.name}
                          src={client.avatar}
                          initials={client.initials}
                          className="w-11 h-11 rounded-xl ring-1 ring-black/10 shrink-0 shadow-2xs"
                          fallbackClassName="text-sm font-bold rounded-xl"
                        />

                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-gray-900 group-hover:text-navy-900 transition-colors truncate leading-snug">
                              {client.name}
                            </h3>
                            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 border border-gray-200/60 shrink-0">
                              {client.entityType || (client.company ? "Corporate" : "Individual")}
                            </span>
                          </div>

                          {client.company ? (
                            <span className="text-xs text-gray-500 truncate mt-0.5">{client.company}</span>
                          ) : (
                            <span className="text-xs text-gray-400 mt-0.5">Individual Representation</span>
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border shrink-0 ${
                          client.status === "Retained"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : client.status === "Active"
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
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
                          ? "Active Matter"
                          : "Prospective"}
                      </span>
                    </div>

                    {/* Official Credentials Strip */}
                    <div className="mt-3.5 pt-3 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-gray-400 block">
                          National / Reg ID
                        </span>
                        <span className="font-mono font-medium text-gray-800 text-[11px] block mt-0.5 truncate">
                          {client.nationalId}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-gray-400 block">
                          Tax Identification
                        </span>
                        <span className="font-mono font-medium text-gray-800 text-[11px] block mt-0.5 truncate">
                          {client.taxNumber || "TAX-JO-881920"}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-gray-400 block">
                          Power of Attorney
                        </span>
                        <span className="text-[11px] font-medium text-emerald-800 inline-flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">
                            {client.poaStatus === "Verified on File" ? "Verified Notary" : "Pending"}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Linked Matters Pill Strip */}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-gray-500 text-[11px]">Active Matters:</span>
                        {client.linkedCases.length > 0 ? (
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            {client.linkedCases.slice(0, 2).map((lc) => (
                              <button
                                key={lc.id}
                                type="button"
                                onClick={(e) => handleOpenCase(lc.id, e)}
                                className="font-mono text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 font-medium transition-colors cursor-pointer truncate max-w-[170px]"
                                title="Click to view case docket"
                              >
                                {lc.caseNumber}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-[11px]">None in court</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{client.lifetimeBookingsCount} Consultations</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action & Finance Footer */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3 text-xs">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-semibold text-gray-400">Total Billed</span>
                      <span className="font-mono font-bold text-gray-900 text-sm tabular-nums">
                        {client.totalBilled}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleOpenWhatsApp(client.phone, e)}
                        className="p-1.5 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-600 hover:text-emerald-800 transition-colors cursor-pointer"
                        title="Chat via WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTaxInvoiceModalData({
                            invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
                            issueDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                            clientName: client.name,
                            clientCompany: client.company,
                            clientNationalId: client.nationalId,
                            clientPhone: client.phone,
                            clientEmail: client.email,
                            serviceDescription: "General Legal Counsel & Retainer Statement",
                            lawyerName: client.assignedPartner || "Tariq Qudah",
                            grossAmount: 5000,
                            taxRatePercent: 16,
                            paymentMethod: "Visa / MasterCard (HyperPay)",
                            gatewayRef: `HP-${Math.floor(100000 + Math.random() * 900000)}-JO`,
                            status: "Paid via Gateway",
                          });
                        }}
                        className="px-2.5 py-1.5 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                        title="Generate Official Jordan Tax Invoice"
                      >
                        <FileText className="w-3.5 h-3.5 text-navy-800" />
                        <span>Tax Invoice</span>
                      </button>

                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-full bg-navy-900 group-hover:bg-navy-800 text-white text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                      >
                        <span>Client 360</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* COMPACT LEDGER TABLE (Non-overflowing, clean tabular layout) */
            <div className="surface-table shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-start border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50/90 border-b border-gray-200/80 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500">
                      <th className="py-3 px-4 text-start">Client</th>
                      <th className="py-3 px-4 text-start">National / Reg ID</th>
                      <th className="py-3 px-4 text-start">POA</th>
                      <th className="py-3 px-4 text-start">Active Cases</th>
                      <th className="py-3 px-4 text-start">Billed</th>
                      <th className="py-3 px-4 text-start">Status</th>
                      <th className="py-3 px-4 text-end pe-5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAndSortedClients.map((client) => (
                      <tr
                        key={client.id}
                        onClick={() => setSelectedClientId(client.id)}
                        className="hover:bg-gray-50/70 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 align-middle">
                          <div className="flex items-center gap-3">
                            <ClientAvatar
                              name={client.name}
                              src={client.avatar}
                              initials={client.initials}
                              className="w-8 h-8 rounded-lg ring-1 ring-black/10 shrink-0 shadow-2xs"
                              fallbackClassName="text-xs font-bold rounded-lg"
                            />
                            <div className="flex flex-col min-w-0">
                              <span className="font-semibold text-gray-900 group-hover:text-navy-900 transition-colors truncate leading-tight">
                                {client.name}
                              </span>
                              <span className="text-[11px] text-gray-400 truncate mt-0.5">
                                {client.company || "Individual Representation"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                          <span className="font-mono text-xs font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 border border-gray-200/60 inline-block">
                            {client.nationalId}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{client.poaStatus === "Verified on File" ? "Verified" : "Pending"}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-xs font-medium border border-blue-200/60">
                            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                            <span>{client.activeCasesCount} Matters</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                          <span className="font-mono font-bold text-gray-900 text-xs tabular-nums">
                            {client.totalBilled}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 align-middle whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                              client.status === "Retained"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : client.status === "Active"
                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                : "bg-gray-100 text-gray-600 border-gray-200"
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
                            {client.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-end align-middle whitespace-nowrap pe-5">
                          <button
                            type="button"
                            className="px-2.5 py-1 rounded-full bg-gray-100 group-hover:bg-navy-900 group-hover:text-white text-gray-700 text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>View</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 5. DETAIL VIEW: CLIENT 360 WORKSPACE */
        <ClientDetail
          client={selectedClient}
          onBack={() => setSelectedClientId(null)}
          onShowInvoice={setTaxInvoiceModalData}
          onToast={showToast}
        />
      )}

      {/* Onboard New Client Modal */}
      <NewClientModal
        isOpen={isNewClientOpen}
        onClose={() => setIsNewClientOpen(false)}
        onAddClient={handleAddClient}
      />

      {/* Official Jordan Tax Invoice Modal */}
      <TaxInvoiceModal
        isOpen={!!taxInvoiceModalData}
        onClose={() => setTaxInvoiceModalData(null)}
        invoice={taxInvoiceModalData}
      />
    </div>
  );
}
