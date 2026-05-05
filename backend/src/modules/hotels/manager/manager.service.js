import { hotelModel } from "../../../models/Hotel/hotel.model.js";
import { bookingModel } from "../../../models/Booking/booking.model.js";
import { makeError } from "../../../utils/errorMaker.util.js";
import { logger } from "../../../utils/winston.utils.js";
import { logActorTypes } from "../../../enums/log.enums.js";

export const listManagerHotels = async ({ managerId }) => {
  const hotels = await hotelModel
    .find({ owner: managerId })
    .sort({ createdAt: -1 })
    .lean();

  return hotels;
};

export const getHotelDetailsByManager = async ({ hotelId, managerId }) => {
  const hotel = await hotelModel.findById(hotelId).lean();

  if (!hotel) {
    logger.warn(
      `Hotel fetch failed — hotel not found: hotelId=${hotelId}`,
      {
        action: "HOTEL_FETCH_FAILED",
        targetId: hotelId,
        actor: { type: logActorTypes.USER, id: managerId },
      },
    );
    throw makeError("Hotel not found", 404);
  }

  if (hotel.owner.toString() !== managerId) {
    logger.warn(
      `Hotel fetch forbidden — manager does not own hotel: managerId=${managerId}, hotelId=${hotelId}`,
      {
        action: "HOTEL_FETCH_FORBIDDEN",
        targetId: hotelId,
        actor: { type: logActorTypes.USER, id: managerId },
      },
    );
    throw makeError("You are not allowed to view this hotel", 403);
  }

  return hotel;
};

export const updateHotelByManager = async ({ hotelId, managerId, updateData }) => {
  const hotel = await hotelModel.findById(hotelId);

  if (!hotel) {
    logger.warn(`Hotel update failed — hotel not found: hotelId=${hotelId}`, {
      action: "HOTEL_UPDATE_FAILED",
      targetId: hotelId,
      actor: { type: logActorTypes.USER, id: managerId },
    });
    throw makeError("Hotel not found", 404);
  }

  if (hotel.owner.toString() !== managerId) {
    logger.warn(
      `Hotel update forbidden — manager does not own hotel: managerId=${managerId}, hotelId=${hotelId}`,
      {
        action: "HOTEL_UPDATE_FORBIDDEN",
        targetId: hotelId,
        actor: { type: logActorTypes.USER, id: managerId },
      },
    );
    throw makeError("You are not allowed to update this hotel", 403);
  }

  const filteredUpdates = {};
  const keys = [
    "name",
    "description",
    "stars",
    "phone",
    "email",
    "address",
    "photos",
    "amenities",
    "numberOfRooms",
  ];

  const normalize = (key, value) => {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (key === "email") return trimmed.toLowerCase();
      return trimmed;
    }
    if (Array.isArray(value)) {
      return value
        .map((item) => (typeof item === "string" ? item.trim() : item))
        .filter((item) => item !== "");
    }
    return value;
  };

  keys.forEach((key) => {
    if (typeof updateData[key] === "undefined") return;
    const nextValue = normalize(key, updateData[key]);
    const currentValue = normalize(key, hotel[key]);

    if (Array.isArray(nextValue) || Array.isArray(currentValue)) {
      if (JSON.stringify(nextValue) !== JSON.stringify(currentValue)) {
        filteredUpdates[key] = nextValue;
      }
      return;
    }

    if (nextValue !== currentValue) {
      filteredUpdates[key] = nextValue;
    }
  });

  if (Object.keys(filteredUpdates).length === 0) {
    logger.warn(
      `Hotel update failed — no changes provided: managerId=${managerId}, hotelId=${hotelId}`,
      {
        action: "HOTEL_UPDATE_FAILED",
        targetId: hotelId,
        actor: { type: logActorTypes.USER, id: managerId },
      },
    );
    throw makeError("No valid changes provided", 400);
  }

  const updatedHotel = await hotelModel.findByIdAndUpdate(
    hotelId,
    { ...filteredUpdates, updatedAt: Date.now() },
    { new: true, runValidators: true },
  );

  logger.info(`Hotel updated: managerId=${managerId}, hotelId=${hotelId}`, {
    action: "HOTEL_UPDATED",
    targetId: hotelId,
    actor: { type: logActorTypes.USER, id: managerId },
  });

  return {
    changes: filteredUpdates,
    hotel: updatedHotel,
  };
};

export const listHotelBookingsByManager = async ({
  hotelId,
  managerId,
  status,
}) => {
  const hotel = await hotelModel.findById(hotelId);

  if (!hotel) {
    logger.warn(`Hotel bookings fetch failed — hotel not found: hotelId=${hotelId}`, {
      action: "HOTEL_BOOKINGS_FETCH_FAILED",
      targetId: hotelId,
      actor: { type: logActorTypes.USER, id: managerId },
    });
    throw makeError("Hotel not found", 404);
  }

  if (hotel.owner.toString() !== managerId) {
    logger.warn(
      `Hotel bookings fetch forbidden — manager does not own hotel: managerId=${managerId}, hotelId=${hotelId}`,
      {
        action: "HOTEL_BOOKINGS_FETCH_FORBIDDEN",
        targetId: hotelId,
        actor: { type: logActorTypes.USER, id: managerId },
      },
    );
    throw makeError("You are not allowed to view bookings for this hotel", 403);
  }

  const filter = { hotel: hotelId };
  if (status) filter.status = status;

  const bookings = await bookingModel
    .find(filter)
    .sort({ createdAt: -1 })
    .populate("customer", "firstName lastName email phone")
    .populate("roomType", "type view mainPhoto")
    .lean();

  logger.info(
    `Hotel bookings fetched: managerId=${managerId}, hotelId=${hotelId}, count=${bookings.length}`,
    {
      action: "HOTEL_BOOKINGS_FETCHED",
      targetId: hotelId,
      actor: { type: logActorTypes.USER, id: managerId },
    },
  );

  return bookings;
};
