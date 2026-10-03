import React, { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to perform this action? This cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  confirmVariant = "danger",
}) => {
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirmClick = async () => {
    try {
      setSubmitting(true);
      if (onConfirm) {
        await onConfirm();
      }
      if (onClose) {
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isDanger = confirmVariant === "danger" || confirmVariant === "error";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 transform transition-all text-center">
        <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-4 ${
          isDanger ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
        }`}>
          <AlertTriangle size={28} />
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-slate-500 mb-6">
          {message}
        </p>
        
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={handleConfirmClick}
            disabled={submitting}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${
              isDanger
                ? "bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-200"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
            }`}
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
