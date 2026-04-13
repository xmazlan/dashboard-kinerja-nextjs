import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiErrorProps {
  title?: string;
  message?: string;
  error?: Error | null;
  className?: string;
  onRetry?: () => void;
  opd?: string; // OPD name
}

export function ApiError({
  title = "Terjadi Kesalahan",
  message = "Gagal mengambil data dari server",
  error,
  className,
  onRetry,
  opd,
}: ApiErrorProps) {
  // Extract status code and additional error info
  const getErrorDetails = (error: Error | null) => {
    if (!error) return { statusCode: null, statusText: null, details: null };

    // Check if it's an axios error with response
    const axiosError = error as any;
    if (axiosError.response) {
      const { status, statusText, data } = axiosError.response;
      return {
        statusCode: status,
        statusText,
        details: data?.message || data?.error || null
      };
    }

    // Check if it's a standard Error with additional properties
    if (axiosError.status) {
      return {
        statusCode: axiosError.status,
        statusText: axiosError.statusText || null,
        details: axiosError.message || null
      };
    }

    return { statusCode: null, statusText: null, details: null };
  };

  const { statusCode, statusText, details } = getErrorDetails(error ?? null);
  const errorMessage = details || error?.message || message;

  return (
    <div
      className={cn(
        "flex flex-col mb-4 items-center justify-center gap-3 p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800",
        className
      )}
    >
      <div className="flex items-center gap-3 w-full">
        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-red-900 dark:text-red-100">
            {title}
            {opd && (
              <span className="block text-sm font-normal text-red-700 dark:text-red-300 mt-1">
                OPD: {opd}
              </span>
            )}
          </h3>
          <p className="text-sm text-red-800 dark:text-red-200 wrap-break-word">
            {errorMessage}
          </p>
          {statusCode && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-mono">
              Status: {statusCode} {statusText && `(${statusText})`}
            </p>
          )}
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
}

export function ApiErrorMinimal({
  title = "Server Error",
  className,
}: {
  title?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center  justify-center gap-2 p-4 rounded-md border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800",
        className
      )}
    >
      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
      <p className="text-sm font-medium text-red-900 dark:text-red-100">
        {title}
      </p>
    </div>
  );
}
