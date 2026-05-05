import express from "express";
import { DBConnect } from "./config/db.js";
import cors from "cors";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import "./models/index.js";
import { logger } from "./utils/winston.utils.js";
import { logActorTypes } from "./enums/log.enums.js";
import { authRouter } from "./modules/auth/auth.route.js";
import { hotelApplicationCustomerRouter } from "./modules/hotel-applications/customer/customer.route.js";
import { hotelApplicationAdminRouter } from "./modules/hotel-applications/admin/admin.route.js";
import { auth, checkRole } from "./middleware/auth.middleware.js";
import { userRouter } from "./modules/users/users.route.js";
import { customerReviewRouter } from "./modules/reviews/customer/customer.route.js";
import { reviewsRouter } from "./modules/reviews/reviews.route.js";
import { hotelCustomerRouter } from "./modules/hotels/customer/customer.route.js";
import { hotelManagerRouter } from "./modules/hotels/manager/manager.route.js";
import { bookingManagerRouter } from "./modules/bookings/manager/manager.route.js";
import { hotelAdminRouter } from "./modules/hotels/admin/admin.route.js";
import { roomTypesRouter } from "./modules/hotels/room-types/roomTypes.route.js";
import { paymentRouter } from "./modules/payments/payments.route.js";
import { paymentAdminRouter } from "./modules/payments/admin/admin.route.js";
import { managerRouter } from "./modules/hotels/room-types/manager/manager.route.js";
import { managerAvailabilityRouter } from "./modules/hotels/room-types/availability/manager/manager.route.js";
import { paymentCustomerRouter } from "./modules/payments/customer/customer.route.js";
import { bookingsRouter } from "./modules/bookings/bookings.route.js";
import { bookingCustomerRouter } from "./modules/bookings/customer/customer.route.js";
import { adminUsersRouter } from "./modules/users/admin/admin.route.js";
import { adminReviewsRouter } from "./modules/reviews/admin/admin.route.js";
import { adminBookingsRouter } from "./modules/bookings/admin/admin.route.js";
import { adminRouter } from "./modules/admins/admin.route.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

export const main = async () => {
  const app = express();
  const port = process.env.PORT;
  const clientUrl = process.env.CLIENT_URL?.trim();
  const normalizedClientUrl = clientUrl?.replace(/\/+$/, "");

  await DBConnect();

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const normalizedOrigin = origin.replace(/\/+$/, "");
        if (!normalizedClientUrl || normalizedOrigin === normalizedClientUrl) {
          return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use("/uploads", express.static(join(__dirname, "uploads")));

  app.use("/auth", authRouter);
  app.use("/hotel-applications/admin", hotelApplicationAdminRouter);
  app.use("/hotel-applications", hotelApplicationCustomerRouter);
  app.use("/users", userRouter);
  app.use("/reviews", [customerReviewRouter, reviewsRouter]);
  app.use("/hotels/admin", hotelAdminRouter);
  app.use("/hotels/room-types", roomTypesRouter);
  app.use("/hotels", [hotelCustomerRouter, hotelManagerRouter]);
  app.use("/payments/admin", paymentAdminRouter);
  app.use("/hotels/room-types/manager", managerRouter);
  app.use("/hotels/room-types/availability/manager", managerAvailabilityRouter);
  app.use("/payments", [paymentRouter, paymentCustomerRouter]);
  app.use("/admin/users", adminUsersRouter);
  app.use("/admin/reviews", adminReviewsRouter);
  app.use("/admin/bookings", adminBookingsRouter);
  app.use("/admin", adminRouter);
  app.use("/bookings", [
    bookingCustomerRouter,
    bookingManagerRouter,
    bookingsRouter,
  ]);

  app.all("{/*dummy}", (req, _res, next) => {
    logger.warn(`Route not found: [${req.method}] ${req.url}`, {
      action: "ROUTE_NOT_FOUND",
      actor: { type: logActorTypes.SYSTEM },
    });
    next(new Error(`page ${req.url} with method ${req.method} not found`));
  });

  app.use((err, req, res, _next) => {
    logger.error(`[${req.method}] ${req.url} - ${err.message}`, {
      action: "UNHANDLED_ERROR",
      actor: { type: logActorTypes.SYSTEM },
    });
    res.status(err.cause?.status || 500).json({
      message: err.message,
    });
  });

  app.listen(port, () => logger.info(`Server is running on port ${port}`));
};
