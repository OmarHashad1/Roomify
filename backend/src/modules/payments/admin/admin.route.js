import { Router } from "express";
import { auth, checkRole } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validate.middleware.js";
import { successRes, errorRes } from "../../../utils/response.util.js";
import joi from "joi";
import * as adminPaymentService from "./admin.service.js";

export const paymentAdminRouter = new Router();

const idSchema = {
  params: joi.object({ id: joi.string().hex().length(24).required() }),
};

paymentAdminRouter.get(
  "/",
  auth,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const { status } = req.query;
      const result = await adminPaymentService.listPayments({ status });
      successRes({ res, message: "Payments retrieved successfully", status: 200, data: result });
    } catch (err) {
      errorRes({ res, message: err.message, status: err.status || 500 });
    }
  },
);

paymentAdminRouter.get(
  "/:id",
  auth,
  checkRole(["admin"]),
  validate(idSchema),
  async (req, res) => {
    try {
      const payment = await adminPaymentService.getPaymentById(req.params.id);
      successRes({ res, message: "Payment retrieved successfully", status: 200, data: payment });
    } catch (err) {
      errorRes({ res, message: err.message, status: err.status || 500 });
    }
  },
);
