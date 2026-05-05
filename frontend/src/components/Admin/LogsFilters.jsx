import { Search } from "lucide-react";

export function LogsFilters({
  query,
  onQueryChange,
  level,
  onLevelChange,
  filteredCount,
  totalCount,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by action, message, target, or actor"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>

        <div className="flex items-center gap-2">
          {[
            { key: "all", label: "All" },
            { key: "info", label: "Info" },
            { key: "warn", label: "Warn" },
            { key: "error", label: "Error" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => onLevelChange(item.key)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                level === item.key
                  ? "bg-sky-50 text-sky-700 border-sky-200"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Showing {filteredCount} of {totalCount} log entries.
      </p>
    </div>
  );
}
