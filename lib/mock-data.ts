export interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
  href: string;
}

export interface StatItem {
  id: string;
  title: string;
  value: string;
  trendText: string;
  trendValue?: string;
  isAccentDark?: boolean;
  accentColor?: string;
  subMetric?: string;
}

export interface DayBarData {
  day: string;
  fullDay: string;
  bookings: number;
  heightPercent: number;
  isActive?: boolean;
  activeLabel?: string;
}

export interface RecentBookingItem {
  id: string;
  name: string;
  caseType: string;
  avatarUrl?: string;
  avatarBg: string;
  initials: string;
  timeAgo: string;
  status: "Completed" | "In Progress" | "Pending";
  retainerAmount: string;
}

export interface MatterItem {
  id: string;
  title: string;
  dueDate: string;
  category: "Commercial" | "Real Estate" | "Patent & IP" | "Employment" | "Arbitration";
  color: string;
  progress: number;
  isCompleted?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  category: "calendar" | "matter" | "billing";
}

// ==========================================
// EXPANDED DATA CONTRACTS FOR PRACTICE JOURNEY
// ==========================================

export interface NeedsAttentionItem {
  id: string;
  category: "booking_acceptance" | "rejected_document" | "stalled_reschedule";
  title: string;
  subtitle: string;
  timestamp: string;
  urgency: "high" | "medium" | "low";
  relatedId?: string;
  details?: Record<string, unknown>;
}

export interface UpcomingConsultationItem {
  id: string;
  clientName: string;
  clientAvatar?: string;
  clientInitials: string;
  lawyerName: string;
  type: "Video" | "Phone" | "In-Person";
  time: string;
  countdown: string;
  practiceArea: string;
  meetingLink?: string;
  location?: string;
}

export interface ConflictCheckItem {
  status: "Clean" | "Potential Conflict" | "Waived" | "Declined Apology";
  opposingParty?: string;
  conflictType?: "Adverse Representation" | "Prior Client in Same Matter" | "Industry Competitor" | "None";
  matchedEntity?: string;
  riskSeverity?: "High" | "Medium" | "Low" | "None";
  notes?: string;
  waivedBy?: string;
  waivedAt?: string;
}

export interface ConsultationOutcome {
  conductedAt?: string;
  lawyerNotes?: string;
  clientObjectives?: string;
  nextStepDecision?: "Open Case" | "Fee Contract" | "Concluded";
  generatedCaseId?: string;
  generatedContractId?: string;
}

export interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAvatar?: string;
  clientInitials: string;
  practiceArea: string;
  lawyerName: string;
  appointmentType: "Video" | "Phone" | "In-Person";
  dateTime: string;
  timeSlot: string;
  dateStr: string;
  paymentStatus: "Settled" | "Pending" | "Refunded";
  fee: string;
  status: "Awaiting Acceptance" | "Confirmed" | "Reschedule Requested" | "Declined" | "Cancelled & Refunded";
  notes?: string;
  signedAgreementName?: string;
  conflictCheck?: ConflictCheckItem;
  consultationOutcome?: ConsultationOutcome;
  rescheduleDetails?: {
    initiatedBy: "client" | "office";
    requestedDate: string;
    requestedTime: string;
    reason: string;
    status: "pending_review" | "approved" | "countered";
  };
  transactionId: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  type: "Client Upload" | "Office Upload";
  uploadDate: string;
  size: string;
  status: "Validated" | "Rejected" | "Pending";
  rejectionReason?: string;
  isOfficeVisibleToClient: boolean;
}

export interface InternalNoteItem {
  id: string;
  author: string;
  role: string;
  date: string;
  content: string;
  isPrivileged: boolean;
}

export interface HearingItem {
  id: string;
  date: string;
  time: string;
  chamber: string;
  judge: string;
  remindersSent: boolean;
  reminderTimestamp?: string;
  outcome?: string;
  status: "Upcoming" | "Completed";
}

export interface CaseItem {
  id: string;
  caseNumber: string;
  title: string;
  clientName: string;
  clientId: string;
  clientPhone: string;
  clientEmail: string;
  assignedLawyer: string;
  practiceArea: string;
  statusStage: "Intake" | "Discovery" | "Pleadings" | "Hearings" | "Settlement" | "Closed";
  lastActivity: string;
  openedDate: string;
  courtChamber: string;
  documents: DocumentItem[];
  internalNotes: InternalNoteItem[];
  hearings: HearingItem[];
}

export interface SignedAgreementItem {
  id: string;
  title: string;
  signedDate: string;
  bookingId: string;
  pdfName: string;
  deliveredViaWhatsApp: boolean;
  deliveryTimestamp: string;
  deliveryReceipt: "Delivered" | "Read";
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: string;
  service: string;
  status: "Paid via Gateway" | "Pending" | "Refunded";
  gatewayRef: string;
}

export interface MessageLogItem {
  id: string;
  timestamp: string;
  channel: "WhatsApp" | "SMS" | "Email";
  type: "Booking Confirmation" | "Reschedule Notice" | "Signed PDF Delivery" | "Hearing Reminder" | "Payment Receipt";
  message: string;
  status: "Delivered" | "Read" | "Sent";
}

export interface FeeContractItem {
  id: string;
  contractNumber: string;
  clientName: string;
  clientId: string;
  clientPhone: string;
  clientEmail: string;
  assignedLawyer: string;
  practiceArea: string;
  templateType: "Litigation Retainer" | "Corporate General Counsel" | "Arbitration Agreement" | "Custom Upload";
  totalFee: string;
  retainerDeposit: string;
  paymentMilestones: {
    description: string;
    amount: string;
    dueTrigger: string;
  }[];
  status: "Draft" | "Sent for Signature" | "Viewed by Client" | "Amendment Requested" | "Signed by Client" | "Countersigned & Executed";
  sentDate?: string;
  signedDate?: string;
  clientSignature?: {
    signatoryName: string;
    signatureType: "drawn" | "typed";
    ipAddress: string;
    timestamp: string;
    docHashSha256: string;
  };
  countersignedBy?: string;
  countersignedAt?: string;
  pdfUrl?: string;
  amendmentNotes?: string;
}

export interface ContactLeadItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  practiceArea: string;
  message: string;
  submittedAt: string;
  status: "New" | "Contacted" | "Consultation Scheduled" | "Archived";
  turnstileVerified: boolean;
  notes?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: "VIEW_DOCUMENT" | "DOWNLOAD_DOCUMENT" | "UPLOAD_DOCUMENT" | "ISSUE_REFUND" | "RESCHEDULE_BOOKING" | "CLEAR_CONFLICT" | "EXECUTE_CONTRACT" | "MODIFY_SETTINGS";
  resourceType: "Document" | "Booking" | "Case" | "Finance" | "Settings" | "Contract";
  resourceId: string;
  resourceDetails: string;
  ipAddress: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  nationalId: string;
  avatar?: string;
  initials: string;
  activeCasesCount: number;
  lifetimeBookingsCount: number;
  totalBilled: string;
  joinedDate: string;
  status: "Active" | "Retained" | "Prospective";
  bookings: Booking[];
  linkedCases: CaseItem[];
  signedAgreements: SignedAgreementItem[];
  invoices: InvoiceItem[];
  messageLog: MessageLogItem[];
}

export interface FinanceTransaction {
  id: string;
  txnRef: string;
  clientName: string;
  clientAvatar?: string;
  clientInitials: string;
  lawyerName: string;
  service: string;
  date: string;
  time: string;
  grossAmount: number;
  gatewayFee: number;
  netAmount: number;
  paymentMethod: "Apple Pay" | "Visa / MC" | "CliQ / Bank Transfer";
  status: "Settled" | "Refunded" | "Partially Refunded" | "Pending";
  refundDate?: string;
  refundReason?: string;
}

export interface ArticleItem {
  id: string;
  title_en: string;
  title_ar: string;
  slug: string;
  excerpt_en: string;
  excerpt_ar: string;
  content_en: string;
  content_ar: string;
  practiceArea: string;
  author: string;
  status: "Published" | "Draft" | "Scheduled";
  views: number;
  lastUpdated: string;
  readTime: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: "Senior Partner" | "Partner" | "Senior Associate" | "Paralegal" | "Billing Officer";
  email: string;
  avatar?: string;
  twoFactorEnabled: boolean;
  activeCases: number;
}

export interface LawyerProfile {
  id: string;
  name: string;
  title: string;
  licenseNo: string;
  hourlyFee: number;
  consultationFee: number;
  practiceAreas: string[];
  active: boolean;
}

