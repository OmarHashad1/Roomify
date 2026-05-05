import { Badge } from "@/components/ui/badge";

const roomStatusConfig = {
  active: {
    label: "Active",
    className: "border-green-300 bg-green-100 text-green-800",
  },
  inactive: {
    label: "Inactive",
    className: "border-red-300 bg-red-100 text-red-700",
  },
};

function RoomStatusBadge({ status }) {
  const config = roomStatusConfig[status] ?? {
    label: status,
    className: "border-gray-300 bg-gray-100 text-gray-700",
  };

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

export default RoomStatusBadge;
