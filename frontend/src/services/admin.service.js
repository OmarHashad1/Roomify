import api from "../utils/axios.js";

export const getAllUsers = () => api.get("/admin/users");
export const getUserById = (userId) => api.get(`/admin/users/${userId}`);
export const forceLogoutUser = (userId) =>
  api.patch(`/admin/users/${userId}/force-logout`);
export const updateUserStatus = (userId, status) =>
  api.patch(`/admin/users/${userId}/status`, { status });

export const getAllReviews = () => api.get("/admin/reviews");
export const updateReviewStatus = (reviewId, status) =>
  api.patch(`/admin/reviews/${reviewId}/status`, { status });

export const getAllBookings = () => api.get("/admin/bookings");
export const getBookingById = (bookingId) =>
  api.get(`/admin/bookings/${bookingId}`);

export const getAllLogs = () => api.get("/admin/logs");
