"use client";
import React from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { useSession, signOut } from "next-auth/react";
import { useLayoutStore } from "@/hooks/use-layout";
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
  const setSizes = useLayoutStore((s) => s.setSizes);
  React.useEffect(() => {
    const updateViewport = () => {
      setSizes({
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });
    };
    const updateNavFooter = () => {
      const navEl = document.querySelector(
        '[data-role="navbar"]'
      ) as HTMLElement | null;
      const footEl = document.querySelector(
        '[data-role="footer"]'
      ) as HTMLElement | null;
      if (navEl)
        setSizes({
          navbar: {
            width: navEl.offsetWidth,
            height: navEl.offsetHeight,
          },
        });
      if (footEl)
        setSizes({
          footer: {
            width: footEl.offsetWidth,
            height: footEl.offsetHeight,
          },
        });
    };
    const handleResize = () => {
      updateViewport();
      updateNavFooter();
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    const ro = new ResizeObserver(() => updateNavFooter());
    const navEl = document.querySelector(
      '[data-role="navbar"]'
    ) as HTMLElement | null;
    const footEl = document.querySelector(
      '[data-role="footer"]'
    ) as HTMLElement | null;
    if (navEl) ro.observe(navEl);
    if (footEl) ro.observe(footEl);
    return () => {
      window.removeEventListener("resize", handleResize);
      ro.disconnect();
    };
  }, [setSizes]);
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
