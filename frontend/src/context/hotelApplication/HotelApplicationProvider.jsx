import { useEffect, useState } from "react";
import { HotelApplicationContext } from "./HotelApplicationContext";
import { listApplications } from "@/services/hotelApplication.service";
import { useAuth } from "@/context/user/UserContext";

export const HotelApplicationProvider = ({ children }) => {
  const { loggedInUser } = useAuth();
  const isAdmin = loggedInUser?.role === "admin";
  const [applications, setApplications] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    under_review: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      setApplications([]);
      setSummary({ total: 0, under_review: 0, approved: 0, rejected: 0 });
      setLoading(false);
      return;
    }

    setLoading(true);
    listApplications()
      .then(({ data }) => {
        setApplications(data.data.applications);
        setSummary(data.data.summary);
      })
      .catch((err) => {
        console.error(
          "Failed to load applications:",
          err.response?.data || err.message,
        );
        setApplications([]);
        setSummary({ total: 0, under_review: 0, approved: 0, rejected: 0 });
      })
      .finally(() => setLoading(false));
  }, [isAdmin]);

  return (
    <HotelApplicationContext.Provider
      value={{ applications, summary, loading }}
    >
      {children}
    </HotelApplicationContext.Provider>
  );
};
