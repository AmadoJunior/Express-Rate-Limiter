"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SlidingWindowLog_reqPerWindow, _SlidingWindowLog_windowLength, _SlidingWindowLog_cache;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlidingWindowLog = void 0;
const AbstractRateLimitter_1 = require("./AbstractRateLimitter");
class SlidingWindowLog extends AbstractRateLimitter_1.AbstractRateLimiter {
    //Constructor
    constructor(options) {
        super();
        //Properties
        _SlidingWindowLog_reqPerWindow.set(this, void 0);
        _SlidingWindowLog_windowLength.set(this, void 0);
        _SlidingWindowLog_cache.set(this, void 0);
        __classPrivateFieldSet(this, _SlidingWindowLog_reqPerWindow, options.reqPerWindow, "f");
        __classPrivateFieldSet(this, _SlidingWindowLog_windowLength, options.windowLength, "f");
        __classPrivateFieldSet(this, _SlidingWindowLog_cache, new Map(), "f");
    }
    //Methods
    async handler(res, token) {
        return new Promise((resolve, reject) => {
            let log = __classPrivateFieldGet(this, _SlidingWindowLog_cache, "f").get(token);
            if (log === undefined) {
                log = [];
                __classPrivateFieldGet(this, _SlidingWindowLog_cache, "f").set(token, log);
            }
            const now = Date.now();
            if (log.length > 0) {
                log = log.filter((timestamp) => {
                    return now - timestamp < __classPrivateFieldGet(this, _SlidingWindowLog_windowLength, "f");
                });
                __classPrivateFieldGet(this, _SlidingWindowLog_cache, "f").set(token, log);
            }
            if (log.length < __classPrivateFieldGet(this, _SlidingWindowLog_reqPerWindow, "f")) {
                log.push(now);
                __classPrivateFieldGet(this, _SlidingWindowLog_cache, "f").set(token, log);
            }
            const currentUsage = log.length;
            const isRateLimited = currentUsage >= __classPrivateFieldGet(this, _SlidingWindowLog_reqPerWindow, "f");
            res.append(`X-RateLimit-Limit`, `${__classPrivateFieldGet(this, _SlidingWindowLog_reqPerWindow, "f")}`);
            res.append(`X-RateLimit-Remaining`, `${isRateLimited ? 0 : __classPrivateFieldGet(this, _SlidingWindowLog_reqPerWindow, "f") - currentUsage}`);
            return isRateLimited ? reject() : resolve();
        });
    }
}
exports.SlidingWindowLog = SlidingWindowLog;
_SlidingWindowLog_reqPerWindow = new WeakMap(), _SlidingWindowLog_windowLength = new WeakMap(), _SlidingWindowLog_cache = new WeakMap();
