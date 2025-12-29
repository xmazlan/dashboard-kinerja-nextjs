import { cn } from "@/lib/utils";
import CardComponent from "@/components/card/card-component";
import { useStuntingSweeperData } from "@/hooks/query/use-stuntingsweeper";
import { getPatternByKey } from "@/components/patern-collor";
import { ShineBorder } from "@/components/magicui/shine-border";
import LoadingContent from "../loading-content";
import LayoutCard from "@/components/card/layout-card";

export default function DataStuntingSlide() {
  const { data: apiData, isLoading: isLoadingApiData } =
    useStuntingSweeperData();
  const totalBalita = Number(apiData?.data?.totalBalita ?? 0);
  const bbu = apiData?.data?.status?.bbu ?? {};
  const tbu = apiData?.data?.status?.tbu ?? {};
  const bbtb = apiData?.data?.status?.bbtb ?? {};
  const bbuEntries = Object.entries(bbu).map(([k, v]) => ({
    label: k,
    value: Number(v),
  }));
  const tbuEntries = Object.entries(tbu).map(([k, v]) => ({
    label: k,
    value: Number(v),
  }));
  const bbtbEntries = Object.entries(bbtb).map(([k, v]) => ({
    label: k,
    value: Number(v),
  }));
  const sum = (arr: { value: number }[]) =>
    arr.reduce((a, c) => a + c.value, 0);
  const sumBBU = sum(bbuEntries);
  const sumTBU = sum(tbuEntries);
  const sumBBTB = sum(bbtbEntries);
  const percent = (v: number, s: number) =>
    s > 0 ? Math.round((v / s) * 100) : 0;
  const colorMapBBU: Record<string, string> = {
    "BB Sangat Kurang": "bg-rose-500",
    "BB Kurang": "bg-orange-500",
    "BB Normal": "bg-emerald-500",
    "Resiko BB Lebih": "bg-amber-500",
  };
  const colorMapTBU: Record<string, string> = {
    "Sangat Pendek": "bg-rose-500",
    Pendek: "bg-orange-500",
    Normal: "bg-emerald-500",
    Tinggi: "bg-cyan-500",
    Stunting: "bg-red-600",
  };
  const colorMapBBTB: Record<string, string> = {
    "Gizi Buruk": "bg-rose-500",
    "Gizi Kurang": "bg-orange-500",
    "Gizi Baik": "bg-emerald-500",
    "Berisiko Gizi Lebih": "bg-amber-500",
    "Gizi Lebih": "bg-yellow-500",
    Obesitas: "bg-red-600",
  };
  const percentTotal = (v: number) => percent(v, totalBalita);
  const sortDesc = (arr: { label: string; value: number }[]) =>
    [...arr].sort((a, b) => b.value - a.value);
  const bbuSorted = sortDesc(bbuEntries);
  const tbuSorted = sortDesc(tbuEntries);
  const tbuNonStuntingSorted = sortDesc(
    tbuEntries.filter((e) => e.label !== "Stunting")
  );
  const bbtbSorted = sortDesc(bbtbEntries);

  return (
    <div className="w-full h-full">
      <CardComponent className="p-0  border-none shadow-none w-full h-full">
        {isLoadingApiData ? (
          <LoadingContent />
        ) : (
          (() => {
            return (
              <div className="h-full flex flex-col space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full flex-1">
                  <div
                    className={cn(
                      "rounded-lg p-4 text-white h-full shadow-sm ring-1 ring-white/10 transition hover:shadow-md hover:brightness-105",
                      getPatternByKey("Total Balita")
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm md:text-xl font-semibold uppercase opacity-90">
                          Total Balita
                        </div>
                        <div className="text-sm md:text-sm opacity-80">
                          Data Balita Terdata
                        </div>
                      </div>
                      <div
                        className="text-base md:text-lg font-bold tabular-nums"
                        suppressHydrationWarning
                      >
                        {totalBalita.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "rounded-lg p-4 text-white h-full shadow-sm ring-1 ring-white/10 transition hover:shadow-md hover:brightness-105",
                      getPatternByKey("BBU")
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm md:text-xl font-semibold uppercase opacity-90">
                          BBU
                        </div>
                        <div className="text-sm md:text-sm opacity-80">
                          Berat Badan menurut Umur
                        </div>
                      </div>
                      <div
                        className="text-base md:text-lg font-bold tabular-nums"
                        suppressHydrationWarning
                      >
                        {sumBBU.toLocaleString("id-ID")}
                      </div>
                    </div>
                    {/* <div className="mt-2 h-1.5 rounded-lg overflow-hidden ring-1 ring-white/20 flex">
                      {bbuEntries.map((e) => (
                        <div
                          key={e.label}
                          style={{ width: `${percent(e.value, sumBBU)}%` }}
                          className={cn(colorMapBBU[e.label] || "bg-primary")}
                        />
                      ))}
                    </div>
                    <div className="mt-1 text-sm md:text-sm opacity-80">
                      Dominan: {bbuSorted[0]?.label}{" "}
                      {percent(bbuSorted[0]?.value || 0, sumBBU)}%
                    </div> */}
                  </div>
                  <div
                    className={cn(
                      "rounded-lg p-4 text-white h-full shadow-sm ring-1 ring-white/10 transition hover:shadow-md hover:brightness-105",
                      getPatternByKey("TBU")
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm md:text-xl font-semibold uppercase opacity-90">
                          TBU
                        </div>
                        <div className="text-sm md:text-sm opacity-80">
                          Tinggi Badan menurut Umur
                        </div>
                      </div>
                      <div
                        className="text-base md:text-lg font-bold tabular-nums"
                        suppressHydrationWarning
                      >
                        {sumTBU.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "rounded-lg p-4 text-white h-full shadow-sm ring-1 ring-white/10 transition hover:shadow-md hover:brightness-105",
                      getPatternByKey("BBTB")
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm md:text-xl font-semibold uppercase opacity-90">
                          BBTB
                        </div>
                        <div className="text-sm md:text-sm opacity-80">
                          Berat Badan menurut Tinggi Badan
                        </div>
                      </div>
                      <div
                        className="text-base md:text-lg font-bold tabular-nums"
                        suppressHydrationWarning
                      >
                        {sumBBTB.toLocaleString("id-ID")}
                      </div>
                    </div>
                    {/* <div className="mt-2 h-1.5 rounded-lg overflow-hidden ring-1 ring-white/20 flex">
                      {bbtbEntries.map((e) => (
                        <div
                          key={e.label}
                          style={{ width: `${percent(e.value, sumBBTB)}%` }}
                          className={cn(colorMapBBTB[e.label] || "bg-primary")}
                        />
                      ))}
                    </div>
                    <div className="mt-1 text-sm md:text-sm opacity-80">
                      Dominan: {bbtbSorted[0]?.label}{" "}
                      {percent(bbtbSorted[0]?.value || 0, sumBBTB)}%
                    </div> */}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-full flex-1">
                  {[
                    {
                      key: "BBU",
                      keyLabel: "Berat Badan menurut Umur",
                      entries: bbuSorted,
                      sum: sumBBU,
                      colorMap: colorMapBBU,
                    },
                    {
                      key: "TBU",
                      keyLabel: "Tinggi Badan menurut Umur",
                      entries: tbuSorted,
                      sum: sumTBU,
                      colorMap: colorMapTBU,
                    },
                    {
                      key: "BBTB",
                      keyLabel: "Berat Badan menurut Tinggi Badan",
                      entries: bbtbSorted,
                      sum: sumBBTB,
                      colorMap: colorMapBBTB,
                    },
                  ].map((section) => (
                    <LayoutCard
                      key={section.key}
                      className="relative bg-card rounded-lg shadow-sm p-2 border"
                      ratioDesktop={0.5}
                      ratioMobile={0.38}
                    >
                      <div className="flex h-full flex-col">
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-semibold">
                            {section.key}{" "}
                            <p className="text-sm md:text-sm opacity-80 italic">
                              {section.keyLabel}
                            </p>
                          </div>
                          <div
                            className="text-lg font-bold tabular-nums"
                            suppressHydrationWarning
                          >
                            {section.sum.toLocaleString("id-ID")}
                          </div>
                        </div>
                        <div className="flex-1 min-h-0 grid grid-cols-2 gap-4">
                          {section.entries.map((e) => (
                            <div
                              key={e.label}
                              className={cn(
                                "rounded-lg p-2 border flex items-center justify-between text-white",
                                getPatternByKey(e.label)
                              )}
                            >
                              <div
                                className="text-lg font-semibold truncate"
                                title={e.label}
                              >
                                {e.label}
                              </div>
                              <div
                                className="text-lg font-mono font-semibold tabular-nums"
                                suppressHydrationWarning
                              >
                                {e.value.toLocaleString("id-ID")}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </LayoutCard>
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
