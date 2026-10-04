import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  User,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import SearchFilter from "../components/SearchFilter";
import DataTable from "../components/DataTable";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import BulkStudentImporterModal from "../components/BulkStudentImporterModal";
import { useAuth } from "../context/AuthContext";
import studentService from "../services/studentService";
import departmentService from "../services/departmentService";
import courseService from "../services/courseService";
import {
  STUDENT_DEPARTMENTS,
  STUDENT_LEVELS,
  STUDENT_YEARS,
  STUDENT_SECTIONS,
  STUDENT_STATUSES,
  DEPARTMENT_COURSES,
  getCoursesForDepartment,
} from "../data/students";
import { parseYear, formatYear } from "../utils/formatters";

// Clean any legacy mock storage on load
try {
  localStorage.removeItem("ams_mock_students_list");
} catch {
  // ignore
}

const emptyStudentForm = {
  rollNo: "",
  name: "",
  email: "",
  phone: "",
  departmentId: "",
  courseId: "",
  level: "UG",
  year: "1st Year",
  section: "A",
  status: "Active",
};

const StudentsPage = () => {
  const { user } = useAuth();

  // Role permissions
  const isStaff = user?.role === "STAFF";
  const isStudent = user?.role === "STUDENT";
  const isHod = user?.role === "HOD";
  const canManage = !isStaff && !isStudent;

  // Data & loading states
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Metadata
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  // Filters & search
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState(isHod ? user?.department || "" : "");
  const [courseFilter, setCourseFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(emptyStudentForm);
  const [formErrors, setFormErrors] = useState({});
  const [detailsStudent, setDetailsStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Feedback notification
  const [notification, setNotification] = useState("");

  const location = useLocation();

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification("");
    }, 3500);
  };

  // Open modal if action=new query param is present
  useEffect(() => {
    if (location.search.includes("action=new") && canManage) {
      handleOpenAdd();
    }
  }, [location.search, canManage]);

  // Load departments & courses metadata
  useEffect(() => {
    let isMounted = true;
    async function loadMeta() {
      try {
        const [deptRes, courseRes] = await Promise.all([
          departmentService.getDepartments().catch(() => []),
          courseService.getCourses().catch(() => []),
        ]);
        if (isMounted) {
          if (Array.isArray(deptRes) && deptRes.length > 0) setDepartments(deptRes);
          if (Array.isArray(courseRes) && courseRes.length > 0) setCourses(courseRes);
        }
      } catch {
        // Silently use defaults
      }
    }
    loadMeta();
    return () => {
      isMounted = false;
    };
  }, []);

  // Staff assigned course display
  const staffCourseDisplay = React.useMemo(() => {
    if (!isStaff || !user?.courseId) return "";
    const matched = courses.find(
      (c) =>
        c.id === user.courseId ||
        c.code === user.courseId ||
        c.name?.toLowerCase() === user.courseId.toLowerCase()
    );
    return matched ? matched.name : user.courseId;
  }, [isStaff, user?.courseId, courses]);

  // Fetch students from backend with search debounce
  const searchTimeoutRef = useRef(null);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);

    // If STAFF, strictly lock courseId to user's assigned course
    let activeCourse = courseFilter || undefined;
    let activeDept = deptFilter || undefined;

    if (isStaff && user?.courseId) {
      activeCourse = user.courseId;
      activeDept = undefined; // backend isolates uniquely by staff course
    }

    const params = {
      search: searchTerm.trim() || undefined,
      departmentId: activeDept,
      courseId: activeCourse,
      programType: levelFilter || undefined,
      year: parseYear(yearFilter),
      section: sectionFilter || undefined,
      page: currentPage - 1,
      size: pageSize,
    };

    try {
      const res = await studentService.getStudents(params);
      if (res && Array.isArray(res.data)) {
        setStudents(res.data);
        setTotalPages(res.totalPages || 1);
        setTotalElements(res.totalElements || res.data.length);
      } else {
        setStudents([]);
        setTotalPages(1);
        setTotalElements(0);
      }
    } catch (err) {
      setError(err?.message || "Failed to load students from database.");
      setStudents([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      fetchStudents();
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [
    searchTerm,
    deptFilter,
    courseFilter,
    levelFilter,
    yearFilter,
    sectionFilter,
    currentPage,
  ]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setDeptFilter(isHod ? user?.department || "" : "");
    setCourseFilter("");
    setLevelFilter("");
    setYearFilter("");
    setSectionFilter("");
    setCurrentPage(1);
  };

  // Form Handling
  const handleOpenAdd = () => {
    setFormData({
      ...emptyStudentForm,
      departmentId: isHod ? user?.department || "" : "",
      courseId: "",
    });
    setFormErrors({});
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (student) => {
    const matchedDept = departments.find(
      (d) =>
        d.id === student.departmentId ||
        d.code === student.departmentId ||
        d.name?.toLowerCase() === student.departmentId?.toLowerCase()
    );
    const resolvedDept = matchedDept
      ? matchedDept.name
      : student.department || student.departmentId || "";

    const matchedCourse = courses.find(
      (c) =>
        c.id === student.courseId ||
        c.code === student.courseId ||
        c.name?.toLowerCase() === student.courseId?.toLowerCase()
    );
    const resolvedCourse = matchedCourse
      ? matchedCourse.name
      : student.courseId || "";

    setFormData({
      id: student.id,
      rollNo: student.rollNo || "",
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      departmentId: resolvedDept,
      courseId: resolvedCourse,
      level: student.programType || student.level || "UG",
      year: formatYear(student.year),
      section: student.section || "A",
      status: student.active !== undefined ? (student.active ? "Active" : "Inactive") : (student.status || "Active"),
    });
    setFormErrors({});
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.rollNo.trim()) errors.rollNo = "Roll Number is required";
    if (!formData.name.trim()) errors.name = "Full Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.departmentId) errors.departmentId = "Department is required";
    if (!formData.courseId) errors.courseId = "Degree / Course is required";
    return errors;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "departmentId") {
      setFormData((prev) => ({
        ...prev,
        departmentId: value,
        courseId: "", // Reset course when department changes
      }));
    } else if (name === "courseId") {
      // Auto suggest PG/UG
      const isPg =
        value.startsWith("M.") ||
        value === "MCA" ||
        value === "MBA" ||
        value === "MSW";
      setFormData((prev) => ({
        ...prev,
        courseId: value,
        level: isPg ? "PG" : "UG",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Cascading courses for modal
  const coursesForModal = React.useMemo(() => {
    if (!formData.departmentId) return [];
    const matchedDept = departments.find(
      (d) =>
        d.name?.toLowerCase() === formData.departmentId.toLowerCase() ||
        d.id === formData.departmentId ||
        d.code?.toLowerCase() === formData.departmentId.toLowerCase()
    );
    const backendFiltered = courses.filter((c) => {
      if (matchedDept && c.departmentId === matchedDept.id) return true;
      if (c.departmentId?.toLowerCase() === formData.departmentId.toLowerCase()) return true;
      return false;
    });
    if (backendFiltered.length > 0) {
      return backendFiltered.map((c) => c.name);
    }
    return getCoursesForDepartment(formData.departmentId);
  }, [formData.departmentId, departments, courses]);

  // Cascading courses for search filter
  const courseFilterOptions = React.useMemo(() => {
    if (!deptFilter) {
      return courses.length > 0
        ? Array.from(new Set(courses.map((c) => c.name)))
        : Object.values(DEPARTMENT_COURSES).flat();
    }
    const matchedDept = departments.find(
      (d) =>
        d.name?.toLowerCase() === deptFilter.toLowerCase() ||
        d.id === deptFilter ||
        d.code?.toLowerCase() === deptFilter.toLowerCase()
    );
    const backendFiltered = courses.filter((c) => {
      if (matchedDept && c.departmentId === matchedDept.id) return true;
      if (c.departmentId?.toLowerCase() === deptFilter.toLowerCase()) return true;
      return false;
    });
    if (backendFiltered.length > 0) {
      return backendFiltered.map((c) => c.name);
    }
    return getCoursesForDepartment(deptFilter);
  }, [deptFilter, departments, courses]);

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Resolve departmentId and courseId
    let finalDept = formData.departmentId;
    const foundDept = departments.find(
      (d) =>
        d.name?.toLowerCase() === formData.departmentId?.toLowerCase() ||
        d.id === formData.departmentId ||
        d.code?.toLowerCase() === formData.departmentId?.toLowerCase()
    );
    if (foundDept) {
      finalDept = foundDept.id;
    }

    let finalCourse = formData.courseId;
    const foundCourse = courses.find(
      (c) =>
        c.name?.toLowerCase() === formData.courseId?.toLowerCase() ||
        c.id === formData.courseId ||
        c.code?.toLowerCase() === formData.courseId?.toLowerCase()
    );
    if (foundCourse) {
      finalCourse = foundCourse.id;
    }

    const payload = {
      rollNo: formData.rollNo.trim(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      departmentId: finalDept,
      courseId: finalCourse || finalDept,
      programType: formData.level,
      year: parseYear(formData.year) || 1,
      section: formData.section,
      active: formData.status === "Active",
    };

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await studentService.updateStudent(formData.id, payload);
        showNotification(`Student "${formData.name}" updated successfully.`);
      } else {
        await studentService.createStudent(payload);
        showNotification(`Student "${formData.name}" added successfully.`);
      }
      setIsFormOpen(false);
      fetchStudents();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to save student record." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    const targetId = target.id || target._id;
    try {
      await studentService.deleteStudent(targetId);
      showNotification(`Student "${target.name}" deleted successfully.`);
      await fetchStudents();
    } catch (err) {
      showNotification(`Failed to delete student: ${err.message}`);
    } finally {
      setDeleteTarget(null);
    }
  };

  // Helper to resolve display names
  const getDeptName = (row) => {
    if (!row) return "Computer Applications";
    const rawVal = row.department || row.departmentId;
    if (!rawVal) return "Computer Applications";
    const found = departments.find(
      (d) =>
        d.id === rawVal ||
        d.code === rawVal ||
        d.name?.toLowerCase() === rawVal?.toLowerCase()
    );
    if (found) return found.name;
    if (typeof rawVal === "string") {
      if (rawVal.includes("6ac14ca69f3b3663e8c7a6a1")) return "Administration";
      if (rawVal.includes("6ac14c9e9f3b3663e8c7a68f")) return "Computer Applications";
    }
    return rawVal;
  };

  const getCourseName = (row) => {
    if (!row) return "";
    const rawVal = row.course || row.courseId;
    if (!rawVal) return "";
    const found = courses.find(
      (c) =>
        c.id === rawVal ||
        c.code === rawVal ||
        c.name?.toLowerCase() === rawVal?.toLowerCase()
    );
    if (found) return found.name;
    if (typeof rawVal === "string") {
      if (rawVal.includes("6ac14ca69f3b3663e8c7a6a2")) return "BCA";
      if (rawVal.includes("6ac14ca79f3b3663e8c7a6a3")) return "MCA";
    }
    return rawVal;
  };

  // Table Columns Definition
  const columns = [
    {
      header: "Roll No",
      accessor: "rollNo",
      render: (row) => (
        <span className="font-semibold text-slate-800">
          {row.rollNo}
        </span>
      ),
    },
    {
      header: "Name",
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-800">
            {row.name}
          </div>
          <div className="text-xs text-slate-400">
            {row.email}
          </div>
        </div>
      ),
    },
    {
      header: "Department / Course",
      render: (row) => {
        const dept = getDeptName(row);
        const course = getCourseName(row);
        return (
          <div>
            <div className="font-medium text-slate-800">
              {dept}
            </div>
            {course && course !== dept && (
              <span className="inline-block mt-0.5 px-2 py-0.5 text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200 rounded-md">
                {course}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Program / Year",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-600 rounded">
            {row.programType || row.level || "UG"}
          </span>
          <span className="text-xs text-slate-500">
            {formatYear(row.year)} (Sec {row.section})
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      render: (row) => {
        const status =
          row.active !== undefined
            ? row.active
              ? "Active"
              : "Inactive"
            : row.status || "Active";
        return <StatusBadge status={status} />;
      },
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            title="View Details"
            onClick={() => setDetailsStudent(row)}
            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          {canManage && (
            <>
              <button
                type="button"
                title="Edit Student"
                onClick={() => handleOpenEdit(row)}
                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                title="Delete Student"
                onClick={() => setDeleteTarget(row)}
                className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const departmentOptions =
    departments.length > 0
      ? departments
          .filter((d) => d.name !== "Administration" && d.code !== "ADMIN")
          .map((d) => d.name)
      : STUDENT_DEPARTMENTS;

  return (
    <div>
      <PageHeader
        title="Students Directory"
        description="Manage enrolled students, academic departments, years, and sections."
        action={
          canManage ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsBulkImportOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-2xs transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Bulk Import (CSV)
              </button>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Student
              </button>
            </div>
          ) : null
        }
      />

      {/* Staff Course Restriction Notice */}
      {isStaff && (
        <div className="mb-6 p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 flex items-center gap-2.5 text-sm">
          <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />
          <span>
            <strong>Staff Course Isolation:</strong> You are authorized to access students enrolled in{" "}
            <strong>{staffCourseDisplay || "your assigned course"}</strong> only.
          </span>
        </div>
      )}

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
            onClick={fetchStudents}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <SearchFilter
        searchPlaceholder="Search roll no, name, email..."
        searchValue={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        filters={[
          {
            key: "dept",
            label: "All Departments",
            value: deptFilter,
            options: departmentOptions,
            onChange: (val) => {
              setDeptFilter(val);
              setCourseFilter("");
              setCurrentPage(1);
            },
            disabled: isHod || isStaff,
          },
          {
            key: "course",
            label: "All Courses",
            value: isStaff ? staffCourseDisplay : courseFilter,
            options: courseFilterOptions,
            onChange: (val) => {
              setCourseFilter(val);
              setCurrentPage(1);
            },
            disabled: isStaff,
          },
          {
            key: "level",
            label: "All Levels",
            value: levelFilter,
            options: STUDENT_LEVELS,
            onChange: (val) => {
              setLevelFilter(val);
              setCurrentPage(1);
            },
          },
          {
            key: "year",
            label: "All Years",
            value: yearFilter,
            options: STUDENT_YEARS,
            onChange: (val) => {
              setYearFilter(val);
              setCurrentPage(1);
            },
          },
          {
            key: "section",
            label: "All Sections",
            value: sectionFilter,
            options: STUDENT_SECTIONS,
            onChange: (val) => {
              setSectionFilter(val);
              setCurrentPage(1);
            },
          },
        ]}
        onReset={handleResetFilters}
      />

      {/* Loading Spinner or Data Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 py-12 text-center flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">
            Loading students from server...
          </p>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={students}
            emptyTitle="No students found"
            emptyMessage="No student records match the selected filters or search criteria."
            emptyAction={
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
              >
                Reset Filters
              </button>
            }
          />

          {/* Server-side Pagination Footer */}
          {totalElements > pageSize && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 px-1">
              <p className="text-xs text-slate-500">
                Showing <strong className="font-semibold text-slate-700">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
                <strong className="font-semibold text-slate-700">{Math.min(currentPage * pageSize, totalElements)}</strong> of{" "}
                <strong className="font-semibold text-slate-700">{totalElements}</strong> students
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
        </>
      )}

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => !isSubmitting && setIsFormOpen(false)}
        title={isEditMode ? "Edit Student Information" : "Add New Student"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveStudent} noValidate className="space-y-4">
          {formErrors.submit && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
              {formErrors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Roll Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Roll Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="rollNo"
                placeholder="e.g. 2024CS105"
                value={formData.rollNo}
                onChange={handleFormChange}
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-800 shadow-2xs focus:outline-hidden focus:ring-1 ${
                  formErrors.rollNo
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
              />
              {formErrors.rollNo && (
                <p className="mt-1 text-xs text-rose-600">{formErrors.rollNo}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleFormChange}
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-800 shadow-2xs focus:outline-hidden focus:ring-1 ${
                  formErrors.name
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
              />
              {formErrors.name && (
                <p className="mt-1 text-xs text-rose-600">{formErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="student@example.com"
                value={formData.email}
                onChange={handleFormChange}
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-800 shadow-2xs focus:outline-hidden focus:ring-1 ${
                  formErrors.email
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
              />
              {formErrors.email && (
                <p className="mt-1 text-xs text-rose-600">{formErrors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                placeholder="+91 98765 00000"
                value={formData.phone}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 shadow-2xs focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                name="departmentId"
                value={formData.departmentId || ""}
                disabled={isHod}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-2xs focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Department</option>
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {formErrors.departmentId && (
                <p className="mt-1 text-xs text-rose-600">{formErrors.departmentId}</p>
              )}
            </div>

            {/* Degree / Course */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Degree / Course <span className="text-red-500">*</span>
              </label>
              <select
                name="courseId"
                value={formData.courseId || ""}
                disabled={!formData.departmentId}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-2xs focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {formData.departmentId
                    ? "-- Select Course (e.g. BCA, MCA) --"
                    : "-- First Select Department --"}
                </option>
                {coursesForModal.map((cName) => (
                  <option key={cName} value={cName}>
                    {cName}
                  </option>
                ))}
              </select>
              {formErrors.courseId && (
                <p className="mt-1 text-xs text-rose-600">{formErrors.courseId}</p>
              )}
            </div>

            {/* Program (UG / PG) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Program (UG / PG)
              </label>
              <select
                name="level"
                value={formData.level || "UG"}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-2xs focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
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
                name="year"
                value={formData.year || "1st Year"}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-2xs focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {STUDENT_YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Section
              </label>
              <select
                name="section"
                value={formData.section || "A"}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-2xs focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {STUDENT_SECTIONS.map((sec) => (
                  <option key={sec} value={sec}>
                    Section {sec}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={formData.status || "Active"}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-2xs focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {STUDENT_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Add Student"}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Student Details Modal */}
      <Modal
        isOpen={Boolean(detailsStudent)}
        onClose={() => setDetailsStudent(null)}
        title="Student Details"
        maxWidth="max-w-lg"
      >
        {detailsStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-200">
              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 font-bold text-xl flex items-center justify-center border border-blue-200 shrink-0">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {detailsStudent.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Roll No: <strong className="text-slate-700">{detailsStudent.rollNo}</strong>
                </p>
                <div className="mt-1.5">
                  <StatusBadge
                    status={
                      detailsStudent.active !== undefined
                        ? detailsStudent.active
                          ? "Active"
                          : "Inactive"
                        : detailsStudent.status || "Active"
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-xs sm:text-sm">
              <div>
                <span className="block text-xs text-slate-400 font-medium">Department</span>
                <span className="font-semibold text-slate-800">{getDeptName(detailsStudent)}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400 font-medium">Degree / Course</span>
                <span className="font-semibold text-blue-600">{getCourseName(detailsStudent) || getDeptName(detailsStudent)}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400 font-medium">Program</span>
                <span className="font-semibold text-slate-800">{detailsStudent.programType || detailsStudent.level || "UG"}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400 font-medium">Year & Section</span>
                <span className="font-semibold text-slate-800">{formatYear(detailsStudent.year)} - Sec {detailsStudent.section}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400 font-medium">Email</span>
                <span className="font-semibold text-slate-800">{detailsStudent.email}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400 font-medium">Phone</span>
                <span className="font-semibold text-slate-800">{detailsStudent.phone || "N/A"}</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setDetailsStudent(null)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student"
        message={`Are you sure you want to delete student "${deleteTarget?.name}" (${deleteTarget?.rollNo})? This action cannot be undone.`}
        confirmText="Delete Student"
        confirmVariant="danger"
      />

      {/* Bulk CSV/Excel Importer Modal */}
      <BulkStudentImporterModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        departments={departments}
        courses={courses}
        onSuccess={(count) => {
          showNotification(`Successfully imported ${count} student(s)!`);
          fetchStudents();
        }}
      />
    </div>
  );
};

export default StudentsPage;
