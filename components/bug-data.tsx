"use client";

import React, { useEffect, useState } from "react";
// Shadcn UI Components
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// Icons
import { BugIcon, XIcon } from "lucide-react";

interface DebugErrorsProps {
  data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  buttonTitle?: string;
  buttonPosition?: "right" | "left";
  title?: string;
  placement?: "right" | "top" | "bottom" | "left" | undefined;
  isAutoOpen?: boolean;
}

export default function DebugErrors({
  data,
  buttonTitle = "Debug",
  buttonPosition = "right",
  title = "Debug Data",
  placement = "right",
  isAutoOpen = false,
}: DebugErrorsProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(isAutoOpen);
  }, [isAutoOpen]);

  // Map placement to shadcn Sheet side
  const getSheetSide = () => {
    switch (placement) {
      case "left":
        return "left";
      case "right":
        return "right";
      case "top":
        return "top";
      case "bottom":
        return "bottom";
      default:
        return "right";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`${
              buttonPosition === "right"
                ? "rounded-r-none rounded-l-lg"
                : "rounded-l-none rounded-r-lg"
            } shadow-lg bg-yellow-100 hover:bg-yellow-200 border-yellow-300`}
            onClick={() => setIsOpen(true)}
          >
            <BugIcon size={18} />
            {buttonTitle}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Klik untuk melihat debug data</p>
        </TooltipContent>
      </Tooltip>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side={getSheetSide()} className="w-[400px] sm:w-[640px]">
          <SheetHeader className="flex flex-col justify-between">
            <SheetTitle>{title}</SheetTitle>
            <span className="font-normal text-xs text-gray-500 italic">
              (Development Debug Only)
            </span>
          </SheetHeader>
          <Separator className="my-4" />
          <div className="font-mono text-xs p-4 bg-black/90 text-white rounded-md flex-1 overflow-auto">
            {data ? (
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(data, null, 2)}
              </pre>
            ) : (
              <span className="italic">
                Tidak ada data error untuk ditampilkan!
              </span>
            )}
          </div>
          <SheetFooter>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="shadow-lg"
            >
              <XIcon size={16} className="mr-2" />
              Tutup
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}
