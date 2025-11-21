import Image from "next/image";
import { Mail, Phone, Clock } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Info Dinas */}
          <div>
            <Image
              src="/assets/logo-pemko-kominfo.webp"
              alt="Logo Pemerintah Kota Pekanbaru"
              width={190}
              height={190}
              priority
              className=" shrink-0 object-contain drop-shadow-sm"
            />
            {/* <h3 className="mt-4 text-base font-semibold text-foreground">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {process.env.NEXT_PUBLIC_APP_DESCRIPTION}
            </p> */}
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Tautan Cepat
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Laporan Kinerja
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dokumentasi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Kontak
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Hubungi Kami
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                helpdesk@pekanbaru.go.id
              </li>

              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Senin–Jumat 08:00–17:00
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-border pt-6">
          <p className="text-center text-xs text-muted-foreground">
            © {currentYear} {process.env.NEXT_PUBLIC_APP_NAME}. Semua hak
            dilindungi. {process.env.NEXT_PUBLIC_APP_DESCRIPTION}
          </p>
        </div>
      </div>
    </footer>
  );
}
