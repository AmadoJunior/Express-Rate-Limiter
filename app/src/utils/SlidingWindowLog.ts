import { AbstractRateLimiter } from "./AbstractRateLimitter";

export interface ISlidingWindowLogOptions {}

export class SlidingWindowLog extends AbstractRateLimiter {
  constructor(options: ISlidingWindowLogOptions) {
    super();
  }
  handler() {}
}
