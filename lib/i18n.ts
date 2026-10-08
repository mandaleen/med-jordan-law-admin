export type Language = "en" | "ar";

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export const I18N_DICTIONARY: TranslationDictionary = {
  // Navigation
  "nav.dashboard": { en: "Dashboard", ar: "الرئيسية" },
  "nav.bookings": { en: "Bookings", ar: "الحجوزات" },
  "nav.cases": { en: "Cases", ar: "القضايا" },
  "nav.clients": { en: "Clients", ar: "الموكلون" },
  "nav.contracts": { en: "Contracts", ar: "العقود" },
  "nav.leads": { en: "Leads", ar: "الطلبات" },
  "nav.finance": { en: "Finance", ar: "المالية" },
  "nav.content": { en: "Content", ar: "المحتوى" },
  "nav.settings": { en: "Settings", ar: "الإعدادات" },
  "nav.audit": { en: "Audit", ar: "السجل" },
  "nav.help": { en: "Help", ar: "المساعدة" },

  // Sidebar sections
  "sidebar.menu": { en: "Menu", ar: "القائمة" },
  "sidebar.general": { en: "General", ar: "عام" },
  "sidebar.manage_account": { en: "Account", ar: "الحساب" },
  "sidebar.practice_alerts": { en: "Alerts", ar: "التنبيهات" },
  "sidebar.practice_dispatch": { en: "Dispatch", ar: "البريد" },
  "sidebar.intake_updates": { en: "Updates", ar: "التحديثات" },
  "sidebar.all_caught_up": { en: "All caught up", ar: "لا جديد" },
  "sidebar.sign_out": { en: "Sign Out", ar: "خروج" },

  "topbar.search": { en: "Search (⌘K)...", ar: "بحث (⌘K)..." },

  // Common UI actions
  "action.new": { en: "New", ar: "جديد" },
  "action.new_consultation": { en: "New Booking", ar: "حجز جديد" },
  "action.export": { en: "Export", ar: "تصدير" },
  "action.filter": { en: "Filter", ar: "تصفية" },
  "action.search": { en: "Search (⌘K)...", ar: "بحث (⌘K)..." },
  "action.save": { en: "Save", ar: "حفظ" },
  "action.cancel": { en: "Cancel", ar: "إلغاء" },
  "action.confirm": { en: "Confirm", ar: "تأكيد" },
  "action.reset_filters": { en: "Reset", ar: "إعادة تعيين" },

  // Status badges
  "status.confirmed": { en: "Confirmed", ar: "مؤكد" },
  "status.pending": { en: "Pending", ar: "قيد المراجعة" },
  "status.conflict_check": { en: "Conflict", ar: "تعارض مصالح" },
  "status.concluded": { en: "Concluded", ar: "مكتمل" },
  "status.active": { en: "Active", ar: "نشط" },
  "status.retainer": { en: "Retainer", ar: "توكيل" },
  "status.corporate": { en: "Corporate", ar: "شركات" },
  "status.individual": { en: "Individual", ar: "أفراد" },

  // Authentication & Security Enclave
  "auth.portal_badge": { en: "Portal", ar: "البوابة" },
  "auth.portal_title": { en: "Sign In", ar: "تسجيل الدخول" },
  "auth.portal_subtitle": { en: "Sign in to access your portal.", ar: "سجّل الدخول للمتابعة." },
  "auth.credentials_tab": { en: "Credentials", ar: "بيانات الدخول" },
  "auth.passkey_tab": { en: "Security Key", ar: "مفتاح الأمان" },
  "auth.quick_fill": { en: "Quick-Fill Profile", ar: "ملء سريع" },
  "auth.email_label": { en: "Email", ar: "البريد الإلكتروني" },
  "auth.email_placeholder": { en: "t.qudah@medjordanlaw.com", ar: "t.qudah@medjordanlaw.com" },
  "auth.password_label": { en: "Password", ar: "كلمة المرور" },
  "auth.password_placeholder": { en: "Enter password", ar: "أدخل كلمة المرور" },
  "auth.remember_device": { en: "Remember for 30 days", ar: "تذكرني لمدة 30 يوماً" },
  "auth.forgot_password": { en: "Forgot password?", ar: "نسيت كلمة المرور؟" },
  "auth.sign_in": { en: "Sign In", ar: "دخول" },
  "auth.authenticating": { en: "Signing in...", ar: "جارٍ الدخول..." },
  "auth.caps_lock": { en: "Caps Lock is on", ar: "Caps Lock مفعّل" },
  "auth.passkey_prompt": { en: "Touch your security key to continue.", ar: "المس مفتاح الأمان للمتابعة." },
  "auth.scan_passkey": { en: "Use Security Key", ar: "استخدام المفتاح" },
  "auth.emergency_title": { en: "Help & Recovery", ar: "المساعدة" },
  "auth.emergency_body": { en: "If locked out, contact the Registrar.", ar: "في حال فقدان الوصول، تواصل مع أمانة السر." },
  "auth.emergency_phone": { en: "Hotline: +962 6 560 8800", ar: "الهاتف: 8800 560 6 962+" },
  "auth.jurisdiction_tag": { en: "Amman · Dubai · London", ar: "عمان · دبي · لندن" },
  "auth.court_sync": { en: "Court Gateway", ar: "بوابة المحاكم" },
  "auth.encryption_tier": { en: "AES-256 GCM", ar: "تشفير AES-256" },
};

export function getTranslation(key: string, lang: Language = "en"): string {
  if (I18N_DICTIONARY[key]) {
    return I18N_DICTIONARY[key][lang] || I18N_DICTIONARY[key].en;
  }
  return key;
}
