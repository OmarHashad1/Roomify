import { Link } from "react-router-dom";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ReviewContext } from "@/context/review/ReviewContext";
import { UserContext } from "@/context/user/UserContext";
import { HotelContext } from "@/context/hotel/HotelContext";
import { ArrowRight, Star, UserCircle } from "lucide-react";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={11}
          className={
            i <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-100 text-gray-200"
          }
        />
      ))}
    </div>
  );
}

export function RecentReviewsTable() {
  const navigate = useNavigate();
  const { reviews = [] } = useContext(ReviewContext) || {};
  const { users = [] } = useContext(UserContext) || {};
  const { hotels = [] } = useContext(HotelContext) || {};
  const reviewList = Array.isArray(reviews) ? reviews : [];

  const userMap = Object.fromEntries(users.map((u) => [u._id, u]));
  const hotelMap = Object.fromEntries(hotels.map((h) => [h._id, h]));

  const recent = [...reviewList]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700">Recent Reviews</h2>
        <Link
          to="/admin/reviews"
          className="flex items-center gap-1 text-xs font-medium transition-colors"
          style={{ color: "var(--color-primary)" }}
        >
          Show all <ArrowRight size={13} />
        </Link>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="px-5 py-3 text-left font-medium">User</th>
              <th className="px-5 py-3 text-left font-medium">Comment</th>
              <th className="px-5 py-3 text-left font-medium">Hotel</th>
              <th className="px-5 py-3 text-left font-medium">Rating</th>
              <th className="px-5 py-3 text-left font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((review) => {
              const customerId =
                typeof review.customer === "string"
                  ? review.customer
                  : review.customer?._id;
              const hotelId =
                typeof review.hotel === "string"
                  ? review.hotel
                  : review.hotel?._id;
              const user = userMap[customerId] || review.customer;
              const hotel = hotelMap[hotelId] || review.hotel;
              return (
                <tr
                  key={review._id}
                  onClick={() => navigate(`/admin/reviews/${review._id}`)}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <UserCircle size={15} className="text-gray-400" />
                      </div>
                      {user ? (
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate cursor-pointer transition-colors group-hover:text-(--color-primary)">
                            {`${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                              "Unknown"}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {user.email || "—"}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">Unknown</p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 max-w-xs">
                    <p className="text-gray-700 truncate">{review.comment}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-gray-600 truncate max-w-36">
                      {hotel?.name ?? "—"}
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <StarRating rating={review.rating} />
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {new Date(review.createdAt).toLocaleDateString("en", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
