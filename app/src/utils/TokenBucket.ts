import { AbstractRateLimiter } from "./AbstractRateLimitter";
import { Response } from "./interfaces";
import LRUCache from "lru-cache";

export interface ITokenBucketOptions {
  bucketSize: number;
  refillInterval: number;
  maxConcurrentRequests: number;
}

export class TokenBucket extends AbstractRateLimiter {
  //Properties
  #bucketSize: number;
  #refillInterval: number;
  #tokenBucket: LRUCache<string, number>;
  #maxConcurrentRequests: number;
  #timer: NodeJS.Timer;

  //Constructor
  constructor(options: ITokenBucketOptions) {
    super();
    this.#bucketSize = options.bucketSize;
    this.#refillInterval = options.refillInterval;
    this.#maxConcurrentRequests = options.maxConcurrentRequests;
    this.#tokenBucket = new LRUCache({
      max: this.#maxConcurrentRequests,
    });

    this.refill();
  }

  //Methods
  async handler(res: Response, token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let tokenCount = this.#tokenBucket.get(token);
      if (tokenCount === undefined) {
        tokenCount = this.#bucketSize;
        this.#tokenBucket.set(token, tokenCount);
      }

      if (tokenCount > 0) {
        tokenCount -= 1;
        this.#tokenBucket.set(token, tokenCount);
      }

      const currentUsage = this.#bucketSize - tokenCount;
      const isRateLimited = currentUsage >= this.#bucketSize;
      res.append(`X-RateLimit-Limit`, `${this.#bucketSize}`);
      res.append(
        `X-RateLimit-Remaining`,
        `${isRateLimited ? 0 : this.#bucketSize - currentUsage}`
      );

      return isRateLimited ? reject() : resolve();
    });
  }

  refill(): void {
    this.#timer = setInterval(() => {
      this.#tokenBucket.forEach((value, key, cache) => {
        if (value < this.#bucketSize) {
          this.#tokenBucket.set(key, value + 1);
        }
      });
    }, this.#refillInterval);
  }
}