export interface OfficeSettings {
  team: TeamMember[];
  practiceAreas: string[];
  lawyerProfiles: LawyerProfile[];
  bookingPolicy: {
    minNoticeHours: number;
    maxReschedules: number;
    refundTier1Hours: number;
    refundTier1Percent: number;
    refundTier2Hours: number;
    refundTier2Percent: number;
    autoAcceptance: boolean;
  };
}

// ==========================================
// NAVIGATION MENUS
// ==========================================

export const NAV_MENU_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", href: "#" },
  { id: "bookings", label: "Bookings", icon: "Calendar", badge: "2 New", href: "#" },
  { id: "cases", label: "Cases & documents", icon: "Briefcase", badge: "28", href: "#" },
  { id: "clients", label: "Clients", icon: "Users", href: "#" },
  { id: "contracts", label: "Fee Contracts", icon: "FileCheck", badge: "8 Active", href: "#" },
  { id: "leads", label: "Inquiries & Leads", icon: "Mail", badge: "3 New", href: "#" },
  { id: "finance", label: "Finance", icon: "Wallet", href: "#" },
  { id: "content", label: "Content", icon: "FileText", href: "#" },
];

export const NAV_GENERAL_ITEMS: NavItem[] = [
  { id: "settings", label: "Settings", icon: "Settings", href: "#" },
  { id: "audit", label: "Audit Trail", icon: "ShieldAlert", href: "#" },
  { id: "help", label: "Help", icon: "HelpCircle", href: "#" },
  { id: "logout", label: "Logout", icon: "LogOut", href: "#" },
];

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export const CURRENT_USER: UserProfile = {
  name: "Tariq Qudah",
  email: "t.qudah@medjordanlaw.com",
  role: "Senior Partner",
  avatar: "/avatars/tariq-qudah.jpg",
};

// ==========================================
// DASHBOARD DATA SPECIFICATIONS
// ==========================================

export const DASHBOARD_STAT_CARDS: StatItem[] = [
  {
    id: "bookings-today",
    title: "Bookings Today",
    value: "6",
    trendText: "vs yesterday",
    trendValue: "+2",
    isAccentDark: true,
    subMetric: "2 awaiting acceptance",
  },
  {
    id: "total-clients",
    title: "Clients",
    value: "184",
    trendText: "this month",
    trendValue: "+14",
    isAccentDark: false,
    accentColor: "#3D5390",
    subMetric: "92 corporate groups",
  },
  {
    id: "open-cases",
    title: "Open Cases",
    value: "28",
    trendText: "this week",
    trendValue: "4 Hearings",
    isAccentDark: false,
    accentColor: "#2F9E6E",
    subMetric: "3 in pleading stage",
  },
  {
    id: "pending-approval",
    title: "Pending Approval",
    value: "4",
    trendText: "requires review",
    trendValue: "Urgent",
    isAccentDark: false,
    accentColor: "#E0A030",
    subMetric: "2 bookings · 2 rejected docs",
  },
];

// Preserved for backwards compatibility
export const STAT_CARDS: StatItem[] = DASHBOARD_STAT_CARDS;

export const UPCOMING_CONSULTATIONS: UpcomingConsultationItem[] = [
  {
    id: "c1",
    clientName: "Sara Odeh",
    clientInitials: "SO",
    clientAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256",
    lawyerName: "Tariq Qudah",
    type: "Video",
    time: "02:00 PM – 03:00 PM",
    countdown: "Starts in 24m",
    practiceArea: "Commercial Retainer Review",
    meetingLink: "https://meet.google.com/mjl-odeh-rev",
  },
  {
    id: "c2",
    clientName: "Omar Masri",
    clientInitials: "OM",
    lawyerName: "Sara Al-Majali",
    type: "In-Person",
    time: "03:30 PM – 04:30 PM",
    countdown: "Today at 3:30 PM",
    practiceArea: "Real Estate Acquisition Deeds",
    location: "Conference Room A (Amman HQ)",
  },
  {
    id: "c3",
    clientName: "Dr. Fadi Haddad",
    clientInitials: "FH",
    lawyerName: "Kareem Masri",
    type: "Phone",
    time: "05:00 PM – 05:45 PM",
    countdown: "Today at 5:00 PM",
    practiceArea: "IP Patent Portfolio Registration",
  },
  {
    id: "c4",
    clientName: "Reem Al-Khatib",
    clientInitials: "RK",
    lawyerName: "Tariq Qudah",
    type: "Video",
    time: "Tomorrow at 10:00 AM",
    countdown: "Tomorrow",
    practiceArea: "Cross-Border Arbitration Clause",
    meetingLink: "https://meet.google.com/mjl-khatib-arb",
  },
];

export const NEEDS_ATTENTION_ITEMS: NeedsAttentionItem[] = [
  {
    id: "na-1",
    category: "booking_acceptance",
    title: "Incoming Booking Awaiting Acceptance",
    subtitle: "Zaid Nabulsi requested Corporate Structuring with Tariq Qudah (Video · $180 Settled)",
    timestamp: "18m ago",
    urgency: "high",
    relatedId: "b-101",
  },
  {
    id: "na-2",
    category: "rejected_document",
    title: "Document Rejected: Commercial Register Extract",
    subtitle: "Case MJL-2026-089 (Al-Manar Logistics) — Reason: Ministry stamp illegible & expired extract (>90 days)",
    timestamp: "1h ago",
    urgency: "high",
    relatedId: "doc-902",
  },
  {
    id: "na-3",
    category: "stalled_reschedule",
    title: "Client-Initiated Reschedule Pending Confirmation",
    subtitle: "Layla Al-Husseini proposed moving consultation from Oct 7 11:00 AM to Oct 9 02:00 PM",
    timestamp: "3h ago",
    urgency: "medium",
    relatedId: "b-102",
  },
  {
    id: "na-4",
    category: "rejected_document",
    title: "Document Rejected: Power of Attorney Scan",
    subtitle: "Case MJL-2026-042 (Nour Abbadi) — Reason: Missing official notary stamp on page 3",
    timestamp: "5h ago",
    urgency: "medium",
    relatedId: "doc-904",
  },
];

