import { AbstractRateLimiter } from "./AbstractRateLimitter";

export interface ILeakingBucketOptions {}

export class LeakingBucket extends AbstractRateLimiter {
  constructor(options: ILeakingBucketOptions) {
    super();
  }
  handler() {}
}
