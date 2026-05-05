import { useEffect, useState } from "react";
import { LogContext } from "./LogContext";
import { getAllLogs } from "@/services/admin.service";
import { useAuth } from "@/context/user/UserContext";

export const LogProvider = ({ children }) => {
  const { loggedInUser } = useAuth();
  const isAdmin = loggedInUser?.role === "admin";
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    if (!isAdmin) return;

    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllLogs();
      setLogs(data.data.logs);
      setSummary(data.data.totalLogsCount);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      setLogs([]);
      setSummary({});
      setError(null);
      setLoading(false);
      return;
    }

    fetchLogs();
  }, [isAdmin]);

  return (
    <LogContext.Provider
      value={{ logs, summary, loading, error, refresh: fetchLogs }}
    >
      {children}
    </LogContext.Provider>
  );
};
