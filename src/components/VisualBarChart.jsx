import React, { useState, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  Activity,
  Users,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

/**
 * Modern MUI X-style Live Department Analytics Graph.
 * Lightweight, pure SVG + React (0 external chart library bloat).
 * Supports:
 * - Dual Metrics: "Students Headcount" & "Turnout Rate (%)"
 * - Dual Views: "Bar Chart" & "Smooth Spline Area Trend"
 * - Real-time student count and percentage reflections on deletion/addition
 * - Benchmark line at 75% target threshold (or headcount baseline)
 */
const VisualBarChart = ({
  title = "Department Live Attendance Graph",
  subtitle = "Real-time attendance rate and student headcount by department",
  data = [],
  targetThreshold = 75,
  loading = false,
}) => {
  const [metricMode, setMetricMode] = useState("headcount"); // "headcount" | "rate"
  const [chartMode, setChartMode] = useState("bar"); // "bar" | "area"
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "optimal" | "atRisk"
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Purely dynamic data from database (no mock fallback data)
  const chartData = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  // Overall student headcount across all departments
  const totalEnrolledStudents = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
  }, [chartData]);

  // Overall average rate
  const averageRate = useMemo(() => {
    if (chartData.length === 0) return 0;
    const sum = chartData.reduce(
      (acc, curr) => acc + (Number(curr.value ?? curr.attendanceRate) || 0),
      0
    );
    return Math.round(sum / chartData.length);
  }, [chartData]);

  // Dynamic maximum student count for headcount bar scaling
  const maxStudentCount = useMemo(() => {
    const counts = chartData.map((d) => Number(d.total) || 0);
    const max = Math.max(...counts, 0);
    return max > 0 ? Math.ceil(max * 1.15) : 10;
  }, [chartData]);

  // Filtered dataset based on quick pills
  const filteredData = useMemo(() => {
    if (activeFilter === "optimal") {
      return chartData.filter(
        (d) => (Number(d.value ?? d.attendanceRate) || 0) >= 90
      );
    }
    if (activeFilter === "atRisk") {
      return chartData.filter(
        (d) => (Number(d.value ?? d.attendanceRate) || 0) < targetThreshold
      );
    }
    return chartData;
  }, [chartData, activeFilter, targetThreshold]);

  // Chart dimensions & scaling
  const chartHeight = 220;
  const paddingLeft = 44;
  const paddingRight = 24;
  const totalItems = filteredData.length;
  const svgWidth = Math.max(totalItems * 68, 520);
  const innerWidth = svgWidth - paddingLeft - paddingRight;

  // Y-axis tick values
  const yTicks = useMemo(() => {
    if (metricMode === "rate") {
      return [100, 75, 50, 25, 0];
    }
    const step = Math.max(Math.ceil(maxStudentCount / 4), 1);
    return [step * 4, step * 3, step * 2, step, 0];
  }, [metricMode, maxStudentCount]);

  // Compute point coordinates for Smooth Spline / Area Chart
  const points = useMemo(() => {
    const yMax = yTicks[0] || (metricMode === "rate" ? 100 : 10);
    return filteredData.map((item, idx) => {
      const rate = Math.min(
        Math.max(Number(item.value ?? item.attendanceRate) || 0, 0),
        100
      );
      const studentCount = Number(item.total) || 0;
      const currentVal = metricMode === "rate" ? rate : studentCount;
      const x =
        paddingLeft +
        (totalItems > 1
          ? (idx / (totalItems - 1)) * innerWidth
          : innerWidth / 2);
      const y = chartHeight - (currentVal / yMax) * chartHeight;
      return { x, y, currentVal, rate, studentCount, item, idx };
    });
  }, [filteredData, metricMode, yTicks, innerWidth, totalItems, chartHeight]);

  // Generate smooth cubic bezier SVG curve string (spline)
  const generateSmoothPath = (pts) => {
    if (pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let path = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return path;
  };

  const smoothLinePath = generateSmoothPath(points);
  const smoothAreaPath =
    points.length > 0
      ? `${smoothLinePath} L ${points[points.length - 1].x},${chartHeight} L ${points[0].x},${chartHeight} Z`
      : "";

  if (loading) {
    return (
      <div className="h-[380px] bg-white rounded-2xl border border-slate-200/80 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] animate-pulse flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="h-5 w-56 bg-slate-200 rounded-md" />
          <div className="h-8 w-32 bg-slate-200 rounded-xl" />
        </div>
        <div className="flex items-end justify-between gap-3 h-52 pt-8">
          {[40, 70, 90, 60, 85, 95, 75, 80].map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className="flex-1 bg-slate-200/80 rounded-t-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* 1. Header Section with Metric Mode & View Switchers */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              {title}
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              LIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        {/* Controls & Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Total Students Headcount Pill */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/70"
            title="Total active students enrolled across all departments"
          >
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>
              Total Roster:{" "}
              <strong className="text-blue-900">
                {totalEnrolledStudents.toLocaleString()}
              </strong>
            </span>
          </div>

          {/* Average Attendance Pill */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100/80 text-slate-700 border border-slate-200/70">
            <Activity className="w-3.5 h-3.5 text-slate-600" />
            <span>
              Avg Rate:{" "}
              <strong className="text-slate-900">{averageRate}%</strong>
            </span>
          </div>

          {/* Metric Selector Toggle (Students vs Rate) */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMetricMode("headcount")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                metricMode === "headcount"
                  ? "bg-white text-blue-600 shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Display graph by enrolled student headcount per department"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Students</span>
            </button>
            <button
              type="button"
              onClick={() => setMetricMode("rate")}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                metricMode === "rate"
                  ? "bg-white text-blue-600 shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Display graph by attendance turnout percentage"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Rate (%)</span>
            </button>
          </div>

          {/* Chart Display Mode Toggle (Bars vs Area Trend) */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setChartMode("bar")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                chartMode === "bar"
                  ? "bg-white text-slate-900 shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Bars</span>
            </button>
            <button
              type="button"
              onClick={() => setChartMode("area")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                chartMode === "area"
                  ? "bg-white text-slate-900 shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trend</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Secondary Filter Tabs */}
      <div className="px-5 sm:px-6 py-2.5 bg-slate-50/60 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
              activeFilter === "all"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            All ({chartData.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("optimal")}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
              activeFilter === "optimal"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            ≥ 90% Optimal
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("atRisk")}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
              activeFilter === "atRisk"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            &lt; 75% Target
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span>Optimal (≥90%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
            <span>Good (75–89%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
            <span>Attention (&lt;75%)</span>
          </span>
        </div>
      </div>

      {/* 3. Main Chart Canvas Area */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-end overflow-x-auto min-h-[300px]">
        {chartData.length === 0 ? (
          <div className="h-[260px] flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Users className="w-6 h-6 stroke-[1.75]" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              No Department Records Available
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Add students in the Students directory to populate live departmental statistics and turnout curves.
            </p>
          </div>
        ) : (
          <div
            style={{ width: "100%", minWidth: svgWidth, height: chartHeight + 65 }}
            className="relative select-none"
          >
            {/* Y-Axis Horizontal Grid Lines */}
            {yTicks.map((tick) => {
              const yMax = yTicks[0] || (metricMode === "rate" ? 100 : 10);
              const topPos = chartHeight - (tick / yMax) * chartHeight;
              const isTarget = metricMode === "rate" && tick === targetThreshold;

              return (
                <div
                  key={tick}
                  style={{ top: topPos }}
                  className="absolute left-0 right-0 flex items-center pointer-events-none z-10"
                >
                  <span
                    className={`w-9 text-right pr-2.5 text-[10px] ${
                      isTarget
                        ? "text-amber-600 font-bold"
                        : "text-slate-400 font-medium"
                    }`}
                  >
                    {tick}
                    {metricMode === "rate" ? "%" : ""}
                  </span>
                  <div
                    className={`flex-1 ${
                      isTarget
                        ? "border-b-2 border-dashed border-amber-400"
                        : "border-b border-slate-100"
                    }`}
                  />
                  {isTarget && (
                    <span className="ml-2 text-[10px] font-bold text-amber-800 bg-amber-100/90 border border-amber-200 px-2 py-0.5 rounded-full shadow-2xs">
                      75% Benchmark Target
                    </span>
                  )}
                </div>
              );
            })}

            {/* MODE 1: Smooth Area Spline Chart */}
            {chartMode === "area" && (
              <div className="absolute inset-0 z-20 pointer-events-auto">
                <svg
                  className="w-full h-full"
                  viewBox={`0 0 ${svgWidth} ${chartHeight + 65}`}
                >
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.32" />
                      <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>

                    <linearGradient id="curveStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="50%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>

                  {smoothAreaPath && (
                    <path
                      d={smoothAreaPath}
                      fill="url(#areaGradient)"
                      className="transition-all duration-700 ease-out"
                    />
                  )}

                  {smoothLinePath && (
                    <path
                      d={smoothLinePath}
                      fill="none"
                      stroke="url(#curveStroke)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  )}

                  {points.map((pt, idx) => {
                    const isHovered = hoveredIndex === idx;
                    const isOptimal = pt.rate >= 90;
                    const isGood = pt.rate >= 75;
                    const nodeColor = isOptimal
                      ? "#10b981"
                      : isGood
                      ? "#2563eb"
                      : "#f43f5e";

                    return (
                      <g key={pt.item.label || idx} className="cursor-pointer">
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="18"
                          fill="transparent"
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        />

                        {isHovered && (
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="10"
                            fill={nodeColor}
                            opacity="0.25"
                            className="animate-ping"
                          />
                        )}

                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? "6" : "4.5"}
                          fill={nodeColor}
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          className="transition-all duration-200"
                        />

                        {/* Top Label */}
                        <text
                          x={pt.x}
                          y={Math.max(pt.y - 12, 14)}
                          textAnchor="middle"
                          className="text-[11px] font-bold fill-slate-700 select-none"
                        >
                          {metricMode === "rate"
                            ? `${pt.rate}%`
                            : `${pt.studentCount} std`}
                        </text>

                        {/* Bottom Label */}
                        <text
                          x={pt.x}
                          y={chartHeight + 20}
                          textAnchor="middle"
                          className="text-[11px] font-semibold fill-slate-500 select-none"
                        >
                          {pt.item.label || pt.item.name}
                        </text>

                        <text
                          x={pt.x}
                          y={chartHeight + 35}
                          textAnchor="middle"
                          className="text-[10px] font-medium fill-slate-400 select-none"
                        >
                          {metricMode === "headcount"
                            ? `${pt.rate}%`
                            : `${pt.studentCount} std`}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}

            {/* MODE 2: Interactive MUI Bar Chart */}
            {chartMode === "bar" && (
              <div
                style={{
                  height: chartHeight,
                  left: paddingLeft,
                  right: paddingRight,
                }}
                className="absolute bottom-11 flex items-end justify-around z-20 pointer-events-auto"
              >
                {filteredData.map((item, idx) => {
                  const rate = Math.min(
                    Math.max(Number(item.value ?? item.attendanceRate) || 0, 0),
                    100
                  );
                  const studentCount = Number(item.total) || 0;
                  const yMax =
                    yTicks[0] || (metricMode === "rate" ? 100 : 10);
                  const currentVal =
                    metricMode === "rate" ? rate : studentCount;
                  const barHeight =
                    yMax > 0 ? (currentVal / yMax) * chartHeight : 0;

                  const isOptimal = rate >= 90;
                  const isGood = rate >= 75;
                  const isHovered = hoveredIndex === idx;

                  const barColor = isOptimal
                    ? "bg-gradient-to-t from-emerald-600 to-emerald-400 hover:from-emerald-700 hover:to-emerald-500 text-emerald-700"
                    : isGood
                    ? "bg-gradient-to-t from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-blue-700"
                    : "bg-gradient-to-t from-rose-600 to-rose-400 hover:from-rose-700 hover:to-rose-500 text-rose-700";

                  return (
                    <div
                      key={item.label || idx}
                      className="relative flex flex-col items-center flex-1 max-w-[58px] mx-1 cursor-pointer group"
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Dynamic Top Stat: Students count or Percentage */}
                      <span
                        className={`text-[11px] font-bold mb-1 transition-transform group-hover:-translate-y-0.5 ${
                          metricMode === "headcount"
                            ? "text-blue-700"
                            : isOptimal
                            ? "text-emerald-700"
                            : isGood
                            ? "text-blue-700"
                            : "text-rose-700"
                        }`}
                      >
                        {metricMode === "headcount" ? (
                          <>
                            {studentCount}{" "}
                            <span className="text-[9px] font-medium text-slate-400">
                              std
                            </span>
                          </>
                        ) : (
                          `${rate}%`
                        )}
                      </span>

                      {/* MUI-styled rounded bar */}
                      <div
                        style={{
                          height: Math.max(barHeight, studentCount > 0 ? 8 : 4),
                        }}
                        className={`w-full rounded-t-xl transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.06)] group-hover:shadow-[0_4px_16px_rgba(37,99,235,0.25)] group-hover:scale-y-[1.02] origin-bottom ${
                          studentCount === 0
                            ? "bg-slate-200/80"
                            : barColor.split(" ").slice(0, 4).join(" ")
                        }`}
                      />

                      {/* Label below bar */}
                      <span
                        className="mt-2 text-[11px] font-bold text-slate-700 max-w-[54px] sm:max-w-[65px] truncate text-center group-hover:text-blue-600 transition-colors"
                        title={item.name || item.label}
                      >
                        {item.label || item.name}
                      </span>

                      {/* Sub-label below bar */}
                      <span className="text-[10px] text-slate-400 font-medium">
                        {metricMode === "headcount"
                          ? `${rate}%`
                          : `${studentCount} std`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 4. Interactive MUI Floating Card Tooltip */}
            {hoveredIndex !== null && filteredData[hoveredIndex] && (
              <div
                style={{
                  left: `${Math.min(
                    Math.max(
                      (hoveredIndex / Math.max(filteredData.length - 1, 1)) *
                        80 +
                        10,
                      10
                    ),
                    85
                  )}%`,
                  top: "10px",
                }}
                className="absolute z-40 transform -translate-x-1/2 bg-slate-950/95 text-white rounded-2xl p-3 sm:p-4 shadow-[0_12px_32px_rgba(0,0,0,0.3)] border border-slate-700/60 backdrop-blur-md pointer-events-none min-w-[220px] animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h4 className="font-bold text-xs sm:text-sm text-white truncate max-w-[150px]">
                    {filteredData[hoveredIndex].name ||
                      filteredData[hoveredIndex].label}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      (Number(
                        filteredData[hoveredIndex].value ??
                          filteredData[hoveredIndex].attendanceRate
                      ) || 0) >= 75
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    {(Number(
                      filteredData[hoveredIndex].value ??
                        filteredData[hoveredIndex].attendanceRate
                    ) || 0) >= 75
                      ? "Target Met"
                      : "Attention"}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Users className="w-3.5 h-3.5 text-blue-400" /> Enrolled
                      Students:
                    </span>
                    <span className="font-extrabold text-white text-sm">
                      {Number(filteredData[hoveredIndex].total) || 0} Students
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Turnout Rate:</span>
                    <span className="font-bold text-emerald-400">
                      {Number(
                        filteredData[hoveredIndex].value ??
                          filteredData[hoveredIndex].attendanceRate
                      ) || 0}
                      %
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1.5 border-t border-slate-800">
                    <span>Present / Absent:</span>
                    <span className="font-medium text-slate-200">
                      {Number(filteredData[hoveredIndex].present) || 0} Present /{" "}
                      {Number(filteredData[hoveredIndex].absent) || 0} Absent
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualBarChart;
