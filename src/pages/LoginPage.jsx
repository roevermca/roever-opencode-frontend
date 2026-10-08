import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getDashboardPath } from "../data/roles";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    loading: authLoading,
    loginWithGoogle,
    isFirebaseConfigured,
    backendOnline,
    verifyBackend,
  } = useAuth();

  // Validation & UI states
  const [authError, setAuthError] = useState("");
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      const destination =
        location.state?.from?.pathname || getDashboardPath(user.role);
      navigate(destination, { replace: true });
    }
  }, [user, authLoading, navigate, location]);

  const handleRetryBackend = async () => {
    setIsCheckingBackend(true);
    await verifyBackend();
    setIsCheckingBackend(false);
  };

  const handleGoogleLogin = async () => {
    setAuthError("");
    setIsGoogleSubmitting(true);
    try {
      const authenticatedUser = await loginWithGoogle();
      const destination =
        location.state?.from?.pathname || getDashboardPath(authenticatedUser.role);
      navigate(destination, { replace: true });
    } catch (err) {
      setAuthError(err.message || "Google sign-in failed. Please try again.");
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-10 px-4 sm:px-6">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <img
            src="/logo.png"
            alt="Hans Roever Attendance Management System"
            className="h-16 sm:h-20 w-auto max-w-[280px] sm:max-w-xs mx-auto object-contain drop-shadow-xs mb-4"
          />

          {/* System Status Badges */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {backendOnline === true ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Backend Online
              </span>
            ) : backendOnline === false ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                Backend Offline
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                Checking Backend...
              </span>
            )}

            {isFirebaseConfigured && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                Firebase Connected
              </span>
            )}
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Institutional Sign In
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Sign in with your administrator-approved account
            </p>
          </div>

          {/* Backend Offline Warning Alert */}
          {backendOnline === false && (
            <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start justify-between gap-3 text-rose-800 text-xs sm:text-sm">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Backend Offline:</strong> Spring Boot API server is not connected or waking up.
                </div>
              </div>
              <button
                type="button"
                onClick={handleRetryBackend}
                disabled={isCheckingBackend}
                className="shrink-0 inline-flex items-center gap-1 font-semibold text-rose-700 hover:text-rose-900 bg-rose-100 px-2 py-1 rounded"
              >
                {isCheckingBackend ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                Retry
              </button>
            </div>
          )}

          {/* Authentication Error Alert */}
          {authError && (
            <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-800 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          {isFirebaseConfigured ? (
            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleSubmitting}
                className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:border-slate-400"
              >
                {isGoogleSubmitting ? (
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>{isGoogleSubmitting ? "Verifying Google Account..." : "Continue with Google"}</span>
              </button>
              <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Authorized accounts (VP, HOD, Faculty, Students) enter directly.</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm text-center">
              Firebase configuration is missing or inactive. Please contact the administrator.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">
            &copy; 2026 Hans Roever. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
