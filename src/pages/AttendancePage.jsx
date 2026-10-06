import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { History, CheckCircle2, AlertCircle, RotateCcw, Send } from "lucide-react";
import PageHeader from "../components/PageHeader";
import AttendanceFilters from "../components/AttendanceFilters";
import AttendanceSummary from "../components/AttendanceSummary";
import AttendanceTable from "../components/AttendanceTable";
import AttendanceStatus from "../components/AttendanceStatus";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import studentService from "../services/studentService";
import attendanceService from "../services/attendanceService";
import departmentService from "../services/departmentService";
import courseService from "../services/courseService";
import { getTodayDateString, attendanceSessionStore } from "../data/attendance";
import { parseYear, parsePeriod } from "../utils/formatters";

// In-memory class roster cache across period switches (saves 80% redundant API calls)
const classRosterCache = new Map();

if (typeof window !== "undefined") {
  window.addEventListener("ams_data_updated", (e) => {
    if (e.detail?.action?.includes("student")) {
      classRosterCache.clear();
    }
  });
}

const defaultFilters = {
  department: "Computer Applications",
  course: "BCA",
  year: "1st Year",
  section: "A",
  date: getTodayDateString(),
  period: "Period 1",
};

const AttendancePage = () => {
  const { user } = useAuth();
  const isStaff = user?.role === "STAFF";

  const [filters, setFilters] = useState(defaultFilters);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classStudents, setClassStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionMeta, setSubmissionMeta] = useState({
    submittedAt: "",
    submittedBy: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState("");

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification("");
    }, 4000);
  };

  // Load departments and courses metadata
  useEffect(() => {
    let isMounted = true;
    async function loadMeta() {
      try {
        const [depts, crs] = await Promise.all([
          departmentService.getDepartments().catch(() => []),
          courseService.getCourses().catch(() => []),
        ]);
        if (isMounted) {
          if (Array.isArray(depts) && depts.length > 0) setDepartments(depts);
          if (Array.isArray(crs) && crs.length > 0) setCourses(crs);

          if (isStaff) {
            const staffCourseObj = (crs || []).find(
              (c) =>
                c.id === user?.courseId ||
                c.code === user?.courseId ||
                c.name?.toLowerCase() === user?.courseId?.toLowerCase()
            );
            const staffCourse = staffCourseObj ? staffCourseObj.name : user?.courseId || "";

            const staffDeptObj = (depts || []).find(
              (d) =>
                d.id === user?.departmentId ||
                d.code === user?.departmentId ||
                d.name?.toLowerCase() === user?.departmentId?.toLowerCase()
            );
            const staffDept = staffDeptObj ? staffDeptObj.name : user?.department || "";

            setFilters((prev) => ({
              ...prev,
              department: staffDept || prev.department,
              course: staffCourse || prev.course,
            }));
          }
        }
      } catch {
        // ignore
      }
    }
    loadMeta();
    return () => {
      isMounted = false;
    };
  }, [isStaff, user?.courseId, user?.departmentId, user?.department]);

  const staffCourseName = React.useMemo(() => {
    if (!isStaff) return "";
    const matched = courses.find(
      (c) =>
        c.id === user?.courseId ||
        c.code === user?.courseId ||
        c.name?.toLowerCase() === user?.courseId?.toLowerCase()
    );
    return matched ? matched.name : user?.courseId || "";
  }, [isStaff, user?.courseId, courses]);

  const staffDeptName = React.useMemo(() => {
    if (!isStaff) return "";
    const matched = departments.find(
      (d) =>
        d.id === user?.departmentId ||
        d.code === user?.departmentId ||
        d.name?.toLowerCase() === user?.departmentId?.toLowerCase()
    );
    return matched ? matched.name : user?.department || "";
  }, [isStaff, user?.departmentId, user?.department, departments]);

  const getSessionKey = (f) =>
    `${f.date}_${f.department}_${f.course || ""}_${f.year}_${f.section}_${f.period}`;

  // Fetch class students and check submitted status
  const loadClassSession = async () => {
    setLoading(true);
    setError(null);

    const isFullDay = filters.period?.toLowerCase()?.includes("full");
    const periodNumber = isFullDay ? 1 : parsePeriod(filters.period) || 1;
    const yearNumber = parseYear(filters.year) || 1;
    const rosterKey = `${filters.department}_${filters.course || ""}_${yearNumber}_${filters.section}`;

    try {
      // 1. In-memory roster cache check (avoids redundant network calls across period switches)
      let loadedStudents = classRosterCache.get(rosterKey) || [];

      if (loadedStudents.length === 0) {
        const studentRes = await studentService.getStudents({
          departmentId: isStaff ? undefined : filters.department,
          courseId: isStaff ? (user?.courseId || filters.course) : filters.course,
          year: yearNumber,
          section: filters.section,
          size: 100,
        });

        if (studentRes && Array.isArray(studentRes.data)) {
          loadedStudents = studentRes.data;
          classRosterCache.set(rosterKey, loadedStudents);
        }
      }
      setClassStudents(loadedStudents);

      // 2. Targeted query for exact class student IDs (prevents college-wide pagination overflow)
      const studentIds = loadedStudents.map((s) => s.id);
      const attRes = await attendanceService.getAttendance({
        studentIds: studentIds.length > 0 ? studentIds : undefined,
        date: filters.date,
        period: isFullDay ? undefined : periodNumber,
        size: Math.max(100, studentIds.length * (isFullDay ? 5 : 1)),
      });

      const records = attRes?.data || [];
      const studentIdSet = new Set(studentIds);
      const matchingRecords = records.filter((r) => studentIdSet.has(r.studentId));

      if (matchingRecords.length > 0) {
        // Attendance already submitted for this class & period
        setIsSubmitted(true);
        const map = {};
        matchingRecords.forEach((r) => {
          if (r.status === "PRESENT") map[r.studentId] = "Present";
          else if (r.status === "ON_DUTY") map[r.studentId] = "On-Duty";
          else if (r.status === "LATE") map[r.studentId] = "Late";
          else map[r.studentId] = "Absent";
        });
        setAttendanceMap(map);

        const first = matchingRecords[0];
        setSubmissionMeta({
          submittedAt: first.markedAt ? new Date(first.markedAt).toLocaleString() : "Earlier today",
          submittedBy: first.markedBy || "Staff Faculty",
        });
      } else {
        // Check local session store fallback
        const sessionKey = getSessionKey(filters);
        const existingSession = attendanceSessionStore.get(sessionKey);

        if (existingSession) {
          setIsSubmitted(true);
          setSubmissionMeta({
            submittedAt: existingSession.submittedAt,
            submittedBy: existingSession.submittedBy,
          });
          setAttendanceMap(existingSession.records || {});
        } else {
          setIsSubmitted(false);
          setSubmissionMeta({
            submittedAt: "",
            submittedBy: "",
          });
          // Default all students to Present
          const initialMap = {};
          loadedStudents.forEach((s) => {
            initialMap[s.id] = "Present";
          });
          setAttendanceMap(initialMap);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load class attendance session.");
      setClassStudents([]);
      setAttendanceMap({});
      setIsSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClassSession();
  }, [filters]);

  const handleToggleStatus = React.useCallback((studentId, status) => {
    if (isSubmitted) return;
    setAttendanceMap((prev) => {
      if (prev[studentId] === status) return prev;
      return {
        ...prev,
        [studentId]: status,
      };
    });
  }, [isSubmitted]);

  const handleMarkAllPresent = React.useCallback(() => {
    if (isSubmitted) return;
    const updated = {};
    classStudents.forEach((s) => {
      updated[s.id] = "Present";
    });
    setAttendanceMap(updated);
  }, [isSubmitted, classStudents]);

  const handleMarkAllAbsent = React.useCallback(() => {
    if (isSubmitted) return;
    const updated = {};
    classStudents.forEach((s) => {
      updated[s.id] = "Absent";
    });
    setAttendanceMap(updated);
  }, [isSubmitted, classStudents]);

  const handleReset = React.useCallback(() => {
    if (isSubmitted) return;
    const initialMap = {};
    classStudents.forEach((s) => {
      initialMap[s.id] = "Present";
    });
    setAttendanceMap(initialMap);
  }, [isSubmitted, classStudents]);

  const handleBatchSetStatus = React.useCallback((status) => {
    if (isSubmitted) return;
    const updated = {};
    classStudents.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceMap(updated);
  }, [isSubmitted, classStudents]);

  // Calculate statistics (OD counts as Present towards percentage)
  const total = classStudents.length;
  const presentCount = classStudents.filter(
    (s) => attendanceMap[s.id] === "Present"
  ).length;
  const absentCount = classStudents.filter(
    (s) => attendanceMap[s.id] === "Absent"
  ).length;
  const odCount = classStudents.filter(
    (s) => attendanceMap[s.id] === "On-Duty" || attendanceMap[s.id] === "OD"
  ).length;
  const lateCount = classStudents.filter(
    (s) => attendanceMap[s.id] === "Late"
  ).length;
  const effectivePresent = presentCount + odCount;
  const percentage = total > 0 ? Math.round((effectivePresent / total) * 100) : 0;

  // Final bulk submission handler
  const handleConfirmSubmit = async () => {
    const isFullDay = filters.period?.toLowerCase()?.includes("full");
    const periodNumber = isFullDay ? null : parsePeriod(filters.period) || 1;
    const recordsPayload = classStudents.map((s) => {
      const st = attendanceMap[s.id] || "Present";
      let statusEnum = "PRESENT";
      if (st === "Absent") statusEnum = "ABSENT";
      else if (st === "On-Duty" || st === "OD") statusEnum = "ON_DUTY";
      else if (st === "Late") statusEnum = "LATE";
      return {
        studentId: s.id,
        status: statusEnum,
      };
    });

    const bulkPayload = {
      date: filters.date,
      period: periodNumber,
      fullDay: isFullDay,
      records: recordsPayload,
    };


    setIsSubmitting(true);
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timeString = `${formattedDate}, ${formattedTime}`;
    const staffName = user?.displayName || user?.email || "Faculty Staff";

    try {
      await attendanceService.markAttendanceBulk(bulkPayload);

      try {
        sessionStorage.removeItem("ams_dashboard_cache_v1");
        window.dispatchEvent(
          new CustomEvent("ams_data_updated", {
            detail: { action: "attendance_marked" },
          })
        );
      } catch {
        // ignore
      }

      setIsSubmitted(true);
      setSubmissionMeta({
        submittedAt: timeString,
        submittedBy: staffName,
      });

      // Update local cache as well
      const sessionKey = getSessionKey(filters);
      attendanceSessionStore.set(sessionKey, {
        isSubmitted: true,
        submittedAt: timeString,
        submittedBy: staffName,
        records: { ...attendanceMap },
      });

      showNotification(
        `Attendance for ${filters.period} (${filters.department}) successfully submitted and locked.`
      );
    } catch (err) {
      if (err.status === 409) {
        setIsSubmitted(true);
        showNotification(
          `Attendance for ${filters.period} on ${filters.date} has already been submitted and locked.`
        );
      } else {
        showNotification(err.message || `Failed to submit attendance for ${filters.period}.`);
      }
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="pb-24 sm:pb-8">
      <PageHeader
        title="Mark Attendance"
        description="Select class criteria, record student attendance status, and submit period records."
        action={
          <Link
            to="/attendance/history"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-2xs transition-colors"
          >
            <History className="w-4 h-4 text-blue-600" />
            Attendance History
          </Link>
        }
      />

      {/* Notification banner */}
      {notification && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification("")}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={loadClassSession}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* 1. Class & Session Filters */}
      <AttendanceFilters
        filters={filters}
        onFilterChange={setFilters}
        disabled={isSubmitting}
        isStaff={isStaff}
        staffCourse={staffCourseName}
        staffDept={staffDeptName}
        departments={departments}
        courses={courses}
      />

      {/* 2. Submission Status Banner */}
      <AttendanceStatus
        isSubmitted={isSubmitted}
        submittedAt={submissionMeta.submittedAt}
        submittedBy={submissionMeta.submittedBy}
      />

      {/* 3. Summary & Quick Action Controls */}
      <AttendanceSummary
        total={total}
        presentCount={presentCount}
        absentCount={absentCount}
        odCount={odCount}
        lateCount={lateCount}
        percentage={percentage}
        onMarkAllPresent={handleMarkAllPresent}
        onMarkAllAbsent={handleMarkAllAbsent}
        onReset={handleReset}
        onSubmit={() => setShowConfirmModal(true)}
        isSubmitted={isSubmitted}
        disabled={total === 0 || isSubmitting}
      />

      {/* 4. Student Roster Attendance Table */}
      <AttendanceTable
        students={classStudents}
        attendanceMap={attendanceMap}
        onToggleStatus={handleToggleStatus}
        onBatchSetStatus={handleBatchSetStatus}
        isSubmitted={isSubmitted}
        loading={loading}
      />

      {/* Confirmation dialog before final submission */}
      <ConfirmDialog
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        title="Confirm Attendance Submission"
        message={`Are you sure you want to submit attendance for ${filters.department} (${filters.year} - Sec ${filters.section}) ${filters.period} on ${filters.date}? Under staff policy, submitted records are locked and cannot be edited.`}
        confirmText="Confirm & Submit"
        confirmVariant="primary"
      />

      {/* Sticky Bottom Executive Bar for Phones (sm:hidden) */}
      {!isSubmitted && total > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-4 py-3 sm:hidden flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-black bg-emerald-100 text-emerald-800">
              P: {presentCount}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-black bg-rose-100 text-rose-800">
              A: {absentCount}
            </span>
            {odCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-black bg-purple-100 text-purple-800">
                OD: {odCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-xs transition-all disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
