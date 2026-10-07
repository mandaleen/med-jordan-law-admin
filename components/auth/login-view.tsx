"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Fingerprint,
  Globe,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Scale,
  Cpu,
  PhoneCall,
  Copy,
  Check,
  X,
  KeyRound,
  Building2,
  Clock,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { LogoSvg } from "@/components/brand/logo-svg";
import { Language, getTranslation } from "@/lib/i18n";
import { CURRENT_USER } from "@/lib/mock-data";

interface PartnerProfile {
  id: string;
  name: string;
  title: string;
  email: string;
  barNumber: string;
  avatar: string;
  role: string;
}

const PARTNER_PROFILES: PartnerProfile[] = [
  {
    id: "qudah",
    name: "Tariq Qudah",
    title: "Senior Partner · Head of Litigation",
    email: "t.qudah@medjordanlaw.com",
    barNumber: "JO-BAR-1994-082",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256",
    role: "Senior Partner",
  },
  {
    id: "haddad",
    name: "Nour Haddad",
    title: "Managing Counsel · Corporate & IP",
    email: "n.haddad@medjordanlaw.com",
    barNumber: "JO-BAR-2008-144",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256",
    role: "Managing Counsel",
  },
  {
    id: "masri",
    name: "Karim Masri",
    title: "Partner · Banking & Arbitration",
    email: "k.masri@medjordanlaw.com",
    barNumber: "JO-BAR-2012-309",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256",
    role: "Partner",
  },
];

