import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getDashboardPath } from "../data/roles";

const UnauthorizedPage = () => {
  const { user } = useAuth();
  const destination = getDashboardPath(user?.role);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md border border-slate-200 text-center p-6 sm:p-8">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 inline-flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Access Restricted
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Your account role (<strong className="text-slate-800">{user?.role || "Current Role"}</strong>) does not have permission to access this resource.
        </p>
        <Link
          to={destination}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors duration-150"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Permitted View
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
