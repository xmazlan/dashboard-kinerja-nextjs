"use client";
import React from "react";
import { cn } from "@/lib/utils";

import CardComponent from "@/components/card/card-component";
import { useCapilIkdData } from "@/hooks/query/use-capil";
import { Skeleton } from "@/components/ui/skeleton";
import { getPatternByKey, NEUTRAL_PATTERN } from "@/components/patern-collor";
import {
  IconId,
  IconCertificate,
  IconLayoutGrid,
  IconListDetails,
} from "@tabler/icons-react";
import { ShineBorder } from "@/components/magicui/shine-border";
import LoadingContent from "../loading-content";
import LayoutCard from "@/components/card/layout-card";

export default function SectionCapilIkd() {
  const { data: dataRespon, isLoading: isLoadingData } = useCapilIkdData();

  return (
    <CardComponent
      className="gap-1 border-none shadow-none w-full h-full"
      title="Layanan Capil"
      description={(() => {
        const periode = String(dataRespon?.data?.Periode || "-");
        const last = String(dataRespon?.last_get || "");
        return (
          <>
            Last update: <span suppressHydrationWarning>{last || "-"}</span>
            <br />
            <span className="italic text-xs">(Sumber : IKD Capil)</span>
          </>
        );
      })()}
    >
      {isLoadingData ? (
        <LoadingContent />
      ) : (
        (() => {
          const layanan = Array.isArray(dataRespon?.data?.layanan)
            ? (dataRespon?.data?.layanan as Array<{
                nama: string;
                jumlah: number;
              }>)
            : [];
          const blanko = Array.isArray(dataRespon?.data?.blanko)
            ? (dataRespon?.data?.blanko as Array<{
                nama: string;
                jumlah: number;
              }>)
            : [];
          const isEmpty = layanan.length === 0 && blanko.length === 0;
          if (isEmpty)
            return (
              <div className="rounded-md border bg-card p-4 text-center text-sm text-muted-foreground">
                Tidak ada data
              </div>
            );
          const totalLayanan = layanan.reduce(
            (a, b) => a + Number(b?.jumlah || 0),
            0
          );
          const totalBlanko = blanko.reduce(
            (a, b) => a + Number(b?.jumlah || 0),
            0
          );
          return (
            <div className="h-full w-full grid grid-cols-1 gap-3">
              <div>
                <LayoutCard
                  className="h-full overflow-hidden rounded-xl bg-card border p-4 shadow-sm"
                  ratioDesktop={0.7}
                  ratioMobile={0.5}
                >
                  <div className="flex h-full flex-col">
                    <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-7 gap-3">
                      <div className="md:col-span-4 flex min-h-0 flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <IconListDetails className="h-4 w-4 text-muted-foreground" />
                          <h3 className="text-sm font-semibold text-foreground">
                            Layanan
                          </h3>
                        </div>
                        <div className="flex-1 min-h-0 overflow-y-auto">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {layanan.map((it, idx) => (
                              <div
                                key={idx}
                                className={cn(
                                  "rounded-md p-4 text-white shadow-sm ring-1 ring-white/10 flex items-center justify-between transition hover:shadow-md hover:brightness-105",
                                  getPatternByKey(it.nama) || NEUTRAL_PATTERN
                                )}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <IconId className="h-4 w-4 text-white opacity-90 shrink-0" />
                                  <div
                                    className="text-[11px] font-medium truncate"
                                    title={it.nama}
                                  >
                                    {it.nama}
                                  </div>
                                </div>
                                <div className="text-lg md:text-xl font-bold tabular-nums">
                                  <span suppressHydrationWarning>
                                    {Number(it.jumlah).toLocaleString("id-ID")}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-3 flex min-h-0 flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <IconListDetails className="h-4 w-4 text-muted-foreground" />
                          <h4 className="text-sm font-semibold text-foreground">
                            Blanko
                          </h4>
                        </div>
                        <div className="flex-1 min-h-0">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-1">
                            {blanko.map((it, idx) => (
                              <div
                                key={idx}
                                className={cn(
                                  "rounded-md p-4 text-white shadow-sm ring-1 ring-white/10 flex items-center justify-between transition hover:shadow-md hover:brightness-105",
                                  getPatternByKey(it.nama) || NEUTRAL_PATTERN
                                )}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <IconCertificate className="h-4 w-4 text-white opacity-90 shrink-0" />
                                  <div
                                    className="text-[11px] font-medium truncate"
                                    title={it.nama}
                                  >
                                    {it.nama}
                                  </div>
                                </div>
                                <div className="text-lg md:text-xl font-bold tabular-nums">
                                  <span suppressHydrationWarning>
                                    {Number(it.jumlah).toLocaleString("id-ID")}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </LayoutCard>
              </div>
            </div>
          );
        })()
      )}
    </CardComponent>
  );
}
