import React from 'react';
import dynamic from "next/dynamic";
// Props
import { ApexOptions } from 'apexcharts';
// Components
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ChartProps {
  options: ApexOptions,
  series: ApexAxisChartSeries | ApexNonAxisChartSeries, // SeriesProps[],
  type: ApexChart['type'],
  height: number | string,
}

export default function LineChart({ options, series, type, height = 320 }: ChartProps) {
  return (
    <Chart
      type={type}
      options={options}
      series={series}
      width="100%"
      height={height}
    />
  )
}