// ==========================================
// BOOKINGS ROSTER & DATA
// ==========================================

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "b-101",
    clientName: "Zaid Nabulsi",
    clientPhone: "+962 7 9554 1122",
    clientEmail: "z.nabulsi@nabulsitrading.jo",
    clientInitials: "ZN",
    practiceArea: "Corporate & M&A",
    lawyerName: "Tariq Qudah",
    appointmentType: "Video",
    dateTime: "Oct 8, 2026 at 11:00 AM",
    timeSlot: "11:00 AM - 12:00 PM",
    dateStr: "2026-10-08",
    paymentStatus: "Settled",
    fee: "$180.00",
    status: "Awaiting Acceptance",
    signedAgreementName: "MJL_Consultation_Agreement_ZaidNabulsi.pdf",
    conflictCheck: {
      status: "Potential Conflict",
      opposingParty: "Al-Manar Logistics Ltd.",
      conflictType: "Adverse Representation",
      matchedEntity: "Al-Manar Logistics (Active Matter MJL-2026-089)",
      riskSeverity: "High",
      notes: "Opposing party in ongoing Amman Court of Appeal concession dispute. Ethical wall or formal waiver required before triage.",
    },
    notes: "Review of proposed share purchase agreement for new logistics acquisition.",
    transactionId: "TXN-90214-HP",
  },
  {
    id: "b-102",
    clientName: "Layla Al-Husseini",
    clientPhone: "+962 7 9882 3344",
    clientEmail: "layla@husseini-holdings.com",
    clientInitials: "LH",
    practiceArea: "Commercial Contracts",
    lawyerName: "Sara Al-Majali",
    appointmentType: "In-Person",
    dateTime: "Oct 7, 2026 at 02:00 PM",
    timeSlot: "02:00 PM - 03:00 PM",
    dateStr: "2026-10-07",
    paymentStatus: "Settled",
    fee: "$150.00",
    status: "Reschedule Requested",
    signedAgreementName: "MJL_Consultation_Agreement_LaylaHusseini.pdf",
    conflictCheck: {
      status: "Clean",
      opposingParty: "None / Internal Shareholder Restructuring",
      conflictType: "None",
      riskSeverity: "None",
    },
    notes: "Client requested moving date due to board meeting conflict.",
    rescheduleDetails: {
      initiatedBy: "client",
      requestedDate: "Oct 9, 2026",
      requestedTime: "02:00 PM",
      reason: "Urgent board meeting in Dubai on Oct 7.",
      status: "pending_review",
    },
    transactionId: "TXN-89412-HP",
  },
  {
    id: "b-103",
    clientName: "Sara Odeh",
    clientPhone: "+962 7 9123 4567",
    clientEmail: "sara@odehgroup.com",
    clientAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256",
    clientInitials: "SO",
    practiceArea: "Commercial Retainer Review",
    lawyerName: "Tariq Qudah",
    appointmentType: "Video",
    dateTime: "Today, Oct 6 at 02:00 PM",
    timeSlot: "02:00 PM - 03:00 PM",
    dateStr: "2026-10-06",
    paymentStatus: "Settled",
    fee: "$250.00",
    status: "Confirmed",
    signedAgreementName: "MJL_Consultation_Agreement_SaraOdeh.pdf",
    conflictCheck: {
      status: "Waived",
      opposingParty: "Odeh Family Holding Trust",
      conflictType: "Prior Client in Same Matter",
      matchedEntity: "Sara Odeh (Matter MJL-2026-042)",
      riskSeverity: "Low",
      waivedBy: "Tariq Qudah",
      waivedAt: "Oct 5, 2026",
      notes: "Dual corporate representation permitted under JBA Ethics Code Art. 24.",
    },
    notes: "Annual legal audit and retainer expansion across 3 subsidiaries.",
    transactionId: "TXN-88102-HP",
  },
  {
    id: "b-104",
    clientName: "Omar Masri",
    clientPhone: "+962 7 9444 8899",
    clientEmail: "omar@masri-invest.jo",
    clientInitials: "OM",
    practiceArea: "Real Estate & Land Registry",
    lawyerName: "Sara Al-Majali",
    appointmentType: "In-Person",
    dateTime: "Today, Oct 6 at 03:30 PM",
    timeSlot: "03:30 PM - 04:30 PM",
    dateStr: "2026-10-06",
    paymentStatus: "Settled",
    fee: "$150.00",
    status: "Confirmed",
    signedAgreementName: "MJL_Consultation_Agreement_OmarMasri.pdf",
    conflictCheck: {
      status: "Clean",
      opposingParty: "Amman Land Registry Directorate",
      conflictType: "None",
      riskSeverity: "None",
    },
    notes: "Review title deed restrictions on Abdoun Commercial Parcel.",
    transactionId: "TXN-87654-HP",
  },
  {
    id: "b-105",
    clientName: "Dr. Fadi Haddad",
    clientPhone: "+962 7 9333 7711",
    clientEmail: "dr.fadi@haddad-health.jo",
    clientInitials: "FH",
    practiceArea: "IP & Trademark Portfolio",
    lawyerName: "Kareem Masri",
    appointmentType: "Phone",
    dateTime: "Today, Oct 6 at 05:00 PM",
    timeSlot: "05:00 PM - 05:45 PM",
    dateStr: "2026-10-06",
    paymentStatus: "Settled",
    fee: "$120.00",
    status: "Confirmed",
    signedAgreementName: "MJL_Consultation_Agreement_FadiHaddad.pdf",
    conflictCheck: {
      status: "Clean",
      opposingParty: "None / WIPO Regional Filing",
      conflictType: "None",
      riskSeverity: "None",
    },
    notes: "GCC trademark expansion strategy for pharmaceuticals.",
    transactionId: "TXN-86921-HP",
  },
  {
    id: "b-106",
    clientName: "Tariq Barakat",
    clientPhone: "+962 7 9666 4433",
    clientEmail: "barakat@barakat-group.jo",
    clientInitials: "TB",
    practiceArea: "Commercial Arbitration",
    lawyerName: "Tariq Qudah",
    appointmentType: "Video",
    dateTime: "Oct 5, 2026 at 10:00 AM",
    timeSlot: "10:00 AM - 11:00 AM",
    dateStr: "2026-10-05",
    paymentStatus: "Refunded",
    fee: "$180.00",
    status: "Cancelled & Refunded",
    signedAgreementName: "MJL_Consultation_Agreement_TariqBarakat.pdf",
    conflictCheck: {
      status: "Clean",
      opposingParty: "None",
      conflictType: "None",
      riskSeverity: "None",
    },
    notes: "Client cancelled >48h before scheduled session. Full refund processed via gateway.",
    transactionId: "TXN-85110-HP",
  },
];

// ==========================================
// CASES & DOCUMENTS WORKSPACE
// ==========================================

export const INITIAL_CASES: CaseItem[] = [
  {
    id: "case-1",
    caseNumber: "MJL-2026-089",
    title: "Al-Manar Logistics vs. Port Authority Breach of Concession",
    clientName: "Al-Manar Logistics Ltd.",
    clientId: "cl-1",
    clientPhone: "+962 7 9554 1122",
    clientEmail: "legal@almanar-logistics.jo",
    assignedLawyer: "Tariq Qudah",
    practiceArea: "Commercial Litigation & Arbitration",
    statusStage: "Hearings",
    lastActivity: "Hearing outcome logged 2 hours ago",
    openedDate: "Aug 14, 2026",
    courtChamber: "Amman Court of Appeal - Commercial Chamber 3",
    documents: [
      {
        id: "doc-1",
        title: "Signed Consultation Retainer Agreement",
        type: "Client Upload",
        uploadDate: "Aug 14, 2026",
        size: "1.4 MB",
        status: "Validated",
        isOfficeVisibleToClient: true,
      },
      {
        id: "doc-2",
        title: "Commercial Register & Authorization Extract",
        type: "Client Upload",
        uploadDate: "Oct 6, 2026",
        size: "3.2 MB",
        status: "Rejected",
        rejectionReason: "Ministry stamp illegible & expired extract (>90 days old). Please upload a current Ministry of Industry certified copy.",
        isOfficeVisibleToClient: true,
      },
      {
        id: "doc-3",
        title: "Statement of Claim & Factual Memoranda (Amman Court)",
        type: "Office Upload",
        uploadDate: "Sep 28, 2026",
        size: "4.8 MB",
        status: "Validated",
        isOfficeVisibleToClient: true,
      },
      {
        id: "doc-4",
        title: "Expert Financial Assessment - Damage Calculation",
        type: "Office Upload",
        uploadDate: "Oct 2, 2026",
        size: "8.1 MB",
        status: "Validated",
        isOfficeVisibleToClient: true,
      },
    ],
    internalNotes: [
      {
        id: "note-1",
        author: "Tariq Qudah",
        role: "Senior Partner",
        date: "Oct 6, 2026 at 10:15 AM",
        content: "Strategy note: Opposite counsel attempted to introduce late customs manifests. We objected under Civil Procedure Code Art. 112. Judge agreed and gave them 7 days strictly to substantiate.",
        isPrivileged: true,
      },
      {
        id: "note-2",
        author: "Layla Haddad",
        role: "Paralegal",
        date: "Sep 29, 2026 at 04:30 PM",
        content: "Verified court docket stamps with clerk. Filing receipt attached in internal archive box #4.",
        isPrivileged: true,
      },
    ],
    hearings: [
      {
        id: "h-1",
        date: "Nov 12, 2026",
        time: "10:30 AM",
        chamber: "Amman Court of Appeal, Chamber 3",
        judge: "Hon. Judge Ziad Al-Khasawneh",
        remindersSent: true,
        reminderTimestamp: "Scheduled for Nov 10, 09:00 AM via WhatsApp",
        status: "Upcoming",
      },
      {
        id: "h-2",
        date: "Oct 6, 2026",
        time: "10:00 AM",
        chamber: "Amman Court of Appeal, Chamber 3",
        judge: "Hon. Judge Ziad Al-Khasawneh",
        remindersSent: true,
        outcome: "Opposing party given final 7-day grace period to respond to expert claim. Adjourned to Nov 12.",
        status: "Completed",
      },
    ],
  },
  {
    id: "case-2",
    caseNumber: "MJL-2026-042",
    title: "Odeh Industrial Group Shareholder Restructuring & Cross-Border Holding",
    clientName: "Sara Odeh (Odeh Industrial Group)",
    clientId: "cl-2",
    clientPhone: "+962 7 9123 4567",
    clientEmail: "sara@odehgroup.com",
    assignedLawyer: "Tariq Qudah",
    practiceArea: "Corporate & M&A",
    statusStage: "Pleadings",
    lastActivity: "New draft memorandum added yesterday",
    openedDate: "Sep 01, 2026",
    courtChamber: "Companies Controller Directorate (CCD)",
    documents: [
      {
        id: "doc-201",
        title: "Signed Retainer & Power of Attorney",
        type: "Client Upload",
        uploadDate: "Sep 02, 2026",
        size: "2.1 MB",
        status: "Validated",
        isOfficeVisibleToClient: true,
      },
      {
        id: "doc-202",
        title: "Draft Restructuring Articles of Association",
        type: "Office Upload",
        uploadDate: "Oct 4, 2026",
        size: "3.7 MB",
        status: "Validated",
        isOfficeVisibleToClient: true,
      },
      {
        id: "doc-203",
        title: "Tax Clearance Certificate 2025",
        type: "Client Upload",
        uploadDate: "Oct 5, 2026",
        size: "1.1 MB",
        status: "Validated",
        isOfficeVisibleToClient: true,
      },
    ],
    internalNotes: [
      {
        id: "note-201",
        author: "Sara Al-Majali",
        role: "Partner",
        date: "Oct 4, 2026 at 02:20 PM",
        content: "Tax advisor reviewed transfer pricing risk. Structure approved subject to Article 8 clause modification.",
        isPrivileged: true,
      },
    ],
    hearings: [
      {
        id: "h-201",
        date: "Oct 22, 2026",
        time: "11:00 AM",
        chamber: "Companies Controller Hearing Room B",
        judge: "Director of Legal Affairs, CCD",
        remindersSent: true,
        reminderTimestamp: "WhatsApp scheduled 48h prior",
        status: "Upcoming",
      },
    ],
  },
  {
    id: "case-3",
    caseNumber: "MJL-2026-061",
    title: "Masri Real Estate Development vs. Al-Quds Engineering",
    clientName: "Omar Masri",
    clientId: "cl-3",
    clientPhone: "+962 7 9444 8899",
    clientEmail: "omar@masri-invest.jo",
    assignedLawyer: "Sara Al-Majali",
    practiceArea: "Real Estate & Construction",
    statusStage: "Discovery",
    lastActivity: "Discovery requests served 3 days ago",
    openedDate: "Aug 20, 2026",
    courtChamber: "Amman Court of First Instance",
    documents: [
      {
        id: "doc-301",
        title: "FIDIC Construction Contract Agreement",
        type: "Client Upload",
        uploadDate: "Aug 22, 2026",
        size: "5.4 MB",
        status: "Validated",
        isOfficeVisibleToClient: true,
      },
    ],
    internalNotes: [
      {
        id: "note-301",
        author: "Sara Al-Majali",
        role: "Partner",
        date: "Aug 25, 2026 at 11:00 AM",
        content: "Critical delay penalty clause verified. Contractor exceeded baseline completion by 114 calendar days.",
        isPrivileged: true,
      },
    ],
    hearings: [
      {
        id: "h-301",
        date: "Nov 04, 2026",
        time: "09:30 AM",
        chamber: "Amman Court of First Instance - Chamber 5",
        judge: "Hon. Judge Mamdouh Al-Rawashdeh",
        remindersSent: false,
        status: "Upcoming",
      },
    ],
  },
];

