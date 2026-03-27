import { e as createComponent, r as renderTemplate, l as renderSlot, n as renderHead, h as createAstro } from './astro/server_BahSWGGF.mjs';
import 'piccolore';
import 'clsx';
/* empty css                             */
import { jsxs, jsx } from 'react/jsx-runtime';
import { useId } from 'react';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate(_a || (_a = __template([`<html lang="zh-CN"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="DuoEye - \u591A\u90BB\u56FD\u5B66\u4E60\u6570\u636E\u4EEA\u8868\u76D8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><script>
      (() => {
        try {
          const savedTheme = localStorage.getItem('duoeye-theme');
          const themeMode =
            savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system'
              ? savedTheme
              : 'system';
          const resolvedTheme =
            themeMode === 'system'
              ? window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
              : themeMode;
          document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
        } catch {
          document.documentElement.classList.remove('dark');
        }
      })();
    <\/script><title>`, "</title>", '</head> <body class="min-h-screen font-sans antialiased text-apple-dark1 transition-colors dark:text-white"> ', " </body></html>"])), title, renderHead(), renderSlot($$result, $$slots["default"]));
}, "E:/duoeye/src/layouts/Layout.astro", void 0);

function AppIcon({ className = "w-8 h-8" }) {
  const id = useId().replace(/:/g, "");
  const filterA = `fa-${id}`;
  const filterB = `fb-${id}`;
  return /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512", className, "aria-hidden": "true", children: [
    /* @__PURE__ */ jsxs("defs", { children: [
      /* @__PURE__ */ jsx("filter", { id: filterA, x: "-20%", y: "-20%", width: "140%", height: "140%", children: /* @__PURE__ */ jsx("feDropShadow", { dx: "0", dy: "16", stdDeviation: "20", floodColor: "#0f172a", floodOpacity: "0.12" }) }),
      /* @__PURE__ */ jsx("filter", { id: filterB, x: "-20%", y: "-20%", width: "140%", height: "140%", children: /* @__PURE__ */ jsx("feDropShadow", { dx: "-8", dy: "12", stdDeviation: "8", floodColor: "#000", floodOpacity: "0.15" }) })
    ] }),
    /* @__PURE__ */ jsxs("g", { transform: "translate(0 16)", filter: `url(#${filterA})`, children: [
      /* @__PURE__ */ jsx("path", { d: "M50 160h30M65 145v30", stroke: "#1cb0f6", strokeWidth: "8", strokeLinecap: "round" }),
      /* @__PURE__ */ jsx("circle", { cx: "440", cy: "120", r: "12", fill: "none", stroke: "#ff9600", strokeWidth: "6" }),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M70 340l10-20 10 20 20 10-20 10-10 20-10-20-20-10z",
          fill: "#ff4b4b",
          transform: "scale(.8) translate(20 80)"
        }
      ),
      /* @__PURE__ */ jsx("path", { d: "M210 120l-80-30-20 80z", fill: "#46a302", stroke: "#46a302", strokeWidth: "24", strokeLinejoin: "round" }),
      /* @__PURE__ */ jsx("path", { d: "M210 104l-80-30-20 80z", fill: "#58cc02", stroke: "#58cc02", strokeWidth: "24", strokeLinejoin: "round" }),
      /* @__PURE__ */ jsx("path", { d: "M302 120l80-30 20 80z", fill: "#46a302", stroke: "#46a302", strokeWidth: "24", strokeLinejoin: "round" }),
      /* @__PURE__ */ jsx("path", { d: "M302 104l80-30 20 80z", fill: "#58cc02", stroke: "#58cc02", strokeWidth: "24", strokeLinejoin: "round" }),
      /* @__PURE__ */ jsx("rect", { x: "64", y: "96", width: "384", height: "340", rx: "170", fill: "#46a302" }),
      /* @__PURE__ */ jsx("rect", { x: "64", y: "80", width: "384", height: "340", rx: "170", fill: "#58cc02" }),
      /* @__PURE__ */ jsx("path", { d: "M130 140q126-50 252 0", fill: "none", stroke: "#a5ed5f", strokeWidth: "14", strokeLinecap: "round", opacity: ".9" }),
      /* @__PURE__ */ jsx("circle", { cx: "180", cy: "212", r: "60", fill: "#fff" }),
      /* @__PURE__ */ jsx("circle", { cx: "196", cy: "212", r: "24", fill: "#4b4b4b" }),
      /* @__PURE__ */ jsx("circle", { cx: "204", cy: "204", r: "8", fill: "#fff" }),
      /* @__PURE__ */ jsx("circle", { cx: "188", cy: "220", r: "4", fill: "#fff" }),
      /* @__PURE__ */ jsx("path", { d: "M230 252h40l-20 36z", fill: "#dfa500", stroke: "#dfa500", strokeWidth: "16", strokeLinejoin: "round" }),
      /* @__PURE__ */ jsx("path", { d: "M230 240h40l-20 36z", fill: "#ffc800", stroke: "#ffc800", strokeWidth: "16", strokeLinejoin: "round" }),
      /* @__PURE__ */ jsx("path", { d: "M242 244h16", stroke: "#fff", strokeWidth: "6", strokeLinecap: "round", opacity: ".8" }),
      /* @__PURE__ */ jsxs("g", { filter: `url(#${filterB})`, children: [
        /* @__PURE__ */ jsx("path", { d: "M370 290l70 80", stroke: "#dfa500", strokeWidth: "36", strokeLinecap: "round" }),
        /* @__PURE__ */ jsx("path", { d: "M370 276l70 80", stroke: "#ffc800", strokeWidth: "36", strokeLinecap: "round" }),
        /* @__PURE__ */ jsx("path", { d: "M384 300l32 36", stroke: "#fff", strokeWidth: "8", strokeLinecap: "round", opacity: ".6" }),
        /* @__PURE__ */ jsx("circle", { cx: "330", cy: "212", r: "80", fill: "#94a3b8" }),
        /* @__PURE__ */ jsx("circle", { cx: "330", cy: "204", r: "80", fill: "#f1f5f9" }),
        /* @__PURE__ */ jsx("circle", { cx: "330", cy: "204", r: "64", fill: "#cbd5e1" }),
        /* @__PURE__ */ jsx("circle", { cx: "330", cy: "204", r: "60", fill: "#fff" }),
        /* @__PURE__ */ jsx("rect", { x: "290", y: "226", width: "20", height: "30", rx: "10", fill: "#ea2b2b" }),
        /* @__PURE__ */ jsx("rect", { x: "290", y: "220", width: "20", height: "30", rx: "10", fill: "#ff4b4b" }),
        /* @__PURE__ */ jsx("rect", { x: "320", y: "196", width: "20", height: "60", rx: "10", fill: "#e58600" }),
        /* @__PURE__ */ jsx("rect", { x: "320", y: "190", width: "20", height: "60", rx: "10", fill: "#ff9600" }),
        /* @__PURE__ */ jsx("rect", { x: "350", y: "166", width: "20", height: "90", rx: "10", fill: "#46a302" }),
        /* @__PURE__ */ jsx("rect", { x: "350", y: "160", width: "20", height: "90", rx: "10", fill: "#58cc02" }),
        /* @__PURE__ */ jsx("path", { d: "M282 176a52 52 0 0184-14", fill: "none", stroke: "#fff", strokeWidth: "12", strokeLinecap: "round", opacity: ".95" })
      ] }),
      /* @__PURE__ */ jsx("circle", { cx: "410", cy: "328", r: "32", fill: "#46a302" }),
      /* @__PURE__ */ jsx("circle", { cx: "410", cy: "316", r: "32", fill: "#58cc02" }),
      /* @__PURE__ */ jsx("path", { d: "M390 300a20 20 0 0136-6", fill: "none", stroke: "#a5ed5f", strokeWidth: "8", strokeLinecap: "round" })
    ] })
  ] });
}

