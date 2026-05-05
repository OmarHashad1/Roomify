import { Link, useSearchParams } from "react-router-dom";
import { MapPin, Star, Users, BedDouble, Wifi } from "lucide-react";
import roomPlaceholder from "@/static/placeholders/room-type-photo-placeholder.jpg";
import { assetUrl } from "@/utils/assetUrl";

function RoomCard({ room = {}, hotel = {} }) {
  const [searchParams] = useSearchParams();
  const photo = assetUrl(room.mainPhoto ?? room.photos?.[0]) || roomPlaceholder;
  const bedrooms = room.bedroomCount ?? room.bedroom;
  const bedroomLabel =
    bedrooms == null ? "Room" : bedrooms === 1 ? "1 Bedroom" : `${bedrooms} Bedrooms`;
  const view = room.view || "City view";
  const maxGuests = room.maxGuests ?? "—";
  const amenities = Array.isArray(room.amenities) ? room.amenities : [];
  const price = Number.isFinite(room.pricePerNight) ? room.pricePerNight : null;
  const stars = Number(hotel.stars) || 0;
  const hotelName = hotel.name || "Unnamed hotel";
  const city = hotel.address?.city || "Unknown location";

  const bookingUrl = (() => {
    const p = new URLSearchParams();
    if (searchParams.get("checkIn"))  p.set("checkIn",  searchParams.get("checkIn"));
    if (searchParams.get("checkOut")) p.set("checkOut", searchParams.get("checkOut"));
    if (searchParams.get("adults"))   p.set("adults",   searchParams.get("adults"));
    if (searchParams.get("children")) p.set("children", searchParams.get("children"));
    const qs = p.toString();
    return `/booking/${room._id}${qs ? `?${qs}` : ""}`;
  })();

  return (
    <Link
      to={bookingUrl}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100
        shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-gray-100 shrink-0">
        <img
          src={photo}
          alt={room.description || "Room photo"}
          onError={(e) => { e.currentTarget.src = roomPlaceholder; }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {stars > 0 && (
          <div
            className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm
            rounded-full px-2.5 py-1 shadow-sm"
          >
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-gray-800">
              {stars}-Star
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1">
            {bedroomLabel} · {view}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
            {hotelName}
          </p>

          <div className="flex items-center gap-1.5 mt-2">
            <MapPin size={11} className="text-gray-400 shrink-0" />
            <span className="text-xs text-gray-400">
              {city}, Egypt
            </span>
          </div>

          <div className="flex items-center gap-3 mt-2.5 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <BedDouble size={12} className="text-gray-400" />
              {bedroomLabel}
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} className="text-gray-400" />
              Up to {maxGuests}
            </span>
            <span className="flex items-center gap-1">
              <Wifi size={12} className="text-gray-400" />
              WiFi
            </span>
          </div>

          <div className="flex flex-wrap gap-1 mt-3">
            {amenities.slice(0, 3).map((a) => (
              <span
                key={a}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"
              >
                {a}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                +{amenities.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-gray-900">
                {price != null ? `$${price}` : "Price on request"}
              </span>
              {price != null && (
                <span className="text-xs text-gray-400 font-medium">/ night</span>
              )}
            </div>
            <div className="flex items-center gap-0.5 mt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={
                    i < stars
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-200 fill-gray-200"
                  }
                />
              ))}
            </div>
          </div>
          <span
            className="px-4 py-2 rounded-xl text-white text-xs font-bold"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Book now
          </span>
        </div>
      </div>
    </Link>
  );
}

export default RoomCard;
