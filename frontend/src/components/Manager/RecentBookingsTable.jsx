import { Link } from "react-router-dom";
import BookingStatusBadge from "@/components/Manager/BookingStatusBadge";

function RecentBookingsTable({ bookings }) {
  const recent = [...bookings]
    .sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn))
    .slice(0, 5);

  return (
    <div className="bg-white border border-border rounded-lg p-4 sm:p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">Recent Bookings</h3>
          <p className="text-xs text-muted-foreground">Latest 5 reservations</p>
        </div>
        <Link
          to="/manager/bookings"
          className="text-xs text-primary hover:underline font-medium"
        >
          View all →
        </Link>
      </div>

      <div className="overflow-x-auto -mx-4 sm:-mx-5 px-4 sm:px-5">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Guest", "Room Type", "Check-in", "Check-out", "Status"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left text-xs text-muted-foreground font-medium pb-2 pr-3 last:pr-0"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {recent.map((b) => (
              <tr
                key={b.id || b._id}
                className="border-b border-border last:border-0"
              >
                <td className="py-2.5 pr-3 font-medium text-foreground whitespace-nowrap">
                  {b.guest.name}
                </td>
                <td className="py-2.5 pr-3 text-muted-foreground whitespace-nowrap">
                  {b.roomType}
                </td>
                <td className="py-2.5 pr-3 text-muted-foreground whitespace-nowrap">
                  {b.checkIn}
                </td>
                <td className="py-2.5 pr-3 text-muted-foreground whitespace-nowrap">
                  {b.checkOut}
                </td>
                <td className="py-2.5">
                  <BookingStatusBadge status={b.bookingStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentBookingsTable;
