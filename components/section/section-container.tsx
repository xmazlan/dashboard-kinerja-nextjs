"use client";

import React from "react";

export default function SectionContainer({ children }: { children: React.ReactNode }) {
  return <div className="w-full px-4 md:px-6">{children}</div>;
}
