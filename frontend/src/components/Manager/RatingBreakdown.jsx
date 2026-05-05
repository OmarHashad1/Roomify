function RatingBreakdown({ reviews }) {
  const counts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
  }));

  const max = Math.max(...counts.map((c) => c.count), 1);

  return (
    <div className="bg-white rounded-xl shadow p-6 min-h-80 hover:bg-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-200">
      <h2 className="text-lg font-bold text-[#0F2A44] mb-4">Rating Breakdown</h2>

      <div className="space-y-8">
        {counts.map(({ rating, count }) => (
          <div key={rating} className="flex items-center gap-3">
            <span className="w-10 text-sm font-medium text-gray-700">
              {rating}★
            </span>

            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1E6F9F]"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>

            <span className="w-6 text-right text-sm font-semibold text-gray-700">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RatingBreakdown;
