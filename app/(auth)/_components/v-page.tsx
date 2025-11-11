"use client";

import type React from "react";

import { useState } from "react";
import { Eye, EyeOff, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageCarousel } from "@/components/image-carousel";

import { LoginForm } from "./f-login";
import Image from "next/image";

export default function Vlogin() {
  const carouselImages = [
    {
      src: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1106",
      alt: "Globe",
    },
    {
      src: "https://plus.unsplash.com/premium_photo-1683980578016-a1f980719ec2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735",
      alt: "Next.js",
    },
    {
      src: "https://images.unsplash.com/photo-1516383274235-5f42d6c6426d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1174",
      alt: "Next.js",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Branding & Features with Carousel */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-600 via-blue-700 to-orange-500 p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="pointer-events-none select-none absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full border-2 border-white/30 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full border-2 border-white/30 animate-pulse delay-75"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 border-white/20 animate-pulse delay-150"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Image
              src="/assets/logo_pekanbaru.png"
              alt="Logo Pemerintah Kota Pekanbaru"
              width={40}
              height={40}
              priority
              className="size-10 shrink-0 object-contain drop-shadow-sm"
            />
            <div className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-md">
              Dashboard Kinerja
            </div>
          </div>
          <div className="text-base md:text-lg text-white/90 font-normal">
            Sistem Monitoring Performa Dinas
          </div>
        </div>

        {/* Carousel */}
        <div className="relative z-10 h-70 w-full mt-4 rounded-2xl overflow-hidden shadow-2xl">
          <ImageCarousel images={carouselImages} autoplay interval={5000} />
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-5">
          <div className="flex gap-4 items-start group hover:translate-x-2 transition-transform duration-300">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
              <ChevronRight className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold mb-1.5 text-base">
                Analitik Real-time
              </div>
              <div className="text-white/80 text-sm leading-relaxed">
                Pantau kinerja dinas secara langsung dengan visualisasi data
                interaktif
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-start group hover:translate-x-2 transition-transform duration-300">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
              <ChevronRight className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold mb-1.5 text-base">
                Laporan Komprehensif
              </div>
              <div className="text-white/80 text-sm leading-relaxed">
                Buat dan analisis laporan dengan mudah menggunakan tools canggih
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-start group hover:translate-x-2 transition-transform duration-300">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
              <ChevronRight className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold mb-1.5 text-base">
                Keamanan Terjamin
              </div>
              <div className="text-white/80 text-sm leading-relaxed">
                Akses terenkripsi dengan autentikasi enterprise-grade
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-white/70 text-sm">
          © {new Date().getFullYear()} Dashboard Kinerja Dinas. Hak cipta
          dilindungi.
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Header */}
          <div className="lg:hidden mb-10 text-center">
            <Image
              src="/assets/logo_pekanbaru.png"
              alt="Logo Pemerintah Kota Pekanbaru"
              width={48}
              height={48}
              priority
              className="mx-auto size-12 object-contain drop-shadow-sm mb-3"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Dashboard Kinerja
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">Masuk ke akun Anda</p>
          </div>

          {/* Desktop Branding */}
          <div className="hidden lg:block mb-10">
            <h2 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
              Selamat Datang
            </h2>
            <p className="text-muted-foreground text-base">
              Masuk ke dashboard kinerja dinas Anda
            </p>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-sm text-muted-foreground font-medium">
              atau
            </span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Alternative Login */}
          <Button
            variant="outline"
            className="w-full h-12 border-2 border-border hover:bg-muted text-foreground bg-transparent font-semibold transition-all hover:border-blue-600"
          >
            Masuk dengan SSO
          </Button>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Butuh akses?{" "}
            <a
              href="#"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Hubungi administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
