import api from "../utils/axios.js";

export const searchRooms = (params) => api.get("/hotels/search/rooms", { params });
