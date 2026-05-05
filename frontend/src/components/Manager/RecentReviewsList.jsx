import { Link } from "react-router-dom";
import StarRating from "@/components/Manager/StarRating";

function RecentReviewsList({ reviews }) {
  const recent = [...reviews]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="bg-white border border-border rounded-lg p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">Recent Reviews</h3>
          <p className="text-xs text-muted-foreground">Latest guest feedback</p>
        </div>
        <Link
          to="/manager/reviews"
          className="text-xs text-primary hover:underline font-medium"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-4">
        {recent.map((r) => (
          <div
            key={r._id}
            className="border-b border-border last:border-0 pb-4 last:pb-0"
          >
            <div className="flex items-center justify-between mb-1.5">
              <StarRating rating={r.rating} />
              <span className="text-xs text-muted-foreground">
                {new Date(r.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <p className="text-sm text-foreground line-clamp-2">{r.comment}</p>
            <span className="inline-block mt-1.5 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full capitalize">
              {r.reviewType} review
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentReviewsList;
