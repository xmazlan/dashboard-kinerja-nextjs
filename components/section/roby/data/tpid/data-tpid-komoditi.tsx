import React from "react";
import { cn } from "@/lib/utils";
import CardComponent from "@/components/card/card-component";
import LoadingSkeleton from "@/components/loading-skeleton";
import { getPatternByKey, NEUTRAL_PATTERN } from "@/components/patern-collor";

import { useTpidKomoditiData } from "@/hooks/query/use-tpid";
import { ModalDetail } from "@/components/modal/detail-modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DataTpidKomoditiDetail from "./data-tpid-komoditi-detail";
import DataTpidPasar from "./data-tpid-pasar";
import { ShineBorder } from "@/components/magicui/shine-border";
import Image from "next/image";
import OptimizeImage from "@/components/optimize-image";
export default function DataTpidKomoditi() {
  const { data: masterData, isLoading: isLoadingMasterData } =
    useTpidKomoditiData();

  const toNum = (v: any) => Number(v ?? 0);
  const cleanUrl = (s: any) =>
    String(s ?? "")
      .replace(/`/g, "")
      .trim();

  return (
    <div className="w-full h-full">
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="Layanan Tim Pengendalian Inflasi Daerah (Komoditi)"
        description={
          <>
            Last update: {masterData?.last_get ?? ""}
            <br />
            <span className="italic text-xs">(Sumber : TPID)</span>
          </>
        }
        action={
          <ModalDetail
            title="Detail Layanan Tim Pengendalian Inflasi Daerah (Komoditi)"
            description="Ringkasan dan detail per kategori. Gulir untuk melihat semua informasi."
            contentModal={
              <Tabs defaultValue="detail" className="flex flex-col gap-3">
                <TabsList>
                  <TabsTrigger value="detail">Detail</TabsTrigger>
                  <TabsTrigger value="pasar">Pasar</TabsTrigger>
                </TabsList>
                <div className="h-[60vh] overflow-y-auto rounded-lg border">
                  <TabsContent value="detail" className="p-3">
                    <DataTpidKomoditiDetail />
                  </TabsContent>
                  <TabsContent value="pasar" className="p-3">
                    <DataTpidPasar />
                  </TabsContent>
                </div>
              </Tabs>
            }
          />
        }
      >
        {isLoadingMasterData ? (
          <LoadingSkeleton rows={2} cols={4} />
        ) : (
          (() => {
            const items: Array<any> = (masterData?.data ?? []) as any[];
            const itemsSorted = [...items].sort((a, b) => {
              const ak = toNum(
                a?.harga_per_satuan_komoditas?.KG?.harga_rata_rata
              );
              const bk = toNum(
                b?.harga_per_satuan_komoditas?.KG?.harga_rata_rata
              );
              return bk - ak;
            });

            return (
              <div className="h-full flex flex-col space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 h-full flex-1">
                  {itemsSorted.map((it) => {
                    const kg = it?.harga_per_satuan_komoditas?.KG ?? {};
                    const hargaRata = toNum(kg?.harga_rata_rata);
                    const hargaMurah = toNum(kg?.harga_termurah);
                    const hargaMahal = toNum(kg?.harga_termahal);
                    const status = String(kg?.status ?? "");
                    const imgSrc = cleanUrl(it?.gambar);
                    const hargaPerPasar = kg?.harga_per_pasar ?? {};

                    return (
                      <div
                        key={it.id}
                        className="relative rounded-lg border bg-card text-card-foreground shadow-sm p-3 flex flex-col gap-2"
                      >
                        <ShineBorder
                          shineColor={["#2563eb", "#1e40af", "#FE6500"]}
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <OptimizeImage
                              src={imgSrc}
                              alt={String(it?.nama_komoditas || "-")}
                              width={28}
                              height={28}
                              containerClassName="w-7 h-7 rounded-sm bg-muted"
                              imgClassName="rounded-sm object-contain"
                            />
                            <div>
                              <div className="text-[12px] md:text-sm font-semibold">
                                {it.nama_komoditas}
                              </div>
                              <div className="text-[10px] opacity-70">
                                Satuan: KG • Tgl: {kg?.tgl ?? "-"}
                              </div>
                            </div>
                          </div>
                          <span
                            className={cn(
                              "inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-semibold text-white",
                              status ? getPatternByKey(status) : NEUTRAL_PATTERN
                            )}
                          >
                            {status || "-"}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div
                            className={cn(
                              "rounded-lg p-2 text-white",
                              getPatternByKey("Rata-rata")
                            )}
                          >
                            <div className="text-[10px] uppercase opacity-90">
                              Rata-rata
                            </div>
                            <div className="text-sm font-bold tabular-nums">
                              {hargaRata.toLocaleString("id-ID")}
                            </div>
                          </div>
                          <div
                            className={cn(
                              "rounded-lg p-2 text-white",
                              getPatternByKey("Termurah")
                            )}
                          >
                            <div className="text-[10px] uppercase opacity-90">
                              Termurah
                            </div>
                            <div className="text-sm font-bold tabular-nums">
                              {hargaMurah.toLocaleString("id-ID")}
                            </div>
                            <div className="text-[10px] opacity-80">
                              {kg?.pasar_termurah ?? "-"}
                            </div>
                          </div>
                          <div
                            className={cn(
                              "rounded-lg p-2 text-white",
                              getPatternByKey("Termahal")
                            )}
                          >
                            <div className="text-[10px] uppercase opacity-90">
                              Termahal
                            </div>
                            <div className="text-sm font-bold tabular-nums">
                              {hargaMahal.toLocaleString("id-ID")}
                            </div>
                            <div className="text-[10px] opacity-80">
                              {kg?.pasar_termahal ?? "-"}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()
        )}
      </CardComponent>
    </div>
  );
}
