"use client";

import React from "react";

export default function SectionContainer({
  children,
  idSection,
}: {
  children: React.ReactNode;
  idSection?: string | string[];
}) {
  const idAttr = Array.isArray(idSection) ? undefined : idSection;
  const dataKeys = Array.isArray(idSection) ? idSection.join(",") : idSection;
  return (
    <div
      className="w-full px-4 md:px-6"
      id={idAttr}
      data-section-keys={dataKeys}
    >
      {children}
    </div>
  );
}
