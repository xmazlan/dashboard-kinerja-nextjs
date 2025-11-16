"use client";

import { TrendingUp, Users, CheckCircle, AlertCircle } from "lucide-react";
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

export default function Dashboard() {
  return (
    <>
      <main className="flex-1 mx-auto w-full  px-4 py-4 space-y-4 sm:px-6 lg:px-8">
        {/* <SectionOne /> */}

        {/* Charts Grid */}
        <SectionTwo />
        {/* <DataTpidPasar /> */}
        {/* <SectionStuntingSweeperKecamatanSlide />

        <SectionTpidSlide /> */}

        {/* <SectionStunting /> */}
        <SectionPengaduan />
        <SectionPendudukan />
        <SectionTpid />

        {/* <SectionTree /> */}
      </main>
    </>
  );
}
