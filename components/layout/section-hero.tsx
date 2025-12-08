"use client";

import React from "react";
import { ShineBorder } from "@/components/magicui/shine-border";
import { cn } from "@/lib/utils";

type SectionHeroProps = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  shineColor?: string | string[];
  borderWidth?: number;
  duration?: number;
  className?: string;
};

export function SectionHero({
  title,
  subtitle,
  right,
  shineColor = ["#3b82f6", "#22c55e", "#f59e0b"],
  borderWidth = 2,
  duration = 12,
  className,
}: SectionHeroProps) {
  return (
    <div className={cn("relative rounded-xl border bg-card shadow-sm overflow-hidden", className)}>
      <ShineBorder borderWidth={borderWidth} duration={duration} shineColor={shineColor} />
      <div className="relative flex items-center justify-between gap-3 px-4 py-4">
        <div className="min-w-0">
          <div className="text-xl sm:text-2xl font-bold tracking-tight">{title}</div>
          {subtitle ? (
            <div className="text-sm text-muted-foreground truncate">{subtitle}</div>
          ) : null}
        </div>
        {right ? <div className="flex items-center gap-3">{right}</div> : null}
      </div>
    </div>
  );
}
