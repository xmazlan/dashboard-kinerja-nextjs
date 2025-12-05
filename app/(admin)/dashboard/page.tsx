import React from "react";
import VPage from "./_components/v-page";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard Kinerja OPD Kota Pekanbaru",
};
export default function page() {
  return (
    <>
      <React.Suspense fallback={null}>
        <VPage />
      </React.Suspense>
    </>
  );
}
