import { roomTypeModel } from "../../../../models/RoomType/roomType.model.js";
import { hotelModel } from "../../../../models/Hotel/hotel.model.js";
import { logger } from "../../../../utils/winston.utils.js";
import { logActorTypes } from "../../../../enums/log.enums.js";
import { makeError } from "../../../../utils/errorMaker.util.js";
import { roomTypeStatuses } from "../../../../enums/roomType.enums.js";

export const listManagerRoomTypes = async ({ managerId, hotelId, status }) => {
  const hotel = await hotelModel.findById(hotelId);

  if (!hotel) {
    throw makeError("Hotel not found", 404);
  }

  if (hotel.owner.toString() !== managerId.toString()) {
    throw makeError("Unauthorized to view room types for this hotel", 403);
  }

  const filter = { hotel: hotelId };

  if (status) {
    const normalizedStatus =
      typeof status === "string" ? status.toLowerCase().trim() : status;

    if (!Object.values(roomTypeStatuses).includes(normalizedStatus)) {
      throw makeError("Invalid status value", 400);
    }

    filter.status = normalizedStatus;
  }

  return roomTypeModel.find(filter).sort({ createdAt: -1 }).lean();
};

export const createNewRoomType = async ({ managerId, roomTypeData }) => {
  const {
    hotel,
    type,
    description,
    mainPhoto,
    photos,
    view,
    bedroomCount,
    pricePerNight,
    maxGuests,
    smokingAllowed,
    amenities,
    status,
  } = roomTypeData;

  if (
    !hotel ||
    !type ||
    !description ||
    !mainPhoto ||
    bedroomCount === undefined ||
    pricePerNight === undefined ||
    maxGuests === undefined
  ) {
    throw makeError("Missing required fields", 400);
  }

  const existingHotel = await hotelModel.findById(hotel);

  if (!existingHotel) {
    logger.warn(`Room type creation failed - hotel not found: ${hotel}`, {
      action: "ROOM_TYPE_CREATE_FAILED",
      targetId: hotel,
      actor: {
        type: logActorTypes.USER,
        id: managerId,
      },
    });

    throw makeError("Hotel not found", 404);
  }

  if (existingHotel.owner.toString() !== managerId.toString()) {
    logger.warn(
      `Room type creation failed - unauthorized access: managerId=${managerId}, hotel=${hotel}`,
      {
        action: "ROOM_TYPE_CREATE_FAILED",
        targetId: hotel,
        actor: {
          type: logActorTypes.USER,
          id: managerId,
        },
      },
    );

    throw makeError("Unauthorized to add room types to this hotel", 403);
  }

  const normalize = (key, value) => {
    if (["pricePerNight", "maxGuests", "bedroomCount"].includes(key)) {
      return typeof value === "string" ? Number(value) : value;
    }
    if (typeof value === "string") return value.trim();
    return value;
  };

  const normalizedData = {};
  for (const key in roomTypeData) {
    normalizedData[key] = normalize(key, roomTypeData[key]);
  }

  const existingRoomType = await roomTypeModel.findOne({
    hotel,
    type: normalizedData.type,
  });

  if (existingRoomType) {
    logger.warn(
      `Room type creation failed - duplicate type: ${normalizedData.type} in hotel ${hotel}`,
      {
        action: "ROOM_TYPE_CREATE_FAILED",
        targetId: hotel,
        actor: {
          type: logActorTypes.USER,
          id: managerId,
        },
      },
    );

    throw makeError("Room type already exists in this hotel", 400);
  }

  const roomType = await roomTypeModel.create({
    hotel,
    type: normalizedData.type,
    description: normalizedData.description,
    mainPhoto: normalizedData.mainPhoto,
    photos: normalizedData.photos || [],
    view: normalizedData.view,
    bedroomCount: normalizedData.bedroomCount,
    pricePerNight: normalizedData.pricePerNight,
    maxGuests: normalizedData.maxGuests,
    smokingAllowed: normalizedData.smokingAllowed ?? false,
    amenities: normalizedData.amenities || [],
    status: normalizedData.status,
  });

  logger.info(
    `Room type created: managerId=${managerId}, roomTypeId=${roomType._id}`,
    {
      action: "ROOM_TYPE_CREATED",
      targetId: roomType._id,
      actor: {
        type: logActorTypes.USER,
        id: managerId,
      },
    },
  );

  return roomType;
};

