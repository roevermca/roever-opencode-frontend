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

export const DEFAULT_USER_ROLES = {};

export const getRoleForEmail = (email) => {
  if (!email) return ROLES.STAFF;
  const normalized = email.toLowerCase().trim();
  if (DEFAULT_USER_ROLES[normalized]) {
    return DEFAULT_USER_ROLES[normalized].role;
  }
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
