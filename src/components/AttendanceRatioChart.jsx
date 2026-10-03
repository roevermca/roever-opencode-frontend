import React from "react";
import { CheckCircle2, XCircle, Users } from "lucide-react";
import { formatPercentage } from "../utils/formatters";

/**
 * Lightweight, high-speed MUI-style Analytics Card with SVG Donut Progress.
 * 100% responsive, zero external chart library overhead.
 */
const AttendanceRatioChart = ({
  title = "Today's Attendance Ratio",
  total = 0,
  present = 0,
  absent = 0,
  percentage = 0,
  loading = false,
}) => {
  const presentPct = total > 0 ? Math.round((present / total) * 100) : 0;
  const absentPct = total > 0 ? Math.max(0, 100 - presentPct) : 0;

  // SVG Donut calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (presentPct / 100) * circumference;

  const isHealthy = presentPct >= 75;

  if (loading) {
    return (
      <div className="h-[340px] bg-white rounded-2xl border border-slate-200/80 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] animate-pulse flex flex-col justify-between">
        <div className="h-5 w-48 bg-slate-200 rounded-md" />
        <div className="w-36 h-36 rounded-full bg-slate-200 mx-auto my-auto" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-12 bg-slate-100 rounded-xl" />
          <div className="h-12 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* MUI Card Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time daily turnout ratio
          </p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-colors ${
            isHealthy
              ? "bg-emerald-50 text-emerald-700 border-emerald-200/70"
              : "bg-rose-50 text-rose-700 border-rose-200/70"
          }`}
        >
          {isHealthy ? "Target Met (≥75%)" : "Below Target (<75%)"}
        </span>
      </div>

      {/* Donut & Statistics Body */}
      <div className="p-5 sm:p-6 flex flex-col items-center justify-center flex-1">
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="14"
              className="text-slate-100"
              fill="transparent"
            />
            {/* Absent Arc (Full Track fallback) */}
            {total > 0 && absentPct > 0 && (
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="currentColor"
                strokeWidth="14"
                className="text-rose-500 transition-all duration-1000 ease-out"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={0}
              />
            )}
            {/* Present Arc */}
            {total > 0 && (
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="currentColor"
                strokeWidth="14"
                strokeLinecap="round"
                className="text-emerald-500 transition-all duration-1000 ease-out"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            )}
          </svg>

          {/* Centered KPI inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {total > 0 ? `${presentPct}%` : "0%"}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Present Rate
            </span>
          </div>
        </div>

        {/* MUI-styled Metrics Footer */}
        <div className="grid grid-cols-2 gap-3 w-full mt-6">
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                  Present
                </p>
                <p className="text-sm font-bold text-emerald-950">
                  {present.toLocaleString()} <span className="text-xs font-medium text-emerald-700">({presentPct}%)</span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <XCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider">
                  Absent
                </p>
                <p className="text-sm font-bold text-rose-950">
                  {absent.toLocaleString()} <span className="text-xs font-medium text-rose-700">({absentPct}%)</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 w-full flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            Total Turnout Records
          </span>
          <span className="font-bold text-slate-700">{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceRatioChart;
