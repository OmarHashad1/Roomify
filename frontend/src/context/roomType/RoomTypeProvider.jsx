import { useEffect, useState } from "react";
import { RoomTypeContext } from "./RoomTypeContext";
import { getMyHotelRoomTypes } from "@/services/roomType.service";
import { useAuth } from "@/context/user/UserContext";

export function RoomTypeProvider({ children }) {
  const { loggedInUser } = useAuth();
  const isManager = loggedInUser?.role === "hotel_manager";
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRooms = async () => {
    if (!isManager) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getMyHotelRoomTypes();
      setRooms(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isManager) {
      setRooms([]);
      setError(null);
      setLoading(false);
      return;
    }
    fetchRooms();
  }, [isManager]);

  return (
    <RoomTypeContext.Provider
      value={{ rooms, loading, error, refresh: fetchRooms }}
    >
      {children}
    </RoomTypeContext.Provider>
  );
}
