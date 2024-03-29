//Deps
import express from "express";
import {
  RateLimiter,
  IRateLimiterParams,
  RateLimiterType,
} from "./utils/RateLimiter";

//Setup
const app = express();

//Test Rate Limiter
let count = 0;
//Token Bucket
const rateLimiterParams1: IRateLimiterParams = {
  type: RateLimiterType.TokenBucket,
  options: {
    bucketSize: 20,
    refillInterval: 30000,
    maxConcurrentRequests: 1,
  },
};
//Leaking Bucket
const rateLimiterParams2: IRateLimiterParams = {
  type: RateLimiterType.LeakingBucket,
  options: {
    queueSize: 100,
    flowRate: 20, //Req per interval
    interval: 60000,
    maxQueues: 100,
  },
};
//Fixed Window
const rateLimiterParams3: IRateLimiterParams = {
  type: RateLimiterType.FixedWindow,
  options: {
    reqPerWindow: 20,
    windowLength: 10000,
  },
};
//Sliding Window Counter
const rateLimiterParams4: IRateLimiterParams = {
  type: RateLimiterType.SlidingWindowLog,
  options: {
    reqPerWindow: 20,
    windowLength: 10000,
  },
};
const rateLimiter = new RateLimiter(rateLimiterParams4);
app.get("/", rateLimiter.rateLimit, (req, res) => {
  console.log("GET: ", ++count);
  res.status(200).send("Hello World");
});

//Start Server
app.listen(5000, () => {
  console.log(`Server is starting at PORT 5000`);
});
