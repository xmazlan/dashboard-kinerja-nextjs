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

export default function SectionCapilIkd() {
  const { data: dataRespon, isLoading: isLoadingData } = useCapilIkdData();

  return (
    <CardComponent
      className="shadow-lg p-2"
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
        <div className="space-y-3">
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-md p-3 bg-card border shadow-sm flex items-center justify-between"
                >
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-md p-3 bg-card border shadow-sm flex items-center justify-between"
                >
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="md:col-span-3">
                <div className="relative rounded-xl bg-card border p-4 shadow-sm">
                  <ShineBorder shineColor={["#2563eb", "#1e40af", "#FE6500"]} />
                  <div className="flex items-center gap-2 mb-2">
                    <IconListDetails className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">
                      Layanan
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {layanan.map((it, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "rounded-md p-3 text-white shadow-sm ring-1 ring-white/10 flex items-center justify-between transition hover:shadow-md hover:brightness-105",
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

              <div className="md:col-span-2">
                <div className="relative rounded-xl bg-card border p-4 shadow-sm">
                  <ShineBorder shineColor={["#2563eb", "#1e40af", "#FE6500"]} />
                  <div className="flex items-center gap-2 mb-2">
                    <IconListDetails className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">
                      Blanko
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {blanko.map((it, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "rounded-md p-3 text-white shadow-sm ring-1 ring-white/10 flex items-center justify-between transition hover:shadow-md hover:brightness-105",
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
          );
        })()
      )}
    </CardComponent>
  );
}
