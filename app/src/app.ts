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
const rateLimiterParams: IRateLimiterParams = {
  type: RateLimiterType.TokenBucket,
  options: {},
};
const rateLimiter = new RateLimiter(rateLimiterParams);
app.get("/", rateLimiter.rateLimit, (req, res) => {
  res.send("Hello World");
});

//Start Server
app.listen(5000, () => {
  console.log(`Server is starting at PORT 5000`);
});
