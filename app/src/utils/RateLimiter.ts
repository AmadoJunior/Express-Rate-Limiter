import { NextFunction, Request, Response } from "./interfaces";
import { TokenBucket, ITokenBucketOptions } from "./TokenBucket";
import { LeakingBucket, ILeakingBucketOptions } from "./LeakingBucket";
import { FixedWindow, IFixedWindowOptions } from "./FixedWindow";
import {
  SlidingWindowCounter,
  ISlidingWindowCounterOptions,
} from "./SlidingWindowCounter";
import { SlidingWindowLog, ISlidingWindowLogOptions } from "./SlidingWindowLog";

export enum RateLimiterType {
  TokenBucket,
  LeakingBucket,
  FixedWindow,
  SlidingWindowLog,
  SlidingWindowCounter,
}

export interface IRateLimiterParams {
  type: RateLimiterType;
  options:
    | ITokenBucketOptions
    | ILeakingBucketOptions
    | IFixedWindowOptions
    | ISlidingWindowCounterOptions
    | ISlidingWindowLogOptions;
}

export class RateLimiter {
  //Properties
  #limiterInstance:
    | TokenBucket
    | LeakingBucket
    | FixedWindow
    | SlidingWindowCounter
    | SlidingWindowLog;

  //Constructor
  constructor(args: IRateLimiterParams) {
    switch (args.type) {
      case RateLimiterType.TokenBucket:
        this.#limiterInstance = new TokenBucket(
          args.options as ITokenBucketOptions
        );
        break;
      case RateLimiterType.LeakingBucket:
        this.#limiterInstance = new LeakingBucket(
          args.options as ILeakingBucketOptions
        );
        break;
      case RateLimiterType.FixedWindow:
        this.#limiterInstance = new FixedWindow(
          args.options as IFixedWindowOptions
        );
        break;
      case RateLimiterType.SlidingWindowLog:
        this.#limiterInstance = new SlidingWindowLog(
          args.options as ISlidingWindowLogOptions
        );
        break;
      default:
        this.#limiterInstance = new TokenBucket(
          args.options as ITokenBucketOptions
        );
    }
  }

  //Methods
  handleError = (err: Error): [number, string] => {
    return [429, "Too Many Requests"];
  };

  rateLimit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      //TODO
      const remoteAddress =
        (req.header("x-forwarded-for") as string) || (req.ip as string);
      await this.#limiterInstance.handler(res, remoteAddress, next);
      next();
    } catch (err) {
      console.error(err);
      const [statusCode, errMsg] = this.handleError(err);
      res.status(statusCode).json({ error: errMsg });
    }
  };
}
