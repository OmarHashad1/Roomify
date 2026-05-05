import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { errorRes, successRes } from "../../utils/response.util.js";
import * as paymentService from "./payments.service.js";
import { bookingIdParamSchema } from "../../schemas/payment.schema.js";

export const paymentRouter = new Router();

paymentRouter.get(
  "/:bookingId",
  auth,
  validate(bookingIdParamSchema),
  async (req, res) => {
    try {
      const payload = await paymentService.getPaymentDetails(
        req.user,
        req.params.bookingId,
      );
      successRes({
        res,
        message: "Payment details retrieved successfully",
        status: 200,
        data: payload,
      });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);
