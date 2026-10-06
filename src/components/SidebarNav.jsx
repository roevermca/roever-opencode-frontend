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
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { hasRoutePermission, ROLES, getDashboardPath } from "../data/roles";

const SidebarNav = ({ onItemClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

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
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 p-4 transition-colors">
      {/* Brand Header */}
      <div className="flex items-center gap-3 p-2 mb-4 border-b border-slate-200 dark:border-slate-800">
        <img
          src="/icon.png"
          alt="Roever AMS Icon"
          className="w-10 h-10 object-contain rounded-xl shadow-xs"
        />
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-none">
            Roever AMS
          </h2>
          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-full">
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
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`
              }
            >
              <Icon size={19} strokeWidth={2.2} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer User Info & Settings & Sign Out */}
      <div className="pt-3 mt-auto border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1.5">
        {/* Dark Screen Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3.5 py-2.5 min-h-[44px] rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            {isDark ? (
              <Sun size={18} className="text-amber-400 stroke-[2.2]" />
            ) : (
              <Moon size={18} className="text-slate-600 stroke-[2.2]" />
            )}
            <span>{isDark ? "Light Screen" : "Dark Screen"}</span>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700">
            {isDark ? "Dark ON" : "Light"}
          </span>
        </button>

        {/* User Card */}
        {user && (
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center border border-blue-200 dark:border-blue-700 shrink-0">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {user.displayName || user.name || "Administrator"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate" title={user.email}>
                {user.email}
              </p>
            </div>
          </div>
        )}

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 min-h-[44px] rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
        >
          <LogOut size={18} strokeWidth={2.2} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarNav;
