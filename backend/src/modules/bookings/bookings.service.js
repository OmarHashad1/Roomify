import { bookingModel } from "../../models/index.js";
import { logger } from "../../utils/winston.utils.js";
import { userRoles } from "../../enums/user.enums.js";
import { makeError } from "../../utils/errorMaker.util.js";
import { bookingStatuses } from "../../enums/booking.enums.js";

export const getBookingDetails = async (user, bookingId) => {
  if (user.role === userRoles.CUSTOMER) {
    const bookingCheck = await bookingModel.findOne({
      _id: bookingId,
      customer: user.id,
    });

    if (!bookingCheck) {
      logger.warn(
        `Booking details fetch failed — booking not found or unauthorized: ${bookingId} (userId=${user.id})`,
        {
          action: "BOOKING_DETAILS_FETCH_FAILED",
          targetId: bookingId,
          actor: { type: logActorTypes.USER, id: user.id },
        },
      );
      throw makeError("Booking not found or unauthorized", 404);
    }

    if (bookingCheck.status === bookingStatuses.CANCELLED_BY_ADMIN) {
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
        `Booking details fetch failed — booking not found or unauthorized: ${bookingId} (userId=${user.id})`,
        {
          action: "BOOKING_DETAILS_FETCH_FAILED",
          targetId: bookingId,
          actor: { type: logActorTypes.USER, id: user.id },
        },
      );
      throw makeError("Booking not found or unauthorized", 404);
    }
  }

  const booking = await bookingModel
    .findOne({ _id: bookingId })
    .populate({ path: "hotel", select: "name address" })
    .populate({ path: "roomType", select: "type" })
    .populate({ path: "customer", select: "firstName lastName email phone" });

  if (!booking) {
    throw makeError("Booking details not found", 404);
  }

  return {
    _id: booking._id,
    bookingStatus: booking.status,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    numGuests: booking.numGuests,
    subtotal: booking.subtotal,
    finalNightPrice: booking.finalNightPrice,
    cancelledAt: booking.cancelledAt,
    createdAt: booking.createdAt,
    paymentStatus: booking.paymentStatus,
    payment: { method: booking.paymentMethod },
    roomType: booking.roomType?.type ?? null,
    hotel: booking.hotel
      ? {
          name: booking.hotel.name,
          address: { city: booking.hotel.address?.city },
        }
      : null,
    guest: {
      name:
        [booking.customer?.firstName, booking.customer?.lastName]
          .filter(Boolean)
          .join(" ") || null,
      email:
        booking.updatedInformation?.email || booking.customer?.email || null,
      phone:
        booking.updatedInformation?.phone || booking.customer?.phone || null,
    },
  };
};
