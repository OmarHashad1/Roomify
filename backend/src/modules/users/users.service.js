import { userModel } from "../../models/User/user.model.js";
import { RevokedTokenModel } from "../../models/revokedToken/revokedToken.model.js";
import { create } from "../../db/db.repo.js";
import { logger } from "../../utils/winston.utils.js";
import { logActorTypes } from "../../enums/log.enums.js";
import { hash, verify } from "../../utils/security/argon.util.js";
import { makeError } from "../../utils/errorMaker.util.js";
import { emailEventEmitter } from "../../events/emails.event.js";
import { EMAIL_EVENTS, CREDENTIAL_CHANGE_TYPES } from "../../enums/email.enums.js";
import { generateToken } from "../../utils/security/token.util.js";
import crypto from "crypto";

const revokeCurrentSession = async ({ jti, iat, userId }) => {
  await create({
    model: RevokedTokenModel,
    data: {
      jti,
      expiresAt: new Date((iat + 7 * 24 * 60 * 60) * 1000),
      userId,
    },
  });
};

export const getProfile = async (userId) => {
  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    logger.warn(`Profile fetch failed — user not found: ${userId}`, {
      action: "PROFILE_FETCH_FAILED",
      targetId: userId,
      actor: {
        type: logActorTypes.USER,
        id: userId,
      },
    });
    throw makeError("User not found", 404);
  }

  logger.info(`Profile fetched: userId=${userId}`, {
    action: "PROFILE_FETCHED",
    targetId: userId,
    actor: { type: logActorTypes.USER, id: userId },
  });

  return user;
};

export const updateProfile = async (userId, updateData, session) => {
  const user = await userModel.findById(userId);

  if (!user) {
    logger.warn(`Profile update failed — user not found: ${userId}`, {
      action: "PROFILE_UPDATE_FAILED",
      targetId: userId,
      actor: {
        type: logActorTypes.USER,
        id: userId,
      },
    });
    throw makeError("User not found", 404);
  }

  const filteredUpdates = {};

  const normalize = (key, value) => {
    if (key === "age" && typeof value === "string") return Number(value);
    if (key === "age" && typeof value === "number") return value;
    if (key === "email" && typeof value === "string") {
      return value.toLowerCase().trim();
    }
    if (typeof value === "string") return value.trim();
    return value;
  };

  for (const key in updateData) {
    const incomingValue = normalize(key, updateData[key]);
    const existingValue = normalize(key, user[key]);

    if (existingValue !== incomingValue) {
      filteredUpdates[key] = incomingValue;
    }
  }

  if (Object.keys(filteredUpdates).length === 0) {
    logger.warn(
      `Profile update failed — no valid changes provided: ${userId}`,
      {
        action: "PROFILE_UPDATE_FAILED",
        targetId: userId,
        actor: {
          type: logActorTypes.USER,
          id: userId,
        },
      },
    );

    throw makeError("No valid changes provided", 400);
  }

  if (filteredUpdates.email) {
    const existingUser = await userModel.findOne({
      email: filteredUpdates.email,
    });

    if (existingUser && existingUser._id.toString() !== userId) {
      logger.warn(
        `Profile update failed — email already in use: ${filteredUpdates.email} (userId=${userId})`,
        {
          action: "PROFILE_UPDATE_FAILED",
          targetId: userId,
          actor: {
            type: logActorTypes.USER,
            id: userId,
          },
        },
      );

      throw makeError("Email already in use by another account", 400);
    }

    await userModel.findByIdAndUpdate(userId, {
      credentialChangedAt: Date.now(),
    });

    if (session?.jti && session?.iat) {
      await revokeCurrentSession({ ...session, userId });
    }
  }

  if (filteredUpdates.phone) {
    const existingUser = await userModel.findOne({
      phone: filteredUpdates.phone,
    });

    if (existingUser && existingUser._id.toString() !== userId) {
      logger.warn(
        `Profile update failed — phone already in use: ${filteredUpdates.phone} (userId=${userId})`,
        {
          action: "PROFILE_UPDATE_FAILED",
          targetId: userId,
          actor: {
            type: logActorTypes.USER,
            id: userId,
          },
        },
      );

      throw makeError("Phone number already in use by another account", 400);
    }
  }

  const previousEmail = user.email;

  const updatedUser = await userModel
    .findByIdAndUpdate(
      userId,
      { ...filteredUpdates, updatedAt: Date.now() },
      { new: true },
    )
    .select("-password");

  if (filteredUpdates.email) {
    emailEventEmitter.emit(EMAIL_EVENTS.CREDENTIALS_CHANGED, {
      to: previousEmail,
      firstName: updatedUser.firstName,
      type: CREDENTIAL_CHANGE_TYPES.EMAIL,
      newEmail: filteredUpdates.email,
    });
  }

  logger.info(`Profile updated: userId=${userId}`, {
    action: "PROFILE_UPDATED",
    targetId: userId,
    actor: { type: logActorTypes.USER, id: userId },
  });

  let accessToken;
  if (!filteredUpdates.email) {
    accessToken = generateToken({
      payload: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
      },
      tokentype: "access",
      options: { expiresIn: "30m", jwtid: crypto.randomUUID() },
    });
  }

  return {
    changes: filteredUpdates,
    user: updatedUser,
    accessToken,
  };
};

export const changePassword = async (
  userId,
  { currentPassword, newPassword },
  session,
) => {
  const user = await userModel.findById(userId);

  if (!user) {
    logger.warn(`Password change failed — user not found: ${userId}`, {
      action: "PASSWORD_CHANGE_FAILED",
      targetId: userId,
      actor: {
        type: logActorTypes.USER,
        id: userId,
      },
    });
    throw makeError("User not found", 404);
  }

  let isValid;
  try {
    isValid = await verify({
      hash: user.password,
      password: currentPassword,
    });
  } catch (err) {
    logger.error(
      `Password verification error for userId=${userId}: ${err.message}`,
      {
        action: "PASSWORD_VERIFICATION_ERROR",
        targetId: userId,
        actor: {
          type: logActorTypes.USER,
          id: userId,
        },
      },
    );

    throw makeError("Something went wrong - Password not changed", 500);
  }

  if (!isValid) {
    logger.warn(
      `Password change failed — incorrect current password: ${userId}`,
      {
        action: "PASSWORD_CHANGE_FAILED",
        targetId: userId,
        actor: {
          type: logActorTypes.USER,
          id: userId,
        },
      },
    );
    throw makeError("Current password is incorrect", 400);
  }

  if (newPassword === currentPassword) {
    logger.warn(
      `Password change failed — password reuse attempted: ${userId}`,
      {
        action: "PASSWORD_CHANGE_FAILED",
        targetId: userId,
        actor: { type: logActorTypes.USER, id: userId },
      },
    );
    throw makeError("Password cannot be reused", 400);
  }

  const hashedNewPassword = await hash({ password: newPassword });

  await userModel.findByIdAndUpdate(
    userId,
    {
      password: hashedNewPassword,
      credentialChangedAt: Date.now(),
      updatedAt: Date.now(),
    },
    { new: true },
  );

  if (session?.jti && session?.iat) {
    await revokeCurrentSession({ ...session, userId });
  }

  emailEventEmitter.emit(EMAIL_EVENTS.CREDENTIALS_CHANGED, {
    to: user.email,
    firstName: user.firstName,
    type: CREDENTIAL_CHANGE_TYPES.PASSWORD,
  });

  logger.info(`Password changed successfully: userId=${userId}`, {
    action: "PASSWORD_CHANGED",
    targetId: userId,
    actor: { type: logActorTypes.USER, id: userId },
  });
};
