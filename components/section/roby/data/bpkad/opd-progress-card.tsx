"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { getPatternByKey, NEUTRAL_PATTERN } from "@/components/patern-collor";
import { ShineBorder } from "@/components/magicui/shine-border";

interface Props {
  opdName: string;
  percentage: number;
  realisasi: number;
  pagu: number;
  className?: string;
}

export default function OPDProgressCard({
  opdName,
  percentage,
  realisasi,
  pagu,
  className,
}: Props) {
  const pct = Number(percentage ?? 0);
  const real = Number(realisasi ?? 0);
  const pg = Number(pagu ?? 0);
  return (
    <div
      className={cn(
        "rounded-md p-4 text-white shadow-sm ring-1 ring-white/10 w-full",
        getPatternByKey(opdName) || NEUTRAL_PATTERN,
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] md:text-xs font-semibold uppercase opacity-90 min-w-0 whitespace-normal wrap-break-word">
          {opdName}
        </div>
        <span className="text-sm font-bold tabular-nums">
          <span suppressHydrationWarning>{pct.toFixed(2)}%</span>
        </span>
      </div>
      <div className="mt-2 h-2 w-full rounded bg-white/20 overflow-hidden">
        <div
          className="h-full rounded bg-white/80"
          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        />
      </div>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="relative rounded-md p-2 bg-white/10">
          <ShineBorder shineColor={["#2563eb", "#1e40af", "#FE6500"]} />
          <div className="text-[10px] uppercase opacity-90">Realisasi</div>
          <div className="text-sm font-bold tabular-nums">
            <span suppressHydrationWarning>{real.toLocaleString("id-ID")}</span>
          </div>
        </div>
        <div className="relative rounded-md p-2 bg-white/10">
          <ShineBorder shineColor={["#2563eb", "#1e40af", "#FE6500"]} />
          <div className="text-[10px] uppercase opacity-90">Pagu</div>
          <div className="text-sm font-bold tabular-nums">
            <span suppressHydrationWarning>{pg.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
