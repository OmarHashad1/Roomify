import { logger } from "../utils/winston.utils.js";
import { logActorTypes } from "../enums/log.enums.js";
import { makeError } from "../utils/errorMaker.util.js";

export const updateProfile = (req, res, next) => {
  if ("status" in req.body && req.user.role !== "admin") {
    logger.warn(
      `Profile update blocked — non-admin status change: ${req.user.id}`,
      {
        action: "PROFILE_UPDATE_BLOCKED",
        targetId: req.user.id,
        actor: {
          type: logActorTypes.USER,
          id: req.user.id,
        },
      },
    );

    throw makeError("Only admins can change user status", 403);
  }

  next();
};
