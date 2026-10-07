"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  Booking,
  CaseItem,
  StatItem,
  NotificationItem,
  HearingItem,
  DocumentItem,
  InternalNoteItem,
  INITIAL_BOOKINGS,
  INITIAL_CASES,
  DASHBOARD_STAT_CARDS,
  NOTIFICATIONS,
  UserProfile,
  CURRENT_USER,
} from "@/lib/mock-data";
import { Language, getTranslation } from "@/lib/i18n";

export interface PracticeContextType {
  // Current user profile & avatar state
  currentUser: UserProfile;
  updateUserAvatar: (avatarUrl: string) => void;
  resetUserAvatar: () => void;

  // Navigation & URL state
  activeNav: string;
  setActiveNav: (tab: string) => void;
  activeCardId?: string;
  setActiveCardId: (id: string | undefined) => void;

  // Language & RTL state
  lang: Language;
  dir: "ltr" | "rtl";
  toggleLang: () => void;
  setLang: (lang: Language) => void;
  t: (key: string) => string;

  // Bookings state & operations
  bookings: Booking[];
  addBooking: (booking: {
    name: string;
    caseType: string;
    date: string;
    time: string;
    fee: string;
  }) => void;
  acceptBooking: (id: string) => void;
  declineBooking: (id: string, reason: string) => void;
  rescheduleBooking: (id: string, date: string, time: string, note: string) => void;
  refundBooking: (id: string, reason: string) => void;
  clearConflict: (id: string, waiverNote: string) => void;
  concludeConsultation: (id: string, lawyerNotes: string) => void;

  // Cases state & operations
  cases: CaseItem[];
  selectedCaseId: string | null;
  setSelectedCaseId: (id: string | null) => void;
  addCase: (newCase: {
    title: string;
    clientName: string;
    assignedLawyer: string;
    practiceArea: string;
  }) => void;
  advanceCaseStage: (caseId: string, nextStage: CaseItem["statusStage"]) => void;
  addCaseNote: (caseId: string, content: string, isPrivileged: boolean) => void;
  addCaseHearing: (caseId: string, hearing: HearingItem) => void;
  updateHearingOutcome: (caseId: string, hearingId: string, outcome: string) => void;
  addCaseDocument: (caseId: string, document: DocumentItem) => void;
  toggleCaseDocumentVisibility: (caseId: string, documentId: string) => void;
  updateCaseDocumentStatus: (caseId: string, documentId: string, status: DocumentItem["status"], rejectionReason?: string) => void;
  deleteCaseDocument: (caseId: string, documentId: string) => void;

  // Cross-entity workflow bridge
  openCaseFromConsultation: (clientName: string, notes: string) => void;

  // Dashboard stats & notifications
  stats: StatItem[];
  notifications: NotificationItem[];
  markNotificationsRead: () => void;

  // Toast dispatch
  toastMessage: string | null;
  showToast: (message: string) => void;
}

const PracticeContext = createContext<PracticeContextType | null>(null);

const STORAGE_KEYS = {
  BOOKINGS: "mjl_practice_bookings_v1",
  CASES: "mjl_practice_cases_v1",
  STATS: "mjl_practice_stats_v1",
  NAV: "mjl_practice_active_nav_v1",
  LANG: "mjl_practice_lang_v1",
  CURRENT_USER_AVATAR: "mjl_practice_user_avatar_v1",
};

const emptySubscribe = () => () => {};

