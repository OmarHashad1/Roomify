import { useEffect, useState } from "react";
import { PaymentContext } from "./PaymentContext";
import { listPayments } from "@/services/payment.service";
import { useAuth } from "@/context/user/UserContext";

export const PaymentProvider = ({ children }) => {
  const { loggedInUser } = useAuth();
  const isAdmin = loggedInUser?.role === "admin";
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    refunded: 0,
    totalRevenue: 0,
    pendingAmount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    if (!isAdmin) return;

    setLoading(true);
    setError(null);
    try {
      const { data } = await listPayments();
      setPayments(data.data.payments);
      setSummary(data.data.summary);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      setPayments([]);
      setSummary({
        total: 0,
        completed: 0,
        pending: 0,
        refunded: 0,
        totalRevenue: 0,
        pendingAmount: 0,
      });
      setError(null);
      setLoading(false);
      return;
    }

    fetchPayments();
  }, [isAdmin]);

  return (
    <PaymentContext.Provider
      value={{ payments, summary, loading, error, refresh: fetchPayments }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
