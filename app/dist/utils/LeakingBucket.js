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
var _LeakingBucket_queueCache, _LeakingBucket_queueSize, _LeakingBucket_flowRate, _LeakingBucket_interval, _LeakingBucket_timer, _LeakingBucket_uid;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeakingBucket = void 0;
const AbstractRateLimitter_1 = require("./AbstractRateLimitter");
const Queue_1 = require("./Queue");
const lru_cache_1 = __importDefault(require("lru-cache"));
const uuid_1 = require("uuid");
class LeakingBucket extends AbstractRateLimitter_1.AbstractRateLimiter {
    constructor(options) {
        super();
        _LeakingBucket_queueCache.set(this, void 0);
        _LeakingBucket_queueSize.set(this, void 0);
        _LeakingBucket_flowRate.set(this, void 0);
        _LeakingBucket_interval.set(this, void 0);
        _LeakingBucket_timer.set(this, void 0);
        _LeakingBucket_uid.set(this, void 0);
        __classPrivateFieldSet(this, _LeakingBucket_queueSize, options.queueSize, "f");
        __classPrivateFieldSet(this, _LeakingBucket_flowRate, options.flowRate, "f");
        __classPrivateFieldSet(this, _LeakingBucket_interval, options.interval, "f");
        __classPrivateFieldSet(this, _LeakingBucket_queueCache, new lru_cache_1.default({
            max: options.maxQueues,
        }), "f");
        __classPrivateFieldSet(this, _LeakingBucket_uid, (0, uuid_1.v4)(), "f");
        this.dequeueInterval();
    }
    async handler(res, token, next) {
        return new Promise((resolve, reject) => {
            let queue = __classPrivateFieldGet(this, _LeakingBucket_queueCache, "f").get(token);
            if (queue === undefined) {
                queue = new Queue_1.Queue();
                __classPrivateFieldGet(this, _LeakingBucket_queueCache, "f").set(token, queue);
            }
            if (queue.length < __classPrivateFieldGet(this, _LeakingBucket_queueSize, "f")) {
                queue.enqueue(next);
                __classPrivateFieldGet(this, _LeakingBucket_queueCache, "f").set(token, queue);
            }
            const currentUsage = queue.length;
            const isRateLimited = currentUsage >= __classPrivateFieldGet(this, _LeakingBucket_queueSize, "f");
            res.append(`X-RateLimit-Limit`, `${__classPrivateFieldGet(this, _LeakingBucket_queueSize, "f")}`);
            res.append(`X-RateLimit-Remaining`, `${isRateLimited ? 0 : __classPrivateFieldGet(this, _LeakingBucket_queueSize, "f") - currentUsage}`);
            return isRateLimited ? reject() : resolve();
        });
    }
    dequeueInterval() {
        __classPrivateFieldSet(this, _LeakingBucket_timer, setInterval(() => {
            __classPrivateFieldGet(this, _LeakingBucket_queueCache, "f").forEach((queue, key, cache) => {
                if (queue.length > 0) {
                    console.log(`Dequeuing ${__classPrivateFieldGet(this, _LeakingBucket_flowRate, "f")} requests from ${key}: ${queue.length}...`);
                    queue.dequeue();
                }
                __classPrivateFieldGet(this, _LeakingBucket_queueCache, "f").set(key, queue);
            });
        }, __classPrivateFieldGet(this, _LeakingBucket_interval, "f") / __classPrivateFieldGet(this, _LeakingBucket_flowRate, "f")), "f");
    }
}
exports.LeakingBucket = LeakingBucket;
_LeakingBucket_queueCache = new WeakMap(), _LeakingBucket_queueSize = new WeakMap(), _LeakingBucket_flowRate = new WeakMap(), _LeakingBucket_interval = new WeakMap(), _LeakingBucket_timer = new WeakMap(), _LeakingBucket_uid = new WeakMap();
