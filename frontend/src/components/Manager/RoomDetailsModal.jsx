import {
  X,
  BedDouble,
  Users,
  DollarSign,
  Eye,
  Wind,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Pencil,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import RoomStatusBadge from "./RoomStatusBadge";
import DetailRow from "./DetailRow";
import BookingSection from "./BookingSection";

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
}

function RoomDetailsModal({ room, onClose, onToggleStatus, onEdit }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  if (!room) return null;

  async function handleToggle() {
    setLoading(true);
    try {
      await onToggleStatus(room);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Side panel */}
      <div className="fixed top-0 right-0 h-full w-full sm:max-w-lg bg-background z-50 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-border"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <div>
            <p className="text-xs text-white/60 font-mono">{room.id}</p>
            <h2 className="text-white font-semibold text-lg">
              {room.bedroom} Bedroom{room.bedroom > 1 ? "s" : ""} — {room.view}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors rounded-lg p-1"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Status */}
          <RoomStatusBadge status={room.status} />

          {/* Room Details */}
          <BookingSection title="Room Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DetailRow icon={BedDouble} label="Bedrooms" value={`${room.bedroom} bedroom${room.bedroom > 1 ? "s" : ""}`} />
              <DetailRow icon={Eye} label="View" value={room.view} />
              <DetailRow icon={Users} label="Max Guests" value={`${room.maxGuests} guest${room.maxGuests > 1 ? "s" : ""}`} />
              <DetailRow icon={DollarSign} label="Price / Night" value={formatPrice(room.pricePerNight)} />
              <DetailRow
                icon={Wind}
                label="Smoking Allowed"
                value={room.smokingAllowed ? "Yes" : "No"}
              />
            </div>
          </BookingSection>

          {/* Description */}
          {room.description && (
            <BookingSection title="Description">
              <p className="text-sm text-foreground leading-relaxed">{room.description}</p>
            </BookingSection>
          )}

          {/* Amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <BookingSection title={`Amenities (${room.amenities.length})`}>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
                  >
                    <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                    {amenity}
                  </span>
                ))}
              </div>
            </BookingSection>
          )}
        </div>

        {/* Footer actions */}
        <div className="border-t border-border px-6 py-4 flex flex-wrap gap-2 bg-muted/20">
          <Button size="sm" variant="outline" onClick={() => onEdit(room)}>
            <Pencil className="size-4" />
            Edit Room
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/manager/rooms/${room.id}/availability`)}
          >
            <CalendarCheck className="size-4" />
            Manage Availability
          </Button>
          <Button
            size="sm"
            variant={room.status === "active" ? "destructive" : "default"}
            disabled={loading}
            onClick={handleToggle}
          >
            {loading ? (
              <Spinner className="size-4" data-icon="inline-start" />
            ) : room.status === "active" ? (
              <XCircle className="size-4" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
            {room.status === "active" ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </div>
    </>
  );
}

export default RoomDetailsModal;
