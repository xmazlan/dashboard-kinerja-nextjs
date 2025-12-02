import React from "react";
import CardComponent from "@/components/card/card-component";
import { cn } from "@/lib/utils";

import LoadingSkeleton from "@/components/loading-skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useTpidPasarData } from "@/hooks/query/use-tpid";
import { ShineBorder } from "@/components/magicui/shine-border";
import { getPatternByKey } from "@/components/patern-collor";
import Image from "next/image";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import OptimizeImage from "@/components/optimize-image";
import LoadingContent from "../loading-content";

export default function DataTpidPasar() {
  const { data: masterData, isLoading: isLoadingMasterData } =
    useTpidPasarData();
  const [query, setQuery] = React.useState("");
  const [expandedAll, setExpandedAll] = React.useState(false);
  const toNum = (v: unknown) => {
    const n = typeof v === "number" ? v : Number(v ?? 0);
    return Number.isFinite(n) ? n : 0;
  };
  const cleanUrl = (s: unknown) =>
    String(s ?? "")
      .replace(/`/g, "")
      .trim();

  return (
    <div className="w-full h-full">
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="Data Pasar dan Harga Komoditas"
        description={
          <>
            Last update: {masterData?.last_get ?? ""}
            <br />
            <span className="italic text-xs">(Sumber : TPID)</span>
          </>
        }
        action={(() => {
          const totalPasar = Array.isArray(masterData?.data)
            ? (masterData?.data as unknown[]).length
            : 0;
          return (
            <div className="flex items-center gap-2">
              <InputGroup>
                <InputGroupAddon>
                  <Search className="h-4 w-4" />
                </InputGroupAddon>
                <InputGroupInput
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari nama pasar..."
                  className="w-[220px] md:w-[280px]"
                />
              </InputGroup>
              <Badge variant="outline">Total pasar: {totalPasar}</Badge>
            </div>
          );
        })()}
      >
        {isLoadingMasterData ? (
          <LoadingContent />
        ) : (
          (() => {
            interface TpidCommodity {
              nama_komoditas?: string;
              satuan?: string;
              harga?: number | string;
              gambar?: string;
              category?: string;
            }
            interface TpidMarket {
              nama_pasar?: string;
              address?: string;
              harga_komoditas?: TpidCommodity[];
            }

            const markets: TpidMarket[] = Array.isArray(masterData?.data)
              ? (masterData?.data as unknown as TpidMarket[])
              : [];
            const filtered = markets
              .map((m) => {
                const list: TpidCommodity[] = Array.isArray(m?.harga_komoditas)
                  ? (m.harga_komoditas as TpidCommodity[])
                  : [];
                const items = list
                  .map((c: TpidCommodity, idx: number) => ({
                    key: `${m?.nama_pasar ?? "-"}-${c?.nama_komoditas ?? "-"}-${
                      c?.satuan ?? "-"
                    }-${idx}`,
                    komoditas: String(c?.nama_komoditas || "-"),
                    satuan: String(c?.satuan || "-"),
                    harga: toNum(c?.harga),
                    img: cleanUrl(c?.gambar),
                  }))
                  .sort((a, b) => a.komoditas.localeCompare(b.komoditas));
                return {
                  nama_pasar: String(m?.nama_pasar || "-"),
                  address: String(m?.address || "-"),
                  items,
                };
              })
              .filter((m) =>
                m.nama_pasar.toLowerCase().includes(query.toLowerCase())
              )
              .sort((a, b) => a.nama_pasar.localeCompare(b.nama_pasar));

            if (filtered.length === 0) {
              return (
                <div className="w-full text-center text-muted-foreground py-6">
                  Tidak ada data
                </div>
              );
            }

            const FIRST_N = 8;
            return (
              <div className="h-full flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2  gap-3">
                  {filtered.map((mkt, idx) => {
                    const head = mkt.items.slice(0, FIRST_N);
                    const tail = mkt.items.slice(FIRST_N);
                    return (
                      <div
                        key={`${mkt.nama_pasar}-${idx}`}
                        className="relative rounded-lg border bg-card text-card-foreground shadow-sm p-3 flex flex-col gap-2"
                        title={`${mkt.nama_pasar} — ${mkt.address}`}
                      >
                        <ShineBorder
                          shineColor={["#2563eb", "#1e40af", "#FE6500"]}
                        />
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-[12px] md:text-sm font-semibold truncate">
                              {mkt.nama_pasar}
                            </div>
                            <div className="text-[10px] opacity-70 truncate">
                              {mkt.address}
                            </div>
                          </div>
                          <Badge className="shrink-0" variant="secondary">
                            {mkt.items.length} komoditas
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                          {head.map((it) => (
                            <div
                              key={it.key}
                              className={cn(
                                "rounded-md p-2 border flex items-center justify-between gap-2 text-white",
                                getPatternByKey(it.komoditas)
                              )}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <OptimizeImage
                                  src={it.img}
                                  alt={String(it?.komoditas || "-")}
                                  width={32}
                                  height={32}
                                  containerClassName="w-7 h-7 rounded-sm bg-muted overflow-hidden"
                                  imgClassName="rounded-sm object-cover w-full h-full"
                                />
                                <div className="min-w-0">
                                  <div className="text-[12px] font-medium truncate">
                                    {it.komoditas}
                                  </div>
                                  <div className="text-[10px] opacity-70 truncate">
                                    {it.satuan}
                                  </div>
                                </div>
                              </div>
                              <div className="text-[12px] font-mono font-semibold tabular-nums">
                                {it.harga.toLocaleString("id-ID")}
                              </div>
                            </div>
                          ))}
                        </div>

                        {tail.length > 0 && (
                          <Collapsible
                            open={expandedAll}
                            onOpenChange={setExpandedAll}
                          >
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                              >
                                {expandedAll
                                  ? "Tutup komoditas"
                                  : `Lihat semua komoditas (${tail.length} lagi)`}
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                {tail.map((it) => (
                                  <div
                                    key={it.key}
                                    className={cn(
                                      "rounded-md p-2 border flex items-center justify-between gap-2 text-white",
                                      getPatternByKey(it.komoditas)
                                    )}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      {it.img ? (
                                        <OptimizeImage
                                          src={it.img}
                                          alt={String(it?.komoditas || "-")}
                                          width={32}
                                          height={32}
                                          containerClassName="w-7 h-7 rounded-sm bg-muted overflow-hidden"
                                          imgClassName="rounded-sm object-cover w-full h-full"
                                        />
                                      ) : (
                                        <div className="w-7 h-7 rounded-sm bg-muted" />
                                      )}
                                      <div className="min-w-0">
                                        <div className="text-[12px] font-medium truncate">
                                          {it.komoditas}
                                        </div>
                                        <div className="text-[10px] opacity-70 truncate">
                                          {it.satuan}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-[12px] font-mono font-semibold tabular-nums">
                                      {it.harga.toLocaleString("id-ID")}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        )}
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
