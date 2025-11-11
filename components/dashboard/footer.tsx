export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Info Dinas */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">
              {process.env.NEXT_PUBLIC_APP_DESCRIPTION}
            </p>
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
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Laporan Kinerja
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dokumentasi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
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
              <li className="text-xs text-muted-foreground">
                Email: info@dinas.gov.id
              </li>
              <li className="text-xs text-muted-foreground">
                Telp: (021) 1234-5678
              </li>
              <li className="text-xs text-muted-foreground">
                Jam Operasional: Senin-Jumat 08:00-17:00
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