export function LoginView() {
  const router = useRouter();

  // Language & RTL State
  const [lang, setLang] = useState<Language>("en");
  const isArabic = lang === "ar";

  // Auth Mode State
  const [authMode, setAuthMode] = useState<"credentials" | "passkey">("credentials");

  // Selected Quick-Fill Partner
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("qudah");

  // Credentials State
  const [email, setEmail] = useState<string>(PARTNER_PROFILES[0].email);
  const [password, setPassword] = useState<string>("••••••••••••••");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberDevice, setRememberDevice] = useState<boolean>(true);
  const [isCapsLockOn, setIsCapsLockOn] = useState<boolean>(false);

  // Verification & Execution Flow
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authStep, setAuthStep] = useState<string>("");
  const [authProgress, setAuthProgress] = useState<number>(0);
  const [authSuccess, setAuthSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals & Popovers
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [hasCopiedHotline, setHasCopiedHotline] = useState<boolean>(false);

  // Time in Amman (UTC+3)
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateAmmanTime = () => {
      const now = new Date();
      // Amman time string format
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Amman",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setCurrentTime(new Intl.DateTimeFormat("en-GB", options).format(now));
    };

    updateAmmanTime();
    const interval = setInterval(updateAmmanTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Quick Select Partner
  const handleSelectPartner = (partner: PartnerProfile) => {
    setSelectedPartnerId(partner.id);
    setEmail(partner.email);
    setPassword("••••••••••••••");
    setErrorMessage(null);
  };

  // Keyboard Caps Lock Detection
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState("CapsLock")) {
      setIsCapsLockOn(true);
    } else {
      setIsCapsLockOn(false);
    }
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage(isArabic ? "يرجى إدخال البريد الإلكتروني" : "Please enter your work email.");
      return;
    }
    if (!password.trim()) {
      setErrorMessage(isArabic ? "يرجى إدخال كلمة المرور" : "Please enter your master passphrase.");
      return;
    }

    setErrorMessage(null);
    setIsAuthenticating(true);
    setAuthProgress(15);
    setAuthStep(
      isArabic
        ? "جارٍ إنشاء مصافحة TLS 1.3 وتشفير الجلسة..."
        : "Establishing TLS 1.3 ephemeral handshake..."
    );

    // Multi-phase authentic cryptographic sequence simulation
    setTimeout(() => {
      setAuthProgress(55);
      const partner = PARTNER_PROFILES.find((p) => p.id === selectedPartnerId) || PARTNER_PROFILES[0];
      setAuthStep(
        isArabic
          ? `التحقق من توقيع نقابة المحامين [${partner.barNumber}]...`
          : `Verifying Bar Accreditation Key [${partner.barNumber}]...`
      );
    }, 700);

    setTimeout(() => {
      setAuthProgress(85);
      setAuthStep(
        isArabic
          ? "تأكيد مفاتيح الدخول إلى ملفات القضايا والذمم..."
          : "Authorizing Chambers Vault & Retainer access..."
      );
    }, 1400);

    setTimeout(() => {
      setAuthProgress(100);
      setAuthSuccess(true);
      setAuthStep(
        isArabic ? "تم التوثيق بنجاح. مرحباً بكم في المكتب." : "Authentication verified. Welcome, Counsel."
      );

      // Save user session in localStorage for demo state
      if (typeof window !== "undefined") {
        const partner = PARTNER_PROFILES.find((p) => p.id === selectedPartnerId) || PARTNER_PROFILES[0];
        localStorage.setItem(
          "mjl_session_user",
          JSON.stringify({
            name: partner.name,
            email: partner.email,
            role: partner.role,
            avatar: partner.avatar,
            barNumber: partner.barNumber,
            loginTime: new Date().toISOString(),
          })
        );
      }

      // Smooth redirection to dashboard
      setTimeout(() => {
        router.push("/");
      }, 750);
    }, 2100);
  };

  // Handle Biometric / Hardware Passkey Authenticate
  const handlePasskeyAuth = () => {
    setIsAuthenticating(true);
    setAuthProgress(30);
    setAuthStep(
      isArabic
        ? "بانتظار مصادقة رمز الأمان FIDO2 / YubiKey..."
        : "Polling local cryptographic hardware token (FIDO2)..."
    );

    setTimeout(() => {
      setAuthProgress(70);
      setAuthStep(
        isArabic
          ? "تم التعرف على مفتاح الأمان المعتمد. جارٍ التحقق من البصمة..."
          : "Hardware token matched. Validating biometric assertion..."
      );
    }, 900);

    setTimeout(() => {
      setAuthProgress(100);
      setAuthSuccess(true);
      setAuthStep(
        isArabic
          ? "تمت المصادقة الحيوية بنجاح. فتح الملفات المحمية..."
          : "Biometric assertion verified. Unlocking privileged chambers..."
      );

      if (typeof window !== "undefined") {
        const partner = PARTNER_PROFILES.find((p) => p.id === selectedPartnerId) || PARTNER_PROFILES[0];
        localStorage.setItem(
          "mjl_session_user",
          JSON.stringify({
            name: partner.name,
            email: partner.email,
            role: partner.role,
            avatar: partner.avatar,
            barNumber: partner.barNumber,
            loginTime: new Date().toISOString(),
            method: "FIDO2_HARDWARE",
          })
        );
      }

      setTimeout(() => {
        router.push("/");
      }, 700);
    }, 1800);
  };

  // Copy Emergency Hotline
  const handleCopyHotline = () => {
    navigator.clipboard.writeText("+962 6 560 8800");
    setHasCopiedHotline(true);
    setTimeout(() => setHasCopiedHotline(false), 2500);
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-[100dvh] w-full flex flex-col lg:grid lg:grid-cols-12 bg-white text-navy-950 font-sans selection:bg-navy-900 selection:text-white"
    >
      {/* ========================================================= */}
      {/* LEFT PANE: Chambers Prestige, Heritage & Security Enclave */}
      {/* ========================================================= */}
      <aside className="lg:col-span-5 xl:col-span-5 bg-[#091322] text-white relative overflow-hidden flex flex-col justify-between p-8 sm:p-10 lg:p-14 border-b lg:border-b-0 lg:border-e border-white/10 shrink-0 select-none">
        {/* Subtle Architectural Drafting Grid & Radial Glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Golden Roman Radiance behind column watermark */}
        <div className="absolute -top-32 -start-32 w-96 h-96 rounded-full bg-gradient-to-br from-[#E5C583]/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -end-32 w-96 h-96 rounded-full bg-gradient-to-tl from-[#2A4374]/30 to-transparent blur-3xl pointer-events-none" />

        {/* Monumental Classical Column Watermark */}
        <div className="absolute -bottom-16 -end-16 w-80 lg:w-[420px] opacity-[0.06] pointer-events-none text-[#F4D086] transition-opacity duration-1000">
          <LogoSvg variant="column" />
        </div>

        {/* Top Chambers Header & Live Telemetry Badge */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between gap-4">
            {/* Live Security Enclave Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.07] border border-white/15 backdrop-blur-md shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-mono tracking-wider text-gray-200 uppercase font-medium">
                {isArabic ? "نظام مشفر مباشر · بروتوكول 256-Bit" : "SECURE ENCLAVE · 256-BIT AES"}
              </span>
            </div>

            {/* Amman Clock */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
              <Clock className="w-3.5 h-3.5 text-[#E5C583]" />
              <span>{currentTime || "12:00:00"} AMM</span>
            </div>
          </div>

          {/* Practice Emblem & Seal Lock-Up */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#1E2E4B] to-[#121E33] border border-white/15 p-2.5 flex items-center justify-center shadow-lg shadow-black/40">
                <LogoSvg variant="column" className="w-full h-full text-[#E8B04A]" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#E5C583] font-semibold">
                  {isArabic ? "مكتب المحاماة والتحكيم الدولي" : "Advocates & Legal Consultants"}
                </p>
                <h2 className="text-xl font-bold tracking-tight text-white font-serif">
                  Med Jordan Law
                </h2>
              </div>
            </div>

            <p className="text-sm text-gray-300/90 leading-relaxed font-serif italic max-w-md pt-2">
              {isArabic
                ? "«الحق والعدالة والأمانة المهنية» — تمثيل كبرى الشركات والمؤسسات السيادية في بلاد الشام والخليج العربي ومحاكم التحكيم الدولية منذ عام 1998."
                : "“Veritas, Fides et Iustitia” — Advocating sovereign interests, complex cross-border arbitration, and institutional enterprise law across the Levant and GCC tribunals since 1998."}
            </p>
          </div>
        </div>

        {/* Middle Architectural Highlights & Practice Proof */}
        <div className="relative z-10 my-8 lg:my-12 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Accreditation Tile */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xs hover:border-[#E5C583]/40 transition-colors">
              <div className="flex items-center gap-2.5 text-[#E5C583] mb-1.5">
                <Scale className="w-4 h-4" />
                <span className="text-[10px] font-mono tracking-wider uppercase font-semibold text-gray-300">
                  {isArabic ? "الاعتماد القضائي" : "Judicial Standing"}
                </span>
              </div>
              <p className="text-xs font-semibold text-white">
                {isArabic ? "نقابة المحامين النظاميين الأردنيين" : "Jordan Bar Association"}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {isArabic ? "ترخيص ممارسة قانونية فئة (أ)" : "Chartered Tier-1 Senior Chambers"}
              </p>
            </div>

            {/* Jurisdiction Matrix */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xs hover:border-[#E5C583]/40 transition-colors">
              <div className="flex items-center gap-2.5 text-[#E5C583] mb-1.5">
                <Building2 className="w-4 h-4" />
                <span className="text-[10px] font-mono tracking-wider uppercase font-semibold text-gray-300">
                  {isArabic ? "نطاق الاختصاص" : "Jurisdictions"}
                </span>
              </div>
              <p className="text-xs font-semibold text-white">
                {isArabic ? "عمان · دبي (DIFC) · لندن" : "Amman · Dubai · London"}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {isArabic ? "محاكم الاستئناف والتمييز والتحكيم" : "Cassation & Arbitral Tribunals"}
              </p>
            </div>
          </div>

          {/* Real-Time Security Telemetry Row */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-300">
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isArabic ? "بوابة محكمة التمييز:" : "Court Gateway:"}</span>
              <span className="text-white font-medium">{isArabic ? "متصلة ومحدثة" : "Synced (Active)"}</span>
            </div>
            <span className="text-gray-400 text-[10px]">TLS 1.3 · ECDSA</span>
          </div>
        </div>

        {/* Bottom Partner Signature / Footer */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-400">
          <div>
            <p className="text-gray-300 font-medium">
              {isArabic ? "أمانة سر مجلس الشركاء" : "Chambers of the Senior Partners"}
            </p>
            <p className="text-[11px] text-gray-500">
              {isArabic ? "الدخول مقتصر على الكادر المرخص فقط" : "Authorized Legal Personnel Only"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsEmergencyModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-[#E5C583] hover:text-[#f2dbaa] transition-colors cursor-pointer text-xs font-medium"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{isArabic ? "خط الطوارئ القضائي" : "Emergency Protocol"}</span>
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* RIGHT PANE: Executive Access Console & Double-Bezel Card */}
      {/* ========================================================= */}
      <main className="lg:col-span-7 xl:col-span-7 bg-[#FAFBFD] flex flex-col justify-between p-6 sm:p-10 lg:p-14 min-h-[100dvh] relative overflow-y-auto custom-scrollbar">
        {/* Top Utility Bar: Security Status & Language Switcher */}
        <header className="flex items-center justify-between gap-4 pb-6 sm:pb-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <p className="text-[11px] font-bold text-navy-950 uppercase tracking-wider font-mono">
                {isArabic ? "جلسة مشفرة ومعتمدة" : "Encrypted Legal Gateway"}
              </p>
              <p className="text-[10px] text-gray-500">
                {isArabic ? "مفتاح أمان محلي مطابق" : "Verified Cryptographic Node"}
              </p>
            </div>
          </div>

          {/* Controls: Language Toggle & Help Link */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(isArabic ? "en" : "ar")}
              className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-navy-900 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-gray-500" />
              <span>{isArabic ? "English" : "العربية"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEmergencyModalOpen(true)}
              className="p-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 hover:text-navy-900 shadow-2xs transition-all cursor-pointer"
              title="Help & Recovery"
              aria-label="Help and recovery instructions"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Center: The Core Double-Bezel Card Container */}
        <div className="w-full max-w-[490px] mx-auto my-auto py-4 sm:py-6">
          {/* Outer Shell (Doppelrand) with subtle hairline ring & diffused shadow */}
          <div className="p-2 sm:p-2.5 rounded-[2rem] bg-gradient-to-b from-black/[0.03] to-black/[0.06] ring-1 ring-black/[0.06] shadow-xl shadow-navy-950/5">
            {/* Inner Core: Concentric Machined Surface */}
            <div className="rounded-[calc(2rem-0.625rem)] bg-white p-7 sm:p-9 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_12px_32px_-12px_rgba(10,35,66,0.06)] border border-gray-100/80">
              {/* Official Brand Logo */}
              <div className="flex flex-col items-center text-center mb-6">
                <Link
                  href="/"
                  className="inline-block transition-transform active:scale-95 group focus:outline-none"
                  title="Med Jordan Law"
                >
                  <Logo className="w-56 sm:w-64 text-navy-900 group-hover:text-navy-950 transition-colors" />
                </Link>

                {/* Eyebrow Pill */}
                <div className="mt-5 mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-50 border border-navy-100 text-navy-800 text-[10px] font-mono uppercase tracking-[0.18em] font-semibold">
                  <Lock className="w-3 h-3 text-[#B5821F]" />
                  <span>{getTranslation("auth.portal_badge", lang)}</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-navy-950 tracking-tight font-serif mt-1">
                  {getTranslation("auth.portal_title", lang)}
                </h1>

                <p className="text-xs text-gray-500 leading-relaxed max-w-sm mt-1.5">
                  {getTranslation("auth.portal_subtitle", lang)}
                </p>
              </div>

              {/* Quick Partner Switcher (Executive Convenience & Evaluation) */}
              <div className="mb-6 pb-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                    {getTranslation("auth.quick_fill", lang)}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {isArabic ? "اختر شريكاً للاختبار" : "Click to populate"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {PARTNER_PROFILES.map((partner) => {
                    const isSelected = selectedPartnerId === partner.id;
                    return (
                      <button
                        key={partner.id}
                        type="button"
                        onClick={() => handleSelectPartner(partner)}
                        className={`p-2 rounded-xl text-start transition-all cursor-pointer flex flex-col items-center sm:items-start gap-1.5 border ${
                          isSelected
                            ? "bg-navy-50/80 border-navy-800/30 ring-1 ring-navy-800/20 shadow-2xs"
                            : "bg-gray-50/60 border-gray-200/70 hover:bg-gray-100/80 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 w-full">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={partner.avatar}
                            alt={partner.name}
                            className="w-6 h-6 rounded-full object-cover border border-white shrink-0 shadow-2xs"
                          />
                          <span
                            className={`text-xs font-bold truncate leading-tight ${
                              isSelected ? "text-navy-950" : "text-gray-700"
                            }`}
                          >
                            {partner.name.split(" ")[0]}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 truncate w-full hidden sm:block">
                          {partner.role}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Authentication Mode Tabs: Credentials vs. Hardware Token */}
              <div className="p-1 rounded-xl bg-gray-100/90 border border-gray-200/80 flex items-center mb-5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAuthMode("credentials")}
                  className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMode === "credentials"
                      ? "bg-white text-navy-950 shadow-2xs font-bold"
                      : "text-gray-600 hover:text-navy-900"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{getTranslation("auth.credentials_tab", lang)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode("passkey")}
                  className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMode === "passkey"
                      ? "bg-white text-navy-950 shadow-2xs font-bold"
                      : "text-gray-600 hover:text-navy-900"
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#B5821F]" />
                  <span>{getTranslation("auth.passkey_tab", lang)}</span>
                </button>
              </div>

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* FORM VIEW: Mode A - Counsel Credentials */}
              {authMode === "credentials" ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold text-gray-700 tracking-wide"
                    >
                      {getTranslation("auth.email_label", lang)}
                    </label>
                    <div className="relative rounded-xl border border-gray-300 bg-white focus-within:border-navy-900 focus-within:ring-2 focus-within:ring-navy-900/10 transition-all shadow-2xs">
                      <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-gray-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        required
                        disabled={isAuthenticating}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={getTranslation("auth.email_placeholder", lang)}
                        className="w-full py-2.5 ps-9 pe-3 text-sm text-navy-950 bg-transparent rounded-xl outline-none placeholder:text-gray-400 disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-xs font-bold text-gray-700 tracking-wide"
                      >
                        {getTranslation("auth.password_label", lang)}
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsEmergencyModalOpen(true)}
                        className="text-[11px] text-[#B5821F] hover:text-[#8e6413] hover:underline font-semibold cursor-pointer"
                      >
                        {getTranslation("auth.forgot_password", lang)}
                      </button>
                    </div>

                    <div className="relative rounded-xl border border-gray-300 bg-white focus-within:border-navy-900 focus-within:ring-2 focus-within:ring-navy-900/10 transition-all shadow-2xs">
                      <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-gray-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        disabled={isAuthenticating}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={getTranslation("auth.password_placeholder", lang)}
                        className="w-full py-2.5 ps-9 pe-10 text-sm text-navy-950 bg-transparent rounded-xl outline-none placeholder:text-gray-400 disabled:opacity-60"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 end-0 pe-3 flex items-center text-gray-400 hover:text-navy-900 transition-colors cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Caps Lock Alert */}
                    {isCapsLockOn && (
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 mt-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{getTranslation("auth.caps_lock", lang)}</span>
                      </div>
                    )}
                  </div>

                  {/* Trust Workstation Checkbox */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberDevice}
                        onChange={(e) => setRememberDevice(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-navy-900 focus:ring-navy-800 accent-navy-900 cursor-pointer"
                      />
                      <span className="text-xs text-gray-600">
                        {getTranslation("auth.remember_device", lang)}
                      </span>
                    </label>
                  </div>

                  {/* Authentication Progress Bar when executing */}
                  {isAuthenticating && (
                    <div className="pt-2 space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between text-[11px] font-mono text-gray-500">
                        <span className="flex items-center gap-1.5 text-navy-900 font-semibold truncate">
                          {authSuccess ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <span className="inline-block w-2 h-2 rounded-full bg-navy-900 animate-pulse shrink-0" />
                          )}
                          <span className="truncate">{authStep}</span>
                        </span>
                        <span className="font-bold">{authProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-navy-800 via-navy-900 to-[#B5821F] rounded-full transition-all duration-300"
                          style={{ width: `${authProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Primary CTA: "Button-in-Button" Architecture (Awwwards-Tier) */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isAuthenticating}
                      className="group w-full relative inline-flex items-center justify-between px-6 py-3.5 rounded-full bg-navy-900 hover:bg-navy-950 active:scale-[0.99] text-white text-sm font-bold shadow-lg shadow-navy-950/20 transition-all cursor-pointer disabled:opacity-75"
                    >
                      <span className="tracking-wide">
                        {isAuthenticating
                          ? getTranslation("auth.authenticating", lang)
                          : getTranslation("auth.sign_in", lang)}
                      </span>

                      {/* Nested Button-in-Button Trailing Icon Circle */}
                      <span className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-[#E5C583] group-hover:text-navy-950 flex items-center justify-center transition-all shrink-0 ms-3">
                        <ArrowRight
                          className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                            isArabic ? "rotate-180 group-hover:-translate-x-0.5" : ""
                          }`}
                        />
                      </span>
                    </button>
                  </div>
                </form>
              ) : (
                /* FORM VIEW: Mode B - FIDO2 / Hardware Security Token */
                <div className="space-y-5 text-center py-2">
                  <div className="p-6 rounded-2xl bg-gradient-to-b from-navy-50/80 to-white border border-navy-100/80 flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-navy-900 text-[#E5C583] flex items-center justify-center shadow-md shadow-navy-950/20 border border-navy-800">
                        <Fingerprint className="w-8 h-8 animate-pulse" />
                      </div>
                      <div className="absolute -bottom-1 -end-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[9px] font-bold">
                        ✓
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-navy-950">
                      {isArabic ? "مصادقة مفتاح الأمان المشفر" : "Hardware Key Assertion (FIDO2 / U2F)"}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
                      {getTranslation("auth.passkey_prompt", lang)}
                    </p>

                    <div className="mt-3 px-3 py-1 rounded-lg bg-gray-100/90 border border-gray-200 text-[10px] font-mono text-gray-600">
                      {isArabic
                        ? `المفتاح المسجل باسم: ${PARTNER_PROFILES.find((p) => p.id === selectedPartnerId)?.name}`
                        : `Credential Bound to: ${PARTNER_PROFILES.find((p) => p.id === selectedPartnerId)?.name}`}
                    </div>
                  </div>

                  {/* Hardware Execution Progress */}
                  {isAuthenticating && (
                    <div className="space-y-2 text-start animate-in fade-in duration-200">
                      <div className="flex items-center justify-between text-[11px] font-mono text-gray-500">
                        <span className="text-navy-900 font-semibold truncate">{authStep}</span>
                        <span className="font-bold">{authProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-navy-800 via-navy-900 to-[#B5821F] rounded-full transition-all duration-300"
                          style={{ width: `${authProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={isAuthenticating}
                    onClick={handlePasskeyAuth}
                    className="group w-full relative inline-flex items-center justify-between px-6 py-3.5 rounded-full bg-navy-900 hover:bg-navy-950 active:scale-[0.99] text-white text-sm font-bold shadow-lg shadow-navy-950/20 transition-all cursor-pointer disabled:opacity-75"
                  >
                    <span className="tracking-wide">
                      {isAuthenticating
                        ? getTranslation("auth.authenticating", lang)
                        : getTranslation("auth.scan_passkey", lang)}
                    </span>
                    <span className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-[#E5C583] group-hover:text-navy-950 flex items-center justify-center transition-all shrink-0 ms-3">
                      <Fingerprint className="w-4 h-4" />
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Trust & Sovereign Compliance Footer */}
        <footer className="pt-6 border-t border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            <p className="font-semibold text-gray-700">
              © {new Date().getFullYear()} Med Jordan Law Advocates & Legal Consultants
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {isArabic
                ? "جميع الحقوق محفوظة · نظام إدارة مكتب المحاماة إصدار v2.4.1"
                : "All Rights Reserved · Practice Admin Operating System v2.4.1"}
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{isArabic ? "حالة الخادم: نشط" : "Node AMM-01: Healthy"}</span>
            </span>
            <span>·</span>
            <button
              type="button"
              onClick={() => setIsEmergencyModalOpen(true)}
              className="hover:text-navy-900 hover:underline cursor-pointer"
            >
              {isArabic ? "سياسة الخصوصية والتشفير" : "Security Policy"}
            </button>
          </div>
        </footer>
      </main>

      {/* ========================================================= */}
      {/* EMERGENCY PROTOCOL & DISPATCH MODAL */}
      {/* ========================================================= */}
      {isEmergencyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 sm:p-8 relative">
            <button
              type="button"
              onClick={() => setIsEmergencyModalOpen(false)}
              className="absolute top-5 end-5 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-900 border border-navy-100 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#B5821F]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-950 font-serif">
                  {getTranslation("auth.emergency_title", lang)}
                </h3>
                <p className="text-xs text-gray-500 font-mono">
                  {isArabic ? "بروتوكول الطوارئ واستعادة صلاحيات المحامي" : "Official Registrar Protocol"}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-5">
              {getTranslation("auth.emergency_body", lang)}
            </p>

            <div className="space-y-3 mb-6">
              {/* Registrar Contact Box */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider font-mono">
                    {isArabic ? "الخط الساخن لأمانة السر" : "Registrar Hotline"}
                  </p>
                  <p className="text-sm font-mono font-bold text-navy-900 mt-0.5">
                    +962 6 560 8800
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyHotline}
                  className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-xs font-semibold text-navy-900 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  {hasCopiedHotline ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isArabic ? "تم النسخ" : "Copied"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                      <span>{isArabic ? "نسخ الرقم" : "Copy"}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Physical Office Chambers */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider font-mono">
                  {isArabic ? "مقر إدارة المكتب الرئيسي" : "Physical Chambers HQ"}
                </p>
                <p className="text-xs text-navy-900 font-medium mt-1">
                  {isArabic
                    ? "عمان، الأردن — الشميساني، شارع الثقافة، برج الأعمال الملكي، الطابق 14"
                    : "Amman, Jordan — Shmeisani, Al-Thaqafa St, Royal Business Tower, 14th Floor"}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(false)}
                className="px-5 py-2.5 rounded-full bg-navy-900 text-white text-xs font-bold hover:bg-navy-950 transition-colors cursor-pointer"
              >
                {isArabic ? "فهمت والمتابعة" : "Acknowledge & Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
