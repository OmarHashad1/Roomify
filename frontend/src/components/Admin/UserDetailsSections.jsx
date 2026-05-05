import {
  Mail,
  Phone,
  CalendarDays,
  Hash,
  Shield,
  Globe,
  CheckCircle,
} from "lucide-react";

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
          {title}
        </h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={14} className="text-gray-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-gray-700 mt-0.5 wrap-break-word">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    active: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
    suspended: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
    },
  };

  const style = config[status] || config.active;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border} inline-flex items-center gap-1.5`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${style.bg.replace("bg-", "bg-")}`}
        style={{
          backgroundColor: status === "active" ? "#10b981" : "#ef4444",
        }}
      />
      {status === "active" ? "Active" : "Suspended"}
    </span>
  );
}

function StatCard({ count, label, bgColor, textColor }) {
  return (
    <div className={`${bgColor} rounded-lg border p-3 text-center`}>
      <p className={`text-2xl font-bold ${textColor}`}>{count}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

export function UserDetailsSections({ user, status, actionsPanel }) {
  const stats = user.stats ?? {};
  let statisticsData = [];

  if (user.role === "customer") {
    statisticsData = [
      {
        count: stats.noOfBookings ?? 0,
        label: "Bookings",
        bgColor: "bg-blue-50 border-blue-100",
        textColor: "text-blue-600",
      },
      {
        count: stats.noOfReviews ?? 0,
        label: "Reviews",
        bgColor: "bg-purple-50 border-purple-100",
        textColor: "text-purple-600",
      },
      {
        count: stats.avgRating || "—",
        label: "Avg Rating",
        bgColor: "bg-amber-50 border-amber-100",
        textColor: "text-amber-600",
      },
    ];
  } else if (user.role === "hotel_manager") {
    statisticsData = [
      {
        count: stats.noOfRooms ?? 0,
        label: "Total Rooms",
        bgColor: "bg-cyan-50 border-cyan-100",
        textColor: "text-cyan-600",
      },
      {
        count: `$${(stats.totalRevenue ?? 0).toLocaleString()}`,
        label: "Revenue",
        bgColor: "bg-emerald-50 border-emerald-100",
        textColor: "text-emerald-600",
      },
    ];
  } else if (user.role === "admin") {
    statisticsData = [
      {
        count: stats.totalUsers ?? 0,
        label: "Total Users",
        bgColor: "bg-blue-50 border-blue-100",
        textColor: "text-blue-600",
      },
      {
        count: stats.totalBookings ?? 0,
        label: "Total Bookings",
        bgColor: "bg-indigo-50 border-indigo-100",
        textColor: "text-indigo-600",
      },
      {
        count: stats.totalHotels ?? 0,
        label: "Total Hotels",
        bgColor: "bg-rose-50 border-rose-100",
        textColor: "text-rose-600",
      },
    ];
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* User Overview */}
        <SectionCard title="User Overview">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow
              icon={CalendarDays}
              label="Age"
              value={user.age ? `${user.age} years old` : null}
            />
            <InfoRow
              icon={Globe}
              label="Nationality"
              value={user.nationality}
            />
            <InfoRow
              icon={Hash}
              label="User ID"
              value={user._id.substring(0, 12).toUpperCase() + "..."}
            />
            <InfoRow
              icon={Shield}
              label="Role"
              value={
                user.role.charAt(0).toUpperCase() +
                user.role.slice(1).replace("_", " ")
              }
            />
          </div>
        </SectionCard>

        {/* Account Status */}
        <SectionCard title="Account Status">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">Current Status</span>
              </div>
              <StatusBadge status={status} />
            </div>
            <div className="pt-2 border-t border-gray-100">
              <InfoRow
                icon={CalendarDays}
                label="Member Since"
                value={fmtDate(user.createdAt)}
              />
            </div>
          </div>
        </SectionCard>

        {/* Account Statistics - DYNAMIC BASED ON ROLE */}
        <SectionCard title="Account Statistics">
          <div
            className={`grid gap-3 ${
              statisticsData.length === 2 ? "grid-cols-2" : "grid-cols-3"
            }`}
          >
            {statisticsData.map((stat, idx) => (
              <StatCard
                key={idx}
                count={stat.count}
                label={stat.label}
                bgColor={stat.bgColor}
                textColor={stat.textColor}
              />
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="space-y-6">
        {/* Contact Information */}
        <SectionCard title="Contact Information">
          <div className="space-y-3">
            <InfoRow icon={Mail} label="Email Address" value={user.email} />
            <InfoRow icon={Phone} label="Phone Number" value={user.phone} />
          </div>
        </SectionCard>

        {/* Admin Actions Panel */}
        {actionsPanel}
      </div>
    </div>
  );
}
