import { useContext, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Star, ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";
import { HotelContext } from "@/context/hotel/HotelContext";
import { RoomTypeContext } from "@/context/roomType/RoomTypeContext";

const CITIES = ["Cairo", "Alexandria", "Sharm El-Sheikh", "Luxor"];

const HOTEL_PHOTOS = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80",
];

function StarRow({ count }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={11}
          className={i < count ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  );
}

function HotelCard({ hotel, minPrice, index }) {
  const navigate = useNavigate();
  const photo = HOTEL_PHOTOS[index % HOTEL_PHOTOS.length];

  return (
    <button
      onClick={() => navigate(`/hotels/${hotel._id}`)}
      className="group shrink-0 w-56 text-left cursor-pointer focus:outline-none"
    >
      {/* Photo */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
        <img
          src={photo}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Stars badge */}
        <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm rounded-full
          px-2 py-1 flex items-center gap-1 shadow-sm">
          <Star size={10} className="text-amber-400 fill-amber-400" />
          <span className="text-[10px] font-bold text-gray-700">{hotel.stars}-Star</span>
        </div>
      </div>

      {/* Info */}
      <div className="mt-2.5 px-0.5">
        <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-[var(--color-primary)] transition-colors">
          {hotel.name}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{hotel.address.street}</p>
        <div className="flex items-center justify-between mt-1.5">
          <StarRow count={hotel.stars} />
          {minPrice && (
            <p className="text-xs text-gray-700">
              <span className="font-bold text-gray-900">${minPrice}</span>
              <span className="text-gray-400"> / night</span>
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

function CitySection({ city, hotels, roomTypes }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const cityHotels = useMemo(
    () => hotels.filter((h) => h.address.city === city && h.status === "active"),
    [hotels, city],
  );

  const minPriceByHotel = useMemo(() => {
    const map = {};
    roomTypes.forEach((rt) => {
      if (!map[rt.hotel] || rt.pricePerNight < map[rt.hotel])
        map[rt.hotel] = rt.pricePerNight;
    });
    return map;
  }, [roomTypes]);

  if (cityHotels.length === 0) return null;

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 240, behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-gray-900">Hotels in {city}</h3>
          <button
            onClick={() => navigate(`/search/rooms?location=${encodeURIComponent(city)}`)}
            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center
              text-gray-500 hover:border-gray-400 transition-colors cursor-pointer"
          >
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll(-1)}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center
              text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center
              text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide
          scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {cityHotels.map((hotel, i) => (
          <div key={hotel._id} className="snap-start">
            <HotelCard
              hotel={hotel}
              minPrice={minPriceByHotel[hotel._id]}
              index={i}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function HotelsByCity() {
  const { hotels = [] } = useContext(HotelContext) || {};
  const roomTypes = useContext(RoomTypeContext);

  return (
    <section className="bg-white py-14 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: "var(--color-primary)" }}>
            Top picks
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
            Popular hotels by city
          </h2>
        </div>

        {CITIES.map((city) => (
          <CitySection
            key={city}
            city={city}
            hotels={hotels}
            roomTypes={roomTypes}
          />
        ))}
      </div>
    </section>
  );
}

export default HotelsByCity;
