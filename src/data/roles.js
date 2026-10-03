export const ROLES = {
  ADMIN: "ADMIN",
  VP: "VP",
  HOD: "HOD",
  STAFF: "STAFF",
  STUDENT: "STUDENT",
};

export const getDashboardPath = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return "/admin/dashboard";
    case ROLES.VP:
      return "/vp/dashboard";
    case ROLES.HOD:
      return "/hod/dashboard";
    case ROLES.STAFF:
      return "/staff/dashboard";
    case ROLES.STUDENT:
      return "/student/dashboard";
    default:
      return "/dashboard";
  }
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    "/admin/dashboard",
    "/dashboard",
    "/students",
    "/staff",
    "/attendance",
    "/attendance/history",
    "/reports",
    "/profile",
    "/student/attendance",
  ],
  [ROLES.VP]: [
    "/vp/dashboard",
    "/dashboard",
    "/students",
    "/staff",
    "/attendance",
    "/attendance/history",
    "/reports",
    "/profile",
  ],
  [ROLES.HOD]: [
    "/hod/dashboard",
    "/dashboard",
    "/students",
    "/attendance",
    "/attendance/history",
    "/reports",
    "/profile",
  ],
  [ROLES.STAFF]: [
    "/staff/dashboard",
    "/dashboard",
    "/attendance",
    "/attendance/history",
    "/profile",
  ],
  [ROLES.STUDENT]: [
    "/student/dashboard",
    "/dashboard",
    "/profile",
    "/student/attendance",
  ],
};

// Fallback role profiles mapped by email (used when backend is offline or initial bootstrap)
export const DEFAULT_USER_ROLES = {
  "admin@amsportal.edu": {
    role: ROLES.ADMIN,
    name: "Dr. Rajesh Sharma",
    department: "Administration",
  },
  "vp@amsportal.edu": {
    role: ROLES.VP,
    name: "Prof. K. Narayanan",
    department: "Academic Affairs",
  },
  "hod.cs@amsportal.edu": {
    role: ROLES.HOD,
    name: "Dr. S. Venkatesh",
    department: "Computer Science",
  },
  "staff@amsportal.edu": {
    role: ROLES.STAFF,
    name: "Mrs. Anitha R",
    department: "Computer Science",
  },
  "student@amsportal.edu": {
    role: ROLES.STUDENT,
    name: "Aravind Kumar",
    rollNo: "23CS001",
    department: "Computer Science",
  },
};

export const getRoleForEmail = (email) => {
  if (!email) return ROLES.STAFF;
  const normalized = email.toLowerCase().trim();
  if (DEFAULT_USER_ROLES[normalized]) {
    return DEFAULT_USER_ROLES[normalized].role;
  }
  if (normalized.includes("admin")) return ROLES.ADMIN;
  if (normalized.includes("vp")) return ROLES.VP;
  if (normalized.includes("hod")) return ROLES.HOD;
  if (normalized.includes("student")) return ROLES.STUDENT;
  return ROLES.STAFF;
};

export const hasRoutePermission = (role, pathname) => {
  if (!role) return false;
  if (role === ROLES.ADMIN) {
    // Admin has access to all routes except student dashboard specific or other role dashboard paths
    if (pathname === "/student/dashboard" || pathname === "/staff/dashboard" || pathname === "/hod/dashboard" || pathname === "/vp/dashboard") {
      return false;
    }
    return true;
  }
  const allowedRoutes = ROLE_PERMISSIONS[role] || [];
  return allowedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
};
