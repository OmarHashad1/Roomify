import { useContext, useEffect, useMemo, useState } from "react";
import {
  Search,
  MessageSquare,
  Flag,
  Hotel,
  Eye,
  ChevronDown,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { updateReviewStatus as updateReviewStatusApi } from "@/services/admin.service";
import { ReviewContext } from "@/context/review/ReviewContext";
import { PageHeader } from "@/components/Admin/PageHeader";

const STATUS_STYLE = {
  published: "bg-emerald-50 text-emerald-600 border-emerald-100",
  flagged: "bg-amber-50 text-amber-600 border-amber-100",
  removed: "bg-gray-100 text-gray-600 border-gray-200",
};

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Stars({ value }) {
  return (
    <span className="text-amber-400 text-sm tracking-tight">
      {"★".repeat(value)}
      <span className="text-gray-200">{"★".repeat(5 - value)}</span>
    </span>
  );
}

function ReviewDetailsModal({
  review,
  onClose,
  onViewUser,
  onViewHotel,
  onFlag,
  onPublish,
  onRemove,
}) {
  const isOpen = !!review;
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    if (review) setSnapshot(review);
  }, [review]);

  const activeReview = review ?? snapshot;
  if (!activeReview) return null;

  const isFlagged = activeReview.status === "flagged";
  const customer = activeReview.customer;
  const hotel = activeReview.hotel;

  return (
    <div
      className={`fixed inset-0 z-70 overflow-hidden
        ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0"}
        }`}
      />

      <div
        className={`absolute top-4 bottom-4 bg-gray-50 rounded-2xl
          shadow-2xl flex flex-col transition-all duration-300 ease-in-out overflow-hidden
          inset-x-4 sm:left-auto sm:right-4 sm:w-full sm:max-w-md
          ${isOpen ? "translate-x-0 opacity-100" : "translate-x-[110%] opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Review Details
            </p>
            <h2 className="text-base font-bold text-gray-800 mt-0.5">
              {hotel?.name ?? "Hotel"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-5 space-y-4">
          <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Stars value={activeReview.rating} />
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLE[activeReview.status] ?? STATUS_STYLE.published}`}
              >
                {activeReview.status}
              </span>
            </div>
            <p className="text-sm text-gray-700 wrap-break-word">
              {activeReview.comment}
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Meta
            </p>
            <p className="text-xs text-gray-600">
              Review ID: {activeReview._id}
            </p>
            <p className="text-xs text-gray-600">
              Customer:{" "}
              {customer
                ? `${customer.firstName} ${customer.lastName}`
                : "Unknown"}
            </p>
            <p className="text-xs text-gray-600">
              Created: {fmtDate(activeReview.createdAt)}
            </p>
            <p className="text-xs text-gray-600">
              Updated: {fmtDate(activeReview.updatedAt)}
            </p>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 bg-white grid grid-cols-2 gap-2.5 shrink-0">
          <button
            onClick={onViewUser}
            disabled={!customer?._id}
            className="px-3 py-2.5 rounded-xl text-sm font-semibold border
              bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-500 hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            View User
          </button>

          <button
            onClick={onViewHotel}
            disabled={!hotel?._id}
            className="px-3 py-2.5 rounded-xl text-sm font-semibold border
              bg-cyan-50 text-cyan-600 border-cyan-200 hover:bg-cyan-500 hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            View Hotel
          </button>

          <button
            onClick={isFlagged ? onPublish : onFlag}
            className={`col-span-2 px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer
              ${
                isFlagged
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-500 hover:text-white"
                  : "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-500 hover:text-white"
              }`}
          >
            {isFlagged ? "Publish Review" : "Flag Review"}
          </button>

          <button
            onClick={onRemove}
            className="col-span-2 px-3 py-2.5 rounded-xl text-sm font-semibold border
              bg-red-50 text-red-600 border-red-200 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
          >
            Remove Review
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminReviews() {
  const navigate = useNavigate();

  const {
    reviews = [],
    loading,
    error,
    refresh,
  } = useContext(ReviewContext) || {};

  const [search, setSearch] = useState("");
  const [selectedHotel, setSelectedHotel] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [collapsedHotels, setCollapsedHotels] = useState({});

  const counts = {
    total: reviews.length,
    published: reviews.filter((r) => r.status === "published").length,
    flagged: reviews.filter((r) => r.status === "flagged").length,
    removed: reviews.filter((r) => r.status === "removed").length,
  };

  const stats = [
    {
      label: "Total Reviews",
      value: counts.total,
      hint: "Across all hotels",
      icon: MessageSquare,
      color: "#4f46e5",
      iconTint: "#ffffff33",
    },
    {
      label: "Published",
      value: counts.published,
      hint: "Visible to users",
      icon: Eye,
      color: "#059669",
      iconTint: "#6ee7b755",
    },
    {
      label: "Flagged",
      value: counts.flagged,
      hint: "Requires moderation",
      icon: Flag,
      color: "#d97706",
      iconTint: "#fcd34d55",
    },
    {
      label: "Hotels Reviewed",
      value: new Set(reviews.map((r) => r.hotel?._id)).size,
      hint: "Unique hotel coverage",
      icon: Hotel,
      color: "#0284c7",
      iconTint: "#7dd3fc55",
    },
  ];

  const filteredReviews = reviews.filter((review) => {
    const hotel = review.hotel;
    const customer = review.customer;
    const q = search.trim().toLowerCase();

    const matchesHotel =
      selectedHotel === "all" || hotel?._id === selectedHotel;
    const matchesStatus =
      statusFilter === "all" || review.status === statusFilter;
    const matchesQuery =
      q.length === 0 ||
      (review.comment || "").toLowerCase().includes(q) ||
      (hotel?.name || "").toLowerCase().includes(q) ||
      `${customer?.firstName || ""} ${customer?.lastName || ""}`
        .toLowerCase()
        .includes(q);

    return matchesHotel && matchesStatus && matchesQuery;
  });

  const groupedByHotel = useMemo(() => {
    const groups = filteredReviews.reduce((acc, review) => {
      const key = review.hotel?._id ?? "__unknown__";
      if (!acc[key]) acc[key] = { hotel: review.hotel, items: [] };
      acc[key].items.push(review);
      return acc;
    }, {});

    return Object.entries(groups)
      .map(([hotelId, { hotel, items }]) => {
        const avg =
          items.reduce((sum, item) => sum + (item.rating || 0), 0) /
          items.length;
        return {
          hotelId,
          hotelName: hotel?.name || "Unknown Hotel",
          city: hotel?.address?.city || "Unknown City",
          items: items.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
          averageRating: avg,
        };
      })
      .sort((a, b) => b.items.length - a.items.length);
  }, [filteredReviews]);

  const hotelOptions = useMemo(() => {
    const countByHotel = reviews.reduce((acc, r) => {
      const id = r.hotel?._id;
      if (!id) return acc;
      if (!acc[id]) acc[id] = { id, label: r.hotel.name, count: 0 };
      acc[id].count += 1;
      return acc;
    }, {});
    return [
      { id: "all", label: "All Hotels", count: reviews.length },
      ...Object.values(countByHotel),
    ];
  }, [reviews]);

  const statusOptions = [
    {
      key: "all",
      label: "All",
      count: counts.total,
      activeClass: "bg-(--color-primary) text-white border-(--color-primary)",
    },
    {
      key: "published",
      label: "Published",
      count: counts.published,
      activeClass: "bg-emerald-500 text-white border-emerald-500",
    },
    {
      key: "flagged",
      label: "Flagged",
      count: counts.flagged,
      activeClass: "bg-amber-500 text-white border-amber-500",
    },
    {
      key: "removed",
      label: "Removed",
      count: counts.removed,
      activeClass: "bg-gray-500 text-white border-gray-500",
    },
  ];

  const updateReviewStatus = async (id, nextStatus, successMessage) => {
    try {
      await updateReviewStatusApi(id, nextStatus);
      setSelectedReview((prev) =>
        prev
          ? { ...prev, status: nextStatus, updatedAt: new Date().toISOString() }
          : prev,
      );
      refresh?.();
      toast.success(successMessage, { position: "top-center" });
    } catch (err) {
      const s = err.response?.status;
      const msg = err.response?.data?.message;
      toast.error(
        s === 400 || s === 404
          ? msg
          : "Something went wrong. Please try again.",
        { position: "top-center" },
      );
    }
  };

  const removeSelectedReview = () => {
    if (!selectedReview) return;
    updateReviewStatus(selectedReview._id, "removed", "Review removed");
  };

  const toggleHotelSection = (hotelId) => {
    setCollapsedHotels((prev) => ({
      ...prev,
      [hotelId]: !prev[hotelId],
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-14">
        <Loader2 size={28} className="animate-spin text-gray-300" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-14 gap-3">
        <AlertCircle size={32} className="text-gray-200" />
        <p className="text-sm font-semibold text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews"
        subtitle="Moderate feedback grouped by hotel and keep quality high."
        subtitleClassName="text-sm text-white/60 mt-1"
        stats={stats}
        statsGridClassName="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        statCardProps={{
          cardClassName: "duration-500 min-w-0",
          animationDuration: "0.5s",
        }}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 shrink-0">
                Status
              </p>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
                {statusOptions.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setStatusFilter(item.key)}
                    className={`shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer
                      ${
                        statusFilter === item.key
                          ? item.activeClass
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                      }`}
                  >
                    {item.label}
                    <span
                      className={`text-xs ${statusFilter === item.key ? "text-white/80" : "text-gray-400"}`}
                    >
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full lg:w-72 lg:ml-auto lg:shrink-0">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search comment, hotel or customer"
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-(--color-primary)"
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/30 px-3 py-3 space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-1">
              Hotels
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {hotelOptions.slice(0, 8).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedHotel(opt.id)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer
                    ${
                      selectedHotel === opt.id
                        ? "bg-(--color-primary) text-white border-(--color-primary)"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                    }`}
                >
                  {opt.label}
                  <span
                    className={`text-xs ${selectedHotel === opt.id ? "text-white/80" : "text-gray-400"}`}
                  >
                    {opt.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {groupedByHotel.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <MessageSquare size={30} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No reviews found.</p>
            </div>
          ) : (
            groupedByHotel.map((group) => (
              <div
                key={group.hotelId}
                className="border border-gray-100 rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleHotelSection(group.hotelId)}
                  className="w-full px-4 py-3 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between gap-3 text-left hover:bg-gray-100/70 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {group.hotelName}
                    </p>
                    <p className="text-xs text-gray-500">{group.city}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{group.items.length} reviews</span>
                    <span className="text-amber-500 font-semibold">
                      {group.averageRating.toFixed(1)} ★
                    </span>
                    <ChevronDown
                      size={15}
                      className={`text-gray-400 transition-transform ${collapsedHotels[group.hotelId] ? "-rotate-90" : "rotate-0"}`}
                    />
                  </div>
                </button>

                {!collapsedHotels[group.hotelId] && (
                  <div className="divide-y divide-gray-100">
                    {group.items.map((review) => {
                      const customer = review.customer;
                      return (
                        <button
                          key={review._id}
                          onClick={() => setSelectedReview(review)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Stars value={review.rating} />
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${STATUS_STYLE[review.status] ?? STATUS_STYLE.published}`}
                                >
                                  {review.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 wrap-break-word line-clamp-2">
                                {review.comment}
                              </p>
                            </div>

                            <div className="text-xs text-gray-500 md:text-right shrink-0">
                              <p>
                                {customer
                                  ? `${customer.firstName} ${customer.lastName}`
                                  : "Unknown"}
                              </p>
                              <p>{fmtDate(review.createdAt)}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <ReviewDetailsModal
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
        onViewUser={() => {
          const uid = selectedReview?.customer?._id;
          if (!uid) return;
          navigate(`/admin/users/${uid}`);
          setSelectedReview(null);
        }}
        onViewHotel={() => {
          const hid = selectedReview?.hotel?._id;
          if (!hid) return;
          navigate(`/admin/hotels/${hid}`);
          setSelectedReview(null);
        }}
        onFlag={() =>
          selectedReview &&
          updateReviewStatus(
            selectedReview._id,
            "flagged",
            "Review flagged for moderation",
          )
        }
        onPublish={() =>
          selectedReview &&
          updateReviewStatus(
            selectedReview._id,
            "published",
            "Review published",
          )
        }
        onRemove={removeSelectedReview}
      />
    </div>
  );
}

export default AdminReviews;
