"use client";
import React from "react";
import { cn } from "@/lib/utils";
import CardComponent from "@/components/card/card-component";
import { usePengaduanEresponOpdData } from "@/hooks/query/use-pengaduan-erespon";
import LoadingSkeleton from "@/components/loading-skeleton";
import { Info, Tags } from "lucide-react";
import { getPatternByKey, NEUTRAL_PATTERN } from "@/components/patern-collor";
import LoadingContent from "../loading-content";

export default function DataEresponOpd() {
  const { data: opdData, isLoading: isLoadingOpdData } =
    usePengaduanEresponOpdData();

  return (
    <div className="w-full h-full">
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="Layanan pengaduan masyarakat (OPD)"
        description={
          <>
            Last update: {opdData?.last_get ?? ""}
            <br />
            <span className="italic text-xs">(Sumber : E-Respone)</span>
          </>
        }
      >
        {isLoadingOpdData ? (
          <LoadingContent />
        ) : (
          (() => {
            const list = Array.isArray(opdData?.data) ? opdData?.data : [];
            return (
              <div className="h-[50px] flex flex-col">
                {list.length === 0 ? (
                  <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                    Tidak ada data
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[50px] flex-1">
                    {list.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className={cn(
                          "rounded-md p-4 text-white h-full shadow-sm ring-1 ring-white/10 transition hover:shadow-md hover:brightness-105",
                          Number(item?.total_jenis_aduan || 0) > 0
                            ? getPatternByKey(item?.opd_nama)
                            : NEUTRAL_PATTERN
                        )}
                      >
                        <div className="flex items-center justify-between gap-3 min-h-[92px]">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center">
                              <Info className="w-5 h-5" />
                            </div>
                            <div
                              className="text-[11px] md:text-xs font-semibold uppercase opacity-90 truncate"
                              title={String(item?.opd_nama || "-")}
                            >
                              {String(item?.opd_nama || "-")}
                            </div>
                          </div>
                          <div className="text-xl md:text-2xl font-bold tabular-nums text-right">
                            {Number(
                              item?.total_jenis_aduan || 0
                            ).toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()
        )}
      </CardComponent>
    </div>
  );
}
