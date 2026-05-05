import { CheckCircle2 } from "lucide-react";

export const ALL_AMENITIES = [
  "Free WiFi",
  "Air Conditioning",
  "Flat-screen TV",
  "Mini Bar",
  "Safe",
  "Hairdryer",
  "Jacuzzi",
  "Butler Service",
  "Lounge Area",
  "Rooftop Pool Access",
  "Bathrobe & Slippers",
  "Parking",
  "Room Service",
  "Balcony",
  "Kitchenette",
  "Coffee Maker",
  "Iron & Ironing Board",
  "Gym Access",
  "Spa Access",
  "Concierge Service",
];

export const normalizeAmenitiesSelection = (amenities = []) => {
  if (!Array.isArray(amenities)) return [];

  const normalizedSet = new Set(
    amenities
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean),
  );

  return ALL_AMENITIES.filter((amenity) => normalizedSet.has(amenity));
};

function AmenitiesSelector({ selected, onChange }) {
  const normalizedSelected = normalizeAmenitiesSelection(selected);

  function toggle(amenity) {
    if (normalizedSelected.includes(amenity)) {
      onChange(normalizedSelected.filter((a) => a !== amenity));
    } else {
      onChange([...normalizedSelected, amenity]);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {normalizedSelected.length} amenit{normalizedSelected.length === 1 ? "y" : "ies"} selected
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {ALL_AMENITIES.map((amenity) => {
          const isSelected = normalizedSelected.includes(amenity);
          return (
            <label
              key={amenity}
              className={`flex items-center gap-2.5 rounded-md border px-3 py-2.5 cursor-pointer transition-colors text-sm ${
                isSelected
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-[var(--color-primary)]/50 hover:text-foreground"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={isSelected}
                onChange={() => toggle(amenity)}
              />
              <CheckCircle2
                className={`size-4 shrink-0 transition-colors ${
                  isSelected
                    ? "text-[var(--color-primary)]"
                    : "text-muted-foreground/40"
                }`}
              />
              <span className="truncate">{amenity}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default AmenitiesSelector;
