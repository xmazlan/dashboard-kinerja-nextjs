import PageContainer from "@/components/dashboard/page-container";
import { Metadata } from "next";
import VPageApplication from "./_components/v-page";

export const metadata: Metadata = {
  title: "Application",
  description: "Dashboard Kinerja Application Kota Pekanbaru",
};

export default function page() {
  return (
    <>
      <VPageApplication />
    </>
  );
}
