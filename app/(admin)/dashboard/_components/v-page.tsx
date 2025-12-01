"use client";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/animate-ui/components/radix/alert-dialog";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
const GlobSlider = dynamic(() => import("@/components/section/global-slide"), {
  ssr: false,
  loading: () => null,
});
import PageContainer from "@/components/dashboard/page-container";
import { useLayoutStore } from "@/hooks/use-layout";
import { useDashboardStore } from "@/hooks/use-dashboard";
import React from "react";

export default function Dashboard() {
  const { status } = useSession();
  const isUnauthenticated = status === "unauthenticated";
  const setSizes = useLayoutStore((s) => s.setSizes);
  const viewMode = useDashboardStore((s) => s.viewMode);
  const setViewMode = useDashboardStore((s) => s.setViewMode);
  const topGap = useDashboardStore((s) => s.topGap);
  const bottomGap = useDashboardStore((s) => s.bottomGap);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const recomputeLayout = React.useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const main = document.querySelector("main") as HTMLElement | null;
    const section = document.querySelector(
      "main > section"
    ) as HTMLElement | null;
    const navbar = document.querySelector("nav") as HTMLElement | null;
    const footer = document.querySelector("footer") as HTMLElement | null;
    const getSize = (
      el: HTMLElement | null
    ): { width: number; height: number } => {
      if (!el) return { width: 0, height: 0 };
      const r = el.getBoundingClientRect();
      return { width: Math.round(r.width), height: Math.round(r.height) };
    };
    setSizes({
      viewport: { width: vw, height: vh },
      main: getSize(main),
      section: getSize(section),
      navbar: getSize(navbar),
      footer: getSize(footer),
    });
  }, [setSizes]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };
  React.useEffect(() => {
    const update = recomputeLayout;
    update();
    window.addEventListener("resize", update);
    const ro = new ResizeObserver(update);
    const mainEl = document.querySelector("main");
    const sectionEl = document.querySelector("main > section");
    if (mainEl) ro.observe(mainEl);
    if (sectionEl) ro.observe(sectionEl as Element);
    return () => {
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, [recomputeLayout]);
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

      <PageContainer>
        <main className="h-full overflow-hidden">
          <section className="h-full overflow-hidden">
            {/* <ViewportInfo /> */}
            {viewMode === "slide" &&
              (mounted ? (
                <GlobSlider fullScreen topGap={topGap} bottomGap={bottomGap} />
              ) : (
                <div className="w-full h-full space-y-4"></div>
              ))}
          </section>
        </main>
      </PageContainer>
    </>
  );
}
