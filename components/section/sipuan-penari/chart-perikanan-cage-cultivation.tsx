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

interface Props {
  year: number | string,
  chartData: { isLoaded: boolean, data: ResponseDataStatistic }
}

export default function ChartPerikananCageCultivation({ year, chartData }: Props) {

  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const title = 'Data Produksi Budidaya Pembesaran Di Keramba/KJA';
  const subTitle = 'Tahun ' + year;

  const dataChart = chartData?.data?.cage_cultivation;

  const categories = dataChart?.map((d) => d.label);
  const values = dataChart?.map((d) => d.total);

  const options = merge(
    barChartOptions(isDark, title, subTitle),
    {
      // colors: ["#F86624"],
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
            }).format(val) + ' Ton',
        },
      },
      xaxis: {
        categories,
        title: { text: "Komoditi" },
      },
      yaxis: {
        title: {
          text: 'Total Produksi (Ton)'
        },
      },
    }
  );

  const series = [
    {
      name: 'Total Produksi',
      data: values,
    },
  ];


  return (
    <CardComponent
      title="Statistik Produksi Perikanan"
      description={
        <>
          Data Produksi Budidaya Pembesaran Di Keramba/KJA <br />
          <span className="italic text-xs">(Sumber : Sipuan Penari Distankan)</span>
        </>
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
