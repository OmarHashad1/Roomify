import { Plus, Minus } from "lucide-react";

const rows = [
  { key: "adults",   label: "Adults",   sub: "Ages 13 or above", min: 1, max: 30 },
  { key: "children", label: "Children", sub: "Ages 0–12",        min: 0, max: 10 },
  { key: "rooms",    label: "Rooms",    sub: null,               min: 1, max: 30 },
];

function GuestsDropdown({ guests, onChange, onClose }) {
  return (
    <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border
      border-gray-100 rounded-2xl shadow-2xl shadow-black/10 z-40 p-5 space-y-5">
      {rows.map(({ key, label, sub, min, max }) => (
        <div key={key} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">{label}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onChange(key, -1, min, max)}
              disabled={guests[key] <= min}
              className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center
                text-gray-500 hover:border-(--color-primary) hover:text-(--color-primary)
                disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Minus size={13} />
            </button>
            <span className="w-4 text-center text-sm font-bold text-gray-800">
              {guests[key]}
            </span>
            <button
              onClick={() => onChange(key, 1, min, max)}
              disabled={guests[key] >= max}
              className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center
                text-gray-500 hover:border-(--color-primary) hover:text-(--color-primary)
                disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={onClose}
        className="w-full py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer
          hover:opacity-90 transition-opacity"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        Done
      </button>
    </div>
  );
}

export default GuestsDropdown;
