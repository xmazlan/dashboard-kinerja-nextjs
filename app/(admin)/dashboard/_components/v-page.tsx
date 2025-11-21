"use client";

import { TrendingUp, Users, CheckCircle, AlertCircle } from "lucide-react";
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
import DataTpidPasarSlide from "@/components/section/roby/data/tpid/data-tpid-pasar-slide";
import SectionTpidSlide from "@/components/section/roby/tpid-pasar-slide";
import SectionStuntingSweeperKecamatanSlide from "@/components/section/roby/stunting-sweeper-kecamatan-slide";
import DataPajakPBJT from "@/components/section/roby/data/pajak/data-pajak-PBJT";
import DataBpkad from "@/components/section/roby/data/bpkad/data-bpkad";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

export default function Dashboard() {
  const { status } = useSession();
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

      <main className="flex-1 mx-auto w-full  px-4 py-4 space-y-4 sm:px-6 lg:px-8">
        {/* <DataBpkad /> */}
        {/* <SectionOne /> */}
        {/* <DataPajakPBJT /> */}
        {/* Charts Grid */}
        <SectionTwo />
        {/* <DataTpidPasar /> */}
        {/* <SectionStuntingSweeperKecamatanSlide />

        <SectionTpidSlide /> */}

        {/* <SectionStunting /> */}
        <SectionPengaduan />
        <SectionPendudukan />
        {/* <SectionTpid /> */}

        <SectionTree />
      </main>
    </>
  );
}
