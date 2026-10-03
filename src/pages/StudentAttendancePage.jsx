import React, { useState, useEffect } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Clock,
  User,
  AlertCircle,
  RotateCcw,
  Loader2,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import AttendanceRatioChart from "../components/AttendanceRatioChart";
import { useAuth } from "../context/AuthContext";
import attendanceService from "../services/attendanceService";
import studentService from "../services/studentService";
import { formatPercentage, formatPeriod } from "../utils/formatters";

const StudentAttendancePage = () => {
  const { user } = useAuth();
  const rollNo = user?.rollNo || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [historyRecords, setHistoryRecords] = useState([]);

  const loadStudentData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Find student record if studentId not directly on user
      let studentId = user?.studentId;
      if (!studentId) {
        const studentLookup = await studentService.getStudents({
          search: user?.email || rollNo,
          size: 1,
        }).catch(() => null);

        if (studentLookup?.data && studentLookup.data.length > 0) {
          studentId = studentLookup.data[0].id;
        }
      }

      if (studentId) {
        const [sumRes, attRes] = await Promise.all([
          attendanceService.getStudentSummary(studentId).catch(() => null),
          attendanceService.getStudentAttendance(studentId, { page: 0, size: 50 }).catch(() => null),
        ]);

        if (sumRes) {
          setSummary({
            total: sumRes.totalClasses || 0,
            present: sumRes.present || 0,
            absent: sumRes.absent || 0,
            rate: sumRes.percentage || 0,
          });
        }

        if (attRes?.data) {
          setHistoryRecords(
            attRes.data.map((r) => ({
              id: r.id,
              date: r.date,
              period: formatPeriod(r.period),
              status: r.status === "PRESENT" ? "Present" : "Absent",
              markedBy: r.markedBy || "Faculty Staff",
              markedTime: r.markedAt ? new Date(r.markedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
            }))
          );
        }
      } else {
        setSummary({ total: 0, present: 0, absent: 0, rate: 0 });
        setHistoryRecords([]);
      }
    } catch (err) {
      setError(err.message || "Failed to load student attendance record.");
      setSummary({ total: 0, present: 0, absent: 0, rate: 0 });
      setHistoryRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentData();
  }, [rollNo, user?.email]);

  const totalPeriods = summary?.total || 0;
  const presentPeriods = summary?.present || 0;
  const absentPeriods = summary?.absent || 0;
  const attendanceRate = summary?.rate || 0;

  return (
    <div>
      <PageHeader
        title="My Attendance Portal"
        description="Personal student attendance records, period logs, and compliance rate."
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
            onClick={loadStudentData}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Student Profile Card */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-full bg-blue-100 text-blue-700 font-bold text-lg flex items-center justify-center border border-blue-200 shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {user?.displayName || "Student Name"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Roll No: <strong className="text-slate-700">{rollNo}</strong> &bull; Department:{" "}
                <strong className="text-slate-700">{user?.department || "Computer Science"}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Compliance:</span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                attendanceRate >= 75
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : "bg-rose-100 text-rose-800 border-rose-200"
              }`}
            >
              {attendanceRate >= 75 ? "Eligible for Exams" : "Attendance Low (<75%)"}
            </span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <StatCard
          title="Total Sessions"
          value={totalPeriods}
          change="Recorded periods"
          icon={CalendarCheck}
          color="primary"
        />
        <StatCard
          title="Present"
          value={presentPeriods}
          change="Attended sessions"
          icon={CheckCircle2}
          color="success"
        />
        <StatCard
          title="Absent"
          value={absentPeriods}
          change="Missed sessions"
          icon={XCircle}
          color="danger"
        />
        <StatCard
          title="Attendance Rate"
          value={formatPercentage(attendanceRate)}
          change={attendanceRate >= 75 ? "On track (>=75%)" : "Warning: Below 75%"}
          icon={TrendingUp}
          color={attendanceRate >= 75 ? "success" : "warning"}
        />
      </div>

      {/* Personal Attendance Distribution Visual Graph */}
      <div className="mb-6">
        <AttendanceRatioChart
          title="Personal Attendance Distribution"
          total={totalPeriods}
          present={presentPeriods}
          absent={absentPeriods}
          percentage={attendanceRate}
        />
      </div>

      {/* 75% Semester Exam Eligibility Forecaster & Calculator Card */}
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-slate-200/80 p-5 sm:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Semester Examination Eligibility Forecaster (75% Rule)
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  attendanceRate >= 75
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : attendanceRate >= 65
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                {attendanceRate >= 75
                  ? "Eligible (≥75%)"
                  : attendanceRate >= 65
                  ? "Condonation Required (65-74%)"
                  : "Attendance Shortage (<65%)"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Thanthai Hans Roever College (Autonomous) semester exam clearance criteria
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">
          {/* Standing & Calculation advice */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Official Standing Status
              </span>
              {totalPeriods === 0 ? (
                <p className="text-sm text-slate-600">
                  No attendance records logged yet this semester.
                </p>
              ) : attendanceRate >= 75 ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-emerald-900">
                    🎉 Excellent! You currently meet the mandatory 75% requirement to appear for semester end examinations.
                  </p>
                  <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                    <strong>Safe Absence Buffer:</strong> You can safely miss up to{" "}
                    <span className="text-emerald-700 font-bold text-sm">
                      {Math.max(0, Math.floor((4 * presentPeriods - 3 * totalPeriods) / 3))}
                    </span>{" "}
                    more class periods without dropping below 75%.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-rose-900">
                    ⚠️ Attention: Your attendance is currently {formatPercentage(attendanceRate)}, which is below the mandatory 75% requirement.
                  </p>
                  <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                    <strong>Recovery Plan:</strong> You need to attend{" "}
                    <span className="text-rose-600 font-bold text-sm">
                      {Math.max(1, Math.ceil(3 * totalPeriods - 4 * presentPeriods))}
                    </span>{" "}
                    consecutive class periods without any absences to reach the 75% exam clearance mark.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
              <span>Exam Cutoff: <strong>75.0%</strong></span>
              <span>Condonation Range: <strong>65.0% - 74.9%</strong></span>
            </div>
          </div>

          {/* Interactive What-If Simulator */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">
                Interactive "What-If" Calculator
              </span>
              <p className="text-xs text-blue-700 mb-3">
                Simulate your percentage if you attend the upcoming classes:
              </p>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-2.5 bg-white rounded-lg border border-blue-200 text-center">
                  <span className="text-[11px] text-slate-400 block">Upcoming Classes: 5</span>
                  <span className="text-base font-bold text-blue-900">
                    {totalPeriods > 0
                      ? `${Math.round(((presentPeriods + 5) / (totalPeriods + 5)) * 100)}%`
                      : "100%"}
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-blue-200 text-center">
                  <span className="text-[11px] text-slate-400 block">Upcoming Classes: 10</span>
                  <span className="text-base font-bold text-blue-900">
                    {totalPeriods > 0
                      ? `${Math.round(((presentPeriods + 10) / (totalPeriods + 10)) * 100)}%`
                      : "100%"}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              * Based on Bharathidasan University Autonomous Regulations for Thanthai Hans Roever College.
            </p>
          </div>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h2 className="font-bold text-slate-800 text-base">
            Recorded Session Log
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Latest periods
          </span>
        </div>

        <div>
          {loading ? (
            <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-medium text-slate-500">
                Loading attendance log...
              </p>
            </div>
          ) : historyRecords.length === 0 ? (
            <EmptyState
              title="No session history"
              message="No attendance sessions have been recorded for your student profile yet."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="pl-5 pr-3 py-3.5">
                      Date & Period
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Status
                    </th>
                    <th scope="col" className="pl-4 pr-5 py-3.5 text-right">
                      Recorded Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historyRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="pl-5 pr-3 py-3.5">
                        <div className="font-semibold text-slate-800">
                          {r.date}
                        </div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 text-[11px] font-semibold bg-blue-100 text-blue-800 rounded-md">
                          {r.period}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="pl-4 pr-5 py-3.5 text-right">
                        <div className="font-medium text-slate-800">
                          {r.markedBy}
                        </div>
                        {r.markedTime && (
                          <div className="inline-flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{r.markedTime}</span>
                          </div>
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
    </div>
  );
};

export default StudentAttendancePage;
