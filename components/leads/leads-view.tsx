"use client";

import React, { useState } from "react";
import {
  Mail,
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  Phone,
  ShieldCheck,
  User,
  MessageSquare,
  Archive,
  Tag,
  X,
  MessageCircle,
} from "lucide-react";
import { ContactLeadItem, INITIAL_LEADS } from "@/lib/mock-data";

interface LeadsViewProps {
  onConvertToBooking?: (lead: ContactLeadItem) => void;
}

export function LeadsView({ onConvertToBooking }: LeadsViewProps) {
  const [leads, setLeads] = useState<ContactLeadItem[]>(INITIAL_LEADS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(leads[0]?.id || null);

  // Note addition state
  const [newNoteText, setNewNoteText] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredLeads = leads.filter((lead) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      lead.name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      lead.phone.includes(q) ||
      lead.practiceArea.toLowerCase().includes(q) ||
      lead.message.toLowerCase().includes(q) ||
      (lead.notes && lead.notes.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === "all" || lead.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Keep selected lead synchronized with active filter
  const activeSelectedLead =
    filteredLeads.find((l) => l.id === selectedLeadId) || filteredLeads[0] || null;

  const handleUpdateStatus = (leadId: string, newStatus: ContactLeadItem["status"]) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    showToast(`Lead status updated to "${newStatus}".`);
  };

  const handleAddNote = () => {
    if (!newNoteText.trim() || !activeSelectedLead) return;
    const targetId = activeSelectedLead.id;
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === targetId) {
          const currentNotes = l.notes ? `${l.notes}\n` : "";
          return {
            ...l,
            notes: `${currentNotes}[${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}] ${newNoteText}`,
          };
        }
        return l;
      })
    );
    setNewNoteText("");
    showToast("Internal triage note saved.");
  };

  const handleConvertLead = (lead: ContactLeadItem) => {
    handleUpdateStatus(lead.id, "Consultation Scheduled");
    if (onConvertToBooking) {
      onConvertToBooking(lead);
    } else {
      showToast(`Lead ${lead.name} flagged for consultation intake schedule.`);
    }
  };

  // Status counts
  const newCount = leads.filter((l) => l.status === "New").length;
  const contactedCount = leads.filter((l) => l.status === "Contacted").length;
  const scheduledCount = leads.filter((l) => l.status === "Consultation Scheduled").length;
  const archivedCount = leads.filter((l) => l.status === "Archived").length;

  return (
    <div className="flex flex-col gap-4 flex-1 min-h-0">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#0A2342] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-blue-900/40 text-xs animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-white/60 hover:text-white cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Header & Triage Statistics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-navy-900">Inbound Inquiries & Leads (طلبات واستفسارات الموقع)</h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-navy-100 text-navy-900">
              {leads.length} Total Inquiries
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Website contact form submissions verified by Cloudflare Turnstile, with fast triage to consultation intake (Page 3)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs flex items-center gap-2 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-gray-600 font-medium">Turnstile Guard:</span>
            <span className="font-bold text-navy-900">100% Bot Verified</span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
        <div className="apple-glass-card p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Inquiries</span>
            <div className="text-xl font-bold text-navy-900 mt-0.5 font-mono">{leads.length}</div>
            <span className="text-[10px] text-gray-400">All inbound submissions</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center">
            <Mail className="w-4 h-4" />
          </div>
        </div>

        <div className="apple-glass-card p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">New Awaiting Triage</span>
            <div className="text-xl font-bold text-amber-600 mt-0.5 font-mono">{newCount}</div>
            <span className="text-[10px] text-amber-600 font-medium">Needs initial review</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="apple-glass-card p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">In Progress / Contacted</span>
            <div className="text-xl font-bold text-blue-600 mt-0.5 font-mono">{contactedCount}</div>
            <span className="text-[10px] text-blue-600 font-medium">Screened by associates</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Phone className="w-4 h-4" />
          </div>
        </div>

        <div className="apple-glass-card p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Converted to Intake</span>
            <div className="text-xl font-bold text-emerald-700 mt-0.5 font-mono">{scheduledCount}</div>
            <span className="text-[10px] text-emerald-600 font-medium">Bookings scheduled</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[580px]">
        {/* Left Column: Leads Table & Filter (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3 min-h-[520px]">
          {/* Search & Filter Bar */}
          <div className="apple-glass-card p-2.5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-2xs shrink-0">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads by name, email, phone, topic..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50/80 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-navy-900"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1 bg-gray-100 p-1 rounded-lg text-xs shrink-0 w-full sm:w-auto">
              {[
                { id: "all", label: `All (${leads.length})` },
                { id: "new", label: `New (${newCount})` },
                { id: "contacted", label: `Contacted (${contactedCount})` },
                { id: "consultation scheduled", label: `Intake (${scheduledCount})` },
                { id: "archived", label: `Archived (${archivedCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                    statusFilter === tab.id
                      ? "bg-white text-navy-900 shadow-2xs font-bold"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Leads List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar min-h-[460px]">
            {filteredLeads.length === 0 ? (
              <div className="apple-glass-card p-12 text-center text-gray-400 text-xs flex flex-col items-center justify-center min-h-[300px]">
                <Mail className="w-8 h-8 text-gray-300 mb-2" />
                <p className="font-semibold text-gray-600">No inbound inquiries found</p>
                <p className="text-gray-400 text-[11px] mt-0.5">Try clearing the search or selecting another status filter.</p>
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const isSelected = activeSelectedLead?.id === lead.id;
                return (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLeadId(lead.id)}
                    className={`apple-glass-card p-4 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? "border-navy-900 ring-2 ring-navy-900/10 bg-navy-50/30"
                        : "border-gray-200/80 hover:border-gray-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-navy-900 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                          {lead.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-navy-900">{lead.name}</h3>
                            {lead.turnstileVerified && (
                              <span
                                className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200"
                                title="Cloudflare Turnstile Verified Submission"
                              >
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                Turnstile
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-0.5">
                            <span className="truncate max-w-[180px]">{lead.email}</span>
                            <span>•</span>
                            <span className="font-mono">{lead.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            lead.status === "New"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : lead.status === "Contacted"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : lead.status === "Consultation Scheduled"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {lead.status}
                        </span>
                        <span className="text-[10px] text-gray-400">{lead.submittedAt}</span>
                      </div>
                    </div>

                    {/* Excerpt */}
                    <div className="mt-2.5 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-navy-800 mb-1">
                        <Tag className="w-3 h-3 text-gray-400" />
                        <span>{lead.practiceArea}</span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {lead.message}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Lead Detail & Triage Action Inspector (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3 min-h-[520px]">
          {activeSelectedLead ? (
            <div className="apple-glass-card p-5 rounded-2xl flex flex-col gap-4 flex-1 overflow-y-auto custom-scrollbar">
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-navy-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {activeSelectedLead.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-navy-900">{activeSelectedLead.name}</h2>
                    <span className="text-xs text-gray-500 font-medium">{activeSelectedLead.practiceArea}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                      activeSelectedLead.status === "New"
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : activeSelectedLead.status === "Contacted"
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : activeSelectedLead.status === "Consultation Scheduled"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {activeSelectedLead.status}
                  </span>
                </div>
              </div>

              {/* Contact Credentials */}
              <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-200/80 flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    Phone Number
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${activeSelectedLead.phone}`}
                      className="font-mono font-bold text-navy-900 hover:underline"
                    >
                      {activeSelectedLead.phone}
                    </a>
                    <a
                      href={`https://wa.me/${activeSelectedLead.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold flex items-center gap-1 border border-emerald-200"
                      title="Open WhatsApp Chat"
                    >
                      <MessageCircle className="w-3 h-3" />
                      WA
                    </a>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    Email Address
                  </span>
                  <a
                    href={`mailto:${activeSelectedLead.email}`}
                    className="font-mono font-medium text-navy-900 hover:underline truncate max-w-[200px]"
                  >
                    {activeSelectedLead.email}
                  </a>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-gray-200/50">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    Submitted
                  </span>
                  <span className="text-gray-700 font-medium">{activeSelectedLead.submittedAt}</span>
                </div>
              </div>

              {/* Full Submitted Message */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                  Inquiry Message & Background
                </span>
                <div className="p-3.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-700 leading-relaxed font-sans shadow-2xs">
                  {activeSelectedLead.message}
                </div>
              </div>

              {/* Bot Security Telemetry */}
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <div>
                    <div className="font-bold text-emerald-900 text-[11px]">Cloudflare Turnstile Verified</div>
                    <div className="text-[10px] text-emerald-700">Token: cf_sec_993a4b · Human Verified Zero Friction</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  Passed 100%
                </span>
              </div>

              {/* Triage / Staff Notes */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold text-navy-900 uppercase tracking-wider">
                  Internal Triage Notes
                </span>

                {activeSelectedLead.notes ? (
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 font-sans whitespace-pre-line leading-relaxed">
                    {activeSelectedLead.notes}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No staff notes added yet.</p>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add triage notes from call or screening..."
                    className="flex-1 p-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-navy-900"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddNote();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddNote}
                    className="px-3 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Quick Action Progression Buttons */}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 mt-auto">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(activeSelectedLead.id, "Contacted")}
                    className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-navy-900 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    Mark Contacted
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateStatus(
                        activeSelectedLead.id,
                        activeSelectedLead.status === "Archived" ? "New" : "Archived"
                      )
                    }
                    className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Archive className="w-3.5 h-3.5 text-gray-400" />
                    {activeSelectedLead.status === "Archived" ? "Unarchive" : "Archive Lead"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleConvertLead(activeSelectedLead)}
                  className="w-full py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  Convert to Consultation Booking
                </button>
              </div>
            </div>
          ) : (
            <div className="apple-glass-card p-12 text-center text-gray-400 text-xs flex flex-col items-center justify-center min-h-[300px]">
              <User className="w-8 h-8 text-gray-300 mb-2" />
              <p className="font-semibold text-gray-600">Select an inquiry</p>
              <p className="text-gray-400 text-[11px] mt-0.5">Click any lead in the left list to review inquiry details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