const sizeMap = {
  xs: {
    width: 74,
    height: 24,
    duoSize: 17,
    eyeSize: 18,
    duoY: 18,
    eyeX: 33,
    eyeY: 18
  },
  sm: {
    width: 103,
    height: 34,
    duoSize: 23,
    eyeSize: 25,
    duoY: 24,
    eyeX: 46,
    eyeY: 24
  },
  md: {
    width: 128,
    height: 42,
    duoSize: 28,
    eyeSize: 31,
    duoY: 29,
    eyeX: 56,
    eyeY: 29
  },
  lg: {
    width: 174,
    height: 58,
    duoSize: 39,
    eyeSize: 43,
    duoY: 40,
    eyeX: 77,
    eyeY: 40
  }
};
function DuoWordmark({ size = "md", className = "" }) {
  const style = sizeMap[size];
  const id = useId().replace(/:/g, "");
  const duoGradientId = `duo-wordmark-duo-${id}`;
  const eyeGradientId = `duo-wordmark-eye-${id}`;
  const shadowId = `duo-wordmark-shadow-${id}`;
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: style.width,
      height: style.height,
      viewBox: `0 0 ${style.width} ${style.height}`,
      className,
      "aria-label": "DuoEye",
      role: "img",
      children: [
        /* @__PURE__ */ jsxs("defs", { children: [
          /* @__PURE__ */ jsxs("linearGradient", { id: duoGradientId, x1: "0", y1: "0", x2: "0", y2: style.height, gradientUnits: "userSpaceOnUse", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#0f172a" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#475569" })
          ] }),
          /* @__PURE__ */ jsxs("linearGradient", { id: eyeGradientId, x1: style.eyeX, y1: "0", x2: style.eyeX, y2: style.height, gradientUnits: "userSpaceOnUse", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#9be15d" }),
            /* @__PURE__ */ jsx("stop", { offset: "55%", stopColor: "#58cc02" }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#2f7d0d" })
          ] }),
          /* @__PURE__ */ jsx("filter", { id: shadowId, x: "-20%", y: "-20%", width: "160%", height: "180%", children: /* @__PURE__ */ jsx("feDropShadow", { dx: "0", dy: "6", stdDeviation: "6", floodColor: "#58cc02", floodOpacity: "0.22" }) })
        ] }),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: "0",
            y: style.duoY,
            fill: `url(#${duoGradientId})`,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang SC", sans-serif',
            fontSize: style.duoSize,
            fontWeight: "650",
            letterSpacing: size === "xs" ? "-1.15" : "-1.5",
            children: "Duo"
          }
        ),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: style.eyeX,
            y: style.eyeY,
            fill: `url(#${eyeGradientId})`,
            filter: `url(#${shadowId})`,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang SC", sans-serif',
            fontSize: style.eyeSize,
            fontWeight: "800",
            letterSpacing: size === "xs" ? "-1.6" : "-2",
            children: "Eye"
          }
        )
      ]
    }
  );
}

