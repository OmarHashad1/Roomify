import { useContext, useState } from "react";
import { CheckCircle, Clock, XCircle, Search, FileText, Loader2 } from "lucide-react";
import { HotelApplicationContext } from "@/context/hotelApplication/HotelApplicationContext";
import InformationModal from "@/components/Admin/InformationModal";
import { PageHeader } from "@/components/Admin/PageHeader";

const STATUS_CONFIG = {
  approved: {
    label: "Approved",
    color: "#10b981",
    badgeClass: "bg-emerald-50 text-emerald-600",
    icon: CheckCircle,
  },
  under_review: {
    label: "Under Review",
    color: "#f59e0b",
    badgeClass: "bg-amber-50 text-amber-600",
    icon: Clock,
  },
  rejected: {
    label: "Rejected",
    color: "#f43f5e",
    badgeClass: "bg-red-50 text-red-500",
    icon: XCircle,
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.under_review;
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${cfg.badgeClass}`}
    >
      {cfg.label}
    </span>
  );
}

function StarRating({ count }) {
  return (
    <span className="text-amber-400 text-sm tracking-tighter">
      {"★".repeat(count)}
      <span className="text-gray-300">{"★".repeat(5 - count)}</span>
    </span>
  );
}

function AdminApplications() {
  const { applications, summary, loading } = useContext(HotelApplicationContext);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState(null);

  const filtered = applications.filter((app) => {
    const matchesFilter = activeFilter === "all" || app.status === activeFilter;
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      app.hotelName?.toLowerCase().includes(searchLower) ||
      app.submittedBy?.toLowerCase().includes(searchLower) ||
      app.address?.city?.toLowerCase().includes(searchLower);
    return matchesFilter && matchesSearch;
  });

  const FILTERS = [
    { key: "all", label: "All", count: summary.total },
    { key: "under_review", label: "Under Review", count: summary.under_review },
    { key: "approved", label: "Approved", count: summary.approved },
    { key: "rejected", label: "Rejected", count: summary.rejected },
  ];

  const stats = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
    label: cfg.label,
    value: summary[key] ?? 0,
    icon: cfg.icon,
    color: cfg.color,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hotel Applications"
        subtitle="Review and manage hotel registration requests."
        subtitleClassName="text-sm text-white/60 mt-1"
        stats={stats}
        statsGridClassName="grid grid-cols-1 sm:grid-cols-3 gap-4"
        statCardProps={{
          cardClassName: "duration-500 min-w-0",
          animationDuration: "0.5s",
        }}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium
                  transition-all duration-150 cursor-pointer border
                  ${
                    activeFilter === f.key
                      ? "bg-(--color-primary) text-white border-(--color-primary)"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                  }`}
              >
                {f.label}
                <span
                  className={`text-xs font-semibold
                    ${activeFilter === f.key ? "text-white/80" : "text-gray-400"}`}
                >
                  {f.count}
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
              placeholder="Search by hotel name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-64
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-(--color-primary)"
            />
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Hotel", "Location", "Submitted By", "Date", "Status"].map((h) => (
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                    <Loader2 size={32} className="mx-auto mb-2 animate-spin opacity-40" />
                    <p className="text-sm">Loading applications...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                    <FileText size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No applications found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr
                    key={app._id}
                    onClick={() => setSelectedApp(app)}
                    className="hover:bg-gray-50/70 transition-colors duration-100 group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText size={15} className="text-(--color-primary)" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 leading-tight text-left
                            group-hover:underline group-hover:text-(--color-primary) transition-colors">
                            {app.hotelName}
                          </p>
                          {app.stars && <StarRating count={app.stars} />}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {app.address?.city}, {app.address?.country}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-700">{app.submittedBy}</span>
                    </td>

                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/40 text-xs text-gray-400">
          Showing {filtered.length} of {summary.total} applications
        </div>
      </div>

      <InformationModal
        app={selectedApp}
        onClose={() => setSelectedApp(null)}
      />
    </div>
  );
}

export default AdminApplications;