// ==========================================
// CLIENTS ROSTER (ACCOUNT LAYER)
// ==========================================

export const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: "cl-1",
    name: "Al-Manar Logistics Ltd.",
    email: "legal@almanar-logistics.jo",
    phone: "+962 7 9554 1122",
    company: "Al-Manar Logistics Group",
    nationalId: "2001948819",
    initials: "ML",
    activeCasesCount: 1,
    lifetimeBookingsCount: 4,
    totalBilled: "$14,800.00",
    joinedDate: "Jan 12, 2025",
    status: "Retained",
    bookings: [
      INITIAL_BOOKINGS[0],
    ],
    linkedCases: [
      INITIAL_CASES[0],
    ],
    signedAgreements: [
      {
        id: "sa-1",
        title: "General Legal Counsel & Litigation Retainer 2026",
        signedDate: "Aug 14, 2026 at 14:22",
        bookingId: "b-092",
        pdfName: "MJL_Agreement_AlManar_Signed.pdf",
        deliveredViaWhatsApp: true,
        deliveryTimestamp: "Aug 14, 2026 at 14:23",
        deliveryReceipt: "Read",
      },
    ],
    invoices: [
      {
        id: "inv-101",
        invoiceNumber: "INV-2026-081",
        date: "Aug 14, 2026",
        amount: "$5,000.00",
        service: "Initial Litigation Retainer Deposit",
        status: "Paid via Gateway",
        gatewayRef: "HP-881920-AM",
      },
      {
        id: "inv-102",
        invoiceNumber: "INV-2026-094",
        date: "Sep 28, 2026",
        amount: "$9,800.00",
        service: "Court Filing & Expert Testimony Retainer",
        status: "Paid via Gateway",
        gatewayRef: "HP-891042-AM",
      },
    ],
    messageLog: [
      {
        id: "msg-1",
        timestamp: "Oct 6, 2026 at 11:15 AM",
        channel: "WhatsApp",
        type: "Hearing Reminder",
        message: "MJL Notice: Your hearing for case MJL-2026-089 was completed this morning. Outcome: Adjourned to Nov 12.",
        status: "Read",
      },
      {
        id: "msg-2",
        timestamp: "Oct 6, 2026 at 09:10 AM",
        channel: "WhatsApp",
        type: "Signed PDF Delivery",
        message: "MJL Document Vault: Document 'Commercial Register Extract' requires re-upload. Stamp illegible.",
        status: "Read",
      },
      {
        id: "msg-3",
        timestamp: "Aug 14, 2026 at 14:23",
        channel: "WhatsApp",
        type: "Signed PDF Delivery",
        message: "Med Jordan Law: Your signed consultation agreement (PDF) has been executed. Download: mjl.jo/d/sa-1",
        status: "Read",
      },
      {
        id: "msg-4",
        timestamp: "Aug 14, 2026 at 14:21",
        channel: "SMS",
        type: "Booking Confirmation",
        message: "Booking Confirmed: Initial retainer session with Tariq Qudah scheduled for Aug 14 at 15:00.",
        status: "Delivered",
      },
    ],
  },
  {
    id: "cl-2",
    name: "Sara Odeh",
    email: "sara@odehgroup.com",
    phone: "+962 7 9123 4567",
    company: "Odeh Industrial & Commercial Group",
    nationalId: "9821039941",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256",
    initials: "SO",
    activeCasesCount: 1,
    lifetimeBookingsCount: 6,
    totalBilled: "$24,500.00",
    joinedDate: "Mar 04, 2024",
    status: "Retained",
    bookings: [
      INITIAL_BOOKINGS[2],
    ],
    linkedCases: [
      INITIAL_CASES[1],
    ],
    signedAgreements: [
      {
        id: "sa-2",
        title: "Corporate Advisory & Restructuring Agreement",
        signedDate: "Sep 01, 2026 at 11:05",
        bookingId: "b-088",
        pdfName: "MJL_Agreement_OdehGroup_Signed.pdf",
        deliveredViaWhatsApp: true,
        deliveryTimestamp: "Sep 01, 2026 at 11:06",
        deliveryReceipt: "Read",
      },
    ],
    invoices: [
      {
        id: "inv-201",
        invoiceNumber: "INV-2026-072",
        date: "Sep 01, 2026",
        amount: "$14,500.00",
        service: "Corporate Restructuring Phase 1 Retainer",
        status: "Paid via Gateway",
        gatewayRef: "HP-771892-OD",
      },
      {
        id: "inv-202",
        invoiceNumber: "INV-2026-099",
        date: "Today, Oct 6",
        amount: "$250.00",
        service: "Follow-up Consultation Fee",
        status: "Paid via Gateway",
        gatewayRef: "HP-88102-HP",
      },
    ],
    messageLog: [
      {
        id: "msg-201",
        timestamp: "Today at 01:36 PM",
        channel: "WhatsApp",
        type: "Booking Confirmation",
        message: "Reminder: Your video consultation with Tariq Qudah starts at 02:00 PM. Direct link: meet.google.com/mjl-odeh-rev",
        status: "Read",
      },
      {
        id: "msg-202",
        timestamp: "Sep 01, 2026 at 11:06",
        channel: "WhatsApp",
        type: "Signed PDF Delivery",
        message: "Med Jordan Law: Executed Retainer Agreement delivered. File: mjl.jo/d/sa-2",
        status: "Read",
      },
    ],
  },
  {
    id: "cl-3",
    name: "Omar Masri",
    email: "omar@masri-invest.jo",
    phone: "+962 7 9444 8899",
    company: "Masri Real Estate Investments",
    nationalId: "9781002931",
    initials: "OM",
    activeCasesCount: 1,
    lifetimeBookingsCount: 3,
    totalBilled: "$8,650.00",
    joinedDate: "Jun 18, 2025",
    status: "Active",
    bookings: [
      INITIAL_BOOKINGS[3],
    ],
    linkedCases: [
      INITIAL_CASES[2],
    ],
    signedAgreements: [
      {
        id: "sa-3",
        title: "Construction Litigation Retainer Agreement",
        signedDate: "Aug 20, 2026 at 09:30",
        bookingId: "b-077",
        pdfName: "MJL_Agreement_OmarMasri_Signed.pdf",
        deliveredViaWhatsApp: true,
        deliveryTimestamp: "Aug 20, 2026 at 09:31",
        deliveryReceipt: "Read",
      },
    ],
    invoices: [
      {
        id: "inv-301",
        invoiceNumber: "INV-2026-064",
        date: "Aug 20, 2026",
        amount: "$8,500.00",
        service: "FIDIC Dispute Representation",
        status: "Paid via Gateway",
        gatewayRef: "HP-664411-OM",
      },
      {
        id: "inv-302",
        invoiceNumber: "INV-2026-103",
        date: "Today, Oct 6",
        amount: "$150.00",
        service: "In-Person Consultation Fee",
        status: "Paid via Gateway",
        gatewayRef: "HP-87654-HP",
      },
    ],
    messageLog: [
      {
        id: "msg-301",
        timestamp: "Today at 02:00 PM",
        channel: "SMS",
        type: "Booking Confirmation",
        message: "Reminder: In-person consultation with Sara Al-Majali today at 03:30 PM at Med Jordan Law HQ.",
        status: "Delivered",
      },
    ],
  },
  {
    id: "cl-4",
    name: "Layla Al-Husseini",
    email: "layla@husseini-holdings.com",
    phone: "+962 7 9882 3344",
    company: "Husseini Global Holdings",
    nationalId: "9912049102",
    initials: "LH",
    activeCasesCount: 0,
    lifetimeBookingsCount: 2,
    totalBilled: "$4,350.00",
    joinedDate: "Feb 10, 2026",
    status: "Prospective",
    bookings: [
      INITIAL_BOOKINGS[1],
    ],
    linkedCases: [],
    signedAgreements: [],
    invoices: [
      {
        id: "inv-401",
        invoiceNumber: "INV-2026-098",
        date: "Oct 5, 2026",
        amount: "$150.00",
        service: "Commercial Contracts Consultation",
        status: "Paid via Gateway",
        gatewayRef: "HP-89412-HP",
      },
    ],
    messageLog: [
      {
        id: "msg-401",
        timestamp: "Oct 5, 2026 at 04:30 PM",
        channel: "WhatsApp",
        type: "Reschedule Notice",
        message: "Med Jordan Law: Received your reschedule request to Oct 9, 02:00 PM. Our office will confirm within 24 hours.",
        status: "Read",
      },
    ],
  },
];

