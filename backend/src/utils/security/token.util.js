import jwt from "jsonwebtoken";
import { logger } from "../../utils/winston.utils.js";
import { logActorTypes } from "../../enums/log.enums.js";
import { userRoles } from "../../enums/user.enums.js";
import { findOne } from "../../db/db.repo.js";
import { userModel } from "../../models/User/user.model.js";
import { RevokedTokenModel } from "../../models/revokedToken/revokedToken.model.js";

const getSecretKey = (role, tokenType) => {
  const keys = {
    access: {
      [userRoles.CUSTOMER]: process.env.CUSTOMER_ACCESS_TOKEN_SIGNATURE,
      [userRoles.HotelManager]: process.env.MANAGER_ACCESS_TOKEN_SIGNATURE,
      [userRoles.ADMIN]: process.env.ADMIN_ACCESS_TOKEN_SIGNATURE,
    },
    refresh: {
      [userRoles.CUSTOMER]: process.env.CUSTOMER_REFRESH_TOKEN_SIGNATURE,
      [userRoles.HotelManager]: process.env.MANAGER_REFRESH_TOKEN_SIGNATURE,
      [userRoles.ADMIN]: process.env.ADMIN_REFRESH_TOKEN_SIGNATURE,
    },
  };

  const secretKey = keys[tokenType]?.[role];
  if (!secretKey) throw new Error("Invalid token type or role");
  return secretKey;
};

export const generateToken = ({
  payload,
  tokentype = "access",
  options = {},
}) => {
  try {
    const secretKey = getSecretKey(payload.role, tokentype);
    return jwt.sign(payload, secretKey, options);
  } catch (err) {
    logger.error(`Token generation failed: ${err.message}`, { action: "TOKEN_GENERATION_FAILED", actor: { type: logActorTypes.SYSTEM } });
    throw err;
  }
};

export const verifyToken = ({
  token,
  role = userRoles.CUSTOMER,
  tokenType = "access",
}) => {
  try {
    const secretKey = getSecretKey(role, tokenType);
    return jwt.verify(token, secretKey);
  } catch (err) {
    logger.error(`Token verification failed: ${err.message}`, { action: "TOKEN_VERIFICATION_FAILED", actor: { type: logActorTypes.SYSTEM } });
    throw err;
  }
};

export const decodeToken = async ({ token, tokenType = "access" }) => {
  try {
    if (!token) throw new Error("Token is missing");

    const decodedUser = jwt.decode(token);
    if (!decodedUser) throw new Error("Invalid token");

    const payload = verifyToken({ token, role: decodedUser.role, tokenType });

    const user = await findOne({
      model: userModel,
      filter: { _id: payload.id },
      select: "firstName lastName email role phone status credentialChangedAt",
    });
    if (!user) throw new Error("User not found");

    const isTokenRevoked = await findOne({
      model: RevokedTokenModel,
      filter: { jti: payload.jti },
    });
    if (isTokenRevoked) throw new Error("Invalid login session");

    if (payload.iat < user.credentialChangedAt / 1000)
      throw new Error("Invalid login session");

    return { payload, user };
  } catch (err) {
    logger.error(`Token decode failed: ${err.message}`, { action: "TOKEN_DECODE_FAILED", actor: { type: logActorTypes.SYSTEM } });
    throw new Error(err.message);
  }
};
