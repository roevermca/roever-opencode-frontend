import React from "react";
import { RotateCcw, Clock, FileText } from "lucide-react";
import {
  STUDENT_DEPARTMENTS,
  STUDENT_YEARS,
  STUDENT_SECTIONS,
} from "../data/students";
import { ATTENDANCE_PERIODS } from "../data/attendance";
import EmptyState from "./EmptyState";

const AttendanceHistory = ({
  history = [],
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const hasActiveFilters =
    Boolean(filters.date) ||
    Boolean(filters.department) ||
    Boolean(filters.year) ||
    Boolean(filters.section) ||
    Boolean(filters.period);

  const handleFieldChange = (field, val) => {
    onFilterChange({ ...filters, [field]: val });
  };

  return (
    <div>
      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
          {/* Date Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Filter Date
            </label>
            <input
              type="date"
              value={filters.date || ""}
              onChange={(e) => handleFieldChange("date", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Department
            </label>
            <select
              value={filters.department || ""}
              onChange={(e) => handleFieldChange("department", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {STUDENT_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Year
            </label>
            <select
              value={filters.year || ""}
              onChange={(e) => handleFieldChange("year", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Years</option>
              {STUDENT_YEARS.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Section
            </label>
            <select
              value={filters.section || ""}
              onChange={(e) => handleFieldChange("section", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Sections</option>
              {STUDENT_SECTIONS.map((sec) => (
                <option key={sec} value={sec}>
                  Section {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Period Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Period
            </label>
            <select
              value={filters.period || ""}
              onChange={(e) => handleFieldChange("period", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Periods</option>
              {ATTENDANCE_PERIODS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={onResetFilters}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors h-[38px]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                Reset
              </button>
            ) : (
              <div className="h-[38px] hidden lg:block" />
            )}
          </div>
        </div>
      </div>

      {/* History Records Table */}
      {history.length === 0 ? (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200">
          <EmptyState
            icon={FileText}
            title="No attendance records found"
            message="No records match your selected date, class, or period filters."
            action={
              hasActiveFilters ? (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-blue-600 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  Clear Filters
                </button>
              ) : null
            }
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="pl-5 pr-3 py-3.5">
                    Date & Period
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Student
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Class & Section
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="pl-4 pr-5 py-3.5 text-right">
                    Marked By & Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="pl-5 pr-3 py-3">
                      <div className="font-semibold text-slate-800">
                        {record.date}
                      </div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 text-[11px] font-semibold bg-blue-100 text-blue-800 rounded-md">
                        {record.period}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">
                        {record.studentName}
                      </div>
                      <div className="text-xs text-slate-400">
                        {record.studentRollNo}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">
                        {record.department}
                      </div>
                      <div className="text-xs text-slate-400">
                        {record.year} (Sec {record.section})
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          record.status === "Present"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-rose-100 text-rose-800 border border-rose-200"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="pl-4 pr-5 py-3 text-right">
                      <div className="font-medium text-slate-800">
                        {record.markedBy}
                      </div>
                      <div className="inline-flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{record.markedTime}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;
