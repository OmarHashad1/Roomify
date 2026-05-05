import { randomUUID } from "crypto";
import { bookingModel } from "../../../models/Booking/booking.model.js";
import { reviewModel } from "../../../models/Review/review.model.js";
import { roomTypeModel } from "../../../models/RoomType/roomType.model.js";
import { hotelModel } from "../../../models/Hotel/hotel.model.js";
import { roomAvailabilityModel } from "../../../models/RoomAvailability/roomAvailability.model.js";
import { paymentModel } from "../../../models/Payment/payment.model.js";
import { makeError } from "../../../utils/errorMaker.util.js";
import { bookingStatuses, paymentMethods as bookingPaymentMethods, paymentStatuses as bookingPaymentStatuses } from "../../../enums/booking.enums.js";
import { paymentStatuses, paymentProviders, paymentMethods } from "../../../enums/payment.enums.js";
import { reviewStatuses } from "../../../enums/review.enums.js";

const toUTCDate = (dateStr) => {
  const [y, m, d] = String(dateStr).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

export const getMyBookings = async (customerId) => {
  let bookings = await bookingModel
    .find({
      customer: customerId,
      status: { $ne: bookingStatuses.CANCELLED_BY_ADMIN },
    })
    .populate("hotel", "name address.city")
    .populate("roomType", "type")
    .sort({ createdAt: -1 })
    .lean();

  const reviewedIds = new Set(
    (
      await reviewModel
        .find({
          booking: { $in: bookings.map((b) => b._id) },
          status: reviewStatuses.PUBLISHED,
        })
        .distinct("booking")
    ).map(String),
  );

  bookings = bookings.map((b) => ({
    ...b,
    hasReview: reviewedIds.has(String(b._id)),
  }));

  const count = bookings.length;

  return { count, bookings };
};

export const createBooking = async (customerId, body) => {
  const {
    roomTypeId,
    checkIn,
    checkOut,
    numGuests,
    paymentMethod,
    email,
    phone,
  } = body;

  const checkInDate = toUTCDate(checkIn);
  const checkOutDate = toUTCDate(checkOut);
  const todayUTC = new Date(
    Date.UTC(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
    ),
  );

  if (checkInDate < todayUTC)
    throw makeError("Check-in date cannot be in the past", 400);

  if (checkInDate >= checkOutDate)
    throw makeError("Check-out must be after check-in", 400);

  const roomType = await roomTypeModel.findById(roomTypeId).lean();
  if (!roomType) throw makeError("Room type not found", 404);

  const hotel = await hotelModel.findById(roomType.hotel).lean();
  if (!hotel) throw makeError("Hotel not found", 404);

  if (numGuests > roomType.maxGuests)
    throw makeError(
      `This room supports a maximum of ${roomType.maxGuests} guest(s)`,
      400,
    );

  const nights = Math.ceil((checkOutDate - checkInDate) / 86_400_000);

  const availabilityDocs = await roomAvailabilityModel
    .find({
      roomType: roomType._id,
      date: { $gte: checkInDate, $lt: checkOutDate },
    })
    .lean();

  if (availabilityDocs.length < nights)
    throw makeError("This room is not available for the selected dates", 400);

  const fullyBookedDay = availabilityDocs.find((d) => d.availableCount < 1);
  if (fullyBookedDay)
    throw makeError(
      "This room is fully booked on one or more of the selected dates",
      400,
    );

  const seasonMultiplier = [0.9, 0.85, 1.2, 1.05][
    Math.floor(checkInDate.getUTCMonth() / 3)
  ];
  const finalNightPrice = roomType.pricePerNight * seasonMultiplier;
  const subtotal = finalNightPrice * nights;

  const booking = await bookingModel.create({
    customer: customerId,
    hotel: roomType.hotel,
    roomType: roomType._id,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    numGuests,
    paymentMethod,
    finalNightPrice,
    subtotal,
    updatedInformation: { email, phone },
  });

  await roomAvailabilityModel.updateMany(
    { roomType: roomType._id, date: { $gte: checkInDate, $lt: checkOutDate } },
    { $inc: { availableCount: -1 } },
  );

  if (paymentMethod === bookingPaymentMethods.CASH) {
    await paymentModel.create({
      booking:       booking._id,
      paidBy:        customerId,
      amount:        subtotal,
      currency:      "USD",
      transactionId: randomUUID(),
      provider:      paymentProviders.HOTEL,
      method:        paymentMethods.CASH,
      status:        paymentStatuses.PENDING,
    });

    await bookingModel.findByIdAndUpdate(booking._id, {
      paymentStatus: bookingPaymentStatuses.PENDING,
      status:        bookingStatuses.CONFIRMED,
    });
  }

  return booking;
};
