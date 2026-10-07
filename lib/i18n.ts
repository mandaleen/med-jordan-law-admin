export type Language = "en" | "ar";

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export const I18N_DICTIONARY: TranslationDictionary = {
  // Navigation
  "nav.dashboard": { en: "Dashboard", ar: "لوحة التحكم" },
  "nav.bookings": { en: "Consultations & Bookings", ar: "الاستشارات والمواعيد" },
  "nav.cases": { en: "Active Matters", ar: "القضايا والملفات" },
  "nav.clients": { en: "Clients & Retainers", ar: "الموكلون والشركات" },
  "nav.contracts": { en: "Legal Contracts", ar: "العقود والاتفاقيات" },
  "nav.leads": { en: "Retainer Inquiries", ar: "طلبات التمثيل القانوني" },
  "nav.finance": { en: "Financial Ledger", ar: "الإدارة المالية والذمم" },
  "nav.content": { en: "Legal Publications", ar: "المقالات والمنشورات" },
  "nav.settings": { en: "Practice Settings", ar: "إعدادات المكتب" },
  "nav.audit": { en: "Audit Trail", ar: "سجل الرقابة والامتثال" },
  "nav.help": { en: "Counsel Desk & Support", ar: "الدعم المكتبي والاستشاري" },

  // Sidebar sections
  "sidebar.menu": { en: "MENU", ar: "القائمة الرئيسية" },
  "sidebar.general": { en: "GENERAL", ar: "عام" },
  "sidebar.manage_account": { en: "Manage Partner Account", ar: "إدارة حساب الشريك" },
  "sidebar.practice_alerts": { en: "Practice Alerts", ar: "تنبيهات المكتب" },
  "sidebar.practice_dispatch": { en: "Practice Dispatch", ar: "بريد التنبيهات" },
  "sidebar.intake_updates": { en: "Intake & schedule updates", ar: "تحديثات المواعيد والملفات" },
  "sidebar.all_caught_up": { en: "All notices caught up", ar: "تمت مراجعة جميع الإشعارات" },
  "sidebar.sign_out": { en: "Sign Out of Chambers Session", ar: "تسجيل الخروج من الجلسة" },

  // Common UI actions
  "action.new": { en: "New", ar: "جديد" },
  "action.new_consultation": { en: "New Consultation", ar: "حجز موعد استشارة" },
  "action.export": { en: "Export Docket", ar: "تصدير السجل" },
  "action.filter": { en: "Filter", ar: "تصفية" },
  "action.search": { en: "Search docket, matters, clients (⌘K)...", ar: "بحث في القضايا، الموكلين، السجلات (⌘K)..." },
  "action.save": { en: "Save Changes", ar: "حفظ التغييرات" },
  "action.cancel": { en: "Cancel", ar: "إلغاء" },
  "action.confirm": { en: "Confirm", ar: "تأكيد" },
  "action.reset_filters": { en: "Reset Filters", ar: "إعادة ضبط التصفية" },

  // Status badges
  "status.confirmed": { en: "Confirmed", ar: "مؤكد" },
  "status.pending": { en: "Pending Review", ar: "قيد المراجعة" },
  "status.conflict_check": { en: "Conflict Review", ar: "فحص تعارض المصالح" },
  "status.concluded": { en: "Concluded", ar: "مكتملة" },
  "status.active": { en: "Active", ar: "نشط" },
  "status.retainer": { en: "Retainer", ar: "توكيل سنوي" },
  "status.corporate": { en: "Corporate", ar: "شركات" },
  "status.individual": { en: "Individual", ar: "أفراد" },
};

export function getTranslation(key: string, lang: Language = "en"): string {
  if (I18N_DICTIONARY[key]) {
    return I18N_DICTIONARY[key][lang] || I18N_DICTIONARY[key].en;
  }
  return key;
}