// ==========================================
// FINANCE & GATEWAY TRANSACTIONS
// ==========================================

export const INITIAL_TRANSACTIONS: FinanceTransaction[] = [
  {
    id: "txn-1",
    txnRef: "TXN-88102-HP",
    clientName: "Sara Odeh",
    clientInitials: "SO",
    clientAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256",
    lawyerName: "Tariq Qudah",
    service: "Commercial Retainer Consultation",
    date: "Oct 6, 2026",
    time: "10:14 AM",
    grossAmount: 250.00,
    gatewayFee: 6.25,
    netAmount: 243.75,
    paymentMethod: "Apple Pay",
    status: "Settled",
  },
  {
    id: "txn-2",
    txnRef: "TXN-90214-HP",
    clientName: "Zaid Nabulsi",
    clientInitials: "ZN",
    lawyerName: "Tariq Qudah",
    service: "Corporate M&A Consultation Intake",
    date: "Oct 6, 2026",
    time: "09:42 AM",
    grossAmount: 180.00,
    gatewayFee: 4.50,
    netAmount: 175.50,
    paymentMethod: "Visa / MC",
    status: "Settled",
  },
  {
    id: "txn-3",
    txnRef: "TXN-87654-HP",
    clientName: "Omar Masri",
    clientInitials: "OM",
    lawyerName: "Sara Al-Majali",
    service: "Real Estate Title Deed Review",
    date: "Oct 5, 2026",
    time: "04:15 PM",
    grossAmount: 150.00,
    gatewayFee: 3.75,
    netAmount: 146.25,
    paymentMethod: "Apple Pay",
    status: "Settled",
  },
  {
    id: "txn-4",
    txnRef: "TXN-86921-HP",
    clientName: "Dr. Fadi Haddad",
    clientInitials: "FH",
    lawyerName: "Kareem Masri",
    service: "IP Patent Consultation",
    date: "Oct 5, 2026",
    time: "02:30 PM",
    grossAmount: 120.00,
    gatewayFee: 3.00,
    netAmount: 117.00,
    paymentMethod: "CliQ / Bank Transfer",
    status: "Settled",
  },
  {
    id: "txn-5",
    txnRef: "TXN-85110-HP",
    clientName: "Tariq Barakat",
    clientInitials: "TB",
    lawyerName: "Tariq Qudah",
    service: "Arbitration Consultation (Cancelled)",
    date: "Oct 4, 2026",
    time: "11:20 AM",
    grossAmount: 180.00,
    gatewayFee: 4.50,
    netAmount: 0.00,
    paymentMethod: "Visa / MC",
    status: "Refunded",
    refundDate: "Oct 5, 2026 at 10:15 AM",
    refundReason: "Client cancelled >48 hours in advance per office policy.",
  },
  {
    id: "txn-6",
    txnRef: "TXN-84001-HP",
    clientName: "Al-Manar Logistics Ltd.",
    clientInitials: "ML",
    lawyerName: "Tariq Qudah",
    service: "Litigation Retainer Fee",
    date: "Sep 28, 2026",
    time: "03:10 PM",
    grossAmount: 9800.00,
    gatewayFee: 245.00,
    netAmount: 9555.00,
    paymentMethod: "CliQ / Bank Transfer",
    status: "Settled",
  },
];

// ==========================================
// NO-CODE CMS CONTENT (BILINGUAL AR/EN)
// ==========================================

