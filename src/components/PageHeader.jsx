import React from "react";

const PageHeader = ({ title, description, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {action}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
