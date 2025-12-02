import React from "react";
import { useTheme } from "next-themes";
import merge from "deepmerge";
import { barChartOptions } from "@/lib/apex-chart-options";
// Props
import type { ResponseDataStatistic } from "@/types/sipuan-penari";
// Components
import CardComponent from "@/components/card/card-component";
import LoadingContent from "../roby/data/loading-content";
import BarChart from "@/components/apexchart/bar-chart";
import TableMonthly from "./table-monthly";
import TableDistrictly from "./table-districtly";
import { ModalDetail } from "@/components/modal/detail-modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Props {
  year: number | string;
  chartData: { isLoaded: boolean; data: ResponseDataStatistic };
}

export default function ChartPerikananCageCultivation({
  year,
  chartData,
}: Props) {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const title = "Data Produksi Budidaya Pembesaran Di Keramba/KJA";
  const subTitle = "Tahun " + year;

  const dataChart = chartData?.data?.cage_cultivation;

  const perComodity = Array.isArray(dataChart?.per_comodity)
    ? dataChart.per_comodity
    : [];
  const categories = perComodity.map((d) => d.label);
  const values = perComodity.map((d) => d.total);

  const options = merge(barChartOptions(isDark, title, subTitle), {
    // colors: ["#F86624"],
    plotOptions: {
      bar: {
        distributed: true,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      background: { enabled: false },
      offsetY: -6,
      formatter: (val: number) =>
        new Intl.NumberFormat("id-ID", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(val),
    },
    tooltip: {
      y: {
        formatter: (val: number) =>
          new Intl.NumberFormat("id-ID", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }).format(val) + " Ton",
      },
    },
    xaxis: {
      categories,
      title: { text: "Komoditi" },
    },
    yaxis: {
      title: {
        text: "Total Produksi (Ton)",
      },
    },
  });

  const series = [
    {
      name: "Total Produksi",
      data: values,
    },
  ];

  return (
    <CardComponent
      title="Statistik Produksi Perikanan"
      description={
        <>
          {/* Data Produksi Budidaya Pembesaran Di Keramba/KJA <br /> */}
          <span className="italic text-xs">
            (Sumber : Sipuan Penari Distankan)
          </span>
        </>
      }
      action={
        <ModalDetail
          // title="Statistik Produksi Perikanan"
          // description={title + ' ' + subTitle}
          title={title}
          description={subTitle}
          contentModal={
            <Tabs defaultValue="all" className="flex flex-col gap-3">
              <TabsList>
                <TabsTrigger value="komoditi">Per Komoditi</TabsTrigger>
                <TabsTrigger value="kecamatan">Per Kecamatan</TabsTrigger>
              </TabsList>
              <div className="max-h-[60vh] overflow-y-auto rounded-md border">
                <TabsContent value="komoditi" className="p-0">
                  <TableMonthly
                    dataFreq="monthly"
                    year={year}
                    unit="Ton"
                    tableHeadColspan={
                      "Jumlah Produksi Ikan Bulanan Tahun " + year
                    }
                    tableFooterTotal="Total Seluruh Produksi Budidaya"
                    dataChart={dataChart}
                  />
                </TabsContent>
                <TabsContent value="kecamatan" className="p-0">
                  <TableDistrictly
                    year={year}
                    unit="Ton"
                    tableHeadColspan={
                      "Jumlah Produksi Ikan Komoditi Tahun " + year
                    }
                    tableFooterTotal="Total Seluruh Produksi Budidaya"
                    dataCommodities={dataChart?.data_commodities}
                    dataChart={dataChart}
                  />
                </TabsContent>
              </div>
            </Tabs>
          }
        />
      }
      className="gap-1 pt-0 border-none shadow-none h-full"
    >
      {chartData.isLoaded ? (
        <div className="flex-1 min-h-0 h-[clamp(260px,40vh,520px)] sm:h-[clamp(300px,45vh,560px)] md:h-[clamp(340px,50vh,600px)]">
          <BarChart
            options={options}
            series={series}
            type="bar"
            height="100%"
          />
        </div>
      ) : (
        <LoadingContent />
      )}
    </CardComponent>
  );
}
