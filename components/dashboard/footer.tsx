import Image from "next/image";
import { Mail, Phone, Clock } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-1 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Info Dinas */}
          <div className="flex flex-col items-center justify-center gap-1">
            <Image
              src="/assets/logo-pemko-kominfo.webp"
              alt="Logo Pemerintah Kota Pekanbaru"
              width={100}
              height={100}
              priority
              className="shrink-0 object-contain drop-shadow-sm"
            />
          </div>
        </div>

        {/* Divider */}
        <div className=" border-border">
          <p className="text-center text-xs text-muted-foreground">
            © {currentYear} {process.env.NEXT_PUBLIC_APP_NAME}. Semua hak
            dilindungi. {process.env.NEXT_PUBLIC_APP_DESCRIPTION}
          </p>
        </div>
      </div>
    </footer>
  );
}
