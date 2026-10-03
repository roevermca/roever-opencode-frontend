import React from "react";
import { CheckCircle2, XCircle, RotateCcw, Send } from "lucide-react";
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
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-5 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Metrics summary */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3 items-center">
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-center flex-1 sm:flex-initial min-w-[90px]">
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total
            </span>
            <span className="text-xl sm:text-2xl font-bold text-slate-800">
              {total}
            </span>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 text-center flex-1 sm:flex-initial min-w-[90px]">
            <span className="block text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Present
            </span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-700">
              {presentCount}
            </span>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-lg px-4 py-2.5 text-center flex-1 sm:flex-initial min-w-[90px]">
            <span className="block text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Absent
            </span>
            <span className="text-xl sm:text-2xl font-bold text-rose-700">
              {absentCount}
            </span>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 sm:px-4 py-2.5 text-center flex-1 sm:flex-initial min-w-[76px]">
            <span className="block text-xs font-semibold text-purple-700 uppercase tracking-wider">
              On-Duty
            </span>
            <span className="text-xl sm:text-2xl font-bold text-purple-800">
              {odCount || 0}
            </span>
          </div>

          {lateCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 sm:px-4 py-2.5 text-center flex-1 sm:flex-initial min-w-[76px]">
              <span className="block text-xs font-semibold text-amber-700 uppercase tracking-wider">
                Late
              </span>
              <span className="text-xl sm:text-2xl font-bold text-amber-800">
                {lateCount}
              </span>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 text-center flex-1 sm:flex-initial min-w-[90px]">
            <span className="block text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Attendance
            </span>
            <span className="text-xl sm:text-2xl font-bold text-blue-700">
              {formatPercentage(percentage)}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <button
            type="button"
            onClick={onMarkAllPresent}
            disabled={isSubmitted || disabled || total === 0}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-emerald-300 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/70 hover:border-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Mark All Present
          </button>

          <button
            type="button"
            onClick={onMarkAllAbsent}
            disabled={isSubmitted || disabled || total === 0}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-rose-300 text-rose-700 bg-rose-50/50 hover:bg-rose-100/70 hover:border-rose-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XCircle className="w-4 h-4 text-rose-600" />
            Mark All Absent
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={isSubmitted || disabled || total === 0}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Reset
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitted || disabled || total === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
            Submit Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;
