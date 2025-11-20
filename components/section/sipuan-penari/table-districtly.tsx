import React from 'react';
// Props
import type { CommodityProps, ResponsePer } from '@/types/sipuan-penari';
// Components
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  year: number | string,
  unit?: string,
  tableHeadColspan: string,
  tableFooterTotal: string,
  dataCommodities: CommodityProps[],
  dataChart: ResponsePer,
}

export default function TableDistrictly({ year, unit, tableHeadColspan, tableFooterTotal, dataCommodities, dataChart }: Props) {

  // const dataPerDistrict = dataChart?.per_district;
  const perDistrict = Array.isArray(dataChart?.per_district)
    ? dataChart.per_district
    : [];

  const sumTotal = perDistrict?.reduce((acc, curr) => acc + curr.total, 0);

  const frequentlyTotals = Array(dataCommodities.length).fill(0);
  perDistrict?.forEach((row) => {
    row.values.forEach((val, i) => {
      frequentlyTotals[i] += val;
    });
  });

  return (
    <div className="w-full h-full">
      <Table className="rounded-md">
        {/* [&_thead>tr>th]:border [&_tbody>tr>td]:border [&_tfoot>tr>td]:border */}
        <TableHeader className="bg-muted/50 [&_tr>th]:font-bold [&_tr>th]:whitespace-pre-wrap">
          <TableRow>
            <TableHead rowSpan={2} align="center" className="text-center w-[20%]"> Kecamatan </TableHead>
            <TableHead colSpan={dataCommodities.length} align="center" className="text-center">
              {tableHeadColspan}
            </TableHead>
            <TableHead rowSpan={2} align="center" className="text-center"> Total {unit && `(${unit})`} </TableHead>
          </TableRow>
          <TableRow>
            {dataCommodities.map((com) => (
              <TableHead key={com.id} align="center" className="text-center">
                {com.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {perDistrict?.map((row) => (
            <TableRow key={row.district.id}>
              <TableCell className="font-medium text-primary">
                {row.label}
              </TableCell>

              {row.values.map((value, idx: number) => (
                <TableCell
                  key={idx}
                  align="right"
                >
                  {new Intl.NumberFormat('id-ID', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }).format(Number(value))}
                </TableCell>
              ))}

              <TableCell align="right" className="font-bold">
                {new Intl.NumberFormat('id-ID', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }).format(Number(row.total))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="[&_tr>td]:font-bold">
          <TableRow>
            <TableCell align="center" className="whitespace-pre-wrap"> {tableFooterTotal} </TableCell>
            {frequentlyTotals.map((total, idx) => (
              <TableCell key={idx} align="right">
                {new Intl.NumberFormat('id-ID', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }).format(Number(total))}
              </TableCell>
            ))}
            <TableCell align="right">
              {sumTotal ? new Intl.NumberFormat('id-ID', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }).format(Number(sumTotal)) : 0}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
