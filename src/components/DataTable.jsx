import React from "react";
import EmptyState from "./EmptyState";

const DataTable = ({
  columns = [],
  data = [],
  keyField = "id",
  selectable = false,
  selectedIds = [],
  onSelectAll,
  onSelectRow,
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

  const isAllSelected =
    data.length > 0 &&
    data.every((row) => {
      const rowKey = row[keyField] || row.id || row._id;
      return selectedIds.includes(rowKey);
    });

  const isSomeSelected =
    data.some((row) => {
      const rowKey = row[keyField] || row.id || row._id;
      return selectedIds.includes(rowKey);
    });

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {selectable && (
                <th className="py-3.5 pl-5 pr-2 w-10 text-center">
                  <input
                    type="checkbox"
                    aria-label="Select all records"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = isSomeSelected && !isAllSelected;
                      }
                    }}
                    onChange={onSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col, idx) => {
                const isLast = idx === columns.length - 1;
                const firstColPadding = selectable ? "pl-3 pr-4" : "pl-6 pr-4";
                return (
                  <th
                    key={col.header || idx}
                    className={`py-3.5 ${idx === 0 ? firstColPadding : isLast ? "pl-4 pr-6 text-right" : "px-4"}`}
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
              const isSelected = selectedIds.includes(rowKey);

              return (
                <tr
                  key={rowKey}
                  className={`transition-colors ${
                    isSelected ? "bg-blue-50/40 hover:bg-blue-50/60" : "hover:bg-slate-50/60"
                  }`}
                >
                  {selectable && (
                    <td className="py-3.5 pl-5 pr-2 w-10 text-center">
                      <input
                        type="checkbox"
                        aria-label={`Select item ${rowKey}`}
                        checked={isSelected}
                        onChange={() => onSelectRow && onSelectRow(rowKey, row)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                    </td>
                  )}
                  {columns.map((col, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === columns.length - 1;
                    const firstColPadding = selectable ? "pl-3 pr-4" : "pl-6 pr-4";
                    const cellContent = col.render
                      ? col.render(row)
                      : row[col.accessor];

                    return (
                      <td
                        key={col.header || idx}
                        className={`py-3.5 ${isFirst ? firstColPadding : isLast ? "pl-4 pr-6 text-right" : "px-4"}`}
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
