import api from "../utils/axios.js";

export const listHotels = ({ status } = {}) => {
  const params = {};
  if (status) params.status = status;
  return api.get("/hotels/admin", { params });
};

export const getHotelById = (id) => api.get(`/hotels/admin/${id}`);

export const updateHotelStatus = (id, status) =>
  api.patch(`/hotels/admin/${id}/status`, { status });
