"use client";
import React from "react";
import { cn } from "@/lib/utils";
import CardComponent from "@/components/card/card-component";
import { usePengaduanEresponMasterData } from "@/hooks/query/use-pengaduan-erespon";
import LoadingSkeleton from "@/components/loading-skeleton";
import {
  Building2,
  Tags,
  ShieldCheck,
  MapPin,
  MessageSquare,
  AlertCircle,
  Loader2,
  CheckCircle2,
  PauseCircle,
} from "lucide-react";
import { getPatternByKey, NEUTRAL_PATTERN } from "@/components/patern-collor";
import { ModalDetail } from "@/components/modal/detail-modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DataEresponAll from "@/components/section/roby/data/pengaduan/data-erespon-all";
import DataEresponKecamatan from "@/components/section/roby/data/pengaduan/data-erespon-kecamatan";
import DataEresponKelurahan from "@/components/section/roby/data/pengaduan/data-erespon-kelurahan";
import DataEresponOpd from "@/components/section/roby/data/pengaduan/data-erespon-opd";
import LoadingContent from "../loading-content";
import LayoutCard from "@/components/card/layout-card";

export default function DataEresponMasterData() {
  const { data: masterData, isLoading: isLoadingMasterData } =
    usePengaduanEresponMasterData();

  return (
    <div className="w-full h-full">
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="Layanan pengaduan masyarakat (Master Data)"
        description={
          <>
            Last update: {masterData?.last_get ?? ""}
            <br />
            <span className="italic text-xs">(Sumber : E-Respone)</span>
          </>
        }
        action={
          <ModalDetail
            title="Detail Layanan Pengaduan Masyarakat"
            description="Ringkasan dan detail per kategori. Gulir untuk melihat semua informasi."
            contentModal={
              <Tabs defaultValue="all" className="flex flex-col gap-3">
                <TabsList>
                  <TabsTrigger value="all">Ringkasan</TabsTrigger>
                  <TabsTrigger value="opd">OPD</TabsTrigger>
                  <TabsTrigger value="kecamatan">Kecamatan</TabsTrigger>
                  <TabsTrigger value="kelurahan">Kelurahan</TabsTrigger>
                </TabsList>
                <div className="h-[60vh] overflow-y-auto rounded-md border">
                  <TabsContent value="all" className="p-3">
                    <DataEresponAll />
                  </TabsContent>
                  <TabsContent value="kecamatan" className="p-3">
                    <DataEresponKecamatan />
                  </TabsContent>
                  <TabsContent value="kelurahan" className="p-3">
                    <DataEresponKelurahan />
                  </TabsContent>
                  <TabsContent value="opd" className="p-3">
                    <DataEresponOpd />
                  </TabsContent>
                </div>
              </Tabs>
            }
          />
        }
      >
        {isLoadingMasterData ? (
          <LoadingContent />
        ) : (
          (() => {
            const master = masterData?.data?.master ?? {};
            const aduan = masterData?.data?.aduan ?? {};

            const summaryTiles = [
              {
                label: "Total OPD",
                value: Number(master?.total_opd ?? 0),
                bg: "bg-blue-700",
                Icon: Building2,
              },
              {
                label: "Total Jenis Aduan",
                value: Number(master?.total_jenis_aduan ?? 0),
                bg: "bg-orange-600",
                Icon: Tags,
              },
              {
                label: "Total Satgas",
                value: Number(master?.total_satgas ?? 0),
                bg: "bg-green-700",
                Icon: ShieldCheck,
              },
              {
                label: "Total Zona Wilayah",
                value: Number(master?.total_zona_wilayah ?? 0),
                bg: "bg-cyan-700",
                Icon: MapPin,
              },
            ];

            const statusTiles = [
              {
                label: "Total Aduan",
                value: Number(aduan?.total_semua_aduan ?? 0),
                bg: "bg-blue-700",
                Icon: MessageSquare,
              },
              {
                label: "Belum Diproses",
                value: Number(aduan?.total_belum_diproses ?? 0),
                bg: "bg-amber-600",
                Icon: AlertCircle,
              },
              {
                label: "Sedang Proses",
                value: Number(aduan?.total_sedang_proses ?? 0),
                bg: "bg-orange-600",
                Icon: Loader2,
              },
              {
                label: "Selesai",
                value: Number(aduan?.total_selesai ?? 0),
                bg: "bg-emerald-600",
                Icon: CheckCircle2,
              },
              {
                label: "Pending",
                value: Number(aduan?.total_pending ?? 0),
                bg: "bg-rose-600",
                Icon: PauseCircle,
              },
            ];

            return (
              <div className="h-full flex flex-col space-y-3">
                {/* Baris ringkas (4 tile) */}
                <LayoutCard
                  className="bg-transparent p-0"
                  ratioDesktop={0.5}
                  ratioMobile={0.38}
                >
                  <div className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {summaryTiles.map((t, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "rounded-md p-4 text-white flex items-center justify-between h-full shadow-sm ring-1 ring-white/10 transition hover:shadow-md hover:brightness-105",
                          Number(t.value || 0) > 0
                            ? getPatternByKey(t.label)
                            : NEUTRAL_PATTERN
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center">
                            <t.Icon className="w-5 h-5" />
                          </div>
                          <div className="text-[11px] md:text-xs font-semibold uppercase opacity-90">
                            {t.label}
                          </div>
                        </div>
                        <div className="text-xl md:text-2xl font-bold tracking-wide tabular-nums text-right">
                          {t.value.toLocaleString("id-ID")}
                        </div>
                      </div>
                    ))}
                  </div>
                </LayoutCard>

                <LayoutCard
                  className="bg-transparent p-0"
                  ratioDesktop={0.5}
                  ratioMobile={0.38}
                >
                  <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
                    {statusTiles.map((c, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "rounded-md p-4 text-white h-full shadow-sm ring-1 ring-white/10 transition hover:shadow-md hover:brightness-105",
                          Number(c.value || 0) > 0
                            ? getPatternByKey(c.label)
                            : NEUTRAL_PATTERN
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center">
                              <c.Icon className="w-5 h-5" />
                            </div>
                            <div className="text-[11px] md:text-xs font-semibold uppercase opacity-90">
                              {c.label}
                            </div>
                          </div>
                          <div className="text-xl md:text-2xl font-bold tabular-nums text-right">
                            {c.value.toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </LayoutCard>
              </div>
            );
          })()
        )}
      </CardComponent>
    </div>
  );
}
