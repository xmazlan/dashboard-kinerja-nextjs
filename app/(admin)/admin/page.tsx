import { Metadata } from "next";
import VPageAdmin from "./_components/v-page";
export const metadata: Metadata = {
  title: "Admin",
  description: "Dashboard Kinerja OPD Kota Pekanbaru",
};
export default function LoginPage() {
  return (
    <>
      <VPageAdmin />
    </>
  );
}
