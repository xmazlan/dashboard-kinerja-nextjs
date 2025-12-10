import PageContainer from "@/components/dashboard/page-container";
import { Metadata } from "next";
import React from "react";
import VPageUsers from "./_components/v-page";

export const metadata: Metadata = {
  title: "Users",
  description: "Dashboard Kinerja OPD Kota Pekanbaru",
};

export default function page() {
  return (
    <>
      <VPageUsers />
    </>
  );
}
