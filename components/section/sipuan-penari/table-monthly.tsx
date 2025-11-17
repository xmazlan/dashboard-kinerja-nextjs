import React from 'react';
// Props
import type { ResponsePer } from '@/types/sipuan-penari';
// Components
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  dataFreq: 'quarterly' | 'monthly';
  year: number | string,
  unit?: string,
  tableHeadColspan: string,
  tableFooterTotal: string,
  dataChart: ResponsePer,
}

export default function TableMonthly({ dataFreq, year, unit, tableHeadColspan, tableFooterTotal, dataChart }: Props) {

  let FREQS = [];
  if (dataFreq === 'quarterly') {
    FREQS = [
      "Triwulan I",
      "Triwulan II",
      "Triwulan III",
      "Triwulan IV",
    ];
  }
  else {
    FREQS = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];
  }

  const dataPerComodity = dataChart?.per_comodity;

  const sumTotal = dataPerComodity?.reduce((acc, curr) => acc + curr.total, 0);

  const frequentlyTotals = Array(FREQS.length).fill(0);
  dataPerComodity?.forEach((row) => {
    row.values.forEach((val, i) => {
      frequentlyTotals[i] += val;
    });
  });

  const hasUnitProduction = dataPerComodity?.some(
    (row) => !!row.commodity?.unit_production
  );

  return (
    <div className="w-full h-full">
      <Table className="rounded-md">
        {/* [&_thead>tr>th]:border [&_tbody>tr>td]:border [&_tfoot>tr>td]:border */}
        <TableHeader className="bg-muted/50 [&_tr>th]:font-bold [&_tr>th]:whitespace-pre-wrap">
          <TableRow>
            <TableHead rowSpan={2} align="center" className="text-center w-[20%]"> Komoditi </TableHead>
            <TableHead colSpan={FREQS.length} align="center" className="text-center">
              {tableHeadColspan}
            </TableHead>
            {hasUnitProduction && (
              <TableHead rowSpan={2} align="center" className="text-center w-[10%]">
                Satuan
              </TableHead>
            )}
            <TableHead rowSpan={2} align="center" className="text-center"> Total {unit && `(${unit})`} </TableHead>
          </TableRow>
          <TableRow>
            {FREQS.map((freq) => (
              <TableHead key={freq} align="center" className="text-center">
                {freq}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {dataPerComodity?.map((row) => (
            <TableRow key={row.commodity.id}>
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

              {row.commodity?.unit_production && (
                <TableCell align="center">
                  {row.commodity?.unit_production}
                </TableCell>
              )}

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
            {hasUnitProduction && (
              <TableCell align="center" className="text-center">
                -
              </TableCell>
            )}
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
