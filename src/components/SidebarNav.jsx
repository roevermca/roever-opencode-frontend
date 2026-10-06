import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  History,
  BarChart3,
  GraduationCap,
  Users,
  User,
  LogOut,
  CheckSquare,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { hasRoutePermission, ROLES, getDashboardPath } from "../data/roles";

const SidebarNav = ({ onItemClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (onItemClick) onItemClick();
    await logout();
    navigate("/login");
  };

  const dashboardPath = user ? getDashboardPath(user.role) : "/dashboard";

  const allNavItems = [
    { to: dashboardPath, label: "Dashboard", icon: LayoutDashboard },
    { to: "/attendance", label: "Mark Attendance", icon: CalendarCheck },
    { to: "/attendance/history", label: "Attendance History", icon: History },
    { to: "/student/attendance", label: "My Attendance", icon: CalendarCheck, studentOnly: true },
    { to: "/reports", label: "Attendance Reports", icon: BarChart3 },
    { to: "/students", label: "Students", icon: GraduationCap },
    { to: "/staff", label: "Faculty & Staff", icon: Users },
    { to: "/profile", label: "My Profile", icon: User },
  ];

  const visibleItems = allNavItems.filter((item) => {
    if (!user) return true;
    if (item.studentOnly) {
      return user.role === ROLES.STUDENT || user.role === ROLES.ADMIN;
    }
    if (user.role === ROLES.STUDENT) {
      return item.to === dashboardPath || item.to === "/profile" || item.to === "/student/attendance";
    }
    return hasRoutePermission(user.role, item.to);
  });

  return (
    <div className="flex flex-col h-full bg-white p-4">
      {/* Brand Header */}
      <div className="flex items-center gap-3 p-2 mb-4 border-b border-slate-200">
        <img
          src="/icon.png"
          alt="Roever AMS Icon"
          className="w-10 h-10 object-contain rounded-xl shadow-xs"
        />
        <div>
          <h2 className="text-base font-extrabold text-slate-900 leading-none">
            Roever AMS
          </h2>
          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold text-blue-700 bg-blue-100 border border-blue-200 rounded-full">
            {user?.role || "ADMIN"}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end
              onClick={onItemClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 min-h-[44px] rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs ring-2 ring-blue-600/25"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`
              }
            >
              <Icon size={19} strokeWidth={2.2} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer User Info & Sign Out */}
      <div className="pt-3 mt-auto border-t border-slate-200">
        {user && (
          <div className="mb-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200 shrink-0">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">
                {user.displayName || user.name || "Administrator"}
              </p>
              <p className="text-[11px] text-slate-500 truncate" title={user.email}>
                {user.email}
              </p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarNav;
