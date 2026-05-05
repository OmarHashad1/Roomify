import { useState, useMemo } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  X,
  Star,
  BedDouble,
  Users,
  CalendarDays,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { humanize } from "@/utils/util";
import { createReview } from "@/services/review.service";

const CATEGORIES = [
  "Staff",
  "Facilities",
  "Cleanliness",
  "Comfort",
  "Value for Money",
  "Location",
];

const INITIAL_RATINGS = {
  Staff: 0,
  Facilities: 0,
  Cleanliness: 0,
  Comfort: 0,
  "Value for Money": 0,
  Location: 0,
};

const reviewSchema = yup.object({
  ratings: yup.object({
    Staff: yup.number().min(1).required(),
    Facilities: yup.number().min(1).required(),
    Cleanliness: yup.number().min(1).required(),
    Comfort: yup.number().min(1).required(),
    "Value for Money": yup.number().min(1).required(),
    Location: yup.number().min(1).required(),
  }),
  comment: yup.string().trim(),
});

function getTravelerType(numGuests) {
  if (numGuests === 1) return "Solo traveler";
  if (numGuests === 2) return "Couple";
  if (numGuests === 3) return "Family";
  return "Group of friends";
}

function fmtDate(d) {
  return d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
}

export default function WriteReviewSidebar({ booking, hotelName, onClose }) {
  const [submitting, setSubmitting] = useState(false);
  const [hovered, setHovered] = useState({ cat: null, star: 0 });

  const formik = useFormik({
    initialValues: {
      ratings: INITIAL_RATINGS,
      comment: "",
    },
    validationSchema: reviewSchema,
    onSubmit: async (values) => {
      const vals = Object.values(values.ratings);
      const rating =
        Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
      const comment = values.comment.trim();

      setSubmitting(true);
      try {
        await createReview({
          booking: booking._id,
          rating,
          ...(comment && { comment }),
        });
        toast.success("Thanks for your review! We hope to see you again.");
        onClose?.();
      } catch (err) {
        const status = err.response?.status;
        const msg = err.response?.data?.message;
        toast.error(
          status === 400 || status === 403
            ? msg
            : "Something went wrong. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const allRated = Object.values(formik.values.ratings).every((v) => v > 0);

  const averageScore = useMemo(() => {
    if (!allRated) return null;
    const vals = Object.values(formik.values.ratings);
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  }, [formik.values.ratings, allRated]);

  function handleRating(cat, val) {
    formik.setFieldValue(`ratings.${cat}`, val);
  }

  async function submitReview() {
    if (!allRated) {
      toast.error("Please rate all categories.");
      return;
    }
    await formik.submitForm();
  }

  const travelerType = getTravelerType(booking?.numGuests);

  const tripFields = [
    {
      label: "Room",
      value: humanize(booking?.roomType?.type) || "—",
      icon: <BedDouble size={15} />,
      color: "bg-blue-50 text-blue-500",
    },
    {
      label: "Traveler",
      value: travelerType,
      icon: <Users size={15} />,
      color: "bg-violet-50 text-violet-500",
    },
    {
      label: "Check-in",
      value: fmtDate(booking?.checkIn),
      icon: <CalendarDays size={15} />,
      color: "bg-amber-50 text-amber-500",
    },
    {
      label: "Check-out",
      value: fmtDate(booking?.checkOut),
      icon: <CalendarDays size={15} />,
      color: "bg-green-50 text-green-500",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-100 z-50 shadow-2xl flex flex-col overflow-hidden">
        {/* Hero header */}
        <div className="relative h-20 bg-linear-to-r from-(--color-primary) to-[#1a6a96] shrink-0">
          <div className="absolute -bottom-6 left-6">
            <div className="w-12 h-12 rounded-xl bg-white shadow-md border-2 border-white flex items-center justify-center">
              <Star size={20} className="text-(--color-primary)" />
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-4 flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {/* Title */}
        <div className="px-6 pt-10 pb-4 bg-gray-100 shrink-0">
          <h2 className="font-bold text-gray-900 text-base">Write a Review</h2>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{hotelName}</p>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
          {/* Trip info */}
          <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Trip Info
            </p>
            <div className="grid grid-cols-2 gap-3">
              {tripFields.map(({ label, value, icon, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}
                  >
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                      {label}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Score display */}
          {allRated && (
            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-(--color-primary)/10 flex items-center justify-center shrink-0">
                <p className="text-lg font-bold text-(--color-primary)">
                  {averageScore}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800">
                  Your overall score
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Out of 5 — based on all categories
                </p>
              </div>
            </div>
          )}

          {/* Category ratings */}
          <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Rate Your Stay
            </p>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat}
                  onMouseLeave={() => setHovered({ cat: null, star: 0 })}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <p className="text-sm font-semibold text-gray-700">{cat}</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active =
                        (hovered.cat === cat
                          ? hovered.star
                          : formik.values.ratings[cat]) >= star;

                      return (
                        <Star
                          key={star}
                          size={18}
                          onMouseEnter={() => setHovered({ cat, star })}
                          onClick={() => handleRating(cat, star)}
                          className={`cursor-pointer transition-colors ${
                            active
                              ? "fill-amber-400 text-amber-400"
                              : "fill-gray-100 text-gray-300 hover:text-amber-300"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Your Experience
              </p>
              <span className="text-[10px] font-medium text-gray-300">
                Optional
              </span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-9 h-9 rounded-lg bg-(--color-primary)/10 flex items-center justify-center shrink-0">
                <MessageSquare size={15} className="text-(--color-primary)" />
              </div>
              <textarea
                name="comment"
                value={formik.values.comment}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
                placeholder="Share what you loved (or didn't) about your stay..."
                className="flex-1 text-sm text-gray-700 placeholder:text-gray-300 bg-transparent resize-none outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white shrink-0">
          <button
            onClick={submitReview}
            disabled={submitting}
            className="w-full bg-(--color-primary) hover:opacity-90 text-white font-semibold py-3 rounded-xl text-sm transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Star size={15} />
                Submit Review
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
