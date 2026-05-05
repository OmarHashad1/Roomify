import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Hotel,
  MapPin,
  Mail,
  Phone,
  Star,
  BedDouble,
  User,
  ChevronRight,
  Hash,
  ShieldAlert,
  ShieldOff,
  Loader2,
  Sparkles,
  Building2,
} from "lucide-react";
import { getHotelById, updateHotelStatus } from "@/services/hotel.service";

const HOTEL_STATUS = {
  active:    { label: "Active",    badgeClass: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  suspended: { label: "Suspended", badgeClass: "bg-red-50    text-red-500    border-red-100"    },
};

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${accent}15` }}
      >
        <Icon size={18} style={{ color: accent }} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-lg font-bold text-gray-800 leading-tight mt-0.5">{value ?? "—"}</p>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
        <Icon size={13} className="text-gray-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-gray-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-gray-700 truncate mt-0.5">{value ?? "—"}</p>
      </div>
    </div>
  );
}

function Card({ title, icon: TitleIcon, children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
        {TitleIcon && <TitleIcon size={13} className="text-gray-400" />}
        <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{title}</h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function AdminHotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getHotelById(id)
      .then(({ data }) => setHotel(data.data))
      .catch(() => setHotel(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Loader2 size={32} className="animate-spin mb-3 opacity-40" />
        <p className="text-sm">Loading hotel...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Hotel size={40} className="text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">Hotel not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-sm text-blue-500 hover:underline cursor-pointer">
          Go back
        </button>
      </div>
    );
  }

  const statCfg  = HOTEL_STATUS[hotel.status] ?? HOTEL_STATUS.suspended;
  const isActive = hotel.status === "active";
  const ownerName = hotel.owner ? `${hotel.owner.firstName} ${hotel.owner.lastName}` : "—";

  const handleToggleStatus = async () => {
    const next = isActive ? "suspended" : "active";
    setSubmitting(true);
    try {
      const { data } = await updateHotelStatus(id, next);
      setHotel(data.data);
      if (next === "suspended") {
        toast.error("Hotel suspended", { description: `${hotel.name} has been suspended.`, position: "top-center" });
      } else {
        toast.success("Hotel reactivated", { description: `${hotel.name} is now active.`, position: "top-center" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update hotel status");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">

      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center
            justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-gray-600 cursor-pointer" onClick={() => navigate("/admin/hotels")}>
            Hotels
          </span>
          <ChevronRight size={14} />
          <span className="text-gray-700 font-medium">{hotel.name}</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="rounded-2xl px-7 py-6 text-white" style={{ backgroundColor: "var(--color-primary)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <Hotel size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">{hotel.name}</h1>
              <p className="text-white/60 text-sm mt-1 flex items-center gap-1.5">
                <MapPin size={12} />
                {hotel.address.city}, {hotel.address.country}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${statCfg.badgeClass}`}>
              {statCfg.label}
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-500 border border-amber-100">
              {"★".repeat(hotel.stars)} {hotel.stars}-Star
            </span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard icon={BedDouble} label="Total Rooms"  value={hotel.numberOfRooms} accent="#6366f1" />
        <StatCard icon={Star}      label="Star Rating"  value={`${hotel.stars} Stars`} accent="#f59e0b" />
        <StatCard icon={Hash}      label="Hotel ID"     value={hotel._id.slice(-8).toUpperCase()} accent="#64748b" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">

          {/* Description */}
          <Card title="About" icon={Building2}>
            <p className="text-sm text-gray-600 leading-relaxed">
              {hotel.description || "No description provided."}
            </p>
          </Card>

          {/* Amenities */}
          {hotel.amenities?.length > 0 && (
            <Card title="Amenities" icon={Sparkles}>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                      bg-indigo-50 border border-indigo-100 text-xs font-medium text-indigo-600"
                  >
                    <Sparkles size={10} className="opacity-60" />
                    {a}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Status Management */}
          <div className={`rounded-2xl border shadow-sm p-5 ${isActive ? "bg-red-50/40 border-red-100" : "bg-emerald-50/40 border-emerald-100"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-1">Hotel Status Management</h2>
                <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                  {isActive
                    ? "This hotel is currently active and visible to guests. Suspend it to temporarily hide it from the platform."
                    : "This hotel is suspended and hidden from guests. Reactivate it to make it visible again."}
                </p>
              </div>
              <button
                onClick={handleToggleStatus}
                disabled={submitting}
                className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                  transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap
                  ${isActive
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}
              >
                {submitting
                  ? <Loader2 size={15} className="animate-spin" />
                  : isActive
                    ? <><ShieldOff size={15} /> Suspend</>
                    : <><ShieldAlert size={15} /> Reactivate</>
                }
              </button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">

          <Card title="Contact" icon={Mail}>
            <div className="space-y-3">
              <InfoItem icon={Mail}   label="Email"   value={hotel.email} />
              <InfoItem icon={Phone}  label="Phone"   value={hotel.phone} />
              <InfoItem icon={MapPin} label="Address" value={`${hotel.address.street}, ${hotel.address.city}`} />
            </div>
          </Card>

          <Card title="Owner" icon={User}>
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {hotel.owner?.firstName?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{ownerName}</p>
                <p className="text-xs text-gray-400">Hotel Manager</p>
              </div>
            </div>
            <div className="space-y-3">
              <InfoItem icon={Mail}  label="Email" value={hotel.owner?.email} />
              <InfoItem icon={Phone} label="Phone" value={hotel.owner?.phone} />
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}

export default AdminHotelDetails;