const shellClassName = "flex h-11 items-center gap-1 rounded-2xl border border-black/5 bg-white/88 p-1 text-apple-gray6 shadow-[0_6px_14px_rgba(15,23,42,0.04)] dark:border-white/15 dark:bg-white/12 dark:text-white/72";
function SunIcon({ className = "h-4 w-4" }) {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className, "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "4" }),
    /* @__PURE__ */ jsx("path", { d: "M12 2v2.5", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M12 19.5V22", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M4.93 4.93 6.7 6.7", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("path", { d: "m17.3 17.3 1.77 1.77", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M2 12h2.5", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M19.5 12H22", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("path", { d: "m4.93 19.07 1.77-1.77", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("path", { d: "m17.3 6.7 1.77-1.77", strokeLinecap: "round" })
  ] });
}
function MoonIcon({ className = "h-4 w-4" }) {
  return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className, "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function SystemIcon({ className = "h-4 w-4" }) {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className, "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("rect", { x: "3", y: "4", width: "18", height: "12", rx: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M8 20h8", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M12 16v4", strokeLinecap: "round" })
  ] });
}
function getOptionClassName(active) {
  if (active) {
    return "bg-[#111827] text-white shadow-[0_8px_20px_rgba(17,24,39,0.14)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(17,24,39,0.2)] dark:bg-white dark:text-apple-dark1 dark:hover:shadow-[0_12px_24px_rgba(0,0,0,0.22)]";
  }
  return "text-apple-gray6 hover:-translate-y-0.5 hover:text-apple-dark1 hover:shadow-[0_8px_18px_rgba(15,23,42,0.08)] dark:text-white/72 dark:hover:text-white dark:hover:shadow-[0_8px_18px_rgba(0,0,0,0.22)]";
}
function ThemeModeControl({ mode, resolvedTheme, onChange }) {
  const systemTitle = `跟随系统（当前${resolvedTheme === "dark" ? "深色" : "浅色"}）`;
  return /* @__PURE__ */ jsxs("div", { className: shellClassName, role: "group", "aria-label": "主题模式", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onChange("light"),
        className: `flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${getOptionClassName(mode === "light")}`,
        "aria-label": "浅色模式",
        title: "浅色模式",
        children: /* @__PURE__ */ jsx(SunIcon, {})
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onChange("dark"),
        className: `flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${getOptionClassName(mode === "dark")}`,
        "aria-label": "深色模式",
        title: "深色模式",
        children: /* @__PURE__ */ jsx(MoonIcon, {})
      }
    ),
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => onChange("system"),
        className: `relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${getOptionClassName(mode === "system")}`,
        "aria-label": systemTitle,
        title: systemTitle,
        children: [
          /* @__PURE__ */ jsx(SystemIcon, {}),
          mode === "system" ? /* @__PURE__ */ jsx(
            "span",
            {
              "aria-hidden": "true",
              className: `absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full ${resolvedTheme === "dark" ? "bg-[#1cb0f6]" : "bg-[#58cc02]"}`
            }
          ) : null
        ]
      }
    )
  ] });
}

const THEME_STORAGE_KEY = "duoeye-theme";
function resolveThemeMode(value) {
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }
  return "system";
}
function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function getResolvedTheme(mode) {
  if (mode === "system") {
    return getSystemTheme();
  }
  return mode;
}
function applyResolvedTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export { $$Layout as $, AppIcon as A, DuoWordmark as D, ThemeModeControl as T, THEME_STORAGE_KEY as a, applyResolvedTheme as b, getResolvedTheme as g, resolveThemeMode as r };
