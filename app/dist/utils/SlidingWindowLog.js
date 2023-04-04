"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlidingWindowLog = void 0;
const AbstractRateLimitter_1 = require("./AbstractRateLimitter");
class SlidingWindowLog extends AbstractRateLimitter_1.AbstractRateLimiter {
    constructor(options) {
        super();
    }
    handler() { }
}
exports.SlidingWindowLog = SlidingWindowLog;
