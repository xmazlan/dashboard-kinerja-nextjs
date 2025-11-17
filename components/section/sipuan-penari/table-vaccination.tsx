import React from 'react';
// Props
import type { ResponsePer } from '@/types/sipuan-penari';
// Components
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  dataDiseases: { id: string | number, name: string }[],
  year: number | string,
  // unit?: string,
  // tableHeadColspan: string,
  tableFooterTotal: string,
  dataChart: ResponsePer,
}

export default function TableVaccination({ dataDiseases, year, tableFooterTotal, dataChart }: Props) {

  const dataPerComodity = dataChart?.per_comodity;

  const sumTotal = dataPerComodity?.reduce((acc, curr) => acc + curr.total, 0);

  // const totalInfected = dataPerComodity.reduce((acc, item) => {
  //   if (typeof item.values !== "number") 
  //     return acc + item.values.reduce((sum, v) => sum + v.infected, 0);
  // }, 0);

  // const totalVaccination = dataPerComodity.reduce((acc, item) => {
  //   return acc + item.values.reduce((sum, v) => sum + v.vaccination, 0);
  // }, 0);
  const diseaseTotals: Record<
    string,
    { infected: number; vaccination: number }
  > = {};

  // Loop semua komoditas
  dataPerComodity.forEach(item => {
    item.values.forEach(v => {
      if (typeof v !== "number") {
        if (!diseaseTotals[v.label]) {
          diseaseTotals[v.label] = { infected: 0, vaccination: 0 };
        }

        diseaseTotals[v.label].infected += v.infected;
        diseaseTotals[v.label].vaccination += v.vaccination;
      }
    });
  });

  const totalInfected = dataPerComodity?.reduce((acc, item) => acc + item.totalInfected, 0);
  const totalVaccination = dataPerComodity?.reduce((acc, item) => acc + item.totalVaccination, 0);


  return (
    <div className="w-full h-full">
      <Table className="rounded-md">
        {/* [&_thead>tr>th]:border [&_tbody>tr>td]:border [&_tfoot>tr>td]:border */}
        <TableHeader className="bg-muted/50 [&_tr>th]:font-bold [&_tr>th]:whitespace-pre-wrap">
          <TableRow>
            <TableHead rowSpan={3} align="center" className="text-center w-[20%]"> Jenis Ternak </TableHead>
            <TableHead colSpan={(dataDiseases?.length * 2)} align="center" className="text-center">
              Penyakit
            </TableHead>
            <TableHead rowSpan={2} colSpan={2} align="center" className="text-center"> Total </TableHead>
          </TableRow>
          <TableRow>
            {dataDiseases?.map((data) => (
              <TableHead colSpan={2} key={data.id} align="center" className="text-center">
                {data.name}
              </TableHead>
            ))}
          </TableRow>
          <TableRow>
            {dataDiseases?.map((data) => (
              <React.Fragment key={data.id}>
                <TableHead key={data.id + '_infected'} align="center" className="text-center">
                  Jumlah Terinfeksi
                </TableHead>
                <TableHead key={data.id + '_vaccinated'} align="center" className="text-center">
                  Jumlah Vaksinasi
                </TableHead>
              </React.Fragment>
            ))}
            <TableHead align="center" className="text-center">
              Total Terinfeksi
            </TableHead>
            <TableHead align="center" className="text-center">
              Total Vaksinasi
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {dataPerComodity?.map((row) => (
            <TableRow key={row.commodity.id}>
              <TableCell className="font-medium text-primary">
                {row.label}
              </TableCell>

              {row.values.map((value, idx: number) => {
                if (typeof value !== "number") {
                  return (
                    <React.Fragment key={idx}>
                      <TableCell
                        align="right"
                      >
                        {new Intl.NumberFormat('id-ID', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        }).format(Number(value.infected))}
                      </TableCell>
                      <TableCell
                        align="right"
                      >
                        {new Intl.NumberFormat('id-ID', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        }).format(Number(value.vaccination))}
                      </TableCell>
                    </React.Fragment>
                  )
                }
              })}

              <TableCell align="right" className="font-bold">
                {new Intl.NumberFormat('id-ID', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }).format(Number(row.totalInfected))}
              </TableCell>
              <TableCell align="right" className="font-bold">
                {new Intl.NumberFormat('id-ID', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }).format(Number(row.totalVaccination))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="[&_tr>td]:font-bold">
          <TableRow>
            <TableCell align="center" className="whitespace-pre-wrap"> {tableFooterTotal} </TableCell>
            {Object.entries(diseaseTotals).map(([label, totals]) => (
              <React.Fragment key={label}>
                <TableCell align="right">
                  {new Intl.NumberFormat('id-ID', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }).format(Number(totals.infected))}
                </TableCell>
                <TableCell align="right">
                  {new Intl.NumberFormat('id-ID', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }).format(Number(totals.vaccination))}
                </TableCell>
              </React.Fragment>
            ))}
            <TableCell align="right">
              {sumTotal ? new Intl.NumberFormat('id-ID', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }).format(Number(totalInfected)) : 0}
            </TableCell>
            <TableCell align="right">
              {sumTotal ? new Intl.NumberFormat('id-ID', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }).format(Number(totalVaccination)) : 0}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
