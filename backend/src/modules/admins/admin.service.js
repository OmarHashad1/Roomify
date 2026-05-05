import { logModel } from "../../models/index.js";
import { logLevels } from "../../enums/log.enums.js";

export const listLogs = async () => {
  const [
    errors,
    warns,
    infos,
    errorCount,
    warnCount,
    infoCount,
  ] = await Promise.all([
    logModel
      .find({ level: logLevels.ERROR })
      .sort({ createdAt: -1 })
      .limit(40)
      .lean(),
    logModel
      .find({ level: logLevels.WARN })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
    logModel
      .find({ level: logLevels.INFO })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
    logModel.countDocuments({ level: logLevels.ERROR }),
    logModel.countDocuments({ level: logLevels.WARN }),
    logModel.countDocuments({ level: logLevels.INFO }),
  ]);

  const logs = [...errors, ...warns, ...infos].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const totalLogsCount = {
    logCount: errorCount + warnCount + infoCount,
    errorCount,
    warnCount,
    infoCount,
    shownErrorCount: errors.length,
    shownWarnCount: warns.length,
    shownInfoCount: infos.length,
    shownLogCount: logs.length,
  };

  return { totalLogsCount, logs };
};
