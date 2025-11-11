"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Maximize, Minimize2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ThemeSwitcher } from "../theme-switcher";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import AlertModal from "../modal/alert-modal";
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
    } catch (e) {
      // noop: Fullscreen might be blocked by browser
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut({ callbackUrl: "/", redirect: true });
      toast.success("Logout berhasil. Mengalihkan...");
    } catch (error) {
      toast.error("Logout gagal. Silakan coba lagi.");
    } finally {
      setIsLoggingOut(false);
      setLogoutOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {process.env.NEXT_PUBLIC_APP_DESCRIPTION}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label={
                isFullscreen ? "Keluar fullscreen" : "Masuk fullscreen"
              }
              onClick={toggleFullscreen}
              className="hover:bg-muted"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </Button>
            <ThemeSwitcher />
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
