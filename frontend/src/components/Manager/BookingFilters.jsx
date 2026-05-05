import { Search, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const BOOKING_STATUSES = [
  { value: "", label: "All Statuses" },
  { value: "pending_payment", label: "Pending Payment" },
  { value: "confirmed", label: "Confirmed" },
  { value: "checked_in", label: "Checked In" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_STATUSES = [
  { value: "", label: "All Payments" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "refunded", label: "Refunded" },
  { value: "failed", label: "Failed" },
];

function BookingFilters({ filters, onChange, onReset }) {
  function handleChange(field, value) {
    onChange({ ...filters, [field]: value });
  }

  const hasActiveFilters =
    filters.search ||
    filters.bookingStatus ||
    filters.paymentStatus ||
    filters.checkInFrom ||
    filters.checkInTo;

  return (
    <div className="bg-white border border-border rounded-lg p-4 space-y-4">
      {/* Search + reset row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Guest search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by guest name or booking ID…"
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
        {/* Booking status */}
        <select
          value={filters.bookingStatus}
          onChange={(e) => handleChange("bookingStatus", e.target.value)}
          className="w-full sm:w-auto min-w-[140px] rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-foreground"
        >
          {BOOKING_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Payment status */}
        <select
          value={filters.paymentStatus}
          onChange={(e) => handleChange("paymentStatus", e.target.value)}
          className="w-full sm:w-auto min-w-[140px] rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-foreground"
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Check-in date range */}
        <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
          <Calendar className="size-4 text-muted-foreground shrink-0" />
          <input
            type="date"
            value={filters.checkInFrom}
            onChange={(e) => handleChange("checkInFrom", e.target.value)}
            className="flex-1 sm:flex-none rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-foreground"
            title="Check-in from"
          />
          <span className="text-muted-foreground text-sm">–</span>
          <input
            type="date"
            value={filters.checkInTo}
            onChange={(e) => handleChange("checkInTo", e.target.value)}
            className="flex-1 sm:flex-none rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring text-foreground"
            title="Check-in to"
          />
        </div>
      </div>
    </div>
  );
}

export default BookingFilters;
