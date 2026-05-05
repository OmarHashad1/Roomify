import { useContext, useState } from "react";
import { Star, Trash2, MessageSquare } from "lucide-react";
import { toast, Toaster } from "sonner";
import { UserContext } from "@/context/user/UserContext";
import { ReviewContext } from "@/context/review/ReviewContext";
import { HotelContext } from "@/context/hotel/HotelContext";

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          className={
            s <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-gray-200 fill-gray-200"
          }
        />
      ))}
    </div>
  );
}

export default function MyReviews() {
  const { loggedInUser } = useContext(UserContext) || {};
  const { reviews: reviewsRaw = [] } = useContext(ReviewContext) || {};
  const { hotels = [] } = useContext(HotelContext) || {};

  const [reviews, setReviews] = useState(reviewsRaw);

  const userReviews = reviews.filter((r) => r.customer === loggedInUser?._id);

  const hotelMap = hotels.reduce((acc, h) => {
    acc[h._id] = h;
    return acc;
  }, {});

  function handleDelete(id) {
    setReviews((prev) => prev.filter((r) => r._id !== id));
    toast.success("Review deleted.");
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <Toaster richColors position="top-right" />

      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">My Reviews</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {userReviews.length} review{userReviews.length !== 1 ? "s" : ""}{" "}
            submitted
          </p>
        </div>

        {userReviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col items-center justify-center py-20 gap-3">
            <MessageSquare size={36} className="text-gray-200" />
            <p className="text-sm font-semibold text-gray-400">
              No reviews yet
            </p>
            <p className="text-xs text-gray-300">
              Your submitted reviews will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {userReviews.map((review) => {
              const hotel = hotelMap[review.hotel];
              const date = new Date(review.createdAt).toLocaleDateString(
                "en-GB",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                },
              );

              return (
                <div
                  key={review._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-xs px-5 py-4 flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-(--color-primary)/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Star size={16} className="text-(--color-primary)" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {hotel?.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarRow rating={review.rating} />
                          <span className="text-[11px] text-gray-400">
                            {date}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                            ${review.status === "published" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}
                          >
                            {review.status}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(review._id)}
                        className="text-gray-300 hover:text-red-500 transition-colors shrink-0 mt-0.5 cursor-pointer"
                      >
                        <Trash2 className="cursor-pointer" size={15} />
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">
                      {review.comment}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
