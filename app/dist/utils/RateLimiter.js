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
var _RateLimiter_limiterInstance;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = exports.RateLimiterType = void 0;
const TokenBucket_1 = require("./TokenBucket");
const LeakingBucket_1 = require("./LeakingBucket");
const FixedWindow_1 = require("./FixedWindow");
const SlidingWindowLog_1 = require("./SlidingWindowLog");
var RateLimiterType;
(function (RateLimiterType) {
    RateLimiterType[RateLimiterType["TokenBucket"] = 0] = "TokenBucket";
    RateLimiterType[RateLimiterType["LeakingBucket"] = 1] = "LeakingBucket";
    RateLimiterType[RateLimiterType["FixedWindow"] = 2] = "FixedWindow";
    RateLimiterType[RateLimiterType["SlidingWindowLog"] = 3] = "SlidingWindowLog";
    RateLimiterType[RateLimiterType["SlidingWindowCounter"] = 4] = "SlidingWindowCounter";
})(RateLimiterType = exports.RateLimiterType || (exports.RateLimiterType = {}));
class RateLimiter {
    //Constructor
    constructor(args) {
        //Properties
        _RateLimiter_limiterInstance.set(this, void 0);
        //Methods
        this.handleError = (err) => {
            return [429, "Too Many Requests"];
        };
        this.rateLimit = async (req, res, next) => {
            try {
                //TODO
                const remoteAddress = req.header("x-forwarded-for") || req.ip;
                await __classPrivateFieldGet(this, _RateLimiter_limiterInstance, "f").handler(res, remoteAddress, next);
                next();
            }
            catch (err) {
                console.error(err);
                const [statusCode, errMsg] = this.handleError(err);
                res.status(statusCode).json({ error: errMsg });
            }
        };
        switch (args.type) {
            case RateLimiterType.TokenBucket:
                __classPrivateFieldSet(this, _RateLimiter_limiterInstance, new TokenBucket_1.TokenBucket(args.options), "f");
                break;
            case RateLimiterType.LeakingBucket:
                __classPrivateFieldSet(this, _RateLimiter_limiterInstance, new LeakingBucket_1.LeakingBucket(args.options), "f");
                break;
            case RateLimiterType.FixedWindow:
                __classPrivateFieldSet(this, _RateLimiter_limiterInstance, new FixedWindow_1.FixedWindow(args.options), "f");
                break;
            case RateLimiterType.SlidingWindowLog:
                __classPrivateFieldSet(this, _RateLimiter_limiterInstance, new SlidingWindowLog_1.SlidingWindowLog(args.options), "f");
                break;
            default:
                __classPrivateFieldSet(this, _RateLimiter_limiterInstance, new TokenBucket_1.TokenBucket(args.options), "f");
        }
    }
}
exports.RateLimiter = RateLimiter;
_RateLimiter_limiterInstance = new WeakMap();
