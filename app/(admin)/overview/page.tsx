import { Metadata } from "next";
import React from "react";
import VPageOverview from "./_components/v-page";

export const metadata: Metadata = {
  title: "Overview",
  description: "Dashboard Kinerja OPD Kota Pekanbaru",
};

export default function page() {
  return (
    <>
      <VPageOverview />
    </>
  );
}
