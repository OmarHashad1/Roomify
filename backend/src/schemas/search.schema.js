import joi from "joi";

export const searchRoomsSchema = {
  query: joi.object({
    location: joi.string().trim().allow("").optional(),
    checkIn:  joi.string().isoDate().allow("").optional(),
    checkOut: joi.string().isoDate().allow("").optional(),
    adults:   joi.number().integer().min(1).default(1),
    children: joi.number().integer().min(0).default(0),
    rooms:    joi.number().integer().min(1).default(1),
  }),
};
