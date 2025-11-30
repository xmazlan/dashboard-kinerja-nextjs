"use client";

import {
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  type AlertDialogContentProps,
} from "@/components/animate-ui/components/radix/alert-dialog";
import SectionOne from "@/components/section/section-one";
import SectionTwo from "@/components/section/section-two";
import ArticleTree from "@/components/section/roby/article-tree";
import SectionTree from "@/components/section/section-tree";
import SectionPengaduan from "@/components/section/roby/pengaduan";
import SectionPendudukan from "@/components/section/roby/pendudukan";
import SectionStunting from "@/components/section/roby/stunting";
import DataTpidKomoditi from "@/components/section/roby/data/tpid/data-tpid-komoditi";
import DataTpidPasar from "@/components/section/roby/data/tpid/data-tpid-pasar";
import SectionTpid from "@/components/section/roby/tpid";
import DataTpidPasarSlide from "@/components/section/roby/slider-content/data-tpid-pasar-slide";
import SectionTpidSlide from "@/components/section/roby/slider-content/tpid-pasar-slide";
import SectionStuntingSweeperKecamatanSlide from "@/components/section/roby/stunting-sweeper-kecamatan-slide";
import DataPajakPBJT from "@/components/section/roby/data/pajak/data-pajak-PBJT";
import DataBpkad from "@/components/section/roby/data/bpkad/data-bpkad";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import SectionCapilIkd from "@/components/section/roby/data/capil/data-capil-ikd";
import DataDisdikDoItm from "@/components/section/roby/data/disdik/data-disdik-doitm";
import ViewportInfo from "@/components/section/viewport-info";
import GlobSlider from "@/components/section/global-slide";
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
            {/* <div className="fixed top-2 right-2 z-50 flex gap-2">
              <Button
                variant={viewMode === "slide" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("slide")}
              >
                Mode Slide
              </Button>
              <Button
                variant={viewMode === "page" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("page")}
              >
                Mode Halaman
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  recomputeLayout();
                  window.dispatchEvent(new Event("resize"));
                }}
              >
                <RefreshCcw className="mr-2 h-4 w-4" /> Sesuaikan ulang
              </Button>
            </div> */}

            {/* <ViewportInfo /> */}
            {viewMode === "slide" && (
              <GlobSlider fullScreen topGap={topGap} bottomGap={bottomGap} />
            )}
          </section>
        </main>
      </PageContainer>
    </>
  );
}
