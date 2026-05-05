import { useEffect, useState } from "react";
import { HotelContext } from "./HotelContext";
import { listHotels } from "@/services/hotel.service";
import { useAuth } from "@/context/user/UserContext";

export function HotelProvider({ children }) {
  const { loggedInUser } = useAuth();
  const isAdmin = loggedInUser?.role === "admin";
  const [hotels, setHotels] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    under_review: 0,
    suspended: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHotels = async () => {
    if (!isAdmin) return;

    setLoading(true);
    setError(null);
    try {
      const { data } = await listHotels();
      setHotels(data.data.hotels);
      setSummary(data.data.summary);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load hotels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      setHotels([]);
      setSummary({ total: 0, active: 0, under_review: 0, suspended: 0 });
      setError(null);
      setLoading(false);
      return;
    }

    fetchHotels();
  }, [isAdmin]);

  return (
    <HotelContext
      value={{ hotels, summary, loading, error, refresh: fetchHotels }}
    >
      {children}
    </HotelContext>
  );
}
