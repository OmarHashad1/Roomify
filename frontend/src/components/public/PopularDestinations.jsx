import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { HotelContext } from "@/context/hotel/HotelContext";

const DESTINATIONS = [
  {
    city: "Cairo",
    label: "Cairo",
    subtitle: "The city of pyramids & history",
    photo:
      "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80",
  },
  {
    city: "Alexandria",
    label: "Alexandria",
    subtitle: "Pearl of the Mediterranean",
    photo:
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80",
  },
  {
    city: "Sharm El-Sheikh",
    label: "Sharm El-Sheikh",
    subtitle: "Dive into the Red Sea",
    photo:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
  },
  {
    city: "Luxor",
    label: "Luxor",
    subtitle: "Open-air museum of the ancient world",
    photo:
      "https://images.unsplash.com/photo-1554232456-8727aae0cfa4?auto=format&fit=crop&w=800&q=80",
  },
];

function DestinationCard({ city, label, subtitle, photo, hotelCount }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() =>
        navigate(`/search/rooms?location=${encodeURIComponent(city)}`)
      }
      className="group relative overflow-hidden rounded-2xl cursor-pointer text-left w-full
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
    >
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={photo}
          alt={label}
          className="w-full h-full object-cover transition-transform duration-500
            group-hover:scale-105"
        />
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <div>
          <p className="text-white font-bold text-lg leading-tight">{label}</p>
          <p className="text-white/70 text-xs mt-0.5">{subtitle}</p>
        </div>
      </div>

      <div
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/0 group-hover:bg-white/20
        backdrop-blur-sm flex items-center justify-center transition-all duration-200
        opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0"
      >
        <ArrowRight size={14} className="text-white" />
      </div>
    </button>
  );
}

function PopularDestinations() {
  const { hotels = [] } = useContext(HotelContext) || {};

  const hotelCounts = useMemo(() => {
    const counts = {};
    hotels.forEach((h) => {
      counts[h.address.city] = (counts[h.address.city] ?? 0) + 1;
    });
    return counts;
  }, [hotels]);

  return (
    <section className="bg-white py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: "var(--color-primary)" }}
            >
              Explore Egypt
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
              Popular destinations
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DESTINATIONS.map((dest) => (
            <DestinationCard key={dest.city} {...dest} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularDestinations;
