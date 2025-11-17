import React from 'react';
import { useTheme } from "next-themes";
import merge from "deepmerge";
import { barChartOptions } from '@/lib/apex-chart-options';
// Props
import type { ResponseDataStatistic } from '@/types/sipuan-penari';
// Components
import CardComponent from '@/components/card/card-component';
import SkeletonList from '@/components/skeleton/SkeletonList';
import BarChart from '@/components/apexchart/bar-chart';
import TableVaccination from './table-vaccination';
import { ModalDetail } from "@/components/modal/detail-modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Props {
  year: number | string,
  chartData: { isLoaded: boolean, data: ResponseDataStatistic }
}

export default function ChartPeternakanVaccination({ year, chartData }: Props) {

  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const title = 'Data Vaksinasi Hewan';
  const subTitle = 'Tahun ' + year;

  const dataChart = chartData?.data?.vaccination;

  const categories = dataChart?.per_comodity?.map((d) => d.label);
  const values = dataChart?.per_comodity?.map((d) => d.total);

  const options = merge(
    barChartOptions(isDark, title, subTitle),
    {
      colors: ["#FEB019", "#4caf50"],
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
          text: 'Total Terinfeksi dan Vaksinasi (Ekor)'
        },
      },
    }
  );


  const series = [
    {
      name: "Total Terinfeksi",
      data: dataChart?.per_comodity?.map(item => item.totalInfected)
    },
    {
      name: "Total Vaksinasi",
      data: dataChart?.per_comodity?.map(item => item.totalVaccination)
    }
  ];

  return (
    <CardComponent
      title="Statistik Produksi Peternakan"
      description={
        <>
          {/* Data Vaksinasi Hewan <br /> */}
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
                <TabsTrigger value="komoditi">Per Komoditi dan Penyakit</TabsTrigger>
              </TabsList>
              <div className="max-h-[60vh] overflow-y-auto rounded-md border">
                <TabsContent value="komoditi" className="p-0">
                  <TableVaccination dataDiseases={dataChart?.data_diseases} year={year} tableFooterTotal="Total Terinfeksi dan Tervaksin" dataChart={dataChart} />
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
