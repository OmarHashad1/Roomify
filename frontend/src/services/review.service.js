import api from "../utils/axios.js";

export const getMyReviews = () => api.get("/reviews/me");
export const createReview = (body) => api.post("/reviews", body);
export const deleteMyReview = (id) => api.delete(`/reviews/me/${id}`);
