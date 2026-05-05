import { TrendingUp, TrendingDown } from "lucide-react";
import MiniSparkline from "@/components/Manager/MiniSparkline";

function DashboardHeroStatCard({ label, value, icon: Icon, color, trend, sublabel, sparklineData }) {
  const hasTrend = trend !== undefined && trend !== null;
  const isPositive = trend >= 0;

  return (
    <div className="bg-white rounded-xl p-4 flex flex-col gap-2 min-w-0">
      {/* Top row: label + icon */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground leading-tight">
          {label}
        </p>
        <div className="shrink-0 rounded-lg p-1.5" style={{ backgroundColor: `${color}18` }}>
          <Icon className="size-4" style={{ color }} />
        </div>
      </div>

      {/* Value */}
      <p className="text-2xl font-bold text-foreground leading-none">{value}</p>

      {/* Trend or sublabel */}
      {hasTrend ? (
        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            isPositive ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="size-3 shrink-0" />
          ) : (
            <TrendingDown className="size-3 shrink-0" />
          )}
          <span>
            {isPositive ? "+" : ""}
            {trend}% vs prev period
          </span>
        </div>
      ) : sublabel ? (
        <p className="text-xs text-muted-foreground">{sublabel}</p>
      ) : null}

      {/* Sparkline */}
      {sparklineData && sparklineData.length > 1 && (
        <div className="mt-1 -mx-1">
          <MiniSparkline data={sparklineData} color={color} />
        </div>
      )}
    </div>
  );
}

export default DashboardHeroStatCard;
