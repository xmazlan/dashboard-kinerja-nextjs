"use client";

import React from "react";
import PageContainer from "@/components/dashboard/page-container";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageContainer>{children}</PageContainer>;
}
