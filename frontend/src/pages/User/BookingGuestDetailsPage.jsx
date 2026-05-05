import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BookingGuestDetailsPage({
  adults,
  checkIn,
  checkOut,
  children,
  formatDateLabel,
  getRoomTitle,
  nights,
  roomId,
  selectedHotel,
  selectedRoom,
}) {
  const navigate = useNavigate();
  const qs = `?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Your stay summary</h2>
        </div>
        <div className="px-6 py-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 text-sm">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">Hotel</p>
            <p className="font-semibold text-gray-800">{selectedHotel.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">Room</p>
            <p className="font-semibold text-gray-800">{getRoomTitle(selectedRoom)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">Check-in</p>
            <p className="font-semibold text-gray-800">{formatDateLabel(checkIn)}</p>
            <p className="text-xs text-gray-400">from {selectedHotel.checkInTime}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">Check-out</p>
            <p className="font-semibold text-gray-800">{formatDateLabel(checkOut)}</p>
            <p className="text-xs text-gray-400">until {selectedHotel.checkOutTime}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">Guests · {nights} night{nights !== 1 ? "s" : ""}</p>
            <p className="font-semibold text-gray-800">
              {adults} adult{adults !== 1 ? "s" : ""}
              {children > 0 && `, ${children} child${children !== 1 ? "ren" : ""}`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pb-6">
        <button
          type="button"
          onClick={() => navigate(`/booking/${roomId}${qs}`)}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <button
          type="button"
          onClick={() => navigate(`/booking/${roomId}/payment`)}
          className="rounded-xl px-7 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Continue to payment →
        </button>
      </div>
    </div>
  );
}
