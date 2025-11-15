import React from 'react';
import { useTheme } from "next-themes";
import merge from "deepmerge";
import { barChartOptions } from '@/lib/apex-chart-options';
// Props
import type { ResponseDataStatistic } from '@/types/sipuan-penari';
// Components
import BarChart from '@/components/apexchart/bar-chart';

interface Props {
  year: number | string,
  chartData: { isLoaded: boolean, data: ResponseDataStatistic }
}

export default function ChartPertanianBiopharmaceutical({ year, chartData }: Props) {

  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const title = 'Data Produksi Tanaman Biofarmaka';
  const subTitle = 'Tahun ' + year;

  const dataChart = chartData?.data?.biopharmaceutical;

  // // Label bulan
  // const months = [
  //   "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  //   "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
  // ];
  // // Generate series untuk chart
  // const series = dataChart?.map(item => ({
  //   name: item.label,
  //   data: item.values
  // }));
  const categories = dataChart?.map((d) => d.label);
  const values = dataChart?.map((d) => d.total);
  const options = merge(
    barChartOptions(isDark, title, subTitle),
    {
      // colors: ["#00E396"],
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
        // x: {
        //   formatter: function (_, { dataPointIndex }) {
        //     // tampilkan nama panjang di tooltip
        //     return names[dataPointIndex] || '-';
        //   },
        // },
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

  return chartData.isLoaded ? (
    <BarChart
      options={options}
      series={series}
      type="bar"
      height={400}
    />
  ) : (
    'Memuat data..'
  )
}
