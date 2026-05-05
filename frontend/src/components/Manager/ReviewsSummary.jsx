import { useState, useRef } from "react";

function ReviewsSummary({ reviews = [] }) {
  const [hoverPercentage, setHoverPercentage] = useState(null);
  const [toolipPosition, setTooltipPosition] = useState(0);
  const barRef = useRef(null);

  const total = reviews.length;
  const helpfulCount = reviews.filter((r) => r.helpful).length;
  const percentage = total
    ? Math.round((helpfulCount / total) * 100)
    : 0;

  const handleBarHover = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const calculatedPercentage = Math.round((x / rect.width) * 100);
    setHoverPercentage(calculatedPercentage);
    setTooltipPosition((x / rect.width) * 100);
  };

  const handleBarLeave = () => {
    setHoverPercentage(null);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg hover:-translate-y-2 transition-all duration-200">
      <h2 className="text-lg font-bold text-[#0F2A44] mb-2">
        Helpful Reviews
      </h2>

      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold text-[#1E6F9F]">
          {percentage}%
        </p>

        <p className="text-gray-500 text-sm">
          {helpfulCount} of {total} reviews
        </p>
      </div>

      <div className="relative w-full mt-4">
        <div 
          ref={barRef}
          className="w-full bg-gray-200 rounded-full h-3 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          onMouseMove={handleBarHover}
          onMouseLeave={handleBarLeave}
        >
          <div
            className="bg-[#1E6F9F] h-3 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {hoverPercentage !== null && (
          <div
            className="absolute -top-8 transform -translate-x-1/2 bg-white border border-gray-200 shadow-lg text-sm px-3 py-2 rounded-full whitespace-nowrap pointer-events-none flex items-center gap-2"
            style={{ left: `${toolipPosition}%` }}
          >
            <span className="w-2 h-2 rounded-full bg-[#1E6F9F]" />
            <span className="font-medium text-gray-800">{hoverPercentage}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewsSummary;
