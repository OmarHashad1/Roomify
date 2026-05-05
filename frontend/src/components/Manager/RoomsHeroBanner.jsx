import { BedDouble, CheckCircle2, XCircle, DollarSign } from "lucide-react";
import DashboardHeroStatCard from "@/components/Manager/DashboardHeroStatCard";

function buildPriceSparklines(rooms) {
  const monthMap = {};
  rooms.forEach((r) => {
    const k = r.createdAt.slice(0, 7);
    if (!monthMap[k]) monthMap[k] = { sum: 0, count: 0 };
    monthMap[k].sum += r.pricePerNight;
    monthMap[k].count += 1;
  });
  const keys = Object.keys(monthMap).sort();
  return {
    total: keys.map((_, i) => i + 1),
    active: keys.map((k) => rooms.filter((r) => r.createdAt.startsWith(k) && r.status === "active").length),
    inactive: keys.map((k) => rooms.filter((r) => r.createdAt.startsWith(k) && r.status === "inactive").length),
    avgPrice: keys.map((k) => Math.round(monthMap[k].sum / monthMap[k].count)),
  };
}

function RoomsHeroBanner({ rooms }) {
  const total    = rooms.length;
  const active   = rooms.filter((r) => r.status === "active").length;
  const inactive = rooms.filter((r) => r.status !== "active").length;
  const avgPrice = total > 0
    ? Math.round(rooms.reduce((s, r) => s + r.pricePerNight, 0) / total)
    : 0;

  const sparklines = buildPriceSparklines(rooms);

  const cards = [
    {
      label: "Total Rooms",
      value: total,
      icon: BedDouble,
      color: "#6366f1",
      sparklineData: sparklines.total,
    },
    {
      label: "Active Rooms",
      value: active,
      icon: CheckCircle2,
      color: "#10b981",
      sparklineData: sparklines.active,
    },
    {
      label: "Inactive Rooms",
      value: inactive,
      icon: XCircle,
      color: "#ef4444",
      sparklineData: sparklines.inactive,
    },
    {
      label: "Avg. Price / Night",
      value: `$${avgPrice}`,
      icon: DollarSign,
      color: "#a855f7",
      sparklineData: sparklines.avgPrice,
    },
  ];

  return (
    <div
      className="rounded-2xl p-5 sm:p-6"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <h1 className="text-xl sm:text-2xl font-bold text-white">Hotel Rooms</h1>
      <p className="text-sm text-white/70 mt-1 mb-5">
        Manage and organise all room types available for booking.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {cards.map((card) => (
          <DashboardHeroStatCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
}

export default RoomsHeroBanner;
