import { paymentModel } from "../../../models/Payment/payment.model.js";
import { paymentStatuses } from "../../../enums/payment.enums.js";
import { makeError } from "../../../utils/errorMaker.util.js";

export const listPayments = async ({ status } = {}) => {
  if (status && !Object.values(paymentStatuses).includes(status)) {
    throw makeError(
      `Invalid status. Must be one of: ${Object.values(paymentStatuses).join(", ")}`,
      400,
    );
  }

  const filter = status ? { status } : {};

  const payments = await paymentModel
    .find(filter)
    .populate("paidBy", "firstName lastName email")
    .populate("booking", "checkIn checkOut")
    .sort({ createdAt: -1 });

  const all = await paymentModel.find({});
  const summary = {
    total: all.length,
    completed: all.filter((p) => p.status === paymentStatuses.COMPLETED).length,
    pending:   all.filter((p) => p.status === paymentStatuses.PENDING).length,
    refunded:  all.filter((p) => p.status === paymentStatuses.REFUNDED).length,
    totalRevenue: all
      .filter((p) => p.status === paymentStatuses.COMPLETED)
      .reduce((s, p) => s + p.amount, 0),
    pendingAmount: all
      .filter((p) => p.status === paymentStatuses.PENDING)
      .reduce((s, p) => s + p.amount, 0),
  };

  return { payments, summary };
};

export const getPaymentById = async (id) => {
  const payment = await paymentModel
    .findById(id)
    .populate("paidBy", "firstName lastName email")
    .populate("booking", "checkIn checkOut");

  if (!payment) throw makeError("Payment not found", 404);

  return payment;
};
