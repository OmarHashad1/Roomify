import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import BookingFilters from "@/components/Manager/BookingFilters";
import BookingsTable from "@/components/Manager/BookingsTable";
import BookingDetailsModal from "@/components/Manager/BookingDetailsModal";
import BookingsHeroBanner from "@/components/Manager/BookingsHeroBanner";
import {
  getManagedHotelBookings,
  updateManagedBookingStatus,
} from "@/services/manager.service";

// ─── Default filters ──────────────────────────────────────────────────────────
const DEFAULT_FILTERS = {
  search: "",
  bookingStatus: "",
  paymentStatus: "",
  checkInFrom: "",
  checkInTo: "",
};

// ─── Main page ────────────────────────────────────────────────────────────────
function HotelBookings() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortKey, setSortKey] = useState("checkIn");
  const [sortDir, setSortDir] = useState("asc");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError("");
        const payload = await getManagedHotelBookings();
        setBookings(payload);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load hotel bookings.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  // ── Filtering ──
  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !b.guest.name.toLowerCase().includes(q) &&
          !b.id.toLowerCase().includes(q)
        )
          return false;
      }
      if (filters.bookingStatus && b.bookingStatus !== filters.bookingStatus)
        return false;
      if (filters.paymentStatus && b.paymentStatus !== filters.paymentStatus)
        return false;
      if (filters.checkInFrom && b.checkIn < filters.checkInFrom) return false;
      if (filters.checkInTo && b.checkIn > filters.checkInTo) return false;
      return true;
    });
  }, [bookings, filters]);

  // ── Sorting ──
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal = sortKey === "guestName" ? a.guest.name : a[sortKey];
      let bVal = sortKey === "guestName" ? b.guest.name : b[sortKey];

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  async function handleAction(booking, actionKey) {
    const statusMap = {
      confirm: "confirmed",
      cancel: "cancelled_by_hotel",
      check_in: "checked_in",
      complete: "completed",
    };

    const toastMessages = {
      confirm: `Booking ${booking.id} confirmed.`,
      cancel: `Booking ${booking.id} has been cancelled.`,
      check_in: `${booking.guest.name} checked in successfully.`,
      complete: `Booking ${booking.id} marked as completed.`,
    };

    const newStatus = statusMap[actionKey];
    if (!newStatus) return;

    try {
      await updateManagedBookingStatus(booking.id, newStatus);

      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id ? { ...b, bookingStatus: newStatus } : b,
        ),
      );

      setSelectedBooking((prev) =>
        prev?.id === booking.id ? { ...prev, bookingStatus: newStatus } : prev,
      );

      if (actionKey === "cancel") {
        toast.error(toastMessages[actionKey]);
      } else {
        toast.success(toastMessages[actionKey]);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to update booking status.",
      );
    }
  }

  return (
    <div className="bg-muted/30 min-h-full">
      <div className="px-4 py-4 sm:px-6 sm:py-6 md:px-10 space-y-6">
        {/* Hero Banner */}
        <BookingsHeroBanner bookings={bookings} />

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        {/* Filters */}
        <BookingFilters
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
        />

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{sorted.length}</span>{" "}
          of{" "}
          <span className="font-medium text-foreground">{bookings.length}</span>{" "}
          booking{bookings.length !== 1 ? "s" : ""}
        </p>

        {/* Table */}
        <BookingsTable
          bookings={sorted}
          loading={loading}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onViewDetails={setSelectedBooking}
        />
      </div>

      {/* Booking details side panel */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
}

export default HotelBookings;
