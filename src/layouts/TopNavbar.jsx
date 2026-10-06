import React from "react";
import { Link } from "react-router-dom";
import { Menu, User, Calendar, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const TopNavbar = ({ onDrawerToggle }) => {
  const { user } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 px-4 md:px-6 flex items-center justify-between shadow-xs transition-colors">
      {/* Left: Hamburger (mobile only) & App Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={onDrawerToggle}
          className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 transition-colors"
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
        </button>
        <Link to="/" className="flex items-center gap-2.5" title="Roever AMS Home">
          <img
            src="/icon.png"
            alt="Roever AMS Icon"
            className="w-8 h-8 object-contain rounded-xl shadow-2xs"
          />
          <span className="lg:hidden font-black text-sm text-slate-900 dark:text-white tracking-tight">
            Roever AMS
          </span>
        </Link>
      </div>

      {/* Right: Date badge, Dark Mode Toggle, and Profile shortcut */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Date badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>

        {/* 🌙 / ☀️ Dark Mode Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to Light Screen" : "Switch to Dark Screen"}
          title={isDark ? "Switch to Light Screen" : "Switch to Dark Screen"}
          className="min-w-[42px] min-h-[42px] rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent dark:border-slate-800 transition-all cursor-pointer"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-400 stroke-[2.2]" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700 stroke-[2.2]" />
          )}
        </button>

        {/* Profile Shortcut */}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
          title="View Profile"
        >
          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-sm flex items-center justify-center border border-blue-200 dark:border-blue-700 shrink-0">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 leading-tight transition-colors">
              {user?.displayName || user?.name || "User"}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-tight">
                {user?.email || ""}
              </span>
              {user?.role && (
                <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase px-1.5 py-0.2 rounded bg-blue-100/70 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800">
                  {user.role}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default TopNavbar;
