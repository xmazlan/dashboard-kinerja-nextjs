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

export default function ChartPeternakanSlaughtered({ year, chartData }: Props) {

  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const title = 'Data Pemotongan Hewan';
  const subTitle = 'Tahun ' + year;

  const dataChart = chartData?.data?.slaughtered;

  const categories = dataChart?.map((d) => d.label);
  const values = dataChart?.map((d) => d.total);

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
          text: 'Total Pemotongan (Ekor)'
        },
      },
    }
  );

  const series = [
    {
      name: 'Total Pemotongan',
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
