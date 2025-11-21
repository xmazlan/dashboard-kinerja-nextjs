// app/api/server-time/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const isoTime = new Date().toISOString(); // ISO format stabil dan langsung dari UTC

    return NextResponse.json(
      { serverTime: isoTime },
      {
        headers: {
          // Tambahkan header cache-control untuk mencegah caching
          'Cache-Control': 'no-store, max-age=0',
          // Tambahkan header CORS untuk mengizinkan akses dari mana saja
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  } catch (error) {
    console.error('Error dalam API route server-time:', error);
    return NextResponse.json(
      { error: 'Gagal mendapatkan waktu server', serverTime: new Date().toISOString() },
      { 
        status: 200, // Tetap kembalikan 200 dengan waktu lokal sebagai fallback
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  }
}