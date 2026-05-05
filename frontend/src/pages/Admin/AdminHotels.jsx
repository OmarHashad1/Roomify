import { useContext, useState } from "react";
import {
  Hotel,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Loader2,
} from "lucide-react";
import { HotelContext } from "@/context/hotel/HotelContext";
import InformationModal from "@/components/Admin/InformationModal";
import { PageHeader } from "@/components/Admin/PageHeader";

const APP_STATUS_CFG = {
  approved: { label: "Approved", badgeClass: "bg-emerald-50 text-emerald-600" },
  under_review: { label: "Under Review", badgeClass: "bg-amber-50  text-amber-600" },
  rejected: { label: "Rejected", badgeClass: "bg-red-50    text-red-500" },
};

const HOTEL_STATUS_CFG = {
  active:    { label: "Active",    badgeClass: "bg-emerald-50 text-emerald-600" },
  suspended: { label: "Suspended", badgeClass: "bg-red-50    text-red-500"    },
};

function StatusBadge({ config }) {
  const cfg = config ?? {
    label: "Unknown",
    badgeClass: "bg-gray-100 text-gray-400",
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-medium ${cfg.badgeClass}`}
    >
      {cfg.label}
    </span>
  );
}

function StarRating({ count }) {
  return (
    <span className="text-amber-400 text-sm tracking-tighter">
      {"★".repeat(count)}
      <span className="text-gray-200">{"★".repeat(5 - count)}</span>
    </span>
  );
}

const FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "suspended", label: "Suspended" },
];

function AdminHotels() {
  const { hotels, summary, loading, error } = useContext(HotelContext);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const counts = {
    total: summary.total,
    active: summary.active,
    suspended: summary.suspended,
  };

  const STAT_CARDS = [
    { label: "Total Hotels", value: counts.total,     icon: Building2,   color: "#6366f1" },
    { label: "Active",        value: counts.active,    icon: CheckCircle, color: "#10b981" },
    { label: "Suspended",     value: counts.suspended, icon: XCircle,     color: "#f43f5e" },
  ];

  const filterCounts = {
    all: hotels.length,
    active: counts.active,
    suspended: counts.suspended,
  };

  const filtered = hotels.filter((h) => {
    const matchesFilter = activeFilter === "all" || h.status === activeFilter;
    const q = search.toLowerCase();
    const ownerName = h.owner
      ? `${h.owner.firstName}.${h.owner.lastName}`.toLowerCase()
      : "";
    const matchesSearch =
      !search ||
      h.name?.toLowerCase().includes(q) ||
      h.address?.city?.toLowerCase().includes(q) ||
      ownerName.includes(q);
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Loader2 size={32} className="animate-spin mb-3 opacity-40" />
        <p className="text-sm">Loading hotels...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + stat cards */}
      <PageHeader
        title="Hotels"
        subtitle="Manage all registered hotels on the platform."
        subtitleClassName="text-sm text-white/60 mt-1"
        stats={STAT_CARDS}
        statsGridClassName="grid grid-cols-3 gap-4"
        statCardProps={{
          cardClassName: "duration-500 min-w-0",
          animationDuration: "0.5s",
        }}
      />

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-full text-sm
                  font-medium transition-all duration-150 cursor-pointer border
                  ${
                    activeFilter === f.key
                      ? "bg-(--color-primary) text-white border-(--color-primary)"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                  }`}
              >
                {f.label}
                <span
                  className={`text-xs font-semibold ${activeFilter === f.key ? "text-white/80" : "text-gray-400"}`}
                >
                  {filterCounts[f.key]}
                </span>
              </button>
            ))}
          </div>

          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name, city or owner"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-64
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-(--color-primary)"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {[
                  "Hotel",
                  "Location",
                  "Owner",
                  "Rooms",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-gray-400"
                  >
                    <Hotel size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No hotels found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((hotel) => (
                  <tr
                    key={hotel._id}
                    onClick={() => setSelected(hotel)}
                    className="hover:bg-gray-50/70 transition-colors duration-100 cursor-pointer group"
                  >
                    {/* Hotel name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Hotel size={15} className="text-(--color-primary)" />
                        </div>
                        <div>
                          <p
                            className="font-medium text-gray-900 leading-tight text-left
                              group-hover:underline group-hover:text-(--color-primary) transition-colors"
                          >
                            {hotel.name}
                          </p>
                          <StarRating count={hotel.stars} />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {hotel.address.city}, {hotel.address.country}
                    </td>

                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {hotel.owner
                        ? `${hotel.owner.firstName}.${hotel.owner.lastName}`.toLowerCase()
                        : "—"}
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {hotel.numberOfRooms}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge config={HOTEL_STATUS_CFG[hotel.status]} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/40 text-xs text-gray-400">
          Showing {filtered.length} of {hotels.length} hotels
        </div>
      </div>

      <InformationModal hotel={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export default AdminHotels;
