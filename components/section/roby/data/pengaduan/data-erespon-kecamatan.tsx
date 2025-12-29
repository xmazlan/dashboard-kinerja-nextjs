"use client";
import { cn } from "@/lib/utils";
import CardComponent from "@/components/card/card-component";
import {
  usePengaduanEresponKecamtanData,
  usePengaduanEresponOpdData,
} from "@/hooks/query/use-pengaduan-erespon";
import LoadingSkeleton from "@/components/loading-skeleton";
import { Info, Tags } from "lucide-react";
import { getGradientStyleByKey } from "@/components/patern-collor";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import LoadingContent from "../loading-content";

export default function DataEresponKecamatan() {
  const { data: kecamatanData, isLoading: isLoadingKecamatanData } =
    usePengaduanEresponKecamtanData();

  return (
    <div className="w-full h-full">
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="Data pengaduan masyarakat (Kecamatan)"
        description={
          <>
            Last update:{" "}
            <span suppressHydrationWarning>
              {kecamatanData?.last_get ?? ""}
            </span>
            <br />
            <span className="italic text-xs">(Sumber : E-Respone)</span>
          </>
        }
      >
        {isLoadingKecamatanData ? (
          <LoadingContent />
        ) : (
          (() => {
            const list = Array.isArray(kecamatanData?.data)
              ? kecamatanData?.data
              : [];
            return (
              <div className="h-full flex flex-col">
                {list.length === 0 ? (
                  <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                    Tidak ada data
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-3 h-full flex-1">
                    {list.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className={cn(
                          "rounded-md p-4 border-primary text-white h-full shadow-sm ring-1 ring-white/10 transition hover:shadow-md hover:brightness-105"
                        )}
                        style={getGradientStyleByKey(
                          String(item?.nama_kec || "-")
                        )}
                      >
                        <div className="flex items-center justify-between gap-3 min-h-11.25">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center">
                              <Info className="w-5 h-5" />
                            </div>
                            <div
                              className="text-[11px] md:text-xs font-semibold uppercase opacity-90 truncate"
                              title={String(item?.nama_kec || "-")}
                            >
                              {String(item?.nama_kec || "-")}
                            </div>
                          </div>
                          <div className="text-2xl md:text-3xl font-extrabold tracking-tight text-right">
                            <span
                              className="tabular-nums font-mono bg-black/20 rounded-md px-2 py-0.5"
                              suppressHydrationWarning
                            >
                              {Number(item?.total || 0).toLocaleString("id-ID")}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 w-full">
                          <div className="rounded-md bg-white/15 px-2 py-2">
                            <div className="flex items-center gap-1 text-[10px] md:text-xs opacity-90">
                              <span className="inline-block h-2 w-2 rounded-sm bg-amber-400" />
                              <span>Belum</span>
                            </div>
                            <div className="text-lg md:text-xl font-bold text-white">
                              <span
                                className="font-mono tabular-nums"
                                suppressHydrationWarning
                              >
                                {Number(item?.belum || 0).toLocaleString(
                                  "id-ID"
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="rounded-md bg-white/15 px-2 py-2">
                            <div className="flex items-center gap-1 text-[10px] md:text-xs opacity-90">
                              <span className="inline-block h-2 w-2 rounded-sm bg-orange-500" />
                              <span>Sedang</span>
                            </div>
                            <div className="text-lg md:text-xl font-bold text-white">
                              <span
                                className="font-mono tabular-nums"
                                suppressHydrationWarning
                              >
                                {Number(item?.sedang || 0).toLocaleString(
                                  "id-ID"
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="rounded-md bg-white/15 px-2 py-2">
                            <div className="flex items-center gap-1 text-[10px] md:text-xs opacity-90">
                              <span className="inline-block h-2 w-2 rounded-sm bg-emerald-500" />
                              <span>Selesai</span>
                            </div>
                            <div className="text-lg md:text-xl font-bold text-white">
                              <span
                                className="font-mono tabular-nums"
                                suppressHydrationWarning
                              >
                                {Number(item?.selesai || 0).toLocaleString(
                                  "id-ID"
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="rounded-md bg-white/15 px-2 py-2">
                            <div className="flex items-center gap-1 text-[10px] md:text-xs opacity-90">
                              <span className="inline-block h-2 w-2 rounded-sm bg-rose-500" />
                              <span>Pending</span>
                            </div>
                            <div className="text-lg md:text-xl font-bold text-white">
                              <span
                                className="font-mono tabular-nums"
                                suppressHydrationWarning
                              >
                                {Number(item?.pending || 0).toLocaleString(
                                  "id-ID"
                                )}
                              </span>
                            </div>
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
