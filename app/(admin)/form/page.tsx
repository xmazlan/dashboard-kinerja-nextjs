import { Metadata } from "next";
import VPageFormKinerja from "./_components/v-page";
export const metadata: Metadata = {
  title: "Form Kinerja",
  description: "Dashboard Kinerja OPD Kota Pekanbaru",
};
export default function page() {
  return (
    <>
      <VPageFormKinerja />
    </>
  );
}
