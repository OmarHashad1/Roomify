import { bookingModel } from "../../../models/index.js";
import { bookingStatuses } from "../../../enums/booking.enums.js";
import { makeError } from "../../../utils/errorMaker.util.js";

export const listBookings = async ({ status, hotel }) => {
  const filter = {};
  if (status) {
    filter.status = status;
  }

  if (hotel) {
    filter.hotel = hotel;
  }

  const bookings = await bookingModel
    .find(filter)
    .select("-__v -updatedInformation")
    .populate("hotel", "name address")
    .populate("customer", "firstName lastName")
    .populate("roomType", "type")
    .lean();

  const totalBookingsCount = {
    bookingCount: bookings.length,
    pendingPaymentCount: bookings.filter(
      (b) => b.status === bookingStatuses.PENDING_PAYMENT,
    ).length,
    confirmedCount: bookings.filter(
      (b) => b.status === bookingStatuses.CONFIRMED,
    ).length,
    checkedInCount: bookings.filter(
      (b) => b.status === bookingStatuses.CHECKED_IN,
    ).length,
    completedCount: bookings.filter(
      (b) => b.status === bookingStatuses.COMPLETED,
    ).length,
    cancelledCount: bookings.filter((b) =>
      [
        bookingStatuses.CANCELLED_BY_USER,
        bookingStatuses.CANCELLED_BY_HOTEL,
        bookingStatuses.CANCELLED_BY_ADMIN,
      ].includes(b.status),
    ).length,
  };

  return { totalBookingsCount, bookings };
};

export const getBookingById = async (bookingId) => {
  const booking = await bookingModel
    .findById(bookingId)
    .select("-__v")
    .populate("hotel", "name address phone email stars")
    .populate("customer", "firstName lastName email phone")
    .populate("roomType", "type pricePerNight maxGuests")
    .lean();

  if (!booking) {
    throw makeError("Booking not found", 404);
  }

  return booking;
};
