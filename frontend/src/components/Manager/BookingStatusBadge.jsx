import { Badge } from "@/components/ui/badge";

const bookingStatusConfig = {
  pending_payment: {
    label: "Pending Payment",
    className: "border-yellow-300 bg-yellow-100 text-yellow-800",
  },
  confirmed: {
    label: "Confirmed",
    className: "border-blue-300 bg-blue-100 text-blue-800",
  },
  checked_in: {
    label: "Checked In",
    className: "border-green-300 bg-green-100 text-green-800",
  },
  completed: {
    label: "Completed",
    className: "border-gray-300 bg-gray-100 text-gray-700",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-red-300 bg-red-100 text-red-700",
  },
};

function BookingStatusBadge({ status }) {
  const config = bookingStatusConfig[status] ?? {
    label: status,
    className: "border-gray-300 bg-gray-100 text-gray-700",
  };

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

export default BookingStatusBadge;
