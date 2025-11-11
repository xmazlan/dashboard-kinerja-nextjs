import { SiteConfig } from "@/types";

// Environment Variables
const nameApp = process.env.NEXT_PUBLIC_APP_NAME || "Dashboard Kinerja";
const urlApp = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const siteConfig: SiteConfig = {
  name: `${nameApp}`,
  author: "Roby Ajo",
  description: `${nameApp} - Platform pemantauan, visualisasi, dan pelaporan kinerja perangkat daerah/OPD. Pantau indikator, target, realisasi, dan capaian dalam satu dashboard terintegrasi.`,
  keywords: [
    `${nameApp}`,
    "Dashboard Kinerja",
    "Kinerja OPD",
    "Indikator Kinerja",
    "Target",
    "Realisasi",
    "Capaian",
    "Monitoring",
    "Pelaporan",
    "Evaluasi",
    "Analitik",
    "Visualisasi Data",
    "KPI",
    "Renstra",
    "RKPD",
    "RPJMD",
    "Pemda",
    "SKPD",
    "Pemantauan Program",
    "Progress",
    "Performa",
    "Grafik",
    "Tabel",
    "Dashboard",
    "Data Terintegrasi",
    "Manajemen Kinerja",
    "Rekapitulasi",
    "Pelacakan",
    "Audit Kinerja",
    "Aplikasi Pemerintah",
    "Kominfo",
  ],
  url: {
    base: `${urlApp}`,
    author: "https://portfolio-roby.vercel.app",
  },
  links: {
    github: "https://github.com/robyajo",
  },
  ogImage: `${urlApp}/og.png`,
  locale: "id_ID",
  type: "website",
  publishedTime: new Date().toISOString(),
  twitterCard: "summary_large_image",
};

export const menuConfig = [
  { href: "/", label: "Beranda" },
  { href: "/layanan", label: "Layanan" },
  { href: "/about", label: "Tentang" },
];
