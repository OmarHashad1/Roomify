import { useEffect, useState } from "react";
import { Star, MessageSquare, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import ReviewCard from "@/components/Customer/ReviewCard";
import { getMyReviews, deleteMyReview } from "@/services/review.service";

export default function ReviewsListPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getMyReviews()
      .then(({ data }) => setReviews(data.data))
      .catch((err) => {
        const status = err.response?.status;
        setError(
          status === 400 || status === 404
            ? "No reviews found."
            : "Something went wrong. Please try again.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
      <div className="relative h-20 bg-linear-to-r from-(--color-primary) to-[#1a6a96]">
        <div className="absolute -bottom-6 left-6">
          <div className="w-12 h-12 rounded-xl bg-white shadow-md border-2 border-white flex items-center justify-center">
            <Star size={20} className="text-(--color-primary)" />
          </div>
        </div>
      </div>

      <div className="px-6 pt-10 pb-6">
        <h2 className="font-bold text-gray-900 text-base">My Reviews</h2>
        <p className="text-xs text-gray-400 mt-0.5 mb-6">
          {reviews.length} review
          {reviews.length !== 1 ? "s" : ""} submitted
        </p>

        {loading ? (
          <div className="flex justify-center py-14">
            <Loader2 size={28} className="animate-spin text-gray-300" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <AlertCircle size={32} className="text-gray-200" />
            <p className="text-sm font-semibold text-gray-400">{error}</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <MessageSquare size={32} className="text-gray-200" />
            <p className="text-sm font-semibold text-gray-400">
              No reviews yet
            </p>
            <p className="text-xs text-gray-300">
              Your submitted reviews will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                hotelName={review.hotel?.name}
                onDelete={async (id) => {
                  try {
                    await deleteMyReview(id);
                    setReviews((prev) => prev.filter((r) => r._id !== id));
                    toast.success("Review deleted.");
                  } catch (err) {
                    const status = err.response?.status;
                    const msg = err.response?.data?.message;
                    toast.error(
                      status === 400 || status === 403 || status === 404
                        ? msg
                        : "Something went wrong. Please try again.",
                    );
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
