import React from "react";
import EmptyState from "./EmptyState";

const DataTable = ({
  columns = [],
  data = [],
  keyField = "id",
  emptyTitle = "No records found",
  emptyMessage = "There are no entries matching your current selection.",
  emptyAction,
}) => {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <EmptyState
          title={emptyTitle}
          message={emptyMessage}
          action={emptyAction}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {columns.map((col, idx) => {
                const isLast = idx === columns.length - 1;
                return (
                  <th
                    key={col.header || idx}
                    className={`py-3.5 ${idx === 0 ? "pl-6 pr-4" : isLast ? "pl-4 pr-6 text-right" : "px-4"}`}
                  >
                    {col.header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {data.map((row, rIdx) => {
              const rowKey = row[keyField] || row.id || row._id || rIdx;
              return (
                <tr
                  key={rowKey}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  {columns.map((col, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === columns.length - 1;
                    const cellContent = col.render
                      ? col.render(row)
                      : row[col.accessor];

                    return (
                      <td
                        key={col.header || idx}
                        className={`py-3.5 ${isFirst ? "pl-6 pr-4" : isLast ? "pl-4 pr-6 text-right" : "px-4"}`}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
