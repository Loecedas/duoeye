import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';

const DuoColors = {
  featherGreen: "#58CC02",
  beeYellow: "#FFC800"};

const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
function toLocalDateStr(date) {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Shanghai"
    }).format(date);
  } catch {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
}
function getHeatmapColor(xp, maxXp) {
  if (xp < 0) return "transparent";
  if (xp === 0) return "#EBEDF0";
  const intensity = Math.min(xp / maxXp, 1);
  if (intensity < 0.25) return "#9BE9A8";
  if (intensity < 0.5) return "#40C463";
  if (intensity < 0.75) return DuoColors.featherGreen;
  return "#216E39";
}
function getViewRangeLabel(viewMode, selectedYear, selectedQuarter, selectedHalf) {
  if (viewMode === "quarter") return `${selectedYear} Q${selectedQuarter}`;
  if (viewMode === "half") return `${selectedYear} ${selectedHalf === 1 ? "上半年" : "下半年"}`;
  return `${selectedYear} 全年`;
}
function HeatmapChart({ data, forceViewMode, closeTooltipOnScroll = false }) {
  const now = /* @__PURE__ */ new Date();
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState(Math.ceil((now.getMonth() + 1) / 3));
  const [selectedHalf, setSelectedHalf] = useState(now.getMonth() < 6 ? 1 : 2);
  const [viewMode, setViewMode] = useState(forceViewMode || "year");
  const [tooltip, setTooltip] = useState(null);
  const [tooltipTransitionMs, setTooltipTransitionMs] = useState(180);
  const tooltipRef = useRef(null);
  const tooltipFrameRef = useRef(null);
  useEffect(() => {
    setTooltip(null);
  }, [selectedYear, selectedQuarter, selectedHalf, viewMode]);
  useEffect(() => {
    if (forceViewMode) return;
    let resizeTimer;
    function applyResponsiveMode() {
      const width = window.innerWidth;
      if (width < 640) {
        setViewMode("quarter");
        return;
      }
      if (width < 1200) {
        setViewMode("half");
        return;
      }
      setViewMode("year");
    }
    function handleResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(applyResponsiveMode, 150);
    }
    applyResponsiveMode();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.clearTimeout(resizeTimer);
    };
  }, [forceViewMode]);
  useEffect(() => {
    if (!tooltip) return;
    function handleClickOutside(event) {
      const target = event.target;
      if (target?.closest(".heatmap-cell")) return;
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setTooltip(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tooltip]);
  const { xpMap, timeMap, sortedYears } = useMemo(() => {
    const xpByDate = /* @__PURE__ */ new Map();
    const timeByDate = /* @__PURE__ */ new Map();
    const yearSet = /* @__PURE__ */ new Set();
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    for (const item of data) {
      if (!item.date) continue;
      xpByDate.set(item.date, item.xp || 0);
      timeByDate.set(item.date, item.time);
      const year = Number(item.date.slice(0, 4));
      if (!Number.isNaN(year) && year > 2010 && year <= currentYear) {
        yearSet.add(year);
      }
    }
    const years = Array.from(yearSet).sort((a, b) => b - a);
    if (!years.length) years.push(currentYear);
    return { xpMap: xpByDate, timeMap: timeByDate, sortedYears: years };
  }, [data]);
  const { allDates, weeks, monthLabels, maxXp } = useMemo(() => {
    const startMonth = viewMode === "quarter" ? (selectedQuarter - 1) * 3 : viewMode === "half" ? (selectedHalf - 1) * 6 : 0;
    const monthCount = viewMode === "quarter" ? 3 : viewMode === "half" ? 6 : 12;
    const startDate = new Date(selectedYear, startMonth, 1);
    const endDate = new Date(selectedYear, startMonth + monthCount, 0);
    const dates = [];
    const cursor = new Date(startDate);
    while (cursor <= endDate) {
      const dateStr = toLocalDateStr(cursor);
      dates.push({
        date: new Date(cursor),
        dateStr,
        xp: xpMap.get(dateStr) || 0,
        time: timeMap.get(dateStr)
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    const calculatedMaxXp = Math.max(...dates.map((item) => item.xp), 50);
    const weeksData = [];
    const firstWeekPadding = dates[0]?.date.getDay() || 0;
    let currentWeek = [];
    for (let i = 0; i < firstWeekPadding; i += 1) {
      currentWeek.push({ date: /* @__PURE__ */ new Date(0), dateStr: "", xp: -1 });
    }
    for (const item of dates) {
      currentWeek.push(item);
      if (currentWeek.length === 7) {
        weeksData.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: /* @__PURE__ */ new Date(0), dateStr: "", xp: -1 });
      }
      weeksData.push(currentWeek);
    }
    const labels = [];
    let previousMonth = -1;
    weeksData.forEach((week, weekIndex) => {
      const validDay = week.find((item) => item.xp >= 0 && item.date.getTime() > 0);
      if (!validDay) return;
      const month = validDay.date.getMonth();
      if (month === previousMonth) return;
      labels.push({ month: MONTHS[month], weekIndex });
      previousMonth = month;
    });
    const targetWeeks = viewMode === "quarter" ? 14 : viewMode === "half" ? 28 : 54;
    while (weeksData.length < targetWeeks) {
      weeksData.push(Array.from({ length: 7 }, () => ({ date: /* @__PURE__ */ new Date(0), dateStr: "", xp: -1 })));
    }
    return {
      allDates: dates,
      weeks: weeksData,
      monthLabels: labels,
      maxXp: calculatedMaxXp
    };
  }, [selectedHalf, selectedQuarter, selectedYear, timeMap, viewMode, xpMap]);
  const totalXp = useMemo(() => allDates.reduce((sum, item) => sum + Math.max(item.xp, 0), 0), [allDates]);
  const activeDays = useMemo(() => allDates.filter((item) => item.xp > 0).length, [allDates]);
  const gridMinWidth = useMemo(() => Math.max(320, weeks.length * 14 + 28), [weeks.length]);
  const updateTooltipPosition = useCallback((dateStr, xp, time, transitionMs = 180) => {
    const cell = document.querySelector(`[data-heatmap-date="${dateStr}"]`);
    if (!cell) return;
    const rect = cell.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top < 120 ? rect.bottom + 10 : rect.top - 10;
    const showBelow = rect.top < 120;
    let alignment = "center";
    if (x < 110) alignment = "left";
    if (x > window.innerWidth - 110) alignment = "right";
    setTooltipTransitionMs(transitionMs);
    setTooltip({ date: dateStr, xp, time, x, y, showBelow, alignment });
  }, []);
  useEffect(() => {
    if (!tooltip) return;
    if (closeTooltipOnScroll) {
      let handleScrollClose = function() {
        setTooltip(null);
      };
      window.addEventListener("scroll", handleScrollClose, { capture: true, passive: true });
      return () => window.removeEventListener("scroll", handleScrollClose, true);
    }
    const currentTooltip = tooltip;
    function handleViewportChange() {
      if (tooltipFrameRef.current !== null) return;
      tooltipFrameRef.current = window.requestAnimationFrame(() => {
        tooltipFrameRef.current = null;
        updateTooltipPosition(currentTooltip.date, currentTooltip.xp, currentTooltip.time, 90);
      });
    }
    window.addEventListener("scroll", handleViewportChange, { capture: true, passive: true });
    window.addEventListener("resize", handleViewportChange);
    return () => {
      window.removeEventListener("scroll", handleViewportChange, true);
      window.removeEventListener("resize", handleViewportChange);
      if (tooltipFrameRef.current !== null) {
        window.cancelAnimationFrame(tooltipFrameRef.current);
      }
    };
  }, [closeTooltipOnScroll, tooltip, updateTooltipPosition]);
  function handleDayClick(day, event) {
    event.preventDefault();
    if (day.xp < 0 || !day.dateStr) return;
    updateTooltipPosition(day.dateStr, day.xp, day.time, 180);
  }
  function canNavigate(direction) {
    if (!tooltip) return false;
    const nextDate = /* @__PURE__ */ new Date(`${tooltip.date}T12:00:00`);
    nextDate.setDate(nextDate.getDate() + direction);
    const nextDateStr = toLocalDateStr(nextDate);
    return allDates.some((item) => item.dateStr === nextDateStr);
  }
  function navigateDay(direction) {
    if (!tooltip) return;
    const nextDate = /* @__PURE__ */ new Date(`${tooltip.date}T12:00:00`);
    nextDate.setDate(nextDate.getDate() + direction);
    const nextDateStr = toLocalDateStr(nextDate);
    const nextDay = allDates.find((item) => item.dateStr === nextDateStr);
    if (!nextDay) return;
    updateTooltipPosition(nextDateStr, nextDay.xp, nextDay.time, 180);
  }
  function getTooltipTransform() {
    if (!tooltip) return "";
    const xOffset = tooltip.alignment === "left" ? "-20%" : tooltip.alignment === "right" ? "-80%" : "-50%";
    const yOffset = tooltip.showBelow ? "0" : "-100%";
    return `translate(${xOffset}, ${yOffset})`;
  }
  return /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold tracking-tight text-apple-dark1 dark:text-white", children: "学习热力图" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-apple-gray6 dark:text-apple-dark6", children: "按日期查看经验密度和学习频率" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-end gap-2", children: [
        viewMode === "quarter" && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: [1, 2, 3, 4].map((quarter) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setSelectedQuarter(quarter),
            className: `overflow-hidden rounded-full border px-3 py-1.5 text-xs font-semibold [background-clip:padding-box] transition-[transform,box-shadow,color,background-color,border-color] duration-200 ${quarter === selectedQuarter ? "border-transparent bg-[#111827] text-white shadow-[0_10px_24px_rgba(17,24,39,0.18)] hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(17,24,39,0.22)] dark:bg-white dark:text-apple-dark1 dark:hover:shadow-[0_14px_28px_rgba(0,0,0,0.24)]" : "border-black/5 bg-white/72 text-apple-gray6 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(15,23,42,0.08)] hover:text-apple-dark1 dark:border-white/10 dark:bg-white/10 dark:text-apple-dark6 dark:hover:shadow-[0_8px_18px_rgba(0,0,0,0.22)] dark:hover:text-white"}`,
            children: [
              "Q",
              quarter
            ]
          },
          quarter
        )) }),
        viewMode === "half" && /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: [1, 2].map((half) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedHalf(half),
            className: `overflow-hidden rounded-full border px-3 py-1.5 text-xs font-semibold [background-clip:padding-box] transition-[transform,box-shadow,color,background-color,border-color] duration-200 ${half === selectedHalf ? "border-transparent bg-[#111827] text-white shadow-[0_10px_24px_rgba(17,24,39,0.18)] hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(17,24,39,0.22)] dark:bg-white dark:text-apple-dark1 dark:hover:shadow-[0_14px_28px_rgba(0,0,0,0.24)]" : "border-black/5 bg-white/72 text-apple-gray6 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(15,23,42,0.08)] hover:text-apple-dark1 dark:border-white/10 dark:bg-white/10 dark:text-apple-dark6 dark:hover:shadow-[0_8px_18px_rgba(0,0,0,0.22)] dark:hover:text-white"}`,
            children: half === 1 ? "上半年" : "下半年"
          },
          half
        )) }),
        sortedYears.map((year) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedYear(year),
            className: `overflow-hidden rounded-full border px-3 py-1.5 text-xs font-semibold [background-clip:padding-box] transition-[transform,box-shadow,color,background-color,border-color] duration-200 ${year === selectedYear ? "border-transparent bg-[#111827] text-white shadow-[0_10px_24px_rgba(17,24,39,0.18)] hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(17,24,39,0.22)] dark:bg-white dark:text-apple-dark1 dark:hover:shadow-[0_14px_28px_rgba(0,0,0,0.24)]" : "border-black/5 bg-white/72 text-apple-gray6 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(15,23,42,0.08)] hover:text-apple-dark1 dark:border-white/10 dark:bg-white/10 dark:text-apple-dark6 dark:hover:shadow-[0_8px_18px_rgba(0,0,0,0.22)] dark:hover:text-white"}`,
            children: year
          },
          year
        ))
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pb-2", children: /* @__PURE__ */ jsxs("div", { className: "relative overflow-x-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "relative mb-2 ml-4 flex h-4 text-xs text-apple-gray6 dark:text-apple-dark6", style: { minWidth: `${gridMinWidth}px` }, children: monthLabels.map((label) => /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute",
          style: { left: `${label.weekIndex / weeks.length * 100}%` },
          children: label.month
        },
        `${label.month}-${label.weekIndex}`
      )) }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: "render-isolate screenshot-solid-panel screenshot-disable-blur relative grid gap-[1px] overflow-hidden rounded-[24px] border border-white/70 bg-white/92 [background-clip:padding-box] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] lg:gap-[2px] dark:border-white/10 dark:bg-[rgba(44,44,46,0.9)]",
          style: {
            gridTemplateColumns: `16px repeat(${weeks.length}, minmax(12px, 1fr))`,
            minWidth: `${gridMinWidth}px`
          },
          children: [
            WEEKDAYS.map((label, index) => /* @__PURE__ */ jsx(
              "div",
              {
                className: "flex items-center justify-center text-[10px] text-apple-gray6 dark:text-apple-dark6",
                style: { gridColumn: 1, gridRow: index + 1 },
                children: index % 2 === 1 ? label : ""
              },
              `weekday-${label}`
            )),
            weeks.map(
              (week, weekIndex) => week.map((day, dayIndex) => {
                const isValidDay = day.xp >= 0 && day.dateStr;
                return /* @__PURE__ */ jsx(
                  "div",
                  {
                    "data-heatmap-date": day.dateStr || void 0,
                    className: `heatmap-cell relative w-full rounded-[4px] transition-transform duration-150 ${isValidDay ? "cursor-pointer hover:z-[2] hover:scale-[1.08] hover:ring-2 hover:ring-[#58cc02]" : ""} ${tooltip?.date === day.dateStr ? "z-[3] ring-2 ring-[#1cb0f6]" : ""}`,
                    style: {
                      backgroundColor: getHeatmapColor(day.xp, maxXp),
                      gridColumn: weekIndex + 2,
                      gridRow: dayIndex + 1,
                      paddingBottom: "100%"
                    },
                    onClick: (event) => handleDayClick(day, event)
                  },
                  `${weekIndex}-${dayIndex}-${day.dateStr || "empty"}`
                );
              })
            )
          ]
        }
      ),
      tooltip && typeof document !== "undefined" && createPortal(
        /* @__PURE__ */ jsxs(
          "div",
          {
            ref: tooltipRef,
            className: `fixed z-[9999] w-[190px] rounded-[22px] p-3 ${isDark ? "border border-white/10 bg-[linear-gradient(180deg,rgba(58,58,60,0.94),rgba(36,36,38,0.92))] text-white shadow-[0_24px_52px_rgba(0,0,0,0.34)]" : "border border-black/6 bg-[rgba(250,251,253,0.9)] text-apple-dark1 shadow-[0_18px_38px_rgba(15,23,42,0.12)]"}`,
            style: {
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              transform: getTooltipTransform(),
              transition: `left ${tooltipTransitionMs}ms ease-out, top ${tooltipTransitionMs}ms ease-out, transform ${tooltipTransitionMs}ms ease-out`,
              willChange: "left, top, transform"
            },
            children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setTooltip(null),
                  className: `absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] shadow-sm transition-colors ${isDark ? "border border-white/10 bg-[rgba(72,72,74,0.98)] text-apple-dark6 hover:text-white" : "border border-black/6 bg-[rgba(255,255,255,0.9)] text-apple-gray6 hover:text-apple-dark1"}`,
                  children: "×"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center justify-between gap-1", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => navigateDay(-1),
                    disabled: !canNavigate(-1),
                    className: `flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${isDark ? "bg-white/10 text-apple-dark6 hover:text-white" : "bg-[rgba(240,243,247,0.86)] text-apple-gray6 hover:text-apple-dark1"}`,
                    children: "←"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-hidden px-1 text-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "truncate text-xs font-bold leading-tight", children: tooltip.date }),
                  /* @__PURE__ */ jsx("div", { className: `truncate text-[10px] leading-tight ${isDark ? "text-apple-dark6" : "text-apple-gray6"}`, children: (() => {
                    const weekday = /* @__PURE__ */ new Date(`${tooltip.date}T12:00:00`);
                    return Number.isNaN(weekday.getTime()) ? "未知" : weekday.toLocaleDateString("zh-CN", { weekday: "long" });
                  })() })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => navigateDay(1),
                    disabled: !canNavigate(1),
                    className: `flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${isDark ? "bg-white/10 text-apple-dark6 hover:text-white" : "bg-[rgba(240,243,247,0.86)] text-apple-gray6 hover:text-apple-dark1"}`,
                    children: "→"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsxs("div", { className: `flex min-w-0 flex-col justify-center rounded-2xl px-1 py-2 text-center ${isDark ? "bg-white/10" : "bg-[rgba(241,244,248,0.82)]"}`, children: [
                  /* @__PURE__ */ jsx("div", { className: "truncate text-base font-bold text-[#58cc02]", children: tooltip.xp }),
                  /* @__PURE__ */ jsx("div", { className: `text-[10px] ${isDark ? "text-apple-dark6" : "text-apple-gray6"}`, children: "XP" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: `flex min-w-0 flex-col justify-center rounded-2xl px-1 py-2 text-center ${isDark ? "bg-white/10" : "bg-[rgba(241,244,248,0.82)]"}`, children: [
                  /* @__PURE__ */ jsx("div", { className: "truncate text-base font-bold text-[#1cb0f6]", children: tooltip.time && tooltip.time > 0 ? tooltip.time : 0 }),
                  /* @__PURE__ */ jsx("div", { className: "text-[10px] text-apple-gray6 dark:text-apple-dark6", children: "分钟" })
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `absolute h-0 w-0 border-l-[6px] border-r-[6px] border-transparent ${tooltip.showBelow ? isDark ? "top-[-6px] border-b-[6px] border-b-[rgba(58,58,60,0.96)]" : "top-[-6px] border-b-[6px] border-b-[rgba(250,251,253,0.9)]" : isDark ? "bottom-[-6px] border-t-[6px] border-t-[rgba(36,36,38,0.96)]" : "bottom-[-6px] border-t-[6px] border-t-[#f6f7fa]"}`,
                  style: {
                    left: tooltip.alignment === "left" ? "20%" : tooltip.alignment === "right" ? "80%" : "50%",
                    transform: "translateX(-50%)"
                  }
                }
              )
            ]
          }
        ),
        document.body
      ),
      /* @__PURE__ */ jsxs("div", { className: "screenshot-solid-panel screenshot-disable-blur mt-4 flex flex-col gap-3 rounded-[24px] border border-white/70 bg-white/90 px-4 py-3 text-xs text-apple-gray6 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:flex-row sm:items-center sm:justify-between sm:gap-0 dark:border-white/10 dark:bg-[rgba(44,44,46,0.88)] dark:text-apple-dark6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          getViewRangeLabel(viewMode, selectedYear, selectedQuarter, selectedHalf),
          "，学习",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-bold", style: { color: DuoColors.featherGreen }, children: activeDays }),
          " ",
          "天，获得",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-bold", style: { color: DuoColors.beeYellow }, children: totalXp.toLocaleString() }),
          " ",
          "XP"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { children: "少" }),
          ["#EBEDF0", "#9BE9A8", "#40C463", DuoColors.featherGreen, "#216E39"].map((color) => /* @__PURE__ */ jsx("div", { className: "h-[10px] w-[10px] rounded-sm", style: { backgroundColor: color } }, color)),
          /* @__PURE__ */ jsx("span", { children: "多" })
        ] })
      ] })
    ] }) })
  ] });
}

export { HeatmapChart as H };
