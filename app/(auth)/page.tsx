import { Metadata } from "next";
import Vlogin from "./_components/v-page";
export const metadata: Metadata = {
  title: "Login",
  description: "Login Kinerja OPD Kota Pekanbaru",
};
export default function LoginPage() {
  return (
    <>
      <Vlogin />
    </>
  );
}