export const updateRoomType = async (managerId, roomTypeId, updateData) => {
  const roomType = await roomTypeModel.findById(roomTypeId);

  if (!roomType) {
    logger.warn(`Room type update failed — Room not found: ${roomTypeId}`, {
      action: "ROOM_TYPE_UPDATE_FAILED",
      targetId: roomTypeId,
      actor: { type: logActorTypes.USER, id: managerId },
    });

    throw makeError("Room type not found", 404);
  }

  const hotel = await hotelModel.findById(roomType.hotel);

  if (!hotel) {
    logger.warn(
      `Room type update failed — parent hotel not found: ${roomType.hotel}`,
      {
        action: "ROOM_TYPE_UPDATE_FAILED",
        targetId: roomTypeId,
        actor: { type: logActorTypes.USER, id: managerId },
      },
    );

    throw makeError("Hotel not found", 404);
  }

  if (hotel.owner.toString() !== managerId) {
    logger.warn(
      `Room type update failed — unauthorized: managerId=${managerId}, roomTypeId=${roomTypeId}`,
      {
        action: "ROOM_TYPE_UPDATE_FAILED",
        targetId: roomTypeId,
        actor: { type: logActorTypes.USER, id: managerId },
      },
    );

    throw makeError("Unauthorized to update this room type", 403);
  }

  const normalize = (key, value) => {
    if (["pricePerNight", "maxGuests"].includes(key)) {
      return typeof value === "string" ? Number(value) : value;
    }
    if (typeof value === "string") return value.trim();
    return value;
  };

  const filteredUpdates = {};

  for (const key in updateData) {
    const incomingValue = normalize(key, updateData[key]);
    const existingValue = normalize(key, roomType[key]);

    const isEqual =
      Array.isArray(incomingValue) && Array.isArray(existingValue)
        ? JSON.stringify(incomingValue) === JSON.stringify(existingValue)
        : incomingValue === existingValue;

    if (!isEqual) {
      filteredUpdates[key] = incomingValue;
    }
  }

  if (Object.keys(filteredUpdates).length === 0) {
    logger.warn(
      `Room type update failed — no changes provided: ${roomTypeId}`,
      {
        action: "ROOM_TYPE_UPDATE_FAILED",
        targetId: roomTypeId,
        actor: { type: logActorTypes.USER, id: managerId },
      },
    );

    throw makeError("No valid changes provided", 400);
  }

  if (filteredUpdates.type) {
    const existing = await roomTypeModel.findOne({
      hotel: roomType.hotel,
      type: filteredUpdates.type,
      _id: { $ne: roomTypeId },
    });

    if (existing) {
      logger.warn(
        `Room type update failed — duplicate type: ${filteredUpdates.type}`,
        {
          action: "ROOM_TYPE_UPDATE_FAILED",
          targetId: roomTypeId,
          actor: { type: logActorTypes.USER, id: managerId },
        },
      );

      throw makeError("Room type already exists in this hotel", 400);
    }
  }

  // 7. Update
  const updatedRoomType = await roomTypeModel.findByIdAndUpdate(
    roomTypeId,
    { ...filteredUpdates, updatedAt: Date.now() },
    { new: true },
  );

  logger.info(
    `Room type updated: managerId=${managerId}, roomTypeId=${roomTypeId}`,
    {
      action: "ROOM_TYPE_UPDATED",
      targetId: roomTypeId,
      actor: { type: logActorTypes.USER, id: managerId },
    },
  );

  return {
    changes: filteredUpdates,
    roomType: updatedRoomType,
  };
};

export const setRoomTypeStatus = async (managerId, roomTypeId, newStatus) => {
  if (!newStatus) {
    throw makeError("Status is required", 400);
  }

  const normalizedStatus =
    typeof newStatus === "string" ? newStatus.toLowerCase().trim() : newStatus;

  if (!Object.values(roomTypeStatuses).includes(normalizedStatus)) {
    throw makeError("Invalid status value", 400);
  }

  const roomType = await roomTypeModel.findById(roomTypeId);

  if (!roomType) {
    logger.warn(
      `Room type status update failed — Rooom type not found: ${roomTypeId}`,
      {
        action: "ROOM_TYPE_STATUS_UPDATE_FAILED",
        targetId: roomTypeId,
        actor: { type: logActorTypes.USER, id: managerId },
      },
    );

    throw makeError("Room type not found", 404);
  }

  const hotel = await hotelModel.findById(roomType.hotel);

  if (!hotel) {
    logger.warn(
      `Room type status update failed — hotel not found: ${roomType.hotel}`,
      {
        action: "ROOM_TYPE_STATUS_UPDATE_FAILED",
        targetId: roomTypeId,
        actor: { type: logActorTypes.USER, id: managerId },
      },
    );

    throw makeError("Hotel not found", 404);
  }

  if (hotel.owner.toString() !== managerId) {
    logger.warn(
      `Room type status update failed — unauthorized: managerId=${managerId}, roomTypeId=${roomTypeId}`,
      {
        action: "ROOM_TYPE_STATUS_UPDATE_FAILED",
        targetId: roomTypeId,
        actor: { type: logActorTypes.USER, id: managerId },
      },
    );

    throw makeError("Unauthorized to update this room type", 403);
  }

  if (roomType.status === normalizedStatus) {
    logger.warn(`Room type status update failed — no change: ${roomTypeId}`, {
      action: "ROOM_TYPE_STATUS_UPDATE_FAILED",
      targetId: roomTypeId,
      actor: { type: logActorTypes.USER, id: managerId },
    });

    throw makeError("Room type already has this status", 400);
  }

  roomType.status = normalizedStatus;
  await roomType.save();

  logger.info(
    `Room type status updated: managerId=${managerId}, roomTypeId=${roomTypeId}, status=${normalizedStatus}`,
    {
      action: "ROOM_TYPE_STATUS_UPDATED",
      targetId: roomTypeId,
      actor: { type: logActorTypes.USER, id: managerId },
    },
  );

  return {
    roomTypeId: roomType._id,
    status: roomType.status,
  };
};
