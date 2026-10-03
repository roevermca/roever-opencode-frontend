import React from "react";

const StatusBadge = ({ status }) => {
  const normalized = status?.toLowerCase();

  let colorClasses = "bg-slate-100 text-slate-700 border-slate-200";

  if (normalized === "active" || normalized === "present") {
    colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (normalized === "on leave") {
    colorClasses = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (normalized === "suspended" || normalized === "absent") {
    colorClasses = "bg-red-50 text-red-700 border-red-200";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClasses}`}>
      {status || "Unknown"}
    </span>
  );
};

export default StatusBadge;
