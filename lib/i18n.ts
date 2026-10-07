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
  "sidebar.sign_out": { en: "Sign Out", ar: "تسجيل الخروج" },

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

  // Authentication & Security Enclave
  "auth.portal_badge": { en: "Restricted Executive Enclave", ar: "بوابة الدخول المحمية للشركاء" },
  "auth.portal_title": { en: "Chambers Portal Access", ar: "تسجيل الدخول إلى نظام المكتب" },
  "auth.portal_subtitle": { en: "Authenticate with your partner credentials or authorized cryptographic key to access client vaults and judicial dockets.", ar: "يرجى تسجيل الدخول باستخدام بيانات الشريك المعتمدة أو مفتاح الأمان للوصول إلى ملفات الموكلين وجلسات المحاكم." },
  "auth.credentials_tab": { en: "Counsel Credentials", ar: "بيانات المحامي" },
  "auth.passkey_tab": { en: "FIDO2 / Hardware Token", ar: "مفتاح أمان مشفر" },
  "auth.quick_fill": { en: "Quick-Fill Partner Profile", ar: "اختيار سريع لملف الشريك" },
  "auth.email_label": { en: "Institutional Email", ar: "البريد الإلكتروني المهني" },
  "auth.email_placeholder": { en: "t.qudah@medjordanlaw.com", ar: "t.qudah@medjordanlaw.com" },
  "auth.password_label": { en: "Master Passphrase", ar: "كلمة المرور الرئيسية" },
  "auth.password_placeholder": { en: "Enter secure passphrase", ar: "أدخل كلمة المرور" },
  "auth.remember_device": { en: "Trust this workstation for 30 days", ar: "حفظ تسجيل الدخول لهذا الجهاز لمدة 30 يوماً" },
  "auth.forgot_password": { en: "Lost Access / Reset Key", ar: "نسيت كلمة المرور؟" },
  "auth.sign_in": { en: "Authenticate & Enter Chambers", ar: "توثيق والدخول إلى النظام" },
  "auth.authenticating": { en: "Verifying Cryptographic Handshake...", ar: "جارٍ التحقق من التشفير والمصادقة..." },
  "auth.caps_lock": { en: "Caps Lock is enabled", ar: "زر الحروف الكبيرة (Caps Lock) مفعّل" },
  "auth.passkey_prompt": { en: "Touch your FIDO2 security token or biometrics scanner to authenticate.", ar: "المس مفتاح الأمان FIDO2 أو مسح البصمة للمتابعة." },
  "auth.scan_passkey": { en: "Initiate Hardware Handshake", ar: "بدء مصادقة المفتاح المشفر" },
  "auth.emergency_title": { en: "Chambers Dispatch & Recovery", ar: "المساعدة واستعادة الدخول" },
  "auth.emergency_body": { en: "Access is strictly monitored under Jordan Bar Association cyber-compliance standards. If locked out, contact the Registrar immediately.", ar: "يخضع الدخول للرقابة الصارمة وفق معايير نقابة المحامين الأردنيين. في حال فقدان الوصول، يرجى التواصل فوراً مع أمانة السر." },
  "auth.emergency_phone": { en: "Registrar Hotline: +962 6 560 8800", ar: "هاتف أمانة السر: 8800 560 6 962+" },
  "auth.jurisdiction_tag": { en: "Amman · Dubai · London", ar: "عمان · دبي · لندن" },
  "auth.court_sync": { en: "Court of Cassation Gateway Connected", ar: "بوابة محكمة التمييز متصلة" },
  "auth.encryption_tier": { en: "AES-256 GCM Hardware Enclave", ar: "تشفير عسكري من الدرجة الأولى" },
};

export function getTranslation(key: string, lang: Language = "en"): string {
  if (I18N_DICTIONARY[key]) {
    return I18N_DICTIONARY[key][lang] || I18N_DICTIONARY[key].en;
  }
  return key;
}
