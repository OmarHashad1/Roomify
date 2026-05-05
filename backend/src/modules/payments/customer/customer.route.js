import { Router } from "express";
import { auth, checkRole } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import { successRes, errorRes } from "../../../utils/response.util.js";
import { userRoles } from "../../../enums/user.enums.js";
import { processPayment } from "./customer.service.js";
import { bookingIdParamSchema } from "../../../schemas/payment.schema.js";

export const paymentCustomerRouter = Router();

paymentCustomerRouter.post(
  "/:bookingId/pay",
  auth,
  checkRole([userRoles.CUSTOMER]),
  validate(bookingIdParamSchema),
  async (req, res) => {
    try {
      const payment = await processPayment(req.user._id, req.params.bookingId);
      successRes({
        res,
        message: "Payment processed successfully",
        status: 200,
        data: payment,
      });
    } catch (err) {
      errorRes({ res, message: err.message, status: err.status || 500 });
    }
  },
);
