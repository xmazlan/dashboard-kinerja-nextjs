import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { FileSpreadsheet, LayoutDashboard, User } from "lucide-react";

export default function NavOPD({
  pathname,
  name,
  role,
}: {
  pathname: string;
  name?: string;
  role: string;
}) {
  return (
    <>
      <div className="relative z-10 border-t border-border bg-background/50 backdrop-blur supports-backdrop-filter:bg-background/75">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-1">
              <Link href="/overview" className="inline-block">
                <Button
                  size="sm"
                  variant={pathname === "/overview" ? "default" : "outline"}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 mr-1" /> Overview
                </Button>
              </Link>
              {role === "opd" ? (
                <Link href="/form" className="inline-block">
                  <Button
                    size="sm"
                    variant={pathname === "/form" ? "default" : "outline"}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 mr-1" /> Form
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/master/opd" className="inline-block">
                    <Button
                      size="sm"
                      variant={
                        pathname === "/master/opd" ? "default" : "outline"
                      }
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 mr-1" /> OPD
                    </Button>
                  </Link>
                  <Link href="/master/applications" className="inline-block">
                    <Button
                      size="sm"
                      variant={
                        pathname === "/master/applications"
                          ? "default"
                          : "outline"
                      }
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 mr-1" />{" "}
                      Application
                    </Button>
                  </Link>
                  <Link href="/master/template-exel" className="inline-block">
                    <Button
                      size="sm"
                      variant={
                        pathname === "/master/template-exel"
                          ? "default"
                          : "outline"
                      }
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 mr-1" /> Template
                      Excel
                    </Button>
                  </Link>
                  <Link href="/master/users" className="inline-block">
                    <Button
                      size="sm"
                      variant={
                        pathname === "/master/users" ? "default" : "outline"
                      }
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 mr-1" /> Users
                    </Button>
                  </Link>
                </>
              )}
            </div>
            {name && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-3.5 h-3.5" />
                <span className="truncate max-w-[50vw] sm:max-w-[30vw]">
                  {name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
