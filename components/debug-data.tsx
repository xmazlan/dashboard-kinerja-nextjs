import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DebugData({ data }: { data: any }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="mt-6">
      <details>
        <summary className="cursor-pointer text-sm font-medium text-gray-500 flex justify-between items-center">
          <span>Raw Data (Development Only)</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              copyToClipboard();
            }}
            className="text-xs h-6 px-2"
            title="Copy all data"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 mr-1 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5 mr-1" />
            )}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </summary>
        <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto relative">
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </div>
  );
}
