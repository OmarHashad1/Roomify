import { errorRes } from "../utils/response.util.js";
import { logger } from "../utils/winston.utils.js";
import { logActorTypes } from "../enums/log.enums.js";
import { makeError } from "../utils/errorMaker.util.js";


export const requireFields = (fields) => {
  return (req, res, next) => {
    const missingFields = fields.filter(
      (field) => req.body[field] === undefined || req.body[field] === null
    );

    if (missingFields.length > 0) {
      logger.warn(`Validation failed — missing fields: ${missingFields.join(", ")}`, {
        action: "VALIDATION_FAILED",
        actor: {
          type: logActorTypes.USER,
          id: req.user?.id,
        },
      });

      return next(makeError(`Missing required fields: ${missingFields.join(", ")}`, 400));
    }

    next();
  };
};
