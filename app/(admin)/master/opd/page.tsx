import PageContainer from "@/components/dashboard/page-container";
import { Metadata } from "next";
import VPageOPD from "./_components/v-page";

export const metadata: Metadata = {
  title: "OPD",
  description: "Dashboard Kinerja OPD Kota Pekanbaru",
};

export default function page() {
  return (
    <>
      <PageContainer>
        <VPageOPD />
      </PageContainer>
    </>
  );
}
