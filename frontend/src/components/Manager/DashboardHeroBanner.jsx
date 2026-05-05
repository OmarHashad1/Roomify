import { CalendarDays, DollarSign, CalendarCheck, Star } from "lucide-react";
import DashboardHeroStatCard from "@/components/Manager/DashboardHeroStatCard";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function DashboardHeroBanner({ stats, sparklines }) {
  const cards = [
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: CalendarDays,
      color: "#6366f1",
      trend: stats.bookingsTrend,
      sparklineData: sparklines.bookings,
    },
    {
      label: "Total Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: "#10b981",
      trend: stats.revenueTrend,
      sparklineData: sparklines.revenue,
    },
    {
      label: "Check-ins Today",
      value: stats.checkInsToday,
      icon: CalendarCheck,
      color: "#38bdf8",
      sublabel: `${stats.checkOutsToday} check-out${stats.checkOutsToday !== 1 ? "s" : ""} today`,
      sparklineData: sparklines.checkins,
    },
    {
      label: "Avg. Guest Rating",
      value: stats.avgRating,
      icon: Star,
      color: "#f59e0b",
      sublabel: `Based on ${stats.totalReviews} review${stats.totalReviews !== 1 ? "s" : ""}`,
      sparklineData: sparklines.ratings,
    },
  ];

  return (
    <div
      className="rounded-2xl p-5 sm:p-6"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      {/* Greeting */}
      <h1 className="text-xl sm:text-2xl font-bold text-white">
        {getGreeting()}, Manager 👋
      </h1>
      <p className="text-sm text-white/70 mt-1 mb-5">
        Here's what's happening at your hotel today.
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {cards.map((card) => (
          <DashboardHeroStatCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
}

export default DashboardHeroBanner;
