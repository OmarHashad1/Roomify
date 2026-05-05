import { useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ReviewContext } from "@/context/review/ReviewContext";
import { Star } from "lucide-react";

const COLORS = {
  1: "#f43f5e",
  2: "#f97316",
  3: "#f59e0b",
  4: "#10b981",
  5: "#059669",
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { rating, count } = payload[0].payload;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700">{rating}★ Rating</p>
      <p className="text-gray-500">
        {count} {count === 1 ? "review" : "reviews"}
      </p>
    </div>
  );
};

export function ReviewsRatingBar() {
  const { reviews = [] } = useContext(ReviewContext) || {};

  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    const rating = Math.round(r.rating);
    if (rating >= 1 && rating <= 5) counts[rating]++;
  });

  const data = [1, 2, 3, 4, 5].map((r) => ({ rating: r, count: counts[r] }));

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-gray-700">Review Ratings</h2>
        <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          {avg} avg
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="rating"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}★`}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={40}>
            {data.map((entry) => (
              <Cell key={entry.rating} fill={COLORS[entry.rating]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
