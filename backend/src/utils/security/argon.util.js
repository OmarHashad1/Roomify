import argon2 from "argon2";
import { logger } from "../winston.utils.js";
import { logActorTypes } from "../../enums/log.enums.js";

export const hash = async ({ password }) => {
  try {
    return await argon2.hash(password);
  } catch (err) {
    logger.error(`Password hashing failed: ${err.message}`, { action: "PASSWORD_HASH_FAILED", actor: { type: logActorTypes.SYSTEM } });
    throw err;
  }
};

export const verify = async ({ hash, password }) => {
  try {
    return await argon2.verify(hash, password);
  } catch (err) {
    logger.error(`Password verification failed: ${err.message}`, { action: "PASSWORD_VERIFY_FAILED", actor: { type: logActorTypes.SYSTEM } });
    throw err;
  }
};
