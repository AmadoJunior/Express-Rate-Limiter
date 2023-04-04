"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeakingBucket = void 0;
const AbstractRateLimitter_1 = require("./AbstractRateLimitter");
class LeakingBucket extends AbstractRateLimitter_1.AbstractRateLimiter {
    constructor(options) {
        super();
    }
    handler() { }
}
exports.LeakingBucket = LeakingBucket;
