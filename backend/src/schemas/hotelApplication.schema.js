import joi from "joi";

export const submitApplicationSchema = {
  body: joi.object({
    firstName:     joi.string().trim().min(2).max(30).required(),
    lastName:      joi.string().trim().min(2).max(30).required(),
    email:         joi.string().trim().email().required(),
    phone:         joi.string().trim().pattern(/^\+\d{9,}$/).required(),
    hotelName:     joi.string().trim().required(),
    stars:         joi.number().integer().min(1).max(5).required(),
    street:        joi.string().trim().required(),
    city:          joi.string().trim().required(),
    country:   joi.string().trim().required(),
    numberOfRooms: joi.number().integer().min(1).required(),
    description:   joi.string().trim().min(20).required(),
  }).unknown(true),
};

export const getApplicationByIdSchema = {
  params: joi.object({
    id: joi.string().hex().length(24).required(),
  }),
};
