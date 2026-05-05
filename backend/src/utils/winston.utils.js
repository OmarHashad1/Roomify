import winston, { format, transports } from "winston";
import { logModel } from "../models/Log/log.model.js";
import { logActorTypes } from "../enums/log.enums.js";

const { timestamp, json, combine } = format;
const { File } = transports;

class MongoTransport extends winston.Transport {
  log(info, callback) {
    setImmediate(() => this.emit("logged", info));

    const { level, message, action, targetId, actor } = info;

    if (!action) return callback();
    
    logModel
      .create({
        level,
        message,
        action,
        targetId: targetId ?? null,
        actor: {
          type: actor?.type ?? logActorTypes.SYSTEM,
          id: actor?.id ?? null,
        },
      })
      .catch(() => {}); 

    callback();
  }
}

export const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), json()),
  transports: [
    new File({ filename: "app.log", level: "info" }),
    new MongoTransport(),
  ],
});
