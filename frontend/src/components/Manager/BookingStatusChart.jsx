import { PieChart, Pie, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const STATUSES = [
  { key: "confirmed",       label: "Confirmed",       color: "#3b82f6" },
  { key: "pending_payment", label: "Pending Payment", color: "#f59e0b" },
  { key: "checked_in",      label: "Checked In",      color: "#10b981" },
  { key: "completed",       label: "Completed",       color: "#6b7280" },
  { key: "cancelled",       label: "Cancelled",       color: "#ef4444" },
];

const chartConfig = Object.fromEntries(
  STATUSES.map(({ key, label, color }) => [key, { label, color }])
);

function BookingStatusChart({ bookings }) {
  const data = STATUSES.map((s) => ({
    name: s.key,
    label: s.label,
    value: bookings.filter((b) => b.bookingStatus === s.key).length,
    fill: s.color,
  })).filter((d) => d.value > 0);

  return (
    <div className="bg-white border border-border rounded-lg p-4 sm:p-5">
      <h3 className="font-semibold text-foreground mb-1">Booking Status</h3>
      <p className="text-xs text-muted-foreground mb-3">
        Breakdown of all booking statuses
      </p>

      {/* Chart — fixed height so it never clips */}
      <ChartContainer config={chartConfig} className="h-[180px] w-full">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            innerRadius="45%"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
        </PieChart>
      </ChartContainer>

      {/* Custom legend — 2-col grid so it never wraps awkwardly */}
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5 min-w-0">
            <span
              className="shrink-0 h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: entry.fill }}
            />
            <span className="text-xs text-muted-foreground truncate">
              {entry.label}
            </span>
            <span className="ml-auto text-xs font-medium text-foreground shrink-0">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingStatusChart;
