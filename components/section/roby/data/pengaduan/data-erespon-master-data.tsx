"use client";
import CardComponent from "@/components/card/card-component";
import { usePengaduanEresponMasterData } from "@/hooks/query/use-pengaduan-erespon";
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

const DashboardTile = ({ label, value, Icon, pattern }: any) => (
  <div
    className={`${pattern} rounded-md p-3 sm:p-4 text-white shadow-sm ring-1 ring-white/10 transition`}
  >
    <div className="flex items-center justify-between gap-2 sm:gap-3">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-white/20 dark:bg-white/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-xl sm:text-sm font-semibold uppercase opacity-90 truncate">
          {label}
        </div>
      </div>
      <div
        className="text-xl sm:text-2xl font-bold tabular-nums text-right"
        suppressHydrationWarning
      >
        {Number(value).toLocaleString("id-ID")}
      </div>
    </div>
  </div>
);
export default function DataEresponMasterData() {
  const { data: masterData, isLoading: isLoadingMasterData } =
    usePengaduanEresponMasterData();

  return (
    <div className="w-full h-full">
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="Data pengaduan masyarakat"
        description={
          <>
            Last update:{" "}
            <span suppressHydrationWarning>{masterData?.last_get ?? ""}</span>
            <br />
            <span className="italic text-xs">(Sumber : E-Respon)</span>
          </>
        }
        action={
          <ModalDetail
            title="Detail Data Pengaduan Masyarakat"
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
              <div className="h-full w-full">
                <LayoutCard
                  className="bg-transparent p-0"
                  ratioDesktop={0.42}
                  ratioMobile={0.32}
                >
                  <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Kiri: Master */}
                    <div className="flex min-h-0 flex-col">
                      <div className="">
                        <h2 className="text-base sm:text-xl font-semibold text-gray-800 dark:text-white mb-3">
                          Ringkasan Pengajuan
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-3">
                          {summaryTiles.map((tile, idx) => (
                            <DashboardTile
                              key={idx}
                              {...tile}
                              pattern={
                                Number(tile.value || 0) > 0
                                  ? getPatternByKey(tile.label)
                                  : NEUTRAL_PATTERN
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Kanan: Aduan */}
                    <div className="flex min-h-0 flex-col">
                      <div className="">
                        <h2 className="text-base sm:text-xl font-semibold text-gray-800 dark:text-white mb-3">
                          Status Detail
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                          {statusTiles.map((tile, idx) => (
                            <DashboardTile
                              key={idx}
                              {...tile}
                              pattern={
                                Number(tile.value || 0) > 0
                                  ? getPatternByKey(tile.label)
                                  : NEUTRAL_PATTERN
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
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
