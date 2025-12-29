"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Maximize,
  Minimize2,
  SlidersHorizontal,
  LayoutDashboard,
  FileSpreadsheet,
  RefreshCw,
  Play,
  Pause,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ThemeSwitcher } from "../theme-switcher";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import AlertModal from "../modal/alert-modal";
import Image from "next/image";
import DigitalClock from "@/components/dashboard/digital-clock";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { useDashboardStore } from "@/hooks/use-dashboard";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandMenu } from "@/components/command-menu";
import NavOPD from "./nav-opd";
export function Navbar() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { data: session } = useSession();
  const viewMode = useDashboardStore((s) => s.viewMode);
  const setViewMode = useDashboardStore((s) => s.setViewMode);
  const topGap = useDashboardStore((s) => s.topGap);
  const bottomGap = useDashboardStore((s) => s.bottomGap);
  const speed = useDashboardStore((s) => s.speed);
  const childSpeed = useDashboardStore((s) => s.childSpeed);
  const setTopGap = useDashboardStore((s) => s.setTopGap);
  const setBottomGap = useDashboardStore((s) => s.setBottomGap);
  const setSpeed = useDashboardStore((s) => s.setSpeed);
  const setChildSpeed = useDashboardStore((s) => s.setChildSpeed);
  const resetSpeed = useDashboardStore((s) => s.resetSpeed);
  const resetChildSpeed = useDashboardStore((s) => s.resetChildSpeed);
  const isGlobalPaused = useDashboardStore((s) => s.isGlobalPaused);
  const toggleGlobalPaused = useDashboardStore((s) => s.toggleGlobalPaused);
  const pathname = usePathname();

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const handleChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const safeViewMode = hydrated ? viewMode : "page";
  const safeTopGap = hydrated ? topGap : 0;
  const safeBottomGap = hydrated ? bottomGap : 0;
  const safeSpeed = hydrated ? (speed >= 3000 ? speed : 3000) : 4000;
  const safeChildSpeed = hydrated
    ? childSpeed >= 3000
      ? childSpeed
      : 3000
    : 4000;

  const toggleFullscreen = async () => {
    try {
      const el = document.documentElement as HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void> | void;
        msRequestFullscreen?: () => Promise<void> | void;
      };
      const doc = document as Document & {
        webkitExitFullscreen?: () => Promise<void> | void;
        msExitFullscreen?: () => Promise<void> | void;
      };
      if (!document.fullscreenElement) {
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
          el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
          el.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        } else if (doc.msExitFullscreen) {
          doc.msExitFullscreen();
        }
      }
    } catch {}
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut({ callbackUrl: "/", redirect: true });
      toast.success("Logout berhasil. Mengalihkan...");
    } catch {
      toast.error("Logout gagal. Silakan coba lagi.");
    } finally {
      setIsLoggingOut(false);
      setLogoutOpen(false);
    }
  };

  return (
    <nav
      data-role="navbar"
      className="sticky top-0 z-50 border-b border-border overflow-hidden bg-transparent backdrop-blur supports-backdrop-filter:bg-background/10"
    >
      <div className="absolute inset-0 -z-10 pointer-events-none bg-animated-gradient" />
      <div className="absolute inset-0 -z-10 pointer-events-none bg-animated-grid opacity-15 mix-blend-overlay" />
      <motion.svg
        className="absolute inset-0 -z-10 pointer-events-none w-full h-full opacity-20"
        viewBox="0 0 108 16"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.path
          d="M0 10 C 18 8, 36 12, 54 8 S 90 12 108 10"
          stroke="currentColor"
          strokeOpacity={0.25}
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
      <div className="relative z-10 px-4 py-1 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/logo_pekanbaru.png"
              alt="Logo Pemerintah Kota Pekanbaru"
              width={32}
              height={32}
              priority
              className=" shrink-0 object-contain drop-shadow-sm"
            />

            <div className="min-w-0">
              <div className="text-base sm:text-lg font-bold tracking-tight text-white drop-shadow-md truncate max-w-[55vw] sm:max-w-[40vw]">
                {process.env.NEXT_PUBLIC_APP_NAME}
              </div>
              <div className="hidden sm:block text-xs text-white/90 font-normal truncate max-w-[55vw] sm:max-w-[40vw]">
                {process.env.NEXT_PUBLIC_APP_DESCRIPTION}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {session?.data?.user?.role === "pimpinan" && (
              <div className="hidden sm:block">
                <Suspense fallback={null}>
                  <CommandMenu />
                </Suspense>
              </div>
            )}
            <div className="hidden md:block">
              <DigitalClock variant="navbar" />
            </div>
            {session?.data?.user?.role === "pimpinan" && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={
                        isGlobalPaused ? "Mainkan Slide" : "Hentikan Slide"
                      }
                      onClick={toggleGlobalPaused}
                      className="hover:bg-muted hidden sm:inline-flex"
                    >
                      {isGlobalPaused ? (
                        <Play className="w-5 h-5" />
                      ) : (
                        <Pause className="w-5 h-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isGlobalPaused ? "Mainkan Slide" : "Hentikan Slide"}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={
                        isFullscreen ? "Keluar fullscreen" : "Masuk fullscreen"
                      }
                      onClick={toggleFullscreen}
                      className="hover:bg-muted hidden sm:inline-flex"
                    >
                      {isFullscreen ? (
                        <Minimize2 className="w-5 h-5" />
                      ) : (
                        <Maximize className="w-5 h-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isFullscreen ? "Keluar fullscreen" : "Masuk fullscreen"}
                    </p>
                  </TooltipContent>
                </Tooltip>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Pengaturan Tampilan"
                      className="hover:bg-muted"
                    >
                      <SlidersHorizontal className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Pengaturan Tampilan</SheetTitle>
                    </SheetHeader>
                    <div className="px-4 space-y-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Mode</div>
                        <div className="flex gap-2">
                          <Button
                            variant={
                              safeViewMode === "slide" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setViewMode("slide")}
                          >
                            Slide
                          </Button>
                          <Button
                            variant={
                              safeViewMode === "page" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setViewMode("page")}
                          >
                            Halaman
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Jarak Atas</div>
                        <Slider
                          value={[safeTopGap]}
                          min={0}
                          max={64}
                          onValueChange={(v) => setTopGap(v[0] ?? topGap)}
                        />
                        <div className="text-xs text-muted-foreground">
                          {safeTopGap}px
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Jarak Bawah</div>
                        <Slider
                          value={[safeBottomGap]}
                          min={0}
                          max={64}
                          onValueChange={(v) => setBottomGap(v[0] ?? bottomGap)}
                        />
                        <div className="text-xs text-muted-foreground">
                          {safeBottomGap}px
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">
                            Kecepatan Slide (ms)
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={resetSpeed}
                            title="Reset Kecepatan Slide"
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                        </div>
                        <Slider
                          value={[safeSpeed]}
                          min={3000}
                          max={10000}
                          onValueChange={(v) => setSpeed(v[0] ?? speed)}
                        />
                        <div className="text-xs text-muted-foreground">
                          {safeSpeed} ms
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">
                            Kecepatan Slide Anak (ms)
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={resetChildSpeed}
                            title="Reset Kecepatan Slide Anak"
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                        </div>
                        <Slider
                          value={[safeChildSpeed]}
                          min={3000}
                          max={10000}
                          onValueChange={(v) =>
                            setChildSpeed(v[0] ?? childSpeed)
                          }
                        />
                        <div className="text-xs text-muted-foreground">
                          {safeChildSpeed} ms
                        </div>
                      </div>
                    </div>
                    <SheetFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setViewMode("slide");
                          setTopGap(16);
                          setBottomGap(16);
                          setSpeed(
                            Number(process.env.NEXT_PUBLIC_SPEED_LIDER) || 4000
                          );
                          setChildSpeed(
                            Number(process.env.NEXT_PUBLIC_SPEED_CHILD) || 4000
                          );
                        }}
                      >
                        Reset
                      </Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </>
            )}

            <div className="">
              <ThemeSwitcher />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {session?.data?.user?.name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-10 w-10 rounded-lg">
                      <AvatarFallback className="rounded-lg">
                        {session?.data?.user?.name?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {session?.data?.user?.name}
                      </span>
                      <span className="truncate text-xs">
                        {session?.data?.user?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLogoutOpen(true)}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <AlertModal
        isOpen={logoutOpen}
        onOpenChange={setLogoutOpen}
        data={null}
        isDeleting={isLoggingOut}
        handleDelete={() => handleLogout()}
        title="Keluar dari akun"
        description="Anda yakin ingin keluar dari akun Anda?"
        cancelLabel="Batal"
        actionLabel={isLoggingOut ? "Keluar..." : "Keluar"}
        actionClassName="bg-blue-600 hover:bg-blue-700"
      />
      {(session?.data?.user?.role === "opd" ||
        session?.data?.user?.role === "superadmin") && (
        <NavOPD
          pathname={pathname}
          name={session?.data?.user?.name}
          role={session?.data?.user?.role}
        />
      )}
    </nav>
  );
}
