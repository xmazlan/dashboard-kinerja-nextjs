import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/next";
import { getToken } from "next-auth/jwt";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CURL"],
    }),
    slidingWindow({ mode: "LIVE", interval: 60, max: 100 }),
  ],
});

// Arcjet middleware untuk semua requests
async function arcjetMiddleware(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for") || "";
  const ipHeader = (forwardedFor.split(",")[0] || "").trim();
  const reqIp = (request as unknown as { ip?: string }).ip;
  const ip =
    reqIp ||
    ipHeader ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    undefined;

  // Jika IP tidak tersedia, jangan blokir: bypass Arcjet agar aplikasi tetap berjalan
  if (!ip) {
    return null;
  }

  try {
    const ctx = {
      ip,
      headers: request.headers,
      method: request.method,
      url: request.url,
    };
    const decision = await aj.protect(ctx as unknown as NextRequest);

    if (decision.isDenied()) {
      console.log("Arcjet blocked request:", decision.reason);

      if (decision.reason.isRateLimit()) {
        return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
      } else if (decision.reason.isBot()) {
        return NextResponse.json({ error: "Bot Detected" }, { status: 403 });
      } else {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
  } catch (error) {
    // Jika Arcjet gagal (mis. fingerprint error), bypass agar request tetap berjalan
    console.error("Arcjet error, bypassing protection:", error);
  }

  return null;
}

// Halaman publik tidak memerlukan autentikasi
const publicPages = ["/"];

export default async function middleware(req: NextRequest) {
  // Jalankan Arcjet protection terlebih dahulu untuk semua request
  const arcjetResponse = await arcjetMiddleware(req);
  if (arcjetResponse) return arcjetResponse;

  const path = req.nextUrl.pathname;

  // Skip middleware untuk aset statis (file dengan ekstensi)
  const staticExtensions = [
    ".css",
    ".js",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".webp",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
    ".otf",
  ];
  if (staticExtensions.some((ext) => path.endsWith(ext))) {
    return NextResponse.next();
  }

  // Jika mengakses halaman login dan sudah login, larikan ke dashboard
  if (publicPages.some((page) => path.startsWith(page))) {
    try {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      // Jika sudah login dan mencoba akses halaman login, arahkan ke dashboard
      if (token && path === "/") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } catch (error) {
      // jika error, biarkan lanjut ke login page
      console.error("Auth check on login page error:", error);
    }
  }

  // Handle configuration routes dengan akses berdasarkan peran
  if (path.startsWith("/configuration")) {
    try {
      const token = await getToken({
        req: req,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        // Jika tidak ada token, arahkan ke halaman login
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Periksa peran pengguna
      type TokenRole = { user?: { role?: string }; role?: string } | null;
      const tk = token as TokenRole;
      const userRole = tk?.user?.role || tk?.role || "";

      if (!["Super Admin", "super admin", "SuperAdmin"].includes(userRole)) {
        // Jika rolenya tidak sesuai, arahkan ke halaman terlarang
        return NextResponse.redirect(new URL("//prohibited", req.url));
      }
    } catch (error) {
      console.error("Auth error:", error);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Handle rute terlindungi lainnya (dashboard, sso/profile, dll.)
  const protectedPaths = ["/dashboard"];

  if (protectedPaths.some((protectedPath) => path.startsWith(protectedPath))) {
    try {
      const token = await getToken({
        req: req,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        // Jika tidak ada token, arahkan ke halaman login
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (error) {
      console.error("Auth error:", error);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Jika tidak ada aturan yang cocok, lanjutkan request
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
