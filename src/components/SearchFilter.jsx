import React from "react";
import { Search, X, RotateCcw } from "lucide-react";

const SearchFilter = ({
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  filters = [],
  onReset,
}) => {
  const hasActiveFilters =
    Boolean(searchValue) || filters.some((f) => Boolean(f.value));

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-3.5 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[220px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="w-full h-10 pl-9 pr-8 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 transition-colors"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Dynamic Filter Selects */}
        {filters.map((filter) => (
          <div key={filter.key} className="min-w-[140px] flex-1 sm:flex-initial">
            <select
              value={filter.value || ""}
              disabled={filter.disabled}
              onChange={(e) => filter.onChange(e.target.value)}
              className="w-full h-10 px-3 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-400 transition-colors"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Reset Action */}
        {hasActiveFilters && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="h-10 px-3.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-800 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap sm:ml-auto"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
