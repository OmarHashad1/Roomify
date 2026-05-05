import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  revenue: { label: "Revenue ($)", color: "#6366f1" },
};

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function buildMonthlyRevenue(bookings) {
  const totals = Array(12).fill(0);
  bookings
    .filter((b) => b.paymentStatus === "paid")
    .forEach((b) => {
      const month = new Date(b.checkIn).getMonth();
      totals[month] += b.totalPrice;
    });

  // Only render months from the first non-zero to the last non-zero (+ 1 buffer each side)
  const nonZero = totals.map((v, i) => (v > 0 ? i : -1)).filter((i) => i >= 0);
  if (nonZero.length === 0) return MONTH_NAMES.map((m) => ({ month: m, revenue: 0 }));

  const start = Math.max(0, nonZero[0] - 1);
  const end = Math.min(11, nonZero[nonZero.length - 1] + 1);
  return totals.slice(start, end + 1).map((revenue, i) => ({
    month: MONTH_NAMES[start + i],
    revenue,
  }));
}

function RevenueChart({ bookings }) {
  const data = buildMonthlyRevenue(bookings);

  return (
    <div className="bg-white border border-border rounded-lg p-4 sm:p-5">
      <h3 className="font-semibold text-foreground mb-1">Monthly Revenue</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Revenue from paid bookings by check-in month
      </p>
      <ChartContainer config={chartConfig} className="h-[200px] sm:h-[230px] w-full">
        <BarChart data={data} barCategoryGap="35%">
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v}`}
            tick={{ fontSize: 11 }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="revenue"
            fill="var(--color-revenue)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

export default RevenueChart;
