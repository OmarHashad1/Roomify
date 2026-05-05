export const bookingStatuses = {
  PENDING_PAYMENT: "pending_payment",
  CONFIRMED: "confirmed",
  CHECKED_IN: "checked_in",
  COMPLETED: "completed",
  CANCELLED_BY_USER: "cancelled_by_user",
  CANCELLED_BY_HOTEL: "cancelled_by_hotel",
  CANCELLED_BY_ADMIN: "cancelled_by_admin",
};

export const paymentStatuses = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
};

export const paymentMethods = {
  CREDIT_CARD: "credit_card",
  CASH: "cash",
};
