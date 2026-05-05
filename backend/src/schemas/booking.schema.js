import joi from "joi";
import { paymentMethods, bookingStatuses } from "../enums/booking.enums.js";

const objectId = joi.string().hex().length(24);

export const bookingIdParamSchema = {
  params: joi.object({
    bookingId: objectId.required(),
  }),
};

export const bookingFiltersSchema = {
  query: joi
    .object({
      status: joi.string().valid(...Object.values(bookingStatuses)),
      hotel: objectId,
    })
    .unknown(false),
};

export const createBookingSchema = {
  body: joi.object({
    roomTypeId: joi.string().hex().length(24).required(),

    checkIn:  joi.string().isoDate().required(),
    checkOut: joi.string().isoDate().required(),

    numGuests:     joi.number().integer().min(1).required(),
    paymentMethod: joi.string().valid(...Object.values(paymentMethods)).required(),

    email: joi.string().email().optional(),
    phone: joi.string().optional(),
  }),
};
