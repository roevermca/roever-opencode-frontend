import React from "react";

const PageHeader = ({ title, description, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800 gap-4 transition-colors">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
          {title}
        </h1>
        {description && (
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
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
