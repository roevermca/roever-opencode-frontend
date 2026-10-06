import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Check,
  X,
  Award,
  Clock,
  UserX,
  Loader2,
  LayoutList,
  Table as TableIcon,
  Search,
  Sparkles,
  Keyboard,
} from "lucide-react";
import EmptyState from "./EmptyState";

// -------------------------------------------------------------
// 1. Desktop / Lab PC High-Density Table Row
// -------------------------------------------------------------
const AttendanceRow = React.memo(
  ({
    student,
    index,
    currentStatus,
    isSubmitted,
    onToggleStatus,
    isFocused,
    onRowFocus,
  }) => {
    const isPresent = currentStatus === "Present";
    const isAbsent = currentStatus === "Absent";
    const isOD = currentStatus === "On-Duty" || currentStatus === "OD";
    const isLate = currentStatus === "Late";

    return (
      <tr
        onClick={() => onRowFocus && onRowFocus(index)}
        className={`transition-colors cursor-pointer ${
          isFocused
            ? "bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-inset ring-blue-500/40"
            : isAbsent
            ? "bg-rose-50/30 dark:bg-rose-950/20 hover:bg-rose-50/50 dark:hover:bg-rose-950/40"
            : "hover:bg-slate-50/80 dark:hover:bg-slate-800/60"
        }`}
      >
        <td className="pl-5 pr-2 py-3 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
          {index + 1}
        </td>
        <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
          {student.rollNo}
        </td>
        <td className="px-4 py-3">
          <div className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm flex items-center gap-1.5">
            <span>{student.name}</span>
            {isAbsent && (
              <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                Absent
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[240px]">
            {student.email || student.department || ""}
          </div>
        </td>
        <td className="pl-4 pr-5 py-3 text-right">
          <div className="inline-flex rounded-xl shadow-2xs border border-slate-200/90 dark:border-slate-700/80 p-0.5 bg-slate-100/80 dark:bg-slate-800/90">
            {/* 1. Present */}
            <button
              type="button"
              disabled={isSubmitted}
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(student.id, "Present");
              }}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isPresent
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-700"
              } disabled:cursor-not-allowed`}
              title="Mark Present [P]"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              Present
            </button>

            {/* 2. Absent */}
            <button
              type="button"
              disabled={isSubmitted}
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(student.id, "Absent");
              }}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isAbsent
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-700"
              } disabled:cursor-not-allowed`}
              title="Mark Absent [A]"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
              Absent
            </button>

            {/* 3. On-Duty (OD) */}
            <button
              type="button"
              disabled={isSubmitted}
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(student.id, "On-Duty");
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isOD
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-white dark:hover:bg-slate-700"
              } disabled:cursor-not-allowed`}
              title="Mark On-Duty [O]"
            >
              <Award className="w-3.5 h-3.5 stroke-[2.5]" />
              OD
            </button>

            {/* 4. Late */}
            <button
              type="button"
              disabled={isSubmitted}
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(student.id, "Late");
              }}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isLate
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-white dark:hover:bg-slate-700"
              } disabled:cursor-not-allowed`}
              title="Mark Late [L]"
            >
              <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
              Late
            </button>
          </div>
        </td>
      </tr>
    );
  },
  (prev, next) =>
    prev.currentStatus === next.currentStatus &&
    prev.isSubmitted === next.isSubmitted &&
    prev.student.id === next.student.id &&
    prev.index === next.index &&
    prev.isFocused === next.isFocused
);

AttendanceRow.displayName = "AttendanceRow";

