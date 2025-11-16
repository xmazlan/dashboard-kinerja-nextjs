/** @type {import('next').NextConfig} */
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Konfigurasi untuk Next/Image
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pekadev.pekanbaru.go.id",
        pathname: "/berkas/**",
      },
      {
        protocol: "https",
        hostname: "superapp-api.pekanbaru.go.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.pekanbaru.go.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "smarttourism.pekanbaru.go.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sipuanpenari.pekanbaru.go.id",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tpid.pekanbaru.go.id",
        pathname: "/**",
      },
      // Tambahkan domain lain jika ada gambar dari sana
    ],
  },

  async headers() {
    const isDev = process.env.NODE_ENV === "development";

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
              `style-src 'self' 'unsafe-inline'`,
              // Izinkan gambar dari localhost:8000 saat development
              `img-src 'self' blob: data: https:${isDev ? " http://localhost:8000 http://localhost:*" : ""
              }`,
              "media-src 'self' blob: data: https://cctv.pekanbaru.go.id https://superapp.pekanbaru.go.id https://cdr.sakti112.id",
              "font-src 'self' data:",
              // PENTING: Tambahkan semua CDN dan API yang dibutuhkan
              [
                "connect-src 'self' https: wss: ws:",
                // API Pemkot Pekanbaru
                "https://superapp-api.pekanbaru.go.id",
                "https://www.pekanbaru.go.id",
                "https://pekadev.pekanbaru.go.id",
                "https://smarttourism.pekanbaru.go.id",
                "https://api-disnaker.pekanbaru.go.id",
                "https://sso.pekanbaru.go.id", // SSO Authentication API
                "https://core-api.bapenda.pekanbaru.go.id",
                "https://esurat.pekanbaru.go.id",
                "https://antrian.mpp.pekanbaru.go.id",
                // External APIs
                "https://timeapi.io",
                "https://nominatim.openstreetmap.org", // Untuk geolocation
                // Google Maps API
                "https://maps.googleapis.com",
                "https://maps.gstatic.com",
                // Pusher API for app authentication
                "https://*.pusher.com",
                "https://*.pusherapp.com",
                "wss://*.pusher.com",
                "wss://*.pusherapp.com",
                // Pusher WebSocket connections
                "wss://ws-mt1.pusher.com",
                "wss://ws-ap1.pusher.com",
                "wss://ws-ap2.pusher.com",
                "wss://ws-ap3.pusher.com",
                "wss://ws-ap4.pusher.com",
                "wss://ws-eu.pusher.com",
                "wss://ws-us2.pusher.com",
                "wss://ws-us3.pusher.com",
                "wss://ws-us4.pusher.com",
                "wss://ws-us5.pusher.com",
                "wss://ws-us6.pusher.com",
                "wss://ws-us7.pusher.com",
                "wss://ws-us8.pusher.com",
                "wss://ws-us9.pusher.com",
                "wss://ws-us10.pusher.com",
                "wss://ws-us11.pusher.com",
                "wss://ws-sa1.pusher.com",
                // Development
                isDev
                  ? "ws://localhost:* wss://localhost:* http://localhost:*"
                  : "",
              ]
                .filter(Boolean)
                .join(" "),
              "frame-src 'self' https://www.google.com https://www.youtube.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
            ]
              .filter(Boolean)
              .join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
