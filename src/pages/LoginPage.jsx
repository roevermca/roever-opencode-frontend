import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  KeyRound,
  ShieldCheck,
  X,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getDashboardPath } from "../data/roles";
import Modal from "../components/Modal";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    loading: authLoading,
    login,
    loginWithGoogle,
    resetPassword,
    isFirebaseConfigured,
    backendOnline,
    verifyBackend,
  } = useAuth();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Validation & UI states
  const [validationErrors, setValidationErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);

  // Forgot password modal states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

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

  const validateForm = () => {
    const errors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errors.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Please enter your password";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const authenticatedUser = await login(email, password, rememberMe);
      const destination =
        location.state?.from?.pathname || getDashboardPath(authenticatedUser.role);
      navigate(destination, { replace: true });
    } catch (err) {
      setAuthError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
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

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    const trimmed = forgotEmail.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setForgotError("Please enter a valid registered email address.");
      return;
    }

    setForgotLoading(true);
    try {
      await resetPassword(trimmed);
      setForgotSuccess(
        "A password reset link has been sent to your email. Please check your inbox and follow the instructions."
      );
    } catch (err) {
      setForgotError(err.message || "Unable to send password reset email. Please verify the address.");
    } finally {
      setForgotLoading(false);
    }
  };

  const openForgotModal = () => {
    setForgotEmail(email || "");
    setForgotError("");
    setForgotSuccess("");
    setShowForgotModal(true);
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
          {isFirebaseConfigured && (
            <div className="mb-5">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting || isGoogleSubmitting}
                className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-2xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGoogleSubmitting ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24">
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
              <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Authorized accounts (VP, HOD, Faculty, Students) enter directly.</span>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold">
                or sign in with email
              </span>
            </div>
          </div>

          {/* Email/Password Login Form */}
          <form onSubmit={handleEmailLogin} noValidate className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationErrors.email) {
                      setValidationErrors((prev) => ({ ...prev, email: null }));
                    }
                  }}
                  disabled={isSubmitting || isGoogleSubmitting}
                  autoComplete="email"
                  className={`w-full rounded-lg border pl-10 pr-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 ${
                    validationErrors.email
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-xs text-rose-600">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors((prev) => ({ ...prev, password: null }));
                    }
                  }}
                  disabled={isSubmitting || isGoogleSubmitting}
                  autoComplete="current-password"
                  className={`w-full rounded-lg border pl-10 pr-10 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 ${
                    validationErrors.password
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-xs text-rose-600">{validationErrors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isSubmitting || isGoogleSubmitting}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-xs sm:text-sm text-slate-600">Remember me</span>
              </label>

              <button
                type="button"
                onClick={openForgotModal}
                disabled={isSubmitting || isGoogleSubmitting}
                className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isGoogleSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">
            &copy; 2026 Hans Roever. All rights reserved.
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => !forgotLoading && setShowForgotModal(false)}
        title="Reset Password"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
          <p className="text-sm text-slate-600">
            Enter your registered email address and we will send you a secure link to reset your password.
          </p>

          {forgotError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{forgotError}</span>
            </div>
          )}

          {forgotSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{forgotSuccess}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Registered Email
            </label>
            <div className="relative rounded-lg shadow-2xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="Enter your email address"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                disabled={forgotLoading || Boolean(forgotSuccess)}
                required
                autoFocus
                className="w-full rounded-lg border border-slate-300 pl-10 pr-3.5 py-2 text-sm text-slate-800 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              disabled={forgotLoading}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            {!forgotSuccess && (
              <button
                type="submit"
                disabled={forgotLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors disabled:opacity-50"
              >
                {forgotLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{forgotLoading ? "Sending..." : "Send Reset Link"}</span>
              </button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LoginPage;
