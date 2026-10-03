import React, { useState, useEffect } from "react";
import {
  Users,
  CheckSquare,
  UserCheck,
  UserX,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Building,
  GraduationCap,
  Filter,
  ShieldAlert,
  AlertCircle,
  Loader2,
  Printer,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";
import VisualBarChart from "../components/VisualBarChart";
import AttendanceRatioChart from "../components/AttendanceRatioChart";
import OfficialReportPrintModal from "../components/OfficialReportPrintModal";
import { useAuth } from "../context/AuthContext";
import reportService from "../services/reportService";
import departmentService from "../services/departmentService";
import {
  STUDENT_DEPARTMENTS,
  STUDENT_LEVELS,
  STUDENT_YEARS,
  STUDENT_SECTIONS,
} from "../data/students";
import { formatPercentage, parseYear } from "../utils/formatters";

const defaultFilters = {
  startDate: "",
  endDate: "",
  department: "",
  level: "",
  year: "",
  section: "",
};

const ReportsPage = () => {
  const { user } = useAuth();
  const isHod = user?.role === "HOD";
  const isUnauthorized = user?.role === "STAFF" || user?.role === "STUDENT";

  const [filters, setFilters] = useState({
    ...defaultFilters,
    department: isHod ? user?.department || "" : "",
  });

  const [departments, setDepartments] = useState([]);

  // Data states
  const [overallReport, setOverallReport] = useState(null);
  const [studentReports, setStudentReports] = useState([]);
  const [departmentReports, setDepartmentReports] = useState([]);
  const [lowAttendanceStudents, setLowAttendanceStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Load department metadata
  useEffect(() => {
    let isMounted = true;
    async function loadMeta() {
      try {
        const depts = await departmentService.getDepartments().catch(() => []);
        if (isMounted && Array.isArray(depts) && depts.length > 0) {
          setDepartments(depts);
        }
      } catch {
        // Fallback
      }
    }
    loadMeta();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleFilterChange = (field, val) => {
    setFilters((prev) => ({ ...prev, [field]: val }));
  };

  const handleResetFilters = () => {
    setFilters({
      ...defaultFilters,
      department: isHod ? user?.department || "" : "",
    });
  };

  const hasActiveFilters =
    Boolean(filters.startDate) ||
    Boolean(filters.endDate) ||
    Boolean(filters.department) ||
    Boolean(filters.level) ||
    Boolean(filters.year) ||
    Boolean(filters.section);

  const fetchReports = async () => {
    if (isUnauthorized) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const apiParams = {
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      departmentId: filters.department || undefined,
      programType: filters.level || undefined,
      year: parseYear(filters.year),
      section: filters.section || undefined,
    };

    try {
      const [overall, students, depts, lowAtt] = await Promise.all([
        reportService.getOverallReport(apiParams),
        reportService.getStudentReports(apiParams),
        reportService.getDepartmentReports(apiParams),
        reportService.getLowAttendanceReports({ ...apiParams, threshold: 75.0 }),
      ]);

      if (overall && typeof overall.totalRecords === "number") {
        setOverallReport(overall);
        setStudentReports(students || []);
        setDepartmentReports(depts || []);
        setLowAttendanceStudents(lowAtt || []);
      } else {
        setOverallReport(null);
        setStudentReports([]);
        setDepartmentReports([]);
        setLowAttendanceStudents([]);
      }
    } catch (err) {
      setError(err.message || "Failed to load reports from server.");
      setOverallReport(null);
      setStudentReports([]);
      setDepartmentReports([]);
      setLowAttendanceStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filters]);

  if (isUnauthorized) {
    return (
      <div>
        <PageHeader
          title="Attendance Reports"
          description="Institutional analytics and compliance audits."
        />
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-8 sm:p-12 text-center max-w-md mx-auto">
          <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800 mb-1">
            Access Restricted
          </h2>
          <p className="text-sm text-slate-500">
            Attendance reports and analytical metrics are restricted to administrators and department heads.
          </p>
        </div>
      </div>
    );
  }

  const departmentOptions =
    departments.length > 0
      ? departments.map((d) => d.name)
      : STUDENT_DEPARTMENTS;

  const uniqueStudentsCount = overallReport?.totalStudents || 0;
  const totalRecords = overallReport?.totalRecords || 0;
  const presentRecords = overallReport?.presentRecords || 0;
  const absentRecords = overallReport?.absentRecords || 0;
  const overallPercentage = overallReport?.overallPercentage || 0;

  const deptBarData = departmentReports.map((d) => ({
    name: d.department || d.departmentName || d.departmentId,
    label: d.department || d.departmentName || d.departmentId,
    value: d.attendanceRate || 0,
    present: d.present,
    total: d.totalStudents,
  }));

  return (
    <div>
      <PageHeader
        title="Attendance Reports & Analytics"
        description="Comprehensive attendance statistics, student compliance, department breakdowns, and low-attendance tracking."
        action={
          <button
            type="button"
            onClick={() => setShowPrintModal(true)}
            disabled={studentReports.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="w-4 h-4" />
            Print Official Report
          </button>
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
            onClick={fetchReports}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 mb-6 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-800 text-base">
              Report Criteria & Filters
            </h2>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              Reset Filters
            </button>
          )}
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Department */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Department
              </label>
              <select
                value={filters.department}
                disabled={isHod}
                onChange={(e) => handleFilterChange("department", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
              >
                <option value="">All Departments</option>
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* UG / PG */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Program (UG/PG)
              </label>
              <select
                value={filters.level}
                onChange={(e) => handleFilterChange("level", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Programs</option>
                {STUDENT_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Academic Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
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
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 py-12 text-center flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">
            Calculating institutional attendance metrics...
          </p>
        </div>
      ) : (
        <>
          {/* 1. Overall Attendance Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6">
            <StatCard
              title="Total Students"
              value={uniqueStudentsCount}
              change="Recorded in selected scope"
              icon={Users}
              color="primary"
            />
            <StatCard
              title="Total Records"
              value={totalRecords}
              change="Attendance instances"
              icon={CheckSquare}
              color="info"
            />
            <StatCard
              title="Present"
              value={presentRecords}
              change={
                totalRecords > 0
                  ? `${Math.round((presentRecords / totalRecords) * 100)}% attendance rate`
                  : "No records"
              }
              icon={UserCheck}
              color="success"
            />
            <StatCard
              title="Absent"
              value={absentRecords}
              change={
                totalRecords > 0
                  ? `${Math.round((absentRecords / totalRecords) * 100)}% absence rate`
                  : "No records"
              }
              icon={UserX}
              color="danger"
            />
            <StatCard
              title="Overall Attendance"
              value={formatPercentage(overallPercentage)}
              change={
                overallPercentage >= 75
                  ? "Meets institutional goal"
                  : "Below 75% target"
              }
              icon={TrendingUp}
              color={overallPercentage >= 75 ? "success" : "warning"}
            />
          </div>

          {/* Visual Distribution Graphs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            <div className={deptBarData.length > 0 ? "lg:col-span-5" : "lg:col-span-12"}>
              <AttendanceRatioChart
                title="Present vs. Absent Ratio"
                total={totalRecords}
                present={presentRecords}
                absent={absentRecords}
                percentage={overallPercentage}
              />
            </div>
            {deptBarData.length > 0 && (
              <div className="lg:col-span-7">
                <VisualBarChart
                  title="Department Attendance Comparison"
                  subtitle="Rate breakdown across departments (75% Minimum Target Line)"
                  data={deptBarData}
                  targetThreshold={75}
                />
              </div>
            )}
          </div>

          {/* 2. Low Attendance Section (< 75%) */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 border-l-4 border-l-amber-500 mb-6 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h2 className="font-bold text-slate-800 text-base">
                  Low Attendance Alert (&lt; 75%)
                </h2>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {lowAttendanceStudents.length} Students Below Threshold
              </span>
            </div>

            <div>
              {lowAttendanceStudents.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  All students in the selected criteria have an attendance rate of 75% or higher.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th scope="col" className="pl-5 pr-3 py-3.5">
                          Roll Number
                        </th>
                        <th scope="col" className="px-4 py-3.5">
                          Student Name
                        </th>
                        <th scope="col" className="px-4 py-3.5">
                          Present
                        </th>
                        <th scope="col" className="px-4 py-3.5">
                          Absent
                        </th>
                        <th scope="col" className="px-4 py-3.5 min-w-[180px]">
                          Attendance Rate
                        </th>
                        <th scope="col" className="pl-4 pr-5 py-3.5 text-right">
                          Compliance Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {lowAttendanceStudents.map((st) => (
                        <tr key={st.rollNo || st.studentId} className="hover:bg-slate-50/70 transition-colors">
                          <td className="pl-5 pr-3 py-3.5 font-bold text-slate-800">
                            {st.rollNo}
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-slate-800">
                            {st.name}
                          </td>
                          <td className="px-4 py-3.5 text-emerald-600 font-semibold">
                            {st.present}
                          </td>
                          <td className="px-4 py-3.5 text-rose-600 font-semibold">
                            {st.absent}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-rose-100 rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-full bg-rose-600 rounded-full"
                                  style={{ width: `${Math.min(st.attendanceRate, 100)}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-rose-600 min-w-[40px] text-right">
                                {formatPercentage(st.attendanceRate)}
                              </span>
                            </div>
                          </td>
                          <td className="pl-4 pr-5 py-3.5 text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              Critical (&lt;75%)
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* 3. Department-wise Attendance Report */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 mb-6 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2 bg-slate-50/50">
              <Building className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-800 text-base">
                Department-wise Attendance
              </h2>
            </div>

            <div>
              {departmentReports.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No department records match the selected filters.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th scope="col" className="pl-5 pr-3 py-3.5">
                          Department
                        </th>
                        <th scope="col" className="px-4 py-3.5">
                          Total Students
                        </th>
                        <th scope="col" className="px-4 py-3.5">
                          Present
                        </th>
                        <th scope="col" className="px-4 py-3.5">
                          Absent
                        </th>
                        <th scope="col" className="px-4 py-3.5 min-w-[200px]">
                          Attendance %
                        </th>
                        <th scope="col" className="pl-4 pr-5 py-3.5 text-right">
                          Rating
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {departmentReports.map((dept) => {
                        const rate = dept.attendanceRate || 0;
                        const isExcellent = rate >= 90;
                        const isGood = rate >= 75;

                        return (
                          <tr key={dept.department || dept.departmentId} className="hover:bg-slate-50/70 transition-colors">
                            <td className="pl-5 pr-3 py-3.5 font-semibold text-slate-800">
                              {dept.department || dept.departmentName || dept.departmentId}
                            </td>
                            <td className="px-4 py-3.5 text-slate-600">{dept.totalStudents}</td>
                            <td className="px-4 py-3.5 text-emerald-600 font-semibold">{dept.present}</td>
                            <td className="px-4 py-3.5 text-rose-600 font-semibold">{dept.absent}</td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      isExcellent ? "bg-emerald-600" : isGood ? "bg-blue-600" : "bg-amber-500"
                                    }`}
                                    style={{ width: `${Math.min(rate, 100)}%` }}
                                  />
                                </div>
                                <span className="text-xs font-bold text-slate-700 min-w-[42px] text-right">
                                  {formatPercentage(rate)}
                                </span>
                              </div>
                            </td>
                            <td className="pl-4 pr-5 py-3.5 text-right">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                  rate >= 85
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                    : rate >= 75
                                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                                    : "bg-amber-100 text-amber-800 border border-amber-200"
                                }`}
                              >
                                {rate >= 95
                                  ? "Excellent"
                                  : rate >= 85
                                  ? "Good"
                                  : rate >= 75
                                  ? "Acceptable"
                                  : "Low"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* 4. Student-wise Attendance Report */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2 bg-slate-50/50">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-800 text-base">
                Student-wise Attendance Report
              </h2>
            </div>

            <div>
              {studentReports.length === 0 ? (
                <EmptyState
                  title="No student records match filter"
                  message="Adjust your date range or class filters to view student records."
                  action={
                    hasActiveFilters ? (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
                      >
                        Reset Filters
                      </button>
                    ) : null
                  }
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th scope="col" className="pl-5 pr-3 py-3.5">
                          Roll Number
                        </th>
                        <th scope="col" className="px-4 py-3.5">
                          Student Name
                        </th>
                        <th scope="col" className="px-4 py-3.5">
                          Department & Course
                        </th>
                        <th scope="col" className="px-4 py-3.5">
                          Year & Sec
                        </th>
                        <th scope="col" className="px-4 py-3.5">
                          Present
                        </th>
                        <th scope="col" className="px-4 py-3.5">
                          Absent
                        </th>
                        <th scope="col" className="px-4 py-3.5">
                          Total Periods
                        </th>
                        <th scope="col" className="px-4 py-3.5 min-w-[140px]">
                          Attendance %
                        </th>
                        <th scope="col" className="pl-4 pr-5 py-3.5 text-right">
                          Exam Clearance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentReports.map((st) => (
                        <tr key={st.rollNo || st.studentId} className="hover:bg-slate-50/70 transition-colors">
                          <td className="pl-5 pr-3 py-3.5 font-semibold text-slate-800">
                            {st.rollNo}
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-slate-800">
                            {st.name}
                          </td>
                          <td className="px-4 py-3.5 font-medium text-slate-700">
                            {st.department || st.departmentName}
                          </td>
                          <td className="px-4 py-3.5 text-slate-500 text-xs">
                            {st.year} (Sec {st.section})
                          </td>
                          <td className="px-4 py-3.5 text-emerald-600 font-semibold">{st.present}</td>
                          <td className="px-4 py-3.5 text-rose-600 font-semibold">{st.absent}</td>
                          <td className="px-4 py-3.5 font-semibold text-slate-800">{st.totalPeriods}</td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    st.attendanceRate >= 75 ? "bg-emerald-600" : "bg-rose-600"
                                  }`}
                                  style={{ width: `${Math.min(st.attendanceRate, 100)}%` }}
                                />
                              </div>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                                  st.attendanceRate >= 75
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                    : "bg-rose-100 text-rose-800 border border-rose-200"
                                }`}
                              >
                                {formatPercentage(st.attendanceRate)}
                              </span>
                            </div>
                          </td>
                          <td className="pl-4 pr-5 py-3.5 text-right">
                            {st.attendanceRate >= 75 ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Eligible (≥75%)
                              </span>
                            ) : st.attendanceRate >= 65 ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                Condonation (65-74%)
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                Detained (&lt;65%)
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Official College Print Modal */}
      <OfficialReportPrintModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        data={studentReports}
        filters={filters}
        overallReport={overallReport}
      />
    </div>
  );
};

export default ReportsPage;
