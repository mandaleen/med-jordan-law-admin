"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Logo } from "@/components/brand/logo";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring services (e.g. Sentry)
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gray-50 text-navy-900 select-none">
      <div className="apple-glass-card max-w-md w-full p-8 rounded-3xl flex flex-col items-center text-center gap-5 shadow-xl border border-gray-200">
        <Logo className="w-36 h-auto text-navy-900" label="Med Jordan Law" />

        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-error flex items-center justify-center border border-rose-200 shadow-2xs">
          <AlertTriangle className="w-6 h-6 text-error" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-bold text-navy-950">System Encountered an Exception</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            An unexpected error occurred while rendering the management chambers. Your session data is safely preserved.
          </p>
          {error.digest && (
            <span className="font-mono text-[10px] text-gray-400 mt-1">Error Digest: {error.digest}</span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 py-2.5 px-4 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Operation</span>
          </button>
          <Link
            href="/"
            className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-navy-900 text-xs font-semibold rounded-xl transition-colors cursor-pointer border border-gray-300 text-center"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
