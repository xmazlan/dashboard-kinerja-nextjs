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

export default function ChartPerkebunanProduction({ year, chartData }: Props) {

  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const title = 'Data Produksi Perkebunan';
  const subTitle = 'Tahun ' + year;

  const dataChart = chartData?.data?.production;

  const categories = dataChart?.map((d) => d.label);
  const values = dataChart?.map((d) => d.total);

  const options = merge(
    barChartOptions(isDark, title, subTitle),
    {
      colors: ["#4caf50"],
      dataLabels: {
        formatter: (val: number) => new Intl.NumberFormat('id-ID').format(val) + ' Ton',
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
            new Intl.NumberFormat('id-ID').format(val) + ' Ton',
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
    <>
      <div className="px-2">
        <p className="text-xs text-gray-500"> Khusus untuk <b>Aren</b> data dalam satuan <b>Liter</b>. </p>
      </div>
      {
        chartData.isLoaded ? (
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
    </>
  );
}
