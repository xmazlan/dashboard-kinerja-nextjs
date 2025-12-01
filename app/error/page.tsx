"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CardComponent from "@/components/card/card-component";
import { Button } from "@/components/ui/button";

export default function NextAuthErrorPage() {
  const params = useSearchParams();
  const router = useRouter();
  const error = params.get("error") || "";
  const errorDescription = params.get("error_description") || "";
  const provider = params.get("provider") || "";
  const callbackUrl = params.get("callbackUrl") || "";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <CardComponent className="max-w-xl w-full shadow-lg">
        <div className="space-y-4">
          <h1 className="text-lg font-semibold text-foreground">
            Error Autentikasi
          </h1>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              Kode error dari NextAuth
            </div>
            <div className="font-mono text-sm px-3 py-2 rounded-md border bg-card">
              {error || "Tidak ada error dari NextAuth"}
            </div>
          </div>
          {errorDescription && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Deskripsi</div>
              <div className="font-mono text-sm px-3 py-2 rounded-md border bg-card">
                {errorDescription}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => router.push("/auth")}>
              Kembali ke Login
            </Button>
            <Button
              onClick={() =>
                callbackUrl ? router.push(callbackUrl) : router.back()
              }
            >
              Coba Lagi
            </Button>
          </div>
          <div className="text-[11px] text-muted-foreground">
            {provider && <span>Provider: {provider}</span>}
          </div>
        </div>
      </CardComponent>
    </div>
  );
}
