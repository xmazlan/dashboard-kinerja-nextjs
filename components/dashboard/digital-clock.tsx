"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type DigitalClockProps = {
  className?: string;
  label?: string;
  tickMs?: number;
  resyncMs?: number;
  variant?: "navbar" | "hero";
};

export default function DigitalClock({
  className,
  label = "WIB",
  tickMs = 1000,
  resyncMs = 60000,
  variant = "navbar",
}: DigitalClockProps) {
  const [serverOffset, setServerOffset] = useState(0);
  const [nowMs, setNowMs] = useState<number>(0);

  useEffect(() => {
    const sync = async () => {
      try {
        const r = await fetch("/api/time", { cache: "no-store" });
        const j = await r.json();
        const serverMs = new Date(j.serverTime).getTime();
        setServerOffset(serverMs - Date.now());
      } catch {}
    };
    sync();
    const tick = setInterval(() => setNowMs(Date.now()), tickMs);
    const resync = setInterval(sync, resyncMs);
    return () => {
      clearInterval(tick);
      clearInterval(resync);
    };
  }, [tickMs, resyncMs]);

  const current = useMemo(
    () => new Date(nowMs + serverOffset),
    [nowMs, serverOffset]
  );

  const parts = useMemo(() => {
    const ps = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(current);
    const get = (t: string) => ps.find((p) => p.type === t)?.value ?? "00";
    return { hh: get("hour"), mm: get("minute"), ss: get("second") };
  }, [current]);

  const dateText = useMemo(() => {
    return new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(current);
  }, [current]);

  const renderDigits = (text: string) => (
    <div className="flex items-center gap-[2px]">
      <AnimatePresence initial={false} mode="popLayout">
        {text.split("").map((ch, idx) => (
          <motion.span
            key={`${idx}-${ch}`}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="inline-block font-mono tabular-nums tracking-wider min-w-[1ch] text-white"
          >
            {ch}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.div
      className={`px-3 py-1 rounded-lg ${
        variant === "hero"
          ? "bg-transparent ring-0"
          : "bg-linear-to-r from-blue-600/20 to-purple-600/20 ring-1 ring-border backdrop-blur"
      } flex flex-col items-start gap-1 ${className ?? ""}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
    >
      <motion.span
        key={dateText}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`${
          variant === "hero" ? "text-xs sm:text-sm" : "text-[11px] sm:text-xs"
        } text-white/90`}
      >
        {dateText}
      </motion.span>
      <div className="flex items-center gap-2">
        <div className={`${variant === "hero" ? "text-xl md:text-2xl" : "text-sm"}`}>{renderDigits(parts.hh)}</div>
        <motion.span
          className={`font-mono tabular-nums tracking-wider text-white ${
            variant === "hero" ? "text-xl md:text-2xl" : "text-sm"
          }`}
          animate={{ opacity: Number(parts.ss) % 2 === 0 ? 1 : 0.35 }}
          transition={{ duration: 0.15 }}
        >
          :
        </motion.span>
        <div className={`${variant === "hero" ? "text-xl md:text-2xl" : "text-sm"}`}>{renderDigits(parts.mm)}</div>
        <span
          className={`hidden sm:inline font-mono tabular-nums tracking-wider text-white ${
            variant === "hero" ? "text-xl md:text-2xl" : "text-sm"
          }`}
        >
          :{parts.ss}
        </span>
        <span className="ml-2 text-[10px] uppercase text-white">{label}</span>
      </div>
    </motion.div>
  );
}