// -------------------------------------------------------------
// 2. Mobile Thumb-Friendly Student Card
// -------------------------------------------------------------
const AttendanceStudentCard = React.memo(
  ({ student, index, currentStatus, isSubmitted, onToggleStatus }) => {
    const isPresent = currentStatus === "Present";
    const isAbsent = currentStatus === "Absent";
    const isOD = currentStatus === "On-Duty" || currentStatus === "OD";
    const isLate = currentStatus === "Late";

    // Card border accent based on status
    const cardBorder = isPresent
      ? "border-emerald-200/90 dark:border-emerald-900/60 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.12)]"
      : isAbsent
      ? "border-rose-200/90 dark:border-rose-900/60 shadow-[0_2px_8px_-2px_rgba(244,63,94,0.15)] bg-rose-50/20 dark:bg-rose-950/20"
      : isOD
      ? "border-purple-200/90 dark:border-purple-900/60 shadow-[0_2px_8px_-2px_rgba(168,85,247,0.12)]"
      : "border-slate-200/90 dark:border-slate-800 shadow-2xs";

    return (
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl border p-4 transition-all duration-150 ${cardBorder}`}
      >
        {/* Top Info: Index, Name, Roll No */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                isPresent
                  ? "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                  : isAbsent
                  ? "bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800"
                  : isOD
                  ? "bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {index + 1}
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm truncate leading-snug">
                {student.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {student.rollNo}
                </span>
                {student.department && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                    {student.department}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Current Status Pill */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase shrink-0 ${
              isPresent
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                : isAbsent
                ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                : isOD
                ? "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                : "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
            }`}
          >
            {isPresent && <Check className="w-3 h-3 stroke-[3]" />}
            {isAbsent && <X className="w-3 h-3 stroke-[3]" />}
            {isOD && <Award className="w-3 h-3 stroke-[3]" />}
            {isLate && <Clock className="w-3 h-3 stroke-[3]" />}
            {currentStatus}
          </span>
        </div>

        {/* 4 Thumb-Friendly Action Buttons (min 44px height for touch) */}
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70">
          {/* Present */}
          <button
            type="button"
            disabled={isSubmitted}
            onClick={() => onToggleStatus(student.id, "Present")}
            className={`min-h-[42px] flex items-center justify-center gap-1 rounded-lg text-xs font-extrabold transition-all active:scale-95 ${
              isPresent
                ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30"
                : "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-emerald-700 dark:hover:text-emerald-300"
            } disabled:cursor-not-allowed`}
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Present</span>
          </button>

          {/* Absent */}
          <button
            type="button"
            disabled={isSubmitted}
            onClick={() => onToggleStatus(student.id, "Absent")}
            className={`min-h-[42px] flex items-center justify-center gap-1 rounded-lg text-xs font-extrabold transition-all active:scale-95 ${
              isAbsent
                ? "bg-rose-600 text-white shadow-sm ring-2 ring-rose-600/30"
                : "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-rose-700 dark:hover:text-rose-300"
            } disabled:cursor-not-allowed`}
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Absent</span>
          </button>

          {/* OD */}
          <button
            type="button"
            disabled={isSubmitted}
            onClick={() => onToggleStatus(student.id, "On-Duty")}
            className={`min-h-[42px] flex items-center justify-center gap-1 rounded-lg text-xs font-extrabold transition-all active:scale-95 ${
              isOD
                ? "bg-purple-600 text-white shadow-sm ring-2 ring-purple-600/30"
                : "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-purple-700 dark:hover:text-purple-300"
            } disabled:cursor-not-allowed`}
          >
            <Award className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>OD</span>
          </button>

          {/* Late */}
          <button
            type="button"
            disabled={isSubmitted}
            onClick={() => onToggleStatus(student.id, "Late")}
            className={`min-h-[42px] flex items-center justify-center gap-1 rounded-lg text-xs font-extrabold transition-all active:scale-95 ${
              isLate
                ? "bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-500/30"
                : "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-amber-800 dark:hover:text-amber-300"
            } disabled:cursor-not-allowed`}
          >
            <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Late</span>
          </button>
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.currentStatus === next.currentStatus &&
    prev.isSubmitted === next.isSubmitted &&
    prev.student.id === next.student.id &&
    prev.index === next.index
);

AttendanceStudentCard.displayName = "AttendanceStudentCard";

// -------------------------------------------------------------
// 3. Main Attendance Table Container with Universal Features
// -------------------------------------------------------------
const AttendanceTable = ({
  students = [],
  attendanceMap = {},
  onToggleStatus,
  onBatchSetStatus,
  isSubmitted = false,
  loading = false,
}) => {
  // Mobile vs Table view mode (auto detect or user toggle)
  const [viewMode, setViewMode] = useState("auto"); // 'auto' | 'cards' | 'table'
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const containerRef = useRef(null);

  // Filter students by quick search term
  const filteredStudents = React.useMemo(() => {
    if (!searchTerm.trim()) return students;
    const term = searchTerm.toLowerCase().trim();
    return students.filter(
      (s) =>
        s.name?.toLowerCase().includes(term) ||
        s.rollNo?.toLowerCase().includes(term) ||
        s.email?.toLowerCase().includes(term)
    );
  }, [students, searchTerm]);

  // Keyboard navigation for Lab PCs (P, A, O, L, ArrowDown, ArrowUp)
  useEffect(() => {
    if (isSubmitted || filteredStudents.length === 0) return;

    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in a text input or textarea
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.tagName === "SELECT"
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const currentStudent = filteredStudents[focusedIndex];
      if (!currentStudent) return;

      if (key === "arrowdown" || key === "j") {
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, filteredStudents.length - 1));
      } else if (key === "arrowup" || key === "k") {
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      } else if (key === "p") {
        e.preventDefault();
        onToggleStatus(currentStudent.id, "Present");
        setFocusedIndex((prev) => Math.min(prev + 1, filteredStudents.length - 1));
      } else if (key === "a") {
        e.preventDefault();
        onToggleStatus(currentStudent.id, "Absent");
        setFocusedIndex((prev) => Math.min(prev + 1, filteredStudents.length - 1));
      } else if (key === "o") {
        e.preventDefault();
        onToggleStatus(currentStudent.id, "On-Duty");
        setFocusedIndex((prev) => Math.min(prev + 1, filteredStudents.length - 1));
      } else if (key === "l") {
        e.preventDefault();
        onToggleStatus(currentStudent.id, "Late");
        setFocusedIndex((prev) => Math.min(prev + 1, filteredStudents.length - 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, filteredStudents, isSubmitted, onToggleStatus]);

  if (loading && students.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-200/90 dark:border-slate-800 py-16 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          Loading class roster...
        </p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-200/90 dark:border-slate-800">
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
    <div
      ref={containerRef}
      className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-200/90 dark:border-slate-800 overflow-hidden transition-colors"
    >
      {/* Loading overlay line */}
      {loading && (
        <div className="absolute top-0 left-0 right-0 z-20 h-1 bg-blue-100 dark:bg-blue-950 overflow-hidden">
          <div className="h-full bg-blue-600 animate-pulse w-full" />
        </div>
      )}

      {/* Top Controls: Search, View Mode, Batch Buttons, Keyboard Guide */}
      <div className="px-4 sm:px-6 py-3.5 bg-slate-50/90 dark:bg-slate-800/60 border-b border-slate-200/90 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Left: Student count & Quick Search input */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-extrabold text-slate-900 dark:text-white text-sm">
            Roster: {students.length} Students
          </span>

          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by name / roll..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Right: Quick Batch Actions & View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {!isSubmitted && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleSetAll("Present")}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-bold border border-emerald-200 dark:border-emerald-800 transition-all shadow-2xs"
              >
                <Check className="w-3 h-3 stroke-[2.5]" />
                All Present
              </button>
              <button
                type="button"
                onClick={() => handleSetAll("Absent")}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-bold border border-rose-200 dark:border-rose-800 transition-all shadow-2xs"
              >
                <X className="w-3 h-3 stroke-[2.5]" />
                All Absent
              </button>
              <button
                type="button"
                onClick={() => handleSetAll("On-Duty")}
                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-900/60 font-bold border border-purple-200 dark:border-purple-800 transition-all shadow-2xs"
              >
                <Award className="w-3 h-3 stroke-[2.5]" />
                All OD
              </button>
            </div>
          )}

          {/* View Mode Toggle: Cards vs Table */}
          <div className="inline-flex rounded-xl bg-slate-200/70 dark:bg-slate-800 p-0.5 border border-slate-300/60 dark:border-slate-700 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === "cards"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Card View (Great for Mobile)"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Table View (Great for PC & Lab)"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lab PC Keyboard Shortcuts Banner (Desktop only) */}
      {!isSubmitted && (
        <div className="hidden md:flex items-center justify-between px-6 py-1.5 bg-blue-50/50 dark:bg-blue-950/40 border-b border-blue-100/70 dark:border-blue-900/40 text-[11px] text-blue-900 dark:text-blue-200 font-medium">
          <div className="flex items-center gap-2">
            <Keyboard className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>
              <strong>Lab PC Shortcuts:</strong> Press{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 font-mono text-[10px] font-bold">P</kbd> Present,{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 font-mono text-[10px] font-bold">A</kbd> Absent,{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 font-mono text-[10px] font-bold">O</kbd> OD,{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 font-mono text-[10px] font-bold">L</kbd> Late,{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 font-mono text-[10px] font-bold">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 font-mono text-[10px] font-bold">↓</kbd> Navigate.
            </span>
          </div>
          <span className="text-blue-700 dark:text-blue-400 font-bold">
            Focused: {filteredStudents[focusedIndex]?.name || "None"}
          </span>
        </div>
      )}

      {/* Roster Container: Responsive Cards on Mobile, High-Density Table on PC */}
      <div className={`transition-opacity duration-150 ${loading ? "opacity-60" : "opacity-100"}`}>
        {/* A. Mobile Cards View (Active on mobile by default or when Cards view selected) */}
        <div
          className={`p-3.5 sm:p-4 space-y-3 ${
            viewMode === "table"
              ? "hidden"
              : viewMode === "cards"
              ? "block"
              : "block md:hidden"
          }`}
        >
          {filteredStudents.map((student, index) => (
            <AttendanceStudentCard
              key={student.id}
              student={student}
              index={index}
              currentStatus={attendanceMap[student.id] || "Present"}
              isSubmitted={isSubmitted}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>

        {/* B. Desktop High-Density Table View (Active on desktop by default or when Table view selected) */}
        <div
          className={`overflow-x-auto ${
            viewMode === "cards"
              ? "hidden"
              : viewMode === "table"
              ? "block"
              : "hidden md:block"
          }`}
        >
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/90 dark:bg-slate-800/80 border-b border-slate-200/90 dark:border-slate-800 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
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
                <th scope="col" className="pl-4 pr-5 py-3.5 text-right min-w-[300px]">
                  Attendance Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map((student, index) => (
                <AttendanceRow
                  key={student.id}
                  student={student}
                  index={index}
                  currentStatus={attendanceMap[student.id] || "Present"}
                  isSubmitted={isSubmitted}
                  onToggleStatus={onToggleStatus}
                  isFocused={focusedIndex === index}
                  onRowFocus={setFocusedIndex}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AttendanceTable);
