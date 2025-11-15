import React from "react";
import { cn } from "@/lib/utils";
import CardComponent from "@/components/card/card-component";
import { usePengaduanEresponMasterData } from "@/hooks/query/use-pengaduan-erespon";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function DataEresponMasterData() {
  const chartPausedRef = React.useRef(false);
  const { data: masterData, isLoading: isLoadingMasterData } =
    usePengaduanEresponMasterData();
  const contentPausedRef = React.useRef(false);

  return (
    <div className="w-full h-full">
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="Layanan pengaduan masyarakat"
        description={masterData?.last_get ?? ""}
      >
        {isLoadingMasterData ? (
          <LoadingSkeleton rows={2} cols={4} />
        ) : (() => {
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 h-full flex-1">
                {summaryTiles.map((t, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "rounded-md p-4 text-white flex items-center justify-between h-full",
                      t.bg
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
                    <div className="text-xl md:text-2xl font-bold tracking-wide">
                      {t.value.toLocaleString("id-ID")}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 h-full flex-1">
                {statusTiles.map((c, idx) => (
                  <div
                    key={idx}
                    className={cn("rounded-md p-4 text-white h-full", c.bg)}
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
                      <div className="text-xl md:text-2xl font-bold">
                        {c.value.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </CardComponent>
    </div>
  );
}

export type LoadingSkeletonProps = {
  rows?: number;
  cols?: number;
  className?: string;
  tileClassName?: string;
  showHeader?: boolean;
  headerLines?: number;
};

export function LoadingSkeleton({
  rows = 2,
  cols = 4,
  className,
  tileClassName,
  showHeader = false,
  headerLines = 1,
}: LoadingSkeletonProps) {
  const total = rows * cols;
  const tiles = Array.from({ length: total });
  return (
    <div className={cn("h-full flex flex-col space-y-3", className)}>
      {showHeader && (
        <div className="flex items-center justify-between px-1">
          <Skeleton className="h-5 w-40" />
          {Array.from({ length: headerLines }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-24" />
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 h-full flex-1">
        {tiles.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "rounded-md p-4 h-full bg-muted/10",
              tileClassName
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-md" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
