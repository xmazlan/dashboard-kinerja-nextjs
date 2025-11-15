// utils/apexBaseOptions.ts

import { ApexOptions } from "apexcharts";

export const barChartOptions = (isDark: boolean, title: string, subTitle: string | null): ApexOptions => ({
  chart: {
    type: "bar",
    background: "transparent",
    dropShadow: {
      enabled: true,
      // color: '#000',
      // top: 18,
      // left: 7,
      blur: 10,
      opacity: 0.5
    },
    zoom: { enabled: false },
    toolbar: {
      show: true,
      export: {
        svg: { filename: `${title} ${subTitle}` },
        png: { filename: `${title} ${subTitle}` },
        csv: { filename: `${title} ${subTitle}` },
      },
    },
  },
  theme: {
    mode: isDark ? "dark" : "light",
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
    ...(subTitle ? { text: subTitle } : {}),
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
    offsetY: -10,
    dropShadow: {
      enabled: true
    },
    // style: {
    //   fontSize: '10px',
    // },
    background: {
      // padding: 10,
      borderRadius: 5,
    },
    // formatter: (val: number) =>
    //   new Intl.NumberFormat('id-ID', {
    //     minimumFractionDigits: 0,
    //     maximumFractionDigits: 2,
    //   }).format(val),
  },
  plotOptions: {
    bar: {
      horizontal: false,
      distributed: true,
      columnWidth: '75%',
      borderRadius: 3,
      borderRadiusApplication: 'end',
      dataLabels: {
        position: 'top',
      },
    },
    line: {
      isSlopeChart: false,
    },
  },
  // tooltip: {
  //   // x: {
  //   //   formatter: function (_, { dataPointIndex }) {
  //   //     // tampilkan nama panjang di tooltip
  //   //     return names[dataPointIndex] || '-';
  //   //   },
  //   // },
  //   y: {
  // formatter: (val: number) =>
  //   new Intl.NumberFormat('id-ID', {
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 2,
  //   }).format(val) + ' Ton',
  //   },
  // },
  stroke: {
    curve: "smooth",
    width: 2
  },
  xaxis: {
    // categories: categories,
    // title: {
    //   text: 'Komoditi',
    // },
    tickPlacement: 'between',
    labels: {
      show: true,
      rotate: -45,
      trim: false,
      hideOverlappingLabels: false,
    },
  },
  yaxis: {
    labels: {
      // formatter: function (value) {
      //   return Number(value).toLocaleString("id-ID", {
      //     maximumFractionDigits: 0
      //   });
      // }
      formatter: (val: number) =>
        new Intl.NumberFormat('id-ID', {
          maximumFractionDigits: 0,
        }).format(val),
    }
  },
  fill: { opacity: 1 },
});
