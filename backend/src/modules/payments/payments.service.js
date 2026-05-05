import { bookingModel, paymentModel } from "../../models/index.js";
import { logger } from "../../utils/winston.utils.js";
import { logActorTypes } from "../../enums/log.enums.js";
import { userRoles } from "../../enums/user.enums.js";
import { makeError } from "../../utils/errorMaker.util.js";

export const getPaymentDetails = async (user, bookingId) => {
  if (user.role === userRoles.CUSTOMER) {
    const bookingCheck = await bookingModel.findOne({
      _id: bookingId,
      customer: user.id,
    });

    if (!bookingCheck) {
      logger.warn(
        `Payment details fetch failed — booking not found or unauthorized: ${bookingId} (userId=${user.id})`,
        {
          action: "PAYMENT_DETAILS_FETCH_FAILED",
          targetId: bookingId,
          actor: { type: logActorTypes.USER, id: user.id },
        },
      );
      throw makeError("Booking not found or unauthorized", 404);
    }
  } else if (user.role === userRoles.HotelManager) {
    const bookingCheck = await bookingModel
      .findOne({
        _id: bookingId,
      })
      .populate("hotel");

    if (!bookingCheck || bookingCheck.hotel.owner.toString() !== user.id) {
      logger.warn(
        `Payment details fetch failed — booking not found or unauthorized: ${bookingId} (userId=${user.id})`,
        {
          action: "PAYMENT_DETAILS_FETCH_FAILED",
          targetId: bookingId,
          actor: { type: logActorTypes.USER, id: user.id },
        },
      );
      throw makeError("Booking not found or unauthorized", 404);
    }
  }

  const paymentDetails = await paymentModel
    .findOne({ booking: bookingId })
    .populate("booking");

  if (!paymentDetails) {
    logger.warn(
      `Payment details fetch failed — payment not found for booking: ${bookingId} (userId=${user.id})`,
      {
        action: "PAYMENT_DETAILS_FETCH_FAILED",
        targetId: bookingId,
        actor: { type: logActorTypes.USER, id: user.id },
      },
    );
    throw makeError("Payment details not found for this booking", 404);
  }

  logger.info(
    `Payment details fetched successfully for booking: ${bookingId} (userId=${user.id})`,
    {
      action: "PAYMENT_DETAILS_FETCHED",
      targetId: bookingId,
      actor: { type: logActorTypes.USER, id: user.id },
    },
  );

  return paymentDetails;
};
