"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Calendar,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  X,
  UserX,
} from "lucide-react";
import { ClientProfile, INITIAL_CLIENTS } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ClientAvatar } from "@/components/ui/client-avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { TaxInvoiceModal, TaxInvoiceData } from "@/components/modals/tax-invoice-modal";
import { ClientDetail } from "./client-detail";

export function ClientsView() {
  const [clients] = useState<ClientProfile[]>(INITIAL_CLIENTS);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [taxInvoiceModalData, setTaxInvoiceModalData] = useState<TaxInvoiceData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const filteredClients = clients.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (c.company && c.company.toLowerCase().includes(q)) ||
      c.nationalId.includes(q)
    );
  });

  return (
    <div className="flex-1 flex flex-col gap-3 min-h-0">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-navy-950 text-white rounded-xl shadow-lg flex items-center justify-between text-xs font-medium animate-in fade-in slide-in-from-top-2 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* MASTER DIRECTORY VIEW vs DETAIL VIEW */}
      {!selectedClient ? (
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          {/* Header */}
          <div className="bg-white border border-gray-200/90 rounded-xl p-3 sm:p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-900 border border-navy-100 flex items-center justify-center font-bold shrink-0">
                <Users className="w-4 h-4 text-navy-900" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-gray-900 tracking-tight">Clients Directory</h2>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200/60">
                    {clients.length} Accounts
                  </span>
                </div>
                <p className="text-xs text-gray-500">Account layer connecting bookings, active cases & signed agreements</p>
              </div>
            </div>

            {/* Search Box */}
            <div className="relative min-w-[280px] w-full md:w-auto">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, company, national ID, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-8 pe-7 py-1.5 text-xs bg-white hover:bg-gray-50/50 focus:bg-white border border-gray-200/90 rounded-lg focus:outline-none focus:border-navy-900 text-gray-900 placeholder:text-gray-400 transition-colors text-start"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Directory Table */}
          <div className="bg-white border border-gray-200/90 rounded-xl overflow-hidden flex-1 flex flex-col min-h-[460px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar min-h-0">
              <table className="w-full text-start border-collapse table-fixed min-w-[1250px]">
                <colgroup>
                  <col className="w-[230px]" />
                  <col className="w-[200px]" />
                  <col className="w-[145px]" />
                  <col className="w-[130px]" />
                  <col className="w-[135px]" />
                  <col className="w-[130px]" />
                  <col className="w-[135px]" />
                  <col className="w-[145px]" />
                </colgroup>
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-50/90 backdrop-blur-xs border-b border-gray-200/80">
                    <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500 text-start">Client / Entity</th>
                    <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500 text-start">Contact Details</th>
                    <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500 text-start">National ID / Reg</th>
                    <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500 text-start">Active Matters</th>
                    <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500 text-start">Bookings</th>
                    <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500 text-start">Total Billed</th>
                    <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500 text-start">Status</th>
                    <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-gray-500 text-end pe-5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-14 text-center">
                        <EmptyState
                          icon={UserX}
                          title="No client accounts found"
                          description={
                            searchQuery
                              ? `No client matches "${searchQuery}". Check national ID, company name, or contact details.`
                              : "No client records registered in the system."
                          }
                          actionLabel={searchQuery ? "Clear Search" : undefined}
                          onAction={searchQuery ? () => setSearchQuery("") : undefined}
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client) => (
                      <tr
                        key={client.id}
                        onClick={() => setSelectedClientId(client.id)}
                        className="hover:bg-gray-50/60 transition-colors cursor-pointer group"
                      >
                        {/* 1. Client / Entity */}
                        <td className="py-3.5 px-4 align-middle text-start">
                          <div className="flex items-center gap-3">
                            <ClientAvatar
                              name={client.name}
                              src={client.avatar}
                              initials={client.initials}
                              className="w-8 h-8 rounded-lg ring-1 ring-black/10 shrink-0"
                              fallbackClassName="text-xs font-bold rounded-lg"
                            />
                            <div className="flex flex-col min-w-0 pe-2">
                              <span className="font-semibold text-gray-900 text-xs group-hover:text-navy-700 transition-colors truncate block leading-tight">
                                {client.name}
                              </span>
                              {client.company ? (
                                <span className="text-[11px] text-gray-400 truncate block mt-0.5">
                                  {client.company}
                                </span>
                              ) : (
                                <span className="text-[11px] text-gray-400">Individual Client</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 2. Contact Info */}
                        <td className="py-3.5 px-4 align-middle text-start">
                          <div className="flex flex-col min-w-0">
                            <span className="font-mono text-gray-700 font-medium text-[11px] truncate">
                              {client.phone}
                            </span>
                            <span className="text-[11px] text-gray-400 truncate mt-0.5">
                              {client.email}
                            </span>
                          </div>
                        </td>

                        {/* 3. National ID */}
                        <td className="py-3.5 px-4 align-middle whitespace-nowrap text-start">
                          <span className="font-mono text-xs font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 border border-gray-200/60 inline-block">
                            {client.nationalId}
                          </span>
                        </td>

                        {/* 4. Active Cases */}
                        <td className="py-3.5 px-4 align-middle whitespace-nowrap text-start">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50/70 text-blue-800 font-medium text-xs border border-blue-200/50">
                            <Briefcase className="w-3 h-3 text-blue-600" />
                            {client.activeCasesCount} Cases
                          </span>
                        </td>

                        {/* 5. Bookings */}
                        <td className="py-3.5 px-4 align-middle whitespace-nowrap text-start">
                          <span className="text-gray-600 font-medium inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            {client.lifetimeBookingsCount} Consultations
                          </span>
                        </td>

                        {/* 6. Total Billed */}
                        <td className="py-3.5 px-4 align-middle whitespace-nowrap text-start">
                          <span className="font-mono font-semibold text-gray-900 text-xs tabular-nums">
                            {client.totalBilled}
                          </span>
                        </td>

                        {/* 7. Status */}
                        <td className="py-3.5 px-4 align-middle whitespace-nowrap text-start">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                              client.status === "Retained"
                                ? "bg-emerald-50/80 text-emerald-800 border-emerald-200/60"
                                : client.status === "Active"
                                ? "bg-blue-50/80 text-blue-800 border-blue-200/60"
                                : "bg-gray-100/80 text-gray-600 border-gray-200/60"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              client.status === "Retained"
                                ? "bg-emerald-500"
                                : client.status === "Active"
                                ? "bg-blue-500"
                                : "bg-gray-400"
                            }`} />
                            {client.status}
                          </span>
                        </td>

                        {/* 8. Profile Action */}
                        <td className="py-3.5 px-4 text-end align-middle whitespace-nowrap pe-5">
                          <button
                            type="button"
                            className="px-2.5 py-1 rounded-md bg-gray-100 group-hover:bg-navy-950 group-hover:text-white text-gray-700 text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1 ms-auto"
                          >
                            <span>Profile 360</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary Strip */}
            <div className="bg-gray-50/70 border-t border-gray-200/80 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 mt-auto shrink-0">
              <div className="flex items-center gap-4">
                <span>Showing <strong className="text-slate-800">{filteredClients.length}</strong> of {clients.length} client accounts</span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="hidden sm:inline">Retained: <strong className="text-emerald-700">{clients.filter(c => c.status === "Retained").length}</strong></span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="hidden sm:inline">Active: <strong className="text-blue-700">{clients.filter(c => c.status === "Active").length}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Total Client Portfolio:</span>
                <span className="font-semibold text-navy-900">{clients.length} Registered</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* DETAIL VIEW: CLIENT 360 WORKSPACE */
        <ClientDetail
          client={selectedClient}
          onBack={() => setSelectedClientId(null)}
          onShowInvoice={setTaxInvoiceModalData}
          onToast={showToast}
        />
      )}

      {/* Official Jordan Tax Invoice Modal */}
      <TaxInvoiceModal
        isOpen={!!taxInvoiceModalData}
        onClose={() => setTaxInvoiceModalData(null)}
        invoice={taxInvoiceModalData}
      />
    </div>
  );
}
