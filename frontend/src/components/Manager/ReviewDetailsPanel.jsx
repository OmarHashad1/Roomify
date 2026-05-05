import { useState } from "react";
import { X, Flag } from "lucide-react";
import ReportReasons from "./ReportReasons";

function ReviewDetailsPanel({ review, onClose }) {
  const [showReport, setShowReport] = useState(false);
  const isOpen = Boolean(review);

  const openReport = () => setShowReport(true);
  const closeReport = () => setShowReport(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 opacity-100"
        onClick={onClose}
      />

      <div
        className="absolute top-8 right-8 bottom-8 w-96 max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-transform duration-300 ease-in-out translate-x-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Review Metadata
            </p>
            <h2 className="text-base font-bold text-gray-800">Review Details</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {review && (
          <div className="p-5 space-y-4 overflow-y-auto h-full">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Review ID
              </p>
              <p className="text-sm font-medium text-gray-800">{review.id}</p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Sender
              </p>
              <p className="text-sm font-medium text-gray-800">{review.name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Rating
              </p>
              <p className="text-sm font-medium text-gray-800">{review.rating} ★</p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Helpful
              </p>
              <p className="text-sm font-medium text-gray-800">
                {review.helpful ? "Yes" : "No"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Comment
              </p>
              <p className="text-sm text-gray-600">{review.comment}</p>
            </div>

            <button
              onClick={openReport}
              className="w-full mt-4 px-4 py-2 bg-[#1E6F9F] text-white rounded-lg hover:bg-[#155a80] transition-colors"
            >
              <div className="flex items-center justify-center gap-2">
                <Flag size={16} />
                Report Review
              </div>
            </button>

            {showReport && <ReportReasons onClose={closeReport} />}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewDetailsPanel;
