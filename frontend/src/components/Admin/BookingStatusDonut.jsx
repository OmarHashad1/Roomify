import { useContext } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BookingContext } from "@/context/booking/BookingContext";

const STATUS_CONFIG = {
  confirmed: { label: "Confirmed", color: "#10b981" },
  pending_payment: { label: "Pending Payment", color: "#f59e0b" },
  checked_in: { label: "Checked In", color: "#6366f1" },
  completed: { label: "Completed", color: "#059669" },
  cancelled: { label: "Cancelled", color: "#f43f5e" },
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700">{name}</p>
      <p className="text-gray-500">{value} bookings</p>
    </div>
  );
};

export function BookingStatusDonut() {
  const { bookings = [] } = useContext(BookingContext) || {};
  const list = Array.isArray(bookings) ? bookings : [];

  const counts = {};
  list.forEach((b) => {
    const rawStatus = b?.status || b?.bookingStatus;
    const status = rawStatus?.startsWith("cancelled_")
      ? "cancelled"
      : rawStatus;
    if (!status) return;
    counts[status] = (counts[status] || 0) + 1;
  });

  const data = Object.entries(STATUS_CONFIG)
    .map(([key, { label, color }]) => ({
      name: label,
      value: counts[key] || 0,
      color,
    }))
    .filter((d) => d.value > 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex flex-col h-full">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">
        Booking Status
      </h2>

      <div className="flex-1 min-h-65">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={7}
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: 11 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
