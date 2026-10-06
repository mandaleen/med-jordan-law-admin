import type { SVGProps } from "react";
import {
  BASE,
  type BrandPath,
  CAP,
  COLUMN_BASE_TRANSFORM,
  COLUMN_RULES,
  FULL_RULES,
  VIEWBOX_COLUMN,
  VIEWBOX_FULL,
  WORDMARK,
} from "./paths";

/**
 * Low-level renderer for the two logo drawings from the guide. Every part carries a class
 * hook so draw/loop animations (LogoDraw, LogoLoop, the hero) can target it.
 * Prefer <Logo>, <LogoDraw>, <Column> or the loaders; use this only for custom choreography.
 */

export type LogoPartClasses = {
  cap?: string;
  base?: string;
  /** Applied to every rule. */
  rule?: string;
  /** Per-rule classes, top to bottom (for stagger). */
  rules?: readonly [string?, string?, string?, string?];
  word?: string;
};

export type LogoSvgProps = Omit<SVGProps<SVGSVGElement>, "viewBox"> & {
  variant: "full" | "column";
  parts?: LogoPartClasses;
  /** Accessible name. Ignored when `decorative`. */
  label?: string;
  /** Hide from assistive tech (when the name is already next to it). */
  decorative?: boolean;
};

const Paths = ({ paths }: { paths: readonly BrandPath[] }) =>
  paths.map((p, i) => (
    <path key={i} d={p.d} transform={p.t} strokeWidth={p.w} pathLength={1} />
  ));

const cx = (...c: (string | undefined | false)[]) =>
  c.filter(Boolean).join(" ") || undefined;

export function LogoSvg({
  variant,
  parts = {},
  label = "Med Jordan Law",
  decorative = false,
  style,
  ...rest
}: LogoSvgProps) {
  const full = variant === "full";
  return (
    <svg
      viewBox={full ? VIEWBOX_FULL : VIEWBOX_COLUMN}
      fill="none"
      // The logo is a fixed drawing: never mirror it, even inside RTL text.
      style={{ direction: "ltr", overflow: "visible", ...style }}
      {...(decorative
        ? { "aria-hidden": true, focusable: false }
        : { role: "img", "aria-label": label })}
      {...rest}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap={full ? "butt" : undefined}
        strokeMiterlimit={full ? 10 : undefined}
      >
        <g className={parts.cap}>
          <Paths paths={CAP} />
        </g>
        {full
          ? FULL_RULES.map((r, i) => (
              <g key={i} className={cx(parts.rule, parts.rules?.[i])}>
                <path
                  d={r.d}
                  transform={r.t}
                  strokeWidth={r.w}
                  pathLength={1}
                />
              </g>
            ))
          : COLUMN_RULES.map((r, i) => (
              <line
                key={i}
                x1={r.x1}
                x2={r.x2}
                y1={r.y}
                y2={r.y}
                strokeWidth={r.w}
                pathLength={1}
                className={cx(parts.rule, parts.rules?.[i])}
              />
            ))}
        <g
          className={parts.base}
          transform={full ? undefined : COLUMN_BASE_TRANSFORM}
        >
          <Paths paths={BASE} />
        </g>
      </g>
      {full && (
        <text
          className={parts.word}
          direction="ltr"
          fill="currentColor"
          stroke="none"
          y={WORDMARK.y}
          fontWeight={400}
          style={{
            fontFamily: "var(--font-cinzel), 'Cinzel', 'Felix Titling', serif",
            unicodeBidi: "bidi-override",
            transformBox: "fill-box",
          }}
        >
          {WORDMARK.spans.map((s, i) => (
            <tspan key={i} x={s.x} fontSize={s.size}>
              {s.text}
            </tspan>
          ))}
        </text>
      )}
    </svg>
  );
}
