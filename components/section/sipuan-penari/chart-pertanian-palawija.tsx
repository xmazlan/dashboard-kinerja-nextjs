import React, { useEffect, useState } from 'react';
import { useTheme } from "next-themes";
// Props
import type { ResponseDataStatistic } from '@/types/sipuan-penari';
// Components
import LineChart from '@/components/apexchart/line-chart';

interface Props {
  year: number | string,
  chartData: { isLoaded: boolean, data: ResponseDataStatistic }
}

export default function PertanianPalawija({ year, chartData }: Props) {

  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const title = 'Data Produksi Tanaman Palawija';
  const subTitle = 'Tahun ' + year;

  // Ambil nama & value dari hasil API
  // const categories = chartData?.data.map((d) => d.acronym);
  // const names = chartData?.data.map((d) => d.name);
  // const values = chartData?.data.map((d) => d.total);

  // const options: ApexCharts.ApexOptions = {
  //   chart: {
  //     type: 'bar',
  //     background: 'transparent',
  //     // height: 350,
  //     // animations: {
  //     //   enabled: true,
  //     //   speed: 800,
  //     //   animateGradually: {
  //     //     enabled: true,
  //     //     delay: 150,
  //     //   },
  //     //   dynamicAnimation: {
  //     //     enabled: true,
  //     //     speed: 300,
  //     //   },
  //     // },
  //     toolbar: {
  //       export: {
  //         svg: {
  //           filename: title,
  //         },
  //         png: {
  //           filename: title,
  //         },
  //         csv: {
  //           filename: title,
  //         },
  //       },
  //     },
  //   },
  //   theme: {
  //     mode: isDark ? 'dark' : 'light',
  //     // palette: 'palette2',
  //     // monochrome: {
  //     //   enabled: true,
  //     //   color: '#255aee',
  //     //   shadeTo: 'light',
  //     //   shadeIntensity: 0.65
  //     // },
  //   },
  //   title: {
  //     text: title,
  //     align: 'center',
  //     floating: false,
  //   },
  //   // subtitle: {
  //   //   text: 'Semua Dataset',
  //   //   align: 'center',
  //   //   offsetY: 20,
  //   // },
  //   legend: {
  //     show: true,
  //     offsetY: 2,
  //     position: 'bottom',
  //     horizontalAlign: 'center',
  //     floating: false,
  //   },
  //   dataLabels: {
  //     enabled: true,
  //     // textAnchor: 'start',
  //     // offsetX: 0,
  //     dropShadow: {
  //       enabled: true
  //     },
  //     formatter: (val: number) => new Intl.NumberFormat('id-ID').format(val),
  //   },
  //   plotOptions: {
  //     bar: {
  //       horizontal: true,
  //       columnWidth: '75%',
  //       borderRadius: 3,
  //       borderRadiusApplication: 'end',
  //     },
  //   },
  //   tooltip: {
  //     x: {
  //       formatter: function (_, { dataPointIndex }) {
  //         // tampilkan nama panjang di tooltip
  //         return names[dataPointIndex] || '-';
  //       },
  //     },
  //     y: {
  //       formatter: (val: number) =>
  //         new Intl.NumberFormat('id-ID').format(val),
  //     },
  //   },
  //   colors: ['#ed1c24'],
  //   stroke: {
  //     show: true,
  //     width: 1,
  //     colors: ['transparent']
  //   },
  //   xaxis: {
  //     categories,
  //     labels: {
  //       rotate: -45,
  //       style: { fontSize: '12px' },
  //     },
  //   },
  //   yaxis: {
  //     title: {
  //       text: 'Jumlah Dataset'
  //     },
  //   },
  //   fill: { opacity: 1 },
  // };

  // const series = [
  //   {
  //     name: 'Jumlah Dataset',
  //     data: values,
  //   },
  // ];


  const palawija = chartData?.data?.palawija;

  // Label bulan
  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
  ];
  // Generate series untuk chart
  const series = palawija.map(item => ({
    name: item.label,
    data: item.values
  }));

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      background: 'transparent',
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
      background: {
        borderRadius: 5,
      },
      formatter: (val: number) => new Intl.NumberFormat('id-ID').format(val) + 'Ton',
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
    stroke: {
      curve: "smooth",
      width: 2
    },

    xaxis: {
      categories: months,
      labels: {
        rotate: -45,
        // style: { fontSize: '12px' },
      },
    },
    yaxis: {
      title: {
        text: 'Total Produksi (Ton)'
      },
    },
    fill: { opacity: 1 },

    series
  };

  return chartData.isLoaded ? (
    <LineChart
      options={options}
      series={series}
      type="line"
      height={500}
    />
  ) : (
    'Memuat data..'
  )
}
