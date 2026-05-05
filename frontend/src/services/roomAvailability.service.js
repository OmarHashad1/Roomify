import api from "../utils/axios.js";

const BASE = "/hotels/room-types/availability/manager";

export const setRoomAvailability = ({ roomType, date, availableCount }) =>
  api.post(`${BASE}/`, { roomType, date, availableCount });

export const updateAvailabilityByDate = (date, { roomType, availableCount }) =>
  api.patch(`${BASE}/${date}`, { roomType, availableCount });
