"use client";

import React from "react";

export const description = "Table view of yearly merit scores";

const charts = [
  { year: "2024", value: 393, label: "Sangat Baik", color: "#3b82f6" },
  { year: "2023", value: 341.5, label: "Sangat Baik", color: "#34d399" },
  { year: "2025", value: 256, label: "Baik", color: "#8b5cf6" },
];

export function ChartRadialSistemMerit() {
  return (
    <>
      <div className="w-full h-full">
        <div className="grid grid-cols-3 gap-3 w-full h-full">
          {charts.map((c, idx) => (
            <div
              key={idx}
              className="rounded-md flex flex-col items-center justify-center text-center w-full h-full"
              style={{ backgroundColor: c.color }}
            >
              <div className="text-white text-3xl font-bold">{c.value}</div>
              <div className="text-white/90 text-sm font-semibold">{c.label}</div>
              <div className="mt-2">
                <span className="rounded-full bg-white/20 text-white px-3 py-1 text-xs font-semibold">
                  {c.year}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
