import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ReviewsSummary from "@/components/Manager/ReviewsSummary";
import ReviewsList from "@/components/Manager/ReviewsList";
import SuggestionsCard from "@/components/Manager/SuggestionsCard";
import PerformanceTrend from "@/components/Manager/PerformanceTrend";
import RatingBreakdown from "@/components/Manager/RatingBreakdown";
import ReviewDetailsPanel from "@/components/Manager/ReviewDetailsPanel";
import { getManagedHotelReviews } from "@/services/manager.service";

function ManagerReviews() {
  const [activeReview, setActiveReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadReviews = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getManagedHotelReviews();
        if (cancelled) return;
        setReviews(data);
      } catch (err) {
        if (cancelled) return;
        setError(err.response?.data?.message || err.message || "Failed to load reviews");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Loader2 size={32} className="animate-spin mb-3 opacity-40" />
        <p className="text-sm">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#2c72b4]">
          Manager Reviews
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Manage customer reviews and view suggestions for your hotel
        </p>
      </div>

      <ReviewsSummary reviews={reviews} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg hover:-translate-y-2 transition-all duration-200">
            <h2 className="text-lg font-bold text-[#0F2A44] mb-4">
              Customer Reviews
            </h2>
            <ReviewsList reviews={reviews} onOpen={setActiveReview} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <RatingBreakdown reviews={reviews} />
          <SuggestionsCard />
          <PerformanceTrend reviews={reviews} />
        </div>
      </div>

      <ReviewDetailsPanel
        review={activeReview}
        onClose={() => setActiveReview(null)}
      />
    </div>
  );
}

export default ManagerReviews;
