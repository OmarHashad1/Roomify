import { logger } from "../utils/winston.utils.js";
import { logActorTypes } from "../enums/log.enums.js";

const dataSources = ["body", "params", "query"];
export const validate = (schema) => {
  return (req, res, next) => {
    let validationErrors = [];
    dataSources.forEach((source) => {
      if (!schema[source]) return;
      const payload = schema[source].validate(req[source], {
        abortEarly: false,
        convert: true,
      });
      if (payload.error)
        validationErrors.push({
          [source]: payload.error.details.map((err) => err.message),
        });
    });

    if (validationErrors.length) {
      logger.warn(`Validation failed: ${JSON.stringify(validationErrors)}`, { action: "VALIDATION_FAILED", actor: { type: logActorTypes.SYSTEM } });
      return res
        .status(400)
        .json({ message: "validation failed", data: { ...validationErrors } });
    }

    next();
  };
};
