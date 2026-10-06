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
}

export interface DayBarData {
  day: string;
  fullDay: string;
  heightPercent: number;
  isHatched: boolean;
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
  status: "Completed" | "In Progress" | "Pending";
}

export interface MatterItem {
  id: string;
  title: string;
  dueDate: string;
  category: string;
  color: string;
}

export const NAV_MENU_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", href: "#" },
  { id: "bookings", label: "Bookings", icon: "Calendar", badge: "12+", href: "#" },
  { id: "cases", label: "Cases & documents", icon: "Briefcase", href: "#" },
  { id: "clients", label: "Clients", icon: "Users", href: "#" },
  { id: "finance", label: "Finance", icon: "Wallet", href: "#" },
  { id: "content", label: "Content", icon: "FileText", href: "#" },
];

export const NAV_GENERAL_ITEMS: NavItem[] = [
  { id: "settings", label: "Settings", icon: "Settings", href: "#" },
  { id: "help", label: "Help", icon: "HelpCircle", href: "#" },
  { id: "logout", label: "Logout", icon: "LogOut", href: "#" },
];

export const CURRENT_USER = {
  name: "Tariq Qudah",
  email: "t.qudah@medjordanlaw.com",
  role: "Senior Partner",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256",
};

export const STAT_CARDS: StatItem[] = [
  {
    id: "total-bookings",
    title: "Total Bookings",
    value: "24",
    trendText: "Increased from last month",
    trendValue: "5+",
    isAccentDark: true,
  },
  {
    id: "completed-consultations",
    title: "Ended Consultations",
    value: "10",
    trendText: "Increased from last month",
    trendValue: "6+",
    isAccentDark: false,
  },
  {
    id: "active-cases",
    title: "Active Cases",
    value: "12",
    trendText: "Increased from last month",
    trendValue: "2+",
    isAccentDark: false,
  },
  {
    id: "pending-approval",
    title: "Pending Approval",
    value: "2",
    trendText: "On Discuss",
    isAccentDark: false,
  },
];

export const WEEKLY_CHART_DATA: DayBarData[] = [
  { day: "S", fullDay: "Sunday", heightPercent: 55, isHatched: true },
  { day: "M", fullDay: "Monday", heightPercent: 78, isHatched: true },
  { day: "T", fullDay: "Tuesday", heightPercent: 62, isHatched: true },
  { day: "W", fullDay: "Wednesday", heightPercent: 92, isHatched: false, isActive: true, activeLabel: "74%" },
  { day: "T", fullDay: "Thursday", heightPercent: 84, isHatched: true },
  { day: "F", fullDay: "Friday", heightPercent: 50, isHatched: true },
  { day: "S", fullDay: "Saturday", heightPercent: 68, isHatched: true },
];

export const NEXT_CONSULTATION = {
  clientName: "Sara Odeh",
  headline: "Consultation with Sara Odeh",
  firm: "Odeh Industrial & Commercial Group",
  time: "Time : 02.00 pm - 04.00 pm",
  date: "Today, Oct 6",
  status: "Scheduled",
  type: "Commercial Retainer Agreement",
};

export const RECENT_BOOKINGS: RecentBookingItem[] = [
  {
    id: "1",
    name: "Layla Al-Husseini",
    caseType: "Consultation — Corporate & Commercial Law",
    avatarBg: "bg-blue-100 text-blue-700",
    initials: "LH",
    status: "Completed",
  },
  {
    id: "2",
    name: "Omar Masri",
    caseType: "Case Review — Real Estate Acquisition",
    avatarBg: "bg-amber-100 text-amber-800",
    initials: "OM",
    status: "In Progress",
  },
  {
    id: "3",
    name: "Dr. Fadi Haddad",
    caseType: "Contract Drafting — Intellectual Property",
    avatarBg: "bg-slate-200 text-slate-700",
    initials: "FH",
    status: "Pending",
  },
  {
    id: "4",
    name: "Nour Abbadi",
    caseType: "Hearing Prep — Employment & Labor Dispute",
    avatarBg: "bg-indigo-100 text-indigo-700",
    initials: "NA",
    status: "In Progress",
  },
];

export const ACTIVE_MATTERS: MatterItem[] = [
  {
    id: "m1",
    title: "Draft Retainer Agreements",
    dueDate: "Due date: Nov 26, 2024",
    category: "Commercial",
    color: "#0A2342",
  },
  {
    id: "m2",
    title: "Amman Land Title Deeds",
    dueDate: "Due date: Nov 28, 2024",
    category: "Real Estate",
    color: "#2563EB",
  },
  {
    id: "m3",
    title: "IP Trademark Registration",
    dueDate: "Due date: Nov 30, 2024",
    category: "Patent & IP",
    color: "#3B82F6",
  },
  {
    id: "m4",
    title: "Labor Contract Settlement",
    dueDate: "Due date: Dec 5, 2024",
    category: "Employment",
    color: "#D97706",
  },
  {
    id: "m5",
    title: "Arbitration Chamber Filing",
    dueDate: "Due date: Dec 6, 2024",
    category: "Arbitration",
    color: "#475569",
  },
];
