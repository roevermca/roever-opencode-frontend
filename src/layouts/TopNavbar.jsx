import React from "react";
import { Link } from "react-router-dom";
import { Menu, User, Calendar } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const TopNavbar = ({ onDrawerToggle }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 px-4 md:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Hamburger (mobile only) & App Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={onDrawerToggle}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/" className="flex items-center gap-2" title="Roever AMS Home">
          <img
            src="/icon.png"
            alt="Roever AMS Icon"
            className="w-8 h-8 object-contain rounded-lg"
          />
        </Link>
      </div>

      {/* Right: Date badge and Profile shortcut */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>

        <Link
          to="/profile"
          className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 transition-colors group"
          title="View Profile"
        >
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center border border-blue-200 shrink-0">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 leading-tight transition-colors">
              {user?.displayName || user?.name || "User"}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-slate-600 font-medium leading-tight">
                {user?.email || ""}
              </span>
              {user?.role && (
                <span className="text-[10px] font-bold text-blue-700 uppercase px-1.5 py-0.2 rounded bg-blue-100/70 border border-blue-200">
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
