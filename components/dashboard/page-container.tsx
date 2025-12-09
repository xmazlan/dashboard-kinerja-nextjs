"use client";
import React from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { useSession, signOut } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/animate-ui/components/radix/alert-dialog";
import { Button } from "../ui/button";
export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const isUnauthenticated = status === "unauthenticated";
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };
  return (
    <>
      <AlertDialog open={isUnauthenticated}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Session Expired</AlertDialogTitle>
            <AlertDialogDescription>
              Session expired. Please login again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleLogout}>Logout</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="@container flex flex-col min-h-screen bg-background">
        {/* Navbar */}
        <Navbar />
        {/* Main Content */}
        <div className="flex-1 min-h-0 flex flex-col">{children}</div>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
