import React from "react";
import { FolderSearch } from "lucide-react";

const EmptyState = ({
  icon: Icon = FolderSearch,
  title = "No records found",
  message = "Try adjusting your search or filter criteria.",
  action,
}) => {
  return (
    <div className="text-center py-12 px-4 flex flex-col items-center justify-center">
      <div className="p-3.5 bg-slate-100 text-slate-500 rounded-full inline-flex items-center justify-center mb-3">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mb-4">
        {message}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
