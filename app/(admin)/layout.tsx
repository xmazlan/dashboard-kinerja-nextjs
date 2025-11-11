import { Navbar } from "@/components/dashboard/navbar";
import { Footer } from "@/components/dashboard/footer";
import PageContainer from "@/components/dashboard/page-container";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageContainer>{children}</PageContainer>;
}
