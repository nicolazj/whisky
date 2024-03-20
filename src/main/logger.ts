import log from "electron-log/main";
import path from "path";
import {setting} from "./settings";

log.initialize({ preload: true });

log.transports.file.level = "info";
log.transports.file.resolvePathFn = () =>
  path.join(setting.libraryPath(), "logs", "main.log");
log.errorHandler.startCatching();

export default log;
