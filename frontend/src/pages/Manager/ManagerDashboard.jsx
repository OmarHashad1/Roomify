import { useEffect, useMemo, useState } from "react";
import {
  Star,
  BedDouble,
  ClipboardList,
  Building2,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { getManagedHotelBookings, getManagedHotelReviews } from "@/services/manager.service";
import { getMyHotelRoomTypes } from "@/services/roomType.service";

import DashboardHeroBanner from "@/components/Manager/DashboardHeroBanner";
import BookingStatusChart from "@/components/Manager/BookingStatusChart";
import RevenueChart from "@/components/Manager/RevenueChart";
import RecentBookingsTable from "@/components/Manager/RecentBookingsTable";
import RecentReviewsList from "@/components/Manager/RecentReviewsList";
import RoomOccupancyCard from "@/components/Manager/RoomOccupancyCard";
import QuickActionsCard from "@/components/Manager/QuickActionsCard";

const QUICK_ACTIONS = [
  { label: "Bookings", to: "/manager/bookings", icon: ClipboardList, color: "#6366f1" },
  { label: "Rooms",    to: "/manager/rooms",    icon: BedDouble,     color: "#10b981" },
  { label: "Reviews",  to: "/manager/reviews",  icon: Star,          color: "#f59e0b" },
  { label: "Profile",  to: "/manager/hotel-profile", icon: Building2, color: "#3b82f6" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function monthKey(dateStr) {
  return dateStr.slice(0, 7); // "YYYY-MM"
}

function trendPct(curr, prev) {
  if (!prev) return null;
  return Math.round(((curr - prev) / prev) * 100);
}

function buildMonthlyAggregates(bookings) {
  const map = {};
  bookings.forEach((b) => {
    const k = monthKey(b.checkIn);
    if (!map[k]) map[k] = { count: 0, revenue: 0 };
    map[k].count++;
    if (b.paymentStatus === "paid") map[k].revenue += b.totalPrice;
  });
  const keys = Object.keys(map).sort();
  return { keys, map };
}

// ── Page ─────────────────────────────────────────────────────────────────────
function ManagerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [totalRooms, setTotalRooms] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadDashboardData = async () => {
      setLoading(true);
      setError("");
      try {
        const [bookingsData, reviewsData, roomTypesData] = await Promise.all([
          getManagedHotelBookings(),
          getManagedHotelReviews(),
          getMyHotelRoomTypes(),
        ]);

        if (cancelled) return;

        setBookings(bookingsData);
        setReviews(reviewsData);
        setTotalRooms(roomTypesData.length);
      } catch (err) {
        if (cancelled) return;
        setError(err.response?.data?.message || err.message || "Failed to load dashboard data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDashboardData();

    return () => {
      cancelled = true;
    };
  }, []);

  const { stats, sparklines } = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const { keys, map } = buildMonthlyAggregates(bookings);

    // Sparkline arrays (all months that have data)
    const bookingsSpark = keys.map((k) => map[k].count);
    const revenueSpark  = keys.map((k) => map[k].revenue);

    // Trends: last month vs second-to-last month
    const lastKey = keys[keys.length - 1];
    const prevKey = keys[keys.length - 2];
    const bookingsTrend = trendPct(
      map[lastKey]?.count   ?? 0,
      map[prevKey]?.count   ?? 0
    );
    const revenueTrend = trendPct(
      map[lastKey]?.revenue ?? 0,
      map[prevKey]?.revenue ?? 0
    );

    // Check-ins sparkline: daily counts per month for current data range
    const dailyCheckins = {};
    bookings.forEach((b) => {
      dailyCheckins[b.checkIn] = (dailyCheckins[b.checkIn] || 0) + 1;
    });
    const checkinsSpark = Object.keys(dailyCheckins)
      .sort()
      .map((d) => dailyCheckins[d]);

    // Ratings sparkline: rolling avg per month
    const ratingMap = {};
    reviews.forEach((r) => {
      const k = monthKey(r.createdAt);
      if (!ratingMap[k]) ratingMap[k] = { sum: 0, count: 0 };
      ratingMap[k].sum   += r.rating;
      ratingMap[k].count += 1;
    });
    const ratingsSpark = Object.keys(ratingMap)
      .sort()
      .map((k) => parseFloat((ratingMap[k].sum / ratingMap[k].count).toFixed(1)));

    const revenue = bookings.filter((b) => b.paymentStatus === "paid").reduce(
      (s, b) => s + b.totalPrice, 0
    );
    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : "N/A";
    const bookedRooms = bookings.filter((b) =>
      ["confirmed", "checked_in"].includes(b.bookingStatus)
    ).length;

    return {
      stats: {
        totalBookings:  bookings.length,
        revenue,
        checkInsToday:  bookings.filter((b) => b.checkIn  === today).length,
        checkOutsToday: bookings.filter((b) => b.checkOut === today).length,
        avgRating,
        totalReviews:   reviews.length,
        bookedRooms,
        bookingsTrend,
        revenueTrend,
      },
      sparklines: {
        bookings: bookingsSpark,
        revenue:  revenueSpark,
        checkins: checkinsSpark,
        ratings:  ratingsSpark,
      },
    };
  }, [bookings, reviews]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Loader2 size={32} className="animate-spin mb-3 opacity-40" />
        <p className="text-sm">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* ── Hero Banner ── */}
      <DashboardHeroBanner stats={stats} sparklines={sparklines} />

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BookingStatusChart bookings={bookings} />
        <RevenueChart bookings={bookings} />
      </div>

      {/* ── Recent Bookings + Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentBookingsTable bookings={bookings} />
        </div>
        <QuickActionsCard actions={QUICK_ACTIONS} />
      </div>

      {/* ── Reviews + Occupancy ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RecentReviewsList reviews={reviews} />
        <RoomOccupancyCard totalRooms={totalRooms} bookedRooms={stats.bookedRooms} />
      </div>
    </div>
  );
}

export default ManagerDashboard;
