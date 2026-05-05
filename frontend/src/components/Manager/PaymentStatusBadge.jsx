import { Badge } from "@/components/ui/badge";

const paymentStatusConfig = {
  pending: {
    label: "Pending",
    className: "border-yellow-300 bg-yellow-100 text-yellow-800",
  },
  paid: {
    label: "Paid",
    className: "border-green-300 bg-green-100 text-green-800",
  },
  refunded: {
    label: "Refunded",
    className: "border-purple-300 bg-purple-100 text-purple-700",
  },
  failed: {
    label: "Failed",
    className: "border-red-300 bg-red-100 text-red-700",
  },
};

function PaymentStatusBadge({ status }) {
  const config = paymentStatusConfig[status] ?? {
    label: status,
    className: "border-gray-300 bg-gray-100 text-gray-700",
  };

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

export default PaymentStatusBadge;
