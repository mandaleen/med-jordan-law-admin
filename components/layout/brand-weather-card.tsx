"use client";

import React from "react";
import { LogoSvg, type LogoPartClasses } from "@/components/brand/logo-svg";

// Class hooks the .bwl-* draw choreography in globals.css targets.
const LOGO_PARTS: LogoPartClasses = {
  cap: "bwl-cap",
  base: "bwl-base",
  rule: "bwl-rule",
  rules: ["bwl-r0", "bwl-r1", "bwl-r2", "bwl-r3"],
  word: "bwl-word",
};

type Lang = "en" | "ar";
type Sky = "clear" | "partly" | "cloud" | "fog" | "rain" | "snow" | "storm";

interface HourSlot {
  hour: number;
  temp: number;
  sky: Sky;
  isDay: boolean;
}

interface WeatherState {
  temp: number;
  high: number;
  low: number;
  sky: Sky;
  isDay: boolean;
  hours: HourSlot[];
}

// Med Jordan Law is based in Amman.
const LAT = 31.9454;
const LON = 35.9284;
const TIMEZONE = "Asia/Amman";
const REFRESH_MS = 15 * 60 * 1000;
const WEATHER_URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
  `&current=temperature_2m,weather_code,is_day` +
  `&hourly=temperature_2m,weather_code,is_day` +
  `&daily=temperature_2m_max,temperature_2m_min` +
  `&forecast_days=2&timezone=${encodeURIComponent(TIMEZONE)}`;

const SKY_LABEL: Record<Sky, Record<Lang, string>> = {
  clear: { en: "Clear skies", ar: "سماء صافية" },
  partly: { en: "Partly cloudy", ar: "غائم جزئياً" },
  cloud: { en: "Overcast", ar: "غائم" },
  fog: { en: "Foggy", ar: "ضباب" },
  rain: { en: "Rain", ar: "أمطار" },
  snow: { en: "Snow", ar: "ثلوج" },
  storm: { en: "Thunderstorm", ar: "عواصف رعدية" },
};

function skyFromCode(code: number): Sky {
  if (code === 0) return "clear";
  if (code <= 2) return "partly";
  if (code === 3) return "cloud";
  if (code === 45 || code === 48) return "fog";
  if (code >= 95) return "storm";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code >= 51) return "rain";
  return "cloud";
}

/* ---------- Condition icons (pure SVG; motion lives in globals.css .bw-*) ---------- */

function Sun() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="14" fill="#FFD55A" opacity="0.22" className="bw-breathe" style={{ transformOrigin: "24px 24px" }} />
      <g className="bw-spin" style={{ transformOrigin: "24px 24px" }} stroke="#FFE08A" strokeWidth="2.4" strokeLinecap="round">
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1="24" y1="4.5" x2="24" y2="9.5" transform={`rotate(${i * 45} 24 24)`} />
        ))}
      </g>
      <circle cx="24" cy="24" r="9" fill="#FFD23F" />
    </svg>
  );
}

function Moon() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" aria-hidden="true">
      <path d="M31 8.5A16 16 0 1 0 39.5 31 13 13 0 0 1 31 8.5Z" fill="#E6ECFA" className="bw-breathe" style={{ transformOrigin: "24px 24px" }} />
      <circle cx="37" cy="12" r="1.4" fill="#FFE08A" className="bw-twinkle" />
      <circle cx="41" cy="20" r="1" fill="#FFE08A" className="bw-twinkle" style={{ animationDelay: "0.9s" }} />
    </svg>
  );
}

function SkyIcon({ sky, isDay }: { sky: Sky; isDay: boolean }) {
  if (sky === "clear") return isDay ? <Sun /> : <Moon />;
  const dark = sky === "cloud" || sky === "storm" || sky === "rain";
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" aria-hidden="true">
      {sky === "partly" &&
        (isDay ? (
          <circle cx="17" cy="15" r="7.5" fill="#FFD23F" className="bw-breathe" style={{ transformOrigin: "17px 15px" }} />
        ) : (
          <path d="M22 8a8 8 0 1 0 5 12 6.5 6.5 0 0 1-5-12Z" fill="#E6ECFA" />
        ))}
      <g className="bw-drift">
        <path
          d="M14 34h19a7 7 0 0 0 .9-13.94A9.5 9.5 0 0 0 15.6 18.6 7.7 7.7 0 0 0 14 34Z"
          fill={dark ? "#D3DBEC" : "#FFFFFF"}
        />
      </g>
      {sky === "fog" && (
        <g stroke="#E3E8F1" strokeWidth="2.4" strokeLinecap="round" className="bw-drift">
          <line x1="12" y1="38" x2="36" y2="38" />
          <line x1="16" y1="43" x2="40" y2="43" />
        </g>
      )}
      {sky === "rain" && (
        <g stroke="#9DB8F2" strokeWidth="2.4" strokeLinecap="round">
          {[18, 25, 32].map((x, i) => (
            <line key={x} x1={x} y1="37" x2={x - 2} y2="43" className="bw-drop" style={{ animationDelay: `${i * 0.25}s` }} />
          ))}
        </g>
      )}
      {sky === "storm" && <path d="m25 33-5 8h4l-2 6 8-9h-4l2-5Z" fill="#FFD23F" className="bw-flash" />}
      {sky === "snow" && (
        <g fill="#FFFFFF">
          {[18, 25, 32].map((x, i) => (
            <circle key={x} cx={x} cy="39" r="1.7" className="bw-drop" style={{ animationDelay: `${i * 0.35}s` }} />
          ))}
        </g>
      )}
    </svg>
  );
}

