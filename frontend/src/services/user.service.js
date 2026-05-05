import api from "../utils/axios.js";

export const getProfile = () => api.get("/users/profile");
export const updateProfile = (body) => api.patch("/users/profile", body);
export const changePassword = (body) =>
  api.patch("/users/profile/password", body);
