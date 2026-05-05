import { useCallback, useState } from "react";
import { RoomAvailabilityContext } from "./RoomAvailabilityContext";
import {
  setRoomAvailability,
  updateAvailabilityByDate,
} from "@/services/roomAvailability.service";

export const RoomAvailabilityProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createAvailability = useCallback(
    async ({ roomType, date, availableCount }) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await setRoomAvailability({
          roomType,
          date,
          availableCount,
        });
        return data.data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to create availability");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateAvailability = useCallback(
    async (date, { roomType, availableCount }) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await updateAvailabilityByDate(date, {
          roomType,
          availableCount,
        });
        return data.data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to update availability");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return (
    <RoomAvailabilityContext.Provider
      value={{ loading, error, createAvailability, updateAvailability }}
    >
      {children}
    </RoomAvailabilityContext.Provider>
  );
};
