import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine, Tooltip, Area } from 'recharts';
import { H as HeatmapChart } from './HeatmapChart_D8-J1T-y.mjs';

function TooltipCard({
  active,
  payload,
  label,
  color,
  unit
}) {
  if (!active || !payload?.length) return null;
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-black/5 bg-white/96 px-3 py-2 text-xs shadow-[0_10px_24px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-[rgba(44,44,46,0.94)]", children: [
    /* @__PURE__ */ jsxs("span", { className: "text-apple-gray6 dark:text-apple-dark6", children: [
      label,
      ":"
    ] }),
    /* @__PURE__ */ jsxs("span", { className: "ml-1 font-bold", style: { color }, children: [
      payload[0].value ?? 0,
      " ",
      unit
    ] })
  ] });
}
function PreviewChartCard({
  title,
  description,
  color,
  unit,
  data,
  dataKey,
  gradientId,
  footer,
  icon,
  referenceLine,
  sectionCardClassName
}) {
  return /* @__PURE__ */ jsxs("div", { className: `${sectionCardClassName} h-full p-6`, children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center gap-2 text-sm font-semibold text-apple-dark1 dark:text-white", children: [
      /* @__PURE__ */ jsx("span", { style: { color }, children: icon }),
      /* @__PURE__ */ jsx("span", { children: title })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mb-3 text-sm leading-6 text-apple-gray6 dark:text-apple-dark6", children: description }),
    /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 168, children: /* @__PURE__ */ jsxs(AreaChart, { data, margin: { top: 8, right: 4, left: -16, bottom: 0 }, children: [
      /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: gradientId, x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: color, stopOpacity: 0.25 }),
        /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: color, stopOpacity: 0.02 })
      ] }) }),
      /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#edf2f7", vertical: false }),
      /* @__PURE__ */ jsx(XAxis, { dataKey: "date", tick: { fontSize: 10, fill: "#94a3b8" }, tickLine: false, axisLine: false }),
      /* @__PURE__ */ jsx(YAxis, { tick: { fontSize: 10, fill: "#94a3b8" }, tickLine: false, axisLine: false }),
      referenceLine ? /* @__PURE__ */ jsx(ReferenceLine, { y: referenceLine, stroke: color, strokeDasharray: "4 4", strokeOpacity: 0.45 }) : null,
      /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(TooltipCard, { color, unit }), cursor: { stroke: color, strokeWidth: 1, strokeDasharray: "4 4" } }),
      /* @__PURE__ */ jsx(
        Area,
        {
          type: "monotone",
          dataKey,
          stroke: color,
          strokeWidth: 2.5,
          fill: `url(#${gradientId})`,
          dot: false,
          activeDot: { r: 4, fill: color, strokeWidth: 0 }
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-2 text-center text-xs text-apple-gray6 dark:text-apple-dark6", children: footer })
  ] });
}
function BoltIcon({ className = "w-5 h-5" }) {
  return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className, "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M13 2 5 13h5l-1 9 8-11h-5l1-9Z", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function ClockIcon({ className = "w-5 h-5" }) {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className, "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9" }),
    /* @__PURE__ */ jsx("path", { d: "M12 7v5l3 2", strokeLinecap: "round", strokeLinejoin: "round" })
  ] });
}
function LandingPreviewSection({
  badgeClassName,
  sectionCardClassName,
  xpChartData,
  timeChartData,
  landingHeatmapPreviewData,
  totalXp,
  totalTime,
  averageXp
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: badgeClassName, children: "PREVIEW" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-4 text-[clamp(1.9rem,3vw,3rem)] font-semibold tracking-tight text-apple-dark1 dark:text-white", children: "首页预览也沿用仪表盘的卡片系统" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: badgeClassName, children: "热力图" }),
        /* @__PURE__ */ jsx("span", { className: badgeClassName, children: "经验曲线" }),
        /* @__PURE__ */ jsx("span", { className: badgeClassName, children: "学习时长" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-12", children: [
      /* @__PURE__ */ jsx("div", { className: `${sectionCardClassName} overflow-hidden p-4 md:col-span-12 sm:p-5`, children: /* @__PURE__ */ jsx(HeatmapChart, { data: landingHeatmapPreviewData, closeTooltipOnScroll: true }) }),
      /* @__PURE__ */ jsx("div", { className: "md:col-span-6", children: /* @__PURE__ */ jsx(
        PreviewChartCard,
        {
          title: "最近 7 天经验",
          description: "通过经验曲线看一周里什么时候最强，什么时候明显掉速。",
          color: "#58cc02",
          unit: "XP",
          data: xpChartData,
          dataKey: "xp",
          gradientId: "landing-xp-gradient",
          footer: `本周共获得 ${totalXp} XP`,
          icon: /* @__PURE__ */ jsx(BoltIcon, { className: "h-4 w-4" }),
          referenceLine: averageXp,
          sectionCardClassName
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "md:col-span-6", children: /* @__PURE__ */ jsx(
        PreviewChartCard,
        {
          title: "最近 7 天学习时长",
          description: "把投入时间单独拎出来，更容易判断你的学习节奏。",
          color: "#1cb0f6",
          unit: "分钟",
          data: timeChartData,
          dataKey: "time",
          gradientId: "landing-time-gradient",
          footer: `本周累计投入 ${totalTime} 分钟`,
          icon: /* @__PURE__ */ jsx(ClockIcon, { className: "h-4 w-4" }),
          sectionCardClassName
        }
      ) })
    ] })
  ] });
}

export { LandingPreviewSection as default };
