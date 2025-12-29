"use client";

import { create } from "zustand";

type ViewMode = "slide" | "page";

type DashboardState = {
  viewMode: ViewMode;
  topGap: number;
  bottomGap: number;
  speed: number;
  childSpeed: number;
  isGlobalPaused: boolean;
  setViewMode: (m: ViewMode) => void;
  setTopGap: (n: number) => void;
  setBottomGap: (n: number) => void;
  setSpeed: (n: number) => void;
  setChildSpeed: (n: number) => void;
  resetSpeed: () => void;
  resetChildSpeed: () => void;
  toggleGlobalPaused: () => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  isGlobalPaused: false,
  viewMode:
    (typeof window !== "undefined" &&
      (window.localStorage.getItem("dashboardViewMode") as ViewMode)) ||
    "page",
  topGap:
    (typeof window !== "undefined" &&
      Number(window.localStorage.getItem("dashboardTopGap"))) ||
    0,
  bottomGap:
    (typeof window !== "undefined" &&
      Number(window.localStorage.getItem("dashboardBottomGap"))) ||
    0,
  speed:
    (typeof window !== "undefined" &&
      Number(window.localStorage.getItem("dashboardSpeed"))) ||
    Number(process.env.NEXT_PUBLIC_SPEED_LIDER) ||
    4000,
  childSpeed:
    (typeof window !== "undefined" &&
      Number(window.localStorage.getItem("dashboardChildSpeed"))) ||
    Number(process.env.NEXT_PUBLIC_SPEED_CHILD) ||
    4000,
  setViewMode: (m) => {
    set({ viewMode: m });
    if (typeof window !== "undefined")
      window.localStorage.setItem("dashboardViewMode", m);
  },
  setTopGap: (n) => {
    set({ topGap: n });
    if (typeof window !== "undefined")
      window.localStorage.setItem("dashboardTopGap", String(n));
  },
  setBottomGap: (n) => {
    set({ bottomGap: n });
    if (typeof window !== "undefined")
      window.localStorage.setItem("dashboardBottomGap", String(n));
  },
  setSpeed: (n) => {
    set({ speed: n });
    if (typeof window !== "undefined")
      window.localStorage.setItem("dashboardSpeed", String(n));
  },
  setChildSpeed: (n) => {
    set({ childSpeed: n });
    if (typeof window !== "undefined")
      window.localStorage.setItem("dashboardChildSpeed", String(n));
  },
  resetSpeed: () => {
    const defaultSpeed = Number(process.env.NEXT_PUBLIC_SPEED_LIDER) || 4000;
    const safe = defaultSpeed >= 3000 ? defaultSpeed : 3000;
    set({ speed: safe });
    if (typeof window !== "undefined")
      window.localStorage.setItem("dashboardSpeed", String(safe));
  },
  resetChildSpeed: () => {
    const defaultSpeed = Number(process.env.NEXT_PUBLIC_SPEED_CHILD) || 4000;
    const safe = defaultSpeed >= 3000 ? defaultSpeed : 3000;
    set({ childSpeed: safe });
    if (typeof window !== "undefined")
      window.localStorage.setItem("dashboardChildSpeed", String(safe));
  },
  toggleGlobalPaused: () =>
    set((state) => ({ isGlobalPaused: !state.isGlobalPaused })),
}));
