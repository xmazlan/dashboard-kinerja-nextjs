"use client";

import React from "react";
import { cn } from "@/lib/utils";

export default function SectionContainer({
  children,
  idSection,
  className,
}: {
  children: React.ReactNode;
  idSection?: string | string[];
  className?: string;
}) {
  const idAttr = Array.isArray(idSection) ? undefined : idSection;
  const dataKeys = Array.isArray(idSection) ? idSection.join(",") : idSection;
  return (
    <div
      className={cn("w-full px-4 md:px-6", className)}
      id={idAttr}
      data-section-keys={dataKeys}
    >
      {children}
    </div>
  );
}
