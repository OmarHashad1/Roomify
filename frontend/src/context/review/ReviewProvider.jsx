import { useEffect, useState } from "react";
import { ReviewContext } from "./ReviewContext";
import { getAllReviews } from "@/services/admin.service";
import { useAuth } from "@/context/user/UserContext";

export const ReviewProvider = ({ children }) => {
  const { loggedInUser } = useAuth();
  const isAdmin = loggedInUser?.role === "admin";
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    if (!isAdmin) return;

    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllReviews();
      setReviews(data.data.reviews);
      setSummary(data.data.totalReviewsCount);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      setReviews([]);
      setSummary({});
      setError(null);
      setLoading(false);
      return;
    }

    fetchReviews();
  }, [isAdmin]);

  return (
    <ReviewContext.Provider
      value={{ reviews, summary, loading, error, refresh: fetchReviews }}
    >
      {children}
    </ReviewContext.Provider>
  );
};
