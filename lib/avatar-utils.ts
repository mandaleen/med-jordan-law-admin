/**
 * Executive Avatar & Placeholder Utility
 * Generates deterministic, vibrant jewel-tone color palettes,
 * extracts clean monogram initials, and provides polished styling
 * for avatar placeholders across the admin platform.
 */

export interface AvatarPalette {
  id: string;
  name: string;
  gradient: string;
  bgLight: string;
  textLight: string;
  borderLight: string;
  accentHex: string;
  ring: string;
}

export const AVATAR_PALETTES: AvatarPalette[] = [
  {
    id: "sapphire",
    name: "Royal Sapphire",
    gradient: "from-blue-600 via-indigo-600 to-indigo-800",
    bgLight: "bg-blue-50 text-blue-700",
    textLight: "text-blue-700",
    borderLight: "border-blue-200/70",
    accentHex: "#2563EB",
    ring: "ring-blue-400/30",
  },
  {
    id: "ruby",
    name: "Warm Ruby",
    gradient: "from-rose-500 via-pink-600 to-rose-700",
    bgLight: "bg-rose-50 text-rose-700",
    textLight: "text-rose-700",
    borderLight: "border-rose-200/70",
    accentHex: "#E11D48",
    ring: "ring-rose-400/30",
  },
  {
    id: "emerald",
    name: "Emerald Jade",
    gradient: "from-emerald-600 via-teal-600 to-teal-800",
    bgLight: "bg-emerald-50 text-emerald-800",
    textLight: "text-emerald-800",
    borderLight: "border-emerald-200/70",
    accentHex: "#059669",
    ring: "ring-emerald-400/30",
  },
  {
    id: "amber",
    name: "Warm Bronze",
    gradient: "from-amber-500 via-orange-600 to-amber-700",
    bgLight: "bg-amber-50 text-amber-800",
    textLight: "text-amber-800",
    borderLight: "border-amber-200/70",
    accentHex: "#D97706",
    ring: "ring-amber-400/30",
  },
  {
    id: "amethyst",
    name: "Regal Amethyst",
    gradient: "from-violet-600 via-purple-600 to-indigo-900",
    bgLight: "bg-violet-50 text-violet-700",
    textLight: "text-violet-700",
    borderLight: "border-violet-200/70",
    accentHex: "#7C3AED",
    ring: "ring-violet-400/30",
  },
  {
    id: "ocean",
    name: "Ocean Cyan",
    gradient: "from-cyan-600 via-sky-600 to-blue-700",
    bgLight: "bg-cyan-50 text-cyan-800",
    textLight: "text-cyan-800",
    borderLight: "border-cyan-200/70",
    accentHex: "#0891B2",
    ring: "ring-cyan-400/30",
  },
  {
    id: "terracotta",
    name: "Sunset Coral",
    gradient: "from-orange-500 via-rose-600 to-red-700",
    bgLight: "bg-orange-50 text-orange-800",
    textLight: "text-orange-800",
    borderLight: "border-orange-200/70",
    accentHex: "#EA580C",
    ring: "ring-orange-400/30",
  },
  {
    id: "berry",
    name: "Wild Berry",
    gradient: "from-fuchsia-600 via-pink-600 to-purple-800",
    bgLight: "bg-fuchsia-50 text-fuchsia-700",
    textLight: "text-fuchsia-700",
    borderLight: "border-fuchsia-200/70",
    accentHex: "#C026D3",
    ring: "ring-fuchsia-400/30",
  },
  {
    id: "teal",
    name: "Deep Pine",
    gradient: "from-teal-600 via-emerald-700 to-slate-800",
    bgLight: "bg-teal-50 text-teal-800",
    textLight: "text-teal-800",
    borderLight: "border-teal-200/70",
    accentHex: "#0D9488",
    ring: "ring-teal-400/30",
  },
  {
    id: "midnight",
    name: "Indigo Midnight",
    gradient: "from-indigo-600 via-slate-800 to-navy-950",
    bgLight: "bg-indigo-50 text-indigo-700",
    textLight: "text-indigo-700",
    borderLight: "border-indigo-200/70",
    accentHex: "#4F46E5",
    ring: "ring-indigo-400/30",
  },
];

/**
 * Deterministically generates an avatar palette based on a name or ID string.
 */
export function getAvatarPalette(seed?: string): AvatarPalette {
  if (!seed || !seed.trim()) return AVATAR_PALETTES[0];
  const str = seed.trim();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
}

/**
 * Extracts clean, high-contrast initials from a person or company name.
 * Handles common honorifics ("Dr.", "Mr.", "Adv.", "Eng.", etc.).
 */
export function getInitials(name?: string, fallbackInitials?: string): string {
  if (fallbackInitials && fallbackInitials.trim()) {
    return fallbackInitials.trim().substring(0, 3).toUpperCase();
  }
  if (!name || !name.trim()) return "";

  // Strip common honorifics/prefixes
  const cleaned = name
    .trim()
    .replace(/^(Dr\.|Dr|Mr\.|Mr|Mrs\.|Mrs|Ms\.|Ms|Eng\.|Eng|Adv\.|Sheikh|Counsel)\s+/i, "");

  const parts = cleaned.split(/[\s-]+/).filter((p) => p.length > 0 && !/^\(.*?\)$/.test(p));
  if (parts.length === 0) return "";
  if (parts.length === 1) {
    return parts[0].substring(0, Math.min(2, parts[0].length)).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
