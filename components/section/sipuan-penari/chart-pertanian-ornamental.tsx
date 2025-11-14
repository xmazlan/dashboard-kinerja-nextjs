import React from 'react';
import { useTheme } from "next-themes";
// Props
import type { ResponseDataStatistic } from '@/types/sipuan-penari';
// Components
import LineChart from '@/components/apexchart/line-chart';

interface Props {
  year: number | string,
  chartData: { isLoaded: boolean, data: ResponseDataStatistic }
}

export default function ChartPeranianOrnamental({ year, chartData }: Props) {

  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const title = 'Data Produksi Tanaman Hias';
  const subTitle = 'Tahun ' + year;

  const dataChart = chartData?.data?.ornamental;

  // // Label bulan
  // const months = [
  //   "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  //   "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
  // ];
  // // Generate series untuk chart
  // const series = dataChart.map(item => ({
  //   name: item.label,
  //   data: item.values
  // }));
  const categories = dataChart.map((d) => d.label);
  const values = dataChart.map((d) => d.total);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      background: 'transparent',
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.5
      },
      zoom: {
        enabled: false
      },
      toolbar: {
        show: true,
        export: {
          svg: { filename: title + ' ' + subTitle },
          png: { filename: title + ' ' + subTitle },
          csv: { filename: title + ' ' + subTitle }
        }
      }
    },
    theme: {
      mode: isDark ? 'dark' : 'light',
      // palette: 'palette5',
      // monochrome: {
      //   enabled: false,
      //   color: '#255aee',
      //   shadeTo: 'light',
      //   shadeIntensity: 0.65
      // },
    },
    title: {
      text: title,
      align: 'left',
      floating: false,
    },
    subtitle: {
      text: subTitle,
      align: 'left',
      floating: false,
      offsetY: 20,
    },
    legend: {
      show: true,
      offsetY: 2,
      position: 'bottom',
      horizontalAlign: 'center',
      floating: false,
    },
    dataLabels: {
      enabled: true,
      // dropShadow: {
      //   enabled: true
      // },
      style: {
        fontSize: '10px',
      },
      background: {
        // padding: 10,
        borderRadius: 5,
      },
      formatter: (val: number) => new Intl.NumberFormat('id-ID').format(val) + ' Ton',
    },
    plotOptions: {
      line: {
        isSlopeChart: false,
      },
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
          new Intl.NumberFormat('id-ID').format(val),
      },
    },
    colors: ['#00E396'],
    stroke: {
      curve: "smooth",
      width: 2
    },

    xaxis: {
      categories: categories,
      title: {
        text: 'Komoditi',
      },
      labels: {
        rotate: -45,
        // style: { fontSize: '12px' },
      },
    },
    yaxis: {
      title: {
        text: 'Total Produksi (Ton)'
      },
      labels: {
        formatter: function (value) {
          return Number(value).toLocaleString("id-ID", {
            maximumFractionDigits: 0
          });
        }
      }
    },
    fill: { opacity: 1 },

    // series
  };

  const series = [
    {
      name: 'Jumlah Produksi',
      data: values,
    },
  ];

  return chartData.isLoaded ? (
    <LineChart
      options={options}
      series={series}
      type="line"
      height={400}
    />
  ) : (
    'Memuat data..'
  )
}
