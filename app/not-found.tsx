import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Logo } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gray-50 text-navy-900 select-none">
      <div className="surface-card max-w-md w-full p-8 rounded-3xl flex flex-col items-center text-center gap-5 shadow-xl border border-gray-200">
        <Logo className="w-36 h-auto text-navy-900" label="Med Jordan Law" />

        <div className="w-12 h-12 rounded-2xl bg-navy-50 text-navy-900 flex items-center justify-center border border-navy-200 shadow-2xs">
          <Compass className="w-6 h-6 text-navy-800" />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold font-mono text-navy-600 uppercase tracking-widest">404 — Not Found</span>
          <h2 className="text-lg font-bold text-navy-950">Chambers Resource Unreachable</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            The requested practice view, case docket, or consultation link could not be located in the current legal registry.
          </p>
        </div>

        <Link
          href="/"
          className="w-full py-2.5 px-4 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-full flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Practice Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
