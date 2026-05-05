import { reviewModel } from "../../../models/index.js";
import { reviewStatuses } from "../../../enums/review.enums.js";
import { makeError } from "../../../utils/errorMaker.util.js";
import { logger } from "../../../utils/winston.utils.js";
import { logActorTypes } from "../../../enums/log.enums.js";

export const listReviews = async ({ status, hotel }) => {
  const filter = {};
  if (status) {
    filter.status = status;
  }

  if (hotel) {
    filter.hotel = hotel;
  }

  const reviews = await reviewModel
    .find(filter)
    .select("-booking -__v")
    .populate("hotel", "name address")
    .populate("customer", "firstName lastName")
    .lean();

  const totalReviewsCount = {
    reviewCount: reviews.length,
    publishedCount: reviews.filter((r) => r.status === reviewStatuses.PUBLISHED)
      .length,
    flaggedCount: reviews.filter((r) => r.status === reviewStatuses.FLAGGED)
      .length,
    removedCount: reviews.filter((r) => r.status === reviewStatuses.REMOVED)
      .length,
  };

  return { totalReviewsCount, reviews };
};

export const updateReviewStatus = async (reviewId, newStatus, adminId) => {
  const review = await reviewModel.findById(reviewId);

  if (!review) {
    logger.warn(
      `Attempted to update status for non-existent review: ${reviewId}`,
      {
        action: "UPDATE_REVIEW_STATUS_FAILED",
        targetId: reviewId,
        actor: { type: logActorTypes.ADMIN, id: adminId },
      },
    );

    throw makeError("Review not found", 404);
  }

  if (review.status === newStatus) {
    logger.warn(
      `Attempted to update review status to the same status: ${reviewId}`,
      {
        action: "UPDATE_REVIEW_STATUS_FAILED",
        targetId: reviewId,
        actor: { type: logActorTypes.ADMIN, id: adminId },
      },
    );

    throw makeError("Review status is already " + newStatus, 400);
  }

  await reviewModel.findByIdAndUpdate(reviewId, { status: newStatus });

  logger.info(`Review status updated: ${reviewId}`, {
    action: "REVIEW_STATUS_UPDATED",
    targetId: reviewId,
    actor: { type: logActorTypes.ADMIN, id: adminId },
  });
};
