"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedWindow = void 0;
const AbstractRateLimitter_1 = require("./AbstractRateLimitter");
class FixedWindow extends AbstractRateLimitter_1.AbstractRateLimiter {
    constructor(options) {
        super();
    }
    handler() { }
}
exports.FixedWindow = FixedWindow;
