"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { LogOut, Maximize, Minimize2 } from "lucide-react";
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
export function Navbar() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { data: session } = useSession();
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const toggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        void document.documentElement.requestFullscreen();
      } else {
        void document.exitFullscreen();
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
    <nav className="sticky top-0 z-50 border-b border-border overflow-hidden bg-transparent backdrop-blur supports-backdrop-filter:bg-background/10">
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
      <div className="relative z-10 px-4 py-2 sm:px-6 lg:px-8">
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
            <div className="hidden md:block">
              <DigitalClock variant="navbar" />
            </div>

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
    </nav>
  );
}
