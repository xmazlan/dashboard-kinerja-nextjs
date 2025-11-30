"use client";

import { create } from "zustand";

type Size = { width: number; height: number };

type LayoutState = {
  viewport: Size;
  main: Size;
  section: Size;
  navbar: Size;
  footer: Size;
  setSizes: (next: Partial<LayoutState>) => void;
};

export const useLayoutStore = create<LayoutState>((set) => ({
  viewport: { width: 0, height: 0 },
  main: { width: 0, height: 0 },
  section: { width: 0, height: 0 },
  navbar: { width: 0, height: 0 },
  footer: { width: 0, height: 0 },
  setSizes: (next) =>
    set((prev) => ({
      viewport: next.viewport ?? prev.viewport,
      main: next.main ?? prev.main,
      section: next.section ?? prev.section,
      navbar: next.navbar ?? prev.navbar,
      footer: next.footer ?? prev.footer,
    })),
}));
