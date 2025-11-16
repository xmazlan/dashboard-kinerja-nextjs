import React from 'react';
// Props
import type { ResponseDataStatistic } from '@/types/sipuan-penari';
// Components
import CardComponent from '@/components/card/card-component';
import SkeletonList from '@/components/skeleton/SkeletonList';
import BarChart from '@/components/apexchart/bar-chart';
import { HargaKomoditasState } from '@/types/tpid';

interface Props {
  hargaKomoditas: HargaKomoditasState
}

export default function ChartHargaKomoditas({ hargaKomoditas }: Props) {

  const dataChart = hargaKomoditas?.data;

  return (
    <CardComponent
      title="Harga Rata-Rata Pangan Terbaru"
      description={
        <>
          <span className="italic text-xs">(Sumber : TPID Disperindag)</span>
        </>
      }
      className="gap-1 pt-0 border-none shadow-none"
    >
      dsa
    </CardComponent>
  )
}
