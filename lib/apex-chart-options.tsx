// utils/apexBaseOptions.ts

import { ApexOptions } from "apexcharts";

const colors = [
  // palette1
  "#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0",
  // palette2
  "#3f51b5", "#03a9f4", "#4caf50", "#f9ce1d", "#FF9800",
  // palette3
  "#33b2df", "#546E7A", "#d4526e", "#13d8aa", "#A5978B",
  // palette4
  "#4ecdc4", "#c7f464", "#81D4FA", "#546E7A", "#fd6a6a",
  // palette5
  "#2b908f", "#f9a3a4", "#90ee7e", "#fa4443", "#69d2e7",
  // palette6
  "#449DD1", "#F86624", "#EA3546", "#662E9B", "#C5D86D",
  // palette7
  "#D7263D", "#1B998B", "#2E294E", "#F46036", "#E2C044",
  // palette8
  "#662E9B", "#F86624", "#F9C80E", "#EA3546", "#43BCCD",
  // palette9
  "#5C4742", "#A5978B", "#8D5B4C", "#5A2A27", "#C4BBAF",
  // palette10
  "#A300D6", "#7D02EB", "#5653FE", "#2983FF", "#00B1F2",
];
// const colors = [
//   '#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0',
//   '#1A9CFF', '#19E6A2', '#FFC233', '#FF5E73', '#866FDC',
//   '#33A9FF', '#33E9AE', '#FFD44D', '#FF7786', '#9581E9',
//   '#4DB6FF', '#4DECB9', '#FFE666', '#FF9099', '#A493F5',
//   '#66C3FF', '#66EFC5', '#FFF580', '#FFA9AD', '#B3A4FF',
// ];

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
  colors: colors,
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
