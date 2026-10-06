import React from "react";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Send,
  Users,
  Award,
  Clock,
  Percent,
} from "lucide-react";
import { formatPercentage } from "../utils/formatters";

const AttendanceSummary = ({
  total,
  presentCount,
  absentCount,
  odCount = 0,
  lateCount = 0,
  percentage,
  onMarkAllPresent,
  onMarkAllAbsent,
  onReset,
  onSubmit,
  isSubmitted = false,
  disabled = false,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 mb-6 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-3 flex-1">
          {/* 1. Total */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 rounded-xl p-3 flex items-center justify-between shadow-2xs">
            <div>
              <span className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-none mt-1">
                {total}
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>

          {/* 2. Present */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-900/60 rounded-xl p-3 flex items-center justify-between shadow-2xs">
            <div>
              <span className="block text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                Present
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-800 dark:text-emerald-200 leading-none mt-1">
                {presentCount}
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-200/70 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          {/* 3. Absent */}
          <div className="bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/90 dark:border-rose-900/60 rounded-xl p-3 flex items-center justify-between shadow-2xs">
            <div>
              <span className="block text-[11px] font-extrabold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                Absent
              </span>
              <span className="text-xl sm:text-2xl font-black text-rose-800 dark:text-rose-200 leading-none mt-1">
                {absentCount}
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-rose-200/70 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 flex items-center justify-center">
              <XCircle className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          {/* 4. On-Duty (OD) */}
          <div className="bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/90 dark:border-purple-900/60 rounded-xl p-3 flex items-center justify-between shadow-2xs">
            <div>
              <span className="block text-[11px] font-extrabold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                On-Duty
              </span>
              <span className="text-xl sm:text-2xl font-black text-purple-800 dark:text-purple-200 leading-none mt-1">
                {odCount}
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-200/70 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 flex items-center justify-center">
              <Award className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          {/* 5. Attendance Ratio */}
          <div className="col-span-2 sm:col-span-1 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/90 dark:border-blue-900/60 rounded-xl p-3 flex items-center justify-between shadow-2xs">
            <div>
              <span className="block text-[11px] font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                Ratio
              </span>
              <span className="text-xl sm:text-2xl font-black text-blue-800 dark:text-blue-200 leading-none mt-1">
                {formatPercentage(percentage)}
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-200/70 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 flex items-center justify-center">
              <Percent className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onMarkAllPresent}
            disabled={isSubmitted || disabled || total === 0}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
            All Present
          </button>

          <button
            type="button"
            onClick={onMarkAllAbsent}
            disabled={isSubmitted || disabled || total === 0}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 stroke-[2.5]" />
            All Absent
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={isSubmitted || disabled || total === 0}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
            title="Reset Attendance"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitted || disabled || total === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-extrabold rounded-xl text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            Submit Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AttendanceSummary);
