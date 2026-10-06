import React from "react";
import { Layers, Lock } from "lucide-react";
import {
  STUDENT_DEPARTMENTS,
  STUDENT_YEARS,
  STUDENT_SECTIONS,
  getCoursesForDepartment,
  isPgCourse,
} from "../data/students";
import { parseYear, formatYear } from "../utils/formatters";
import { ATTENDANCE_PERIODS } from "../data/attendance";

const AttendanceFilters = ({
  filters,
  onFilterChange,
  disabled = false,
  isStaff = false,
  staffCourse = "",
  staffDept = "",
  departments = [],
  courses = [],
}) => {
  const departmentOptions =
    departments.length > 0
      ? departments
          .filter((d) => d.name !== "Administration" && d.code !== "ADMIN")
          .map((d) => d.name)
      : STUDENT_DEPARTMENTS;

  // Cascading courses for the selected department
  const availableCourses = React.useMemo(() => {
    if (!filters.department) return [];
    const matchedDept = departments.find(
      (d) =>
        d.name?.toLowerCase() === filters.department.toLowerCase() ||
        d.id === filters.department ||
        d.code?.toLowerCase() === filters.department.toLowerCase()
    );
    const backendFiltered = courses.filter((c) => {
      if (matchedDept && c.departmentId === matchedDept.id) return true;
      if (c.departmentId?.toLowerCase() === filters.department.toLowerCase()) return true;
      return false;
    });
    if (backendFiltered.length > 0) {
      return backendFiltered.map((c) => c.name);
    }
    return getCoursesForDepartment(filters.department);
  }, [filters.department, departments, courses]);

  const effectiveCourse = isStaff ? staffCourse || filters.course : filters.course;
  const isPg = isPgCourse(effectiveCourse);
  const yearOptions = isPg
    ? ["1st Year", "2nd Year"]
    : ["1st Year", "2nd Year", "3rd Year"];

  const handleChange = (field, value) => {
    if (field === "department") {
      const newCourses = getCoursesForDepartment(value);
      const nextCourse = newCourses.length > 0 ? newCourses[0] : "";
      const isNextPg = isPgCourse(nextCourse);
      const currentYear = parseYear(filters.year);

      let nextYear = filters.year;
      if (isNextPg && currentYear > 2) {
        nextYear = "1st Year";
      }

      onFilterChange({
        ...filters,
        department: value,
        course: nextCourse,
        year: nextYear,
      });
    } else if (field === "course") {
      const isCoursePg = isPgCourse(value);
      const currentYear = parseYear(filters.year);

      let nextYear = filters.year;
      if (isCoursePg && currentYear > 2) {
        nextYear = "1st Year";
      }

      onFilterChange({
        ...filters,
        course: value,
        year: nextYear,
      });
    } else {
      onFilterChange({
        ...filters,
        [field]: value,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-200/90 dark:border-slate-800 mb-6 overflow-hidden transition-colors">
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">
            Select Class & Session
          </h2>
        </div>
        {isStaff && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            <Lock className="w-3.5 h-3.5" />
            Staff Assigned Scope
          </span>
        )}
      </div>

      {/* Filter Form Controls */}
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Department */}
          <div className="lg:col-span-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              value={filters.department || ""}
              disabled={disabled || isStaff}
              onChange={(e) => handleChange("department", e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-800 dark:text-slate-100 shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
            >
              <option value="">Choose Department</option>
              {departmentOptions.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {isStaff && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Assigned department locked to staff profile.
              </p>
            )}
          </div>

          {/* Degree / Course */}
          <div className="lg:col-span-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Degree / Course <span className="text-red-500">*</span>
            </label>
            <select
              value={filters.course || ""}
              disabled={disabled || isStaff || !filters.department}
              onChange={(e) => handleChange("course", e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-800 dark:text-slate-100 shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
            >
              <option value="">
                {filters.department
                  ? "-- Choose Course (e.g. BCA, MCA) --"
                  : "-- Select Department First --"}
              </option>
              {availableCourses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {isStaff ? (
              <p className="mt-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                Assigned course: {staffCourse || filters.course} (Access restricted)
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Cascades based on selected department.
              </p>
            )}
          </div>

          {/* Academic Year */}
          <div className="sm:col-span-1 lg:col-span-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <select
              value={formatYear(filters.year) || filters.year || "1st Year"}
              disabled={disabled}
              onChange={(e) => handleChange("year", e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-800 dark:text-slate-100 shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
            >
              {yearOptions.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div className="sm:col-span-1 lg:col-span-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Section <span className="text-red-500">*</span>
            </label>
            <select
              value={filters.section || ""}
              disabled={disabled}
              onChange={(e) => handleChange("section", e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-800 dark:text-slate-100 shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
            >
              {STUDENT_SECTIONS.map((sec) => (
                <option key={sec} value={sec}>
                  Section {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="sm:col-span-1 lg:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Attendance Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={filters.date || ""}
              disabled={disabled}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-800 dark:text-slate-100 shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
            />
          </div>

          {/* Period - EXACTLY 5 periods */}
          <div className="sm:col-span-1 lg:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Class Period <span className="text-red-500">*</span>
            </label>
            <select
              value={filters.period || ""}
              disabled={disabled}
              onChange={(e) => handleChange("period", e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-800 dark:text-slate-100 shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
            >
              {ATTENDANCE_PERIODS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceFilters;
