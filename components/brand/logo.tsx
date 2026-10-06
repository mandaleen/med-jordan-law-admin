import type { SVGProps } from "react";
import { LogoSvg } from "./logo-svg";

export type LogoProps = Omit<SVGProps<SVGSVGElement>, "viewBox"> & {
  /** Only the full lock-up exists (column + band + wordmark). For the bare column use <Column>. */
  variant?: "full";
  /** Accessible name (default "Med Jordan Law", the same in both languages). */
  label?: string;
  /** Hide from assistive tech when the firm name is already written next to it. */
  decorative?: boolean;
};

/**
 * The full logo (guide symbol `mjl-full`): the Ionic column through four rules, with the
 * wordmark in the band. Colour is `currentColor`, so set it with a text colour class:
 * `<Logo className="w-64 text-navy" />`. Aspect ratio 975 × 480. Server component.
 */
export function Logo({ variant = "full", ...props }: LogoProps) {
  return <LogoSvg variant={variant} {...props} />;
}
