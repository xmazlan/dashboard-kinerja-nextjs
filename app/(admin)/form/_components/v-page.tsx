"use client";
import FormKinerja from "./form-kinerja";
import { Card } from "@/components/ui/card";
import { SectionHero } from "@/components/layout/section-hero";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { useSession } from "next-auth/react";
import { FileSpreadsheet, CheckCircle2 } from "lucide-react";

export default function VPageFormKinerja() {
  const { data: session } = useSession();
  return (
    <section className="relative ">
      <div className="mx-auto w-full h-full min-h-0 max-w-8xl px-6 py-6 flex flex-col">
        <div className="mb-6">
          <SectionHero
            title={`Unggah Data Kinerja`}
            subtitle={`Pengguna: ${String(session?.data?.user?.name || "-")}`}
            right={
              <>
                <div className="hidden sm:flex items-center gap-2 rounded-md border bg-background px-3 py-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  <div>
                    <div className="text-sm font-semibold">.xlsx</div>
                    <div className="text-xs text-muted-foreground">
                      Tipe berkas
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 rounded-md border bg-background px-3 py-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <div>
                    <div className="text-sm font-semibold">
                      <NumberTicker value={2} /> MB
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Batas ukuran
                    </div>
                  </div>
                </div>
              </>
            }
          />
        </div>
        <div className="mb-6 grid grid-cols-1 gap-3">
          <Card className="p-6">
            <FormKinerja />
          </Card>
        </div>
      </div>
    </section>
  );
}
