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
import TableMonthly from './table-monthly';
import TableDistrictly from './table-districtly';
import { ModalDetail } from "@/components/modal/detail-modal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Props {
  year: number | string,
  chartData: { isLoaded: boolean, data: ResponseDataStatistic }
}

export default function ChartPertanianPalawija({ year, chartData }: Props) {

  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const title = 'Data Produksi Tanaman Palawija';
  const subTitle = 'Tahun ' + year;

  const dataChart = chartData?.data?.palawija;

  // // Label bulan
  // const months = [
  //   "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  //   "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
  // ];
  // // Generate series untuk chart
  // const series = dataChart?.per_comodity?.map(item => ({
  //   name: item.label,
  //   data: item.values
  // }));
  const categories = dataChart?.per_comodity?.map((d) => d.label);
  const values = dataChart?.per_comodity?.map((d) => d.total);

  // const options: ApexCharts.ApexOptions = {
  //   chart: {
  //     type: "bar",
  //     background: 'transparent',
  //     dropShadow: {
  //       enabled: true,
  //       // color: '#000',
  //       // top: 18,
  //       // left: 7,
  //       // blur: 10,
  //       // opacity: 0.5
  //     },
  //     zoom: {
  //       enabled: false
  //     },
  //     toolbar: {
  //       show: true,
  //       export: {
  //         svg: { filename: title + ' ' + subTitle },
  //         png: { filename: title + ' ' + subTitle },
  //         csv: { filename: title + ' ' + subTitle }
  //       }
  //     }
  //   },
  //   theme: {
  //     mode: isDark ? 'dark' : 'light',
  //     // palette: 'palette5',
  //     // monochrome: {
  //     //   enabled: false,
  //     //   color: '#255aee',
  //     //   shadeTo: 'light',
  //     //   shadeIntensity: 0.65
  //     // },
  //   },
  //   title: {
  //     text: title,
  //     align: 'left',
  //     floating: false,
  //   },
  //   subtitle: {
  //     text: subTitle,
  //     align: 'left',
  //     floating: false,
  //     offsetY: 20,
  //   },
  //   legend: {
  //     show: true,
  //     offsetY: 2,
  //     position: 'bottom',
  //     horizontalAlign: 'center',
  //     floating: false,
  //   },
  //   dataLabels: {
  //     enabled: true,
  //     dropShadow: {
  //       enabled: true
  //     },
  //     // style: {
  //     //   fontSize: '10px',
  //     // },
  //     background: {
  //       // padding: 10,
  //       borderRadius: 5,
  //     },
  //     formatter: (val: number) => new Intl.NumberFormat('id-ID').format(val),
  //   },
  //   plotOptions: {
  //     bar: {
  //       horizontal: false,
  //       columnWidth: '75%',
  //       borderRadius: 3,
  //       borderRadiusApplication: 'end',
  //     },
  //     line: {
  //       isSlopeChart: false,
  //     },
  //   },
  //   tooltip: {
  //     // x: {
  //     //   formatter: function (_, { dataPointIndex }) {
  //     //     // tampilkan nama panjang di tooltip
  //     //     return names[dataPointIndex] || '-';
  //     //   },
  //     // },
  //     y: {
  //       formatter: (val: number) =>
  //         new Intl.NumberFormat('id-ID').format(val) + ' Ton',
  //     },
  //   },
  //   colors: ['#00E396'],
  //   stroke: {
  //     curve: "smooth",
  //     width: 2
  //   },

  //   xaxis: {
  //     categories: categories,
  //     title: {
  //       text: 'Komoditi',
  //     },
  //     tickPlacement: 'between',
  //     labels: {
  //       show: true,
  //       rotate: -45,
  //       trim: false,
  //       hideOverlappingLabels: false,
  //     },
  //   },
  //   yaxis: {
  //     title: {
  //       text: 'Total Produksi (Ton)'
  //     },
  //     labels: {
  //       formatter: function (value) {
  //         return Number(value).toLocaleString("id-ID", {
  //           maximumFractionDigits: 0
  //         });
  //       }
  //     }
  //   },
  //   fill: { opacity: 1 },

  //   // series
  // };

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

  return (
    <CardComponent
      title="Statistik Produksi Pertanian"
      description={
        <>
          {/* Data Tanaman Palawija <br /> */}
          <span className="italic text-xs">(Sumber : Sipuan Penari Distankan)</span>
        </>
      }
      action={
        <ModalDetail
          // title="Statistik Produksi Pertanian"
          // description={title + ' ' + subTitle}
          title={title}
          description={subTitle}
          contentModal={
            <Tabs defaultValue="all" className="flex flex-col gap-3">
              <TabsList>
                <TabsTrigger value="komoditi">Per Komoditi</TabsTrigger>
                <TabsTrigger value="kecamatan">Per Kecamatan</TabsTrigger>
              </TabsList>
              <div className="max-h-[60vh] overflow-y-auto rounded-md border">
                <TabsContent value="komoditi" className="p-0">
                  <TableMonthly dataFreq="monthly" year={year} unit="Ton" tableHeadColspan={'Jumlah Produksi Bulanan Tahun ' + year} tableFooterTotal="Total Seluruh Tanaman Palawija" dataChart={dataChart} />
                </TabsContent>
                <TabsContent value="kecamatan" className="p-0">
                  <TableDistrictly year={year} unit="Ton" tableHeadColspan={'Jumlah Produksi Komoditi Tahun ' + year} tableFooterTotal="Total Seluruh Tanaman Palawija" dataCommodities={dataChart?.data_commodities} dataChart={dataChart} />
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
