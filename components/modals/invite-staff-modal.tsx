"use client";

import React, { useState } from "react";
import {
  UserPlus,
  X,
  Mail,
  User,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { TeamMember } from "@/lib/mock-data";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface InviteStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (member: TeamMember) => void;
}

export function InviteStaffModal({ isOpen, onClose, onInvite }: InviteStaffModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamMember["role"]>("Senior Associate");
  const [activeCases, setActiveCases] = useState("2");
  const [twoFactorRequired, setTwoFactorRequired] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      activeCases: parseInt(activeCases) || 0,
      twoFactorEnabled: twoFactorRequired,
    };

    onInvite(newMember);
    setName("");
    setEmail("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md p-6 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col gap-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-900">Invite Legal Staff</h3>
              <p className="text-xs text-gray-500">Add attorney or support staff to firm roster</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-bold text-gray-700">Full Legal Name:</label>
            <div className="relative mt-1">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Attorney Omar Al-Kilani"
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-1 focus:ring-navy-900"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700">Official Firm Email:</label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. o.kilani@medjordanlaw.com"
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-1 focus:ring-navy-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700">Practice Role:</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as TeamMember["role"])}
                className="w-full p-2 text-xs border border-gray-300 rounded-xl bg-gray-50 mt-1 focus:outline-none focus:ring-1 focus:ring-navy-900"
              >
                <option value="Senior Partner">Senior Partner</option>
                <option value="Partner">Partner</option>
                <option value="Senior Associate">Senior Associate</option>
                <option value="Paralegal">Paralegal</option>
                <option value="Billing Officer">Billing Officer</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700">Active Matter Quota:</label>
              <input
                type="number"
                min="0"
                value={activeCases}
                onChange={(e) => setActiveCases(e.target.value)}
                className="w-full p-2 text-xs border border-gray-300 rounded-xl bg-gray-50 mt-1 focus:outline-none focus:ring-1 focus:ring-navy-900"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs mt-1">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-700" />
              <div>
                <div className="font-bold text-emerald-900 text-[11px]">Enforce Hardware / App 2FA</div>
                <div className="text-[10px] text-emerald-700">Mandatory under Jordan firm policy</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={twoFactorRequired}
              onChange={(e) => setTwoFactorRequired(e.target.checked)}
              className="w-4 h-4 text-navy-900 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Send Chambers Invitation
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
