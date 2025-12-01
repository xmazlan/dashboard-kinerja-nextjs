"use client";

import React from "react";
import { useDashboardStore } from "@/hooks/use-dashboard";
import { useLayoutStore } from "@/hooks/use-layout";

export default function Layout({
  children,
  sectionOne,
  sectionTwo,
  sectionTree,
}: {
  children: React.ReactNode;
  sectionOne: React.ReactNode;
  sectionTwo: React.ReactNode;
  sectionTree: React.ReactNode;
}) {
  const viewMode = useDashboardStore((s) => s.viewMode);
  const topGap = useDashboardStore((s) => s.topGap);
  const bottomGap = useDashboardStore((s) => s.bottomGap);
  const navbar = useLayoutStore((s) => s.navbar);
  const footer = useLayoutStore((s) => s.footer);

  const topOffset = Math.max((navbar?.height ?? 0) + topGap, 0);
  const bottomOffset = Math.max((footer?.height ?? 0) + bottomGap, 0);

  return (
    <>
      {children}
      {viewMode === "page" && (
        <div
          className="fixed left-0 right-0 px-0"
          style={{ top: topOffset, bottom: bottomOffset }}
        >
          <div className="relative w-full h-full overflow-auto">
            <div className="w-full h-full space-y-4 py-4">
              {sectionOne}
              {sectionTwo}
              {sectionTree}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
