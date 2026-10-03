import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Building,
  Calendar,
  Shield,
  MapPin,
  LogOut,
  CheckCircle2,
  Edit3,
  Sparkles,
  RefreshCw,
  Save,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import ConfirmDialog from "../components/ConfirmDialog";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { userProfileData, STAFF_DEPARTMENTS } from "../data/staff";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, updateUserProfile } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [editForm, setEditForm] = useState({
    name: user?.displayName || user?.name || "",
    department: user?.department || "Administration",
    phone: user?.phone || userProfileData.phone || "",
  });

  const profile = {
    ...userProfileData,
    name: user?.displayName || user?.name || userProfileData.name,
    email: user?.email || userProfileData.email,
    role: user?.role || userProfileData.role,
    department: user?.department || userProfileData.department,
    phone: user?.phone || userProfileData.phone,
    gmailName: user?.gmailName || "",
    isCustomized: Boolean(user?.isCustomized),
  };

  const handleOpenEdit = () => {
    setEditForm({
      name: profile.name,
      department: profile.department,
      phone: profile.phone,
    });
    setShowEditModal(true);
  };

  const handleUseGmailName = () => {
    if (profile.gmailName) {
      setEditForm((prev) => ({ ...prev, name: profile.gmailName }));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfile({
        name: editForm.name,
        department: editForm.department,
        phone: editForm.phone,
      });
      setShowEditModal(false);
      setSuccessMessage("Profile updated! Changes reflected across the system.");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Account Profile"
        description="Manage your institutional account details, Gmail integration, and department assignment."
        action={
          <button
            type="button"
            onClick={handleOpenEdit}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-[0_2px_8px_rgba(37,99,235,0.25)] transition-all"
          >
            <Edit3 className="w-4 h-4" />
            Customize Profile & Department
          </button>
        }
      />

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-3"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-slate-200/80 text-center p-6 sm:p-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-500/20">
              {profile.name ? profile.name.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
            </div>

            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight mb-1">
              {profile.name}
            </h2>

            {/* Account Name Source Badge */}
            <div className="mb-2 flex flex-wrap items-center justify-center gap-1.5">
              {profile.gmailName && profile.name === profile.gmailName && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  Gmail Account Name
                </span>
              )}
              {profile.isCustomized && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  <Edit3 className="w-3 h-3 text-blue-500" />
                  Admin Customized
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mb-3 font-medium">
              {profile.role}
            </p>
            <div className="mb-4 flex justify-center">
              <StatusBadge status={profile.status} />
            </div>

            <div className="border-t border-slate-100 my-5" />

            <div className="space-y-3.5 text-left text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Email Address</span>
                  <span className="truncate block font-medium text-slate-800">{profile.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Department</span>
                  <span className="font-semibold text-slate-900">{profile.department}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Phone</span>
                  <span className="font-medium text-slate-800">{profile.phone}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenEdit}
              className="mt-6 w-full py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              Edit Display Name / Department
            </button>
          </div>
        </div>

        {/* Right Column: Detailed Information & Actions */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-slate-200/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base tracking-tight">
                  Institutional Profile Details
                </h3>
                <p className="text-xs text-slate-400">
                  Role assignments and administrative access
                </p>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="p-2 bg-blue-100/70 text-blue-700 rounded-lg shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Employee ID
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {profile.employeeId}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="p-2 bg-indigo-100/70 text-indigo-700 rounded-lg shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Assigned Role
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {profile.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="p-2 bg-emerald-100/70 text-emerald-700 rounded-lg shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Assigned Department
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {profile.department}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="p-2 bg-amber-100/70 text-amber-700 rounded-lg shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Office Location
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {profile.office}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="p-2 bg-slate-200/70 text-slate-700 rounded-lg shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Member Since
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {profile.joinedDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                      System Privileges
                    </span>
                    <span className="text-sm font-bold text-emerald-950">
                      Active Authorized Session
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Session & Security */}
          <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-slate-200/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base tracking-tight">
                Session & Security
              </h3>
            </div>
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Sign Out of Roever AMS
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  End your current session safely on this computer.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-rose-300 text-rose-700 bg-rose-50/60 hover:bg-rose-100 hover:border-rose-400 text-xs sm:text-sm font-semibold transition-all shrink-0"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit / Customize Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Customize Name & Department"
        size="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isSaving || !editForm.name.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Display Name
              </label>
              {profile.gmailName && editForm.name !== profile.gmailName && (
                <button
                  type="button"
                  onClick={handleUseGmailName}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Use Gmail Name ("{profile.gmailName}")
                </button>
              )}
            </div>
            <input
              type="text"
              required
              value={editForm.name}
              onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Dr. Rajesh Sharma"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              This name will appear on your top navigation bar, attendance signoffs, and dashboard.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Institutional Department
            </label>
            <select
              value={editForm.department}
              onChange={(e) => setEditForm((prev) => ({ ...prev, department: e.target.value }))}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
            >
              {STAFF_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Choose from Roever Arts & Science College departments or Administration.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Contact Phone Number
            </label>
            <input
              type="tel"
              value={editForm.phone}
              onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="+91 98765 00000"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
            />
          </div>
        </form>
      </Modal>

      {/* Logout Confirmation */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Sign Out Confirmation"
        message="Are you sure you want to sign out of Roever AMS?"
        confirmText="Yes, Sign Out"
        confirmVariant="danger"
      />
    </div>
  );
};

export default ProfilePage;
