import React, { useState, useEffect, useTransition } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  GraduationCap,
  CalendarCheck,
  AlertTriangle,
  UserPlus,
  ShieldCheck,
  RefreshCw,
  Calendar,
  Clock,
  ArrowRight,
  ClipboardList,
  BarChart3,
  Search,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Database,
  Trash2,
} from "lucide-react";
import StatCard from "../components/StatCard";
import VisualBarChart from "../components/VisualBarChart";
import AttendanceRatioChart from "../components/AttendanceRatioChart";
import { useAuth } from "../context/AuthContext";
import studentService from "../services/studentService";
import staffService from "../services/staffService";
import reportService from "../services/reportService";
import systemService from "../services/systemService";
import { formatPercentage } from "../utils/formatters";
import { getTodayDateString } from "../data/attendance";


const DASHBOARD_CACHE_KEY = "ams_dashboard_cache_v1";

const getCachedDashboardData = () => {
  try {
    const raw = sessionStorage.getItem(DASHBOARD_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Valid if less than 15 minutes old
      if (parsed && Date.now() - (parsed.timestamp || 0) < 15 * 60 * 1000) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return null;
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();

  const cached = React.useMemo(() => getCachedDashboardData(), []);

  const [stats, setStats] = useState(
    cached?.stats || {
      totalStudents: "0",
      totalStaff: "0",
      todayAttendance: "0%",
      lowAttendance: "0",
    }
  );

  const [deptSummary, setDeptSummary] = useState(cached?.deptSummary || []);
  const [statusPills, setStatusPills] = useState(cached?.statusPills || []);
  const [todayRatio, setTodayRatio] = useState(
    cached?.todayRatio || {
      total: 0,
      present: 0,
      absent: 0,
      percentage: 0,
    }
  );

  const [loading, setLoading] = useState(!cached);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deptSearch, setDeptSearch] = useState("");
  const [storageStatus, setStorageStatus] = useState(null);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanupMessage, setCleanupMessage] = useState(null);

  const handleManualCleanup = async (dryRun = false) => {
    const confirmMsg = dryRun
      ? "Run cleanup dry-run to see how many old records are eligible for cleanup?"
      : "Clean up attendance records older than 90 days? Historical semester percentages will be safely archived.";
    if (!window.confirm(confirmMsg)) {
      return;
    }
    setIsCleaning(true);
    setCleanupMessage(null);
    try {
      const res = await systemService.triggerCleanup({ dryRun });
      setCleanupMessage(res.message);
      const updated = await systemService.getStorageStatus();
      setStorageStatus(updated);
    } catch (err) {
      setCleanupMessage(err?.message || "Failed to execute cleanup operation.");
    } finally {
      setIsCleaning(false);
      setTimeout(() => setCleanupMessage(null), 7000);
    }
  };

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Formatted date string
  const formattedToday = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const loadDashboardData = async (isBackground = false) => {
    if (!isBackground) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    const today = getTodayDateString();
    try {
      const deptPromise =
        user?.role !== "STAFF" && user?.role !== "STUDENT"
          ? reportService.getDepartmentReports({}).catch(() => null)
          : user?.role === "STAFF"
          ? Promise.all([
              departmentService.getDepartments(true).catch(() => []),
              studentService.getStudents({ size: 1000 }).catch(() => ({ data: [] })),
            ])
              .then(([departments, stuListRes]) => {
                const students = Array.isArray(stuListRes?.data) ? stuListRes.data : [];
                const depts = Array.isArray(departments) ? departments : [];
                const counts = {};
                students.forEach((s) => {
                  const dId = s.departmentId || s.department;
                  if (dId) {
                    counts[dId] = (counts[dId] || 0) + 1;
                  }
                });
                return depts.map((d) => ({
                  departmentId: d.id,
                  department: d.name,
                  totalStudents: counts[d.id] || counts[d.code] || counts[d.name] || 0,
                  present: 0,
                  absent: 0,
                  total: 0,
                  attendanceRate: 0,
                }));
              })
              .catch(() => null)
          : Promise.resolve(null);

      const [stuRes, staffRes, todayReport, lowAttRes, deptRes] =
        await Promise.all([
          studentService.getStudents({ size: 1 }).catch(() => null),
          user?.role !== "STAFF" && user?.role !== "STUDENT"
            ? staffService.getStaff({ size: 1 }).catch(() => null)
            : Promise.resolve(null),
          user?.role !== "STAFF" && user?.role !== "STUDENT"
            ? reportService
                .getOverallReport({ startDate: today, endDate: today })
                .catch(() => null)
            : Promise.resolve(null),
          user?.role !== "STAFF" && user?.role !== "STUDENT"
            ? reportService.getLowAttendanceReports({}).catch(() => null)
            : Promise.resolve(null),
          deptPromise,
        ]);

      startTransition(() => {
        let updatedStats = { ...stats };
        let updatedRatio = { ...todayRatio };
        let updatedPills = [...statusPills];
        let updatedDepts = [];

        if (stuRes && typeof stuRes.totalElements === "number") {
          updatedStats.totalStudents = stuRes.totalElements.toLocaleString();
        }
        if (staffRes && typeof staffRes.totalElements === "number") {
          updatedStats.totalStaff = staffRes.totalElements.toLocaleString();
        }
        if (todayReport && typeof todayReport.overallPercentage === "number") {
          updatedStats.todayAttendance = `${todayReport.overallPercentage}%`;
          const present = todayReport.presentRecords || 0;
          const absent = todayReport.absentRecords || 0;
          const total = todayReport.totalRecords || 0;
          const presentPct = total > 0 ? Math.round((present / total) * 100) : 0;
          const absentPct = total > 0 ? Math.round((absent / total) * 100) : 0;
          updatedPills = [
            { label: "Present", count: present, percentage: presentPct, variant: "success" },
            { label: "Absent", count: absent, percentage: absentPct, variant: "danger" },
          ];
          updatedRatio = {
            total,
            present,
            absent,
            percentage: todayReport.overallPercentage,
          };
        }
        if (Array.isArray(lowAttRes)) {
          updatedStats.lowAttendance = lowAttRes.length.toString();
        }
        if (Array.isArray(deptRes)) {
          updatedDepts = deptRes.map((d) => ({
            name: d.department || d.departmentName || d.departmentId,
            label: d.department || d.departmentName || d.departmentId,
            total: Number(d.totalStudents ?? d.total ?? 0),
            present: Number(d.present ?? 0),
            absent: Number(d.absent ?? 0),
            attendanceRate: Number(d.attendanceRate ?? d.rate ?? 0),
            value: Number(d.attendanceRate ?? d.rate ?? 0),
          }));
        }

        setStats(updatedStats);
        setStatusPills(updatedPills);
        setTodayRatio(updatedRatio);
        setDeptSummary(updatedDepts);

        try {
          sessionStorage.setItem(
            DASHBOARD_CACHE_KEY,
            JSON.stringify({
              stats: updatedStats,
              statusPills: updatedPills,
              todayRatio: updatedRatio,
              deptSummary: updatedDepts,
              timestamp: Date.now(),
            })
          );
        } catch {
          // ignore
        }
      });

      if (user?.role === "ADMIN" || user?.role === "VP") {
        systemService
          .getStorageStatus()
          .then((res) => {
            if (res) setStorageStatus(res);
          })
          .catch(() => null);
      }

    } catch {
      // keep fallback
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };


  useEffect(() => {
    // If cached data is present, revalidate silently in background; otherwise show spinner/skeletons
    loadDashboardData(Boolean(cached));

    const handleDataRefresh = () => {
      loadDashboardData(false);
    };
    window.addEventListener("ams_data_updated", handleDataRefresh);
    window.addEventListener("focus", handleDataRefresh);
    return () => {
      window.removeEventListener("ams_data_updated", handleDataRefresh);
      window.removeEventListener("focus", handleDataRefresh);
    };
  }, [user]);


  // Filtered department records for the table
  const filteredDepartments = deptSummary.filter((d) =>
    d.name?.toLowerCase().includes(deptSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8">
      {/* 1. MUI-Style Header & Context Banner */}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Greeting & Meta */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                <Sparkles className="w-3 h-3 text-blue-500" />
                {user?.role === "ADMIN"
                  ? "System Administrator"
                  : user?.role === "VP"
                  ? "Vice Principal"
                  : user?.role === "STAFF"
                  ? "Staff Faculty"
                  : "Student Portal"}
              </span>

              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formattedToday}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {getGreeting()},{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {user?.name || "Admin"}
              </span>
            </h1>
            <p className="text-sm text-slate-500">
              Institutional attendance analytics, student status, and operational insights.
            </p>
          </div>

          {/* MUI-styled Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => loadDashboardData(true)}
              disabled={isRefreshing || loading}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all disabled:opacity-60"
              title="Refresh Dashboard Data"
            >
              <RefreshCw
                className={`w-4 h-4 text-slate-500 ${
                  isRefreshing ? "animate-spin text-blue-600" : ""
                }`}
              />
              <span className="hidden sm:inline">
                {isRefreshing ? "Updating..." : "Refresh"}
              </span>
            </button>

            {/* Role-specific Action Buttons */}
            {user?.role === "ADMIN" && (
              <>
                <Link
                  to="/staff?action=new-vp"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_2px_8px_rgba(245,158,11,0.25)] hover:shadow-[0_4px_12px_rgba(245,158,11,0.35)] transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  + Add VP
                </Link>
                <Link
                  to="/staff?action=new"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-[0_2px_8px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_12px_rgba(37,99,235,0.35)] transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Staff
                </Link>
                <Link
                  to="/students?action=new"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300/80 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all"
                >
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  Add Student
                </Link>
              </>
            )}

            {user?.role === "VP" && (
              <>
                <Link
                  to="/staff?action=new"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-[0_2px_8px_rgba(37,99,235,0.25)] transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Staff
                </Link>
                <Link
                  to="/students?action=new"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-xs transition-all"
                >
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  Add Student
                </Link>
              </>
            )}

            {user?.role === "STAFF" && (
              <>
                <Link
                  to="/students?action=new"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-xs transition-all"
                >
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  + Add Student
                </Link>
                <Link
                  to="/attendance"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-[0_2px_8px_rgba(37,99,235,0.25)] transition-all"
                >
                  <CalendarCheck className="w-4 h-4" />
                  Mark Today's Attendance
                </Link>
              </>
            )}

          </div>
        </div>
      </div>

      {/* Storage Health & Auto-Cleanup Monitoring (ADMIN & VP only) */}

      {(user?.role === "ADMIN" || user?.role === "VP") && storageStatus && (
        <div className="bg-slate-900 text-white rounded-2xl shadow-sm border border-slate-800 p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold tracking-tight text-white">
                  MongoDB Atlas Storage (512 MB Free Tier)
                </h3>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    storageStatus.percentageUsed >= 90
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : storageStatus.percentageUsed >= 80
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  {storageStatus.percentageUsed >= 80 ? "Auto-Cleanup Active (>= 80%)" : "Healthy (< 80%)"}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Automatic FIFO cleanup triggers at 80%–90% capacity. Records older than 90 days are archived & purged. Student profiles & accounts are 100% protected.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleManualCleanup(true)}
                disabled={isCleaning}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all disabled:opacity-50"
                title="Check how many old records are eligible for cleanup without deleting anything"
              >
                Dry Run Check
              </button>
              <button
                type="button"
                onClick={() => handleManualCleanup(false)}
                disabled={isCleaning}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all disabled:opacity-50"
                title="Archive and purge old attendance records older than 90 days"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {isCleaning ? "Processing..." : "Free Old Data"}
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>
                Used: <strong className="text-white">{storageStatus.usedMb} MB</strong> / {storageStatus.maxLimitMb} MB
              </span>
              <span>
                <strong className={storageStatus.percentageUsed >= 80 ? "text-amber-400" : "text-emerald-400"}>
                  {storageStatus.percentageUsed}%
                </strong>{" "}
                of Free Limit
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  storageStatus.percentageUsed >= 90
                    ? "bg-rose-500"
                    : storageStatus.percentageUsed >= 80
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(storageStatus.percentageUsed, 100)}%` }}
              />
            </div>
          </div>

          {cleanupMessage && (
            <div className="mt-3 p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{cleanupMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* 2. Four KPI Stat Cards (Direct Database Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">

        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          trendLabel="in database"
          icon={Users}
          color="primary"
          loading={loading}
        />
        <StatCard
          title="Total Staff"
          value={stats.totalStaff}
          trendLabel="registered faculty"
          icon={GraduationCap}
          color="info"
          loading={loading}
        />
        <StatCard
          title="Today's Attendance"
          value={stats.todayAttendance}
          trendLabel="today's turnout"
          icon={CalendarCheck}
          color="success"
          loading={loading}
        />
        <StatCard
          title="Low Attendance"
          value={stats.lowAttendance}
          trendLabel="below 75% target"
          icon={AlertTriangle}
          color="warning"
          trend="down"
          loading={loading}
        />
      </div>

      {/* 3. Analytics & Graph Grid (Donut Ratio & Bar Comparison) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 xl:col-span-4">
          <AttendanceRatioChart
            title="Today's Attendance Ratio"
            total={todayRatio.total}
            present={todayRatio.present}
            absent={todayRatio.absent}
            percentage={todayRatio.percentage}
            loading={loading}
          />
        </div>

        <div className="lg:col-span-7 xl:col-span-8">
          <VisualBarChart
            title="Department Live Attendance Graph"
            subtitle="Real-time attendance rate by department vs 75% institutional target"
            data={deptSummary}
            targetThreshold={75}
            loading={loading}
          />
        </div>
      </div>

      {/* 4. MUI Fast Shortcut Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Link
          to="/attendance"
          className="group p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                Mark Attendance
              </h4>
              <p className="text-xs text-slate-400">Class period rosters</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/reports"
          className="group p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                Attendance Reports
              </h4>
              <p className="text-xs text-slate-400">Summaries & exports</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/students"
          className="group p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                Students Directory
              </h4>
              <p className="text-xs text-slate-400">Profiles & enrolment</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to={user?.role === "STUDENT" ? "/student-attendance" : "/staff"}
          className="group p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                {user?.role === "STUDENT" ? "My Attendance" : "Staff Directory"}
              </h4>
              <p className="text-xs text-slate-400">
                {user?.role === "STUDENT" ? "Personal records" : "Faculty & designations"}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      {/* 5. MUI Modern Department Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Table Card Header with Search & Status Pills */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base tracking-tight">
                Department Attendance Breakdown
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                {deptSummary.length} Departments
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live departmental rate compared against 75% target threshold
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input within Table */}
            {deptSummary.length > 3 && (
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter department..."
                  value={deptSearch}
                  onChange={(e) => setDeptSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>
            )}

            {/* Quick Status Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {statusPills.map((item) => (
                <span
                  key={item.label}
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    item.variant === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200/80"
                      : "bg-rose-50 text-rose-800 border border-rose-200/80"
                  }`}
                >
                  {item.label}: <strong className="ml-1 font-bold">{item.count}</strong> ({item.percentage}%)
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Responsive Table Body */}
        <div className="overflow-x-auto min-h-[220px]">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th scope="col" className="pl-6 pr-4 py-3.5">
                  Department Name
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Enrolled Students
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Present Today
                </th>
                <th scope="col" className="px-4 py-3.5 min-w-[220px]">
                  Attendance Rate
                </th>
                <th scope="col" className="pl-4 pr-6 py-3.5 text-right">
                  Standing
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                // Zero-shake Skeleton rows
                [1, 2, 3, 4].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="pl-6 pr-4 py-4">
                      <div className="h-4 w-36 bg-slate-200 rounded-md" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-12 bg-slate-100 rounded-md" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-12 bg-slate-100 rounded-md" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-3 w-40 bg-slate-100 rounded-full" />
                    </td>
                    <td className="pl-4 pr-6 py-4 text-right">
                      <div className="h-5 w-20 bg-slate-100 rounded-full ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredDepartments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                    {deptSearch
                      ? `No department found matching "${deptSearch}"`
                      : "No departmental attendance records recorded yet today."}
                  </td>
                </tr>
              ) : (
                filteredDepartments.map((dept) => {
                  const rate = dept.attendanceRate || 0;
                  const isOptimal = rate >= 90;
                  const isGood = rate >= 75;

                  return (
                    <tr
                      key={dept.name}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="pl-6 pr-4 py-4 font-semibold text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                        {dept.name}
                      </td>
                      <td className="px-4 py-4 text-slate-600 font-medium">
                        {dept.total?.toLocaleString?.() || dept.total}
                      </td>
                      <td className="px-4 py-4 text-slate-600 font-medium">
                        {dept.present?.toLocaleString?.() || dept.present}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                isOptimal
                                  ? "bg-emerald-500"
                                  : isGood
                                  ? "bg-blue-600"
                                  : "bg-amber-500"
                              }`}
                              style={{ width: `${Math.min(rate, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-800 min-w-[42px] text-right">
                            {formatPercentage(rate)}
                          </span>
                        </div>
                      </td>
                      <td className="pl-4 pr-6 py-4 text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            isOptimal
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                              : isGood
                              ? "bg-blue-50 text-blue-700 border border-blue-200/80"
                              : "bg-amber-50 text-amber-700 border border-amber-200/80"
                          }`}
                        >
                          {isOptimal
                            ? "Optimal"
                            : isGood
                            ? "Satisfactory"
                            : "Attention"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
