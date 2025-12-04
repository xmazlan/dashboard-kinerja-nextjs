"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { cn } from "@/lib/utils"

type CodeViewProps = {
  jsonData: any
  title?: string
  maxHeight?: string
  className?: string
}

export function CodeView({ jsonData, title = "JSON Output", maxHeight = "60vh", className }: CodeViewProps) {
  const jsonString = React.useMemo(() => JSON.stringify(jsonData ?? {}, null, 2), [jsonData])
  const lines = React.useMemo(() => jsonString.split("\n"), [jsonString])

  return (
    <div className={cn("rounded-md border bg-card shadow-sm", className)}>
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="text-xs font-medium">{title}</div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-2 text-xs"
          onClick={() => {
            try {
              void navigator.clipboard.writeText(jsonString)
            } catch {}
          }}
        >
          <Copy className="size-3.5 mr-1 opacity-70" /> Copy
        </Button>
      </div>
      <div className="overflow-auto" style={{ maxHeight }}>
        <div className="grid grid-cols-[auto_1fr] gap-0">
          <div className="bg-muted/40 text-muted-foreground px-2 py-2 text-[11px] font-mono select-none">
            {lines.map((_, i) => (
              <div key={i} className="leading-5 tabular-nums">
                {String(i + 1).padStart(2, " ")}
              </div>
            ))}
          </div>
          <pre className="px-3 py-2 text-xs font-mono whitespace-pre leading-5">
            {jsonString}
          </pre>
        </div>
      </div>
    </div>
  )
}

