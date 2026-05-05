import { Link } from "react-router-dom";
import { useContext } from "react";
import { HotelApplicationContext } from "@/context/hotelApplication/HotelApplicationContext";
import { FileText, ArrowRight, Clock, CheckCircle, XCircle, Hourglass } from "lucide-react";

const STATUS_CFG = {
  under_review: { label: "Under Review", color: "#f59e0b", bg: "bg-amber-50",  text: "text-amber-500",  Icon: Hourglass    },
  approved:     { label: "Approved",     color: "#10b981", bg: "bg-emerald-50", text: "text-emerald-500", Icon: CheckCircle  },
  rejected:     { label: "Rejected",     color: "#f43f5e", bg: "bg-red-50",     text: "text-red-500",     Icon: XCircle      },
};

export function PendingPanel() {
  const { applications = [], summary = {} } = useContext(HotelApplicationContext) || {};

  const pendingApps = applications.filter(
    (a) => a.status === "under_review" || a.status === "pending"
  );

  const counts = {
    under_review: summary.under_review ?? 0,
    approved:     summary.approved     ?? 0,
    rejected:     summary.rejected     ?? 0,
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Applications</h2>
        <Link
          to="/admin/hotels/applications"
          className="flex items-center gap-1 text-xs font-medium transition-colors"
          style={{ color: "var(--color-primary)" }}
        >
          View all <ArrowRight size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {Object.entries(STATUS_CFG).map(([key, { label, color, bg, Icon }]) => (
          <div
            key={key}
            className={`${bg} rounded-xl px-3 py-2.5 flex flex-col items-center gap-1`}
          >
            <Icon size={14} style={{ color }} />
            <span className="text-xl font-bold" style={{ color }}>{counts[key]}</span>
            <span className="text-[10px] text-gray-400 text-center leading-tight">{label}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-3 flex flex-col gap-1">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Awaiting Review
        </p>
        {pendingApps.length === 0 ? (
          <p className="text-xs text-gray-400 py-2 text-center">No applications pending review</p>
        ) : (
          pendingApps.slice(0, 4).map((app) => (
            <Link
              key={app._id}
              to={`/admin/hotels/applications/${app._id}`}
              className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-7 h-7 rounded-md bg-amber-50 flex items-center justify-center shrink-0">
                <FileText size={13} className="text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate">{app.hotelName}</p>
                <p className="text-[10px] text-gray-400 truncate">
                  {app.firstName} {app.lastName} · {app.address?.city}
                </p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-amber-500 shrink-0">
                <Clock size={10} />
                <span>
                  {new Date(app.createdAt).toLocaleDateString("en", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            </Link>
          ))
        )}
        {pendingApps.length > 4 && (
          <Link
            to="/admin/hotels/applications"
            className="text-[10px] text-center mt-1 font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            +{pendingApps.length - 4} more
          </Link>
        )}
      </div>
    </div>
  );
}
