import { Link } from "react-router-dom";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { HotelContext } from "@/context/hotel/HotelContext";
import { ArrowRight, Hotel, Star } from "lucide-react";

const STATUS_BADGE = {
  active: "bg-emerald-50 text-emerald-600",
  inactive: "bg-red-50 text-red-400",
  suspended: "bg-gray-100 text-gray-400",
};

export function RecentHotelsTable() {
  const navigate = useNavigate();
  const { hotels = [] } = useContext(HotelContext) || {};

  const recent = hotels.slice(0, 10);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700">Hotels</h2>
        <Link
          to="/admin/hotels"
          className="flex items-center gap-1 text-xs font-medium transition-colors"
          style={{ color: "var(--color-primary)" }}
        >
          Show all <ArrowRight size={13} />
        </Link>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="px-5 py-3 text-left font-medium">Hotel</th>
              <th className="px-5 py-3 text-left font-medium">Stars</th>
              <th className="px-5 py-3 text-left font-medium">Rooms</th>
              <th className="px-5 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((hotel) => (
              <tr
                key={hotel._id}
                onClick={() => navigate(`/admin/hotels/${hotel._id}`)}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3 group">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "var(--color-primary)18" }}
                    >
                      <Hotel
                        size={16}
                        style={{ color: "var(--color-primary)" }}
                        strokeWidth={1.8}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate cursor-pointer transition-colors group-hover:underline group-hover:text-(--color-primary)">
                        {hotel.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {hotel.address?.city}, {hotel.address?.country}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: hotel.stars }).map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-600">{hotel.numberOfRooms}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium capitalize ${STATUS_BADGE[hotel.status] ?? "bg-gray-100 text-gray-500"}`}
                  >
                    {hotel.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
