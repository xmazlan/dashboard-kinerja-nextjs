import PageContainer from "@/components/dashboard/page-container";
import { Metadata } from "next";
import VPageExcelOpd from "./_components/v-page";

export const metadata: Metadata = {
  title: "Template Excel OPD",
  description: "Dashboard Kinerja Template Excel OPD Kota Pekanbaru",
};

export default function page() {
  return (
    <>
      <VPageExcelOpd />
    </>
  );
}
