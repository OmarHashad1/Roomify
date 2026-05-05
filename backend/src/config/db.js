import mongoose from "mongoose";
import { logger } from "../utils/winston.utils.js";
import { logActorTypes } from "../enums/log.enums.js";



export const DBConnect = async () => {
  try {
    const URI = process.env.URI;
    await mongoose.connect(URI);
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`, { action: "DB_CONNECTION_FAILED", actor: { type: logActorTypes.SYSTEM } });
    throw new Error("Database connection failed", error);
  }
};
