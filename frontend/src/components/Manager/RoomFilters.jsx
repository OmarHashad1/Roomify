import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ROOM_STATUSES = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const BEDROOM_OPTIONS = [
  { value: "", label: "All Bedrooms" },
  { value: "1", label: "1 Bedroom" },
  { value: "2", label: "2 Bedrooms" },
  { value: "3", label: "3 Bedrooms" },
];

function RoomFilters({ filters, onChange, onReset }) {
  function handleChange(field, value) {
    onChange({ ...filters, [field]: value });
  }

  const hasActiveFilters = filters.search || filters.status || filters.bedroom;

  return (
    <div className="bg-white border border-border rounded-lg p-4 space-y-4">
      {/* Search + reset row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by view, description…"
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            className="w-full rounded-input border border-border bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
          />
        </div>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onReset} className="shrink-0">
            <X className="size-3.5" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-3">
        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="w-full sm:w-auto min-w-[140px] rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-foreground"
        >
          {ROOM_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Bedrooms */}
        <select
          value={filters.bedroom}
          onChange={(e) => handleChange("bedroom", e.target.value)}
          className="w-full sm:w-auto min-w-[140px] rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-foreground"
        >
          {BEDROOM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default RoomFilters;
