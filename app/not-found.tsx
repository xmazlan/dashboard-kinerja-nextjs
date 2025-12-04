import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Home, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan",
  description: "Dashboard Kinerja OPD Kota Pekanbaru",
};

export default function NotFound() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-background" />
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-900/30" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-900/30" />
      </div>

      <div className="mx-auto w-full max-w-3xl px-6 text-center">
        <div className="mb-6 inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
          Halaman tidak ditemukan
        </div>

        <h1 className="mb-3 text-7xl font-black tracking-tight">
          <span className="bg-linear-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
            404
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
          Maaf, kami tidak dapat menemukan halaman yang Anda cari. Periksa
          kembali URL atau kembali ke beranda.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link href="/" prefetch>
            <Button variant="default" className="h-11 px-5">
              <Home className="mr-2 h-4 w-4" /> Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
