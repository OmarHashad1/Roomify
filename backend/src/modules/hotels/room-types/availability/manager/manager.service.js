import { roomTypeModel } from "../../../../../models/RoomType/roomType.model.js";
import { hotelModel } from "../../../../../models/Hotel/hotel.model.js";
import { roomAvailabilityModel } from "../../../../../models/RoomAvailability/roomAvailability.model.js";
import { logger } from "../../../../../utils/winston.utils.js";
import { logActorTypes } from "../../../../../enums/log.enums.js";
import { makeError } from "../../../../../utils/errorMaker.util.js";

export const setRoomAvailability = async (managerId, data) => {
  const { roomType: roomTypeId, date, availableCount } = data;

  if (!roomTypeId || !date || availableCount === undefined) {
    throw makeError("roomType, date and availableCount are required", 400);
  }

  const normalizedCount =
    typeof availableCount === "string"
      ? Number(availableCount)
      : availableCount;

  const normalizedDate = new Date(date);

  if (isNaN(normalizedDate.getTime())) {
    throw makeError("Invalid date format", 400);
  }

  if (isNaN(normalizedCount) || normalizedCount < 0) {
    throw makeError("availableCount must be a non-negative number", 400);
  }

  const roomType = await roomTypeModel.findById(roomTypeId);

  if (!roomType) {
    logger.warn(
      `Availability set failed — room type not found: ${roomTypeId}`,
      {
        action: "ROOM_AVAILABILITY_SET_FAILED",
        targetId: roomTypeId,
        actor: { type: logActorTypes.USER, id: managerId },
      },
    );

    throw makeError("Room type not found", 404);
  }

  const hotel = await hotelModel.findById(roomType.hotel);

  if (!hotel) {
    logger.warn(
      `Availability set failed — hotel not found: ${roomType.hotel}`,
      {
        action: "ROOM_AVAILABILITY_SET_FAILED",
        targetId: roomTypeId,
        actor: { type: logActorTypes.USER, id: managerId },
      },
    );

    throw makeError("Hotel not found", 404);
  }

  if (hotel.owner.toString() !== managerId.toString()) {
    logger.warn(
      `Availability set failed — unauthorized: managerId=${managerId}, roomTypeId=${roomType._id}`,
      {
        action: "ROOM_AVAILABILITY_SET_FAILED",
        targetId: roomTypeId,
        actor: { type: logActorTypes.USER, id: managerId },
      },
    );

    throw makeError("Unauthorized to manage this room type", 403);
  }

  if (normalizedCount > hotel.numberOfRooms) {
    throw makeError("Available count cannot exceed total hotel rooms", 400);
  }

  const existing = await roomAvailabilityModel.findOne({
    roomType: roomType._id,
    date: normalizedDate,
  });

  if (existing) {
    logger.warn(
      `Availability set failed — already exists: roomTypeId=${roomType._id}, date=${normalizedDate.toISOString()}`,
      {
        action: "ROOM_AVAILABILITY_SET_FAILED",
        targetId: roomType._id,
        actor: { type: logActorTypes.USER, id: managerId },
      },
    );

    throw makeError(
      "Availability already exists for this room type on this date",
      409,
    );
  }

  const availability = await roomAvailabilityModel.create({
    roomType: roomType._id,
    date: normalizedDate,
    availableCount: normalizedCount,
  });

  logger.info(
    `Room availability set: managerId=${managerId}, roomTypeId=${roomType._id}, date=${normalizedDate.toISOString()}, count=${normalizedCount}`,
    {
      action: "ROOM_AVAILABILITY_SET",
      targetId: availability._id,
      actor: { type: logActorTypes.USER, id: managerId },
    },
  );

  return availability;
};

export const updateAvailabilityByDate = async (managerId, date, data = {}) => {
  const { roomType: roomTypeId, availableCount } = data;

  if (!roomTypeId || availableCount === undefined) {
    throw makeError("roomType and availableCount are required", 400);
  }

  const normalizedDate = new Date(date);
  if (isNaN(normalizedDate.getTime())) {
    throw makeError("Invalid date format", 400);
  }

  const normalizedCount =
    typeof availableCount === "string"
      ? Number(availableCount)
      : availableCount;

  if (isNaN(normalizedCount) || normalizedCount < 0) {
    throw makeError("availableCount must be a non-negative number", 400);
  }

  const roomType = await roomTypeModel.findById(roomTypeId);
  if (!roomType) {
    throw makeError("Room type not found", 404);
  }

  const hotel = await hotelModel.findById(roomType.hotel);
  if (!hotel) {
    throw makeError("Hotel not found", 404);
  }

  if (hotel.owner.toString() !== managerId.toString()) {
    throw makeError("Unauthorized user", 403);
  }

  const availability = await roomAvailabilityModel.findOne({
    roomType: roomTypeId,
    date: normalizedDate,
  });

  if (!availability) {
    logger.warn(
      `Availability update failed — record not found: roomTypeId=${roomTypeId}, date=${normalizedDate.toISOString()}`,
      {
        action: "ROOM_AVAILABILITY_UPDATE_FAILED",
        targetId: roomTypeId,
        actor: { type: logActorTypes.USER, id: managerId },
      },
    );

    throw makeError("Availability record not found for this date", 404);
  }

  if (normalizedCount > hotel.numberOfRooms) {
    throw makeError("Available count cannot exceed total hotel rooms", 400);
  }

  if (availability.availableCount === normalizedCount) {
    throw makeError("Availability already has this count", 400);
  }

  availability.availableCount = normalizedCount;
  await availability.save();

  logger.info(
    `Availability updated: managerId=${managerId}, roomTypeId=${roomTypeId}, date=${normalizedDate.toISOString()}`,
    {
      action: "ROOM_AVAILABILITY_UPDATED",
      targetId: availability._id,
      actor: { type: logActorTypes.USER, id: managerId },
    },
  );

  return availability;
};
