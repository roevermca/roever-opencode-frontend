import React from "react";
import { Lock, Clock, User, CheckCheck, AlertCircle } from "lucide-react";

const AttendanceStatus = ({
  isSubmitted,
  submittedAt,
  submittedBy,
}) => {
  if (!isSubmitted) {
    return (
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-900">
            Status: <span className="font-bold text-amber-950">In Progress (Unsubmitted)</span> — Verify student attendance before final submission.
          </p>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          Editable
        </span>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 sm:p-5 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-2xs">
            Submitted
          </span>
          <span className="font-bold text-emerald-900 text-sm flex items-center gap-1">
            <CheckCheck className="w-4 h-4 text-emerald-600 inline" />
            Attendance Locked
          </span>
        </div>
        <p className="text-xs sm:text-sm text-emerald-800">
          Attendance for this class period has been permanently recorded and cannot be edited by staff.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-emerald-900 pt-2 md:pt-0 border-t md:border-t-0 border-emerald-200">
        {submittedAt && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            <span>Marked: <strong className="text-emerald-950">{submittedAt}</strong></span>
          </div>
        )}
        {submittedBy && (
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-700" />
            <span>Marked By: <strong className="text-emerald-950">{submittedBy}</strong></span>
          </div>
        )}
        <div className="flex items-center gap-1 text-red-600 font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>Read-only</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceStatus;
