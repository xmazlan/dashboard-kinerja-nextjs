"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  TrendingUp,
  Users,
  BarChart3,
  CheckCircle2,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useOpdKinerjaData } from "@/hooks/query/use-opd-kinerja";
import { useSession } from "next-auth/react";
import { useAplikasiOpdData } from "@/hooks/query/use-aplikasi-opd";
import React from "react";
import { CodeBlock } from "@/components/ui/code-block";
import { SectionHero } from "@/components/layout/section-hero";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { toast } from "sonner";

export default function VPageOverview() {
  const { data: session, status } = useSession();

  const { data: aplikasiData, isLoading: isLoadingAplikasiData } =
    useAplikasiOpdData();
  const aplikasiOptions: Array<{
    id?: number;
    nama_aplikasi?: string;
    slug_aplikasi?: string;
  }> = Array.isArray(aplikasiData?.data) ? aplikasiData?.data : [];
  const [openCombobox, setOpenCombobox] = React.useState(false);
  const [opdAplication, setOpdAplication] = React.useState<string>("");
  const { data: opdKinerjaData } = useOpdKinerjaData({
    opdName: session?.data?.user?.opd_slug || "",
    opdAplication,
  });

  const kinerjaCount = React.useMemo(() => {
    const srcCandidate = opdKinerjaData as unknown;
    let raw: unknown = srcCandidate;
    if (
      srcCandidate &&
      typeof srcCandidate === "object" &&
      "data" in (srcCandidate as Record<string, unknown>)
    ) {
      raw = (srcCandidate as Record<string, unknown>).data as unknown;
    }
    if (Array.isArray(raw)) return raw.length;
    if (raw && typeof raw === "object")
      return Object.keys(raw as Record<string, unknown>).length;
    return 0;
  }, [opdKinerjaData]);
  return (
    <>
      {session?.data?.user?.role === "opd" ? (
        <section className="relative ">
          <div className="mx-auto w-full max-w-6xl px-6 py-6">
            <div className="mb-6">
              <SectionHero
                title={`Selamat datang, ${String(
                  session?.data?.user?.name || "Pengguna"
                )}`}
                subtitle={`Anda masuk sebagai OPD: ${String(
                  session?.data?.user?.opd_slug || "-"
                )}`}
                right={
                  <>
                    <div className="hidden sm:flex items-center gap-2 rounded-md border bg-background px-3 py-2">
                      <Users className="h-4 w-4" />
                      <div>
                        <div className="text-sm font-semibold">
                          <NumberTicker value={aplikasiOptions.length} />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Aplikasi tersedia
                        </div>
                      </div>
                    </div>

                    <Link href="/form">
                      <Button size="sm">Unggah Data Kinerja</Button>
                    </Link>
                  </>
                }
              />
            </div>

            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCombobox}
                    className="w-full justify-between"
                    disabled={isLoadingAplikasiData}
                  >
                    {(() => {
                      const cur = aplikasiOptions.find(
                        (opt) =>
                          String(opt.slug_aplikasi || "") ===
                          String(opdAplication || "")
                      );
                      return cur?.nama_aplikasi
                        ? String(cur.nama_aplikasi)
                        : isLoadingAplikasiData
                        ? "Memuat daftar aplikasi..."
                        : "Pilih aplikasi";
                    })()}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                  <Command>
                    <CommandInput
                      placeholder="Cari aplikasi..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>Tidak ada aplikasi.</CommandEmpty>
                      <CommandGroup>
                        {aplikasiOptions.map((opt, idx) => (
                          <CommandItem
                            key={idx}
                            value={String(opt.slug_aplikasi || "")}
                            onSelect={(currentValue) => {
                              const next =
                                currentValue === opdAplication
                                  ? ""
                                  : currentValue;
                              setOpdAplication(next);
                              setOpenCombobox(false);
                            }}
                          >
                            {String(opt.nama_aplikasi || "-")}
                            <Check
                              className={cn(
                                "ml-auto",
                                String(opdAplication || "") ===
                                  String(opt.slug_aplikasi || "")
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-1 flex-col gap-4 ">
              {opdAplication ? (
                <div className="rounded-md border bg-card shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 border-b">
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <TrendingUp className="h-3.5 w-3.5" />
                      JSON Output
                    </div>
                    <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {String(opdAplication)}
                    </div>
                  </div>
                  <div className="p-2">
                    <CodeBlock
                      language="json"
                      filename="response.json"
                      code={JSON.stringify(opdKinerjaData ?? {}, null, 2)}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Pilih aplikasi untuk menampilkan data kinerja.
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="relative ">
          <div className="mx-auto w-full max-w-6xl px-6 py-6">
            <div className="mb-6">
              <SectionHero
                title={`Selamat datang, ${String(
                  session?.data?.user?.name || "Pengguna"
                )}`}
                subtitle={`Anda masuk sebagai : ${String(
                  session?.data?.user?.opd_slug || "-"
                )}`}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
