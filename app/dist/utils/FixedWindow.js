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
var _FixedWindow_reqPerWindow, _FixedWindow_windowLength, _FixedWindow_cache;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedWindow = void 0;
const AbstractRateLimitter_1 = require("./AbstractRateLimitter");
class FixedWindow extends AbstractRateLimitter_1.AbstractRateLimiter {
    //Constructor
    constructor(options) {
        super();
        //Properties
        _FixedWindow_reqPerWindow.set(this, void 0);
        _FixedWindow_windowLength.set(this, void 0);
        _FixedWindow_cache.set(this, void 0);
        __classPrivateFieldSet(this, _FixedWindow_reqPerWindow, options.reqPerWindow, "f");
        __classPrivateFieldSet(this, _FixedWindow_windowLength, options.windowLength, "f");
        __classPrivateFieldSet(this, _FixedWindow_cache, new Map(), "f");
    }
    //Methods
    async handler(res, token) {
        return new Promise((resolve, reject) => {
            let tokenCount = __classPrivateFieldGet(this, _FixedWindow_cache, "f").get(token);
            if (tokenCount === undefined) {
                tokenCount = 0;
                __classPrivateFieldGet(this, _FixedWindow_cache, "f").set(token, tokenCount);
                setTimeout(() => {
                    console.log("Reseting Cache Window");
                    __classPrivateFieldGet(this, _FixedWindow_cache, "f").delete(token);
                }, __classPrivateFieldGet(this, _FixedWindow_windowLength, "f"));
            }
            if (tokenCount < __classPrivateFieldGet(this, _FixedWindow_reqPerWindow, "f")) {
                tokenCount += 1;
                __classPrivateFieldGet(this, _FixedWindow_cache, "f").set(token, tokenCount);
            }
            const currentUsage = tokenCount;
            const isRateLimited = currentUsage >= __classPrivateFieldGet(this, _FixedWindow_reqPerWindow, "f");
            res.append(`X-RateLimit-Limit`, `${__classPrivateFieldGet(this, _FixedWindow_reqPerWindow, "f")}`);
            res.append(`X-RateLimit-Remaining`, `${isRateLimited ? 0 : __classPrivateFieldGet(this, _FixedWindow_reqPerWindow, "f") - currentUsage}`);
            return isRateLimited ? reject() : resolve();
        });
    }
}
exports.FixedWindow = FixedWindow;
_FixedWindow_reqPerWindow = new WeakMap(), _FixedWindow_windowLength = new WeakMap(), _FixedWindow_cache = new WeakMap();
