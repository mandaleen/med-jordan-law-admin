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
          <div className="apple-table-card p-4 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3.5 w-full md:w-auto">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-900 to-navy-950 text-white flex items-center justify-center font-bold shadow-sm ring-1 ring-black/5">
                <Users className="w-5 h-5 text-navy-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[17px] font-bold text-navy-900 tracking-tight">Clients Directory</h2>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-navy-50 text-navy-600 border border-navy-200/50">
                    {clients.length} Accounts
                  </span>
                </div>
                <p className="text-[12px] text-slate-500">Account layer connecting bookings, active cases & signed agreements</p>
              </div>
            </div>

            {/* Search Box */}
            <div className="relative min-w-[280px] w-full md:w-auto">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, company, national ID, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-8 pe-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-navy-900 text-navy-900 placeholder:text-slate-400 transition-all text-start"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Directory Table */}
          <div className="apple-table-card flex-1 flex flex-col min-h-[460px]">
            <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar min-h-0">
              <table className="w-full text-start border-collapse table-fixed min-w-[1240px]">
                <colgroup>
                  <col className="w-[240px]" />
                  <col className="w-[200px]" />
                  <col className="w-[150px]" />
                  <col className="w-[130px]" />
                  <col className="w-[130px]" />
                  <col className="w-[130px]" />
                  <col className="w-[130px]" />
                  <col className="w-[130px]" />
                </colgroup>
                <thead className="sticky top-0 z-10 shadow-xs">
                  <tr className="bg-gray-50 border-b border-slate-200/80">
                    <th className="py-3.5 px-4.5 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500 text-start">Client / Entity</th>
                    <th className="py-3.5 px-4.5 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500 text-start">Contact Details</th>
                    <th className="py-3.5 px-4.5 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500 text-start">National ID / Reg</th>
                    <th className="py-3.5 px-4.5 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500 text-start">Active Matters</th>
                    <th className="py-3.5 px-4.5 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500 text-start">Bookings</th>
                    <th className="py-3.5 px-4.5 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500 text-start">Total Billed</th>
                    <th className="py-3.5 px-4.5 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500 text-start">Status</th>
                    <th className="py-3.5 px-4.5 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-500 text-end pe-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
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
                        className="hover:bg-slate-50/80 transition-colors duration-150 cursor-pointer group"
                      >
                        {/* 1. Client / Entity */}
                        <td className="py-4 px-4.5 align-middle text-start">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8.5 h-8.5 rounded-full ring-2 ring-slate-100 shadow-xs shrink-0">
                              <AvatarImage src={client.avatar} alt={client.name} />
                              <AvatarFallback className="bg-gradient-to-br from-navy-900 to-navy-800 text-white font-bold text-xs">
                                {client.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0 pe-2">
                              <span className="font-semibold text-navy-900 text-[13px] group-hover:text-navy-600 transition-colors truncate block leading-tight">
                                {client.name}
                              </span>
                              {client.company ? (
                                <span className="text-[11px] text-slate-400 truncate block mt-0.5">
                                  {client.company}
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-400">Individual Client</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 2. Contact Info */}
                        <td className="py-4 px-4.5 align-middle text-start">
                          <div className="flex flex-col min-w-0">
                            <span className="font-mono text-slate-700 font-medium text-[11.5px] truncate">
                              {client.phone}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate mt-0.5">
                              {client.email}
                            </span>
                          </div>
                        </td>

                        {/* 3. National ID */}
                        <td className="py-4 px-4.5 align-middle whitespace-nowrap text-start">
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100/90 text-slate-700 border border-slate-200/60 inline-block shadow-2xs">
                            {client.nationalId}
                          </span>
                        </td>

                        {/* 4. Active Cases */}
                        <td className="py-4 px-4.5 align-middle whitespace-nowrap text-start">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 font-semibold text-xs border border-blue-200/70 shadow-2xs">
                            <Briefcase className="w-3 h-3 text-blue-600" />
                            {client.activeCasesCount} Cases
                          </span>
                        </td>

                        {/* 5. Bookings */}
                        <td className="py-4 px-4.5 align-middle whitespace-nowrap text-start">
                          <span className="text-slate-600 font-medium inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {client.lifetimeBookingsCount} Consultations
                          </span>
                        </td>

                        {/* 6. Total Billed */}
                        <td className="py-4 px-4.5 align-middle whitespace-nowrap text-start">
                          <span className="font-mono font-bold text-navy-900 text-[13px] tabular-nums">
                            {client.totalBilled}
                          </span>
                        </td>

                        {/* 7. Status */}
                        <td className="py-4 px-4.5 align-middle whitespace-nowrap text-start">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border shadow-xs ${
                              client.status === "Retained"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                                : client.status === "Active"
                                ? "bg-blue-50 text-blue-800 border-blue-200/80"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              client.status === "Retained"
                                ? "bg-emerald-500"
                                : client.status === "Active"
                                ? "bg-blue-500"
                                : "bg-slate-400"
                            }`} />
                            {client.status}
                          </span>
                        </td>

                        {/* 8. Profile Action */}
                        <td className="py-4 px-4.5 text-end align-middle whitespace-nowrap pe-6">
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-lg bg-slate-100 group-hover:bg-navy-900 group-hover:text-white text-slate-700 text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ms-auto shadow-2xs"
                          >
                            Profile 360
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
            <div className="bg-gray-50 border-t border-slate-200/80 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 mt-auto shrink-0">
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
