import { reviewModel } from "../../../models/Review/review.model.js";
import { bookingModel } from "../../../models/Booking/booking.model.js";
import { userModel } from "../../../models/User/user.model.js";
import { logger } from "../../../utils/winston.utils.js";
import { logActorTypes } from "../../../enums/log.enums.js";
import { makeError } from "../../../utils/errorMaker.util.js";
import { bookingStatuses } from "../../../enums/booking.enums.js";
import { reviewStatuses } from "../../../enums/review.enums.js";
import { emailEventEmitter } from "../../../events/emails.event.js";
import { EMAIL_EVENTS } from "../../../enums/email.enums.js";

export const getMyReviews = async (customerId) => {
  const reviews = await reviewModel
    .find({ customer: customerId, status: reviewStatuses.PUBLISHED })
    .select("-customer")
    .populate("hotel", "name")
    .sort({ createdAt: -1 })
    .lean();

  return reviews;
};

export const createReview = async (customerId, reviewData) => {
  const booking = await bookingModel
    .findOne({
      _id: reviewData.booking,
      customer: customerId,
      status: bookingStatuses.COMPLETED,
    })
    .select("hotel")
    .populate("hotel", "name")
    .lean();

  if (!booking) {
    logger.warn(
      `Review creation failed — booking not found or not completed for customer: ${customerId}`,
      {
        action: "REVIEW_CREATION_FAILED",
        targetId: customerId,
        actor: { type: logActorTypes.USER, id: customerId },
      },
    );
    throw makeError("You can only review your own completed bookings", 403);
  }

  if (
    await reviewModel.exists({
      booking: reviewData.booking,
      status: reviewStatuses.PUBLISHED,
    })
  ) {
    logger.warn(
      `Review creation failed — review already exists for booking: ${reviewData.booking}`,
      {
        action: "REVIEW_CREATION_FAILED",
        targetId: customerId,
        actor: { type: logActorTypes.USER, id: customerId },
      },
    );
    throw makeError("A review for this booking already exists", 400);
  }

  const allowedData = {
    booking: reviewData.booking,
    rating: reviewData.rating,
    comment: reviewData.comment,
  };

  const review = await reviewModel.create({
    ...allowedData,
    customer: customerId,
    hotel: booking.hotel._id,
  });

  logger.info(
    `Review created: reviewId=${review._id} by customerId=${customerId}`,
    {
      action: "REVIEW_CREATED",
      targetId: review._id,
      actor: { type: logActorTypes.USER, id: customerId },
    },
  );

  const customer = await userModel
    .findById(customerId)
    .select("email firstName")
    .lean();

  if (customer?.email) {
    emailEventEmitter.emit(EMAIL_EVENTS.REVIEW_SUBMITTED, {
      to: customer.email,
      firstName: customer.firstName,
      hotelName: booking.hotel.name,
      rating: review.rating,
      comment: review.comment,
    });
  }

  return review;
};

export const deleteReview = async (customerId, reviewId) => {
  const review = await reviewModel.findOneAndDelete({
    _id: reviewId,
    customer: customerId,
  });

  if (!review) {
    logger.warn(
      `Review deletion failed — review not found for customer: ${customerId}`,
      {
        action: "REVIEW_DELETION_FAILED",
        targetId: customerId,
        actor: { type: logActorTypes.USER, id: customerId },
      },
    );
    throw makeError("Review not found", 404);
  }

  logger.info(
    `Review deleted: reviewId=${review._id} by customerId=${customerId}`,
    {
      action: "REVIEW_DELETED",
      targetId: review._id,
      actor: { type: logActorTypes.USER, id: customerId },
    },
  );

  return review;
};
