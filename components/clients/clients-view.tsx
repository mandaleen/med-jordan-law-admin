"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  ArrowLeft,
  Calendar,
  Briefcase,
  FileText,
  DollarSign,
  MessageSquare,
  Phone,
  Mail,
  Download,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Send,
  Clock,
  ChevronRight,
  Eye,
  FileCheck,
} from "lucide-react";
import { ClientProfile, INITIAL_CLIENTS } from "@/lib/mock-data";

export function ClientsView() {
  const [clients, setClients] = useState<ClientProfile[]>(INITIAL_CLIENTS);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"bookings" | "cases" | "agreements" | "invoices" | "messages">("bookings");
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

      {/* MASTER DIRECTORY VIEW */}
      {!selectedClient ? (
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="apple-glass-card p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-10 h-10 rounded-xl bg-[#0A2342] text-white flex items-center justify-center font-bold shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[17px] font-bold text-[#0A2342] tracking-tight">Clients Directory</h2>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#007AFF] border border-blue-200/50">
                    {clients.length} Accounts
                  </span>
                </div>
                <p className="text-[12px] text-slate-400">Account layer connecting bookings, active cases & signed agreements</p>
              </div>
            </div>

            {/* Search Box */}
            <div className="relative min-w-[280px] w-full md:w-auto">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, company, national ID, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0A2342] text-[#0A2342]"
              />
            </div>
          </div>

          {/* Directory Table */}
          <div className="apple-glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1020px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4 whitespace-nowrap">Client / Entity</th>
                    <th className="py-3 px-4 whitespace-nowrap">Contact Info</th>
                    <th className="py-3 px-4 whitespace-nowrap">National ID / Reg</th>
                    <th className="py-3 px-4 whitespace-nowrap">Active Cases</th>
                    <th className="py-3 px-4 whitespace-nowrap">Bookings</th>
                    <th className="py-3 px-4 whitespace-nowrap">Total Billed</th>
                    <th className="py-3 px-4 whitespace-nowrap">Status</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredClients.map((client) => (
                    <tr
                      key={client.id}
                      onClick={() => setSelectedClientId(client.id)}
                      className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                    >
                      {/* Client */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          {client.avatar ? (
                            <img
                              src={client.avatar}
                              alt={client.name}
                              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-[#0A2342] font-bold text-xs flex items-center justify-center shrink-0">
                              {client.initials}
                            </div>
                          )}
                          <div className="flex flex-col whitespace-nowrap">
                            <span className="font-bold text-[#0A2342] text-[13px] group-hover:text-blue-600 transition-colors">
                              {client.name}
                            </span>
                            {client.company && (
                              <span className="text-[11px] text-slate-400">{client.company}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col whitespace-nowrap">
                          <span className="font-medium text-slate-700">{client.phone}</span>
                          <span className="text-[11px] text-slate-400">{client.email}</span>
                        </div>
                      </td>

                      {/* National ID */}
                      <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {client.nationalId}
                      </td>

                      {/* Active Cases */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-bold text-xs border border-blue-200 whitespace-nowrap shrink-0 inline-block">
                          {client.activeCasesCount} Cases
                        </span>
                      </td>

                      {/* Bookings */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                        {client.lifetimeBookingsCount} Consultations
                      </td>

                      {/* Total Billed */}
                      <td className="py-3.5 px-4 font-bold text-[#0A2342] whitespace-nowrap">
                        {client.totalBilled}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 inline-block ${
                            client.status === "Retained"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : client.status === "Active"
                              ? "bg-blue-50 text-blue-800 border border-blue-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {client.status}
                        </span>
                      </td>

                      {/* Profile Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          className="px-3 py-1 rounded-lg bg-slate-100 group-hover:bg-[#0A2342] group-hover:text-white text-slate-700 text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1 ml-auto whitespace-nowrap shrink-0"
                        >
                          Profile 360
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
        /* DETAIL VIEW: CLIENT 360 WORKSPACE */
        <div className="flex flex-col gap-4">
          {/* Header & Account Summary */}
          <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedClientId(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A2342] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Clients Directory
              </button>

              <span className="text-xs text-slate-400">Client since {selectedClient.joinedDate}</span>
            </div>

            {/* Profile Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-3.5">
                {selectedClient.avatar ? (
                  <img
                    src={selectedClient.avatar}
                    alt={selectedClient.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-200 shadow-xs"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#0A2342] text-white font-extrabold text-base flex items-center justify-center shadow-xs">
                    {selectedClient.initials}
                  </div>
                )}

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-[#0A2342] tracking-tight">{selectedClient.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold whitespace-nowrap shrink-0">
                      {selectedClient.status}
                    </span>
                  </div>
                  {selectedClient.company && (
                    <span className="text-xs font-semibold text-slate-500">{selectedClient.company}</span>
                  )}
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-mono text-[11px] whitespace-nowrap shrink-0">
                      National ID: <strong className="text-slate-800">{selectedClient.nationalId}</strong>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 whitespace-nowrap shrink-0">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {selectedClient.phone}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 whitespace-nowrap shrink-0">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {selectedClient.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat Rails */}
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200/60 shrink-0">
                <div className="text-center px-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block whitespace-nowrap">Total Billed</span>
                  <span className="text-sm font-bold text-[#0A2342] font-mono whitespace-nowrap">{selectedClient.totalBilled}</span>
                </div>
                <div className="h-7 w-[1px] bg-slate-200" />
                <div className="text-center px-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block whitespace-nowrap">Active Cases</span>
                  <span className="text-sm font-bold text-blue-700 font-mono whitespace-nowrap">{selectedClient.activeCasesCount}</span>
                </div>
                <div className="h-7 w-[1px] bg-slate-200" />
                <div className="text-center px-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block whitespace-nowrap">Bookings</span>
                  <span className="text-sm font-bold text-slate-800 font-mono whitespace-nowrap">{selectedClient.lifetimeBookingsCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5 SUB-TABS */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl w-fit flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("bookings")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "bookings" ? "bg-white text-[#0A2342] shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Booking History ({selectedClient.bookings.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cases")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "cases" ? "bg-white text-[#0A2342] shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Linked Cases ({selectedClient.linkedCases.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("agreements")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "agreements" ? "bg-white text-[#0A2342] shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              Signed Agreements ({selectedClient.signedAgreements.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("invoices")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "invoices" ? "bg-white text-[#0A2342] shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              Invoices ({selectedClient.invoices.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("messages")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === "messages" ? "bg-white text-[#0A2342] shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Message Log ({selectedClient.messageLog.length})
            </button>
          </div>

          {/* TAB 1: BOOKING HISTORY */}
          {activeTab === "bookings" && (
            <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-3">
              <h3 className="text-sm font-bold text-[#0A2342]">Consultation Booking History</h3>
              <div className="flex flex-col gap-2.5">
                {selectedClient.bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0A2342]">{b.practiceArea}</span>
                        <span className="text-[11px] text-slate-500">
                          {b.dateTime} · Counsel: {b.lawyerName} ({b.appointmentType})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-slate-800 whitespace-nowrap">{b.fee}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap shrink-0">
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: LINKED CASES */}
          {activeTab === "cases" && (
            <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-3">
              <h3 className="text-sm font-bold text-[#0A2342]">Linked Legal Matters</h3>
              {selectedClient.linkedCases.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No litigation matters opened for this client yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedClient.linkedCases.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-blue-700 whitespace-nowrap">{c.caseNumber}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 whitespace-nowrap shrink-0">
                          {c.statusStage}
                        </span>
                      </div>
                      <h4 className="font-bold text-[#0A2342] text-xs">{c.title}</h4>
                      <p className="text-[11px] text-slate-500">
                        Counsel: {c.assignedLawyer} · {c.practiceArea}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SIGNED AGREEMENTS (Signed PDF generated at booking, WhatsApp delivered) */}
          {activeTab === "agreements" && (
            <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-bold text-[#0A2342]">Signed Consultation Agreements</h3>
                <p className="text-xs text-slate-400">
                  Signed PDFs generated automatically during booking intake, executed and delivered via WhatsApp.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {selectedClient.signedAgreements.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No signed agreements logged for this client.
                  </div>
                ) : (
                  selectedClient.signedAgreements.map((sa) => (
                    <div
                      key={sa.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0A2342] flex items-center justify-center font-bold shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[#0A2342] text-xs">{sa.title}</span>
                          <span className="text-[11px] text-slate-500 mt-0.5">
                            Executed on {sa.signedDate} · File: <code className="text-slate-700 font-mono">{sa.pdfName}</code>
                          </span>
                          {/* Stamped WhatsApp Delivery Receipt */}
                          <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-emerald-700 font-medium bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-200/60 w-fit">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>
                              Delivered via WhatsApp to <strong>{selectedClient.phone}</strong> on {sa.deliveryTimestamp} (Status: {sa.deliveryReceipt})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => showToast(`Downloading ${sa.pdfName}...`)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download PDF
                        </button>
                        <button
                          type="button"
                          onClick={() => showToast(`Agreement resent to ${selectedClient.phone} via WhatsApp.`)}
                          className="px-3 py-1.5 rounded-lg bg-[#0A2342] text-white hover:bg-blue-900 text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Resend WhatsApp
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: INVOICES */}
          {activeTab === "invoices" && (
            <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-3">
              <h3 className="text-sm font-bold text-[#0A2342]">Invoices & Gateway Receipts</h3>
              <div className="flex flex-col gap-2.5">
                {selectedClient.invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0A2342]">{inv.invoiceNumber} · {inv.service}</span>
                        <span className="text-[11px] text-slate-500">
                          {inv.date} · Gateway Ref: <code className="font-mono text-slate-700">{inv.gatewayRef}</code>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-slate-900 font-mono text-[13px] whitespace-nowrap">{inv.amount}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold whitespace-nowrap shrink-0">
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MESSAGE LOG (OMNICHANNEL AUDIT TRAIL) */}
          {activeTab === "messages" && (
            <div className="apple-glass-card p-5 rounded-xl flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-bold text-[#0A2342]">Omnichannel Communications Log</h3>
                <p className="text-xs text-slate-400">
                  Audit trail of every SMS, Email, and WhatsApp sent to this client (confirmations, reminders, reschedule notices, agreements).
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                {selectedClient.messageLog.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200/70 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap shrink-0 ${
                            msg.channel === "WhatsApp"
                              ? "bg-emerald-100 text-emerald-800"
                              : msg.channel === "SMS"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-slate-200 text-slate-800"
                          }`}
                        >
                          {msg.channel}
                        </span>
                        <span className="font-bold text-[#0A2342] whitespace-nowrap">{msg.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px] shrink-0">
                        <span className="whitespace-nowrap">{msg.timestamp}</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-semibold whitespace-nowrap">✓ {msg.status}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-sans leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/60 mt-0.5">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
