import { useState, useRef, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SplitText from "../SplitText";
import { MapPin, Users, ChevronDown, Search, X, AlertCircle } from "lucide-react";
import { HotelContext } from "@/context/hotel/HotelContext";
import GuestsDropdown from "./GuestsDropdown";
import DateField from "./DateField";
import { searchSchema } from "@/Schemas/Public/search.validation.js";

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-[11px] font-medium text-red-500 px-4 pt-1.5 pb-2">
      <AlertCircle size={11} />
      {message}
    </p>
  );
}

function HeroSearch() {
  const navigate = useNavigate();

  const [location, setLocation]       = useState("");
  const [checkIn, setCheckIn]         = useState("");
  const [checkOut, setCheckOut]       = useState("");
  const [guestsOpen, setGuestsOpen]   = useState(false);
  const [guests, setGuests]           = useState({ adults: 2, children: 0, rooms: 1 });
  const [locationFocus, setLocationFocus] = useState(false);
  const [errors, setErrors]           = useState({});

  const { hotels = [] } = useContext(HotelContext) || {};
  const allCities = useMemo(
    () => [...new Set(hotels.map((h) => h.address.city))].sort(),
    [hotels],
  );

  const suggestions = useMemo(
    () =>
      location.trim().length > 0
        ? allCities.filter((c) =>
            c.toLowerCase().includes(location.toLowerCase()),
          )
        : [],
    [location, allCities],
  );

  const guestsRef   = useRef(null);
  const locationRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (guestsRef.current && !guestsRef.current.contains(e.target))
        setGuestsOpen(false);
      if (locationRef.current && !locationRef.current.contains(e.target))
        setLocationFocus(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const adj = (key, delta, min, max) =>
    setGuests((p) => ({
      ...p,
      [key]: Math.min(max, Math.max(min, p[key] + delta)),
    }));

  const guestsLabel = useMemo(
    () =>
      `${guests.adults} adult${guests.adults !== 1 ? "s" : ""}` +
      (guests.children
        ? ` · ${guests.children} child${guests.children !== 1 ? "ren" : ""}`
        : "") +
      ` · ${guests.rooms} room${guests.rooms !== 1 ? "s" : ""}`,
    [guests],
  );

  const handleSearch = async () => {
    const values = {
      location,
      checkIn,
      checkOut,
      adults:   guests.adults,
      children: guests.children,
      rooms:    guests.rooms,
    };

    try {
      await searchSchema.validate(values, { abortEarly: false });
      setErrors({});
      const params = new URLSearchParams(values);
      navigate(`/search/rooms?${params.toString()}`);
    } catch (err) {
      const fieldErrors = {};
      err.inner.forEach((e) => {
        if (e.path) fieldErrors[e.path] = e.message;
      });
      setErrors(fieldErrors);
    }
  };

  const clearError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  return (
    <section className="relative min-h-screen flex items-center justify-center">

      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/2a43dc90-45f5-4b0c-9fe2-997def29e824.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/70" />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-20 flex flex-col items-center">

        <div className="mb-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
            <SplitText
              text="Where to next?"
              className="text-5xl md:text-6xl font-extrabold text-white text-center"
              delay={50}
              duration={1.25}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
          </h1>
          <p className="mt-4 text-white/70 text-base md:text-lg font-medium drop-shadow">
            Find the perfect room for every journey.
          </p>
        </div>

        <div className="w-full bg-white rounded-3xl shadow-2xl shadow-black/30 border border-white/10 p-2">

          {/* Destination */}
          <div ref={locationRef} className="relative">
            <div
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-gray-50 transition-colors
                ${errors.location ? "ring-1 ring-red-300 bg-red-50/40" : ""}`}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <MapPin size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
                  Destination
                </p>
                <input
                  type="text"
                  placeholder="City, hotel or area"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setLocationFocus(true);
                    clearError("location");
                  }}
                  onFocus={() => setLocationFocus(true)}
                  className="w-full text-sm font-medium text-gray-800 placeholder:text-gray-300 outline-none bg-transparent"
                />
              </div>
              {location && (
                <button
                  onClick={() => {
                    setLocation("");
                    setLocationFocus(false);
                  }}
                  className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center
                    text-gray-400 hover:bg-gray-200 transition-colors cursor-pointer shrink-0"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <FieldError message={errors.location} />

            {locationFocus && suggestions.length > 0 && (
              <ul className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border
                border-gray-100 rounded-2xl shadow-xl shadow-black/10 z-40 overflow-hidden">
                {suggestions.map((city) => (
                  <li key={city}>
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setLocation(city);
                        setLocationFocus(false);
                        clearError("location");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700
                        hover:bg-gray-50 transition-colors cursor-pointer text-left"
                    >
                      <MapPin size={14} className="text-gray-400 shrink-0" />
                      <span className="font-medium">{city}</span>
                      <span className="text-xs text-gray-400 ml-auto">Egypt</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mx-4 h-px bg-gray-100" />

          {/* Dates */}
          <div className="flex flex-col sm:flex-row">
            <div className="flex-1">
              <DateField
                label="Check-in"
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  clearError("checkIn");
                }}
                error={errors.checkIn}
              />
            </div>
            <div className="hidden sm:block self-center w-px h-8 bg-gray-100" />
            <div className="sm:hidden mx-4 h-px bg-gray-100" />
            <div className="flex-1">
              <DateField
                label="Check-out"
                value={checkOut}
                onChange={(e) => {
                  setCheckOut(e.target.value);
                  clearError("checkOut");
                }}
                min={checkIn}
                error={errors.checkOut}
              />
            </div>
          </div>

          <div className="mx-4 h-px bg-gray-100" />

          {/* Guests + Search */}
          <div className="flex items-center gap-2 p-2">
            <div ref={guestsRef} className="relative flex-1">
              <button
                onClick={() => setGuestsOpen((o) => !o)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl
                  hover:bg-gray-50 transition-colors text-left cursor-pointer
                  ${errors.adults || errors.rooms ? "ring-1 ring-red-300 bg-red-50/40" : ""}`}
              >
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <Users size={16} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
                    Guests
                  </p>
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {guestsLabel}
                  </p>
                </div>
                <ChevronDown
                  size={15}
                  className={`text-gray-400 shrink-0 transition-transform duration-200
                    ${guestsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {guestsOpen && (
                <GuestsDropdown
                  guests={guests}
                  onChange={adj}
                  onClose={() => setGuestsOpen(false)}
                />
              )}
            </div>

            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-7 py-4 rounded-2xl text-white text-sm font-bold
                hover:opacity-90 active:scale-95 transition-all cursor-pointer shrink-0"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <Search size={17} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          {(errors.adults || errors.rooms || errors.children) && (
            <FieldError message={errors.adults || errors.rooms || errors.children} />
          )}
        </div>

        <p className="mt-8 text-white/40 text-xs tracking-widest uppercase animate-bounce">
          Scroll to explore
        </p>
      </div>
    </section>
  );
}

export default HeroSearch;
