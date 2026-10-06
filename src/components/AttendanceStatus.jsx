import React from "react";
import { Lock, Clock, User, CheckCheck, AlertCircle } from "lucide-react";

const AttendanceStatus = ({
  isSubmitted,
  submittedAt,
  submittedBy,
}) => {
  if (!isSubmitted) {
    return (
      <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-900/60 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-sm text-amber-900 dark:text-amber-200">
            Status: <span className="font-extrabold text-amber-950 dark:text-amber-100">In Progress (Unsubmitted)</span> — Verify student attendance before final submission.
          </p>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
          Editable
        </span>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/90 dark:border-emerald-900/60 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 transition-colors">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-2xs">
            Submitted
          </span>
          <span className="font-extrabold text-emerald-900 dark:text-emerald-200 text-sm flex items-center gap-1">
            <CheckCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 inline" />
            Attendance Locked
          </span>
        </div>
        <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
          Attendance for this class period has been permanently recorded and cannot be edited by staff.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 pt-2 md:pt-0 border-t md:border-t-0 border-emerald-200 dark:border-emerald-800">
        {submittedAt && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>Marked: <strong className="text-emerald-950 dark:text-emerald-100">{submittedAt}</strong></span>
          </div>
        )}
        {submittedBy && (
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>Marked By: <strong className="text-emerald-950 dark:text-emerald-100">{submittedBy}</strong></span>
          </div>
        )}
        <div className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>Read-only</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceStatus;