export function PracticeProvider({ children }: { children: React.ReactNode }) {
  // Navigation state (hydrated safely via useSyncExternalStore)
  const isClient = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [activeNav, setActiveNavState] = useState<string>("dashboard");
  const [activeCardId, setActiveCardId] = useState<string | undefined>("bookings-today");

  // User profile & avatar state
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);

  const updateUserAvatar = useCallback((newAvatar: string) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, avatar: newAvatar };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER_AVATAR, newAvatar);
        } catch {
          // Fallback if localStorage quota is exceeded
        }
      }
      return updated;
    });
  }, []);

  const resetUserAvatar = useCallback(() => {
    setCurrentUser((prev) => {
      const updated = { ...prev, avatar: CURRENT_USER.avatar };
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_AVATAR);
        } catch {
          // Fallback
        }
      }
      return updated;
    });
  }, []);

  // Language & direction state
  const [lang, setLangState] = useState<Language>("en");
  const dir = lang === "ar" ? "rtl" : "ltr";

  const setLang = useCallback((nextLang: Language) => {
    setLangState(nextLang);
    if (typeof document !== "undefined") {
      document.documentElement.dir = nextLang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = nextLang;
      try {
        localStorage.setItem(STORAGE_KEYS.LANG, nextLang);
      } catch {
        // Fallback
      }
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next: Language = prev === "en" ? "ar" : "en";
      if (typeof document !== "undefined") {
        document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = next;
        try {
          localStorage.setItem(STORAGE_KEYS.LANG, next);
        } catch {
          // Fallback
        }
      }
      return next;
    });
  }, []);

  const t = useCallback((key: string) => getTranslation(key, lang), [lang]);

  // Core collections
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [cases, setCases] = useState<CaseItem[]>(INITIAL_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [stats, setStats] = useState<StatItem[]>(DASHBOARD_STAT_CARDS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    const timer = setTimeout(() => setToastMessage(null), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Hydrate from localStorage asynchronously after client mount
  useEffect(() => {
    if (!isClient) return;

    const timer = setTimeout(() => {
      try {
        const savedLang = localStorage.getItem(STORAGE_KEYS.LANG);
        if (savedLang === "ar" || savedLang === "en") {
          setLangState(savedLang as Language);
          document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
          document.documentElement.lang = savedLang;
        }

        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get("tab");
        if (tabParam) {
          setActiveNavState(tabParam);
        } else {
          const savedNav = localStorage.getItem(STORAGE_KEYS.NAV);
          if (savedNav) setActiveNavState(savedNav);
        }

        const savedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
        if (savedBookings) setBookings(JSON.parse(savedBookings));

        const savedCases = localStorage.getItem(STORAGE_KEYS.CASES);
        if (savedCases) setCases(JSON.parse(savedCases));

        const savedStats = localStorage.getItem(STORAGE_KEYS.STATS);
        if (savedStats) setStats(JSON.parse(savedStats));

        const savedAvatar = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_AVATAR);
        if (savedAvatar && !savedAvatar.includes("photo-1534528741775-53994a69daeb")) {
          setCurrentUser((prev) => ({ ...prev, avatar: savedAvatar }));
        }
      } catch {
        // Fallback for storage errors
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isClient]);

  // Sync activeNav with URL search params and localStorage
  const setActiveNav = useCallback((nextNav: string) => {
    setActiveNavState(nextNav);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.NAV, nextNav);
        const url = new URL(window.location.href);
        url.searchParams.set("tab", nextNav);
        window.history.replaceState({}, "", url.toString());
      } catch {
        // Fallback for isolated frames
      }
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch {
      // quota or private browsing
    }
  }, [bookings]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
    } catch {
      // quota or private browsing
    }
  }, [cases]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch {
      // quota or private browsing
    }
  }, [stats]);

  // Bookings actions
  const addBooking = useCallback(
    (newBookingData: {
      name: string;
      caseType: string;
      date: string;
      time: string;
      fee: string;
    }) => {
      const newBooking: Booking = {
        id: `b-${Date.now()}`,
        clientName: newBookingData.name,
        clientPhone: "+962 7 9000 0000",
        clientEmail: `${newBookingData.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        clientInitials: newBookingData.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        practiceArea: newBookingData.caseType.replace(" Legal Consultation", ""),
        lawyerName: "Tariq Qudah",
        appointmentType: "Video",
        dateTime: `${newBookingData.date} • ${newBookingData.time}`,
        timeSlot: newBookingData.time,
        dateStr: newBookingData.date,
        paymentStatus: "Settled",
        fee: newBookingData.fee,
        status: "Confirmed",
        transactionId: `TX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        notes: "Intake scheduled via Senior Chambers dispatch.",
      };

      setBookings((prev) => [newBooking, ...prev]);

      // Update Dashboard stats
      setStats((prev) =>
        prev.map((s) =>
          s.id === "bookings-today"
            ? {
                ...s,
                value: (parseInt(s.value, 10) + 1).toString(),
                subMetric: `Latest: ${newBookingData.name}`,
              }
            : s
        )
      );

      showToast(`✓ New booking created for ${newBookingData.name}`);
    },
    [showToast]
  );

  const acceptBooking = useCallback(
    (id: string) => {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                status: "Confirmed",
              }
            : b
        )
      );
      showToast("✓ Consultation accepted. Retainer locked in chambers docket.");
    },
    [showToast]
  );

  const declineBooking = useCallback(
    (id: string, reason: string) => {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                status: "Declined",
                paymentStatus: "Refunded",
                notes: `Declined reason: ${reason}`,
              }
            : b
        )
      );
      showToast("Consultation declined. Automated refund receipt dispatched to client.");
    },
    [showToast]
  );

  const rescheduleBooking = useCallback(
    (id: string, date: string, time: string, note: string) => {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                status: "Confirmed",
                dateStr: date,
                timeSlot: time,
                dateTime: `${date} • ${time}`,
                rescheduleDetails: {
                  initiatedBy: "office",
                  requestedDate: date,
                  requestedTime: time,
                  reason: note || "Counsel calendar reallocation",
                  status: "approved",
                },
              }
            : b
        )
      );
      showToast(`✓ Booking rescheduled to ${date} (${time}). Client notified.`);
    },
    [showToast]
  );

  const refundBooking = useCallback(
    (id: string, reason: string) => {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                status: "Cancelled & Refunded",
                paymentStatus: "Refunded",
                notes: `Cancellation refund: ${reason}`,
              }
            : b
        )
      );
      showToast("Booking cancelled & full retainer refunded.");
    },
    [showToast]
  );

  const clearConflict = useCallback(
    (id: string, waiverNote: string) => {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id && b.conflictCheck
            ? {
                ...b,
                conflictCheck: {
                  ...b.conflictCheck,
                  status: "Waived",
                  notes: waiverNote,
                  waivedBy: "Tariq Qudah",
                  waivedAt: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }),
                },
              }
            : b
        )
      );
      showToast("✓ Conflict cleared & waiver entered into privileged file.");
    },
    [showToast]
  );

  const concludeConsultation = useCallback(
    (id: string, lawyerNotes: string) => {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                status: "Confirmed",
                consultationOutcome: {
                  conductedAt: new Date().toISOString(),
                  lawyerNotes,
                  nextStepDecision: "Concluded",
                },
              }
            : b
        )
      );
      showToast("Consultation concluded and archived into completed docket.");
    },
    [showToast]
  );

  // Cases actions
  const addCase = useCallback(
    (newCaseData: {
      title: string;
      clientName: string;
      assignedLawyer: string;
      practiceArea: string;
    }) => {
      const caseNum = `MJL-2026-${Math.floor(100 + Math.random() * 900)}`;
      const createdCase: CaseItem = {
        id: `case-${Date.now()}`,
        caseNumber: caseNum,
        title: newCaseData.title,
        clientName: newCaseData.clientName,
        clientId: `CL-${Math.floor(100 + Math.random() * 900)}`,
        clientPhone: "+962 7 9000 0000",
        clientEmail: `${newCaseData.clientName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        assignedLawyer: newCaseData.assignedLawyer,
        practiceArea: newCaseData.practiceArea,
        statusStage: "Intake",
        lastActivity: "Matter initiated and opened from consultation docket.",
        openedDate: "Oct 7, 2026",
        courtChamber: "Amman Court of First Instance — Commercial Division",
        documents: [],
        internalNotes: [
          {
            id: `note-${Date.now()}`,
            author: newCaseData.assignedLawyer,
            role: "Partner",
            date: "Today at Chambers",
            content: "Formal litigation matter opened following intake review. Verified jurisdiction.",
            isPrivileged: true,
          },
        ],
        hearings: [],
      };

      setCases((prev) => [createdCase, ...prev]);
      setSelectedCaseId(createdCase.id);
      showToast(`✓ Case file ${caseNum} opened for ${newCaseData.clientName}`);
    },
    [showToast]
  );

  const advanceCaseStage = useCallback(
    (caseId: string, nextStage: CaseItem["statusStage"]) => {
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? {
                ...c,
                statusStage: nextStage,
                lastActivity: `Stage updated to ${nextStage} (Client auto-notified via WhatsApp)`,
              }
            : c
        )
      );
      showToast(`✓ Case stage advanced to "${nextStage}". Client notification dispatched.`);
    },
    [showToast]
  );

  const addCaseNote = useCallback(
    (caseId: string, content: string, isPrivileged: boolean) => {
      const newNote: InternalNoteItem = {
        id: `note-${Date.now()}`,
        author: "Tariq Qudah",
        role: "Senior Partner",
        date: "Today at Chambers",
        content,
        isPrivileged,
      };

      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? {
                ...c,
                internalNotes: [newNote, ...c.internalNotes],
                lastActivity: `New privileged note added by Tariq Qudah`,
              }
            : c
        )
      );
      showToast("Privileged attorney work-product note logged.");
    },
    [showToast]
  );

  const addCaseHearing = useCallback(
    (caseId: string, hearing: HearingItem) => {
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? {
                ...c,
                hearings: [...c.hearings, hearing],
                lastActivity: `Hearing scheduled on ${hearing.date} (${hearing.chamber})`,
              }
            : c
        )
      );
      showToast(`✓ Hearing docket entered for ${hearing.date}`);
    },
    [showToast]
  );

  const updateHearingOutcome = useCallback(
    (caseId: string, hearingId: string, outcome: string) => {
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? {
                ...c,
                hearings: c.hearings.map((h) =>
                  h.id === hearingId
                    ? { ...h, outcome, status: "Completed" as const }
                    : h
                ),
                lastActivity: `Hearing outcome recorded: ${outcome.slice(0, 40)}...`,
              }
            : c
        )
      );
      showToast("Hearing outcome logged into official case file.");
    },
    [showToast]
  );

  const addCaseDocument = useCallback(
    (caseId: string, document: DocumentItem) => {
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? {
                ...c,
                documents: [document, ...c.documents],
                lastActivity: `Document "${document.title}" uploaded to vault`,
              }
            : c
        )
      );
      showToast(`✓ Document "${document.title}" sealed into case vault.`);
    },
    [showToast]
  );

  const toggleCaseDocumentVisibility = useCallback(
    (caseId: string, documentId: string) => {
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? {
                ...c,
                documents: c.documents.map((d) =>
                  d.id === documentId
                    ? { ...d, isOfficeVisibleToClient: !d.isOfficeVisibleToClient }
                    : d
                ),
              }
            : c
        )
      );
      showToast("Document client portal visibility updated.");
    },
    [showToast]
  );

  const updateCaseDocumentStatus = useCallback(
    (caseId: string, documentId: string, status: DocumentItem["status"], rejectionReason?: string) => {
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? {
                ...c,
                documents: c.documents.map((d) =>
                  d.id === documentId
                    ? {
                        ...d,
                        status,
                        rejectionReason: rejectionReason ?? (status === "Validated" ? undefined : d.rejectionReason),
                      }
                    : d
                ),
              }
            : c
        )
      );
      showToast(`✓ Document audit status updated to "${status}".`);
    },
    [showToast]
  );

  const deleteCaseDocument = useCallback(
    (caseId: string, documentId: string) => {
      setCases((prev) =>
        prev.map((c) =>
          c.id === caseId
            ? {
                ...c,
                documents: c.documents.filter((d) => d.id !== documentId),
              }
            : c
        )
      );
      showToast("Document removed from case vault.");
    },
    [showToast]
  );

  // Cross-entity workflow bridge: Open Case directly from Booking Consultation
  const openCaseFromConsultation = useCallback(
    (clientName: string, notes: string) => {
      addCase({
        title: notes
          ? `Litigation Matter — ${clientName} (${notes.slice(0, 30)}...)`
          : `Representation & Litigation — ${clientName}`,
        clientName,
        assignedLawyer: "Tariq Qudah",
        practiceArea: "Commercial Litigation",
      });
      // Switch active tab to cases
      setActiveNav("cases");
    },
    [addCase, setActiveNav]
  );

  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return (
    <PracticeContext.Provider
      value={{
        activeNav,
        setActiveNav,
        activeCardId,
        setActiveCardId,
        lang,
        dir,
        toggleLang,
        setLang,
        t,
        bookings,
        addBooking,
        acceptBooking,
        declineBooking,
        rescheduleBooking,
        refundBooking,
        clearConflict,
        concludeConsultation,
        cases,
        selectedCaseId,
        setSelectedCaseId,
        addCase,
        advanceCaseStage,
        addCaseNote,
        addCaseHearing,
        updateHearingOutcome,
        addCaseDocument,
        toggleCaseDocumentVisibility,
        updateCaseDocumentStatus,
        deleteCaseDocument,
        openCaseFromConsultation,
        stats,
        notifications,
        markNotificationsRead,
        toastMessage,
        showToast,
        currentUser,
        updateUserAvatar,
        resetUserAvatar,
      }}
    >
      {children}
    </PracticeContext.Provider>
  );
}

export { PracticeContext };

export function usePractice() {
  const context = useContext(PracticeContext);
  if (!context) {
    throw new Error("usePractice must be used within a PracticeProvider");
  }
  return context;
}
