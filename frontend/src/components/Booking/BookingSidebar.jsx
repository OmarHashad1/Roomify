import { CalendarDays, Users } from "lucide-react";

function toCurrency(value) {
  return `$${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function SideCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {title && (
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{title}</h3>
        </div>
      )}
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function PriceRow({ label, value, tone = "default" }) {
  const toneClass =
    tone === "discount"
      ? "text-green-600"
      : tone === "surcharge"
        ? "text-red-600"
        : "text-gray-600";
  return (
    <div className={`flex justify-between text-sm ${toneClass}`}>
      <span>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default function BookingSidebar({
  selectedHotel,
  checkIn,
  checkOut,
  adults,
  children,
  nights,
  selectedRoom,
  selectedQuantity,
  pricePerNight,
  basePrice,
  seasonLabel,
  seasonNote,
  seasonPercent,
  totalPrice,
}) {
  const seasonValue =
    seasonPercent === 0
      ? "0%"
      : `${seasonPercent > 0 ? "+" : ""}${seasonPercent}%`;
  const seasonTone =
    seasonPercent < 0 ? "discount" : seasonPercent > 0 ? "surcharge" : "default";
  const cancellationPolicy = selectedHotel?.cancellationPolicy;
  let cancellationText = "Cancellation details unavailable.";
  if (cancellationPolicy?.type === "free") {
    cancellationText = `Free cancellation up to ${cancellationPolicy.deadlineDays} day(s) before check-in.`;
  } else if (cancellationPolicy?.type === "partial") {
    cancellationText = `Cancel up to ${cancellationPolicy.deadlineDays} day(s) before for a ${cancellationPolicy.refundPercentage}% refund.`;
  } else if (cancellationPolicy?.type === "none") {
    cancellationText = "Non-refundable booking.";
  }

  return (
    <div className="space-y-3 lg:sticky lg:top-24">
      <SideCard title="Booking details">
        <div className="space-y-3">
          <div className="flex items-start gap-2.5">
            <CalendarDays size={14} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Check-in</p>
              <p className="text-sm font-semibold text-gray-800">{checkIn}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CalendarDays size={14} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Check-out</p>
              <p className="text-sm font-semibold text-gray-800">{checkOut}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 pt-2 border-t border-gray-100">
            <Users size={14} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Guests · {nights} night{nights !== 1 ? "s" : ""}</p>
              <p className="text-sm font-semibold text-gray-800">
                {adults} adult{adults !== 1 ? "s" : ""}
                {children > 0 && `, ${children} child${children !== 1 ? "ren" : ""}`}
              </p>
            </div>
          </div>
          {selectedRoom && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-0.5">Selected room</p>
              <p className="text-sm font-semibold text-gray-800">
                {(() => { const c = selectedRoom.bedroomCount ?? selectedRoom.bedroom; return c === 1 ? "1 Bedroom" : c ? `${c} Bedrooms` : selectedRoom.type ?? "Room"; })()}
                {selectedRoom.view ? ` · ${selectedRoom.view}` : ""}
                {selectedQuantity > 1 ? ` × ${selectedQuantity}` : ""}
              </p>
            </div>
          )}
        </div>
      </SideCard>

      <SideCard title="Price summary">
        <div className="space-y-2">
          <PriceRow label="Room rate" value={`${toCurrency(pricePerNight)} / night`} />
          <PriceRow label="Nights" value={`× ${nights}`} />
          <PriceRow label="Subtotal" value={toCurrency(basePrice)} />
          {seasonPercent !== 0 && (
            <PriceRow
              label={seasonLabel || "Price adjustment"}
              value={seasonValue}
              tone={seasonTone}
            />
          )}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm font-bold text-gray-900">Total</span>
          <span className="text-base font-bold text-gray-900">{toCurrency(totalPrice)}</span>
        </div>
        {seasonPercent !== 0 && seasonNote && (
          <div
            className={`mt-3 rounded-lg px-3 py-2 text-xs leading-relaxed border ${
              seasonTone === "discount"
                ? "bg-green-50 border-green-100 text-green-700"
                : "bg-red-50 border-red-100 text-red-700"
            }`}
          >
            {seasonNote}
          </div>
        )}
      </SideCard>

      <SideCard title="Cancellation policy">
        <p className="text-sm text-gray-600 leading-relaxed">{cancellationText}</p>
      </SideCard>
    </div>
  );
}
