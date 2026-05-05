import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import RoomStatusBadge from "./RoomStatusBadge";
import SortIcon from "./SortIcon";

const COLUMNS = [
  { key: "id",            label: "Room ID",      sortable: true  },
  { key: "bedroom",       label: "Bedrooms",     sortable: true  },
  { key: "view",          label: "View",         sortable: false },
  { key: "pricePerNight", label: "Price / Night",sortable: true  },
  { key: "maxGuests",     label: "Max Guests",   sortable: true  },
  { key: "amenities",     label: "Amenities",    sortable: false },
  { key: "status",        label: "Status",       sortable: true  },
  { key: "actions",       label: "",             sortable: false },
];

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
}

function RoomsTable({ rooms, sortKey, sortDir, onSort, onViewDetails, onEdit }) {
  if (rooms.length === 0) {
    return (
      <div className="bg-white border border-border rounded-lg py-16 flex flex-col items-center justify-center text-center">
        <p className="text-muted-foreground text-sm">No rooms match your filters.</p>
        <p className="text-muted-foreground text-xs mt-1">Try adjusting or clearing the filters above.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      {/* ── Mobile + Tablet card layout ── */}
      <div className="lg:hidden divide-y divide-border">
        {rooms.map((room) => (
          <div key={room.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-xs text-[var(--color-link)] font-medium truncate">
                  {room.id}
                </p>
                <p className="font-medium text-foreground">
                  {room.bedroom} Bedroom{room.bedroom > 1 ? "s" : ""} — {room.view}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(room)}
                  title="View room details"
                >
                  <Eye className="size-4" />
                  <span className="sr-only">View</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(room)}
                  title="Edit room"
                >
                  <Pencil className="size-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </div>
            </div>

            <RoomStatusBadge status={room.status} />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Price / Night</p>
                <p className="font-semibold text-foreground">{formatPrice(room.pricePerNight)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Max Guests</p>
                <p className="text-foreground">{room.maxGuests}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Amenities</p>
                <p className="text-foreground">{room.amenities.length} included</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop table layout ── */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap ${
                    col.sortable ? "cursor-pointer select-none hover:text-foreground" : ""
                  }`}
                  onClick={() => col.sortable && onSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <SortIcon column={col.key} sortKey={sortKey} sortDir={sortDir} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rooms.map((room) => (
              <tr
                key={room.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs text-[var(--color-link)] font-medium whitespace-nowrap">
                  {room.id}
                </td>
                <td className="px-4 py-3 text-center text-foreground">
                  {room.bedroom}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-foreground">
                  {room.view}
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-foreground">
                  {formatPrice(room.pricePerNight)}
                </td>
                <td className="px-4 py-3 text-center text-foreground">
                  {room.maxGuests}
                </td>
                <td className="px-4 py-3 text-foreground">
                  {room.amenities.length} included
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <RoomStatusBadge status={room.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(room)}
                      title="View room details"
                    >
                      <Eye className="size-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(room)}
                      title="Edit room"
                    >
                      <Pencil className="size-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RoomsTable;
