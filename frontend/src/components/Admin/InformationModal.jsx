import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  X,
  Hotel,
  Users,
  User,
  CalendarDays,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Mail,
  Phone,
  BedDouble,
  Hash,
  Loader2,
} from "lucide-react";
import { ROLE_CONFIG, STATUS_CONFIG } from "@/components/Admin/UsersTable";
import { getApplicationById } from "@/services/hotelApplication.service";

const APP_STATUS = {
  approved: { label: "Approved", color: "#10b981" },
  under_review: { label: "Under Review", color: "#f59e0b" },
  rejected: { label: "Rejected", color: "#f43f5e" },
};

const HOTEL_STATUS = {
  active: { label: "Active", color: "#10b981" },
  suspended: { label: "Suspended", color: "#f43f5e" },
};

const fmt = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

function SnapCell({ icon: Icon, label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg px-3 py-2.5">
      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-700 flex items-center gap-1">
        <Icon size={12} className="text-gray-400" />
        {value}
      </p>
    </div>
  );
}

function InformationModal({ app, hotel, user, onClose }) {
  const [fullApp, setFullApp] = useState(null);
  const [appLoading, setAppLoading] = useState(false);

  useEffect(() => {
    if (!app?._id) {
      setFullApp(null);
      return;
    }
    setAppLoading(true);
    getApplicationById(app._id)
      .then(({ data }) => setFullApp(data.data))
      .catch(() => setFullApp(app))
      .finally(() => setAppLoading(false));
  }, [app?._id]);

  const activeApp = fullApp ?? app;
  const isOpen = !!(app || hotel || user);

  const hotelCfg = hotel
    ? (HOTEL_STATUS[hotel.status] ?? HOTEL_STATUS.active)
    : null;
  const roleCfg = user
    ? (ROLE_CONFIG[user.role] ?? ROLE_CONFIG.customer)
    : null;
  const statusCfg = user
    ? (STATUS_CONFIG[user.status] ?? STATUS_CONFIG.active)
    : null;
  const appStatusToShow = activeApp
    ? (APP_STATUS[activeApp.status] ?? APP_STATUS.under_review)
    : null;

  const title = user
    ? "User Details"
    : app
      ? "Application Details"
      : "Hotel Details";

  return (
    <div
      className={`fixed inset-0 z-70 overflow-hidden
        ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      <div
        className={`absolute top-4 bottom-4 bg-gray-50 rounded-2xl
          shadow-2xl flex flex-col transition-all duration-300 ease-in-out overflow-hidden
          inset-x-4 sm:left-auto sm:right-4 sm:w-full sm:max-w-sm
          ${isOpen ? "translate-x-0 opacity-100" : "translate-x-[110%] opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Preview Panel
            </p>
            <h2 className="text-base font-bold text-gray-800 mt-0.5">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center
              justify-center text-gray-500 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-5 space-y-3">
          {appLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Loader2 size={28} className="animate-spin mb-3 opacity-40" />
              <p className="text-sm">Loading details...</p>
            </div>
          ) : (
            isOpen && (
              <>
                <div className="bg-white rounded-xl p-4 flex flex-col items-center text-center border border-gray-100">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                    {user ? (
                      <span
                        className="font-semibold text-xl"
                        style={{ color: roleCfg?.color }}
                      >
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </span>
                    ) : (
                      <Hotel size={26} className="text-gray-400" />
                    )}
                  </div>
                  <h3 className="font-bold text-gray-800 text-base leading-tight">
                    {user
                      ? `${user.firstName} ${user.lastName}`
                      : (hotel?.name ?? activeApp?.hotelName)}
                  </h3>
                  {!user && hotel && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {hotel.address.city}, {hotel.address.country}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
                    {appStatusToShow && (
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: `${appStatusToShow.color}15`,
                          color: appStatusToShow.color,
                        }}
                      >
                        {appStatusToShow.label}
                      </span>
                    )}
                    {!app && hotelCfg && (
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: `${hotelCfg.color}15`,
                          color: hotelCfg.color,
                        }}
                      >
                        {hotelCfg.label}
                      </span>
                    )}
                    {hotel?.stars && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-500">
                        {"★".repeat(hotel.stars)} {hotel.stars}-Star
                      </span>
                    )}
                    {user && roleCfg && (
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: `${roleCfg.color}15`,
                          color: roleCfg.color,
                        }}
                      >
                        {roleCfg.label}
                      </span>
                    )}
                    {user && statusCfg && (
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: `${statusCfg.color}15`,
                          color: statusCfg.color,
                        }}
                      >
                        {statusCfg.label}
                      </span>
                    )}
                  </div>
                </div>

                {(hotel || user) && (
                  <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                      Contact
                    </p>
                    {[
                      { icon: Mail, value: user ? user.email : hotel?.email },
                      ...(!user
                        ? [
                            { icon: Phone, value: hotel?.phone },
                            {
                              icon: MapPin,
                              value: `${hotel.address.street}, ${hotel.address.city}`,
                            },
                          ]
                        : []),
                    ].map(({ icon: Icon, value }) => (
                      <div
                        key={value}
                        className="flex items-center gap-2.5 text-sm text-gray-600"
                      >
                        <Icon size={14} className="text-gray-400 shrink-0" />
                        <span className="truncate">{value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {(user || hotel) && (
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
                      {user ? "Account Snapshot" : "Hotel Snapshot"}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {user ? (
                        <>
                          <SnapCell
                            icon={Hash}
                            label="User ID"
                            value={(user?._id ?? "—").slice(-6).toUpperCase()}
                          />
                        </>
                      ) : (
                        <>
                          <SnapCell
                            icon={BedDouble}
                            label="Total Rooms"
                            value={hotel?.numberOfRooms ?? "—"}
                          />
                          <SnapCell
                            icon={Hash}
                            label="Hotel ID"
                            value={(hotel?._id ?? "—").slice(-6).toUpperCase()}
                          />
                        </>
                      )}
                    </div>
                  </div>
                )}

                {user && (
                  <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                      Account Info
                    </p>
                    <div className="flex items-start gap-2.5 text-sm">
                      <Users
                        size={14}
                        className="text-gray-400 mt-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-medium">
                          Role
                        </p>
                        <p className="text-gray-700 font-medium truncate">
                          {roleCfg?.label}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm">
                      <ShieldCheck
                        size={14}
                        className="text-gray-400 mt-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 font-medium">
                          Status
                        </p>
                        <p className="text-gray-700 font-medium truncate">
                          {statusCfg?.label}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeApp && !hotel && !user && (
                  <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                      Application Info
                    </p>
                    {[
                      {
                        icon: User,
                        label: "Submitted by",
                        value: activeApp.submittedBy,
                      },
                      {
                        icon: CalendarDays,
                        label: "Submitted on",
                        value: fmt(activeApp.createdAt),
                      },
                      {
                        icon: ShieldCheck,
                        label: "Reviewed by",
                        value: activeApp.reviewedBy ?? "Pending review",
                      },
                      {
                        icon: CalendarDays,
                        label: "Reviewed on",
                        value: fmt(activeApp.reviewedAt),
                      },
                    ].map(({ icon: Icon, label, value }) => (
                      <div
                        key={label}
                        className="flex items-start gap-2.5 text-sm"
                      >
                        <Icon
                          size={14}
                          className="text-gray-400 mt-0.5 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-[10px] text-gray-400 font-medium">
                            {label}
                          </p>
                          <p className="text-gray-700 font-medium truncate">
                            {value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(activeApp?.rejectionReason || hotel?.rejectionReason) && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-red-400 mb-1">
                      Rejection Reason
                    </p>
                    <p className="text-sm text-red-600">
                      {activeApp?.rejectionReason ?? hotel?.rejectionReason}
                    </p>
                  </div>
                )}
              </>
            )
          )}
        </div>

        <div className="px-5 py-4 bg-white border-t border-gray-100 shrink-0">
          {activeApp && !hotel && !user ? (
            <Link
              to={`/admin/hotels/applications/${activeApp._id}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Manage Application <ArrowRight size={15} />
            </Link>
          ) : hotel ? (
            <Link
              to={`/admin/hotels/${hotel._id}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              View Hotel Details <ArrowRight size={15} />
            </Link>
          ) : user ? (
            <Link
              to={`/admin/users/${user._id}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              View Full Profile <ArrowRight size={15} />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default InformationModal;
