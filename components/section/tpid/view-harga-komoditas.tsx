import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
// Props
import type { HargaKomoditasItem } from "@/types/tpid";
// Components
import CardComponent from "@/components/card/card-component";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HistoryIcon } from "lucide-react";
import { color } from "motion/react";

interface Props {
  items: HargaKomoditasItem[];
}

export default function ViewHargaKomoditas({ items }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
      {items.map((item) => {
        // const satuan = Object.keys(item.harga_per_satuan_komoditas)[0];
        // const hargaData = item.harga_per_satuan_komoditas[satuan];

        return (
          <Card key={item.id} className="w-full shadow-sm gap-1 p-1">
            <CardHeader className="py-0 px-3 flex items-center gap-1">
              <Image
                src={item.gambar}
                width={50}
                height={50}
                alt={item.nama_komoditas}
                className="object-contain w-13 h-13"
              />
              <div className="text-sm font-semibold leading-tight">
                {item.nama_komoditas}
              </div>
            </CardHeader>

            <CardContent className="py-0 px-3 space-y-1">
              {/* <div className="mt-1 text-sm font-bold">
                Rp. {new Intl.NumberFormat("id-ID").format(
                  hargaData.harga_rata_rata
                )} / {satuan}
              </div> */}
              {/* LOOP SEMUA SATUAN */}
              {Object.entries(item.harga_per_satuan_komoditas).map(
                ([satuan, data]) => {
                  let colorClass = "text-grey-600";
                  if (Number(data.selisih_harga_dari_yang_kemarin) > 0) {
                    colorClass = "text-red-600";
                  } else if (Number(data.selisih_harga_dari_yang_kemarin) < 0) {
                    colorClass = "text-green-600";
                  }
                  return (
                    <div key={satuan} className="space-y-0">
                      <div className={cn("text-md font-bold", colorClass)}>
                        Rp.{" "}
                        {new Intl.NumberFormat("id-ID").format(
                          data.harga_rata_rata
                        )}{" "}
                        / <span className="text-[10px]"> {satuan} </span>
                      </div>
                      <div className={cn("text-xs", colorClass)}>
                        {data.status}
                        {Number(data.selisih_harga_dari_yang_kemarin) > 0 && (
                          <>
                            Rp.{" "}
                            {new Intl.NumberFormat("id-ID").format(
                              Number(data.selisih_harga_dari_yang_kemarin)
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <HistoryIcon size={12} /> {item.last_update_komoditas}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // return (
  //   <CardComponent
  //     title="Harga Rata-Rata Pangan Terbaru"
  //     description={
  //       <>
  //         <span className="italic text-xs">(Sumber : TPID Disperindag)</span>
  //       </>
  //     }
  //     className="gap-1 pt-0 border-none shadow-none"
  //   >
  //     dsa
  //   </CardComponent>
  // )
}
