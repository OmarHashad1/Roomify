import { useState } from "react";
import {
  Search,
  Mail,
  Shield,
  CheckCircle,
  AlertCircle,
  Users,
} from "lucide-react";

export const ROLE_CONFIG = {
  customer: {
    label: "Customer",
    color: "#3b82f6",
    badgeClass: "bg-blue-50 text-blue-600",
    icon: Users,
  },
  hotel_manager: {
    label: "Manager",
    color: "#f59e0b",
    badgeClass: "bg-amber-50 text-amber-600",
    icon: Shield,
  },
  admin: {
    label: "Admin",
    color: "#8b5cf6",
    badgeClass: "bg-violet-50 text-violet-600",
    icon: Shield,
  },
};

export const STATUS_CONFIG = {
  active: {
    label: "Active",
    color: "#10b981",
    badgeClass: "bg-emerald-50 text-emerald-600",
    icon: CheckCircle,
  },
  suspended: {
    label: "Suspended",
    color: "#ef4444",
    badgeClass: "bg-red-50 text-red-500",
    icon: AlertCircle,
  },
  deleted: {
    label: "Deleted",
    color: "#6b7280",
    badgeClass: "bg-gray-100 text-gray-600",
    icon: AlertCircle,
  },
};

export function UsersTable({ users = [], onSelectUser }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const counts = {
    customer: users.filter((u) => u.role === "customer").length,
    hotel_manager: users.filter((u) => u.role === "hotel_manager").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  const filtered = users.filter((user) => {
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchLower) ||
      (user.email || "").toLowerCase().includes(searchLower);

    return matchesRole && matchesSearch;
  });

  const FILTERS = [
    { key: "all", label: "All", count: users.length },
    { key: "customer", label: "Customers", count: counts.customer },
    { key: "hotel_manager", label: "Managers", count: counts.hotel_manager },
    { key: "admin", label: "Admins", count: counts.admin },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setRoleFilter(f.key)}
              className={`shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium
                transition-all duration-150 cursor-pointer border
                ${
                  roleFilter === f.key
                    ? "bg-(--color-primary) text-white border-(--color-primary)"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                }`}
            >
              {f.label}
              <span
                className={`text-xs font-semibold
                  ${roleFilter === f.key ? "text-white/80" : "text-gray-400"}`}
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
            placeholder="Name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-64
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-(--color-primary)"
          />
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full min-w-225 text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Contact
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-16 text-center text-gray-400"
                >
                  <Users size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No users found</p>
                </td>
              </tr>
            ) : (
              filtered.map((user) => {
                const roleCfg = ROLE_CONFIG[user.role] || ROLE_CONFIG.customer;

                const statusCfg =
                  STATUS_CONFIG[user.status] || STATUS_CONFIG.active;

                return (
                  <tr
                    key={user._id}
                    onClick={() => onSelectUser(user)}
                    className="hover:bg-gray-50/70 transition-colors duration-100 group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-semibold text-sm"
                          style={{
                            backgroundColor: `${roleCfg.color}15`,
                            color: roleCfg.color,
                          }}
                        >
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </div>
                        <div>
                          <button
                            className="font-medium text-gray-900 leading-tight text-left
                              cursor-pointer transition-colors group-hover:underline group-hover:text-(--color-primary)"
                          >
                            {user.firstName} {user.lastName}
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${roleCfg.badgeClass}`}
                      >
                        {roleCfg.label}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${statusCfg.badgeClass}`}
                      >
                        {statusCfg.label}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-gray-600 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <Mail size={12} className="text-gray-400 shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/40 text-xs text-gray-400">
        Showing {filtered.length} of {users.length} users
      </div>
    </div>
  );
}
