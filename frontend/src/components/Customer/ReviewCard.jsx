import { useState } from "react";
import { Star, Trash2, Loader2 } from "lucide-react";
import { humanize } from "@/utils/util";

export default function ReviewCard({ review, hotelName, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const date = new Date(review.createdAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(review._id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <Star size={15} className="text-(--color-primary)" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-800">{hotelName || "Unknown Hotel"}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={11} className={s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
                ))}
              </div>
              <span className="text-[11px] text-gray-400">{date}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                ${review.status === "published" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                {humanize(review.status)}
              </span>
            </div>
          </div>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-gray-300 hover:text-red-500 transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:hover:text-gray-300"
          >
            {deleting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Trash2 size={15} />
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">{review.comment}</p>
      </div>
    </div>
  );
}
