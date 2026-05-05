import { findOne } from "../db/db.repo.js";
import { RevokedTokenModel } from "../models/revokedToken/revokedToken.model.js";
import { errorRes } from "../utils/response.util.js";
import { decodeToken } from "../utils/security/token.util.js";
import { logger  } from "../utils/winston.utils.js";
import { logActorTypes } from "../enums/log.enums.js";

export const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      logger.warn("Auth failed — authorization header missing", { action: "AUTH_FAILED", actor: { type: logActorTypes.SYSTEM } });
      return errorRes({ res, message: "Authorization header missing", status: 401 });
    }

    const [signature, token] = authorization.split(" ");

    if (signature !== process.env.AUTH_SIGNATURE) {
      logger.warn("Auth failed — invalid authorization signature", { action: "AUTH_FAILED", actor: { type: logActorTypes.SYSTEM } });
      return errorRes({ res, message: "Invalid authorization signature", status: 401 });
    }

    const { user, payload: { iat, jti } } = await decodeToken({ token, tokenType: "access" });

    if (!user) {
      logger.warn(`Auth failed — user not found for token jti=${jti}`, { action: "AUTH_FAILED", actor: { type: logActorTypes.SYSTEM } });
      return errorRes({ res, message: "User not found", status: 401 });
    }

    req.decoded = { iat, jti };
    req.user = user;
    next();
  } catch (err) {
    logger.error(`Auth middleware error: ${err.message}`, { action: "AUTH_ERROR", actor: { type: logActorTypes.SYSTEM } });
    errorRes({ res, message: err.message, status: 401 });
  }
};

export const checkRole = (allowed_roles = []) => {
  return (req, res, next) => {
    const user = req.user;
    if (!allowed_roles.includes(user.role)) {
      logger.warn(`Authorization failed — role "${user.role}" not in [${allowed_roles}]: userId=${user._id}`, { action: "AUTHORIZATION_FAILED", targetId: user._id.toString(), actor: { type: logActorTypes.USER, id: user._id } });
      return errorRes({ res, message: "User not authorized", status: 403 });
    }
    return next();
  };
};
