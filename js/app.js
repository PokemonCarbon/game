/*
 */
//
"use strict";
//
import { pen, pipe, log, LogType, pipe_async } from "./util.js";
import * as Region from "./region.js";

//
const modsList = ["kanto"];

//
log(LogType.INFO, "Test Info log.");
log(LogType.GOOD, "Test Good log.");
log(LogType.WARN, "Test Warn log.");
log(LogType.ERROR, "Test Error log.");

//
Promise.all(modsList.map((v) => Region.build(v)))
.then(async (x) => {
    log(LogType.GOOD, `Successfully loaded Regions: [${x.map(v => `"${v.name}"`)}]`);
    log(LogType.GOOD, "Starting game!");
});
