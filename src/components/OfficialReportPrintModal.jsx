import React, { useRef } from "react";
import { Printer, X, Download, ShieldCheck, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { formatPercentage } from "../utils/formatters";

/**
 * Official Printable Report for Thanthai Hans Roever College (Autonomous).
 * Generates an institutional audit-ready ledger with college header, seals,
 * student attendance ledger, OD hours, exam clearance status, and HOD/Principal signoff blocks.
 */
const OfficialReportPrintModal = ({
  isOpen,
  onClose,
  data = [],
  filters = {},
  overallReport = {},
}) => {
  const printAreaRef = useRef(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalStudents = data.length;
  const eligibleCount = data.filter((s) => (s.attendanceRate || 0) >= 75).length;
  const condonationCount = data.filter(
    (s) => (s.attendanceRate || 0) >= 65 && (s.attendanceRate || 0) < 75
  ).length;
  const detainedCount = data.filter((s) => (s.attendanceRate || 0) < 65).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="relative bg-white rounded-2xl w-full max-w-5xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-4 max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:my-0">
        {/* Modal Controls Bar (Hidden during Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Official Institutional Attendance Statement
              </h2>
              <p className="text-xs text-slate-400">
                Thanthai Hans Roever College (Autonomous) Audit & Examination Format
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div
          ref={printAreaRef}
          className="p-6 sm:p-10 overflow-y-auto flex-grow bg-white text-slate-900 print:p-0 print:overflow-visible"
        >
          {/* 1. Official College Letterhead */}
          <div className="text-center border-b-2 border-slate-800 pb-5 mb-6">
            <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-1.5">
              Autonomous College • Affiliated to Bharathidasan University
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight font-serif">
              THANTHAI HANS ROEVER COLLEGE (AUTONOMOUS)
            </h1>
            <p className="text-xs font-semibold text-slate-600 tracking-wide mt-0.5">
              (Re-Accredited with &lsquo;A&rsquo; Grade by NAAC | Recognized by UGC under Section 2(f) & 12(B))
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Elambalur (P.O), Perambalur – 621 220, Tamil Nadu, India
            </p>
            <div className="mt-3 pt-2 border-t border-slate-300 inline-block px-6">
              <h2 className="text-sm font-extrabold text-blue-950 uppercase tracking-wider">
                OFFICIAL ATTENDANCE & SEMESTER EXAMINATION ELIGIBILITY STATEMENT
              </h2>
            </div>
          </div>

          {/* 2. Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-6">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Department
              </span>
              <strong className="text-slate-900 text-sm">
                {filters.department || "All Departments"}
              </strong>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Academic Program / Year
              </span>
              <strong className="text-slate-900 text-sm">
                {filters.year ? `Year ${filters.year}` : "All Years"} {filters.section ? `(Sec ${filters.section})` : ""}
              </strong>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Date Period
              </span>
              <strong className="text-slate-900 text-sm">
                {filters.startDate ? `${filters.startDate} to ${filters.endDate || "Present"}` : "Full Semester"}
              </strong>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Generated Date
              </span>
              <strong className="text-slate-900 text-sm">{todayStr}</strong>
            </div>
          </div>

          {/* 3. Statistical Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Students</span>
              <span className="text-lg font-black text-slate-900">{totalStudents}</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-emerald-700 font-bold uppercase block">Exam Eligible (≥75%)</span>
              <span className="text-lg font-black text-emerald-800">{eligibleCount}</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-[10px] text-amber-700 font-bold uppercase block">Condonation (65-74%)</span>
              <span className="text-lg font-black text-amber-800">{condonationCount}</span>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
              <span className="text-[10px] text-rose-700 font-bold uppercase block">Detained (&lt;65%)</span>
              <span className="text-lg font-black text-rose-800">{detainedCount}</span>
            </div>
          </div>

          {/* 4. Tabular Ledger */}
          <div className="overflow-x-auto border border-slate-300 rounded-xl mb-8">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700 uppercase">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center border-r border-slate-200">#</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 w-28">Roll Number</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">Student Name</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-200 w-16">Total</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-200 w-16 text-emerald-800">Present</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-200 w-16 text-purple-800">OD</th>
                  <th className="py-2.5 px-2 text-center border-r border-slate-200 w-16 text-rose-800">Absent</th>
                  <th className="py-2.5 px-3 text-right border-r border-slate-200 w-20">Rate %</th>
                  <th className="py-2.5 px-3 text-center w-28">Exam Clearance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.map((st, idx) => {
                  const rate = st.attendanceRate ?? st.percentage ?? 0;
                  const isEligible = rate >= 75;
                  const isCondonation = rate >= 65 && rate < 75;

                  return (
                    <tr key={st.rollNo || st.studentId || idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-center border-r border-slate-200 text-slate-500 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 font-bold text-slate-900">
                        {st.rollNo}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 font-semibold text-slate-800">
                        {st.name}
                      </td>
                      <td className="py-2 px-2 text-center border-r border-slate-200 text-slate-600 font-medium">
                        {st.totalPeriods || st.total || 0}
                      </td>
                      <td className="py-2 px-2 text-center border-r border-slate-200 font-bold text-emerald-700">
                        {st.present || 0}
                      </td>
                      <td className="py-2 px-2 text-center border-r border-slate-200 font-bold text-purple-700">
                        {st.onDuty || 0}
                      </td>
                      <td className="py-2 px-2 text-center border-r border-slate-200 font-bold text-rose-700">
                        {st.absent || 0}
                      </td>
                      <td className="py-2 px-3 text-right border-r border-slate-200 font-extrabold text-slate-900">
                        {formatPercentage(rate)}
                      </td>
                      <td className="py-2 px-3 text-center font-bold">
                        {isEligible ? (
                          <span className="text-emerald-700">ELIGIBLE</span>
                        ) : isCondonation ? (
                          <span className="text-amber-700">CONDONATION</span>
                        ) : (
                          <span className="text-rose-700">DETAINED</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 5. Institutional Signatures Block */}
          <div className="mt-12 pt-6 border-t border-slate-300">
            <div className="grid grid-cols-3 gap-6 text-center text-xs">
              <div>
                <div className="h-16 flex items-end justify-center pb-2">
                  <span className="w-40 border-b border-dashed border-slate-400" />
                </div>
                <p className="font-bold text-slate-900">Class Advisor / Tutor</p>
                <p className="text-[11px] text-slate-500">Thanthai Hans Roever College</p>
              </div>

              <div>
                <div className="h-16 flex items-end justify-center pb-2">
                  <span className="w-40 border-b border-dashed border-slate-400" />
                </div>
                <p className="font-bold text-slate-900">Head of the Department (HOD)</p>
                <p className="text-[11px] text-slate-500">Department of {filters.department || "Academic"}</p>
              </div>

              <div>
                <div className="h-16 flex items-end justify-center pb-2">
                  <span className="w-40 border-b border-dashed border-slate-400" />
                </div>
                <p className="font-bold text-slate-900">Principal / COE</p>
                <p className="text-[11px] text-slate-500">Autonomous Examination Cell</p>
              </div>
            </div>

            <div className="mt-8 text-center text-[10px] text-slate-400">
              * This is an officially generated computer record of Thanthai Hans Roever College (Autonomous). Any alteration or unauthorized overwriting renders this document invalid.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialReportPrintModal;
