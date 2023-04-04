"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlidingWindowCounter = void 0;
const AbstractRateLimitter_1 = require("./AbstractRateLimitter");
class SlidingWindowCounter extends AbstractRateLimitter_1.AbstractRateLimiter {
    constructor(options) {
        super();
    }
    handler() { }
}
exports.SlidingWindowCounter = SlidingWindowCounter;
