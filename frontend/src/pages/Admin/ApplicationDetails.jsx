import { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import { toast } from "sonner";
import { rejectionSchema } from "@/Schemas/Admin/hotelApplication.validation";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Hotel,
  MapPin,
  Mail,
  Phone,
  Star,
  BedDouble,
  CalendarDays,
  User,
  ShieldCheck,
  FileText,
  CheckCircle,
  XCircle,
  Hash,
  ChevronRight,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  getApplicationById,
  updateApplicationStatus,
} from "@/services/hotelApplication.service";

const STATUS_CONFIG = {
  approved: {
    label: "Approved",
    badgeClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  under_review: {
    label: "Under Review",
    badgeClass: "bg-amber-50 text-amber-600 border-amber-100",
  },
  rejected: {
    label: "Rejected",
    badgeClass: "bg-red-50 text-red-500 border-red-100",
  },
};

function fmt(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
        <Icon size={15} className="text-gray-400" />
      </div>
      <div>
        <p className="text-[11px] text-gray-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-gray-700 mt-0.5">{value || "—"}</p>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={13} className="text-gray-400" />
      </div>
      <div>
        <p className="text-[11px] text-gray-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-gray-700 mt-0.5">{value || "—"}</p>
      </div>
    </div>
  );
}

function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [action, setAction] = useState(null);

  const refreshApplication = useCallback(async ({ withLoader = false } = {}) => {
    if (withLoader) setLoading(true);
    try {
      const { data } = await getApplicationById(id);
      setApp(data.data);
    } catch {
      if (withLoader) setApp(null);
    } finally {
      if (withLoader) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refreshApplication({ withLoader: true });
  }, [refreshApplication]);

  const formik = useFormik({
    initialValues: { rejectionReason: "" },
    validationSchema: rejectionSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);
      try {
        await updateApplicationStatus(id, {
          status: "rejected",
          rejectionReason: values.rejectionReason,
        });
        toast.error("Application rejected", {
          description: `The application for ${app.hotelName} has been rejected.`,
          position: "top-center",
        });
        resetForm();
        setAction(null);
        await refreshApplication();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to reject application");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      await updateApplicationStatus(id, { status: "approved" });
      toast.success("Application approved", {
        description: `${app.hotelName} has been approved.`,
        position: "top-center",
      });
      setAction(null);
      formik.resetForm();
      await refreshApplication();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Loader2 size={32} className="animate-spin mb-3 opacity-40" />
        <p className="text-sm">Loading application...</p>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <FileText size={40} className="text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">Application not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-sm text-blue-500 hover:underline cursor-pointer"
        >
          Go back
        </button>
      </div>
    );
  }

  const applicationStatus = String(app.status ?? app.applicationStatus ?? "")
    .trim()
    .toLowerCase();
  const canManageApplication =
    applicationStatus !== "approved" && applicationStatus !== "rejected";
  const cfg = STATUS_CONFIG[applicationStatus] ?? STATUS_CONFIG.under_review;

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center
            justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span
            className="hover:text-gray-600 cursor-pointer"
            onClick={() => navigate("/admin/hotels/applications")}
          >
            Applications
          </span>
          <ChevronRight size={14} />
          <span className="text-gray-700 font-medium">{app.hotelName}</span>
        </div>
      </div>
      <div
        className="rounded-2xl px-7 py-5 text-white"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <Hotel size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">{app.hotelName}</h1>
              <p className="text-white/60 text-sm mt-0.5 flex items-center gap-1">
                <MapPin size={12} />
                {app.address?.city}, {app.address?.country}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${cfg.badgeClass}`}>
              {cfg.label}
            </span>
            {app.stars && (
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-500 border border-amber-100">
                {"★".repeat(app.stars)} {app.stars}-Star
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={BedDouble} label="Total Rooms" value={app.numberOfRooms} />
        <StatCard icon={Star} label="Star Rating" value={`${app.stars} Stars`} />
        <StatCard icon={MapPin} label="Location" value={`${app.address?.city}, ${app.address?.country}`} />
        <StatCard icon={Hash} label="App ID" value={app._id.slice(-8).toUpperCase()} />
      </div>

      {app.description && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Description</p>
          <p className="text-sm text-gray-600 leading-relaxed">{app.description}</p>
        </div>
      )}

      {/* Contact + Application Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Contact</p>
          <InfoItem icon={Mail} label="Email" value={app.email} />
          <InfoItem icon={Phone} label="Phone" value={app.phone} />
          <InfoItem icon={MapPin} label="Address" value={`${app.address?.street}, ${app.address?.city}`} />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Application Info</p>
          <InfoItem icon={User} label="Submitted by" value={app.submittedBy ?? `${app.firstName} ${app.lastName}`} />
          <InfoItem icon={CalendarDays} label="Submitted on" value={fmt(app.createdAt)} />
          <InfoItem icon={ShieldCheck} label="Reviewed by" value={app.reviewedBy ?? "Not yet reviewed"} />
          <InfoItem icon={CalendarDays} label="Reviewed on" value={fmt(app.reviewedAt)} />
        </div>
      </div>

      {/* Rejection Reason */}
      {app.rejectionReason && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3">
          <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-red-400 mb-1">
              Rejection Reason
            </p>
            <p className="text-sm text-red-600">{app.rejectionReason}</p>
          </div>
        </div>
      )}

      {canManageApplication && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">Manage Application</p>

          {action === "reject" && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Rejection Reason <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Explain why this application is being rejected…"
                {...formik.getFieldProps("rejectionReason")}
                className={`w-full px-4 py-3 text-sm border rounded-xl resize-none
                  focus:outline-none focus:ring-2 placeholder:text-gray-300 transition-all
                  ${
                    formik.touched.rejectionReason && formik.errors.rejectionReason
                      ? "border-red-300 focus:ring-red-200 focus:border-red-300"
                      : "border-gray-200 focus:ring-red-200 focus:border-red-300"
                  }`}
              />
              {formik.touched.rejectionReason && formik.errors.rejectionReason && (
                <p className="text-xs text-red-500">{formik.errors.rejectionReason}</p>
              )}
              <p className="text-xs text-gray-400 text-right">
                {formik.values.rejectionReason.length} / 500
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleApprove}
              disabled={submitting}
              className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl
                text-sm font-semibold transition-all active:scale-95 cursor-pointer
                disabled:opacity-40 disabled:cursor-not-allowed
                bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white"
            >
              {submitting && action !== "reject" ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
              Approve Application
            </button>

            <button
              onClick={() => {
                if (action !== "reject") {
                  setAction("reject");
                } else {
                  formik.handleSubmit();
                }
              }}
              disabled={submitting || (action === "reject" && !formik.isValid)}
              className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl
                text-sm font-semibold transition-all active:scale-95 cursor-pointer
                disabled:opacity-40 disabled:cursor-not-allowed
                bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
            >
              {submitting && action === "reject" ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} />}
              {action === "reject" ? "Confirm Rejection" : "Reject Application"}
            </button>
          </div>

          {action === "reject" && (
            <button
              onClick={() => { setAction(null); formik.resetForm(); }}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ApplicationDetails;
