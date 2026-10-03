import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md border border-slate-200 text-center p-6 sm:p-8">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 inline-flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-5xl font-extrabold text-slate-800 mb-2">
          404
        </h1>
        <h2 className="text-xl font-semibold text-slate-700 mb-2">
          Page Not Found
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors duration-150"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
