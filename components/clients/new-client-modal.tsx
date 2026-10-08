"use client";

import React, { useState } from "react";
import {
  X,
  Building2,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Scale,
} from "lucide-react";
import { ClientProfile } from "@/lib/mock-data";

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (newClient: ClientProfile) => void;
}

export function NewClientModal({ isOpen, onClose, onAddClient }: NewClientModalProps) {
  const [entityType, setEntityType] = useState<"Corporate" | "Individual">("Corporate");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [chamberOfCommerce, setChamberOfCommerce] = useState("Amman Chamber of Commerce");
  const [phone, setPhone] = useState("+962 7 ");
  const [email, setEmail] = useState("");
  const [assignedPartner, setAssignedPartner] = useState("Tariq Qudah, Senior Partner");
  const [retainerTier, setRetainerTier] = useState<
    "Tier 1 General Counsel Retainer" | "Litigation Retainer" | "Advisory / Project Basis"
  >("Tier 1 General Counsel Retainer");
  const [poaStatus, setPoaStatus] = useState<"Verified on File" | "Pending Notarization">("Verified on File");
  const [poaNumber, setPoaNumber] = useState("");
  const [conflictCleared, setConflictCleared] = useState(false);
  const initialRetainerAmount = "$5,000.00";
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a legal entity or client name.");
      return;
    }
    if (!nationalId.trim()) {
      setError("Jordanian National ID or Commercial Register number is required for official compliance.");
      return;
    }
    if (!conflictCleared) {
      setError("Mandatory Bar requirement: You must certify the Conflict of Interest clearance check.");
      return;
    }

    const initials = name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");

    const newClient: ClientProfile = {
      id: `cl-${Date.now()}`,
      name: name.trim(),
      company: entityType === "Corporate" ? company.trim() || name.trim() : undefined,
      email: email.trim() || "legal@client-registry.jo",
      phone: phone.trim(),
      nationalId: nationalId.trim(),
      initials: initials || "CL",
      entityType,
      commercialReg: nationalId.trim(),
      taxNumber: taxNumber.trim() || `TAX-JO-${nationalId.trim().slice(-6)}`,
      chamberOfCommerce: entityType === "Corporate" ? chamberOfCommerce : undefined,
      poaNumber: poaNumber.trim() || `Amman Notary Public / POA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      poaType: entityType === "Corporate" ? "Litigation POA (وكالة خاصة بالخصومة)" : "General Notarial POA (وكالة عامة)",
      poaStatus,
      assignedPartner,
      retainerTier,
      activeCasesCount: 0,
      lifetimeBookingsCount: 1,
      totalBilled: initialRetainerAmount || "$0.00",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Retained",
      bookings: [],
      linkedCases: [],
      signedAgreements: [],
      invoices: [],
      messageLog: [
        {
          id: `msg-${Date.now()}`,
          timestamp: "Just now",
          channel: "WhatsApp",
          type: "Booking Confirmation",
          message: `Med Jordan Law: Client onboarding dossier opened for ${name}. Assigned Counsel: ${assignedPartner}.`,
          status: "Sent",
        },
      ],
      internalNotes: [
        {
          id: `cn-${Date.now()}`,
          author: assignedPartner.split(",")[0],
          role: "Partner",
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          content: `Initial intake file established. Conflict check verified against adverse parties registry. Retainer engagement: ${retainerTier}.`,
          isPrivileged: true,
        },
      ],
    };

    onAddClient(newClient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-[var(--shadow-float)] border border-gray-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-client-title"
      >
        {/* Header Bar */}
        <div className="bg-navy-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-gold-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 id="new-client-title" className="text-base font-semibold tracking-tight text-white">
                New Client
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 custom-scrollbar text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Entity Classification Switch */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-xs">
              Entity Type
            </label>
            <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setEntityType("Corporate")}
                className={`py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  entityType === "Corporate"
                    ? "bg-white text-navy-900 shadow-xs border border-gray-200/80"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Building2 className="w-4 h-4 text-gold-500" />
                <span>Corporate</span>
              </button>
              <button
                type="button"
                onClick={() => setEntityType("Individual")}
                className={`py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  entityType === "Individual"
                    ? "bg-white text-navy-900 shadow-xs border border-gray-200/80"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <User className="w-4 h-4 text-navy-600" />
                <span>Individual</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-xs uppercase tracking-wider text-gray-400">
              Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  {entityType === "Corporate" ? "Entity Name *" : "Full Name *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={entityType === "Corporate" ? "e.g. Arab Potash Logistics Ltd." : "e.g. Zaid Al-Kayali"}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(null);
                  }}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-navy-900 text-xs"
                />
              </div>

              {entityType === "Corporate" ? (
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Parent / Trade Group</label>
                  <input
                    type="text"
                    placeholder="e.g. Arab Potash Group (Amman)"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-navy-900 text-xs"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Occupation</label>
                  <input
                    type="text"
                    placeholder="e.g. Managing Director"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-navy-900 text-xs"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  {entityType === "Corporate" ? "Commercial Reg *" : "National ID *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2001948819"
                  value={nationalId}
                  onChange={(e) => {
                    setNationalId(e.target.value);
                    setError(null);
                  }}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg font-mono text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-navy-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Tax ID</label>
                <input
                  type="text"
                  placeholder="e.g. TAX-JO-881920"
                  value={taxNumber}
                  onChange={(e) => setTaxNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg font-mono text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-navy-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Chamber / Registry</label>
                <input
                  type="text"
                  value={chamberOfCommerce}
                  onChange={(e) => setChamberOfCommerce(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-navy-900 text-xs"
                />
              </div>
            </div>
          </div>

          {/* 3. Representation & Retainer Structure */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 text-xs uppercase tracking-wider text-gray-400">
              Representation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Lead Partner</label>
                <select
                  value={assignedPartner}
                  onChange={(e) => setAssignedPartner(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-navy-900 text-xs cursor-pointer"
                >
                  <option value="Tariq Qudah, Senior Partner">Tariq Qudah</option>
                  <option value="Sara Al-Majali, Partner">Sara Al-Majali</option>
                  <option value="Kareem Masri, Senior Associate">Kareem Masri</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Retainer Tier</label>
                <select
                  value={retainerTier}
                  onChange={(e) => setRetainerTier(e.target.value as typeof retainerTier)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-navy-900 text-xs cursor-pointer"
                >
                  <option value="Tier 1 General Counsel Retainer">Tier 1 – General Counsel</option>
                  <option value="Litigation Retainer">Litigation Retainer</option>
                  <option value="Advisory / Project Basis">Advisory / Project Basis</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-medium mb-1">POA Status</label>
                <select
                  value={poaStatus}
                  onChange={(e) => setPoaStatus(e.target.value as typeof poaStatus)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-navy-900 text-xs cursor-pointer"
                >
                  <option value="Verified on File">Verified on File</option>
                  <option value="Pending Notarization">Pending Notarization</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">POA Notary Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Amman Notary Public / POA-2026-1194"
                  value={poaNumber}
                  onChange={(e) => setPoaNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-navy-900 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* 4. Contact Details */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 text-xs uppercase tracking-wider text-gray-400">
              Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Phone *</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-gray-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="+962 7 9XXX XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full ps-8 pe-3 py-2 bg-white border border-gray-300 rounded-lg font-mono text-gray-900 focus:outline-none focus:border-navy-900 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Email *</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-gray-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="legal@entity.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full ps-8 pe-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-navy-900 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 5. Jordan Bar Mandatory Conflict Check */}
          <div className="pt-3 border-t border-gray-100">
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200/90 cursor-pointer hover:bg-gray-100/70 transition-colors">
              <input
                type="checkbox"
                checked={conflictCleared}
                onChange={(e) => {
                  setConflictCleared(e.target.checked);
                  setError(null);
                }}
                className="mt-0.5 rounded border-gray-300 text-navy-900 focus:ring-navy-900 w-4 h-4 cursor-pointer"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Conflict of Interest Clearance
                </span>
                <span className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                  I certify adverse party checks were performed against all registered matters, per Bar Association ethics bylaws.
                </span>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition-colors cursor-pointer text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-navy-900 hover:bg-navy-800 text-white font-medium transition-colors shadow-xs cursor-pointer text-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-gold-400" />
              <span>Add Client</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
