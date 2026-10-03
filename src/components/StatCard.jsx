import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const colorStyles = {
  primary: {
    iconBg: "bg-blue-50 border-blue-100/80 text-blue-600",
    barBg: "bg-blue-600",
  },
  info: {
    iconBg: "bg-indigo-50 border-indigo-100/80 text-indigo-600",
    barBg: "bg-indigo-600",
  },
  success: {
    iconBg: "bg-emerald-50 border-emerald-100/80 text-emerald-600",
    barBg: "bg-emerald-600",
  },
  warning: {
    iconBg: "bg-amber-50 border-amber-100/80 text-amber-600",
    barBg: "bg-amber-600",
  },
  danger: {
    iconBg: "bg-rose-50 border-rose-100/80 text-rose-600",
    barBg: "bg-rose-600",
  },
};

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  color = "primary",
  trend = "up", // 'up' | 'down' | 'neutral'
  trendLabel = "",
  loading = false,
}) => {
  const cStyle = colorStyles[color] || colorStyles.primary;

  if (loading) {
    return (
      <div className="h-[156px] bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] animate-pulse flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-24 bg-slate-200 rounded-md" />
          <div className="w-10 h-10 bg-slate-200 rounded-xl" />
        </div>
        <div>
          <div className="h-7 w-20 bg-slate-200 rounded-md mb-2" />
          <div className="h-3 w-32 bg-slate-100 rounded-md" />
        </div>
      </div>
    );
  }

  // Parse trend from change string if not explicitly given
  const isUp = trend === "up" || (change && change.includes("+"));
  const isDown = trend === "down" || (change && change.includes("-") && !change.includes("0%"));

  return (
    <div className="group relative h-full bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between overflow-hidden">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
          {title}
        </span>
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${cStyle.iconBg}`}
        >
          {Icon && <Icon size={20} strokeWidth={2.2} />}
        </div>
      </div>

      {/* Main KPI Value */}
      <div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          {value}
        </div>

        {/* MUI-style Trend Pill or Subtext */}
        {change && (
          <div className="flex items-center flex-wrap gap-1.5 text-xs">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold ${
                isUp
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                  : isDown
                  ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {isUp && <TrendingUp className="w-3 h-3" />}
              {isDown && <TrendingDown className="w-3 h-3" />}
              {!isUp && !isDown && <Minus className="w-3 h-3" />}
              {change}
            </span>
            {trendLabel && (
              <span className="text-slate-400 font-medium">{trendLabel}</span>
            )}
          </div>
        )}
      </div>

      {/* Subtle bottom accent line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${cStyle.barBg}`}
      />
    </div>
  );
};

export default StatCard;
