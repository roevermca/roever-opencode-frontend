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
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import SearchFilter from "../components/SearchFilter";
import DataTable from "../components/DataTable";
import ConfirmDialog from "../components/ConfirmDialog";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import staffService from "../services/staffService";
import departmentService from "../services/departmentService";
import courseService from "../services/courseService";
import { getCoursesForDepartment } from "../data/students";
import {
  STAFF_DEPARTMENTS,
  SYSTEM_USER_ROLES,
  STAFF_STATUSES,
  initialStaff,
} from "../data/staff";

// Clean any legacy mock storage on load
try {
  localStorage.removeItem("ams_mock_staff_list");
} catch {
  // ignore
}

const emptyStaffForm = {
  name: "",
  email: "",
  phone: "",
  department: "",
  course: "",
  role: "STAFF",
  status: "Active",
};

const StaffPage = () => {
  const { user } = useAuth();

  // Role permissions
  const isAdmin = user?.role === "ADMIN";
  const isVp = user?.role === "VP";
  const isHod = user?.role === "HOD";
  const canManageStaff = isAdmin || isVp;
  const isUnauthorized = user?.role === "STAFF" || user?.role === "STUDENT";

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Departments & Courses
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  // Active Vice Principal in institution (1 VP limit)
  const [activeVp, setActiveVp] = useState(null);

  // Search & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState(isHod ? user?.department || "" : "");
  const [roleFilter, setRoleFilter] = useState("");

  const location = useLocation();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(emptyStaffForm);
  const [formErrors, setFormErrors] = useState({});
  const [detailsStaff, setDetailsStaff] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Feedback notification
  const [notification, setNotification] = useState("");

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification("");
    }, 4000);
  };

  // Fetch active VP institution-wide to strictly enforce the 1-VP limit
  const fetchActiveVp = async () => {
    try {
      const res = await staffService.getStaff({ role: "VP", active: true });
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        setActiveVp(res.data[0]);
      } else {
        setActiveVp(null);
      }
    } catch {
      // ignore
    }
  };

  // Load departments & courses
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
        }
      } catch {
        // Fallback to static
      }
    }
    loadMeta();
    fetchActiveVp();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch staff directory
  const searchTimeoutRef = useRef(null);

  const fetchStaff = async () => {
    if (isUnauthorized) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const params = {
      search: searchTerm.trim() || undefined,
      departmentId: deptFilter || undefined,
      role: roleFilter || undefined,
      page: currentPage - 1,
      size: pageSize,
    };

    try {
      const res = await staffService.getStaff(params);
      let list = [];
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        list = [...res.data];
      } else {
        list = [...initialStaff];
      }

      // Always guarantee current logged-in user (e.g. roevermca09@gmail.com) is pinned at top
      if (user?.email) {
        const userEmailLower = user.email.toLowerCase();
        const existingIdx = list.findIndex(
          (s) => s.email && s.email.toLowerCase() === userEmailLower
        );
        if (existingIdx >= 0) {
          const currentItem = list[existingIdx];
          list.splice(existingIdx, 1);
          list.unshift(currentItem);
        } else {
          list.unshift({
            id: user.id || `usr-${Date.now()}`,
            name: user.displayName || user.name || "Roever Administrator",
            email: user.email,
            role: user.role || "ADMIN",
            department: user.department || "Administration",
            departmentId: user.department || "Administration",
            status: "Active",
            active: true,
          });
        }
      }

      setStaffList(list);
      setTotalPages(res?.totalPages || 1);
      setTotalElements(Math.max(res?.totalElements || list.length, list.length));
    } catch {
      let list = [...initialStaff];
      if (user?.email) {
        const userEmailLower = user.email.toLowerCase();
        const existingIdx = list.findIndex(
          (s) => s.email && s.email.toLowerCase() === userEmailLower
        );
        if (existingIdx >= 0) {
          const currentItem = list[existingIdx];
          list.splice(existingIdx, 1);
          list.unshift(currentItem);
        } else {
          list.unshift({
            id: user.id || `usr-${Date.now()}`,
            name: user.displayName || user.name || "Roever Administrator",
            email: user.email,
            role: user.role || "ADMIN",
            department: user.department || "Administration",
            departmentId: user.department || "Administration",
            status: "Active",
            active: true,
          });
        }
      }
      setStaffList(list);
      setTotalPages(1);
      setTotalElements(list.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      fetchStaff();
      fetchActiveVp();
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, deptFilter, roleFilter, currentPage]);

  // Open modal if action query param is present
  useEffect(() => {
    if (location.search.includes("action=new-vp") && canManageStaff) {
      if (activeVp) {
        showNotification(
          `Only 1 Vice Principal (VP) is permitted in the institution. ${activeVp.name} (${activeVp.email}) is currently assigned as VP.`
        );
      } else {
        handleOpenAdd("VP");
      }
    } else if (location.search.includes("action=new") && canManageStaff) {
      handleOpenAdd("STAFF");
    }
  }, [location.search, canManageStaff, activeVp]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setDeptFilter(isHod ? user?.department || "" : "");
    setRoleFilter("");
    setCurrentPage(1);
  };

  // Academic teaching departments for faculty & HOD
  const academicDepts = departments.filter(
    (d) => d.name !== "Administration" && d.code !== "ADMIN"
  );
  const academicDepartmentList =
    academicDepts.length > 0
      ? academicDepts
      : [
          { name: "Computer Applications", code: "CA" },
          { name: "Computer Science & IT", code: "CS" },
          { name: "Commerce", code: "COM" },
          { name: "Management Studies", code: "MS" },
          { name: "Mathematics", code: "MATH" },
          { name: "Physics", code: "PHY" },
          { name: "Chemistry", code: "CHEM" },
          { name: "Biotechnology", code: "BIOTECH" },
          { name: "Microbiology", code: "MICRO" },
          { name: "Tamil", code: "TAM" },
          { name: "English", code: "ENG" },
          { name: "Social Work", code: "SW" },
          { name: "Visual Communication", code: "VISCOM" },
          { name: "Hotel Management", code: "HMCS" },
          { name: "Physical Education", code: "PED" },
        ];

  // All department names for SearchFilter
  const departmentFilterOptions =
    departments.length > 0
      ? departments.map((d) => d.name)
      : STAFF_DEPARTMENTS;

  // Form Handling
  const handleOpenAdd = (defaultRole = "STAFF") => {
    if (defaultRole === "VP" && activeVp) {
      showNotification(
        `Only 1 Vice Principal (VP) is permitted in the institution. ${activeVp.name} (${activeVp.email}) is currently assigned as VP.`
      );
      return;
    }

    setFormData({
      ...emptyStaffForm,
      role: defaultRole,
      department:
        defaultRole === "VP" || defaultRole === "ADMIN"
          ? "Administration"
          : isHod
          ? user?.department || ""
          : "",
      course: "",
    });
    setFormErrors({});
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (staff) => {
    const matchedDept = departments.find(
      (d) =>
        d.id === staff.departmentId ||
        d.code === staff.departmentId ||
        d.name?.toLowerCase() === staff.departmentId?.toLowerCase()
    );
    const resolvedDept = matchedDept
      ? matchedDept.name
      : staff.department || staff.departmentId || "";

    const matchedCourse = courses.find(
      (c) =>
        c.id === staff.courseId ||
        c.code === staff.courseId ||
        c.name?.toLowerCase() === staff.courseId?.toLowerCase()
    );
    const resolvedCourse = matchedCourse ? matchedCourse.name : (staff.courseId || "");

    setFormData({
      id: staff.id,
      name: staff.name || "",
      email: staff.email || "",
      phone: staff.phone || "",
      department:
        staff.role === "VP" || staff.role === "ADMIN"
          ? "Administration"
          : resolvedDept,
      course: resolvedCourse,
      role: staff.role || "STAFF",
      status:
        staff.active !== undefined
          ? staff.active
            ? "Active"
            : "Inactive"
          : staff.status || "Active",
    });
    setFormErrors({});
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Full Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (formData.role === "STAFF") {
      if (!formData.department || formData.department === "Administration") {
        errors.department = "Please select an academic department";
      }
      if (!formData.course) {
        errors.course = "Please select an assigned course for staff";
      }
    } else if (formData.role === "VP") {
      if (!isEditMode && activeVp) {
        errors.role = `Only 1 Vice Principal is permitted. ${activeVp.name} is currently the active VP.`;
      }
    } else if (formData.role !== "ADMIN") {
      if (!formData.department || formData.department === "Administration") {
        errors.department = "Please select an academic department";
      }
    }

    if (!formData.role) errors.role = "Role is required";
    return errors;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") {
      if (value === "VP" || value === "ADMIN") {
        setFormData((prev) => ({
          ...prev,
          role: value,
          department: "Administration",
          course: "",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          role: value,
          department:
            prev.department === "Administration" ? "" : prev.department,
          course: value === "STAFF" ? prev.course : "",
        }));
      }
    } else if (name === "department") {
      setFormData((prev) => ({
        ...prev,
        department: value,
        course: "", // reset course when department changes
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const availableCoursesForSelectedDept = React.useMemo(() => {
    if (!formData.department) return [];
    const matchedDept = departments.find(
      (d) =>
        d.name?.toLowerCase() === formData.department.toLowerCase() ||
        d.id === formData.department ||
        d.code?.toLowerCase() === formData.department.toLowerCase()
    );
    const backendFiltered = courses.filter((c) => {
      if (matchedDept && c.departmentId === matchedDept.id) return true;
      if (c.departmentId?.toLowerCase() === formData.department.toLowerCase()) return true;
      return false;
    });
    if (backendFiltered.length > 0) {
      return backendFiltered.map((c) => c.name);
    }
    return getCoursesForDepartment(formData.department);
  }, [formData.department, departments, courses]);

  const handleSaveStaff = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Resolve departmentId for backend
    let targetDeptId = formData.department;
    if (formData.role === "ADMIN" || formData.role === "VP") {
      const adminDept = departments.find(
        (d) => d.name === "Administration" || d.code === "ADMIN"
      );
      targetDeptId = adminDept ? adminDept.id : "Administration";
    } else if (formData.department) {
      const matched = departments.find(
        (d) =>
          d.name?.toLowerCase() === formData.department.toLowerCase() ||
          d.id === formData.department ||
          d.code?.toLowerCase() === formData.department.toLowerCase()
      );
      targetDeptId = matched ? matched.id : formData.department;
    }

    // Resolve courseId for staff
    let targetCourseId = undefined;
    if (formData.role === "STAFF" && formData.course) {
      const matchedCourse = courses.find(
        (c) =>
          c.name?.toLowerCase() === formData.course.toLowerCase() ||
          c.code?.toLowerCase() === formData.course.toLowerCase() ||
          c.id === formData.course
      );
      targetCourseId = matchedCourse ? matchedCourse.id : formData.course;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim() || undefined,
      departmentId: targetDeptId,
      courseId: targetCourseId,
      role: formData.role,
      active: formData.status === "Active",
    };

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await staffService.updateStaff(formData.id, payload);
        showNotification(`User account "${formData.name}" updated successfully.`);
      } else {
        await staffService.createStaff(payload);
        if (formData.role === "VP") {
          showNotification(
            `Vice Principal "${formData.name}" added successfully! They can now log in directly with Google.`
          );
        } else {
          showNotification(
            `Staff member "${formData.name}" (${formData.role}) added successfully.`
          );
        }
      }
      setIsFormOpen(false);
      await fetchStaff();
      await fetchActiveVp();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to save user record." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    const targetId = target.id || target._id;
    try {
      await staffService.deleteStaff(targetId);
      showNotification(`User account "${target.name}" deleted successfully.`);
      await fetchStaff();
      await fetchActiveVp();
    } catch (err) {
      showNotification(`Failed to delete user account: ${err.message}`);
    } finally {
      setDeleteTarget(null);
    }
  };

  const getDeptDisplay = (row) => {
    if (!row) return "Administration";
    if (row.role === "ADMIN" || row.role === "VP") return "Administration";
    const rawVal = row.departmentId || row.department;
    if (!rawVal) return "Administration";
    const found = departments.find(
      (d) =>
        d.id === rawVal ||
        d.code === rawVal ||
        d.name?.toLowerCase() === rawVal.toLowerCase()
    );
    if (found) return found.name;
    if (typeof rawVal === "string") {
      if (rawVal.includes("6ac14ca69f3b3663e8c7a6a1")) return "Administration";
      if (rawVal.includes("6ac14c9e9f3b3663e8c7a68f")) return "Computer Applications";
    }
    return rawVal;
  };

  const getCourseDisplay = (row) => {
    if (!row || !row.courseId) return "";
    const rawVal = row.courseId;
    const found = courses.find(
      (c) =>
        c.id === rawVal ||
        c.code === rawVal ||
        c.name?.toLowerCase() === rawVal.toLowerCase()
    );
    return found ? found.name : rawVal;
  };

  // Table Columns Definition
  const columns = [
    {
      header: "Staff Name",
      accessor: "name",
      render: (row) => (
        <span className="font-semibold text-slate-800">
          {row.name}
        </span>
      ),
    },
    {
      header: "Contact",
      render: (row) => (
        <div>
          <div className="text-slate-800 font-medium">
            {row.email}
          </div>
          <div className="text-xs text-slate-400">
            {row.phone || "N/A"}
          </div>
        </div>
      ),
    },
    {
      header: "Department / Course",
      render: (row) => {
        const dept = getDeptDisplay(row);
        const course = getCourseDisplay(row);
        return (
          <div>
            <div className="font-medium text-slate-800">
              {dept}
            </div>
            {row.role === "STAFF" && course && (
              <span className="inline-block mt-0.5 px-2 py-0.5 text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200 rounded-md">
                Course: {course}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Role / Access",
      render: (row) => {
        const role = row.role || "STAFF";
        let badgeClass = "bg-blue-100 text-blue-800 border-blue-200";

        if (role === "ADMIN") {
          badgeClass = "bg-rose-100 text-rose-800 border-rose-200";
        } else if (role === "VP") {
          badgeClass = "bg-amber-100 text-amber-800 border-amber-200";
        } else if (role === "HOD") {
          badgeClass = "bg-sky-100 text-sky-800 border-sky-200";
        } else if (role === "STUDENT") {
          badgeClass = "bg-emerald-100 text-emerald-800 border-emerald-200";
        }

        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${badgeClass}`}>
            {role}
          </span>
        );
      },
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
            onClick={() => setDetailsStaff(row)}
            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          {canManageStaff && (
            <>
              <button
                type="button"
                title="Edit Staff"
                onClick={() => handleOpenEdit(row)}
                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                title="Delete Staff"
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

  if (isUnauthorized) {
    return (
      <div>
        <PageHeader
          title="User & Staff Directory"
          description="Institutional staff access."
        />
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-8 sm:p-12 text-center max-w-md mx-auto">
          <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800 mb-1">
            Access Restricted
          </h2>
          <p className="text-sm text-slate-500">
            You do not have administrative permission to view the user and staff directory.
          </p>
        </div>
      </div>
    );
  }

  const actionHeader = canManageStaff ? (
    <div className="flex flex-wrap items-center gap-2.5">
      {isAdmin && (
        activeVp ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            1 VP Assigned ({activeVp.name})
          </span>
        ) : (
          <button
            type="button"
            onClick={() => handleOpenAdd("VP")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold text-xs sm:text-sm shadow-xs transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            + Add Vice Principal (VP)
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => handleOpenAdd("STAFF")}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
      >
        <Plus className="w-4 h-4" />
        + Add Staff / Faculty
      </button>
    </div>
  ) : null;

  return (
    <div>
      <PageHeader
        title="User & Staff Directory"
        description="Manage administrators, vice principals, department heads, faculty, and institutional accounts."
        action={actionHeader}
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
            onClick={fetchStaff}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <SearchFilter
        searchPlaceholder="Search name, email, role..."
        searchValue={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        filters={[
          {
            key: "role",
            label: "All Roles",
            value: roleFilter,
            options: ["ADMIN", "VP", "HOD", "STAFF", "STUDENT"],
            onChange: (val) => {
              setRoleFilter(val);
              setCurrentPage(1);
            },
          },
          {
            key: "dept",
            label: "All Departments",
            value: deptFilter,
            options: departmentFilterOptions,
            onChange: (val) => {
              setDeptFilter(val);
              setCurrentPage(1);
            },
            disabled: isHod,
          },
        ]}
        onReset={handleResetFilters}
      />

      {/* Loading Spinner or Data Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 py-12 text-center flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">
            Loading faculty & staff directory...
          </p>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={staffList}
            emptyTitle="No staff members found"
            emptyMessage="No faculty or staff records match your current search or filter criteria."
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
                <strong className="font-semibold text-slate-700">{totalElements}</strong> staff members
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

      {/* Add / Edit Staff Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => !isSubmitting && setIsFormOpen(false)}
        title={
          isEditMode
            ? `Edit User: ${formData.name || ""}`
            : formData.role === "VP"
            ? "Add Vice Principal (VP)"
            : "Add New Staff / Faculty Member"
        }
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveStaff} noValidate className="space-y-4">
          {formErrors.submit && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
              {formErrors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Account Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Account Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role || "STAFF"}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-2xs focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {SYSTEM_USER_ROLES.map((r) => {
                  const isVpDisabled =
                    r.value === "VP" && !isEditMode && Boolean(activeVp);
                  return (
                    <option
                      key={r.value}
                      value={r.value}
                      disabled={isVpDisabled}
                    >
                      {r.label}{" "}
                      {isVpDisabled ? `(Assigned: ${activeVp.name})` : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Department <span className="text-red-500">*</span>
              </label>
              {formData.role === "VP" ? (
                <div>
                  <input
                    type="text"
                    value="Administration (Institutional Oversight)"
                    disabled
                    readOnly
                    className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-600 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Vice Principal oversees all institutional departments.
                  </p>
                </div>
              ) : formData.role === "ADMIN" ? (
                <div>
                  <input
                    type="text"
                    value="Administration (System Management)"
                    disabled
                    readOnly
                    className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-600 cursor-not-allowed"
                  />
                </div>
              ) : (
                <div>
                  <select
                    name="department"
                    value={formData.department || ""}
                    disabled={isHod}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-2xs focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Select Academic Department --</option>
                    {academicDepartmentList.map((dept) => (
                      <option
                        key={dept.id || dept.code || dept.name}
                        value={dept.name}
                      >
                        {dept.name} {dept.code ? `(${dept.code})` : ""}
                      </option>
                    ))}
                  </select>
                  {formErrors.department && (
                    <p className="mt-1 text-xs text-rose-600">{formErrors.department}</p>
                  )}
                </div>
              )}
            </div>

            {/* Course / Degree for Faculty */}
            {formData.role === "STAFF" && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Assigned Degree / Course <span className="text-red-500">*</span>
                </label>
                <select
                  name="course"
                  value={formData.course || ""}
                  disabled={!formData.department}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-2xs focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {formData.department
                      ? "-- Select Course (e.g. BCA, MCA) --"
                      : "-- First Select Department --"}
                  </option>
                  {availableCoursesForSelectedDept.map((cName) => (
                    <option key={cName} value={cName}>
                      {cName}
                    </option>
                  ))}
                </select>
                {formErrors.course ? (
                  <p className="mt-1 text-xs text-rose-600">{formErrors.course}</p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">
                    Staff member will strictly access students of this course only.
                  </p>
                )}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Dr. Rajesh Kumar"
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

            {/* Official Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="staff@amsportal.edu or Gmail"
                value={formData.email}
                onChange={handleFormChange}
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-800 shadow-2xs focus:outline-hidden focus:ring-1 ${
                  formErrors.email
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
              />
              <p className="mt-1 text-xs text-slate-400">
                {formErrors.email || "Staff can log in directly with Google using this registered email."}
              </p>
            </div>

            {/* Phone Number */}
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

            {/* Account Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Account Status
              </label>
              <select
                name="status"
                value={formData.status || "Active"}
                onChange={handleFormChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-2xs focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {STAFF_STATUSES.map((st) => (
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
              <span>
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                  ? "Save Changes"
                  : formData.role === "VP"
                  ? "Create VP Account"
                  : "Add Staff Member"}
              </span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Staff Details Modal */}
      <Modal
        isOpen={Boolean(detailsStaff)}
        onClose={() => setDetailsStaff(null)}
        title="Faculty Member Details"
        maxWidth="max-w-lg"
      >
        {detailsStaff && (
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-200">
              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 font-bold text-xl flex items-center justify-center border border-blue-200 shrink-0">
                <UserCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {detailsStaff.name}
                </h3>
                <span className="inline-block mt-0.5 px-2 py-0.5 text-[11px] font-bold bg-slate-100 text-slate-600 rounded">
                  {detailsStaff.role}
                </span>
                <div className="mt-1.5">
                  <StatusBadge
                    status={
                      detailsStaff.active !== undefined
                        ? detailsStaff.active
                          ? "Active"
                          : "Inactive"
                        : detailsStaff.status || "Active"
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-xs sm:text-sm">
              <div>
                <span className="block text-xs text-slate-400 font-medium">Department</span>
                <span className="font-semibold text-slate-800">{getDeptDisplay(detailsStaff)}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400 font-medium">Role</span>
                <span className="font-semibold text-slate-800">{detailsStaff.role}</span>
              </div>
              {detailsStaff.role === "STAFF" && getCourseDisplay(detailsStaff) && (
                <div className="col-span-2">
                  <span className="block text-xs text-slate-400 font-medium">Assigned Degree / Course</span>
                  <span className="inline-block mt-0.5 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 rounded-md">
                    {getCourseDisplay(detailsStaff)}
                  </span>
                </div>
              )}
              <div className="col-span-2">
                <span className="block text-xs text-slate-400 font-medium">Official Email</span>
                <span className="font-semibold text-slate-800">{detailsStaff.email}</span>
              </div>
              <div className="col-span-2">
                <span className="block text-xs text-slate-400 font-medium">Phone</span>
                <span className="font-semibold text-slate-800">{detailsStaff.phone || "N/A"}</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setDetailsStaff(null)}
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
        title="Delete Staff Account"
        message={`Are you sure you want to delete staff account for "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete Account"
        confirmVariant="danger"
      />
    </div>
  );
};

export default StaffPage;
