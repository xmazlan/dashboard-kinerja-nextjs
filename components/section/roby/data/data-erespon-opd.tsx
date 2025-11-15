import React from "react";
import { cn } from "@/lib/utils";
import CardComponent from "@/components/card/card-component";
import { usePengaduanEresponOpdData } from "@/hooks/query/use-pengaduan-erespon";
import LoadingSkeleton from "@/components/loading-skeleton";
import { Tags } from "lucide-react";

export default function DataEresponOpd() {
  const { data: opdData, isLoading: isLoadingOpdData } =
    usePengaduanEresponOpdData();

  return (
    <div className="w-full h-full">
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="Layanan pengaduan masyarakat"
        description={opdData?.last_get ?? ""}
      >
        {isLoadingOpdData ? (
          <LoadingSkeleton rows={1} cols={5} />
        ) : (
          (() => {
            const list = Array.isArray(opdData?.data) ? opdData?.data : [];
            return (
              <div className="h-full flex flex-col">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 h-full flex-1">
                  {list.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className={cn(
                        "rounded-md p-4 text-white h-full",
                        Number(item?.total_jenis_aduan || 0) > 0
                          ? "bg-blue-700"
                          : "bg-slate-700"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center">
                            <Tags className="w-5 h-5" />
                          </div>
                          <div className="text-[11px] md:text-xs font-semibold uppercase opacity-90">
                            {String(item?.opd_nama || "-")}
                          </div>
                        </div>
                        <div className="text-xl md:text-2xl font-bold">
                          {Number(item?.total_jenis_aduan || 0).toLocaleString(
                            "id-ID"
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()
        )}
      </CardComponent>
    </div>
  );
}
