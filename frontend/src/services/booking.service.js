import api from "../utils/axios.js";

export const getBookingDetails = (bookingId) => api.get(`/bookings/${bookingId}`);
export const getMyBookings = () => api.get("/bookings/me");
