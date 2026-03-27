/* empty css                                     */
import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_BahSWGGF.mjs';
import 'piccolore';
import { A as AppIcon, D as DuoWordmark, T as ThemeModeControl, r as resolveThemeMode, a as THEME_STORAGE_KEY, g as getResolvedTheme, b as applyResolvedTheme, $ as $$Layout } from '../chunks/theme_DRz0DP3H.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useMemo, useEffect, startTransition } from 'react';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from 'recharts';
import { H as HeatmapChart } from '../chunks/HeatmapChart_D8-J1T-y.mjs';
export { renderers } from '../renderers.mjs';

const ALL_ACHIEVEMENTS = [
  { id: "streak_7", title: "一周坚持", description: "连续学习 7 天", icon: "🔥", category: "streak" },
  { id: "streak_30", title: "月度坚持", description: "连续学习 30 天", icon: "🚀", category: "streak" },
  { id: "streak_100", title: "百日坚持", description: "连续学习 100 天", icon: "🎯", category: "streak" },
  { id: "streak_365", title: "年度坚持", description: "连续学习 365 天", icon: "🏆", category: "streak" },
  { id: "xp_1k", title: "初学者", description: "累计获得 1,000 XP", icon: "⭐", category: "xp" },
  { id: "xp_10k", title: "进阶学习者", description: "累计获得 10,000 XP", icon: "🏅", category: "xp" },
  { id: "xp_50k", title: "大师级", description: "累计获得 50,000 XP", icon: "🥇", category: "xp" },
  { id: "xp_100k", title: "熟练掌握", description: "累计获得 100,000 XP", icon: "🎖️", category: "xp" },
  { id: "daily_xp_100", title: "状态在线", description: "单日最高达到 100 XP", icon: "⚡", category: "xp" },
  { id: "daily_xp_500", title: "火力全开", description: "单日最高达到 500 XP", icon: "💥", category: "xp" },
  { id: "daily_xp_1000", title: "爆发日", description: "单日最高达到 1,000 XP", icon: "👑", category: "xp" },
  { id: "lang_3", title: "语言探索者", description: "学习 3 门语言", icon: "🌍", category: "special" },
  { id: "lang_5", title: "多语言者", description: "学习 5 门语言", icon: "🔒", category: "special" },
  { id: "plus", title: "超级会员", description: "开通 Super 会员", icon: "✨", category: "special" }
];
const CATEGORY_COLORS = {
  streak: "from-red-400 to-orange-400",
  xp: "from-yellow-400 to-amber-500",
  crowns: "from-yellow-300 to-yellow-500",
  special: "from-purple-400 to-pink-500"
};
const ACHIEVEMENT_CARD_STYLES = {
  streak_7: "from-[#ff8a66] via-[#ff9f5a] to-[#ffb36b]",
  streak_30: "from-[#ff7f6e] via-[#ff9161] to-[#ffb14c]",
  streak_100: "from-[#ff9360] via-[#ffa24f] to-[#ffbf47]",
  streak_365: "from-[#ff8f66] via-[#ff9a63] to-[#ffb86a]",
  xp_1k: "from-[#ffcd38] via-[#ffc21e] to-[#ffb100]",
  xp_10k: "from-[#ffd23f] via-[#ffc720] to-[#ffbb00]",
  xp_50k: "from-[#ffcb36] via-[#ffbf15] to-[#ffac00]",
  xp_100k: "from-[#ffd95a] via-[#ffc928] to-[#ffb100]",
  daily_xp_100: "from-[#ffe15c] via-[#ffd73a] to-[#ffc91d]",
  daily_xp_500: "from-[#ffe76d] via-[#ffda47] to-[#ffcb21]",
  daily_xp_1000: "from-[#f5d54b] via-[#e6c12d] to-[#cfa317]",
  lang_3: "from-[#b879f1] via-[#cf63cb] to-[#f04d8e]",
  lang_5: "from-[#c8c8cc] via-[#d9d9df] to-[#eeeeef]",
  plus: "from-[#b56df1] via-[#cb61da] to-[#ef5aa6]"
};
function AchievementsSection({ userData }) {
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const modalRef = useRef(null);
  const maxDailyXp = useMemo(() => {
    if (!userData.yearlyXpHistory?.length) return 0;
    return userData.yearlyXpHistory.reduce((max, item) => Math.max(max, item.xp || 0), 0);
  }, [userData.yearlyXpHistory]);
  const { unlocked, locked } = useMemo(() => {
    const unlockedList = [];
    const lockedList = [];
    ALL_ACHIEVEMENTS.forEach((achievement) => {
      let isUnlocked = false;
      switch (achievement.id) {
        case "streak_7":
          isUnlocked = userData.streak >= 7;
          break;
        case "streak_30":
          isUnlocked = userData.streak >= 30;
          break;
        case "streak_100":
          isUnlocked = userData.streak >= 100;
          break;
        case "streak_365":
          isUnlocked = userData.streak >= 365;
          break;
        case "xp_1k":
          isUnlocked = userData.totalXp >= 1e3;
          break;
        case "xp_10k":
          isUnlocked = userData.totalXp >= 1e4;
          break;
        case "xp_50k":
          isUnlocked = userData.totalXp >= 5e4;
          break;
        case "xp_100k":
          isUnlocked = userData.totalXp >= 1e5;
          break;
        case "daily_xp_100":
          isUnlocked = maxDailyXp >= 100;
          break;
        case "daily_xp_500":
          isUnlocked = maxDailyXp >= 500;
          break;
        case "daily_xp_1000":
          isUnlocked = maxDailyXp >= 1e3;
          break;
        case "lang_3":
          isUnlocked = userData.courses.length >= 3;
          break;
        case "lang_5":
          isUnlocked = userData.courses.length >= 5;
          break;
        case "plus":
          isUnlocked = userData.isPlus;
          break;
      }
      if (isUnlocked) {
        unlockedList.push(achievement);
        return;
      }
      lockedList.push(achievement);
    });
    return { unlocked: unlockedList, locked: lockedList };
  }, [maxDailyXp, userData.courses.length, userData.isPlus, userData.streak, userData.totalXp]);
  const allAchievements = [...unlocked, ...locked];
  const selectedUnlocked = selectedAchievement ? unlocked.some((achievement) => achievement.id === selectedAchievement.id) : false;
  useEffect(() => {
    if (!selectedAchievement) return;
    function handlePointerDown(event) {
      if (modalRef.current?.contains(event.target)) return;
      setSelectedAchievement(null);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [selectedAchievement]);
  return /* @__PURE__ */ jsxs("div", { className: "screenshot-solid-surface relative overflow-hidden rounded-apple-xl border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,252,0.94))] p-6 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] min-[960px]:max-[1110px]:p-5 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(58,58,60,0.92),rgba(28,28,30,0.96))] dark:hover:shadow-[0_18px_36px_rgba(0,0,0,0.24)]", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between min-[960px]:max-[1110px]:mb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-[0_6px_16px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/8", children: /* @__PURE__ */ jsx("span", { className: "text-lg", children: "🏅" }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "成就勋章" })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "text-sm text-apple-gray6", children: [
        unlocked.length,
        " / ",
        ALL_ACHIEVEMENTS.length
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mb-4 min-[960px]:max-[1110px]:mb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl bg-gradient-to-r from-duo-yellow/10 to-orange-400/10 p-3 min-[960px]:max-[1110px]:rounded-[18px] min-[960px]:max-[1110px]:p-2.5", children: [
      /* @__PURE__ */ jsx("span", { className: "text-2xl min-[960px]:max-[1110px]:text-xl", children: "⚡" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs text-apple-gray6", children: "单日最高经验" }),
        /* @__PURE__ */ jsxs("div", { className: "text-xl font-bold text-duo-yellow min-[960px]:max-[1110px]:text-lg", children: [
          maxDailyXp.toLocaleString(),
          " XP"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-2 min-[960px]:max-[1110px]:grid-cols-7 min-[960px]:max-[1110px]:gap-1.5", children: allAchievements.map((achievement) => {
      const isUnlocked = unlocked.some((item) => item.id === achievement.id);
      const color = CATEGORY_COLORS[achievement.category] || "from-gray-400 to-gray-500";
      const cardStyle = ACHIEVEMENT_CARD_STYLES[achievement.id] || color;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setSelectedAchievement(achievement),
          className: `group relative aspect-square overflow-hidden rounded-2xl border p-1 transition-transform duration-200 hover:scale-[1.02] min-[960px]:max-[1110px]:rounded-[18px] min-[960px]:max-[1110px]:p-0.5 ${isUnlocked ? "border-white/60 shadow-[0_8px_18px_rgba(251,146,60,0.14)] hover:shadow-[0_14px_28px_rgba(251,146,60,0.2)]" : "border-apple-gray3 bg-gradient-to-br from-[#f7f7f8] to-[#ececef] opacity-70 hover:opacity-90 hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)] dark:border-apple-dark4 dark:from-apple-dark3 dark:to-apple-dark2 dark:hover:shadow-[0_14px_26px_rgba(0,0,0,0.22)]"}`,
          children: [
            isUnlocked && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("div", { "aria-hidden": "true", className: `absolute inset-0 bg-gradient-to-br ${cardStyle} opacity-[0.78]` }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  "aria-hidden": "true",
                  className: "absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.42),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.18))]"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative flex h-full flex-col items-center justify-center", children: [
              /* @__PURE__ */ jsx("span", { className: "text-lg transition-transform duration-300 group-hover:scale-110 min-[960px]:max-[1110px]:text-base", children: isUnlocked ? achievement.icon : "🔒" }),
              /* @__PURE__ */ jsx("span", { className: "mt-0.5 w-full truncate px-1 text-center text-[9px] font-medium leading-tight text-apple-dark1 min-[960px]:max-[1110px]:text-[8px] dark:text-white/90", children: achievement.title })
            ] })
          ]
        },
        achievement.id
      );
    }) }),
    selectedAchievement && /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4", children: /* @__PURE__ */ jsxs(
      "div",
      {
        ref: modalRef,
        className: "pointer-events-auto w-[260px] animate-scale-in rounded-3xl border border-black/6 bg-[rgba(255,255,255,0.94)] px-5 py-6 text-center shadow-[0_22px_52px_rgba(15,23,42,0.16)] transition-all duration-200 dark:border-white/10 dark:bg-[rgba(44,44,46,0.96)]",
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[22px] bg-gradient-to-br ${CATEGORY_COLORS[selectedAchievement.category] || "from-gray-400 to-gray-500"} shadow-[0_12px_28px_rgba(251,191,36,0.24)]`,
              children: /* @__PURE__ */ jsx("span", { className: "text-4xl", children: selectedUnlocked ? selectedAchievement.icon : "🔒" })
            }
          ),
          /* @__PURE__ */ jsx("h3", { className: "mb-2 text-2xl font-black tracking-tight", children: selectedAchievement.title }),
          /* @__PURE__ */ jsx("p", { className: "mx-auto mb-4 text-base text-apple-gray6 dark:text-apple-dark6", children: selectedAchievement.description }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `mx-auto inline-flex rounded-full px-4 py-1.5 text-sm font-bold ${selectedUnlocked ? "bg-duo-green/20 text-duo-green" : "bg-apple-gray2 text-apple-gray6 dark:bg-apple-dark3 dark:text-apple-dark6"}`,
              children: selectedUnlocked ? "已解锁" : "未解锁"
            }
          )
        ]
      },
      selectedAchievement.id
    ) })
  ] });
}

const MONTH_LABELS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
function formatRollingMonthLabel(date) {
  return `${String(date.getFullYear()).slice(-2)}/${date.getMonth() + 1}`;
}
function MonthlyChart({ data, selectedYear, viewMode = "year" }) {
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const chartData = useMemo(() => {
    if (viewMode === "rolling12") {
      const monthlyXp2 = /* @__PURE__ */ new Map();
      const today = /* @__PURE__ */ new Date();
      for (let i = 11; i >= 0; i--) {
        const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;
        monthlyXp2.set(monthKey, 0);
      }
      data.forEach((item) => {
        const monthKey = item.date.slice(0, 7);
        if (!monthlyXp2.has(monthKey)) return;
        monthlyXp2.set(monthKey, (monthlyXp2.get(monthKey) || 0) + (item.xp || 0));
      });
      return Array.from(monthlyXp2.entries()).map(([monthKey, xp]) => {
        const [year2, month] = monthKey.split("-");
        return {
          date: formatRollingMonthLabel(new Date(Number(year2), Number(month) - 1, 1)),
          xp
        };
      });
    }
    const year = selectedYear || (/* @__PURE__ */ new Date()).getFullYear().toString();
    const monthlyXp = new Array(12).fill(0);
    data.forEach((item) => {
      if (!item.date.startsWith(year)) return;
      const month = Number(item.date.slice(5, 7));
      if (month < 1 || month > 12) return;
      monthlyXp[month - 1] += item.xp || 0;
    });
    return MONTH_LABELS.map((label, index) => ({
      date: label,
      xp: monthlyXp[index]
    }));
  }, [data, selectedYear, viewMode]);
  if (data.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-full min-h-[220px] w-full items-center justify-center text-apple-gray6", children: "暂无月度数据" });
  }
  return /* @__PURE__ */ jsx("div", { className: "h-full min-h-[220px] w-full", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: chartData, margin: { top: 5, right: 10, bottom: 5, left: 0 }, children: [
    /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "monthXpGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
      /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#1CB0F6", stopOpacity: 0.3 }),
      /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#1CB0F6", stopOpacity: 0 })
    ] }) }),
    /* @__PURE__ */ jsx(
      CartesianGrid,
      {
        strokeDasharray: "3 3",
        vertical: false,
        stroke: isDark ? "#334155" : "#e5e5e5"
      }
    ),
    /* @__PURE__ */ jsx(
      XAxis,
      {
        dataKey: "date",
        axisLine: false,
        tickLine: false,
        tick: { fill: isDark ? "#cbd5e1" : "#6b7280", fontSize: 10 },
        interval: 0,
        dy: 5
      }
    ),
    /* @__PURE__ */ jsx(
      YAxis,
      {
        axisLine: false,
        tickLine: false,
        tick: { fill: isDark ? "#cbd5e1" : "#6b7280", fontSize: 10 },
        width: 40,
        domain: [0, "auto"],
        tickFormatter: (value) => value >= 1e3 ? `${(value / 1e3).toFixed(0)}k` : value
      }
    ),
    /* @__PURE__ */ jsx(
      Tooltip,
      {
        formatter: (value) => [
          `${value.toLocaleString()} XP`,
          viewMode === "rolling12" ? "近12个月" : selectedYear || "当年"
        ],
        contentStyle: {
          borderRadius: "12px",
          border: isDark ? "1px solid rgba(71, 85, 105, 0.8)" : "none",
          boxShadow: isDark ? "0 10px 24px rgba(0,0,0,0.45)" : "0 4px 12px rgba(0,0,0,0.1)",
          backgroundColor: isDark ? "#0f172a" : "#ffffff"
        }
      }
    ),
    /* @__PURE__ */ jsx(
      Area,
      {
        type: "monotone",
        dataKey: "xp",
        stroke: "#1CB0F6",
        strokeWidth: 3,
        fill: "url(#monthXpGradient)",
        dot: { r: 3, fill: "#1CB0F6", strokeWidth: 2, stroke: "#fff" },
        activeDot: { r: 5 }
      }
    )
  ] }) }) });
}

function WeeklyChart({ data }) {
  const totalXp = useMemo(() => data.reduce((sum, item) => sum + (item.xp || 0), 0), [data]);
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full min-h-0 w-full flex-col", children: [
    /* @__PURE__ */ jsx("div", { className: "min-h-[180px] flex-1", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data, margin: { top: 5, right: 10, bottom: 5, left: 0 }, children: [
      /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "xpGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#58CC02", stopOpacity: 0.3 }),
        /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#58CC02", stopOpacity: 0 })
      ] }) }),
      /* @__PURE__ */ jsx(
        CartesianGrid,
        {
          strokeDasharray: "3 3",
          vertical: false,
          stroke: isDark ? "#334155" : "#e5e5e5"
        }
      ),
      /* @__PURE__ */ jsx(
        XAxis,
        {
          dataKey: "date",
          axisLine: false,
          tickLine: false,
          tick: { fill: isDark ? "#cbd5e1" : "#6b7280", fontSize: 10 },
          dy: 5
        }
      ),
      /* @__PURE__ */ jsx(
        YAxis,
        {
          axisLine: false,
          tickLine: false,
          tick: { fill: isDark ? "#cbd5e1" : "#6b7280", fontSize: 10 },
          width: 40,
          domain: [0, "auto"]
        }
      ),
      /* @__PURE__ */ jsx(
        Tooltip,
        {
          contentStyle: {
            borderRadius: "12px",
            border: isDark ? "1px solid rgba(71, 85, 105, 0.8)" : "none",
            boxShadow: isDark ? "0 10px 24px rgba(0,0,0,0.45)" : "0 4px 12px rgba(0,0,0,0.1)",
            backgroundColor: isDark ? "#0f172a" : "#ffffff"
          }
        }
      ),
      /* @__PURE__ */ jsx(
        Area,
        {
          type: "monotone",
          dataKey: "xp",
          stroke: "#58CC02",
          strokeWidth: 3,
          fill: "url(#xpGradient)",
          dot: { r: 3, fill: "#58CC02", strokeWidth: 2, stroke: "#fff" },
          activeDot: { r: 5 }
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "pt-1 text-center text-xs text-apple-gray6 dark:text-slate-400", children: [
      "本周学习 ",
      /* @__PURE__ */ jsxs("span", { className: "font-bold text-duo-green", children: [
        totalXp.toLocaleString(),
        " XP"
      ] })
    ] })
  ] });
}

function WeeklyTimeChart({ data }) {
  const totalTime = useMemo(() => data.reduce((sum, item) => sum + (item.time || 0), 0), [data]);
  const formattedTime = useMemo(() => {
    const hours = Math.floor(totalTime / 60);
    const minutes = totalTime % 60;
    return hours > 0 ? `${hours}小时${minutes}分钟` : `${minutes}分钟`;
  }, [totalTime]);
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full min-h-0 w-full flex-col", children: [
    /* @__PURE__ */ jsx("div", { className: "min-h-[180px] flex-1", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data, margin: { top: 5, right: 10, bottom: 5, left: 0 }, children: [
      /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "timeGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#1CB0F6", stopOpacity: 0.3 }),
        /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#1CB0F6", stopOpacity: 0 })
      ] }) }),
      /* @__PURE__ */ jsx(
        CartesianGrid,
        {
          strokeDasharray: "3 3",
          vertical: false,
          stroke: isDark ? "#334155" : "#e5e5e5"
        }
      ),
      /* @__PURE__ */ jsx(
        XAxis,
        {
          dataKey: "date",
          axisLine: false,
          tickLine: false,
          tick: { fill: isDark ? "#cbd5e1" : "#6b7280", fontSize: 10 },
          dy: 5
        }
      ),
      /* @__PURE__ */ jsx(
        YAxis,
        {
          axisLine: false,
          tickLine: false,
          tick: { fill: isDark ? "#cbd5e1" : "#6b7280", fontSize: 10 },
          width: 40,
          domain: [0, "auto"]
        }
      ),
      /* @__PURE__ */ jsx(
        Tooltip,
        {
          contentStyle: {
            borderRadius: "12px",
            border: isDark ? "1px solid rgba(71, 85, 105, 0.8)" : "none",
            boxShadow: isDark ? "0 10px 24px rgba(0,0,0,0.45)" : "0 4px 12px rgba(0,0,0,0.1)",
            backgroundColor: isDark ? "#0f172a" : "#ffffff"
          }
        }
      ),
      /* @__PURE__ */ jsx(
        Area,
        {
          type: "monotone",
          dataKey: "time",
          stroke: "#1CB0F6",
          strokeWidth: 3,
          fill: "url(#timeGradient)",
          dot: { r: 3, fill: "#1CB0F6", strokeWidth: 2, stroke: "#fff" },
          activeDot: { r: 5 }
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "pt-1 text-center text-xs text-apple-gray6 dark:text-slate-400", children: [
      "本周学习 ",
      /* @__PURE__ */ jsx("span", { className: "font-bold text-duo-blue", children: formattedTime })
    ] })
  ] });
}

function YearlyChart({ data }) {
  const yearlyData = useMemo(() => {
    const yearMap = /* @__PURE__ */ new Map();
    data.forEach((item) => {
      const year = item.date.substring(0, 4);
      yearMap.set(year, (yearMap.get(year) || 0) + item.xp);
    });
    return Array.from(yearMap.entries()).map(([year, xp]) => ({ year, xp })).sort((a, b) => a.year.localeCompare(b.year));
  }, [data]);
  const growthRate = useMemo(() => {
    if (yearlyData.length < 2) return null;
    const current = yearlyData[yearlyData.length - 1].xp;
    const previous = yearlyData[yearlyData.length - 2].xp;
    if (previous === 0) return null;
    return (current / previous * 100 - 100).toFixed(0);
  }, [yearlyData]);
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  if (yearlyData.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-full min-h-[220px] w-full items-center justify-center text-apple-gray6", children: "暂无年度数据" });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full min-h-0 w-full flex-col", children: [
    /* @__PURE__ */ jsx("div", { className: "min-h-[180px] flex-1", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: yearlyData, margin: { top: 5, right: 10, bottom: 5, left: 0 }, children: [
      /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "yearXpGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#A572F7", stopOpacity: 0.3 }),
        /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#A572F7", stopOpacity: 0 })
      ] }) }),
      /* @__PURE__ */ jsx(
        CartesianGrid,
        {
          strokeDasharray: "3 3",
          vertical: false,
          stroke: isDark ? "#334155" : "#e5e5e5"
        }
      ),
      /* @__PURE__ */ jsx(
        XAxis,
        {
          dataKey: "year",
          axisLine: false,
          tickLine: false,
          tick: { fill: isDark ? "#cbd5e1" : "#6b7280", fontSize: 10 },
          dy: 5
        }
      ),
      /* @__PURE__ */ jsx(
        YAxis,
        {
          axisLine: false,
          tickLine: false,
          tick: { fill: isDark ? "#cbd5e1" : "#6b7280", fontSize: 10 },
          width: 40,
          domain: [0, "auto"],
          tickFormatter: (value) => value >= 1e3 ? `${(value / 1e3).toFixed(0)}k` : value
        }
      ),
      /* @__PURE__ */ jsx(
        Tooltip,
        {
          contentStyle: {
            borderRadius: "12px",
            border: isDark ? "1px solid rgba(71, 85, 105, 0.8)" : "none",
            boxShadow: isDark ? "0 10px 24px rgba(0,0,0,0.45)" : "0 4px 12px rgba(0,0,0,0.1)",
            backgroundColor: isDark ? "#0f172a" : "#ffffff"
          }
        }
      ),
      /* @__PURE__ */ jsx(
        Area,
        {
          type: "monotone",
          dataKey: "xp",
          stroke: "#A572F7",
          strokeWidth: 3,
          fill: "url(#yearXpGradient)",
          dot: { r: 4, fill: "#A572F7", strokeWidth: 2, stroke: "#fff" },
          activeDot: { r: 6 }
        }
      )
    ] }) }) }),
    yearlyData.length > 1 && growthRate && /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center gap-2 pt-1", children: /* @__PURE__ */ jsxs(
      "span",
      {
        className: `rounded-full px-2 py-1 text-xs font-medium ${parseFloat(growthRate) >= 0 ? "bg-duo-green/20 text-duo-green" : "bg-red-500/20 text-red-500"}`,
        children: [
          parseFloat(growthRate) >= 0 ? "↑" : "↓",
          " ",
          Math.abs(parseFloat(growthRate)),
          "%"
        ]
      }
    ) })
  ] });
}

function YearlyTimeChart({ data }) {
  const yearlyData = useMemo(() => {
    const yearMap = /* @__PURE__ */ new Map();
    data.forEach((item) => {
      const year = item.date.substring(0, 4);
      yearMap.set(year, (yearMap.get(year) || 0) + (item.time || 0));
    });
    return Array.from(yearMap.entries()).map(([date, time]) => ({ date, time })).sort((a, b) => a.date.localeCompare(b.date));
  }, [data]);
  const totalTime = useMemo(() => yearlyData.reduce((sum, item) => sum + item.time, 0), [yearlyData]);
  const formattedTime = useMemo(() => {
    const hours = Math.floor(totalTime / 60);
    const minutes = totalTime % 60;
    return hours > 0 ? `${hours}小时${minutes}分钟` : `${minutes}分钟`;
  }, [totalTime]);
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  if (yearlyData.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-full min-h-[220px] w-full items-center justify-center text-apple-gray6", children: "暂无时间数据" });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full min-h-0 w-full flex-col", children: [
    /* @__PURE__ */ jsx("div", { className: "min-h-[180px] flex-1", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: yearlyData, margin: { top: 5, right: 10, bottom: 5, left: 0 }, children: [
      /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "yearlyTimeGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#FF9600", stopOpacity: 0.3 }),
        /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#FF9600", stopOpacity: 0 })
      ] }) }),
      /* @__PURE__ */ jsx(
        CartesianGrid,
        {
          strokeDasharray: "3 3",
          vertical: false,
          stroke: isDark ? "#334155" : "#e5e5e5"
        }
      ),
      /* @__PURE__ */ jsx(
        XAxis,
        {
          dataKey: "date",
          axisLine: false,
          tickLine: false,
          tick: { fill: isDark ? "#cbd5e1" : "#6b7280", fontSize: 10 },
          dy: 5
        }
      ),
      /* @__PURE__ */ jsx(
        YAxis,
        {
          axisLine: false,
          tickLine: false,
          tick: { fill: isDark ? "#cbd5e1" : "#6b7280", fontSize: 10 },
          width: 40,
          domain: [0, "auto"],
          tickFormatter: (value) => value >= 60 ? `${Math.floor(value / 60)}h` : value
        }
      ),
      /* @__PURE__ */ jsx(
        Tooltip,
        {
          contentStyle: {
            borderRadius: "12px",
            border: isDark ? "1px solid rgba(71, 85, 105, 0.8)" : "none",
            boxShadow: isDark ? "0 10px 24px rgba(0,0,0,0.45)" : "0 4px 12px rgba(0,0,0,0.1)",
            backgroundColor: isDark ? "#0f172a" : "#ffffff"
          }
        }
      ),
      /* @__PURE__ */ jsx(
        Area,
        {
          type: "monotone",
          dataKey: "time",
          stroke: "#FF9600",
          strokeWidth: 3,
          fill: "url(#yearlyTimeGradient)",
          dot: { r: 3, fill: "#FF9600", strokeWidth: 2, stroke: "#fff" },
          activeDot: { r: 5 }
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "pt-1 text-center text-xs text-apple-gray6 dark:text-slate-400", children: [
      "累计学习 ",
      /* @__PURE__ */ jsx("span", { className: "font-bold text-duo-orange", children: formattedTime })
    ] })
  ] });
}

function DuoReview({ userData }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchAnalysis();
  }, [userData]);
  async function fetchAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData })
      });
      if (!response.ok) {
        const data2 = await response.json();
        throw new Error(data2.error || "获取点评失败");
      }
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "获取点评失败");
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxs("section", { className: "screenshot-solid-surface group relative overflow-hidden rounded-apple-xl border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,252,0.94))] p-6 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.09)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(58,58,60,0.92),rgba(28,28,30,0.96))] dark:hover:shadow-[0_18px_36px_rgba(0,0,0,0.26)]", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        "aria-hidden": "true",
        className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(28,176,246,0.1),transparent_34%)] opacity-90 transition-opacity duration-200 group-hover:opacity-100"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-5 flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/90 text-xl shadow-[0_6px_16px_rgba(15,23,42,0.05)] transition-transform duration-200 group-hover:scale-[1.03] dark:border-white/10 dark:bg-white/8", children: "🦉" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold tracking-tight text-apple-dark1 dark:text-white", children: "多儿点评" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-apple-gray6 dark:text-apple-dark6", children: "用简短总结告诉你今天的学习状态" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: `inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.18em] transition-colors duration-200 ${loading ? "bg-[#1cb0f6]/12 text-[#147fb2] dark:bg-[#1cb0f6]/16 dark:text-[#8ddcff]" : error ? "bg-[#ff4b4b]/10 text-[#d84343] dark:bg-[#ff4b4b]/14 dark:text-[#ff9a9a]" : "bg-[#58cc02]/10 text-[#3d8f09] dark:bg-[#58cc02]/15 dark:text-[#b6ef89]"}`,
            children: loading ? "ANALYZING" : error ? "ERROR" : "READY"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "screenshot-solid-panel relative min-h-[136px] rounded-[24px] border border-white/70 bg-white/88 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition-colors duration-200 group-hover:border-white/90 group-hover:bg-white/92 dark:border-white/10 dark:bg-white/6 dark:group-hover:bg-white/8", children: error ? /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm leading-7 text-apple-gray6 dark:text-apple-dark6", children: error }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: fetchAnalysis,
            className: "inline-flex items-center rounded-full border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-apple-dark1 shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/8 dark:text-white",
            children: "重试"
          }
        )
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("p", { className: `text-sm leading-7 text-apple-dark1 transition-opacity duration-200 dark:text-white/90 ${loading ? "opacity-0" : "opacity-100"}`, children: analysis || "暂时还没有可展示的点评。" }),
        loading ? /* @__PURE__ */ jsxs("div", { className: "absolute inset-4 flex flex-col justify-center gap-3 animate-pulse", children: [
          /* @__PURE__ */ jsx("div", { className: "h-4 w-2/3 rounded-full bg-black/5 dark:bg-white/10" }),
          /* @__PURE__ */ jsx("div", { className: "h-4 w-full rounded-full bg-black/5 dark:bg-white/10" }),
          /* @__PURE__ */ jsx("div", { className: "h-4 w-5/6 rounded-full bg-black/5 dark:bg-white/10" })
        ] }) : null
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "mt-5 flex justify-end", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: fetchAnalysis,
          disabled: loading,
          className: "inline-flex items-center rounded-full bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(17,24,39,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(17,24,39,0.2)] disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 disabled:hover:shadow-[0_8px_20px_rgba(17,24,39,0.14)] dark:bg-white dark:text-apple-dark1",
          children: loading ? "生成中..." : "刷新点评"
        }
      ) })
    ] })
  ] });
}

const LANGUAGE_NAMES = {
  en: "英语",
  es: "西班牙语",
  fr: "法语",
  de: "德语",
  it: "意大利语",
  pt: "葡萄牙语",
  ja: "日语",
  ko: "韩语",
  zh: "中文",
  zs: "中文",
  zt: "中文",
  yue: "粤语",
  zh_hk: "粤语",
  zh_cn: "中文",
  ru: "俄语",
  ar: "阿拉伯语",
  hi: "印地语",
  tr: "土耳其语",
  vi: "越南语",
  th: "泰语",
  id: "印尼语",
  pl: "波兰语",
  nl: "荷兰语",
  sv: "瑞典语",
  da: "丹麦语",
  no: "挪威语",
  fi: "芬兰语",
  el: "希腊语",
  he: "希伯来语",
  cs: "捷克语",
  ro: "罗马尼亚语",
  hu: "匈牙利语",
  uk: "乌克兰语"
};
const TITLE_ALIASES = {
  "Chinese (Cantonese)": "粤语",
  Cantonese: "粤语",
  Chinese: "中文",
  English: "英语",
  Japanese: "日语",
  Korean: "韩语",
  French: "法语",
  German: "德语",
  Spanish: "西班牙语",
  Portuguese: "葡萄牙语",
  Italian: "意大利语"
};
function resolveLanguageLabel(course) {
  return LANGUAGE_NAMES[course.learningLanguage] || TITLE_ALIASES[course.title] || course.title;
}
function LanguageDistribution({ courses, totalXp }) {
  const sortedCourses = useMemo(() => [...courses].sort((a, b) => b.xp - a.xp).slice(0, 4), [courses]);
  const colors = ["#58CC02", "#1CB0F6", "#A572F7", "#FF9600", "#FF4B4B"];
  return /* @__PURE__ */ jsxs("div", { className: "screenshot-solid-surface relative overflow-hidden rounded-apple-xl border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,252,0.94))] p-6 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(58,58,60,0.92),rgba(28,28,30,0.96))] dark:hover:shadow-[0_18px_36px_rgba(0,0,0,0.24)]", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-4 flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-2xl border border-white/80 bg-white/90 shadow-[0_6px_16px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/8", children: /* @__PURE__ */ jsx("span", { className: "text-lg", children: "🌍" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-apple-dark1 dark:text-white", children: "语言分布" })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: sortedCourses.map((course, index) => {
      const percentage = totalXp > 0 ? Math.round(course.xp / totalXp * 100) : 0;
      const color = colors[index % colors.length];
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "group rounded-2xl px-2 py-2 transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:bg-black/[0.02] hover:shadow-[0_10px_20px_rgba(15,23,42,0.06)] dark:hover:bg-white/[0.03] dark:hover:shadow-[0_12px_22px_rgba(0,0,0,0.2)]",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-apple-dark1 dark:text-white", children: resolveLanguageLabel(course) }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm font-semibold", style: { color }, children: [
                percentage,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-2.5 overflow-hidden rounded-full bg-apple-gray3 dark:bg-apple-dark3", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "relative h-full overflow-hidden rounded-full transition-[width,filter] duration-700 ease-out group-hover:brightness-[1.03]",
                style: { width: `${percentage}%`, backgroundColor: color },
                children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-60 bg-gradient-to-r from-transparent via-white/30 to-transparent" })
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "mt-1.5 flex items-center text-xs text-apple-gray6 dark:text-apple-dark6", children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: course.xp.toLocaleString() }),
              "XP"
            ] }) })
          ]
        },
        course.id
      );
    }) }),
    courses.length > 4 ? /* @__PURE__ */ jsx("div", { className: "mt-4 border-t border-apple-gray3 pt-4 dark:border-apple-dark4", children: /* @__PURE__ */ jsxs("div", { className: "text-sm text-apple-gray6 dark:text-apple-dark6", children: [
      "还有 ",
      /* @__PURE__ */ jsx("span", { className: "font-semibold", children: courses.length - 4 }),
      " 门语言正在学习"
    ] }) }) : null
  ] });
}

const iconButtonClassName = "flex h-11 w-11 items-center justify-center rounded-2xl border border-black/5 bg-white/88 text-apple-gray6 shadow-[0_6px_14px_rgba(15,23,42,0.04)] transition-[transform,box-shadow,color,background-color,border-color,opacity] duration-200 hover:text-apple-dark1 dark:border-white/15 dark:bg-white/12 dark:text-white/72 dark:hover:text-white";
function Navbar({
  username,
  themeMode,
  resolvedTheme,
  animationsEnabled,
  isScreenshotting,
  onThemeChange,
  onToggleAnimations,
  onScreenshot,
  onLogout
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollFrameRef = useRef(null);
  const isScrolledRef = useRef(false);
  useEffect(() => {
    function commitScrollState(scrollTop) {
      const nextIsScrolled = scrollTop > 12;
      if (nextIsScrolled === isScrolledRef.current) return;
      isScrolledRef.current = nextIsScrolled;
      startTransition(() => {
        setIsScrolled(nextIsScrolled);
      });
    }
    function handleScroll() {
      if (scrollFrameRef.current !== null) return;
      scrollFrameRef.current = window.requestAnimationFrame(() => {
        scrollFrameRef.current = null;
        commitScrollState(window.scrollY);
      });
    }
    commitScrollState(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);
  return /* @__PURE__ */ jsx("nav", { "data-floating-navbar": "true", className: "fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: `screenshot-solid-panel screenshot-disable-blur mx-auto flex max-w-[1560px] flex-col gap-3 overflow-visible rounded-[28px] border px-4 py-3.5 transition-[background-color,border-color,box-shadow] duration-300 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${isScrolled ? "border-white/78 bg-[rgba(255,255,255,0.92)] shadow-[0_14px_30px_rgba(15,23,42,0.08)] dark:border-white/15 dark:bg-[rgba(44,44,46,0.88)]" : "border-white/68 bg-[rgba(255,255,255,0.9)] shadow-[0_6px_16px_rgba(15,23,42,0.04)] dark:border-white/12 dark:bg-[rgba(44,44,46,0.82)]"}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex min-w-0 items-center justify-between gap-2 overflow-visible py-1 sm:justify-start sm:gap-3", children: /* @__PURE__ */ jsxs("a", { href: "/", className: "group flex items-center gap-1 overflow-visible py-1", children: [
          /* @__PURE__ */ jsx(AppIcon, { className: "h-11 w-11 shrink-0" }),
          /* @__PURE__ */ jsx(DuoWordmark, { size: "xs", className: "shrink-0 max-w-full overflow-visible" }),
          /* @__PURE__ */ jsx("span", { className: "hidden -mx-0.5 shrink-0 text-[11px] font-medium text-apple-gray6/70 dark:text-white/38 sm:inline", children: "-" }),
          /* @__PURE__ */ jsxs("div", { className: "hidden min-w-0 truncate text-[11px] text-apple-gray6 dark:text-white/55 sm:block", children: [
            "@",
            username || "duolingo"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2 self-end sm:self-auto", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onToggleAnimations,
              className: iconButtonClassName,
              title: animationsEnabled ? "关闭动效" : "开启动效",
              "aria-label": animationsEnabled ? "关闭动效" : "开启动效",
              children: /* @__PURE__ */ jsx("span", { className: "text-sm", children: animationsEnabled ? "✨" : "⏸" })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onScreenshot,
              disabled: isScreenshotting,
              className: `${iconButtonClassName} disabled:cursor-not-allowed disabled:opacity-55`,
              title: isScreenshotting ? "正在截图" : "截图",
              "aria-label": isScreenshotting ? "正在截图" : "截图",
              children: isScreenshotting ? /* @__PURE__ */ jsxs("svg", { className: "h-5 w-5 animate-spin", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: [
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9", stroke: "currentColor", strokeWidth: "2.5", className: "opacity-25" }),
                /* @__PURE__ */ jsx("path", { d: "M21 12a9 9 0 0 0-9-9", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", className: "opacity-90" })
              ] }) : /* @__PURE__ */ jsxs("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: [
                /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" }),
                /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(ThemeModeControl, { mode: themeMode, resolvedTheme, onChange: onThemeChange }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: onLogout, className: iconButtonClassName, title: "退出登录", "aria-label": "退出登录", children: /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M17 16l4-4m0 0-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1" }) }) })
        ] })
      ]
    }
  ) });
}

function formatMinutes(minutes) {
  if (minutes <= 0) return "0 分钟";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours <= 0) return `${remainingMinutes} 分钟`;
  if (remainingMinutes <= 0) return `${hours} 小时`;
  return `${hours} 小时 ${remainingMinutes} 分钟`;
}
function TodayOverview({ userData }) {
  const todayTimeMinutes = useMemo(() => {
    if (!userData.dailyTimeHistory?.length) return 0;
    return userData.dailyTimeHistory[userData.dailyTimeHistory.length - 1]?.time || 0;
  }, [userData.dailyTimeHistory]);
  const primaryStats = useMemo(
    () => [
      {
        label: "今日 XP",
        value: (userData.xpToday || 0).toLocaleString(),
        icon: "⚡",
        valueClass: "text-[#58cc02]",
        panelClass: "from-[#f4fbe7] via-[#f8fdf0] to-[#ffffff]",
        darkPanelClass: "dark:from-[rgba(88,204,2,0.16)] dark:via-[rgba(58,58,60,0.96)] dark:to-[rgba(44,44,46,0.98)]",
        glowClass: "bg-[#9be15d]/30"
      },
      {
        label: "今日学习时间",
        value: formatMinutes(todayTimeMinutes),
        icon: "⏱",
        valueClass: "text-[#1cb0f6]",
        panelClass: "from-[#eef8ff] via-[#f6fbff] to-[#ffffff]",
        darkPanelClass: "dark:from-[rgba(28,176,246,0.16)] dark:via-[rgba(58,58,60,0.96)] dark:to-[rgba(44,44,46,0.98)]",
        glowClass: "bg-[#78d3ff]/26"
      },
      {
        label: "今日完成课次",
        value: `${userData.lessonsToday || 0}`,
        icon: "📚",
        valueClass: "text-[#ff8a00]",
        panelClass: "from-[#fff4ea] via-[#fff8f2] to-[#ffffff]",
        darkPanelClass: "dark:from-[rgba(255,150,0,0.14)] dark:via-[rgba(58,58,60,0.96)] dark:to-[rgba(44,44,46,0.98)]",
        glowClass: "bg-[#ffbe7a]/24"
      },
      {
        label: "连续天数",
        value: `${userData.streak}`,
        icon: "🔥",
        valueClass: "text-[#ff6b00]",
        panelClass: "from-[#fff1eb] via-[#fff7f3] to-[#ffffff]",
        darkPanelClass: "dark:from-[rgba(255,107,0,0.14)] dark:via-[rgba(58,58,60,0.96)] dark:to-[rgba(44,44,46,0.98)]",
        glowClass: "bg-[#ff9b6a]/24"
      }
    ],
    [todayTimeMinutes, userData.lessonsToday, userData.streak, userData.xpToday]
  );
  const secondaryStats = useMemo(() => {
    const items = [
      { label: "总经验", value: `${userData.totalXp.toLocaleString()} XP` },
      { label: "学习语言", value: userData.learningLanguage || "未知" },
      { label: "账户年龄", value: `${userData.accountAgeDays} 天` },
      { label: "总投入时间", value: userData.estimatedLearningTime || "暂无数据" }
    ];
    if (userData.gems > 0) {
      items.push({ label: "钻石", value: userData.gems.toLocaleString() });
    }
    if (userData.league && userData.league !== "—") {
      items.push({ label: "联赛段位", value: userData.league });
    }
    return items;
  }, [
    userData.accountAgeDays,
    userData.estimatedLearningTime,
    userData.gems,
    userData.league,
    userData.learningLanguage,
    userData.totalXp
  ]);
  const secondaryGridClass = useMemo(() => {
    if (secondaryStats.length >= 6) return "grid-cols-2 lg:grid-cols-3 xl:grid-cols-6";
    if (secondaryStats.length === 5) return "grid-cols-2 lg:grid-cols-5";
    if (secondaryStats.length === 4) return "grid-cols-2 lg:grid-cols-4";
    if (secondaryStats.length === 3) return "grid-cols-1 sm:grid-cols-3";
    return "grid-cols-1 sm:grid-cols-2";
  }, [secondaryStats.length]);
  return /* @__PURE__ */ jsxs("section", { className: "screenshot-solid-surface overflow-hidden rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,250,252,0.94))] p-6 shadow-[0_12px_28px_rgba(15,23,42,0.06)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(58,58,60,0.94),rgba(28,28,30,0.98))] dark:hover:shadow-[0_18px_36px_rgba(0,0,0,0.24)]", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-5 xl:grid-cols-12", children: [
      /* @__PURE__ */ jsx("div", { className: "xl:col-span-4", children: /* @__PURE__ */ jsxs("div", { className: "screenshot-solid-panel group relative h-full overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(28,176,246,0.12),transparent_36%),linear-gradient(135deg,#ffffff_0%,#f5f7fb_100%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(15,23,42,0.08)] dark:bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(28,176,246,0.14),transparent_34%),linear-gradient(135deg,rgba(72,72,74,0.98)_0%,rgba(44,44,46,0.98)_100%)] dark:hover:shadow-[0_18px_34px_rgba(0,0,0,0.24)]", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-8 inline-flex items-center gap-2 rounded-full bg-white/88 px-3 py-1 text-xs font-semibold text-apple-gray6 shadow-sm dark:bg-white/8 dark:text-apple-dark6", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: "📊" }),
          "今日概览"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-[2rem] font-black tracking-tight text-apple-dark1 dark:text-white", children: "今天也在稳步推进" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-base text-apple-gray6 dark:text-apple-dark6", children: (/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "long" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "screenshot-solid-panel rounded-[22px] bg-white/88 px-4 py-4 shadow-[0_6px_16px_rgba(15,23,42,0.04)] transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_10px_22px_rgba(15,23,42,0.06)] dark:bg-[rgba(255,255,255,0.06)]", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs font-medium tracking-[0.18em] text-apple-gray6 dark:text-apple-dark6", children: "TODAY SNAPSHOT" }),
            /* @__PURE__ */ jsxs("p", { className: "mt-3 text-sm leading-7 text-apple-dark1 dark:text-white/90", children: [
              "今日已完成 ",
              /* @__PURE__ */ jsx("span", { className: "font-bold text-[#58cc02]", children: userData.lessonsToday || 0 }),
              " 课，学习",
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-bold text-[#1cb0f6]", children: formatMinutes(todayTimeMinutes) }),
              "，当前连续",
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-bold text-[#ff6b00]", children: userData.streak }),
              " 天。"
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "xl:col-span-8", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: primaryStats.map((stat) => /* @__PURE__ */ jsxs(
        "article",
        {
          className: `group relative min-h-[168px] overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br ${stat.panelClass} ${stat.darkPanelClass} p-6 shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(15,23,42,0.08)] dark:border-white/10 dark:hover:shadow-[0_16px_30px_rgba(0,0,0,0.24)]`,
          children: [
            /* @__PURE__ */ jsx("div", { className: `absolute right-[-12px] top-[-12px] h-20 w-20 rounded-full opacity-70 blur-2xl transition-transform duration-200 group-hover:scale-105 ${stat.glowClass} dark:opacity-45` }),
            /* @__PURE__ */ jsxs("div", { className: "relative flex h-full flex-col justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[2rem] leading-none transition-transform duration-300 group-hover:scale-110", children: stat.icon }),
                /* @__PURE__ */ jsx("div", { className: "rounded-full bg-white/88 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-apple-gray6 shadow-sm dark:bg-white/8 dark:text-apple-dark6", children: "Today" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: `text-[2rem] font-black tracking-tight ${stat.valueClass}`, children: stat.value }),
                /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm font-medium text-apple-gray6 dark:text-apple-dark6", children: stat.label })
              ] })
            ] })
          ]
        },
        stat.label
      )) }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: `mt-5 grid gap-3 ${secondaryGridClass}`, children: secondaryStats.map((item) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "screenshot-solid-panel rounded-[22px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(246,247,250,0.92))] px-4 py-4 shadow-[0_4px_12px_rgba(15,23,42,0.03)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(72,72,74,0.96),rgba(44,44,46,0.98))] dark:hover:shadow-[0_12px_22px_rgba(0,0,0,0.2)]",
        children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-apple-gray6 dark:text-apple-dark6", children: item.label }),
          /* @__PURE__ */ jsx("div", { className: "mt-2 text-lg font-semibold tracking-tight text-apple-dark1 dark:text-white", children: item.value })
        ]
      },
      item.label
    )) })
  ] });
}

