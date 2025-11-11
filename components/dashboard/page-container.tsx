import React from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="@container flex flex-col min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />
      {/* Main Content */}
      <div className="flex-1">{children}</div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
