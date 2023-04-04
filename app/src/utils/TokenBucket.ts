import { AbstractRateLimiter } from "./AbstractRateLimitter";

export interface ITokenBucketOptions {
  bucketSize: number;
  refillInterval: number;
}

export class TokenBucket extends AbstractRateLimiter {
  //Properties
  #bucketSize: number;
  #refillInterval: number;
  #tokenBucket: number;
  #timer: NodeJS.Timer;

  //Constructor
  constructor(options: ITokenBucketOptions) {
    super();
    this.#bucketSize = options.bucketSize;
    this.#refillInterval = options.refillInterval;
    this.#tokenBucket = options.bucketSize;
    this.refill();
  }

  //Methods
  async handler(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.#tokenBucket > 0) {
        this.#tokenBucket--;
        resolve();
      } else {
        reject();
      }
    });
  }

  refill(): void {
    this.#timer = setInterval(() => {
      if (this.#tokenBucket < this.#bucketSize) {
        this.#tokenBucket++;
      }
    }, this.#refillInterval);
  }
}