export const INITIAL_ARTICLES: ArticleItem[] = [
  {
    id: "art-1",
    title_en: "Navigating Jordan's New Companies Law Amendments 2026",
    title_ar: "دليل التعديلات الجديدة على قانون الشركات الأردني 2026",
    slug: "jordan-companies-law-amendments-2026",
    excerpt_en: "A comprehensive breakdown of foreign ownership limits, digital board resolutions, and simplified liquidation proceedings under the latest Ministry gazette.",
    excerpt_ar: "شرح شامل لحدود الملكية الأجنبية، وقرارات مجالس الإدارة الرقمية، وإجراءات التصفية المبسطة وفقاً لأحدث أعداد الجريدة الرسمية.",
    content_en: "Under the latest legislative reform published in the Official Gazette, foreign investors now enjoy enhanced protections when acquiring equity in Jordanian limited liability companies (LLCs). Notably, the requirement for physical board meetings has been replaced with legally binding encrypted electronic votes...",
    content_ar: "بموجب الإصلاح التشريعي الأخير المنشور في الجريدة الرسمية، يتمتع المستثمرون الأجانب الآن بحماية معززة عند تملك الحصص في الشركات ذات المسؤولية المحدودة الأردنية. والجدير بالذكر أنه تم الاستعاضة عن اشتراط الحضور الفعلي لاجتماعات مجلس الإدارة بإجراءات التصويت الإلكتروني المشفر...",
    practiceArea: "Corporate & Commercial",
    author: "Tariq Qudah",
    status: "Published",
    views: 1420,
    lastUpdated: "Oct 4, 2026",
    readTime: "5 min read",
  },
  {
    id: "art-2",
    title_en: "Enforcing Foreign Arbitration Awards in Amman Courts",
    title_ar: "تنفيذ أحكام التحكيم الأجنبية أمام المحاكم الأردنية",
    slug: "enforcing-foreign-arbitration-awards-jordan",
    excerpt_en: "How the New York Convention intersects with Jordanian public policy, and key pitfalls to avoid when serving international arbitral awards.",
    excerpt_ar: "كيف تتقاطع اتفاقية نيويورك مع النظام العام الأردني، وأبرز المحاذير التي يجب تجنبها عند إعلان وتبليغ أحكام التحكيم الدولية.",
    content_en: "Jordanian courts have historically maintained a pro-arbitration stance pursuant to Law No. 31 of 2001. However, enforcing an award against a local asset requires strict adherence to notification protocols under the Civil Procedure Code...",
    content_ar: "حافظت المحاكم الأردنية تاريخياً على نهج داعم للتحكيم بموجب القانون رقم 31 لسنة 2001. ومع ذلك، فإن تنفيذ الحكم ضد الأصول المحلية يتطلب التزاماً صارماً ببروتوكولات التبليغ وفق قانون أصول المحاكمات المدنية...",
    practiceArea: "Arbitration & Dispute Resolution",
    author: "Sara Al-Majali",
    status: "Published",
    views: 890,
    lastUpdated: "Sep 22, 2026",
    readTime: "7 min read",
  },
  {
    id: "art-3",
    title_en: "Intellectual Property Rights for Regional Tech Startups",
    title_ar: "حماية حقوق الملكية الفكرية للشركات الناشئة في المنطقة",
    slug: "ip-rights-regional-tech-startups",
    excerpt_en: "Essential patent and trademark registration steps before raising Series A in Jordan and the GCC.",
    excerpt_ar: "الخطوات الأساسية لتسجيل براءات الاختراع والعلامات التجارية قبل جولة الاستثمار الأولى في الأردن والخليج.",
    content_en: "Startups expanding beyond Jordan often overlook the priority date rules under the Paris Convention. Securing your trademark in Amman provides a 6-month international priority window...",
    content_ar: "غالباً ما تغفل الشركات الناشئة المتوسعة خارج الأردن عن قواعد تاريخ الأولوية بموجب اتفاقية باريس. إن تسجيل علامتك في عمّان يمنحك نافذة أولوية دولية مدتها 6 أشهر...",
    practiceArea: "Patent & IP",
    author: "Kareem Masri",
    status: "Draft",
    views: 0,
    lastUpdated: "Oct 5, 2026",
    readTime: "4 min read",
  },
];

// ==========================================
// OFFICE SETTINGS CONFIGURATION
// ==========================================

export const INITIAL_SETTINGS: OfficeSettings = {
  team: [
    {
      id: "tm-1",
      name: "Tariq Qudah",
      role: "Senior Partner",
      email: "t.qudah@medjordanlaw.com",
      avatar: "/avatars/tariq-qudah.jpg",
      twoFactorEnabled: true,
      activeCases: 14,
    },
    {
      id: "tm-2",
      name: "Sara Al-Majali",
      role: "Partner",
      email: "s.majali@medjordanlaw.com",
      twoFactorEnabled: true,
      activeCases: 9,
    },
    {
      id: "tm-3",
      name: "Kareem Masri",
      role: "Senior Associate",
      email: "k.masri@medjordanlaw.com",
      twoFactorEnabled: true,
      activeCases: 5,
    },
    {
      id: "tm-4",
      name: "Layla Haddad",
      role: "Paralegal",
      email: "l.haddad@medjordanlaw.com",
      twoFactorEnabled: true,
      activeCases: 0,
    },
  ],
  practiceAreas: [
    "Corporate & M&A",
    "Commercial Arbitration",
    "Real Estate & Land Registry",
    "Patent & IP Law",
    "Labor & Employment",
    "Banking & Project Finance",
  ],
  lawyerProfiles: [
    {
      id: "lp-1",
      name: "Tariq Qudah",
      title: "Senior Partner · Head of Corporate & Dispute Resolution",
      licenseNo: "JBA-19842",
      hourlyFee: 350,
      consultationFee: 250,
      practiceAreas: ["Corporate & M&A", "Commercial Arbitration"],
      active: true,
    },
    {
      id: "lp-2",
      name: "Sara Al-Majali",
      title: "Partner · Real Estate & Commercial Litigation",
      licenseNo: "JBA-23114",
      hourlyFee: 280,
      consultationFee: 150,
      practiceAreas: ["Real Estate & Land Registry", "Labor & Employment"],
      active: true,
    },
    {
      id: "lp-3",
      name: "Kareem Masri",
      title: "Senior Associate · IP & Venture Advisory",
      licenseNo: "JBA-31902",
      hourlyFee: 200,
      consultationFee: 120,
      practiceAreas: ["Patent & IP Law", "Corporate & M&A"],
      active: true,
    },
  ],
  bookingPolicy: {
    minNoticeHours: 24,
    maxReschedules: 2,
    refundTier1Hours: 48,
    refundTier1Percent: 100,
    refundTier2Hours: 24,
    refundTier2Percent: 50,
    autoAcceptance: false,
  },
};

export const WEEKLY_CHART_DATA: DayBarData[] = [
  { day: "Sun", fullDay: "Sunday", bookings: 4, heightPercent: 50 },
  { day: "Mon", fullDay: "Monday", bookings: 7, heightPercent: 78 },
  { day: "Tue", fullDay: "Tuesday", bookings: 5, heightPercent: 62 },
  { day: "Wed", fullDay: "Wednesday", bookings: 9, heightPercent: 96, isActive: true, activeLabel: "9 Bookings" },
  { day: "Thu", fullDay: "Thursday", bookings: 8, heightPercent: 84 },
  { day: "Fri", fullDay: "Friday", bookings: 3, heightPercent: 42 },
  { day: "Sat", fullDay: "Saturday", bookings: 6, heightPercent: 68 },
];

export const NEXT_CONSULTATION = {
  clientName: "Sara Odeh",
  headline: "Consultation with Sara Odeh",
  firm: "Odeh Industrial & Commercial Group",
  time: "02:00 PM – 04:00 PM",
  date: "Today, Oct 6",
  countdown: "Starts in 24m",
  status: "Scheduled",
  type: "Commercial Retainer Agreement",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256",
  location: "FaceTime HD / Encrypted Portal",
};

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    title: "Upcoming Video Hearing",
    body: "Commercial retainer review with Sara Odeh begins in 24 minutes.",
    time: "24m ago",
    read: false,
    category: "calendar",
  },
  {
    id: "n2",
    title: "Court Document Filed",
    body: "Arbitration Chamber Filing for Amman Commercial has been recorded.",
    time: "2h ago",
    read: false,
    category: "matter",
  },
  {
    id: "n3",
    title: "Trust Account Wire Received",
    body: "$14,500.00 retainer settled for Odeh Industrial Group.",
    time: "4h ago",
    read: true,
    category: "billing",
  },
];

export const RECENT_BOOKINGS: RecentBookingItem[] = [
  {
    id: "1",
    name: "Layla Al-Husseini",
    caseType: "Corporate & Commercial Law",
    avatarBg: "bg-navy-600/10 text-navy-600",
    initials: "LH",
    timeAgo: "10 mins ago",
    status: "Completed",
    retainerAmount: "$4,200",
  },
  {
    id: "2",
    name: "Omar Masri",
    caseType: "Real Estate Acquisition Review",
    avatarBg: "bg-gold-500/15 text-gold-700",
    initials: "OM",
    timeAgo: "45 mins ago",
    status: "In Progress",
    retainerAmount: "$8,500",
  },
  {
    id: "3",
    name: "Dr. Fadi Haddad",
    caseType: "IP & Trademark Portfolio",
    avatarBg: "bg-navy-500/10 text-navy-500",
    initials: "FH",
    timeAgo: "2 hours ago",
    status: "Pending",
    retainerAmount: "$3,100",
  },
  {
    id: "4",
    name: "Nour Abbadi",
    caseType: "Labor Contract Settlement",
    avatarBg: "bg-info/10 text-info",
    initials: "NA",
    timeAgo: "Yesterday",
    status: "In Progress",
    retainerAmount: "$5,400",
  },
];

