
export const COLOR_PATTERNS = [
  "bg-gradient-to-br from-blue-600 to-blue-800",
  "bg-gradient-to-br from-indigo-600 to-indigo-800",
  "bg-gradient-to-br from-violet-600 to-violet-800",
  "bg-gradient-to-br from-purple-600 to-purple-800",
  "bg-gradient-to-br from-fuchsia-600 to-fuchsia-800",
  "bg-gradient-to-br from-pink-600 to-pink-800",
  "bg-gradient-to-br from-rose-600 to-rose-800",
  "bg-gradient-to-br from-red-600 to-red-800",
  "bg-gradient-to-br from-orange-600 to-orange-800",
  "bg-gradient-to-br from-amber-600 to-amber-800",
  "bg-gradient-to-br from-yellow-600 to-yellow-800",
  "bg-gradient-to-br from-lime-600 to-lime-800",
  "bg-gradient-to-br from-green-600 to-green-800",
  "bg-gradient-to-br from-emerald-600 to-emerald-800",
  "bg-gradient-to-br from-teal-600 to-teal-800",
  "bg-gradient-to-br from-cyan-600 to-cyan-800",
  "bg-gradient-to-br from-sky-600 to-sky-800",
  "bg-gradient-to-br from-slate-600 to-slate-800",
  "bg-gradient-to-br from-zinc-600 to-zinc-800",
  "bg-gradient-to-br from-stone-600 to-stone-800",
  "bg-gradient-to-br from-blue-500 to-blue-700",
  "bg-gradient-to-br from-indigo-500 to-indigo-700",
  "bg-gradient-to-br from-violet-500 to-violet-700",
  "bg-gradient-to-br from-purple-500 to-purple-700",
  "bg-gradient-to-br from-fuchsia-500 to-fuchsia-700",
  "bg-gradient-to-br from-pink-500 to-pink-700",
  "bg-gradient-to-br from-rose-500 to-rose-700",
  "bg-gradient-to-br from-red-500 to-red-700",
  "bg-gradient-to-br from-orange-500 to-orange-700",
  "bg-gradient-to-br from-amber-500 to-amber-700",
  "bg-gradient-to-br from-yellow-500 to-yellow-700",
  "bg-gradient-to-br from-lime-500 to-lime-700",
  "bg-gradient-to-br from-green-500 to-green-700",
  "bg-gradient-to-br from-emerald-500 to-emerald-700",
  "bg-gradient-to-br from-teal-500 to-teal-700",
  "bg-gradient-to-br from-cyan-500 to-cyan-700",
  "bg-gradient-to-br from-sky-500 to-sky-700",
  "bg-gradient-to-br from-slate-500 to-slate-700",
  "bg-gradient-to-br from-zinc-500 to-zinc-700",
  "bg-gradient-to-br from-stone-500 to-stone-700",
];

export const NEUTRAL_PATTERN =
  "bg-gradient-to-br from-slate-600 to-slate-800";

export function getPatternByKey(key?: string) {
  const s = String(key ?? "");
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  const idx = Math.abs(h) % COLOR_PATTERNS.length;
  return COLOR_PATTERNS[idx];
}

export function getGradientStyleByIndex(index: number, total?: number) {
  const t = Math.max(1, Math.min(360, total ?? COLOR_PATTERNS.length));
  const hue = (index * 137.508) % 360;
  const c1 = `hsl(${hue}, 70%, 45%)`;
  const c2 = `hsl(${(hue + 22) % 360}, 70%, 35%)`;
  return {
    backgroundImage: `linear-gradient(135deg, ${c1}, ${c2})`,
  } as CSSProperties;
}

export function getColorByKey(key?: string) {
  const s = String(key ?? "");
  let h = 0x811c9dc5; // FNV-1a basis
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    h >>>= 0;
  }
  const hue = h % 360;
  const sat = 60 + (h % 25); // 60–85%
  const l1 = 40 + (h % 12); // 40–52%
  return `hsl(${hue}, ${sat}%, ${l1}%)`;
}

export function getGradientStyleByKey(key?: string) {
  const s = String(key ?? "");
  let h = 0x811c9dc5; // FNV-1a basis
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    h >>>= 0;
  }
  const hue = h % 360;
  const sat = 60 + (h % 25); // 60–85%
  const l1 = 40 + (h % 12); // 40–52%
  const l2 = 30 + (h % 12); // 30–42%
  const c1 = `hsl(${hue}, ${sat}%, ${l1}%)`;
  const c2 = `hsl(${(hue + 24) % 360}, ${sat}%, ${l2}%)`;
  return {
    backgroundImage: `linear-gradient(135deg, ${c1}, ${c2})`,
  } as CSSProperties;
}
import type { CSSProperties } from "react";
