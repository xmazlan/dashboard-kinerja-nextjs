import React from 'react';
import { useTheme } from "next-themes";
import merge from "deepmerge";
import { barChartOptions } from '@/lib/apex-chart-options';
// Props
import type { CommodityProps, ResponseDataStatistic } from '@/types/sipuan-penari';
// Components
import CardComponent from '@/components/card/card-component';
import SkeletonList from '@/components/skeleton/SkeletonList';
import BarChart from '@/components/apexchart/bar-chart';
import TableMonthly from './table-monthly';
import TableDistrictly from './table-districtly';
import { ModalDetail } from "@/components/modal/detail-modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Props {
  year: number | string,
  chartData: { isLoaded: boolean, data: ResponseDataStatistic }
}

export default function ChartPeternakanPopulation({ year, chartData }: Props) {

  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const title = 'Data Populasi Ternak';
  const subTitle = 'Tahun ' + year;

  function isCommodityArray(val: unknown): val is CommodityProps[] {
    return Array.isArray(val);
  }
  const dataC = chartData?.data?.data_commodities;
  const dataCommodities = isCommodityArray(dataC) ? dataC : [];

  const dataChart = chartData?.data?.population;

  const categories = dataChart?.per_comodity?.map((d) => d.label);
  const values = dataChart?.per_comodity?.map((d) => d.total);

  const options = merge(
    barChartOptions(isDark, title, subTitle),
    {
      // colors: ["#8D5B4C"],
      plotOptions: {
        bar: {
          distributed: true,
        }
      },
      legend: {
        show: false,
      },
      dataLabels: {
        formatter: (val: number) =>
          new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }).format(val),
      },
      tooltip: {
        y: {
          formatter: (val: number) =>
            new Intl.NumberFormat('id-ID', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(val) + ' Ekor',
        },
      },
      xaxis: {
        categories,
        title: { text: "Komoditi" },
      },
      yaxis: {
        title: {
          text: 'Total Populasi (Ekor)'
        },
      },
    }
  );

  const series = [
    {
      name: 'Total Populasi',
      data: values,
    },
  ];

  return (
    <CardComponent
      title="Statistik Produksi Peternakan"
      description={
        <>
          {/* Data Populasi Ternak <br /> */}
          <span className="italic text-xs">(Sumber : Sipuan Penari Distankan)</span>
        </>
      }
      action={
        <ModalDetail
          // title="Statistik Produksi Peternakan"
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
                  <TableMonthly dataFreq="monthly" year={year} unit="Ekor" tableHeadColspan={'Jumlah Populasi Bulanan Tahun ' + year} tableFooterTotal="Total Seluruh Populasi Ternak" dataChart={dataChart} />
                </TabsContent>
                <TabsContent value="kecamatan" className="p-0">
                  <TableDistrictly year={year} unit="Ekor" tableHeadColspan={'Jumlah Populasi Komoditi Tahun ' + year} tableFooterTotal="Total Seluruh Populasi Ternak" dataCommodities={dataCommodities} dataChart={dataChart} />
                </TabsContent>
              </div>
            </Tabs>
          }
        />
      }
      className="gap-1 pt-0 border-none shadow-none"
    >
      {chartData.isLoaded ? (
        <BarChart
          options={options}
          series={series}
          type="bar"
          height={400}
        />
      ) : (
        <SkeletonList />
      )}
    </CardComponent>
  )
}