export const ACTIVE_MATTERS: MatterItem[] = [
  {
    id: "m1",
    title: "Draft Retainer Agreements",
    dueDate: "Due Nov 26, 2026",
    category: "Commercial",
    color: "#3D5390",
    progress: 85,
    isCompleted: false,
  },
  {
    id: "m2",
    title: "Amman Land Title Deeds",
    dueDate: "Due Nov 28, 2026",
    category: "Real Estate",
    color: "#3B82C4",
    progress: 60,
    isCompleted: false,
  },
  {
    id: "m3",
    title: "IP Trademark Registration",
    dueDate: "Due Nov 30, 2026",
    category: "Patent & IP",
    color: "#526BA8",
    progress: 40,
    isCompleted: false,
  },
  {
    id: "m4",
    title: "Labor Contract Settlement",
    dueDate: "Due Dec 5, 2026",
    category: "Employment",
    color: "#E8B04A",
    progress: 25,
    isCompleted: false,
  },
  {
    id: "m5",
    title: "Arbitration Chamber Filing",
    dueDate: "Due Dec 6, 2026",
    category: "Arbitration",
    color: "#2F4070",
    progress: 90,
    isCompleted: false,
  },
];

// ==========================================
// FEE AGREEMENT CONTRACTS (PAGE 10 E-SIGNATURE)
// ==========================================

export const INITIAL_CONTRACTS: FeeContractItem[] = [
  {
    id: "fc-1",
    contractNumber: "MJL-FEE-2026-014",
    clientName: "Sara Odeh (Odeh Industrial Group)",
    clientId: "cl-2",
    clientPhone: "+962 7 9123 4567",
    clientEmail: "sara@odehgroup.com",
    assignedLawyer: "Tariq Qudah",
    practiceArea: "Corporate & M&A",
    templateType: "Corporate General Counsel",
    totalFee: "$24,000.00",
    retainerDeposit: "$8,000.00",
    paymentMilestones: [
      { description: "Execution Retainer Deposit", amount: "$8,000.00", dueTrigger: "Upon digital signature execution" },
      { description: "Articles of Association & Restructuring Closing", amount: "$8,000.00", dueTrigger: "Filing with Companies Controller" },
      { description: "Final Regulatory Transfer Approval", amount: "$8,000.00", dueTrigger: "Ministry gazette issuance" },
    ],
    status: "Countersigned & Executed",
    sentDate: "Sep 01, 2026 at 10:00",
    signedDate: "Sep 01, 2026 at 11:05",
    clientSignature: {
      signatoryName: "Sara Odeh",
      signatureType: "drawn",
      ipAddress: "82.212.94.18",
      timestamp: "2026-09-01T11:05:42Z",
      docHashSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    },
    countersignedBy: "Tariq Qudah (Senior Partner)",
    countersignedAt: "Sep 01, 2026 at 11:30",
    pdfUrl: "MJL_Agreement_OdehGroup_Signed.pdf",
  },
  {
    id: "fc-2",
    contractNumber: "MJL-FEE-2026-022",
    clientName: "Al-Manar Logistics Ltd.",
    clientId: "cl-1",
    clientPhone: "+962 7 9554 1122",
    clientEmail: "legal@almanar-logistics.jo",
    assignedLawyer: "Tariq Qudah",
    practiceArea: "Commercial Litigation & Arbitration",
    templateType: "Litigation Retainer",
    totalFee: "$35,000.00",
    retainerDeposit: "$10,000.00",
    paymentMilestones: [
      { description: "Initial Litigation Retainer Deposit", amount: "$10,000.00", dueTrigger: "Upon formal engagement" },
      { description: "Court of Appeal Statement of Claim", amount: "$15,000.00", dueTrigger: "Amman Court filing receipt" },
      { description: "Expert Testimony & Final Bench Ruling", amount: "$10,000.00", dueTrigger: "Judgment rendering" },
    ],
    status: "Countersigned & Executed",
    sentDate: "Aug 14, 2026 at 12:00",
    signedDate: "Aug 14, 2026 at 14:22",
    clientSignature: {
      signatoryName: "Zaid Nabulsi (Managing Director)",
      signatureType: "drawn",
      ipAddress: "82.212.101.44",
      timestamp: "2026-08-14T14:22:10Z",
      docHashSha256: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
    },
    countersignedBy: "Tariq Qudah (Senior Partner)",
    countersignedAt: "Aug 14, 2026 at 15:00",
    pdfUrl: "MJL_Agreement_AlManar_Signed.pdf",
  },
  {
    id: "fc-3",
    contractNumber: "MJL-FEE-2026-031",
    clientName: "Omar Masri",
    clientId: "cl-3",
    clientPhone: "+962 7 9444 8899",
    clientEmail: "omar@masri-invest.jo",
    assignedLawyer: "Sara Al-Majali",
    practiceArea: "Real Estate & Construction",
    templateType: "Litigation Retainer",
    totalFee: "$18,500.00",
    retainerDeposit: "$5,000.00",
    paymentMilestones: [
      { description: "FIDIC Dispute Intake Deposit", amount: "$5,000.00", dueTrigger: "Digital signing" },
      { description: "Engineering Expert Review & Pleading", amount: "$8,500.00", dueTrigger: "First court hearing" },
      { description: "Final Settlement or Judgment Award", amount: "$5,000.00", dueTrigger: "Matter closure" },
    ],
    status: "Sent for Signature",
    sentDate: "Oct 6, 2026 at 16:30",
  },
  {
    id: "fc-4",
    contractNumber: "MJL-FEE-2026-039",
    clientName: "Khaled Al-Talhouni (Talhouni Pharma)",
    clientId: "cl-5",
    clientPhone: "+962 7 9771 2233",
    clientEmail: "k.talhouni@talhouni-pharma.com",
    assignedLawyer: "Tariq Qudah",
    practiceArea: "Corporate & M&A",
    templateType: "Corporate General Counsel",
    totalFee: "$32,000.00",
    retainerDeposit: "$12,000.00",
    paymentMilestones: [
      { description: "Cross-Border Acquisition Retainer", amount: "$12,000.00", dueTrigger: "Digital signing" },
      { description: "Due Diligence & Antitrust Clearance", amount: "$10,000.00", dueTrigger: "Regulatory review submission" },
      { description: "Closing & Share Transfer Execution", amount: "$10,000.00", dueTrigger: "Closing escrow release" },
    ],
    status: "Signed by Client",
    sentDate: "Oct 5, 2026 at 09:15",
    signedDate: "Oct 6, 2026 at 18:40",
    clientSignature: {
      signatoryName: "Khaled Al-Talhouni",
      signatureType: "drawn",
      ipAddress: "82.212.88.92",
      timestamp: "2026-10-06T18:40:15Z",
      docHashSha256: "b10a8db164e0754105b7a99be72e3fe5a99ceb37ddbb58e388d79047f6cfb014",
    },
    pdfUrl: "MJL_Agreement_Talhouni_Signed.pdf",
  },
  {
    id: "fc-5",
    contractNumber: "MJL-FEE-2026-044",
    clientName: "Dr. Rawan Al-Kurd (Kurd Ventures)",
    clientId: "cl-6",
    clientPhone: "+962 7 9883 4455",
    clientEmail: "rawan@kurd-ventures.jo",
    assignedLawyer: "Kareem Masri",
    practiceArea: "Patent & IP",
    templateType: "Corporate General Counsel",
    totalFee: "$14,000.00",
    retainerDeposit: "$4,500.00",
    paymentMilestones: [
      { description: "IP Portfolio Strategy & Brand Audit", amount: "$4,500.00", dueTrigger: "Upon engagement" },
      { description: "Cease-and-Desist Defense & Settlement", amount: "$5,500.00", dueTrigger: "Defense filing" },
      { description: "International Trademark Registration", amount: "$4,000.00", dueTrigger: "WIPO gazette filing" },
    ],
    status: "Draft",
  },
  {
    id: "fc-6",
    contractNumber: "MJL-FEE-2026-048",
    clientName: "Reem Al-Khatib (Amman Maritime)",
    clientId: "cl-7",
    clientPhone: "+962 7 9331 4455",
    clientEmail: "reem@amman-maritime.jo",
    assignedLawyer: "Tariq Qudah",
    practiceArea: "Commercial Arbitration",
    templateType: "Arbitration Agreement",
    totalFee: "$42,000.00",
    retainerDeposit: "$15,000.00",
    paymentMilestones: [
      { description: "Arbitral Tribunal Filing Deposit", amount: "$15,000.00", dueTrigger: "Upon tribunal constitution" },
      { description: "Hearing Pleadings & Expert Witnesses", amount: "$15,000.00", dueTrigger: "Tribunal hearing commencement" },
      { description: "Final Enforcement Decree in Amman Court", amount: "$12,000.00", dueTrigger: "Award enforcement" },
    ],
    status: "Draft",
  },
  {
    id: "fc-7",
    contractNumber: "MJL-FEE-2026-052",
    clientName: "Zaid Nabulsi (Nabulsi Trading Co.)",
    clientId: "cl-8",
    clientPhone: "+962 7 9554 1122",
    clientEmail: "z.nabulsi@nabulsitrading.jo",
    assignedLawyer: "Tariq Qudah",
    practiceArea: "Commercial Contracts",
    templateType: "Litigation Retainer",
    totalFee: "$16,500.00",
    retainerDeposit: "$5,500.00",
    paymentMilestones: [
      { description: "Contract Review & Pre-Trial Notice", amount: "$5,500.00", dueTrigger: "Upon digital signing" },
      { description: "First Instance Commercial Court Defense", amount: "$6,000.00", dueTrigger: "Statement of claim docket" },
      { description: "Settlement Accord Execution", amount: "$5,000.00", dueTrigger: "Settlement closing" },
    ],
    status: "Sent for Signature",
    sentDate: "Today at 09:30",
  },
  {
    id: "fc-8",
    contractNumber: "MJL-FEE-2026-055",
    clientName: "Eng. Tareq Toukan (Toukan Construction)",
    clientId: "cl-9",
    clientPhone: "+962 7 9665 8899",
    clientEmail: "tareq@toukan-build.jo",
    assignedLawyer: "Sara Al-Majali",
    practiceArea: "Real Estate & Construction",
    templateType: "Litigation Retainer",
    totalFee: "$26,000.00",
    retainerDeposit: "$8,000.00",
    paymentMilestones: [
      { description: "FIDIC Dispute Adjudication Board Deposit", amount: "$8,000.00", dueTrigger: "DAB submission" },
      { description: "Evidentiary Review & Quantum Report", amount: "$10,000.00", dueTrigger: "Engineer assessment" },
      { description: "Court of Appeal Registration", amount: "$8,000.00", dueTrigger: "Appeal ruling" },
    ],
    status: "Amendment Requested",
    sentDate: "Oct 4, 2026 at 14:00",
    amendmentNotes: "Client requested amending Milestone 2 trigger from court pleading to DAB engineering expert findings.",
  },
];

