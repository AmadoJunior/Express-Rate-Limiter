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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _TokenBucket_bucketSize, _TokenBucket_refillInterval, _TokenBucket_tokenBucket, _TokenBucket_maxConcurrentRequests, _TokenBucket_timer;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBucket = void 0;
const AbstractRateLimitter_1 = require("./AbstractRateLimitter");
const lru_cache_1 = __importDefault(require("lru-cache"));
class TokenBucket extends AbstractRateLimitter_1.AbstractRateLimiter {
    //Constructor
    constructor(options) {
        super();
        //Properties
        _TokenBucket_bucketSize.set(this, void 0);
        _TokenBucket_refillInterval.set(this, void 0);
        _TokenBucket_tokenBucket.set(this, void 0);
        _TokenBucket_maxConcurrentRequests.set(this, void 0);
        _TokenBucket_timer.set(this, void 0);
        __classPrivateFieldSet(this, _TokenBucket_bucketSize, options.bucketSize, "f");
        __classPrivateFieldSet(this, _TokenBucket_refillInterval, options.refillInterval, "f");
        __classPrivateFieldSet(this, _TokenBucket_maxConcurrentRequests, options.maxConcurrentRequests, "f");
        __classPrivateFieldSet(this, _TokenBucket_tokenBucket, new lru_cache_1.default({
            max: __classPrivateFieldGet(this, _TokenBucket_maxConcurrentRequests, "f"),
        }), "f");
        this.refill();
    }
    //Methods
    async handler(res, token) {
        return new Promise((resolve, reject) => {
            let tokenCount = __classPrivateFieldGet(this, _TokenBucket_tokenBucket, "f").get(token);
            if (tokenCount === undefined) {
                tokenCount = __classPrivateFieldGet(this, _TokenBucket_bucketSize, "f");
                __classPrivateFieldGet(this, _TokenBucket_tokenBucket, "f").set(token, tokenCount);
            }
            if (tokenCount > 0) {
                tokenCount -= 1;
                __classPrivateFieldGet(this, _TokenBucket_tokenBucket, "f").set(token, tokenCount);
            }
            const currentUsage = __classPrivateFieldGet(this, _TokenBucket_bucketSize, "f") - tokenCount;
            const isRateLimited = currentUsage >= __classPrivateFieldGet(this, _TokenBucket_bucketSize, "f");
            res.append(`X-RateLimit-Limit`, `${__classPrivateFieldGet(this, _TokenBucket_bucketSize, "f")}`);
            res.append(`X-RateLimit-Remaining`, `${isRateLimited ? 0 : __classPrivateFieldGet(this, _TokenBucket_bucketSize, "f") - currentUsage}`);
            return isRateLimited ? reject() : resolve();
        });
    }
    refill() {
        __classPrivateFieldSet(this, _TokenBucket_timer, setInterval(() => {
            __classPrivateFieldGet(this, _TokenBucket_tokenBucket, "f").forEach((value, key, cache) => {
                if (value < __classPrivateFieldGet(this, _TokenBucket_bucketSize, "f")) {
                    __classPrivateFieldGet(this, _TokenBucket_tokenBucket, "f").set(key, value + 1);
                }
            });
        }, __classPrivateFieldGet(this, _TokenBucket_refillInterval, "f")), "f");
    }
}
exports.TokenBucket = TokenBucket;
_TokenBucket_bucketSize = new WeakMap(), _TokenBucket_refillInterval = new WeakMap(), _TokenBucket_tokenBucket = new WeakMap(), _TokenBucket_maxConcurrentRequests = new WeakMap(), _TokenBucket_timer = new WeakMap();
