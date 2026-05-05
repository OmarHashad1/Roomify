import { useState } from "react";
import { Flag } from "lucide-react";
import ReportReasons from "./ReportReasons";

function ReviewCard({ review, onOpen }) {
  const [showReport, setShowReport] = useState(false);

  return (
    <div
      className="bg-white rounded-xl shadow p-5 hover:bg-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-200 cursor-pointer"
      onClick={() => onOpen?.(review)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-[#0F2A44]">
            {review.name}
          </h3>
          <p className="text-sm text-gray-500">
            ⭐ {review.rating} Stars
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowReport(!showReport);
          }}
          className="text-[#1E6F9F] flex items-center gap-1 hover:bg-blue-100 transition-colors duration-200 cursor-pointer rounded-md px-2 py-1"
        >
          <Flag size={20} /> Report
        </button>
      </div>

      <p className="mt-3 text-gray-700">
        {review.comment}
      </p>

      {showReport && (
        <ReportReasons onClose={() => setShowReport(false)} />
      )}
    </div>
  );
}

export default ReviewCard;