function getMonthlyYears(data) {
  if (!data?.length) return [];
  return Array.from(new Set(data.map((item) => item.date.slice(0, 4)))).filter((year) => /^\d{4}$/.test(year)).sort((a, b) => Number(b) - Number(a));
}
const surfaceClassName = "render-isolate screenshot-solid-surface relative overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,252,0.94))] shadow-[0_12px_28px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(58,58,60,0.92),rgba(28,28,30,0.96))]";
const headerBadgeClassName = "inline-flex items-center rounded-full border border-black/5 bg-white/88 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-apple-gray6 shadow-[0_4px_12px_rgba(15,23,42,0.04)] dark:border-white/20 dark:bg-white/16 dark:text-white/85";
function getHeaderActionClassName(isActive) {
  return `rounded-full border px-3 py-1.5 text-xs font-semibold transition-[transform,box-shadow,color,background-color,border-color] duration-200 ${isActive ? "border-transparent bg-[#111827] text-white shadow-[0_8px_20px_rgba(17,24,39,0.14)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(17,24,39,0.2)] dark:bg-white dark:text-apple-dark1 dark:hover:shadow-[0_12px_24px_rgba(0,0,0,0.22)]" : "border-black/5 bg-white/88 text-apple-gray6 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(15,23,42,0.08)] hover:text-apple-dark1 dark:border-white/10 dark:bg-white/8 dark:text-apple-dark6 dark:hover:shadow-[0_8px_18px_rgba(0,0,0,0.22)] dark:hover:text-white"}`;
}
function WeeklyRangeActions({ value, onChange }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onChange("recent7"),
        className: getHeaderActionClassName(value === "recent7"),
        children: "最近七天"
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onChange("week"),
        className: getHeaderActionClassName(value === "week"),
        children: "本周"
      }
    )
  ] });
}
function DashboardCard({
  icon,
  title,
  subtitle,
  badge,
  badgeClassName,
  actions,
  className = "",
  children
}) {
  return /* @__PURE__ */ jsxs("section", { className: `group ${surfaceClassName} transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_18px_36px_rgba(0,0,0,0.26)] ${className}`, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        "aria-hidden": "true",
        className: "screenshot-soft-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.58),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(28,176,246,0.04),transparent_30%)]"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative flex h-full min-h-[260px] flex-col p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/90 text-xl shadow-[0_6px_16px_rgba(15,23,42,0.05)] transition-transform duration-200 group-hover:scale-[1.03] dark:border-white/20 dark:bg-white/92 dark:text-apple-dark1", children: icon }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold tracking-tight text-apple-dark1 dark:text-white", children: title }),
            subtitle ? /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-apple-gray6 dark:text-white/72", children: subtitle }) : null
          ] })
        ] }),
        actions || badge ? /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-end gap-2", children: [
          actions,
          badge ? /* @__PURE__ */ jsx("span", { className: badgeClassName || headerBadgeClassName, children: badge }) : null
        ] }) : null
      ] }),
      /* @__PURE__ */ jsx("div", { className: "min-h-0 flex-1", children })
    ] })
  ] });
}
function DashboardSections({
  userData,
  isLoaded,
  selectedMonthlyYear,
  monthlyViewMode,
  weeklyXpRangeMode,
  weeklyTimeRangeMode,
  onSelectMonthlyYear,
  onSelectRollingMonths,
  onSelectWeeklyXpRangeMode,
  onSelectWeeklyTimeRangeMode,
  animated = true
}) {
  const monthlyYears = getMonthlyYears(userData.yearlyXpHistory);
  const animationClass = animated ? isLoaded ? "animate-fade-in-up" : "opacity-0" : "";
  const weeklyXpData = weeklyXpRangeMode === "week" ? userData.weeklyXpHistory || [] : (userData.dailyXpHistory || []).map((item) => ({ date: item.date, xp: item.xp }));
  const weeklyTimeData = weeklyTimeRangeMode === "week" ? userData.weeklyTimeHistory || [] : (userData.dailyTimeHistory || []).map((item) => ({ date: item.date, time: item.time }));
  return /* @__PURE__ */ jsxs("div", { className: `${animationClass} space-y-6`, children: [
    /* @__PURE__ */ jsxs("section", { className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/88 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-apple-gray6 shadow-[0_4px_12px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/8 dark:text-apple-dark6", children: "DUOEYE DASHBOARD" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-3 text-[clamp(2rem,3vw,3rem)] font-semibold tracking-tight text-apple-dark1 dark:text-white", children: "学习数据总览" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-apple-gray6 dark:text-apple-dark6", children: "统一展示你的经验、时间、成就和热力分布。" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: headerBadgeClassName, children: userData.learningLanguage || "未知语言" }),
        /* @__PURE__ */ jsxs("span", { className: headerBadgeClassName, children: [
          userData.totalXp.toLocaleString(),
          " XP"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: headerBadgeClassName, children: [
          userData.streak,
          " 天连续学习"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: animationClass, style: animated ? { animationDelay: "0.08s" } : void 0, children: /* @__PURE__ */ jsx(TodayOverview, { userData }) }),
    /* @__PURE__ */ jsxs("div", { className: `grid grid-cols-1 gap-6 xl:grid-cols-12 ${animationClass}`, style: animated ? { animationDelay: "0.14s" } : void 0, children: [
      /* @__PURE__ */ jsx("div", { className: "xl:col-span-8", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 xl:grid-cols-2", children: [
        /* @__PURE__ */ jsx(
          DashboardCard,
          {
            icon: "📈",
            title: "本周经验",
            subtitle: weeklyXpRangeMode === "week" ? "查看本周每日 XP 分布" : "观察最近 7 天的 XP 变化",
            actions: /* @__PURE__ */ jsx(WeeklyRangeActions, { value: weeklyXpRangeMode, onChange: onSelectWeeklyXpRangeMode }),
            children: /* @__PURE__ */ jsx(WeeklyChart, { data: weeklyXpData })
          }
        ),
        /* @__PURE__ */ jsx(
          DashboardCard,
          {
            icon: "⏱",
            title: "本周学习时间",
            subtitle: weeklyTimeRangeMode === "week" ? "查看本周每日学习投入" : "查看最近 7 天的学习投入",
            actions: /* @__PURE__ */ jsx(WeeklyRangeActions, { value: weeklyTimeRangeMode, onChange: onSelectWeeklyTimeRangeMode }),
            children: /* @__PURE__ */ jsx(WeeklyTimeChart, { data: weeklyTimeData })
          }
        ),
        /* @__PURE__ */ jsx(
          DashboardCard,
          {
            icon: "🗓",
            title: "月度经验对比",
            subtitle: "支持查看指定年份和近 12 个月",
            className: "xl:col-span-2",
            actions: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: onSelectRollingMonths,
                  className: getHeaderActionClassName(monthlyViewMode === "rolling12"),
                  children: "近 12 个月"
                }
              ),
              monthlyYears.map((year) => /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onSelectMonthlyYear(year),
                  className: getHeaderActionClassName(monthlyViewMode === "year" && selectedMonthlyYear === year),
                  children: year
                },
                year
              ))
            ] }),
            children: /* @__PURE__ */ jsx(
              MonthlyChart,
              {
                data: userData.yearlyXpHistory || [],
                selectedYear: selectedMonthlyYear,
                viewMode: monthlyViewMode
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          DashboardCard,
          {
            icon: "📊",
            title: "年度经验对比",
            subtitle: "按年份查看累计 XP",
            badge: "历史",
            badgeClassName: "inline-flex items-center rounded-full bg-[#a572f7]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[#7b4bc2] dark:bg-[#a572f7]/15 dark:text-[#d6b8ff]",
            children: /* @__PURE__ */ jsx(YearlyChart, { data: userData.yearlyXpHistory || [] })
          }
        ),
        /* @__PURE__ */ jsx(
          DashboardCard,
          {
            icon: "⌛",
            title: "年度学习时间",
            subtitle: "按年份查看累计学习时长",
            badge: "分钟",
            badgeClassName: "inline-flex items-center rounded-full bg-[#ff9600]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[#c47505] dark:bg-[#ff9600]/15 dark:text-[#ffd39a]",
            children: /* @__PURE__ */ jsx(YearlyTimeChart, { data: userData.yearlyXpHistory || [] })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("aside", { className: "space-y-6 xl:col-span-4", children: [
        /* @__PURE__ */ jsx("div", { className: animationClass, style: animated ? { animationDelay: "0.2s" } : void 0, children: /* @__PURE__ */ jsx(LanguageDistribution, { courses: userData.courses, totalXp: userData.totalXp }) }),
        /* @__PURE__ */ jsx("div", { className: animationClass, style: animated ? { animationDelay: "0.24s" } : void 0, children: /* @__PURE__ */ jsx(AchievementsSection, { userData }) }),
        /* @__PURE__ */ jsx("div", { className: animationClass, style: animated ? { animationDelay: "0.28s" } : void 0, children: /* @__PURE__ */ jsx(DuoReview, { userData }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: `deferred-section group ${surfaceClassName} transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(15,23,42,0.1)] dark:hover:shadow-[0_22px_42px_rgba(0,0,0,0.28)] ${animationClass}`, style: animated ? { animationDelay: "0.32s" } : void 0, children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.32),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(28,176,246,0.06),transparent_26%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(28,176,246,0.1),transparent_28%)]"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "relative p-6", children: /* @__PURE__ */ jsx(HeatmapChart, { data: userData.yearlyXpHistory || [] }) })
    ] })
  ] });
}
function DuoDashApp() {
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState("");
  const [loadError, setLoadError] = useState("");
  const [themeMode, setThemeMode] = useState("system");
  const [resolvedTheme, setResolvedTheme] = useState("light");
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [isScreenshotting, setIsScreenshotting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedMonthlyYear, setSelectedMonthlyYear] = useState("");
  const [monthlyViewMode, setMonthlyViewMode] = useState("rolling12");
  const [weeklyXpRangeMode, setWeeklyXpRangeMode] = useState("recent7");
  const [weeklyTimeRangeMode, setWeeklyTimeRangeMode] = useState("recent7");
  const pageRef = useRef(null);
  const contentRef = useRef(null);
  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();
    const storedAnimations = localStorage.getItem("duoeye_animations_enabled");
    const timer = window.setTimeout(() => setIsLoaded(true), 120);
    async function bootstrap() {
      const storedUsername = sessionStorage.getItem("duoeye_username")?.trim() || "";
      const storedUserData = sessionStorage.getItem("duoeye_userdata");
      setUsername(storedUsername);
      if (storedUserData) {
        try {
          if (isCancelled) return;
          setUserData(JSON.parse(storedUserData));
          setLoadError("");
          setLoading(false);
          return;
        } catch {
          sessionStorage.removeItem("duoeye_userdata");
        }
      }
      if (!storedUsername) {
        if (isCancelled) return;
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("/api/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: storedUsername }),
          signal: controller.signal
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(typeof result?.error === "string" ? result.error : "获取学习数据失败");
        }
        if (isCancelled) return;
        setUserData(result.data);
        setLoadError("");
        sessionStorage.setItem("duoeye_userdata", JSON.stringify(result.data));
      } catch (error) {
        if (controller.signal.aborted || isCancelled) return;
        sessionStorage.removeItem("duoeye_userdata");
        setUserData(null);
        setLoadError(error instanceof Error ? error.message : "获取学习数据失败");
      } finally {
        if (isCancelled) return;
        setLoading(false);
      }
    }
    if (storedAnimations === "false") {
      setAnimationsEnabled(false);
      document.documentElement.classList.add("animations-off");
    }
    const initialThemeMode = resolveThemeMode(localStorage.getItem(THEME_STORAGE_KEY));
    const initialResolvedTheme = getResolvedTheme(initialThemeMode);
    setThemeMode(initialThemeMode);
    setResolvedTheme(initialResolvedTheme);
    applyResolvedTheme(initialResolvedTheme);
    bootstrap();
    return () => {
      isCancelled = true;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("animations-off", !animationsEnabled);
    localStorage.setItem("duoeye_animations_enabled", String(animationsEnabled));
  }, [animationsEnabled]);
  useEffect(() => {
    const years = getMonthlyYears(userData?.yearlyXpHistory);
    if (!years.length) {
      if (selectedMonthlyYear) setSelectedMonthlyYear("");
      return;
    }
    if (!years.includes(selectedMonthlyYear)) {
      setSelectedMonthlyYear(years[0]);
    }
  }, [selectedMonthlyYear, userData]);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    function syncTheme() {
      const nextResolvedTheme = getResolvedTheme(themeMode);
      setResolvedTheme(nextResolvedTheme);
      applyResolvedTheme(nextResolvedTheme);
    }
    syncTheme();
    mediaQuery.addEventListener("change", syncTheme);
    return () => mediaQuery.removeEventListener("change", syncTheme);
  }, [themeMode]);
  function handleThemeChange(mode) {
    setThemeMode(mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }
  function toggleAnimations() {
    setAnimationsEnabled((current) => !current);
  }
  function getScreenshotFileName() {
    const rawName = userData?.learningLanguage || "dashboard";
    const safeName = rawName.replace(/[\\/:*?"<>|]+/g, "-").trim() || "dashboard";
    return `duoeye-${safeName}-${Date.now()}`;
  }
  function downloadDataUrl(dataUrl, fileName) {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${fileName}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  function waitForStableFrame(delayMs = 0) {
    return new Promise((resolve) => {
      const run = () => window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
      if (delayMs <= 0) {
        run();
        return;
      }
      window.setTimeout(run, delayMs);
    });
  }
  async function handleScreenshot() {
    if (!userData || !pageRef.current || isScreenshotting) return;
    const root = document.documentElement;
    const { default: html2canvas } = await import('html2canvas');
    const fileName = getScreenshotFileName();
    const hadAnimationsDisabled = root.classList.contains("animations-off");
    const hadScreenshotMode = root.classList.contains("screenshot-mode");
    try {
      root.classList.add("animations-off");
      root.classList.add("screenshot-mode");
      setIsScreenshotting(true);
      await waitForStableFrame(260);
      const pageNode = pageRef.current;
      const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const captureWidth = Math.ceil(pageNode.getBoundingClientRect().width || viewportWidth);
      const captureHeight = Math.ceil(pageNode.scrollHeight);
      const canvas = await html2canvas(pageNode, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
        foreignObjectRendering: true,
        removeContainer: true,
        ignoreElements: (element) => element instanceof HTMLElement && element.dataset.screenshotIgnore === "true",
        width: captureWidth,
        height: captureHeight,
        windowWidth: viewportWidth,
        windowHeight: Math.max(window.innerHeight || 0, 1),
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDocument) => {
          const clonedRoot = clonedDocument.documentElement;
          clonedRoot.classList.add("animations-off", "screenshot-mode");
          clonedRoot.classList.toggle("dark", root.classList.contains("dark"));
          clonedDocument.body.style.margin = "0";
          clonedDocument.body.style.minHeight = `${captureHeight}px`;
        }
      });
      const dataUrl = canvas.toDataURL("image/png");
      downloadDataUrl(dataUrl, fileName);
    } catch (error) {
      console.error("Screenshot failed:", error);
      window.alert("截图失败：" + (error instanceof Error ? error.message : "请刷新后重试。"));
    } finally {
      root.classList.toggle("animations-off", hadAnimationsDisabled);
      root.classList.toggle("screenshot-mode", hadScreenshotMode);
      window.setTimeout(() => setIsScreenshotting(false), 80);
    }
  }
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "relative flex min-h-screen items-center justify-center overflow-hidden bg-apple-gray1 transition-colors duration-500 dark:bg-apple-dark1", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.12),transparent_22%),radial-gradient(circle_at_top_right,rgba(28,176,246,0.1),transparent_20%),linear-gradient(180deg,#f8f8fb_0%,#f2f4f7_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.1),transparent_20%),radial-gradient(circle_at_top_right,rgba(28,176,246,0.1),transparent_20%),linear-gradient(180deg,#141416_0%,#1c1c1e_100%)]" }),
      /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-center gap-5 px-6", children: [
        /* @__PURE__ */ jsx(AppIcon, { className: "mb-3 h-32 w-32 animate-bounce sm:h-44 sm:w-44" }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-apple-dark1 dark:text-white sm:text-2xl", children: "正在获取学习数据..." }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-apple-gray6 dark:text-apple-dark6", children: "界面会在几秒内准备好" })
        ] })
      ] })
    ] });
  }
  if (!userData) {
    return /* @__PURE__ */ jsxs("div", { className: "relative flex min-h-screen items-center justify-center overflow-hidden bg-apple-gray1 transition-colors duration-500 dark:bg-apple-dark1", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.12),transparent_22%),radial-gradient(circle_at_top_right,rgba(28,176,246,0.1),transparent_20%),linear-gradient(180deg,#f8f8fb_0%,#f2f4f7_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.1),transparent_20%),radial-gradient(circle_at_top_right,rgba(28,176,246,0.1),transparent_20%),linear-gradient(180deg,#141416_0%,#1c1c1e_100%)]" }),
      /* @__PURE__ */ jsxs("div", { className: "relative text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[30px] border border-white/80 bg-white/88 shadow-[0_14px_32px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/8", children: /* @__PURE__ */ jsx("span", { className: "text-5xl", children: "📊" }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight text-apple-dark1 dark:text-white", children: loadError ? "学习数据加载失败" : "还没有可展示的数据" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-apple-gray6 dark:text-apple-dark6", children: loadError || "先回到首页输入用户名，再生成学习面板。" }),
        username ? /* @__PURE__ */ jsxs("p", { className: "mt-2 text-xs text-apple-gray6/80 dark:text-apple-dark6/80", children: [
          "@",
          username
        ] }) : null,
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/",
            className: "mt-6 inline-flex items-center gap-2 rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(17,24,39,0.14)] transition-colors duration-200 dark:bg-white dark:text-apple-dark1",
            children: "返回首页"
          }
        )
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { ref: pageRef, className: "relative min-h-screen overflow-x-hidden bg-apple-gray1 transition-colors duration-500 dark:bg-apple-dark1", children: [
    /* @__PURE__ */ jsx("div", { className: "screenshot-soft-glow pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.12),transparent_24%),radial-gradient(circle_at_top_right,rgba(28,176,246,0.1),transparent_22%),linear-gradient(180deg,#fbfbfd_0%,rgba(245,245,247,0.72)_44%,transparent_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(88,204,2,0.1),transparent_22%),radial-gradient(circle_at_top_right,rgba(28,176,246,0.1),transparent_22%),linear-gradient(180deg,rgba(28,28,30,0.94)_0%,rgba(28,28,30,0.72)_42%,transparent_100%)]" }),
    isScreenshotting ? /* @__PURE__ */ jsx("div", { "data-screenshot-ignore": "true", className: "fixed right-6 top-24 z-[70] rounded-[24px] border border-black/5 bg-white px-5 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[rgba(28,28,30,0.96)]", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full border-4 border-black/8 border-t-[#58cc02] animate-spin dark:border-white/12 dark:border-t-[#58cc02]" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-apple-dark1 dark:text-white", children: "正在生成截图..." }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-apple-gray6 dark:text-apple-dark6", children: "已锁定颜色与布局" })
      ] })
    ] }) }) : null,
    /* @__PURE__ */ jsx(
      Navbar,
      {
        username,
        themeMode,
        resolvedTheme,
        animationsEnabled,
        isScreenshotting,
        onThemeChange: handleThemeChange,
        onToggleAnimations: toggleAnimations,
        onScreenshot: handleScreenshot,
        onLogout: () => {
          sessionStorage.removeItem("duoeye_username");
          sessionStorage.removeItem("duoeye_userdata");
          window.location.href = "/";
        }
      }
    ),
    /* @__PURE__ */ jsx("main", { ref: contentRef, className: "relative mx-auto max-w-[1560px] px-4 pb-10 pt-40 sm:px-6 sm:pt-32 lg:px-8 lg:pt-32", children: /* @__PURE__ */ jsx(
      DashboardSections,
      {
        userData,
        isLoaded,
        selectedMonthlyYear,
        monthlyViewMode,
        weeklyXpRangeMode,
        weeklyTimeRangeMode,
        onSelectMonthlyYear: (year) => {
          setSelectedMonthlyYear(year);
          setMonthlyViewMode("year");
        },
        onSelectRollingMonths: () => setMonthlyViewMode("rolling12"),
        onSelectWeeklyXpRangeMode: setWeeklyXpRangeMode,
        onSelectWeeklyTimeRangeMode: setWeeklyTimeRangeMode
      }
    ) }),
    /* @__PURE__ */ jsx("footer", { className: "render-isolate screenshot-solid-panel screenshot-disable-blur relative z-10 border-t border-black/5 bg-white/78 py-12 dark:border-white/10 dark:bg-[rgba(20,20,22,0.82)]", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full max-w-[1560px] flex-col items-center overflow-visible px-4 text-center sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 overflow-visible py-1", children: [
        /* @__PURE__ */ jsx(AppIcon, { className: "h-11 w-11 shrink-0" }),
        /* @__PURE__ */ jsx(DuoWordmark, { size: "xs", className: "shrink-0 overflow-visible" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 w-full max-w-[760px] text-sm leading-7 text-apple-gray6 dark:text-apple-dark6 sm:whitespace-nowrap", children: "多邻国学习数据可视化工具。输入用户名，快速生成和首页一致风格的数据仪表盘。" }),
      /* @__PURE__ */ jsxs("p", { className: "mt-6 text-xs text-apple-gray6/80 dark:text-apple-dark6/80", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " DuoEye · 非官方第三方工具"
      ] })
    ] }) })
  ] });
}

const $$Dashboard = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "DuoEye - \u4EEA\u8868\u76D8" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DuoDashApp", DuoDashApp, { "client:load": true, "client:component-hydration": "load", "client:component-path": "E:/duoeye/src/components/DuoDashApp", "client:component-export": "default" })} ` })}`;
}, "E:/duoeye/src/pages/dashboard.astro", void 0);

const $$file = "E:/duoeye/src/pages/dashboard.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
