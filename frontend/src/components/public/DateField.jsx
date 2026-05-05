import { CalendarDays, AlertCircle } from "lucide-react";

function DateField({ label, value, onChange, min, error }) {
  return (
    <div className="flex-1 min-w-0">
      <div
        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-gray-50 transition-colors
          ${error ? "ring-1 ring-red-300 bg-red-50/40" : ""}`}
      >
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
          <CalendarDays size={16} className="text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
            {label}
          </p>
          <input
            type="date"
            value={value}
            min={min}
            onChange={onChange}
            className="w-full text-sm font-medium text-gray-800 outline-none bg-transparent cursor-pointer"
          />
        </div>
      </div>
      {error && (
        <p className="flex items-center gap-1 text-[11px] font-medium text-red-500 px-4 pb-2 mt-0.5">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

export default DateField;
