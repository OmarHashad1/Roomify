import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  MapPin,
  Star,
  Users,
  SlidersHorizontal,
  ChevronDown,
  X,
  Search,
  Loader2,
} from "lucide-react";
import RoomCard from "@/components/Public/RoomCard";
import { searchRooms } from "@/services/search.service";

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "stars_desc", label: "Stars: High to Low" },
];

const STAR_FILTERS = [5, 4, 3, 2, 1];

function Pill({ icon, label }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
      bg-gray-100 text-xs font-semibold text-gray-700"
    >
      {icon}
      {label}
    </span>
  );
}

function SearchResults() {
  const [searchParams] = useSearchParams();

  const location = searchParams.get("location") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const adults = parseInt(searchParams.get("adults") || "1", 10);
  const children = parseInt(searchParams.get("children") || "0", 10);
  const rooms = parseInt(searchParams.get("rooms") || "1", 10);
  const totalGuests = adults + children;

  const [apiResults, setApiResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sort, setSort] = useState("recommended");
  const [starFilter, setStarFilter] = useState([]);
  const [maxPrice, setMaxPrice] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const maxAvailablePrice = useMemo(() => {
    const prices = apiResults
      .map(({ room }) => Number(room.pricePerNight) || 0)
      .filter((price) => price > 0);

    if (prices.length === 0) return 1000;
    return Math.max(1000, ...prices);
  }, [apiResults]);

  useEffect(() => {
    setMaxPrice(maxAvailablePrice);
  }, [maxAvailablePrice]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    searchRooms({ location, checkIn, checkOut, adults, children, rooms })
      .then(({ data }) =>
        setApiResults(
          (Array.isArray(data?.data) ? data.data : []).filter(
            (r) => r && r.room && r.hotel,
          ),
        ),
      )
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [location, checkIn, checkOut, adults, children, rooms]);

  const results = useMemo(() => {
    let list = apiResults;

    list = list.filter(({ room }) => (room.pricePerNight ?? 0) <= maxPrice);

    if (starFilter.length > 0)
      list = list.filter(({ hotel }) =>
        starFilter.includes(Number(hotel.stars)),
      );

    if (sort === "price_asc")
      list = [...list].sort(
        (a, b) => (a.room.pricePerNight ?? 0) - (b.room.pricePerNight ?? 0),
      );
    if (sort === "price_desc")
      list = [...list].sort(
        (a, b) => (b.room.pricePerNight ?? 0) - (a.room.pricePerNight ?? 0),
      );
    if (sort === "stars_desc")
      list = [...list].sort(
        (a, b) => (Number(b.hotel.stars) || 0) - (Number(a.hotel.stars) || 0),
      );

    return list;
  }, [apiResults, maxPrice, starFilter, sort]);

  const nightCount = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    const diff = (new Date(checkOut) - new Date(checkIn)) / 86_400_000;
    return diff > 0 ? diff : null;
  }, [checkIn, checkOut]);

  const toggleStar = (s) =>
    setStarFilter((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const activeFilterCount =
    starFilter.length +
    (typeof maxPrice === "number" && maxPrice < maxAvailablePrice ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
            {location && <Pill icon={<MapPin size={11} />} label={location} />}
            {checkIn && <Pill icon={null} label={`From ${checkIn}`} />}
            {checkOut && <Pill icon={null} label={`To ${checkOut}`} />}
            {totalGuests > 0 && (
              <Pill
                icon={<Users size={11} />}
                label={`${totalGuests} guest${totalGuests !== 1 ? "s" : ""}`}
              />
            )}
            {!location && !checkIn && (
              <span className="text-sm text-gray-400">All available rooms</span>
            )}
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm font-medium text-gray-700
                border border-gray-200 rounded-xl bg-white cursor-pointer outline-none
                hover:border-gray-300 transition-colors"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200
              text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span
                className="w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {filtersOpen && (
          <div className="border-t border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap gap-8 items-start">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Hotel stars
                </p>
                <div className="flex gap-2 flex-wrap">
                  {STAR_FILTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleStar(s)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border
                        text-sm font-semibold transition-colors cursor-pointer
                        ${starFilter.includes(s) ? "border-transparent text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                      style={
                        starFilter.includes(s)
                          ? {
                              backgroundColor: "var(--color-primary)",
                              borderColor: "var(--color-primary)",
                            }
                          : {}
                      }
                    >
                      {s}{" "}
                      <Star
                        size={11}
                        className={
                          starFilter.includes(s)
                            ? "fill-white text-white"
                            : "fill-amber-400 text-amber-400"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Max price ·{" "}
                  <span className="text-gray-900">
                    EGP {(maxPrice ?? maxAvailablePrice).toLocaleString()} /
                    night
                  </span>
                </p>
                <input
                  type="range"
                  min={80}
                  max={maxAvailablePrice}
                  step={10}
                  value={maxPrice ?? maxAvailablePrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-48 accent-(--color-primary)"
                />
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    setStarFilter([]);
                    setMaxPrice(maxAvailablePrice);
                  }}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer self-end pb-1"
                >
                  <X size={13} /> Clear filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">
            {location ? `Rooms in ${location}` : "All available rooms"}
          </h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-1">
              {results.length} room{results.length !== 1 ? "s" : ""} found
              {nightCount
                ? ` · ${nightCount} night${nightCount !== 1 ? "s" : ""}`
                : ""}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">
              Searching for available rooms…
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-lg font-bold text-gray-800">
              Something went wrong
            </p>
            <p className="text-sm text-gray-400 mt-1">{error}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Search size={24} className="text-gray-300" />
            </div>
            <p className="text-lg font-bold text-gray-800">No rooms found</p>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">
              Try adjusting your filters or searching for a different location.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {results.map(({ room, hotel }) => (
              <RoomCard key={room._id} room={room} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
