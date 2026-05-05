import { useEffect, useState } from "react";
import { BookingContext } from "./BookingContext";
import { getAllBookings } from "@/services/admin.service";
import { useAuth } from "@/context/user/UserContext";

export const BookingProvider = ({ children }) => {
  const { loggedInUser } = useAuth();
  const isAdmin = loggedInUser?.role === "admin";
  const [bookings, setBookings] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    if (!isAdmin) return;

    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllBookings();
      setBookings(data.data.bookings);
      setSummary(data.data.totalBookingsCount);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      setBookings([]);
      setSummary({});
      setError(null);
      setLoading(false);
      return;
    }

    fetchBookings();
  }, [isAdmin]);

  return (
    <BookingContext.Provider
      value={{ bookings, summary, loading, error, refresh: fetchBookings }}
    >
      {children}
    </BookingContext.Provider>
  );
};
