import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { ROLES, getDashboardPath } from "../data/roles";
import { useAuth } from "../context/AuthContext";

// Static imports for 0ms instantaneous route switching without any loading state
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import StudentsPage from "../pages/StudentsPage";
import StaffPage from "../pages/StaffPage";
import ProfilePage from "../pages/ProfilePage";
import AttendancePage from "../pages/AttendancePage";
import AttendanceHistoryPage from "../pages/AttendanceHistoryPage";
import ReportsPage from "../pages/ReportsPage";
import StudentAttendancePage from "../pages/StudentAttendancePage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import NotFoundPage from "../pages/NotFoundPage";

const DashboardRedirect = () => {
  const { user } = useAuth();
  const dest = getDashboardPath(user?.role);
  return <Navigate to={dest} replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Authenticated Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardRedirect />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Role-Specific Dashboards */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vp/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.VP]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.HOD]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentAttendancePage />
              </ProtectedRoute>
            }
          />

          <Route path="/profile" element={<ProfilePage />} />

          {/* Attendance (Staff, HOD, VP, Admin) */}
          <Route
            path="/attendance"
            element={
              <ProtectedRoute
                allowedRoles={[
                  ROLES.ADMIN,
                  ROLES.VP,
                  ROLES.HOD,
                  ROLES.STAFF,
                ]}
              >
                <AttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance/history"
            element={
              <ProtectedRoute
                allowedRoles={[
                  ROLES.ADMIN,
                  ROLES.VP,
                  ROLES.HOD,
                  ROLES.STAFF,
                ]}
              >
                <AttendanceHistoryPage />
              </ProtectedRoute>
            }
          />

          {/* Reports (Admin, VP, HOD) */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute
                allowedRoles={[ROLES.ADMIN, ROLES.VP, ROLES.HOD]}
              >
                <ReportsPage />
              </ProtectedRoute>
            }
          />

          {/* Students Directory (Admin, VP, HOD) */}
          <Route
            path="/students"
            element={
              <ProtectedRoute
                allowedRoles={[ROLES.ADMIN, ROLES.VP, ROLES.HOD]}
              >
                <StudentsPage />
              </ProtectedRoute>
            }
          />

          {/* Faculty & Staff Directory (Admin, VP) */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.VP]}>
                <StaffPage />
              </ProtectedRoute>
            }
          />

          {/* Student Personal Attendance Portal (Student, Admin) */}
          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.ADMIN]}>
                <StudentAttendancePage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>

      {/* 404 Catch-All Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
