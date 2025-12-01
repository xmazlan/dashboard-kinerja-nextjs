import React from "react";
import { cn } from "@/lib/utils";
import { getPatternByKey } from "@/components/patern-collor";
import { ShineBorder } from "@/components/magicui/shine-border";
import LayoutCard from "@/components/card/layout-card";

interface KecamatanItem {
  nama: string;
  totalBalita: number | string;
  gizi_buruk: number | string;
  gizi_kurang: number | string;
  gizi_baik: number | string;
  gizi_lebih: number | string;
  obesitas: number | string;
  stunting: number | string;
  bb_kurang: number | string;
}

const toNum = (v: unknown) => {
  const n = typeof v === "number" ? v : Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
};

export default function KecamatanGroupGrid({
  group,
}: {
  group: KecamatanItem[];
}) {
  return (
    <LayoutCard
      ratioDesktop={0.5}
      ratioMobile={0.38}
      className="bg-transparent p-0"
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {group.map((it, idx) => (
            <div
              key={`${it.nama}-${idx}`}
              className="relative rounded-lg border bg-card text-card-foreground shadow-sm p-2 flex flex-col gap-2 h-full"
            >
              <ShineBorder shineColor={["#2563eb", "#1e40af", "#FE6500"]} />
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold">{it.nama}</div>
                <div className="text-xs font-bold tabular-nums">
                  {toNum(it.totalBalita).toLocaleString("id-ID")}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: "Gizi Buruk", value: toNum(it.gizi_buruk) },
                  { label: "Gizi Kurang", value: toNum(it.gizi_kurang) },
                  { label: "Gizi Baik", value: toNum(it.gizi_baik) },
                  { label: "Gizi Lebih", value: toNum(it.gizi_lebih) },
                  { label: "Obesitas", value: toNum(it.obesitas) },
                  { label: "Stunting", value: toNum(it.stunting) },
                  { label: "BB Kurang", value: toNum(it.bb_kurang) },
                ].map((e) => (
                  <div
                    key={e.label}
                    className={cn(
                      "rounded-lg p-2 border flex items-center justify-between text-white",
                      getPatternByKey(e.label)
                    )}
                  >
                    <div
                      className="text-[12px] font-medium truncate"
                      title={e.label}
                    >
                      {e.label}
                    </div>
                    <div className="text-[12px] font-mono font-semibold tabular-nums">
                      {e.value.toLocaleString("id-ID")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </LayoutCard>
  );
}
