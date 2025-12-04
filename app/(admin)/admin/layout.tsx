import PageContainer from "@/components/dashboard/page-container";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageContainer>{children}</PageContainer>
    </>
  );
}
