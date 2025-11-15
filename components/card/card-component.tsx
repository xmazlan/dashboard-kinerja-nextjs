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
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string | React.ReactNode;
  options?: {
    title?: string;
    description?: string;
  };
}) {
  return (
    <>
      <Card className={cn("gap-1 py-2", className)}>
        <CardHeader className="px-3 pt-1 pb-0">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 md:gap-2">
            <div className="">
              <CardTitle className="mb-1">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <div className="text-xs md:text-right text-muted-foreground space-y-1">
              <p>{options?.title}</p>
              <p>{options?.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-3 pb-1">{children}</CardContent>
      </Card>
    </>
  );
}