// ==========================================
// WEBSITE INQUIRIES & CONTACT LEADS (PAGE 3)
// ==========================================

export const INITIAL_LEADS: ContactLeadItem[] = [
  {
    id: "lead-1",
    name: "Khaled Al-Talhouni",
    phone: "+962 7 9771 2233",
    email: "k.talhouni@talhouni-pharma.com",
    practiceArea: "Corporate & M&A",
    message: "Seeking lead counsel for a proposed acquisition of an Egyptian pharmaceutical distributor. Need initial conflict clearance and NDA review.",
    submittedAt: "15 mins ago",
    status: "New",
    turnstileVerified: true,
  },
  {
    id: "lead-2",
    name: "Dr. Rawan Al-Kurd",
    phone: "+962 7 9883 4455",
    email: "rawan@kurd-ventures.jo",
    practiceArea: "Patent & IP",
    message: "Received an urgent trademark cease-and-desist letter from a Dubai firm regarding our healthtech mobile platform branding.",
    submittedAt: "2 hours ago",
    status: "New",
    turnstileVerified: true,
  },
  {
    id: "lead-3",
    name: "Hassan Qasrawi",
    phone: "+962 7 9222 9988",
    email: "hassan@qasrawi-trading.com",
    practiceArea: "Commercial Arbitration",
    message: "Foreign supplier defaulted on shipping industrial transformers to Aqaba Port. Contract has an Amman arbitration clause.",
    submittedAt: "Yesterday at 16:20",
    status: "Contacted",
    turnstileVerified: true,
    notes: "Spoke with client. Proposed a video consultation with Tariq Qudah for Thursday.",
  },
  {
    id: "lead-4",
    name: "Shireen Dajani",
    phone: "+962 7 9345 6789",
    email: "shireen@dajani-hospitality.jo",
    practiceArea: "Real Estate & Leases",
    message: "Landlord issued arbitrary termination notice for our boutique Dead Sea resort property. We have a valid 10-year registered commercial lease.",
    submittedAt: "35 mins ago",
    status: "New",
    turnstileVerified: true,
  },
  {
    id: "lead-5",
    name: "Eng. Tareq Toukan",
    phone: "+962 7 9665 8899",
    email: "tareq@toukan-build.jo",
    practiceArea: "Construction & FIDIC",
    message: "Government employer deducted liquidated damages exceeding statutory 15% cap on a Ministry of Public Works hospital contract.",
    submittedAt: "3 hours ago",
    status: "Contacted",
    turnstileVerified: true,
    notes: "Telephone intake conducted with Sara Al-Majali. Case documentation requested.",
  },
  {
    id: "lead-6",
    name: "Noor Halasa",
    phone: "+962 7 9112 3344",
    email: "noor@halasa-logistics.jo",
    practiceArea: "Customs & Concessions",
    message: "Customs Department imposed retroactive tariff reclassification fines on solar equipment shipments through Queen Alia International Airport.",
    submittedAt: "Oct 5, 2026",
    status: "Consultation Scheduled",
    turnstileVerified: true,
    notes: "Converted to scheduled consultation session with Tariq Qudah for Thursday at 11:00 AM.",
  },
  {
    id: "lead-7",
    name: "Mohammad Al-Faouri",
    phone: "+962 7 9887 6543",
    email: "faouri@amman-retail.com",
    practiceArea: "Corporate Dispute",
    message: "Dispute between partners in a limited liability company regarding capital decrease without general assembly unanimous consent.",
    submittedAt: "Oct 4, 2026",
    status: "Consultation Scheduled",
    turnstileVerified: true,
    notes: "Booked 60-minute in-person strategy session at Amman HQ.",
  },
  {
    id: "lead-8",
    name: "Zeid Al-Khasawneh",
    phone: "+962 7 9445 1122",
    email: "zeid@khasawneh-group.jo",
    practiceArea: "Labor & Employment",
    message: "Executive separation agreement drafting for departing regional VP with restrictive covenant and non-solicitation clauses.",
    submittedAt: "Oct 3, 2026",
    status: "Archived",
    turnstileVerified: true,
    notes: "Standard statutory severance advisory dispatched. Matter concluded.",
  },
];

// ==========================================
// CENTRAL SYSTEM AUDIT LOG (PAGES 9 & 11)
// ==========================================

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "aud-1",
    timestamp: "Oct 7, 2026 at 02:45 AM",
    actorName: "Tariq Qudah",
    actorRole: "Senior Partner",
    action: "VIEW_DOCUMENT",
    resourceType: "Document",
    resourceId: "doc-1",
    resourceDetails: "Opened Signed Consultation Retainer Agreement (Matter MJL-2026-089)",
    ipAddress: "192.168.1.104",
  },
  {
    id: "aud-2",
    timestamp: "Oct 7, 2026 at 01:20 AM",
    actorName: "Sara Al-Majali",
    actorRole: "Partner",
    action: "CLEAR_CONFLICT",
    resourceType: "Booking",
    resourceId: "b-103",
    resourceDetails: "Conflict check cleared for Sara Odeh (Corporate Restructuring)",
    ipAddress: "192.168.1.112",
  },
  {
    id: "aud-3",
    timestamp: "Oct 6, 2026 at 05:10 PM",
    actorName: "Tariq Qudah",
    actorRole: "Senior Partner",
    action: "EXECUTE_CONTRACT",
    resourceType: "Contract",
    resourceId: "fc-1",
    resourceDetails: "Countersigned Fee Agreement MJL-FEE-2026-014 with Odeh Industrial Group",
    ipAddress: "192.168.1.104",
  },
  {
    id: "aud-4",
    timestamp: "Oct 6, 2026 at 03:40 PM",
    actorName: "Layla Haddad",
    actorRole: "Paralegal",
    action: "DOWNLOAD_DOCUMENT",
    resourceType: "Document",
    resourceId: "doc-301",
    resourceDetails: "Downloaded FIDIC Construction Contract Agreement (Matter MJL-2026-061)",
    ipAddress: "192.168.1.118",
  },
  {
    id: "aud-5",
    timestamp: "Oct 5, 2026 at 10:15 AM",
    actorName: "Billing Officer",
    actorRole: "Accountant",
    action: "ISSUE_REFUND",
    resourceType: "Finance",
    resourceId: "TXN-85110-HP",
    resourceDetails: "Gateway refund of $180.00 executed for Tariq Barakat (Cancelled booking)",
    ipAddress: "192.168.1.120",
  },
];


