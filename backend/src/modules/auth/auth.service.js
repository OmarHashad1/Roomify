import { verify, hash } from "../../utils/security/argon.util.js";
import { create, findByEmail } from "../../db/db.repo.js";
import { userModel } from "../../models/User/user.model.js";
import { emailEventEmitter } from "../../events/emails.event.js";
import { EMAIL_EVENTS } from "../../enums/email.enums.js";
import { logger } from "../../utils/winston.utils.js";
import { generateToken } from "../../utils/security/token.util.js";
import crypto from "crypto";
import { LOGOUT_FLAG } from "../../enums/auth.enums.js";
import { RevokedTokenModel } from "../../models/revokedToken/revokedToken.model.js";
import { decodeToken } from "../../utils/security/token.util.js";
import { findOne } from "../../db/db.repo.js";
import { logActorTypes } from "../../enums/log.enums.js";

export const signup = async ({
  firstName,
  lastName,
  email,
  password,
  phone,
  age,
  nationality,
  role,
}) => {
  const userExist = await findByEmail({ model: userModel, email });
  if (userExist) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await hash({ password });

  const { data: user } = await create({
    model: userModel,
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      age,
      nationality,
      role,
    },
  });

  if (!user) {
    throw new Error("User creation failed");
  }

  logger.info(`User created successfully: ${email} (id: ${user._id})`, {
    action: "USER_CREATED",
    targetId: user._id.toString(),
    actor: { type: logActorTypes.SYSTEM },
  });
  emailEventEmitter.emit(EMAIL_EVENTS.SIGNUP, { email, firstName });
  return user;
};

export const login = async ({ email, password }) => {
  const user = await findByEmail({ model: userModel, email });
  if (!user) {
    throw new Error("Invalid email or password");
  }
  if (user.status === "suspended") {
    throw new Error("Account is suspended. Please contact support.");
  }

  const isPasswordValid = await verify({ hash: user.password, password });
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }
  const jti = crypto.randomUUID();
  const payload = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };
  const accessToken = generateToken({
    payload,
    tokentype: "access",
    options: { expiresIn: "30m", jwtid: jti },
  });
  const refreshToken = generateToken({
    payload,
    tokentype: "refresh",
    options: { expiresIn: "1W", jwtid: jti },
  });

  return { accessToken, refreshToken };
};

export const logout = async ({ jti, flag, user, iat }) => {
  switch (flag) {
    case LOGOUT_FLAG.ALL: {
      user.credentialChangedAt = Date.now();
      await user.save();
      logger.info(`Logged out from all sessions: userId=${user._id}`, {
        action: "LOGOUT_ALL_SESSIONS",
        targetId: user._id.toString(),
        actor: { type: logActorTypes.USER, id: user._id },
      });
      return { message: "Logged out from all sessions" };
    }
    case LOGOUT_FLAG.CURRENT: {
      await create({
        model: RevokedTokenModel,
        data: {
          jti,
          expiresAt: new Date((iat + 7 * 24 * 60 * 60) * 1000),
          userId: user._id,
        },
      });
      logger.info(`Token revoked: jti=${jti}, userId=${user._id}`, {
        action: "TOKEN_REVOKED",
        targetId: user._id.toString(),
        actor: { type: logActorTypes.USER, id: user._id },
      });
      return { message: "Logged out from current session" };
    }
    default:
      throw new Error("Invalid logout flag");
  }
};

export const generateAccessToken = async ({ refreshToken }) => {
  const { user } = await decodeToken({
    token: refreshToken,
    tokenType: "refresh",
  });
  if (!user) {
    throw new Error("user not found!");
  }
  const accessToken = generateToken({
    payload: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    tokentype: "access",
    options: { expiresIn: "30m" },
  });
  logger.info(`Access token refreshed: userId=${user._id}`, {
    action: "ACCESS_TOKEN_REFRESHED",
    targetId: user._id.toString(),
    actor: { type: logActorTypes.USER, id: user._id },
  });
  return { accessToken };
};
