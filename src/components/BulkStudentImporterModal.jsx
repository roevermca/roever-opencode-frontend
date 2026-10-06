import React, { useState, useRef } from "react";
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X,
  Loader2,
  FileText,
  RotateCcw,
} from "lucide-react";
import { STUDENT_DEPARTMENTS, isPgCourse } from "../data/students";
import { parseYear } from "../utils/formatters";
import studentService from "../services/studentService";

const BulkStudentImporterModal = ({
  isOpen,
  onClose,
  departments = [],
  courses = [],
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState("upload"); // "upload" | "paste"
  const [pastedText, setPastedText] = useState("");
  const [fileName, setFileName] = useState("");
  const [parsedRows, setParsedRows] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Handle template download
  const handleDownloadTemplate = () => {
    const headers = [
      "Roll No",
      "Student Name",
      "Email",
      "Phone",
      "Department",
      "Course",
      "Level",
      "Year",
      "Section",
    ];

    const sampleRows = [
      [
        "23UCA101",
        "Aravind K",
        "aravind.k@roever.edu.in",
        "9876543210",
        "Computer Applications",
        "BCA",
        "UG",
        "1",
        "A",
      ],
      [
        "23UCS102",
        "Kavitha M",
        "kavitha.m@roever.edu.in",
        "9876543211",
        "Computer Science",
        "B.Sc Computer Science",
        "UG",
        "1",
        "A",
      ],
      [
        "23UCM103",
        "Saravanan R",
        "saravanan.r@roever.edu.in",
        "9876543212",
        "Commerce",
        "B.Com General",
        "UG",
        "1",
        "B",
      ],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...sampleRows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "roever_students_batch_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parser helper
  const parseCSVContent = (content) => {
    const lines = content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 2) {
      setParsedRows([]);
      return;
    }

    // Determine delimiter (comma or tab or semicolon)
    const firstLine = lines[0];
    let delimiter = ",";
    if (firstLine.includes("\t")) delimiter = "\t";
    else if (firstLine.includes(";") && !firstLine.includes(",")) delimiter = ";";

    const headers = lines[0]
      .split(delimiter)
      .map((h) => h.replace(/^["']|["']$/g, "").trim().toLowerCase());

    const findCol = (keys) => {
      return headers.findIndex((h) => keys.some((k) => h === k || h.includes(k)));
    };

    const rollIdx = findCol(["roll", "reg", "register"]);
    const nameIdx = findCol(["name", "student"]);
    const emailIdx = findCol(["email", "mail"]);
    const phoneIdx = findCol(["phone", "mobile", "contact"]);
    const deptIdx = findCol(["dept", "department"]);
    const courseIdx = findCol(["course", "degree", "branch"]);
    const levelIdx = findCol(["level", "program"]);
    const yearIdx = findCol(["year", "yr"]);
    const secIdx = findCol(["section", "sec"]);

    const deptList =
      departments.length > 0
        ? departments
        : STUDENT_DEPARTMENTS.map((d) => ({ id: d, name: d }));

    const rows = [];
    const seenRollNos = new Set();

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i]
        .split(delimiter)
        .map((p) => p.replace(/^["']|["']$/g, "").trim());

      const rawRoll = rollIdx !== -1 ? parts[rollIdx] || "" : "";
      const rawName = nameIdx !== -1 ? parts[nameIdx] || "" : "";
      const rawEmail = emailIdx !== -1 ? parts[emailIdx] || "" : "";
      const rawPhone = phoneIdx !== -1 ? parts[phoneIdx] || "" : "";
      const rawDept = deptIdx !== -1 ? parts[deptIdx] || "" : "";
      const rawCourse = courseIdx !== -1 ? parts[courseIdx] || "" : "";
      const rawLevel = levelIdx !== -1 ? parts[levelIdx] || "" : "";
      const rawYear = yearIdx !== -1 ? parts[yearIdx] || "" : "1";
      const rawSec = secIdx !== -1 ? parts[secIdx] || "" : "A";

      const errors = [];

      // Validation
      if (!rawRoll) {
        errors.push("Missing Roll Number");
      } else if (seenRollNos.has(rawRoll.toUpperCase())) {
        errors.push("Duplicate Roll Number in file");
      } else {
        seenRollNos.add(rawRoll.toUpperCase());
      }

      if (!rawName) {
        errors.push("Missing Student Name");
      }

      if (!rawEmail) {
        errors.push("Missing Email");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
        errors.push("Invalid Email format");
      }

      // Department resolution
      let matchedDept = null;
      if (rawDept) {
        matchedDept = deptList.find(
          (d) =>
            d.name?.toLowerCase() === rawDept.toLowerCase() ||
            d.id?.toLowerCase() === rawDept.toLowerCase() ||
            d.code?.toLowerCase() === rawDept.toLowerCase() ||
            d.name?.toLowerCase().includes(rawDept.toLowerCase())
        );
      }

      const resolvedDeptId = matchedDept ? matchedDept.id : rawDept;
      const resolvedDeptName = matchedDept ? matchedDept.name : rawDept;

      if (!resolvedDeptId) {
        errors.push("Missing or invalid Department");
      }

      // Course resolution
      let matchedCourse = null;
      if (rawCourse && courses.length > 0) {
        matchedCourse = courses.find(
          (c) =>
            c.name?.toLowerCase() === rawCourse.toLowerCase() ||
            c.id?.toLowerCase() === rawCourse.toLowerCase() ||
            c.code?.toLowerCase() === rawCourse.toLowerCase()
        );
      }
      const resolvedCourseId = matchedCourse ? matchedCourse.id : rawCourse || resolvedDeptId;
      const resolvedCourseName = matchedCourse ? matchedCourse.name : rawCourse || resolvedDeptName;

      // Program Type / Level
      let programType = rawLevel ? rawLevel.toUpperCase() : "UG";
      if (!rawLevel) {
        programType = isPgCourse(resolvedCourseName) ? "PG" : "UG";
      }

      const yearNum = parseYear(rawYear) || 1;
      if (programType === "PG" && (yearNum < 1 || yearNum > 2)) {
        errors.push(`Invalid Year (${yearNum}) for PG program: maximum is 2 years`);
      } else if (programType === "UG" && (yearNum < 1 || yearNum > 3)) {
        errors.push(`Invalid Year (${yearNum}) for UG program: maximum is 3 years`);
      }
      const sectionStr = (rawSec || "A").trim().toUpperCase();

      rows.push({
        id: `row-${i}`,
        rollNo: rawRoll.trim().toUpperCase(),
        name: rawName.trim(),
        email: rawEmail.trim().toLowerCase(),
        phone: rawPhone.trim() || undefined,
        departmentId: resolvedDeptId,
        departmentName: resolvedDeptName,
        courseId: resolvedCourseId,
        courseName: resolvedCourseName,
        programType,
        year: yearNum,
        section: sectionStr,
        isValid: errors.length === 0,
        errors,
      });
    }

    setParsedRows(rows);
    setImportResult(null);
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      parseCSVContent(text);
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handlePasteParse = () => {
    if (!pastedText.trim()) return;
    setFileName("Pasted Data");
    parseCSVContent(pastedText.trim());
  };

  const handleReset = () => {
    setParsedRows([]);
    setFileName("");
    setPastedText("");
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validRows = parsedRows.filter((r) => r.isValid);
  const invalidRows = parsedRows.filter((r) => !r.isValid);

  const handleExecuteImport = async () => {
    if (validRows.length === 0) return;
    setIsProcessing(true);
    setImportResult(null);

    const payload = validRows.map((r) => ({
      rollNo: r.rollNo,
      name: r.name,
      email: r.email,
      phone: r.phone || undefined,
      departmentId: r.departmentId,
      courseId: r.courseId,
      programType: r.programType,
      year: r.year,
      section: r.section,
      active: true,
    }));

    try {
      // Send to bulk endpoint
      const res = await studentService.createStudentsBulk(payload);
      setImportResult({
        success: true,
        importedCount: res.importedCount ?? validRows.length,
        skippedCount: res.skippedCount ?? 0,
        errors: res.errors || [],
      });
      if (onSuccess) {
        onSuccess(res.importedCount ?? validRows.length);
      }
    } catch (err) {
      setImportResult({
        success: false,
        message: err.message || "Failed to process bulk import on server.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-4 max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Bulk Student Batch Importer
              </h2>
              <p className="text-xs text-slate-500">
                Quickly register student cohorts via CSV or Excel export
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              Download Sample CSV
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-grow space-y-5">
          {/* Tabs for Upload vs Paste */}
          <div className="flex items-center border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "upload"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Upload CSV File
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("paste")}
              className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "paste"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Paste Tabular Data
            </button>
          </div>

          {/* Upload Area */}
          {activeTab === "upload" && (
            <div>
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-blue-500 bg-blue-50/50"
                    : "border-slate-300 hover:border-blue-400 bg-slate-50/40 hover:bg-blue-50/20"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">
                  {fileName ? fileName : "Drag & drop your student CSV file here"}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Supports comma-delimited (.csv) and tab-delimited (.txt) files. You can export directly from Microsoft Excel or Google Sheets.
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-2xs hover:bg-blue-700 transition-colors">
                    Browse Files
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Paste Area */}
          {activeTab === "paste" && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Paste student rows (include header row: Roll No, Name, Email, Department, Course, Year, Section)
              </label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                rows={5}
                placeholder="Roll No,Student Name,Email,Phone,Department,Course,Level,Year,Section&#10;23UCA101,Aravind K,aravind.k@roever.edu.in,9876543210,Computer Applications,BCA,UG,1,A"
                className="w-full font-mono text-xs p-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handlePasteParse}
                  disabled={!pastedText.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Parse & Preview
                </button>
              </div>
            </div>
          )}

          {/* Summary Indicator Strip */}
          {parsedRows.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-600">
                  Total Parsed: <strong className="text-slate-900">{parsedRows.length}</strong>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {validRows.length} Valid
                </span>
                {invalidRows.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {invalidRows.length} Issues
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            </div>
          )}

          {/* Result Banner */}
          {importResult && (
            <div
              className={`p-4 rounded-xl border text-sm ${
                importResult.success
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-rose-50 border-rose-200 text-rose-900"
              }`}
            >
              {importResult.success ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Successfully imported {importResult.importedCount} student(s)!</span>
                  </div>
                  {importResult.skippedCount > 0 && (
                    <p className="text-xs text-amber-800 mt-1">
                      {importResult.skippedCount} student(s) were skipped due to duplicate roll numbers.
                    </p>
                  )}
                  {importResult.errors?.length > 0 && (
                    <ul className="text-xs list-disc list-inside mt-2 text-rose-700 space-y-0.5">
                      {importResult.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{importResult.message}</span>
                </div>
              )}
            </div>
          )}

          {/* Preview Table */}
          {parsedRows.length > 0 && (
            <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-60 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-bold sticky top-0">
                  <tr>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Roll No</th>
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Email</th>
                    <th className="py-2 px-3">Department</th>
                    <th className="py-2 px-3">Course</th>
                    <th className="py-2 px-3">Year / Sec</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsedRows.map((row) => (
                    <tr
                      key={row.id}
                      className={row.isValid ? "hover:bg-slate-50" : "bg-rose-50/50"}
                    >
                      <td className="py-2 px-3">
                        {row.isValid ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Ready
                          </span>
                        ) : (
                          <span
                            title={row.errors.join(", ")}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200"
                          >
                            <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                            {row.errors[0]}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-bold text-slate-900">{row.rollNo || "—"}</td>
                      <td className="py-2 px-3 font-semibold text-slate-800">{row.name || "—"}</td>
                      <td className="py-2 px-3 text-slate-600">{row.email || "—"}</td>
                      <td className="py-2 px-3 text-slate-700">{row.departmentName || "—"}</td>
                      <td className="py-2 px-3 text-slate-600">{row.courseName || "—"}</td>
                      <td className="py-2 px-3 text-slate-600">
                        {row.year ? `Yr ${row.year}` : "—"} (Sec {row.section})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/70">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            {importResult?.success ? "Close" : "Cancel"}
          </button>

          <div className="flex items-center gap-2">
            {importResult?.success ? (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Done
              </button>
            ) : (
              <button
                type="button"
                disabled={validRows.length === 0 || isProcessing}
                onClick={handleExecuteImport}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Importing Students...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Import {validRows.length} Valid Student{validRows.length === 1 ? "" : "s"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkStudentImporterModal;
