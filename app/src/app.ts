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
const rateLimiterParams: IRateLimiterParams = {
  type: RateLimiterType.TokenBucket,
  options: {
    bucketSize: 20,
    refillInterval: 30000,
  },
};
const rateLimiter = new RateLimiter(rateLimiterParams);
app.get("/", rateLimiter.rateLimit, (req, res) => {
  console.log("GET: ", ++count);
  res.status(200).json({ msg: "Hello World" });
});

//Start Server
app.listen(5000, () => {
  console.log(`Server is starting at PORT 5000`);
});
