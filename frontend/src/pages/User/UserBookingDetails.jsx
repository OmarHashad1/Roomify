import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  BedDouble,
  Users,
  CreditCard,
  MapPin,
  ClipboardList,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { getBookingDetails } from "@/services/booking.service";
import { humanize } from "@/utils/util";

function StatusBadge({ status }) {
  const cancelled = {
    bg: "bg-red-50",
    text: "text-red-500",
    icon: AlertCircle,
  };
  const map = {
    confirmed: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      label: "Confirmed",
      icon: CheckCircle2,
    },
    pending_payment: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      label: "Pending Payment",
      icon: Clock,
    },
    completed: {
      bg: "bg-gray-100",
      text: "text-gray-500",
      label: "Completed",
      icon: CheckCircle2,
    },
    checked_in: {
      bg: "bg-green-50",
      text: "text-green-600",
      label: "Current Stay",
      icon: CheckCircle2,
    },
    cancelled_by_user: { ...cancelled, label: "Cancelled" },
    cancelled_by_hotel: { ...cancelled, label: "Cancelled by Hotel" },
    cancelled_by_admin: { ...cancelled, label: "Cancelled by Admin" },
  };
  const s = map[status] || {
    bg: "bg-gray-100",
    text: "text-gray-500",
    label: humanize(status),
    icon: Clock,
  };
  const Icon = s.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}
    >
      <Icon size={11} />
      {s.label}
    </span>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          {title}
        </p>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function Row({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      {Icon && (
        <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
          <Icon size={13} className="text-(--color-primary)" />
        </div>
      )}
      <div className="flex-1 flex items-center justify-between gap-4 min-w-0">
        <p className="text-xs text-gray-400 font-medium shrink-0">{label}</p>
        <p className="text-sm font-semibold text-gray-800 text-right">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default function UserBookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getBookingDetails(id)
      .then(({ data }) => setBooking(data.data))
      .catch((err) => {
        const status = err.response?.status;
        setError(
          status === 400 || status === 404
            ? "Booking not found."
            : "Something went wrong. Please try again.",
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  const hotel = booking?.hotel;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <Loader2 size={32} className="animate-spin text-gray-300" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs px-8 py-12 text-center max-w-sm w-full">
          <AlertCircle size={36} className="text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-500">
            {error || "Booking not found."}
          </p>
          <button
            onClick={() => navigate("/user/profile/bookings")}
            className="mt-5 text-sm font-semibold text-(--color-primary) hover:underline cursor-pointer"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const fmt = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "—";

  const nights =
    booking.checkIn && booking.checkOut
      ? Math.round(
          (new Date(booking.checkOut) - new Date(booking.checkIn)) / 86_400_000,
        )
      : null;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Back button */}
        <button
          onClick={() => navigate("/user/profile/bookings")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-(--color-primary) transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Hero card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="relative h-24 bg-linear-to-r from-(--color-primary) to-[#1a6a96]">
            <div className="absolute -bottom-6 left-5">
              <div className="w-12 h-12 rounded-xl bg-white shadow-md border-2 border-white flex items-center justify-center">
                <BedDouble size={20} className="text-(--color-primary)" />
              </div>
            </div>
          </div>
          <div className="px-5 pt-10 pb-5">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-base font-bold text-gray-900 leading-tight">
                  {hotel?.name || booking.guest?.name || "Hotel Booking"}
                </h1>
                {hotel?.address?.city && (
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <MapPin size={10} />
                    {hotel.address.city}
                  </p>
                )}
              </div>
              <StatusBadge status={booking.bookingStatus} />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Booking ID:{" "}
              <span className="font-mono text-gray-600">{booking._id}</span>
            </p>
          </div>
        </div>

        {/* Stay details */}
        <Section title="Stay Details">
          <Row
            label="Check-in"
            value={fmt(booking.checkIn)}
            icon={CalendarDays}
          />
          <Row
            label="Check-out"
            value={fmt(booking.checkOut)}
            icon={CalendarDays}
          />
          {nights !== null && (
            <Row
              label="Duration"
              value={`${nights} night${nights !== 1 ? "s" : ""}`}
              icon={CalendarDays}
            />
          )}
          <Row label="Room Type" value={humanize(booking.roomType)} icon={BedDouble} />
          <Row label="Guests" value={booking.numGuests} icon={Users} />
          <Row
            label="Booked on"
            value={fmt(booking.createdAt)}
            icon={CalendarDays}
          />
          {booking.bookingStatus?.startsWith("cancelled") && (
            <Row
              label="Cancelled on"
              value={fmt(booking.cancelledAt)}
              icon={CalendarDays}
            />
          )}
        </Section>

        {/* Guest info */}
        <Section title="Guest Information">
          <Row label="Name" value={booking.guest?.name} icon={Users} />
          <Row
            label="Email"
            value={booking.guest?.email}
            icon={ClipboardList}
          />
          <Row
            label="Phone"
            value={booking.guest?.phone}
            icon={ClipboardList}
          />
        </Section>

        {/* Payment */}
        <Section title="Payment">
          <Row label="Total" value={`$${booking.subtotal}`} icon={Receipt} />
          <Row
            label="Price per night"
            value={`$${booking.finalNightPrice}`}
            icon={Receipt}
          />
          <Row
            label="Method"
            value={humanize(booking.payment?.method)}
            icon={CreditCard}
          />
          <Row
            label="Payment Status"
            value={humanize(booking.paymentStatus)}
            icon={CheckCircle2}
          />
        </Section>
      </div>
    </div>
  );
}
