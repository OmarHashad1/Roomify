import joi from "joi";

export const updateHotelSchema = {
  params: joi.object({
    id: joi.string().hex().length(24).required(),
  }),
  body: joi
    .object({
      name: joi.string().trim().min(2).max(120),
      description: joi.string().trim().min(20).max(2000),
      stars: joi.number().integer().min(1).max(5),
      phone: joi.string().trim().pattern(/^\+\d{9,}$/),
      email: joi.string().trim().email(),
      address: joi.object({
        street: joi.string().trim().min(3).max(255).required(),
        city: joi.string().trim().min(2).max(120).required(),
        country: joi.string().trim().min(2).max(120).required(),
      }),
      photos: joi
        .array()
        .items(
          joi.alternatives().try(
            joi.string().trim().uri(),
            joi.string().trim().pattern(/^uploads[\\/].+/),
          ),
        )
        .min(1),
      amenities: joi.array().items(joi.string().trim().min(1)).min(1),
      numberOfRooms: joi.number().integer().min(1),
    })
    .min(1),
};

export const hotelIdSchema = {
  params: joi.object({
    id: joi.string().hex().length(24).required(),
  }),
};

export const updateHotelStatusSchema = {
  params: joi.object({
    id: joi.string().hex().length(24).required(),
  }),
  body: joi.object({
    status: joi.string().valid("active", "suspended").required(),
  }),
};
