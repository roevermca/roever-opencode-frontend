import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  AlertCircle,
  RotateCcw,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import AttendanceHistory from "../components/AttendanceHistory";
import attendanceService from "../services/attendanceService";
import studentService from "../services/studentService";
import { parsePeriod, formatPeriod, formatYear } from "../utils/formatters";

const emptyHistoryFilters = {
  date: "",
  department: "",
  year: "",
  section: "",
  period: "",
};

const AttendanceHistoryPage = () => {
  const [filters, setFilters] = useState(emptyHistoryFilters);
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    const periodNum = parsePeriod(filters.period);
    const params = {
      date: filters.date || undefined,
      period: periodNum,
      page: currentPage - 1,
      size: pageSize,
    };

    try {
      const res = await attendanceService.getAttendance(params);
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        const enriched = res.data.map((r) => {
          return {
            id: r.id,
            date: r.date,
            period: formatPeriod(r.period),
            studentId: r.studentId,
            studentName: r.studentName || "Student",
            studentRollNo: r.studentRollNo || r.studentId,
            department: r.department || "Academic Dept",
            year: r.year ? formatYear(r.year) : "",
            section: r.section || "",
            status: r.status === "PRESENT" ? "Present" : "Absent",
            markedBy: r.markedBy || "Faculty Staff",
            markedTime: r.markedAt
              ? new Date(r.markedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
          };
        });

        // Filter in-memory if department/year/section filters are selected
        const filtered = enriched.filter((record) => {
          const matchesDept = !filters.department || record.department === filters.department;
          const matchesYear = !filters.year || record.year === filters.year;
          const matchesSection = !filters.section || record.section === filters.section;
          return matchesDept && matchesYear && matchesSection;
        });

        setRecords(filtered);
        setTotalPages(res.totalPages || 1);
        setTotalElements(res.totalElements || filtered.length);
      } else {
        setRecords([]);
        setTotalPages(1);
        setTotalElements(0);
      }
    } catch (err) {
      setError(err.message || "Failed to load attendance history.");
      setRecords([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filters, currentPage]);

  useEffect(() => {
    const handleUpdate = () => {
      fetchHistory();
    };
    window.addEventListener("ams_data_updated", handleUpdate);
    window.addEventListener("focus", handleUpdate);
    return () => {
      window.removeEventListener("ams_data_updated", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, []);

  const handleResetFilters = () => {
    setFilters(emptyHistoryFilters);
    setCurrentPage(1);
  };

  return (
    <div>
      <PageHeader
        title="Attendance History"
        description="Comprehensive audit log of recorded student attendance by date, department, and period."
        action={
          <Link
            to="/attendance"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
          >
            <CalendarCheck className="w-4 h-4" />
            Mark Attendance
          </Link>
        }
      />

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchHistory}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      <AttendanceHistory
        history={records}
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
        onResetFilters={handleResetFilters}
      />

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          <span>Refreshing history...</span>
        </div>
      )}

      {/* Pagination Footer */}
      {totalElements > pageSize && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 px-1">
          <p className="text-xs text-slate-500">
            Showing <strong className="font-semibold text-slate-700">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
            <strong className="font-semibold text-slate-700">{Math.min(currentPage * pageSize, totalElements)}</strong> of{" "}
            <strong className="font-semibold text-slate-700">{totalElements}</strong> records
          </p>

          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-1.5 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-medium text-slate-600 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-1.5 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistoryPage;
