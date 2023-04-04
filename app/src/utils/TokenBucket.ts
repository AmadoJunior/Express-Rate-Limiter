import { AbstractRateLimiter } from "./AbstractRateLimitter";

export interface ITokenBucketOptions {
  bucketSize: number;
  refillInterval: number;
}

export class TokenBucket extends AbstractRateLimiter {
  //Properties
  #bucketSize: number;
  #refillInterval: number;
  #tokenBucket: number[];
  #timer: NodeJS.Timer;

  //Constructor
  constructor(options: ITokenBucketOptions) {
    super();
    this.#bucketSize = options.bucketSize;
    this.#refillInterval = options.refillInterval;
  }

  //Methods
  handler() {
    if (this.#tokenBucket.length > 0) {
      this.#tokenBucket.pop();
      return true;
    } else {
      return false;
    }
  }

  refill() {
    this.#timer = setInterval(() => {
      if (this.#tokenBucket.length < this.#bucketSize) {
        this.#tokenBucket.push(1);
      }
    }, this.#refillInterval);
  }
}
