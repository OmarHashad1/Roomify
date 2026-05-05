import joi from "joi";

export const bookingIdParamSchema = {
  params: joi.object({
    bookingId: joi.string().hex().length(24).required(),
  }),
};
