import { roomTypeModel } from "../../../models/RoomType/roomType.model.js";
import { roomAvailabilityModel } from "../../../models/RoomAvailability/roomAvailability.model.js";

const toUTCDate = (dateStr) => {
  const [y, m, d] = String(dateStr).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

export const getRoomTypeById = async (id) => {
  const roomType = await roomTypeModel
    .findById(id)
    .populate("hotel", "name stars address phone email amenities checkInTime checkOutTime photos")
    .lean();

  if (!roomType) throw new Error("Room type not found");
  return roomType;
};

export const getRoomTypesByHotel = async (hotelId, checkIn, checkOut) => {
  const rooms = await roomTypeModel.find({ hotel: hotelId, status: "active" }).lean();

  if (!checkIn || !checkOut) return rooms;

  const checkInDate = toUTCDate(checkIn);
  const checkOutDate = toUTCDate(checkOut);
  const nights = Math.ceil((checkOutDate - checkInDate) / 86_400_000);

  if (nights <= 0) return rooms;

  const roomIds = rooms.map((r) => r._id);

  const availabilityDocs = await roomAvailabilityModel
    .find({
      roomType: { $in: roomIds },
      date: { $gte: checkInDate, $lt: checkOutDate },
      availableCount: { $gte: 1 },
    })
    .lean();

  const availableNightsMap = {};
  for (const doc of availabilityDocs) {
    const key = String(doc.roomType);
    availableNightsMap[key] = (availableNightsMap[key] || 0) + 1;
  }

  return rooms.filter((r) => (availableNightsMap[String(r._id)] || 0) >= nights);
};
