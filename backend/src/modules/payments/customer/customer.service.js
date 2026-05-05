import { randomUUID } from "crypto";
import { bookingModel } from "../../../models/Booking/booking.model.js";
import { paymentModel } from "../../../models/Payment/payment.model.js";
import { bookingStatuses, paymentStatuses as bookingPaymentStatuses, paymentMethods as bookingPaymentMethods } from "../../../enums/booking.enums.js";
import { paymentStatuses, paymentProviders, paymentMethods } from "../../../enums/payment.enums.js";
import { makeError } from "../../../utils/errorMaker.util.js";

export const processPayment = async (customerId, bookingId) => {
  const booking = await bookingModel.findById(bookingId).lean();

  if (!booking)
    throw makeError("Booking not found", 404);

  if (booking.customer.toString() !== customerId.toString())
    throw makeError("You are not authorized to pay for this booking", 403);
  
  if (booking.paymentStatus !== bookingPaymentStatuses.PENDING)
    throw makeError("This booking has already been paid", 400);

  if (booking.paymentMethod === bookingPaymentMethods.CASH)
    throw makeError("Cash bookings are paid at the hotel", 400);

  const payment = await paymentModel.create({
    booking:       booking._id,
    paidBy:        customerId,
    amount:        booking.subtotal,
    currency:      "EGP",
    transactionId: randomUUID(),
    provider:      paymentProviders.PAYMOB,
    method:        paymentMethods.CARD,
    status:        paymentStatuses.COMPLETED,
  });

  await bookingModel.findByIdAndUpdate(bookingId, {
    paymentStatus: bookingPaymentStatuses.PAID,
    status:        bookingStatuses.CONFIRMED,
  });

  return payment;
};