/* ---------- Ambient weather layers ---------- */

const pseudo = (i: number, m: number) => ((i * 37 + 11) % m) / m;

function Ambient({ sky, isDay }: { sky: Sky; isDay: boolean }) {
  const clouds = sky !== "clear";
  const stars = !isDay && (sky === "clear" || sky === "partly");
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="bw-fx-glow absolute inset-0" />
      {stars &&
        Array.from({ length: 16 }).map((_, i) => (
          <span
            key={i}
            className="bw-star"
            style={{ left: `${pseudo(i, 97) * 100}%`, top: `${pseudo(i + 5, 89) * 60}%`, animationDelay: `${pseudo(i, 13) * 3}s` }}
          />
        ))}
      {clouds &&
        [0, 1, 2].map((i) => (
          <span
            key={i}
            className="bw-cloud"
            style={{ top: `${6 + i * 22}%`, width: `${90 + i * 40}px`, height: `${34 + i * 10}px`, animationDuration: `${46 + i * 14}s`, animationDelay: `${-i * 15}s` }}
          />
        ))}
      {sky === "rain" || sky === "storm"
        ? Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="bw-streak"
              style={{ left: `${pseudo(i, 53) * 100}%`, animationDuration: `${0.8 + pseudo(i, 7) * 0.7}s`, animationDelay: `${-pseudo(i, 11) * 2}s` }}
            />
          ))
        : null}
      {sky === "snow" &&
        Array.from({ length: 16 }).map((_, i) => (
          <span
            key={i}
            className="bw-flake"
            style={{ left: `${pseudo(i, 61) * 100}%`, animationDuration: `${5 + pseudo(i, 9) * 5}s`, animationDelay: `${-pseudo(i, 17) * 8}s` }}
          />
        ))}
      {sky === "fog" && (
        <>
          <span className="bw-fog" style={{ top: "30%" }} />
          <span className="bw-fog" style={{ top: "58%", animationDelay: "-12s" }} />
        </>
      )}
      {sky === "storm" && <span className="bw-lightning" />}
    </div>
  );
}

/* ---------- Component ---------- */

interface BrandWeatherCardProps {
  currentLang?: Lang;
  /** Close button for the mobile drawer, rendered over the card. */
  closeSlot?: React.ReactNode;
}

