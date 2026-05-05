export const paymentProviders = {
  STRIPE:  "stripe",
  PAYPAL:  "paypal",
  PAYMOB:  "paymob",
  HOTEL:   "hotel",
};

export const paymentMethods = {
  CARD:   "card",
  PAYPAL: "paypal",
  CASH:   "cash",
};

export const paymentStatuses = {
  PENDING:            "pending",
  COMPLETED:          "completed",
  REFUNDED:           "refunded",
  PARTIALLY_REFUNDED: "partially_refunded",
};

export const refundStatuses = {
  NONE:      "none",
  PENDING:   "pending",
  PROCESSED: "processed",
};
