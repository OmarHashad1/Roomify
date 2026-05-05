import { bookingModel } from "../../../models/Booking/booking.model.js";
import { hotelModel } from "../../../models/Hotel/hotel.model.js";
import { bookingStatuses } from "../../../enums/booking.enums.js";
import { makeError } from "../../../utils/errorMaker.util.js";
import { logger } from "../../../utils/winston.utils.js";
import { logActorTypes } from "../../../enums/log.enums.js";

export const updateBookingDatesByManager = async ({
  bookingId,
  managerId,
  checkIn,
  checkOut,
}) => {
  const booking = await bookingModel.findById(bookingId);
  if (!booking) {
    logger.warn(`Booking date update failed — booking not found: bookingId=${bookingId}`, {
      action: "BOOKING_UPDATE_FAILED",
      targetId: bookingId,
      actor: { type: logActorTypes.USER, id: managerId },
    });
    throw makeError("Booking not found", 404);
  }

  const hotel = await hotelModel.findOne({ _id: booking.hotel, owner: managerId });
  if (!hotel) {
    logger.warn(
      `Booking date update forbidden — manager does not own hotel: managerId=${managerId}, bookingId=${bookingId}`,
      {
        action: "BOOKING_UPDATE_FORBIDDEN",
        targetId: bookingId,
        actor: { type: logActorTypes.USER, id: managerId },
      },
    );
    throw makeError("You are not allowed to update this booking", 403);
  }

  const blockedStatuses = [
    bookingStatuses.CHECKED_IN,
    bookingStatuses.COMPLETED,
    bookingStatuses.CANCELLED_BY_USER,
    bookingStatuses.CANCELLED_BY_HOTEL,
    bookingStatuses.CANCELLED_BY_ADMIN,
  ];

  if (blockedStatuses.includes(booking.status)) {
    logger.warn(
      `Booking date update failed — status does not allow updates: bookingId=${bookingId}, status=${booking.status}`,
      {
        action: "BOOKING_UPDATE_FAILED",
        targetId: bookingId,
        actor: { type: logActorTypes.USER, id: managerId },
      },
    );
    throw makeError("Booking dates cannot be updated in the current status", 400);
  }

  const nextCheckIn = new Date(checkIn);
  const nextCheckOut = new Date(checkOut);

  if (nextCheckOut <= nextCheckIn) {
    throw makeError("checkOut must be after checkIn", 400);
  }

  const currentCheckIn = booking.checkIn.getTime();
  const currentCheckOut = booking.checkOut.getTime();

  if (
    currentCheckIn === nextCheckIn.getTime() &&
    currentCheckOut === nextCheckOut.getTime()
  ) {
    throw makeError("No valid changes provided", 400);
  }

  booking.checkIn = nextCheckIn;
  booking.checkOut = nextCheckOut;
  await booking.save();

  logger.info(`Booking dates updated: managerId=${managerId}, bookingId=${bookingId}`, {
    action: "BOOKING_UPDATED",
    targetId: bookingId,
    actor: { type: logActorTypes.USER, id: managerId },
  });

  return {
    changes: {
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
    },
    booking,
  };
};

export const updateBookingStatusByManager = async ({
  bookingId,
  managerId,
  nextStatus,
}) => {
  const booking = await bookingModel.findById(bookingId);
  if (!booking) {
    logger.warn(
      `Booking status update failed — booking not found: bookingId=${bookingId}`,
      {
        action: "BOOKING_UPDATE_FAILED",
        targetId: bookingId,
        actor: { type: logActorTypes.USER, id: managerId },
      },
    );
    throw makeError("Booking not found", 404);
  }

  const hotel = await hotelModel.findOne({ _id: booking.hotel, owner: managerId });
  if (!hotel) {
    logger.warn(
      `Booking status update forbidden — manager does not own hotel: managerId=${managerId}, bookingId=${bookingId}`,
      {
        action: "BOOKING_UPDATE_FORBIDDEN",
        targetId: bookingId,
        actor: { type: logActorTypes.USER, id: managerId },
      },
    );
    throw makeError("You are not allowed to update this booking", 403);
  }

  if (booking.status === nextStatus) {
    throw makeError("No valid changes provided", 400);
  }

  const allowedTransitions = {
    [bookingStatuses.PENDING_PAYMENT]: [
      bookingStatuses.CONFIRMED,
      bookingStatuses.CANCELLED_BY_HOTEL,
    ],
    [bookingStatuses.CONFIRMED]: [
      bookingStatuses.CHECKED_IN,
      bookingStatuses.CANCELLED_BY_HOTEL,
    ],
    [bookingStatuses.CHECKED_IN]: [bookingStatuses.COMPLETED],
    [bookingStatuses.COMPLETED]: [],
    [bookingStatuses.CANCELLED_BY_USER]: [],
    [bookingStatuses.CANCELLED_BY_HOTEL]: [],
    [bookingStatuses.CANCELLED_BY_ADMIN]: [],
  };

  const currentAllowed = allowedTransitions[booking.status] || [];
  if (!currentAllowed.includes(nextStatus)) {
    logger.warn(
      `Booking status update failed — invalid transition: bookingId=${bookingId}, from=${booking.status}, to=${nextStatus}`,
      {
        action: "BOOKING_UPDATE_FAILED",
        targetId: bookingId,
        actor: { type: logActorTypes.USER, id: managerId },
      },
    );
    throw makeError("Invalid booking status transition", 400);
  }

  booking.status = nextStatus;
  booking.cancelledAt =
    nextStatus === bookingStatuses.CANCELLED_BY_HOTEL ? new Date() : null;
  await booking.save();

  logger.info(
    `Booking status updated: managerId=${managerId}, bookingId=${bookingId}, status=${nextStatus}`,
    {
      action: "BOOKING_UPDATED",
      targetId: bookingId,
      actor: { type: logActorTypes.USER, id: managerId },
    },
  );

  return {
    changes: {
      status: booking.status,
      cancelledAt: booking.cancelledAt,
    },
    booking,
  };
};
