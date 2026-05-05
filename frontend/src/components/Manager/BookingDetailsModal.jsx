import {
  X,
  User,
  Phone,
  Mail,
  Calendar,
  BedDouble,
  Users,
  CreditCard,
  MessageSquare,
  CheckCircle,
  XCircle,
  LogIn,
  Flag,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import BookingStatusBadge from "./BookingStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";
import DetailRow from "./DetailRow";
import BookingSection from "./BookingSection";

const ACTIONS = {
  pending_payment: [
    { key: "confirm", label: "Confirm Booking", icon: CheckCircle, variant: "default" },
    { key: "cancel", label: "Cancel Booking", icon: XCircle, variant: "destructive" },
  ],
  confirmed: [
    { key: "check_in", label: "Mark as Checked In", icon: LogIn, variant: "default" },
    { key: "cancel", label: "Cancel Booking", icon: XCircle, variant: "destructive" },
  ],
  checked_in: [
    { key: "complete", label: "Mark as Completed", icon: Flag, variant: "default" },
  ],
  completed: [],
  cancelled_by_hotel: [],
  cancelled_by_user: [],
  cancelled_by_admin: [],
};

function BookingDetailsModal({ booking, onClose, onAction }) {
  const [loadingKey, setLoadingKey] = useState(null);
  if (!booking) return null;

  function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function formatPrice(price) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  }

  function calcNights() {
    const msPerDay = 1000 * 60 * 60 * 24;
    const diff =
      new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime();
    return Math.max(0, Math.round(diff / msPerDay));
  }

  const nights = calcNights();
  const actions = ACTIONS[booking.bookingStatus] ?? [];

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
            <p className="text-xs text-white/60 font-mono">{booking.id}</p>
            <h2 className="text-white font-semibold text-lg">{booking.guest.name}</h2>
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
          {/* Status row */}
          <div className="flex items-center gap-3 flex-wrap">
            <BookingStatusBadge status={booking.bookingStatus} />
            <PaymentStatusBadge status={booking.paymentStatus} />
          </div>

          {/* Guest details */}
          <BookingSection title="Guest Details">
            <div className="grid grid-cols-1 gap-3">
              <DetailRow icon={User} label="Full Name" value={booking.guest.name} />
              <DetailRow icon={Mail} label="Email" value={booking.guest.email} />
              <DetailRow icon={Phone} label="Phone" value={booking.guest.phone} />
            </div>
          </BookingSection>

          {/* Stay details */}
          <BookingSection title="Stay Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DetailRow icon={Calendar} label="Check-in" value={formatDate(booking.checkIn)} />
              <DetailRow icon={Calendar} label="Check-out" value={formatDate(booking.checkOut)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DetailRow
                icon={BedDouble}
                label="Room Type"
                value={`${booking.roomType} (×${booking.numRooms})`}
              />
              <DetailRow icon={Users} label="Guests" value={`${booking.numGuests} guest${booking.numGuests > 1 ? "s" : ""}`} />
            </div>
            <div className="bg-muted/50 rounded-lg px-4 py-2 text-sm text-muted-foreground">
              {nights} night{nights !== 1 ? "s" : ""} stay
            </div>
          </BookingSection>

          {/* Price breakdown */}
          <BookingSection title="Price Breakdown">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Room cost ({nights} night{nights !== 1 ? "s" : ""})
                </span>
                <span>{formatPrice(booking.priceBreakdown.roomCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxes</span>
                <span>{formatPrice(booking.priceBreakdown.taxes)}</span>
              </div>
              {booking.priceBreakdown.fees > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fees</span>
                  <span>{formatPrice(booking.priceBreakdown.fees)}</span>
                </div>
              )}
              <div className="border-t border-border pt-1.5 flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(booking.totalPrice)}</span>
              </div>
            </div>
          </BookingSection>

          {/* Payment information */}
          <BookingSection title="Payment Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DetailRow
                icon={CreditCard}
                label="Payment Method"
                value={booking.payment.method}
              />
              <DetailRow
                icon={CreditCard}
                label="Provider"
                value={booking.payment.provider}
              />
              <DetailRow
                icon={CreditCard}
                label="Transaction Status"
                value={booking.payment.transactionStatus}
              />
              <DetailRow
                icon={CreditCard}
                label="Refund Status"
                value={booking.payment.refundStatus ?? "N/A"}
              />
            </div>
          </BookingSection>

          {/* Special requests */}
          {booking.specialRequests && (
            <BookingSection title="Special Requests">
              <div className="flex items-start gap-3">
                <MessageSquare className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-sm text-foreground">{booking.specialRequests}</p>
              </div>
            </BookingSection>
          )}
        </div>

        {/* Footer actions */}
        {actions.length > 0 && (
          <div className="border-t border-border px-6 py-4 flex flex-wrap gap-2 bg-muted/20">
            {actions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <Button
                  key={action.key}
                  variant={action.variant}
                  size="sm"
                  disabled={loadingKey !== null}
                  onClick={async () => {
                    setLoadingKey(action.key);
                    try {
                      await onAction(booking, action.key);
                    } finally {
                      setLoadingKey(null);
                    }
                  }}
                >
                  {loadingKey === action.key ? (
                    <Spinner className="size-4" data-icon="inline-start" />
                  ) : (
                    <ActionIcon className="size-4" />
                  )}
                  {action.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default BookingDetailsModal;
