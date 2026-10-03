import React from "react";
import { Check, X, Award, Clock, UserX, Loader2, CheckCheck } from "lucide-react";
import EmptyState from "./EmptyState";

const AttendanceTable = ({
  students = [],
  attendanceMap = {},
  onToggleStatus,
  onBatchSetStatus,
  isSubmitted = false,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-slate-200/80 py-16 text-center flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">
          Loading class roster...
        </p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-slate-200/80">
        <EmptyState
          icon={UserX}
          title="No students found for this class"
          message="No active students match the selected department, year, and section. Please verify your selection."
        />
      </div>
    );
  }

  const handleSetAll = (status) => {
    if (isSubmitted || !onBatchSetStatus) return;
    onBatchSetStatus(status);
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-slate-200/80 overflow-hidden">
      {/* Quick Batch Actions Toolbar */}
      {!isSubmitted && (
        <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-slate-600">
            Class Roster: <strong className="text-slate-900">{students.length}</strong> students
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium mr-1 hidden sm:inline">Quick Batch:</span>
            <button
              type="button"
              onClick={() => handleSetAll("Present")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold border border-emerald-200/80 transition-colors shadow-2xs"
            >
              <Check className="w-3 h-3 stroke-[2.5]" />
              All Present
            </button>
            <button
              type="button"
              onClick={() => handleSetAll("Absent")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold border border-rose-200/80 transition-colors shadow-2xs"
            >
              <X className="w-3 h-3 stroke-[2.5]" />
              All Absent
            </button>
            <button
              type="button"
              onClick={() => handleSetAll("On-Duty")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold border border-purple-200/80 transition-colors shadow-2xs"
            >
              <Award className="w-3 h-3 stroke-[2.5]" />
              All OD
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th scope="col" className="pl-5 pr-2 py-3.5 w-12 text-center">
                #
              </th>
              <th scope="col" className="px-4 py-3.5 w-36">
                Roll Number
              </th>
              <th scope="col" className="px-4 py-3.5">
                Student Name
              </th>
              <th scope="col" className="pl-4 pr-5 py-3.5 text-right min-w-[280px]">
                Attendance Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student, index) => {
              const currentStatus = attendanceMap[student.id] || "Present";
              const isPresent = currentStatus === "Present";
              const isAbsent = currentStatus === "Absent";
              const isOD = currentStatus === "On-Duty" || currentStatus === "OD";
              const isLate = currentStatus === "Late";

              return (
                <tr
                  key={student.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="pl-5 pr-2 py-3 text-center text-xs font-medium text-slate-400">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900 text-xs sm:text-sm">
                    {student.rollNo}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                      {student.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[240px]">
                      {student.email}
                    </div>
                  </td>
                  <td className="pl-4 pr-5 py-3 text-right">
                    <div className="inline-flex rounded-xl shadow-2xs border border-slate-200/80 p-0.5 bg-slate-100/70">
                      {/* 1. Present */}
                      <button
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => onToggleStatus(student.id, "Present")}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isPresent
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "text-slate-600 hover:text-emerald-700 hover:bg-white/80"
                        } disabled:cursor-not-allowed`}
                        title="Mark Present"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        Present
                      </button>

                      {/* 2. Absent */}
                      <button
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => onToggleStatus(student.id, "Absent")}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isAbsent
                            ? "bg-rose-600 text-white shadow-xs"
                            : "text-slate-600 hover:text-rose-700 hover:bg-white/80"
                        } disabled:cursor-not-allowed`}
                        title="Mark Absent"
                      >
                        <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        Absent
                      </button>

                      {/* 3. On-Duty (OD) */}
                      <button
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => onToggleStatus(student.id, "On-Duty")}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isOD
                            ? "bg-purple-600 text-white shadow-xs"
                            : "text-slate-600 hover:text-purple-700 hover:bg-white/80"
                        } disabled:cursor-not-allowed`}
                        title="Mark On-Duty (OD for sports, symposium, NSS/NCC)"
                      >
                        <Award className="w-3.5 h-3.5 stroke-[2.5]" />
                        OD
                      </button>

                      {/* 4. Late */}
                      <button
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => onToggleStatus(student.id, "Late")}
                        className={`inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isLate
                            ? "bg-amber-500 text-slate-950 shadow-xs"
                            : "text-slate-600 hover:text-amber-700 hover:bg-white/80"
                        } disabled:cursor-not-allowed`}
                        title="Mark Late"
                      >
                        <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                        Late
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
