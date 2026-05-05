import { Router } from "express";
import { validate } from "../../../middleware/validate.middleware.js";
import { uploadDocuments, toRelativePath } from "../../../middleware/upload.middleware.js";
import { submitApplicationSchema } from "../../../schemas/hotelApplication.schema.js";
import { successRes, errorRes } from "../../../utils/response.util.js";
import * as hotelApplicationService from "./customer.service.js";

export const hotelApplicationCustomerRouter = new Router();

hotelApplicationCustomerRouter.post(
  "/",
  uploadDocuments,
  validate(submitApplicationSchema),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0)
        return errorRes({ res, message: "At least one document is required", status: 400 });

      const {
        firstName, lastName, email, phone,
        hotelName, stars, street, city, country, numberOfRooms, description,
      } = req.body;

      const documents = req.files.map((f) => toRelativePath(f.path));

      const application = await hotelApplicationService.submitApplication({
        firstName, lastName, email, phone,
        hotelName, stars,
        address: { street, city, country },
        numberOfRooms, description,
        documents,
      });

      successRes({ res, message: "Application submitted successfully", status: 201, data: application });
    } catch (error) {
      errorRes({ res, message: error.message, status: error.status || 500 });
    }
  },
);
