"use client";

import type React from "react";

import { } from "react";
import { Eye, EyeOff, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useTheme } from "next-themes";
import { ImageCarousel } from "@/components/image-carousel";

import { LoginForm } from "./f-login";
import Image from "next/image";
import { motion } from "motion/react";

export default function Vlogin() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
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

  // Motion variants untuk animasi halus dan konsisten
  const slideInLeft = {
    hidden: { opacity: 0, x: -24, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
    },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 24, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
    },
  };

  const listContainer = {
    hidden: {},
    visible: {},
  };

  const listItem = {
    hidden: { opacity: 0, x: -12 },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  // Konfigurasi bar untuk animasi chart background
  const bgChartBars = Array.from({ length: 18 }, (_, i) => ({
    x: i * 6,
    width: 4,
    baseHeight: 18 + (i % 5) * 6,
    delay: i * 0.12,
  }));

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Unified Animated Background Layers */}
      <div className="absolute inset-0 bg-animated-gradient" />
      <div className="absolute inset-0 bg-animated-grid opacity-15 mix-blend-overlay" />
      {/* Theme Switcher */}
      <div className="absolute top-4 right-4 z-30">
        <ThemeSwitcher />
      </div>
      {/* Animated Chart Background */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-30">
          <motion.svg
            className="w-full h-full text-black dark:text-white"
            viewBox="0 0 108 64"
            preserveAspectRatio="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <defs>
              <linearGradient id="bgBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="currentColor"
                  stopOpacity="0.28"
                />
                <stop
                  offset="100%"
                  stopColor="currentColor"
                  stopOpacity="0.06"
                />
              </linearGradient>
            </defs>

            {bgChartBars.map((b, idx) => (
              <motion.rect
                key={`bar-${idx}`}
                x={b.x}
                width={b.width}
                rx={1}
                initial={{ y: 64 - b.baseHeight, height: b.baseHeight }}
                animate={{
                  y: [
                    64 - b.baseHeight,
                    64 - (b.baseHeight + 8),
                    64 - b.baseHeight,
                  ],
                  height: [b.baseHeight, b.baseHeight + 8, b.baseHeight],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                  delay: b.delay,
                }}
                fill="url(#bgBarGradient)"
              />
            ))}

            <motion.path
              d="M0 40 C 18 36, 36 44, 54 36 S 90 44 108 40"
              stroke="currentColor"
              strokeOpacity={0.22}
              strokeWidth={0.6}
              fill="none"
              initial={{ pathLength: 0, opacity: 0.6 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </motion.svg>
      </div>
      {/* Accent orbits - moved to root so kedua section seragam */}
      <div className="pointer-events-none select-none absolute inset-0">
        <div className="absolute top-16 right-16 w-96 h-96 rounded-full border-2 border-white/25 animate-spin-slow opacity-30"></div>
        <div className="absolute bottom-12 left-12 w-72 h-72 rounded-full border-2 border-white/20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-white/15 animate-pulse"></div>
      </div>
      {/* Content wrapper: columns stacked on mobile, side-by-side on desktop */}
      <div className="relative z-10 flex flex-1 flex-col lg:flex-row">
        {/* Left Section - Branding & Features with Carousel */}
        <motion.div
          className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between text-white relative overflow-hidden"
          variants={slideInLeft}
          initial="hidden"
          animate="visible"
          transition={{ type: "spring", stiffness: 140, damping: 22 }}
        >
          {/* Content */}
          <motion.div
            className="relative z-10"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.55, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Image
                src="/assets/logo_pekanbaru.png"
                alt="Logo Pemerintah Kota Pekanbaru"
                width={68}
                height={68}
                priority
                className="size-16 shrink-0 object-contain drop-shadow-sm"
              />
              <div className="">
                <div className="text-xl md:text-4xl font-bold tracking-tight text-white drop-shadow-md">
                  {process.env.NEXT_PUBLIC_APP_NAME}
                </div>
                <div className="text-base md:text-lg text-white/90 font-normal">
                  {process.env.NEXT_PUBLIC_APP_DESCRIPTION}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Carousel */}
          <motion.div
            className="relative z-10 h-70 w-full mt-4 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-[1px]/30"
            initial={{ opacity: 0, scale: 0.98, filter: "blur(2px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <ImageCarousel images={carouselImages} autoplay interval={5000} />
          </motion.div>

          {/* Features */}
          <motion.div
            className="relative z-10 space-y-5"
            variants={listContainer}
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.15 }}
          >
            <motion.div
              className="flex gap-4 items-start group transition-transform duration-300"
              whileHover={{ x: 8 }}
              variants={listItem}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
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
            </motion.div>

            <motion.div
              className="flex gap-4 items-start group transition-transform duration-300"
              whileHover={{ x: 8 }}
              variants={listItem}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
                <ChevronRight className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold mb-1.5 text-base">
                  Laporan Komprehensif
                </div>
                <div className="text-white/80 text-sm leading-relaxed">
                  Buat dan analisis laporan dengan mudah menggunakan tools
                  canggih
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex gap-4 items-start group transition-transform duration-300"
              whileHover={{ x: 8 }}
              variants={listItem}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
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
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Section - Login Form */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center p-6 flex-1 lg:flex-none"
          variants={slideInRight}
          initial="hidden"
          animate="visible"
          transition={{ type: "spring", stiffness: 140, damping: 22 }}
        >
          <Card className="w-full max-w-md animate-fade-in shadow-xl   border border-border dark:border-white/20">
            <CardHeader className="lg:hidden">
              <motion.div
                className="text-center"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.55, ease: "easeInOut" }}
              >
                <Image
                  src="/assets/logo_pekanbaru.png"
                  alt="Logo Pemerintah Kota Pekanbaru"
                  width={48}
                  height={48}
                  priority
                  className="mx-auto size-12 object-contain drop-shadow-sm mb-3"
                />
                <CardTitle className="text-3xl md:text-4xl text-foreground dark:text-white tracking-tight">
                  Dashboard Kinerja
                </CardTitle>
                <CardDescription className="text-sm md:text-base mt-2 text-muted-foreground dark:text-white/80">
                  Masuk ke akun Anda
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardHeader className="hidden lg:block">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1, duration: 0.55, ease: "easeInOut" }}
              >
                <CardTitle className="text-4xl text-foreground dark:text-white mb-3 tracking-tight ">
                  Masuk
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground dark:text-white/80">
                  Dashboard Kinerja Kota Pekanbaru
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent>
              {/* Form */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.15, duration: 0.55, ease: "easeInOut" }}
              >
                <LoginForm />
              </motion.div>

              {/* Divider */}
              {/* <motion.div
                className="flex items-center gap-4 my-8"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.25, duration: 0.55, ease: "easeInOut" }}
              >
                <div className="flex-1 h-px bg-border dark:bg-white/20"></div>
                <span className="text-sm text-muted-foreground font-medium">
                  atau
                </span>
                <div className="flex-1 h-px bg-border dark:bg-white/20"></div>
              </motion.div> */}

              {/* Alternative Login */}
              {/* <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.35, duration: 0.55, ease: "easeInOut" }}
              >
                <Button
                  variant="outline"
                  className="w-full h-12 border-2 border-border dark:border-white/30 hover:border-border dark:hover:border-white bg-muted/30 dark:bg-transparent text-foreground dark:text-white font-semibold transition-all hover:bg-muted dark:hover:bg-white/10"
                >
                  Masuk dengan SSO
                </Button>
              </motion.div> */}
            </CardContent>

            {/* <CardFooter>
              <motion.p
                className="text-center text-sm text-muted-foreground dark:text-white/70 w-full"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.45, duration: 0.55, ease: "easeInOut" }}
              >
                Butuh akses?{" "}
                <a
                  href="#"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Hubungi administrator
                </a>
              </motion.p>
            </CardFooter> */}
          </Card>
        </motion.div>
      </div>
      {/* Global Footer */}
      <footer className="relative z-10 w-full px-6 py-4 text-center text-sm text-white dark:text-white/70">
        © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {process.env.NEXT_PUBLIC_APP_NAME}. Hak
        cipta dilindungi.
      </footer>
    </div>
  );
}
