import api from "../utils/axios.js";

export const submitHotelApplication = (values) => {
  const formData = new FormData();

  formData.append("firstName",     values.firstName);
  formData.append("lastName",      values.lastName);
  formData.append("email",         values.email);
  formData.append("phone",         values.phone);
  formData.append("hotelName",     values.hotelName);
  formData.append("stars",         values.stars);
  formData.append("street",        values.street);
  formData.append("city",          values.city);
  formData.append("country",   values.country);
  formData.append("numberOfRooms", values.numberOfRooms);
  formData.append("description",   values.description);

  values.documents.forEach((file) => formData.append("documents", file));

  return api.post("/hotel-applications", formData);
};

export const getApplicationById = (id) => api.get(`/hotel-applications/admin/${id}`);
export const updateApplicationStatus = (id, body) => api.patch(`/hotel-applications/admin/${id}`, body);

export const listApplications = ({ status } = {}) => {
  const params = {};
  if (status) params.status = status;
  return api.get("/hotel-applications/admin", { params });
};
