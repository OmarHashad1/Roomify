import joi from "joi";
export const hotelReviewsSchema = {
  params: joi.object({
    id: joi.string().required(),
  }),
};
