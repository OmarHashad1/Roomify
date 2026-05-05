import joi from "joi";

import { roomTypeStatuses } from "../enums/roomType.enums.js";

export const createRoomTypeSchema = {
  body: joi
    .object({
      hotel: joi.string().required(),
      type: joi.string().trim().min(1).required(),
      description: joi.string().trim().min(1).required(),
      mainPhoto: joi.string().trim().required(),
      photos: joi.array().items(joi.string().trim()).default([]),
      view: joi.string().trim().allow("", null),
      bedroomCount: joi.number().integer().min(1).required(),
      pricePerNight: joi.number().min(0).required(),
      maxGuests: joi.number().integer().min(1).required(),
      smokingAllowed: joi.boolean().default(false),
      amenities: joi.array().items(joi.string().trim()).default([]),
      status: joi
        .string()
        .valid(...Object.values(roomTypeStatuses))
        .default(roomTypeStatuses.ACTIVE),
    })
    .unknown(false),
};

export const getRoomTypeSchema = {
  params: joi.object({
    id: joi.string().hex().length(24).required(),
  }),
};
