"use client";

import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Users,
  Shield,
  Clock,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  UserPlus,
  Camera,
  Upload,
  Info,
} from "lucide-react";
import { OfficeSettings, INITIAL_SETTINGS, TeamMember, CURRENT_USER } from "@/lib/mock-data";
import { InviteStaffModal } from "@/components/modals/invite-staff-modal";
import { usePractice } from "@/lib/practice-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SettingsView() {
  const { currentUser, updateUserAvatar, resetUserAvatar, lang } = usePractice();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState<OfficeSettings>(INITIAL_SETTINGS);
  const [twoFactorEnforced, setTwoFactorEnforced] = useState(true);
  const [newPracticeArea, setNewPracticeArea] = useState("");
  const [isInviteStaffOpen, setIsInviteStaffOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Policy state
  const [minNoticeHours, setMinNoticeHours] = useState(settings.bookingPolicy.minNoticeHours);
  const [maxReschedules, setMaxReschedules] = useState(settings.bookingPolicy.maxReschedules);
  const refundTier1Hours = settings.bookingPolicy.refundTier1Hours;
  const [refundTier1Percent, setRefundTier1Percent] = useState(settings.bookingPolicy.refundTier1Percent);
  const refundTier2Hours = settings.bookingPolicy.refundTier2Hours;
  const [refundTier2Percent, setRefundTier2Percent] = useState(settings.bookingPolicy.refundTier2Percent);
  const [autoAcceptance, setAutoAcceptance] = useState(settings.bookingPolicy.autoAcceptance);

  // Lawyer fees state
  const [lawyerProfiles, setLawyerProfiles] = useState(settings.lawyerProfiles);
  const [practiceAreas, setPracticeAreas] = useState(settings.practiceAreas);

  const handleUpdateLawyerFee = (id: string, field: "hourlyFee" | "consultationFee", value: number) => {
    setLawyerProfiles((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const handleAddPracticeArea = () => {
    if (!newPracticeArea.trim()) return;
    setPracticeAreas([...practiceAreas, newPracticeArea.trim()]);
    setNewPracticeArea("");
    showToast(`✓ Added practice area "${newPracticeArea.trim()}".`);
  };

  const handleRemovePracticeArea = (index: number) => {
    setPracticeAreas(practiceAreas.filter((_, i) => i !== index));
  };

  const handleSaveAllSettings = () => {
    setSettings({
      ...settings,
      practiceAreas,
      lawyerProfiles,
      bookingPolicy: {
        minNoticeHours,
        maxReschedules,
        refundTier1Hours,
        refundTier1Percent,
        refundTier2Hours,
        refundTier2Percent,
        autoAcceptance,
      },
    });
    showToast("✓ Office settings and booking policy rules successfully saved.");
  };

  const handleInviteMember = (newMember: TeamMember) => {
    setSettings((prev) => ({
      ...prev,
      team: [...prev.team, newMember],
    }));
    showToast(`✓ Invitation dispatched to ${newMember.name} (${newMember.role}). Added to active roster.`);
  };

  const handleSettingsImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image is too large. Please select a photo under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateUserAvatar(result);
        showToast(`✓ Profile photo updated for ${currentUser.name}.`);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-navy-950 text-white rounded-xl shadow-lg flex items-center justify-between text-xs font-medium animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="apple-glass-card p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold shadow-xs">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-bold text-navy-900 tracking-tight">Office Configuration & Policies</h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Single-Page Settings
              </span>
            </div>
            <p className="text-[12px] text-slate-400">Team permissions, 2FA, lawyer consultation fees & configurable booking rules</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveAllSettings}
          className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          Save All Changes
        </button>
      </div>

      {/* SECTION 0: ACCOUNT PROFILE & AVATAR PHOTO */}
      <div className="apple-glass-card p-6 rounded-xl flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-900">
                {lang === "ar" ? "ملف الحساب والصورة الشخصية" : "Account Profile & Photo"}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === "ar"
                  ? "إدارة صورة الشريك وحساب المحامي المعروض في أسفل القائمة الجانبية"
                  : "Manage the Senior Partner account avatar and workspace display photo"}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {lang === "ar" ? "نشط حالياً" : "Active Session"}
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80">
          <div className="flex items-center gap-4">
            <div
              className="relative group/avatar cursor-pointer shrink-0"
              onClick={() => fileInputRef.current?.click()}
              title="Click to choose a new photo"
            >
              <Avatar className="w-20 h-20 rounded-2xl after:rounded-2xl ring-2 ring-white shadow-md">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} className="rounded-2xl object-cover" />
                <AvatarFallback className="bg-navy-900 text-white text-xl font-bold rounded-2xl">
                  {currentUser.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success ring-2 ring-white shadow-xs" />
              <div className="absolute inset-0 bg-black/45 backdrop-blur-2xs rounded-2xl opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-all duration-150 text-white shadow-inner">
                <Camera className="w-6 h-6" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-navy-950">{currentUser.name}</h4>
                <span className="px-2 py-0.5 rounded-md bg-navy-100 text-navy-900 text-[10.5px] font-bold">
                  {currentUser.role}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono mt-0.5">{currentUser.email}</span>
              <p className="text-[11.5px] text-slate-400 mt-1">
                {lang === "ar"
                  ? "تظهر هذه الصورة بالحجم الموسّع في أسفل القائمة الجانبية وفي ترويسة الحساب."
                  : "Displays in enlarged format at the bottom of the sidebar and in the account popover."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={handleSettingsImageUpload}
              aria-label="Upload photo"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{lang === "ar" ? "رفع صورة جديدة" : "Upload New Photo"}</span>
            </button>
            {currentUser.avatar !== CURRENT_USER.avatar && (
              <button
                type="button"
                onClick={() => {
                  resetUserAvatar();
                  showToast("✓ Profile photo reset to default.");
                }}
                className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === "ar" ? "استعادة الصورة الافتراضية" : "Reset Default"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Informative Location Guide: How & Where to Upload */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100/90 text-xs text-slate-600 flex flex-col gap-2">
          <div className="flex items-center gap-2 font-bold text-navy-950">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Where can you add or upload this image?</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
            <div className="p-3 rounded-lg bg-white/85 border border-blue-100 shadow-2xs">
              <span className="font-bold text-navy-900 block mb-1">Option 1: Directly in the UI (Browser)</span>
              <p className="text-[11.5px] text-slate-500 leading-relaxed">
                Click <strong>"Upload New Photo"</strong> above, or hover over the avatar in the sidebar and click the camera icon. You can pick any JPEG, PNG, or WebP file from your computer. It updates immediately and persists in your browser storage.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white/85 border border-blue-100 shadow-2xs">
              <span className="font-bold text-navy-900 block mb-1">Option 2: In Project Files (Permanent Code)</span>
              <p className="text-[11.5px] text-slate-500 leading-relaxed">
                Drop your image file inside the <code className="bg-slate-100 px-1 py-0.5 rounded text-navy-900 font-mono text-[11px]">public/</code> directory (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-navy-900 font-mono text-[11px]">public/tariq.jpg</code>), then in <code className="bg-slate-100 px-1 py-0.5 rounded text-navy-900 font-mono text-[11px]">lib/mock-data.ts</code> set <code className="bg-slate-100 px-1 py-0.5 rounded text-navy-900 font-mono text-[11px]">CURRENT_USER.avatar = "/tariq.jpg"</code>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: TEAM & ROLES (2FA ENFORCEMENT & PERMISSIONS) */}
      <div className="apple-glass-card p-6 rounded-xl flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-900">Team & Roles</h3>
              <p className="text-xs text-slate-400">Staff accounts, mandatory 2FA enforcement and role privileges</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsInviteStaffOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Invite Staff
          </button>
        </div>

        {/* 2FA Enforcement Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-navy-900">Mandatory Two-Factor Authentication (2FA)</span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                  Enforced Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Requires all partner, associate, and paralegal accounts to authenticate via TOTP authenticator app or hardware key.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={twoFactorEnforced}
              onChange={(e) => {
                setTwoFactorEnforced(e.target.checked);
                showToast(e.target.checked ? "2FA enforced firm-wide." : "2FA policy relaxed.");
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-900" />
          </label>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[850px] text-left text-xs border-collapse table-fixed">
            <colgroup>
              <col className="w-[240px]" />
              <col className="w-[160px]" />
              <col className="w-[130px]" />
              <col className="w-[160px]" />
              <col className="w-[160px]" />
            </colgroup>
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-500 uppercase text-[11px] font-semibold tracking-wider bg-slate-50/80">
                <th className="py-3 px-4 whitespace-nowrap">Name & Email</th>
                <th className="py-3 px-4 whitespace-nowrap">Role</th>
                <th className="py-3 px-4 whitespace-nowrap">Active Matters</th>
                <th className="py-3 px-4 whitespace-nowrap">2FA Security Status</th>
                <th className="py-3 px-4 text-right whitespace-nowrap pr-5">Permissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {settings.team.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col whitespace-nowrap">
                      <span className="font-medium text-slate-900">{member.name}</span>
                      <span className="text-[11px] text-slate-400 mt-0.5">{member.email}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">{member.role}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">{member.activeCases} matters</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium whitespace-nowrap shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      2FA Enabled
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap pr-5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/70 text-slate-600 text-[11px] font-medium whitespace-nowrap shrink-0 inline-block">
                      {member.role.includes("Partner") ? "Full Firm Admin" : "Matter Counsel"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: OFFICE CONFIGURATION (PRACTICE AREAS & LAWYER CONSULTATION FEES) */}
      <div className="apple-glass-card p-6 rounded-xl flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-900">Office Configuration & Practice Areas</h3>
              <p className="text-xs text-slate-400">Jurisdiction practice areas and lawyer consultation fee schedules</p>
            </div>
          </div>
        </div>

        {/* Practice Areas Chips Manager */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-700">Active Firm Practice Areas:</label>
          <div className="flex flex-wrap gap-2 items-center">
            {practiceAreas.map((area, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200 whitespace-nowrap shrink-0"
              >
                {area}
                <button
                  type="button"
                  onClick={() => handleRemovePracticeArea(index)}
                  className="text-slate-400 hover:text-rose-600 cursor-pointer ml-0.5 shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}

            <div className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Add practice area..."
                value={newPracticeArea}
                onChange={(e) => setNewPracticeArea(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddPracticeArea();
                }}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-navy-900"
              />
              <button
                type="button"
                onClick={handleAddPracticeArea}
                className="p-1.5 bg-navy-900 text-white rounded-xl hover:bg-navy-800 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Lawyer Consultation Fees Table */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700">Counsel Consultation Fee Schedules:</label>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[920px] text-left text-xs border-collapse table-fixed">
              <colgroup>
                <col className="w-[210px]" />
                <col className="w-[140px]" />
                <col className="w-[210px]" />
                <col className="w-[200px]" />
                <col className="w-[160px]" />
              </colgroup>
              <thead>
                <tr className="border-b border-slate-200/80 text-slate-500 uppercase text-[11px] font-semibold tracking-wider bg-slate-50/80">
                  <th className="py-3 px-4 whitespace-nowrap">Counsel Profile</th>
                  <th className="py-3 px-4 whitespace-nowrap">Bar License #</th>
                  <th className="py-3 px-4 whitespace-nowrap">Fixed 30-Min Consultation Fee ($)</th>
                  <th className="py-3 px-4 whitespace-nowrap">Standard Hourly Rate ($)</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap pr-5">Intake Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lawyerProfiles.map((lawyer) => (
                  <tr key={lawyer.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex flex-col whitespace-nowrap">
                        <span className="font-medium text-slate-900">{lawyer.name}</span>
                        <span className="text-[11px] text-slate-400 mt-0.5">{lawyer.title}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-600 whitespace-nowrap">{lawyer.licenseNo}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-semibold">$</span>
                        <input
                          type="number"
                          value={lawyer.consultationFee}
                          onChange={(e) =>
                            handleUpdateLawyerFee(lawyer.id, "consultationFee", parseInt(e.target.value) || 0)
                          }
                          className="w-24 px-2 py-1 bg-white border border-slate-200 rounded-md font-semibold text-slate-800 text-xs focus:outline-none focus:border-slate-400"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-semibold">$</span>
                        <input
                          type="number"
                          value={lawyer.hourlyFee}
                          onChange={(e) =>
                            handleUpdateLawyerFee(lawyer.id, "hourlyFee", parseInt(e.target.value) || 0)
                          }
                          className="w-24 px-2 py-1 bg-white border border-slate-200 rounded-md font-semibold text-slate-800 text-xs focus:outline-none focus:border-slate-400"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap pr-5">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200/60 whitespace-nowrap shrink-0 inline-block">
                        Active in Booking Portal
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 3: BOOKING POLICY (CONFIGURABLE RESCHEDULE & REFUND RULES) */}
      <div className="apple-glass-card p-6 rounded-xl flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-900">Booking Policy & Refund Governance</h3>
              <p className="text-xs text-slate-400">Office-configurable limits (not hardcoded) for reschedules and gateway refunds</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sub-col 1: Reschedule Limits */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-purple-600" />
              <h4 className="text-xs font-bold text-navy-900">Reschedule Policy Rules</h4>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Minimum Notice Required (Hours):</label>
                <input
                  type="number"
                  value={minNoticeHours}
                  onChange={(e) => setMinNoticeHours(parseInt(e.target.value) || 0)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl mt-1 text-slate-800 font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Clients cannot reschedule if less than this window remains before session.
                </span>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Maximum Free Reschedules Per Booking:</label>
                <input
                  type="number"
                  value={maxReschedules}
                  onChange={(e) => setMaxReschedules(parseInt(e.target.value) || 0)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl mt-1 text-slate-800 font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Exceeding this requires office review or forfeit of consultation fee.
                </span>
              </div>
            </div>
          </div>

          {/* Sub-col 2: Refund Rules */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-navy-900">Cancellation & Gateway Refund Tiers</h4>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800">Tier 1: Cancellation &gt; {refundTier1Hours}h Notice</span>
                  <p className="text-[10px] text-slate-400">Full gateway credit returned</p>
                </div>
                <div className="flex items-center gap-1 font-mono font-bold text-emerald-700 whitespace-nowrap shrink-0">
                  <input
                    type="number"
                    value={refundTier1Percent}
                    onChange={(e) => setRefundTier1Percent(parseInt(e.target.value) || 0)}
                    className="w-14 p-1 text-center bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800">Tier 2: Cancellation {refundTier2Hours}h - {refundTier1Hours}h Notice</span>
                  <p className="text-[10px] text-slate-400">Partial administrative retention</p>
                </div>
                <div className="flex items-center gap-1 font-mono font-bold text-amber-700 whitespace-nowrap shrink-0">
                  <input
                    type="number"
                    value={refundTier2Percent}
                    onChange={(e) => setRefundTier2Percent(parseInt(e.target.value) || 0)}
                    className="w-14 p-1 text-center bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                <div>
                  <span className="font-bold text-slate-800">Tier 3: Cancellation &lt; {refundTier2Hours}h Notice</span>
                  <p className="text-[10px] text-slate-400">Late cancellation penalty</p>
                </div>
                <div className="font-mono font-bold text-rose-700 text-xs whitespace-nowrap shrink-0">
                  0% (Deposit Retained)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-acceptance vs Manual Triage */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-navy-900">Automatic Booking Acceptance</span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              When disabled, all new booking requests arrive in the &ldquo;Awaiting Acceptance&rdquo; queue for manual partner review.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={autoAcceptance}
              onChange={(e) => {
                setAutoAcceptance(e.target.checked);
                showToast(e.target.checked ? "Auto-acceptance enabled." : "Manual triage enabled.");
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-900" />
          </label>
        </div>

        {/* Save Bar */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={handleSaveAllSettings}
            className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
          >
            <Save className="w-3.5 h-3.5" />
            Save Booking Policy & Configuration
          </button>
        </div>
      </div>

      {/* Invite Staff Modal */}
      <InviteStaffModal
        isOpen={isInviteStaffOpen}
        onClose={() => setIsInviteStaffOpen(false)}
        onInvite={handleInviteMember}
      />
    </div>
  );
}
