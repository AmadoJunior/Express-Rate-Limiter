import { AbstractRateLimiter } from "./AbstractRateLimitter";

export interface ISlidingWindowCounterOptions {}

export class SlidingWindowCounter extends AbstractRateLimiter {
  constructor(options: ISlidingWindowCounterOptions) {
    super();
  }
  handler() {}
}
