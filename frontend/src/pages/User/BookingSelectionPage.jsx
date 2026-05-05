import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  Users,
  MessageSquare,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import roomPlaceholder from "@/static/placeholders/room-type-photo-placeholder.jpg";
import { assetUrl } from "@/utils/assetUrl";

function SectionCard({ title, children, noPad }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            {title}
          </h2>
        </div>
      )}
      <div className={noPad ? "" : "px-6 py-5"}>{children}</div>
    </div>
  );
}

export default function BookingSelectionPage({
  adults,
  children,
  getRoomTitle,
  goToDetailsStep,
  hotelRooms,
  nights,
  reviews,
  selectedHotel,
  selectedRoom,
  selectedRoomId,
  setSelectedRoomId,
  toCurrency,
}) {
  const totalGuests = (adults || 1) + (children || 0);
  const navigate = useNavigate();

  const mainPhoto = assetUrl(selectedRoom?.mainPhoto) || roomPlaceholder;
  const extraPhotos = (selectedRoom?.photos ?? []).map(
    (p) => assetUrl(p) || roomPlaceholder,
  );
  const slides = Array.from(new Set([mainPhoto, ...extraPhotos]));

  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    setActiveSlide(0);
  }, [selectedRoom?._id]);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    intervalRef.current = setInterval(
      () => setActiveSlide((i) => (i + 1) % slides.length),
      4000,
    );
    return () => clearInterval(intervalRef.current);
  }, [slides.length, paused]);

  const goPrev = () =>
    setActiveSlide((i) => (i - 1 + slides.length) % slides.length);
  const goNext = () => setActiveSlide((i) => (i + 1) % slides.length);

  return (
    <div className="space-y-4">
      {/* back */}
      <button
        type="button"
        onClick={() => navigate("/search/rooms")}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to search
      </button>

      {/* hotel info */}
      <SectionCard title="Hotel">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl shrink-0 overflow-hidden bg-gray-100">
            <img
              src={assetUrl(selectedHotel.photos?.[0]) || roomPlaceholder}
              alt={selectedHotel.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER;
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: selectedHotel.stars || 0 }).map((_, i) => (
                <Star key={i} size={13} className="fill-current" />
              ))}
            </div>
            <h1 className="mt-1 text-xl font-bold text-gray-900 leading-tight">
              {selectedHotel.name}
            </h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <MapPin size={13} className="shrink-0" />
              {selectedHotel.address.street}, {selectedHotel.address.city},{" "}
              {selectedHotel.address.country}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* room photo gallery */}
      <div
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* carousel */}
        <div className="relative w-full bg-gray-100 aspect-video">
          {slides.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={getRoomTitle(selectedRoom)}
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
                i === activeSlide ? "opacity-100" : "opacity-0"
              }`}
              onError={(e) => {
                e.currentTarget.src = roomPlaceholder;
              }}
            />
          ))}

          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-gray-800 shadow-sm flex items-center justify-center transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-gray-800 shadow-sm flex items-center justify-center transition-colors"
              >
                <ChevronRight size={18} />
              </button>

              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/55 text-white text-[11px] font-semibold">
                {activeSlide + 1} / {slides.length}
              </div>
            </>
          )}

          {/* overlay badge */}
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent px-5 py-4 pointer-events-none">
            <p className="text-white font-bold text-base leading-tight">
              {getRoomTitle(selectedRoom)}
            </p>
            {selectedRoom?.description && (
              <p className="text-white/70 text-xs mt-0.5 line-clamp-1">
                {selectedRoom.description}
              </p>
            )}
          </div>
        </div>

        {/* thumbnail strip */}
        {slides.length > 1 && (
          <div className="flex gap-2 px-4 py-3 border-t border-gray-100 overflow-x-auto">
            {slides.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveSlide(i)}
                aria-label={`Show photo ${i + 1}`}
                className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 ring-2 transition-all ${
                  i === activeSlide
                    ? "ring-(--color-primary) opacity-100"
                    : "ring-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = roomPlaceholder;
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* reviews */}
      {reviews?.length > 0 && (
        <SectionCard title="Recent reviews">
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-xs font-bold text-blue-500">
                  {r.customer?.firstName?.[0] ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">
                      {r.customer?.firstName} {r.customer?.lastName}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          className={
                            i < r.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-gray-200 text-gray-200"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  {r.comment && (
                    <p className="text-sm text-gray-500 mt-0.5">{r.comment}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {reviews?.length === 0 && (
        <SectionCard title="Recent reviews">
          <div className="flex items-center gap-2 text-gray-400">
            <MessageSquare size={16} />
            <p className="text-sm">No reviews yet for this hotel.</p>
          </div>
        </SectionCard>
      )}

      {/* room selection */}
      <SectionCard title="Alternatives">
        <div className="space-y-3">
          {hotelRooms.filter((room) => room.maxGuests >= totalGuests).map((room) => {
            const isSelected = selectedRoomId === room._id;

            return (
              <button
                key={room._id}
                type="button"
                onClick={() => setSelectedRoomId(room._id)}
                className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                  isSelected
                    ? "border-(--color-primary) bg-blue-50/60"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "border-(--color-primary)"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-(--color-primary)" />
                        )}
                      </div>
                      <h2 className="text-base font-bold text-gray-900">
                        {getRoomTitle(room)}
                      </h2>
                    </div>
                    {room.description && (
                      <p className="mt-1.5 ml-6 text-sm text-gray-500 line-clamp-2">
                        {room.description}
                      </p>
                    )}
                    <div className="mt-2 ml-6 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white border border-gray-200 px-2.5 py-0.5 text-xs text-gray-600">
                        <Users size={11} /> Max {room.maxGuests}
                      </span>
                      {room.smokingAllowed && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-100 px-2.5 py-0.5 text-xs text-amber-700">
                          Smoking allowed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="sm:text-right sm:shrink-0 ml-6 sm:ml-0">
                    <p className="text-lg font-bold text-gray-900">
                      {toCurrency(room.pricePerNight * nights)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {toCurrency(room.pricePerNight)} / night
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* footer nav */}
      <div className="flex justify-end pb-6">
        <button
          type="button"
          onClick={() => goToDetailsStep(selectedRoomId, 1)}
          className="rounded-xl px-7 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Continue to details →
        </button>
      </div>
    </div>
  );
}
