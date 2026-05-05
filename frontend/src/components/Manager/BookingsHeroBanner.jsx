import { CalendarDays, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import DashboardHeroStatCard from "@/components/Manager/DashboardHeroStatCard";

function buildSparklines(bookings) {
  const monthMap = {};
  const revenueMap = {};
  const activeMap = {};
  const pendingMap = {};

  bookings.forEach((b) => {
    const k = b.checkIn.slice(0, 7);
    monthMap[k]   = (monthMap[k]   || 0) + 1;
    if (b.paymentStatus === "paid") revenueMap[k] = (revenueMap[k] || 0) + b.totalPrice;
    if (["confirmed", "checked_in"].includes(b.bookingStatus)) activeMap[k]  = (activeMap[k]  || 0) + 1;
    if (b.bookingStatus === "pending_payment")                  pendingMap[k] = (pendingMap[k] || 0) + 1;
  });

  const keys = [...new Set([
    ...Object.keys(monthMap),
    ...Object.keys(revenueMap),
    ...Object.keys(activeMap),
    ...Object.keys(pendingMap),
  ])].sort();

  return {
    total:   keys.map((k) => monthMap[k]   || 0),
    revenue: keys.map((k) => revenueMap[k] || 0),
    active:  keys.map((k) => activeMap[k]  || 0),
    pending: keys.map((k) => pendingMap[k] || 0),
  };
}

function trendPct(spark) {
  if (spark.length < 2) return null;
  const prev = spark[spark.length - 2];
  const curr = spark[spark.length - 1];
  if (!prev) return null;
  return Math.round(((curr - prev) / prev) * 100);
}

function BookingsHeroBanner({ bookings }) {
  const total   = bookings.length;
  const active  = bookings.filter((b) => ["confirmed", "checked_in"].includes(b.bookingStatus)).length;
  const pending = bookings.filter((b) => b.bookingStatus === "pending_payment").length;
  const revenue = bookings.filter((b) => b.paymentStatus === "paid").reduce((s, b) => s + b.totalPrice, 0);

  const sparklines = buildSparklines(bookings);

  const cards = [
    {
      label: "Total Bookings",
      value: total,
      icon: CalendarDays,
      color: "#6366f1",
      trend: trendPct(sparklines.total),
      sparklineData: sparklines.total,
    },
    {
      label: "Active Bookings",
      value: active,
      icon: CheckCircle2,
      color: "#10b981",
      trend: trendPct(sparklines.active),
      sparklineData: sparklines.active,
    },
    {
      label: "Pending Payment",
      value: pending,
      icon: Clock,
      color: "#f59e0b",
      trend: trendPct(sparklines.pending),
      sparklineData: sparklines.pending,
    },
    {
      label: "Revenue (Paid)",
      value: `$${revenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "#a855f7",
      trend: trendPct(sparklines.revenue),
      sparklineData: sparklines.revenue,
    },
  ];

  return (
    <div
      className="rounded-2xl p-5 sm:p-6"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <h1 className="text-xl sm:text-2xl font-bold text-white">Hotel Bookings</h1>
      <p className="text-sm text-white/70 mt-1 mb-5">
        Manage and track all reservations in one place.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {cards.map((card) => (
          <DashboardHeroStatCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
}

export default BookingsHeroBanner;
