"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Deps
const express_1 = __importDefault(require("express"));
const RateLimiter_1 = require("./utils/RateLimiter");
//Setup
const app = (0, express_1.default)();
//Test Rate Limiter
let count = 0;
const rateLimiterParams = {
    type: RateLimiter_1.RateLimiterType.TokenBucket,
    options: {
        bucketSize: 20,
        refillInterval: 30000,
    },
};
const rateLimiter = new RateLimiter_1.RateLimiter(rateLimiterParams);
app.get("/", rateLimiter.rateLimit, (req, res) => {
    console.log("GET: ", ++count);
    res.status(200).json({ msg: "Hello World" });
});
//Start Server
app.listen(5000, () => {
    console.log(`Server is starting at PORT 5000`);
});
