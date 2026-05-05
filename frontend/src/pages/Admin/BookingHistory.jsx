import { useContext, useEffect, useMemo, useState } from "react";
import {
  Search,
  CalendarClock,
  CheckCircle2,
  Clock3,
  XCircle,
  ChevronDown,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getBookingById } from "@/services/admin.service";
import { BookingContext } from "@/context/booking/BookingContext";
import { PageHeader } from "@/components/Admin/PageHeader";

const CANCELLED_STATUSES = [
  "cancelled_by_user",
  "cancelled_by_hotel",
  "cancelled_by_admin",
];

const STATUS_STYLE = {
  pending_payment: "bg-amber-50 text-amber-600 border-amber-100",
  confirmed: "bg-emerald-50 text-emerald-600 border-emerald-100",
  checked_in: "bg-blue-50 text-blue-600 border-blue-100",
  completed: "bg-violet-50 text-violet-600 border-violet-100",
  cancelled_by_user: "bg-red-50 text-red-600 border-red-100",
  cancelled_by_hotel: "bg-red-50 text-red-600 border-red-100",
  cancelled_by_admin: "bg-red-50 text-red-600 border-red-100",
};

const PAYMENT_STYLE = {
  paid: "bg-emerald-50 text-emerald-600 border-emerald-100",
  pending: "bg-amber-50 text-amber-600 border-amber-100",
  failed: "bg-red-50 text-red-600 border-red-100",
  refunded: "bg-cyan-50 text-cyan-600 border-cyan-100",
};

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtMoney(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function BookingDetailsModal({ bookingId, onClose, onViewUser, onViewHotel }) {
  const isOpen = !!bookingId;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    setError(null);
    setBooking(null);
    getBookingById(bookingId)
      .then(({ data }) => setBooking(data.data))
      .catch((err) => {
        const s = err.response?.status;
        setError(
          s === 404
            ? "Booking not found"
            : "Something went wrong. Please try again.",
        );
      })
      .finally(() => setLoading(false));
  }, [bookingId]);

  const hotel = booking?.hotel;
  const customer = booking?.customer;
  const roomType = booking?.roomType;

  return (
    <div
      className={`fixed inset-0 z-70 overflow-hidden
        ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0"}`}
      />

      <div
        className={`absolute top-4 bottom-4 bg-gray-50 rounded-2xl
          shadow-2xl flex flex-col transition-all duration-300 ease-in-out overflow-hidden
          inset-x-4 sm:left-auto sm:right-4 sm:w-full sm:max-w-md
          ${isOpen ? "translate-x-0 opacity-100" : "translate-x-[110%] opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Booking Details
            </p>
            <h2 className="text-base font-bold text-gray-800 mt-0.5 truncate">
              {hotel?.name ?? "Hotel"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-5 space-y-4">
          {loading ? (
            <div className="flex justify-center py-14">
              <Loader2 size={28} className="animate-spin text-gray-300" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <AlertCircle size={32} className="text-gray-200" />
              <p className="text-sm font-semibold text-gray-400">{error}</p>
            </div>
          ) : booking ? (
            <>
              <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3 mt-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-sm font-semibold text-gray-800">
                    {customer
                      ? `${customer.firstName} ${customer.lastName}`
                      : "Guest"}
                  </p>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLE[booking.status] ?? STATUS_STYLE.confirmed}`}
                  >
                    {booking.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${PAYMENT_STYLE[booking.paymentStatus] ?? PAYMENT_STYLE.pending}`}
                  >
                    {booking.paymentStatus}
                  </span>
                  {roomType?.type && (
                    <span className="text-xs text-gray-500">
                      {roomType.type}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700">
                  {fmtDate(booking.checkIn)} – {fmtDate(booking.checkOut)}
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Guest
                </p>
                <p className="text-xs text-gray-600">
                  Email:{" "}
                  {booking.updatedInformation?.email ?? customer?.email ?? "—"}
                </p>
                <p className="text-xs text-gray-600">
                  Phone:{" "}
                  {booking.updatedInformation?.phone ?? customer?.phone ?? "—"}
                </p>
                <p className="text-xs text-gray-600">
                  Guests: {booking.numGuests}
                </p>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  Booking Meta
                </p>
                <p className="text-xs text-gray-600">
                  Booking ID: {booking._id}
                </p>
                <p className="text-xs text-gray-600">
                  Subtotal: {fmtMoney(booking.subtotal)}
                </p>
                <p className="text-xs text-gray-600">
                  Final Night Price: {fmtMoney(booking.finalNightPrice)}
                </p>
                <p className="text-xs text-gray-600">
                  Payment Method: {booking.paymentMethod}
                </p>
                <p className="text-xs text-gray-600">
                  Created: {fmtDate(booking.createdAt)}
                </p>
                {booking.cancelledAt && (
                  <p className="text-xs text-gray-600">
                    Cancelled: {fmtDate(booking.cancelledAt)}
                  </p>
                )}
              </div>
            </>
          ) : null}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 bg-white space-y-2.5 shrink-0">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onViewUser}
              disabled={!customer?._id}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold border
              bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-500 hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              View User
            </button>
            <button
              onClick={onViewHotel}
              disabled={!hotel?._id}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold border
              bg-cyan-50 text-cyan-600 border-cyan-200 hover:bg-cyan-500 hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              View Hotel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingHistory() {
  const navigate = useNavigate();

  const {
    bookings = [],
    loading,
    error,
  } = useContext(BookingContext) || {};

  const [search, setSearch] = useState("");
  const [selectedHotel, setSelectedHotel] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedBookingMeta, setSelectedBookingMeta] = useState(null);
  const [collapsedHotels, setCollapsedHotels] = useState({});

  const counts = {
    total: bookings.length,
    pending_payment: bookings.filter((b) => b.status === "pending_payment").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    checked_in: bookings.filter((b) => b.status === "checked_in").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => CANCELLED_STATUSES.includes(b.status)).length,
  };

  const stats = [
    {
      label: "Total Bookings",
      value: counts.total,
      hint: "Across all hotels",
      icon: CalendarClock,
      color: "#4f46e5",
      iconTint: "#ffffff33",
    },
    {
      label: "Confirmed",
      value: counts.confirmed,
      hint: "Upcoming reservations",
      icon: CheckCircle2,
      color: "#059669",
      iconTint: "#6ee7b755",
    },
    {
      label: "Checked In",
      value: counts.checked_in,
      hint: "Currently staying",
      icon: Clock3,
      color: "#0284c7",
      iconTint: "#7dd3fc55",
    },
    {
      label: "Cancelled",
      value: counts.cancelled,
      hint: "Needs follow-up",
      icon: XCircle,
      color: "#dc2626",
      iconTint: "#fda4af66",
    },
  ];

  const filteredBookings = bookings.filter((booking) => {
    const hotel = booking.hotel;
    const customer = booking.customer;
    const q = search.trim().toLowerCase();

    const matchesHotel = selectedHotel === "all" || hotel?._id === selectedHotel;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "cancelled"
        ? CANCELLED_STATUSES.includes(booking.status)
        : booking.status === statusFilter);
    const matchesQuery =
      q.length === 0 ||
      booking._id.toLowerCase().includes(q) ||
      (hotel?.name || "").toLowerCase().includes(q) ||
      `${customer?.firstName || ""} ${customer?.lastName || ""}`
        .toLowerCase()
        .includes(q);

    return matchesHotel && matchesStatus && matchesQuery;
  });

  const groupedByHotel = useMemo(() => {
    const groups = filteredBookings.reduce((acc, booking) => {
      const key = booking.hotel?._id ?? "__unknown__";
      if (!acc[key]) acc[key] = { hotel: booking.hotel, items: [] };
      acc[key].items.push(booking);
      return acc;
    }, {});

    return Object.entries(groups)
      .map(([hotelId, { hotel, items }]) => ({
        hotelId,
        hotelName: hotel?.name || "Unknown Hotel",
        city: hotel?.address?.city || "Unknown City",
        items: items
          .slice()
          .sort(
            (a, b) =>
              new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime(),
          ),
        totalGuests: items.reduce((sum, item) => sum + (item.numGuests || 0), 0),
      }))
      .sort((a, b) => b.items.length - a.items.length);
  }, [filteredBookings]);

  const hotelOptions = useMemo(() => {
    const countByHotel = bookings.reduce((acc, b) => {
      const id = b.hotel?._id;
      if (!id) return acc;
      if (!acc[id]) acc[id] = { id, label: b.hotel.name, count: 0 };
      acc[id].count += 1;
      return acc;
    }, {});
    return [
      { id: "all", label: "All Hotels", count: bookings.length },
      ...Object.values(countByHotel),
    ];
  }, [bookings]);

  const statusOptions = [
    {
      key: "all",
      label: "All",
      count: counts.total,
      activeClass: "bg-(--color-primary) text-white border-(--color-primary)",
    },
    {
      key: "pending_payment",
      label: "Pending Payment",
      count: counts.pending_payment,
      activeClass: "bg-amber-500 text-white border-amber-500",
    },
    {
      key: "confirmed",
      label: "Confirmed",
      count: counts.confirmed,
      activeClass: "bg-emerald-500 text-white border-emerald-500",
    },
    {
      key: "checked_in",
      label: "Checked In",
      count: counts.checked_in,
      activeClass: "bg-blue-500 text-white border-blue-500",
    },
    {
      key: "completed",
      label: "Completed",
      count: counts.completed,
      activeClass: "bg-violet-500 text-white border-violet-500",
    },
    {
      key: "cancelled",
      label: "Cancelled",
      count: counts.cancelled,
      activeClass: "bg-red-500 text-white border-red-500",
    },
  ];

  const toggleHotelSection = (hotelId) => {
    setCollapsedHotels((prev) => ({ ...prev, [hotelId]: !prev[hotelId] }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-14">
        <Loader2 size={28} className="animate-spin text-gray-300" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-14 gap-3">
        <AlertCircle size={32} className="text-gray-200" />
        <p className="text-sm font-semibold text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings"
        subtitle="Track reservations grouped by hotel and manage booking lifecycle."
        subtitleClassName="text-sm text-white/60 mt-1"
        stats={stats}
        statsGridClassName="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        statCardProps={{
          cardClassName: "duration-500 min-w-0",
          animationDuration: "0.5s",
        }}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 shrink-0">
                Status
              </p>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
                {statusOptions.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setStatusFilter(item.key)}
                    className={`shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer
                      ${
                        statusFilter === item.key
                          ? item.activeClass
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                      }`}
                  >
                    {item.label}
                    <span
                      className={`text-xs ${statusFilter === item.key ? "text-white/80" : "text-gray-400"}`}
                    >
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full lg:w-72 lg:ml-auto lg:shrink-0">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search booking, hotel or customer"
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-(--color-primary)"
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/30 px-3 py-3 space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-1">
              Hotels
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {hotelOptions.slice(0, 8).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedHotel(opt.id)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer
                    ${
                      selectedHotel === opt.id
                        ? "bg-(--color-primary) text-white border-(--color-primary)"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                    }`}
                >
                  {opt.label}
                  <span
                    className={`text-xs ${selectedHotel === opt.id ? "text-white/80" : "text-gray-400"}`}
                  >
                    {opt.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {groupedByHotel.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <CalendarClock size={30} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No bookings found</p>
            </div>
          ) : (
            groupedByHotel.map((group) => (
              <div
                key={group.hotelId}
                className="border border-gray-100 rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleHotelSection(group.hotelId)}
                  className="w-full px-4 py-3 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between gap-3 text-left hover:bg-gray-100/70 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {group.hotelName}
                    </p>
                    <p className="text-xs text-gray-500">{group.city}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{group.items.length} bookings</span>
                    <span>{group.totalGuests} guests</span>
                    <ChevronDown
                      size={15}
                      className={`text-gray-400 transition-transform ${collapsedHotels[group.hotelId] ? "-rotate-90" : "rotate-0"}`}
                    />
                  </div>
                </button>

                {!collapsedHotels[group.hotelId] && (
                  <div className="divide-y divide-gray-100">
                    {group.items.map((booking) => {
                      const customer = booking.customer;
                      return (
                        <button
                          key={booking._id}
                          onClick={() => {
                            setSelectedBookingId(booking._id);
                            setSelectedBookingMeta({
                              hotelId: booking.hotel?._id,
                              customerId: booking.customer?._id,
                            });
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${STATUS_STYLE[booking.status] ?? STATUS_STYLE.confirmed}`}
                                >
                                  {booking.status}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${PAYMENT_STYLE[booking.paymentStatus] ?? PAYMENT_STYLE.pending}`}
                                >
                                  {booking.paymentStatus}
                                </span>
                                {booking.roomType?.type && (
                                  <span className="text-xs text-gray-400">
                                    {booking.roomType.type}
                                  </span>
                                )}
                              </div>

                              <p className="text-sm text-gray-700 wrap-break-word line-clamp-2">
                                {customer
                                  ? `${customer.firstName} ${customer.lastName}`
                                  : "Guest"}{" "}
                                · {fmtDate(booking.checkIn)} to{" "}
                                {fmtDate(booking.checkOut)} ·{" "}
                                {fmtMoney(booking.subtotal)}
                              </p>
                            </div>

                            <div className="text-xs text-gray-500 md:text-right shrink-0">
                              <p>{booking._id}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <BookingDetailsModal
        bookingId={selectedBookingId}
        onClose={() => {
          setSelectedBookingId(null);
          setSelectedBookingMeta(null);
        }}
        onViewUser={() => {
          const uid = selectedBookingMeta?.customerId;
          if (!uid) return;
          navigate(`/admin/users/${uid}`);
          setSelectedBookingId(null);
          setSelectedBookingMeta(null);
        }}
        onViewHotel={() => {
          const hid = selectedBookingMeta?.hotelId;
          if (!hid) return;
          navigate(`/admin/hotels/${hid}`);
          setSelectedBookingId(null);
          setSelectedBookingMeta(null);
        }}
      />
    </div>
  );
}

export default BookingHistory;
