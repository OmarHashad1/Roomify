import { hotelModel } from "../../../models/Hotel/hotel.model.js";
import { roomTypeModel } from "../../../models/RoomType/roomType.model.js";
import { roomAvailabilityModel } from "../../../models/RoomAvailability/roomAvailability.model.js";

export const getHotels = async () =>
  hotelModel.find({ status: "active" }).select("_id name address").lean();

const toUTCDate = (dateStr) => {
  const [y, m, d] = String(dateStr).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

export const searchRooms = async ({
  location,
  checkIn,
  checkOut,
  adults,
  children,
  rooms,
}) => {
  const totalGuests = (Number(adults) || 1) + (Number(children) || 0);
  const roomsNeeded = Number(rooms) || 1;

  const hotelFilter = { status: "active" };
  if (location?.trim()) {
    const q = new RegExp(location.trim(), "i");
    hotelFilter.$or = [{ "address.city": q }, { name: q }];
  }

  const hotels = await hotelModel
    .find(hotelFilter)
    .select("_id name stars address photos amenities description")
    .lean();

  if (hotels.length === 0) return [];

  const hotelIds = hotels.map((h) => h._id);
  const hotelMap = Object.fromEntries(hotels.map((h) => [h._id.toString(), h]));

  let roomTypes = await roomTypeModel
    .find({
      hotel: { $in: hotelIds },
      status: "active",
      maxGuests: { $gte: totalGuests },
    })
    .lean();

  if (checkIn && checkOut) {
    const checkInDate = toUTCDate(checkIn);
    const checkOutDate = toUTCDate(checkOut);
    const nightCount = Math.round((checkOutDate - checkInDate) / 86_400_000);

    if (nightCount > 0) {
      const availableGroups = await roomAvailabilityModel.aggregate([
        {
          $match: {
            roomType: { $in: roomTypes.map((r) => r._id) },
            date: { $gte: checkInDate, $lt: checkOutDate },
            availableCount: { $gte: roomsNeeded },
          },
        },
        { $group: { _id: "$roomType", count: { $sum: 1 } } },
        { $match: { count: { $gte: nightCount } } },
      ]);

      const availableIds = new Set(
        availableGroups.map((g) => g._id.toString()),
      );
      roomTypes = roomTypes.filter((r) => availableIds.has(r._id.toString()));
    }
  } else {
    // No dates given — show any room that has at least one future availability record
    const now = new Date();
    const roomIdsWithFutureAvailability = await roomAvailabilityModel.distinct(
      "roomType",
      {
        roomType: { $in: roomTypes.map((r) => r._id) },
        date: { $gte: now },
        availableCount: { $gte: roomsNeeded },
      },
    );
    const availableIds = new Set(roomIdsWithFutureAvailability.map(String));
    roomTypes = roomTypes.filter((r) => availableIds.has(r._id.toString()));
  }

  return roomTypes.map((room) => ({
    room,
    hotel: hotelMap[room.hotel.toString()],
  }));
};
