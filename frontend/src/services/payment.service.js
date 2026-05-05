import api from "../utils/axios.js";

export const listPayments = ({ status } = {}) => {
  const params = {};
  if (status) params.status = status;
  return api.get("/payments/admin", { params });
};

export const getPaymentById = (id) => api.get(`/payments/admin/${id}`);
