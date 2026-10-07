"use client";

import React from "react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center p-6 bg-gray-50 text-slate-900 font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 shadow-xl text-center flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xl">
            !
          </div>
          <h2 className="text-lg font-bold text-slate-950">Application Failure</h2>
          <p className="text-xs text-slate-500">
            A critical error interrupted the root layout. Please reload to restore session services.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Reload Session
          </button>
        </div>
      </body>
    </html>
  );
}
