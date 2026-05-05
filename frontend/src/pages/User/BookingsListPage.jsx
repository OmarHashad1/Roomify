import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  MapPin,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getMyBookings } from "@/services/booking.service";
import { humanize } from "@/utils/util";

export default function BookingsListPage() {
  const { setReviewSidebarBooking } = useOutletContext();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getMyBookings()
      .then(({ data }) => setBookings(data.data.bookings))
      .catch((err) => {
        const status = err.response?.status;
        setError(
          status === 400 || status === 404
            ? "No bookings found."
            : "Something went wrong. Please try again.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const cancelled = { bg: "bg-red-50", text: "text-red-500" };
  const statusStyles = {
    confirmed: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      label: "Confirmed",
    },
    pending_payment: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      label: "Pending Payment",
    },
    completed: {
      bg: "bg-gray-100",
      text: "text-gray-500",
      label: "Completed",
    },
    checked_in: {
      bg: "bg-green-50",
      text: "text-green-600",
      label: "Current Stay",
    },
    cancelled_by_user: { ...cancelled, label: "Cancelled" },
    cancelled_by_hotel: { ...cancelled, label: "Cancelled by Hotel" },
    cancelled_by_admin: { ...cancelled, label: "Cancelled by Admin" },
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
      <div className="relative h-20 bg-linear-to-r from-(--color-primary) to-[#1a6a96]">
        <div className="absolute -bottom-6 left-6">
          <div className="w-12 h-12 rounded-xl bg-white shadow-md border-2 border-white flex items-center justify-center">
            <BookOpen size={20} className="text-(--color-primary)" />
          </div>
        </div>
      </div>

      <div className="px-6 pt-10 pb-6">
        <h2 className="font-bold text-gray-900 text-base">My Bookings</h2>
        <p className="text-xs text-gray-400 mt-0.5 mb-6">
          {bookings.length} booking
          {bookings.length !== 1 ? "s" : ""} found
        </p>

        {loading ? (
          <div className="flex justify-center py-14">
            <Loader2 size={28} className="animate-spin text-gray-300" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <AlertCircle size={32} className="text-gray-200" />
            <p className="text-sm font-semibold text-gray-400">{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <BookOpen size={32} className="text-gray-200" />
            <p className="text-sm font-semibold text-gray-400">
              No bookings yet
            </p>
            <p className="text-xs text-gray-300">
              Your reservations will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const style = statusStyles[booking.status] || {
                bg: "bg-gray-100",
                text: "text-gray-500",
                label: humanize(booking.status),
              };
              return (
                <div
                  key={booking._id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen size={15} className="text-(--color-primary)" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {booking.hotel?.name || "Booking"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}
                          >
                            {style.label}
                          </span>
                          <span className="text-[11px] text-gray-400 flex items-center gap-1">
                            <CalendarDays size={10} />
                            {new Date(booking.checkIn).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                            {" - "}
                            {new Date(booking.checkOut).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-(--color-primary) shrink-0">
                        ${booking.subtotal}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-gray-400">
                        {humanize(booking.roomType?.type)}
                      </span>
                      {booking.hotel?.address?.city ? (
                        <span className="text-[11px] text-gray-400 flex items-center gap-0.5">
                          <MapPin size={9} />
                          {booking.hotel.address.city}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() =>
                          navigate(`/user/bookings/${booking._id}`)
                        }
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-(--color-primary) text-white hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        View Details
                      </button>
                      {booking.status === "completed" && !booking.hasReview && (
                        <button
                          onClick={() => setReviewSidebarBooking(booking)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-amber-300 text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                        >
                          Write a Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
