import React from "react";
import { cn } from "@/lib/utils";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import CardComponent from "@/components/card/card-component";
import { usePengaduanEresponMasterData } from "@/hooks/query/use-pengaduan-erespon";

export default function DataCapil() {
  // State & kontrol untuk Carousel CHART
  const [chartApi, setChartApi] = React.useState<CarouselApi | null>(null);
  const [chartPaused, setChartPaused] = React.useState(false);
  const chartPausedRef = React.useRef(false);
  const { data: masterData, isLoading: isLoadingMasterData } =
    usePengaduanEresponMasterData();
  console.log("masterData", masterData);

  React.useEffect(() => {
    chartPausedRef.current = chartPaused;
  }, [chartPaused]);

  // Autoplay setiap 4 detik, berhenti saat hover/touch (CHART)
  React.useEffect(() => {
    if (!chartApi) return;
    const id = setInterval(() => {
      if (!chartPausedRef.current) {
        chartApi.scrollNext();
      }
    }, 4000);
    return () => clearInterval(id);
  }, [chartApi]);

  const [chartScrollSnaps, setChartScrollSnaps] = React.useState<number[]>([]);
  const [chartSelectedIndex, setChartSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!chartApi) return;
    setChartScrollSnaps(chartApi.scrollSnapList());
    const onSelect = () => setChartSelectedIndex(chartApi.selectedScrollSnap());
    chartApi.on("select", onSelect);
    onSelect();
    return () => {
      chartApi.off("select", onSelect);
    };
  }, [chartApi]);

  // State & kontrol untuk Carousel NON-CHART (Contoh Carousel)
  const [contentApi, setContentApi] = React.useState<CarouselApi | null>(null);
  const [contentPaused, setContentPaused] = React.useState(false);
  const contentPausedRef = React.useRef(false);

  React.useEffect(() => {
    contentPausedRef.current = contentPaused;
  }, [contentPaused]);

  // Autoplay setiap 4 detik, berhenti saat hover/touch (NON-CHART)
  React.useEffect(() => {
    if (!contentApi) return;
    const id = setInterval(() => {
      if (!contentPausedRef.current) {
        contentApi.scrollNext();
      }
    }, 4000);
    return () => clearInterval(id);
  }, [contentApi]);

  const [contentScrollSnaps, setContentScrollSnaps] = React.useState<number[]>(
    []
  );
  const [contentSelectedIndex, setContentSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!contentApi) return;
    setContentScrollSnaps(contentApi.scrollSnapList());
    const onSelect = () =>
      setContentSelectedIndex(contentApi.selectedScrollSnap());
    contentApi.on("select", onSelect);
    onSelect();
    return () => {
      contentApi.off("select", onSelect);
    };
  }, [contentApi]);

  return (
    <>
      <CardComponent
        className="gap-1 border-none shadow-none"
        title="Layanan Kependudukan dan Pecatan Sipil"
        description="11-04-2025"
      >
        {(() => {
          const summaryTiles = [
            {
              label: "Perekaman eKTP",
              value: 188,
              bg: "bg-blue-700",
            },
            {
              label: "Total NIK",
              value: 593_308,
              bg: "bg-orange-600",
            },
            {
              label: "Layanan IKM (OTP Gratis)",
              value: 314,
              bg: "bg-green-700",
            },
            {
              label: "Blangko e-KTP",
              value: 7_298,
              bg: "bg-cyan-700",
            },
          ];
          const categoryTiles = [
            {
              title: "Pengadilan ETP Elektronik",
              value: 758,
              bg: "bg-fuchsia-700",
              proses: 163,
              selesai: 595,
              lainnya: 0,
            },
            {
              title: "Kartu Keluarga",
              value: 283,
              bg: "bg-teal-700",
              proses: 20,
              selesai: 263,
              lainnya: 0,
            },
            {
              title: "Pindah Dalam Kota",
              value: 10,
              bg: "bg-lime-700",
              proses: 10,
              selesai: 0,
              lainnya: 0,
            },
            {
              title: "Pindah Keluar",
              value: 61,
              bg: "bg-slate-700",
              proses: 29,
              selesai: 32,
              lainnya: 0,
            },
            {
              title: "Pindah Datang",
              value: 36,
              bg: "bg-emerald-700",
              proses: 0,
              selesai: 36,
              lainnya: 0,
            },
            {
              title: "Akta Kelahiran",
              value: 155,
              bg: "bg-green-700",
              proses: 83,
              selesai: 72,
              lainnya: 0,
            },
            {
              title: "Akta Kematian",
              value: 101,
              bg: "bg-zinc-700",
              proses: 43,
              selesai: 58,
              lainnya: 0,
            },
            {
              title: "Akta Perkawinan",
              value: 24,
              bg: "bg-teal-600",
              proses: 6,
              selesai: 18,
              lainnya: 0,
            },
            {
              title: "Akta Perceraian",
              value: 2,
              bg: "bg-violet-700",
              proses: 0,
              selesai: 2,
              lainnya: 0,
            },
            {
              title: "Kartu Identitas Anak",
              value: 57,
              bg: "bg-rose-700",
              proses: 7,
              selesai: 50,
              lainnya: 0,
            },
            {
              title: "Pengajuan KTP Orang Asing",
              value: 2,
              bg: "bg-amber-700",
              proses: 0,
              selesai: 1,
              lainnya: 1,
            },
            {
              title: "SKTT/IKP Orang Asing",
              value: 29,
              bg: "bg-cyan-700",
              proses: 17,
              selesai: 12,
              lainnya: 0,
            },
          ];

          return (
            <div className="space-y-3">
              {/* Baris ringkas (4 tile) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {summaryTiles.map((t, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "rounded-md p-3 text-white flex items-center justify-between",
                      t.bg
                    )}
                  >
                    <div className="text-[11px] md:text-xs font-semibold uppercase opacity-90">
                      {t.label}
                    </div>
                    <div className="text-xl md:text-2xl font-bold tracking-wide">
                      {t.value.toLocaleString("id-ID")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid kategori (12 tile) */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                {categoryTiles.map((c, idx) => (
                  <div
                    key={idx}
                    className={cn("rounded-md p-3 text-white", c.bg)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] md:text-xs font-semibold uppercase opacity-90">
                        {c.title}
                      </div>
                      <div className="text-xl md:text-2xl font-bold">
                        {c.value}
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="rounded-md bg-yellow-400/90 text-black px-2 py-1 text-[10px] md:text-xs font-semibold flex items-center justify-between">
                        <span>PROSES</span>
                        <span>{c.proses}</span>
                      </div>
                      <div className="rounded-md bg-emerald-500/90 text-white px-2 py-1 text-[10px] md:text-xs font-semibold flex items-center justify-between">
                        <span>SELESAI</span>
                        <span>{c.selesai}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </CardComponent>
    </>
  );
}
