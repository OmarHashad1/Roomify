import { userModel } from "../../../models/User/user.model.js";
import { bookingModel } from "../../../models/index.js";
import { reviewModel } from "../../../models/index.js";
import { hotelModel } from "../../../models/index.js";
import { bookingStatuses } from "../../../enums/booking.enums.js";
import { makeError } from "../../../utils/errorMaker.util.js";
import { logger } from "../../../utils/winston.utils.js";
import { logActorTypes } from "../../../enums/log.enums.js";
import { userRoles, userStatuses } from "../../../enums/user.enums.js";
import { reviewStatuses } from "../../../enums/review.enums.js";

export const listUsers = async ({ role, status }) => {
  const filter = {};
  if (role) {
    filter.role = role;
  }

  if (status) {
    filter.status = status;
  }

  const users = await userModel
    .find(filter)
    .select(
      "-password -nationality -age -phone -__v -createdAt -updatedAt -credentialChangedAt",
    )
    .lean();

  const totalUsersCount = {
    userCount: users.length,
    customerCount: users.filter((u) => u.role === userRoles.CUSTOMER).length,
    managerCount: users.filter((u) => u.role === userRoles.HotelManager).length,
    adminCount: users.filter((u) => u.role === userRoles.ADMIN).length,
  };

  const userStatusCounts = {
    activeCount: users.filter((u) => u.status === userStatuses.ACTIVE).length,
    suspendedCount: users.filter((u) => u.status === userStatuses.SUSPENDED)
      .length,
    deletedCount: users.filter((u) => u.status === userStatuses.DELETED).length,
  };

  return { totalUsersCount, userStatusCounts, users };
};

export const getUserById = async (userId) => {
  const user = await userModel
    .findById(userId)
    .select("-password -__v -credentialChangedAt")
    .lean();

  if (!user) {
    throw makeError("User not found", 404);
  }

  let stats = {};

  if (user.role === userRoles.CUSTOMER) {
    const noOfBookings = await bookingModel.countDocuments({
      customer: userId,
    });
    const noOfReviews = await reviewModel.countDocuments({
      customer: userId,
      status: reviewStatuses.PUBLISHED,
    });
    const sumRatings = await reviewModel.aggregate([
      { $match: { customer: user._id, status: reviewStatuses.PUBLISHED } },
      { $group: { _id: null, total: { $sum: "$rating" } } },
    ]);
    const avgRating = parseFloat(
      (sumRatings[0]?.total / noOfReviews || 0).toFixed(1),
    );

    stats = {
      noOfBookings,
      noOfReviews,
      avgRating,
    };
  } else if (user.role === userRoles.HotelManager) {
    const hotel = await hotelModel
      .findOne({ owner: userId })
      .select("_id numberOfRooms")
      .lean();

    let noOfRooms = 0;
    let totalRevenue = 0;

    if (hotel) {
      noOfRooms = hotel.numberOfRooms;
      const revenue = await bookingModel.aggregate([
        { $match: { hotel: hotel._id, status: bookingStatuses.COMPLETED } },
        { $group: { _id: null, total: { $sum: "$subtotal" } } },
      ]);
      totalRevenue = revenue[0]?.total ?? 0;
    }

    stats = {
      noOfRooms,
      totalRevenue,
    };
  } else if (user.role === userRoles.ADMIN) {
    const totalUsers = await userModel.countDocuments();
    const totalBookings = await bookingModel.countDocuments();
    const totalHotels = await hotelModel.countDocuments();

    stats = {
      totalUsers,
      totalBookings,
      totalHotels,
    };
  }

  user.stats = stats;

  return user;
};

export const forceLogoutUser = async (userId, adminId) => {
  if (adminId.toString() === userId) {
    logger.warn(`Admin attempted to force logout themselves: ${adminId}`, {
      action: "FORCE_LOGOUT_FAILED",
      targetId: userId,
      actor: { type: logActorTypes.ADMIN, id: adminId },
    });

    throw makeError("You cannot force logout your own account", 400);
  }

  const user = await userModel.findById(userId);

  if (!user) {
    logger.warn(`Attempted to force logout non-existent user: ${userId}`, {
      action: "FORCE_LOGOUT_FAILED",
      targetId: userId,
      actor: { type: logActorTypes.ADMIN, id: adminId },
    });

    throw makeError("User not found", 404);
  }

  await userModel.findByIdAndUpdate(userId, {
    credentialChangedAt: new Date(),
  });

  logger.info(`User force logged out: ${userId}`, {
    action: "USER_FORCE_LOGOUT",
    targetId: userId,
    actor: { type: logActorTypes.ADMIN, id: adminId },
  });
};

export const updateUserStatus = async (userId, newStatus, adminId) => {
  if (adminId.toString() === userId) {
    logger.warn(`Admin attempted to change their own status: ${adminId}`, {
      action: "UPDATE_USER_STATUS_FAILED",
      targetId: userId,
      actor: { type: logActorTypes.ADMIN, id: adminId },
    });

    throw makeError("You cannot change your own status", 400);
  }

  const user = await userModel.findById(userId);

  if (!user) {
    logger.warn(`Attempted to update status for non-existent user: ${userId}`, {
      action: "UPDATE_USER_STATUS_FAILED",
      targetId: userId,
      actor: { type: logActorTypes.ADMIN, id: adminId },
    });

    throw makeError("User not found", 404);
  }

  const currentStatus = user.status;

  if (currentStatus === newStatus) {
    logger.warn(
      `Attempted to update user status to the same status: ${userId}`,
      {
        action: "UPDATE_USER_STATUS_FAILED",
        targetId: userId,
        actor: { type: logActorTypes.ADMIN, id: adminId },
      },
    );

    throw makeError("User status is already " + newStatus, 400);
  }

  await userModel.findByIdAndUpdate(userId, { status: newStatus });

  logger.info(`User status updated: ${userId}`, {
    action: "USER_STATUS_UPDATED",
    targetId: userId,
    actor: { type: logActorTypes.ADMIN, id: adminId },
  });
};
