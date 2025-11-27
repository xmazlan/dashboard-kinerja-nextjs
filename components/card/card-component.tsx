import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function CardComponent({
  children,
  className,
  title,
  description,
  options,
  action,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string | React.ReactNode;
  options?: {
    title?: string;
    description?: string;
  };
  action?: React.ReactNode;
}) {
  return (
    <>
      <Card className={cn("gap-0 py-1 flex flex-col h-full", className)}>
        <CardHeader className="px-1.5 py-0 ">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 md:gap-1.5">
            <div className="">
              <CardTitle className="mb-1">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <div className="text-xs md:text-right text-muted-foreground space-y-1">
              <p>{options?.title}</p>
              <p>{options?.description}</p>
              {action}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-1 pb-1 flex-1">{children}</CardContent>
      </Card>
    </>
  );
}
