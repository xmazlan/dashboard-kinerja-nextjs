import React from "react";
import { cn } from "@/lib/utils";
import CardComponent from "@/components/card/card-component";
import {
  usePengaduanEresponMasterData,
  usePengaduanEresponSemuaData,
} from "@/hooks/query/use-pengaduan-erespon";
import LoadingSkeleton from "@/components/loading-skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DataEresponAll() {
  const { data: masterData, isLoading: isLoadingMasterData } =
    usePengaduanEresponSemuaData();

  return (
    <div className="w-full h-full">
      <CardComponent
        className="gap-1 border-none shadow-none w-full h-full"
        title="Layanan pengaduan masyarakat (All Data)"
        description={
          <>
            Last update: {masterData?.last_get ?? ""}
            <br />
            <span className="italic text-xs">(Sumber : E-Respone)</span>
          </>
        }
      >
        {isLoadingMasterData ? (
          <LoadingSkeleton rows={1} cols={5} />
        ) : (
          (() => {
            const list = Array.isArray(masterData?.data)
              ? masterData?.data
              : [];
            return (
              <div className="w-full overflow-x-auto">
                <Table className="w-full text-sm [&_th]:py-2 [&_td]:py-1">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jenis Aduan</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Belum</TableHead>
                      <TableHead className="text-right">Sedang</TableHead>
                      <TableHead className="text-right">Selesai</TableHead>
                      <TableHead className="text-right">Pending</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {list.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-muted-foreground"
                        >
                          Tidak ada data
                        </TableCell>
                      </TableRow>
                    ) : (
                      list.map((c: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell
                            className="max-w-[320px] truncate"
                            title={String(c?.jenis || "-")}
                          >
                            {String(c?.jenis || "-")}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {Number(c?.total || 0).toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {Number(c?.belum || 0).toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {Number(c?.sedang || 0).toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {Number(c?.selesai || 0).toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {Number(c?.pending || 0).toLocaleString("id-ID")}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                  <TableCaption>
                    Ringkasan jenis aduan dan status penanganan.
                  </TableCaption>
                </Table>
              </div>
            );
          })()
        )}
      </CardComponent>
    </div>
  );
}
