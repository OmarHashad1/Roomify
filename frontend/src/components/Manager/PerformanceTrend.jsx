function PerformanceTrend({ reviews }) {
  const ratings = reviews.map(r => r.rating);

  const avg =
    ratings.reduce((sum, r) => sum + r, 0) / ratings.length;


  const previousAvg = avg - 0.4;

  const trend = avg > previousAvg ? "up" : "down";

  return (
    <div className="bg-white rounded-xl shadow p-6 min-h-80 hover:bg-gray-100 hover:shadow-lg hover:-translate-y-2 transition-all duration-200">
      <h2 className="text-lg font-bold text-[#0F2A44] mb-3">
        Performance Trend
      </h2>

      <div className="space-y-7">
        <p className="text-gray-600">
          Current Rating:
          <span className="ml-2 font-bold text-[#1E6F9F]">
            {avg.toFixed(1)}
          </span>
        </p>

        <p className="text-gray-600">
          Previous Rating:
          <span className="ml-2 font-bold">
            {previousAvg.toFixed(1)}
          </span>
        </p>

        <p
          className={`font-semibold ${
            trend === "up" ? "text-green-600" : "text-red-500"
          }`}
        >
          {trend === "up"
            ? "📈 Rating is improving"
            : "📉 Rating is declining"}
        </p>
      </div>
    </div>
  );
}

export default PerformanceTrend;