export function BrandWeatherCard({ currentLang = "en", closeSlot }: BrandWeatherCardProps) {
  const ar = currentLang === "ar";
  const [showWeather, setShowWeather] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const [weather, setWeather] = React.useState<WeatherState | null>(null);
  const [time, setTime] = React.useState("");
  const [fallbackDay, setFallbackDay] = React.useState(true);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [shownTemp, setShownTemp] = React.useState(0);

  React.useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const res = await fetch(WEATHER_URL, { signal: controller.signal });
        if (!res.ok) return;
        const d = await res.json();
        const times: string[] = d.hourly.time;
        const curHour = String(d.current.time).slice(0, 13);
        const start = Math.max(0, times.findIndex((t) => t.slice(0, 13) === curHour));
        const hours: HourSlot[] = [];
        for (let k = 0; k < 5 && start + k < times.length; k++) {
          const i = start + k;
          hours.push({
            hour: Number(times[i].slice(11, 13)),
            temp: Math.round(d.hourly.temperature_2m[i]),
            sky: skyFromCode(d.hourly.weather_code[i]),
            isDay: d.hourly.is_day[i] === 1,
          });
        }
        setWeather({
          temp: Math.round(d.current.temperature_2m),
          high: Math.round(d.daily.temperature_2m_max[0]),
          low: Math.round(d.daily.temperature_2m_min[0]),
          sky: skyFromCode(d.current.weather_code),
          isDay: d.current.is_day === 1,
          hours,
        });
      } catch {
        // offline or aborted: card keeps its time-of-day sky and the skeleton
      }
    };
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      controller.abort();
      clearInterval(id);
    };
  }, []);

  // Amman clock (also picks the day/night sky until real data arrives)
  React.useEffect(() => {
    const fmt = new Intl.DateTimeFormat(ar ? "ar-JO" : "en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: ar,
      timeZone: TIMEZONE,
    });
    const hourFmt = new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: TIMEZONE });
    const tick = () => {
      const now = new Date();
      setTime(fmt.format(now));
      const h = Number(hourFmt.format(now)) % 24;
      setFallbackDay(h >= 6 && h < 18);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [ar]);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Brand moment first (logo draws itself), then the weather; afterwards they alternate.
  React.useEffect(() => {
    if (reducedMotion || paused) return;
    const wait = showWeather ? 45000 : weather ? 6000 : 9000;
    const id = setTimeout(() => setShowWeather((v) => !v), wait);
    return () => clearTimeout(id);
  }, [showWeather, paused, reducedMotion, weather]);

  // Temperature counts up each time the weather phase begins
  React.useEffect(() => {
    if (!showWeather || !weather) return;
    if (reducedMotion) {
      setShownTemp(weather.temp);
      return;
    }
    let raf = 0;
    const from = 0;
    const to = weather.temp;
    const delay = 420;
    const dur = 1100;
    const t0 = performance.now() + delay;
    const step = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - t0) / dur));
      const eased = 1 - Math.pow(1 - p, 4);
      setShownTemp(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    setShownTemp(from);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [showWeather, weather, reducedMotion]);

  const sky = weather?.sky ?? "clear";
  const isDay = weather ? weather.isDay : fallbackDay;

  const hourLabel = (h: number, i: number) => {
    if (i === 0) return ar ? "الآن" : "Now";
    const n = h % 12 || 12;
    return ar
      ? `${new Intl.NumberFormat("ar-JO", { useGrouping: false }).format(n)}${h < 12 ? "ص" : "م"}`
      : `${n}${h < 12 ? "AM" : "PM"}`;
  };

  const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

  return (
    <div
      className="bw-root relative h-[176px] shrink-0 rounded-[22px] isolate select-none"
      data-state={showWeather ? "weather" : "logo"}
      data-sky={sky}
      data-day={isDay ? "true" : "false"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={showWeather ? (ar ? "عرض الشعار" : "Show logo") : ar ? "عرض الطقس" : "Show weather"}
        onClick={() => setShowWeather((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setShowWeather((v) => !v);
          }
        }}
        className="bw-surface absolute inset-0 rounded-[22px] overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
      >
        {/* Sky + ambient weather */}
        <div className="bw-sky absolute inset-0" />
        <Ambient sky={sky} isDay={isDay} />

        {/* Navy brand veil: covers the sky during the logo phase, lifts to reveal the weather */}
        <div className="bw-veil absolute inset-0" />

        {/* Phase 1: logo draws itself */}
        <div className="bw-logo-layer absolute inset-0 flex items-center justify-center px-6" aria-hidden={showWeather}>
          <div className="bw-logo-wrap relative w-full max-w-[176px] text-white">
            <LogoSvg
              variant="full"
              className="w-full h-auto"
              label="Med Jordan Law"
              parts={LOGO_PARTS}
            />
          </div>
        </div>

        {/* Phase 2: weather */}
        <div className="absolute inset-0 px-4 pt-3.5 pb-3 flex flex-col text-white" aria-hidden={!showWeather}>
          <div className="bw-in flex items-center justify-between" style={d(160)}>
            <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.14em] uppercase text-white/80">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-white opacity-60 animate-ping" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-white" />
              </span>
              {ar ? "عمّان" : "Amman"}
            </span>
            <span className="text-[11px] font-medium tabular-nums text-white/70" dir="ltr">
              {time}
            </span>
          </div>

          {weather ? (
            <>
              <div className="flex items-center justify-between gap-2 mt-1.5">
                <div className="flex items-center gap-2 shrink-0">
                  <div className="bw-pop bw-icon w-[42px] h-[42px] shrink-0" style={d(300)}>
                    <SkyIcon sky={sky} isDay={isDay} />
                  </div>
                  <p className="bw-in text-[34px] leading-none font-medium tracking-tight tabular-nums" style={d(260)} dir="ltr">
                    {shownTemp}°
                  </p>
                </div>
                <div className="bw-in text-end min-w-0" style={d(380)}>
                  <p className="text-[11px] leading-tight font-medium text-white/90">{SKY_LABEL[sky][currentLang]}</p>
                  <p className="mt-0.5 text-[11px] tabular-nums text-white/70" dir="ltr">
                    H:{weather.high}° L:{weather.low}°
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-2 border-t border-white/20 grid grid-cols-5 text-center">
                {weather.hours.map((h, i) => (
                  <div key={i} className="bw-in flex flex-col items-center gap-1" style={d(460 + i * 70)}>
                    <span className="text-[10px] font-medium text-white/70 leading-none">{hourLabel(h.hour, i)}</span>
                    <span className="bw-mini w-[22px] h-[22px]">
                      <SkyIcon sky={h.sky} isDay={h.isDay} />
                    </span>
                    <span className="text-[11.5px] font-medium tabular-nums leading-none" dir="ltr">
                      {h.temp}°
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bw-in flex-1 flex flex-col justify-end gap-3" style={d(200)} aria-hidden="true">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/20 animate-pulse" />
                <div className="h-9 w-20 rounded-lg bg-white/20 animate-pulse" />
              </div>
              <div className="h-12 rounded-lg bg-white/10 animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {closeSlot && <div className="absolute end-2 top-2 z-20">{closeSlot}</div>}
    </div>
  );
}
