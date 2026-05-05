import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import BookingStatusBadge from "./BookingStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";
import SortIcon from "./SortIcon";

const COLUMNS = [
  { key: "id", label: "Booking ID", sortable: true },
  { key: "guestName", label: "Guest", sortable: true },
  { key: "checkIn", label: "Check-in", sortable: true },
  { key: "checkOut", label: "Check-out", sortable: true },
  { key: "roomType", label: "Room Type", sortable: false },
  { key: "numRooms", label: "Rooms", sortable: false },
  { key: "numGuests", label: "Guests", sortable: false },
  { key: "bookingStatus", label: "Status", sortable: true },
  { key: "paymentStatus", label: "Payment", sortable: true },
  { key: "totalPrice", label: "Total", sortable: true },
  { key: "actions", label: "", sortable: false },
];

function BookingsTable({
  bookings,
  loading = false,
  sortKey,
  sortDir,
  onSort,
  onViewDetails,
}) {
  function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatPrice(price) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  }

  if (loading) {
    return (
      <div className="bg-white border border-border rounded-lg py-16 flex flex-col items-center justify-center gap-2 text-center">
        <Spinner className="size-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading bookings...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white border border-border rounded-lg py-16 flex flex-col items-center justify-center text-center">
        <p className="text-muted-foreground text-sm">There are no matching bookings.</p>
        <p className="text-muted-foreground text-xs mt-1">Try adjusting or clearing the filters above.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      {/* ── Mobile + Tablet card layout (hidden on lg+) ── */}
      <div className="lg:hidden divide-y divide-border">
        {bookings.map((booking) => (
          <div key={booking.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-xs text-[var(--color-link)] font-medium truncate">
                  {booking.id}
                </p>
                <p className="font-medium text-foreground truncate">{booking.guest.name}</p>
                <p className="text-xs text-muted-foreground truncate">{booking.guest.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails(booking)}
                title="View booking details"
                className="shrink-0"
              >
                <Eye className="size-4" />
                <span className="sr-only">View</span>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <BookingStatusBadge status={booking.bookingStatus} />
              <PaymentStatusBadge status={booking.paymentStatus} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Check-in</p>
                <p className="text-foreground">{formatDate(booking.checkIn)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Check-out</p>
                <p className="text-foreground">{formatDate(booking.checkOut)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Room</p>
                <p className="text-foreground">{booking.roomType}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-semibold text-foreground">{formatPrice(booking.totalPrice)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop table layout (hidden below lg) ── */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap ${
                    col.sortable ? "cursor-pointer select-none hover:text-foreground" : ""
                  }`}
                  onClick={() => col.sortable && onSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <SortIcon column={col.key} sortKey={sortKey} sortDir={sortDir} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs text-[var(--color-link)] font-medium whitespace-nowrap">
                  {booking.id}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="font-medium text-foreground">{booking.guest.name}</div>
                  <div className="text-xs text-muted-foreground">{booking.guest.email}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-foreground">
                  {formatDate(booking.checkIn)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-foreground">
                  {formatDate(booking.checkOut)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-foreground">
                  {booking.roomType}
                </td>
                <td className="px-4 py-3 text-center text-foreground">{booking.numRooms}</td>
                <td className="px-4 py-3 text-center text-foreground">{booking.numGuests}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <BookingStatusBadge status={booking.bookingStatus} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <PaymentStatusBadge status={booking.paymentStatus} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-foreground">
                  {formatPrice(booking.totalPrice)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(booking)}
                    title="View booking details"
                  >
                    <Eye className="size-4" />
                    <span className="sr-only">View</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingsTable;
