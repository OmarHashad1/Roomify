import joi from "joi";

import { reviewStatuses } from "../enums/review.enums.js";

const objectId = joi.string().hex().length(24);

export const createReviewSchema = {
  body: joi
    .object({
      booking: objectId.required(),
      rating: joi.number().min(1).max(5).required(),
      comment: joi.string().allow("", null),
    })
    .unknown(false),
};

export const reviewFiltersSchema = {
  query: joi
    .object({
      status: joi.string().valid(...Object.values(reviewStatuses)),
      hotel: objectId,
    })
    .unknown(false),
};

export const updateReviewStatusSchema = {
  params: joi.object({
    reviewId: objectId.required(),
  }),
  body: joi.object({
    status: joi
      .string()
      .valid(...Object.values(reviewStatuses))
      .required(),
  }),
};
