import PageContainer from "@/components/dashboard/page-container";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Users",
  description: "Dashboard Kinerja OPD Kota Pekanbaru",
};

export default function page() {
  return (
    <>
      <PageContainer>
        <div>
          <h1>Users</h1>
        </div>
      </PageContainer>
    </>
  );
}
