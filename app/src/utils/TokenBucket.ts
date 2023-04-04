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
    this.#tokenBucket = [];
    for (let i = 0; i < this.#bucketSize; i++) {
      this.#tokenBucket.push(1);
    }
    this.refill();
  }

  //Methods
  async handler(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.#tokenBucket.length > 0) {
        this.#tokenBucket.pop();
        resolve();
      } else {
        reject();
      }
    });
  }

  refill(): void {
    this.#timer = setInterval(() => {
      if (this.#tokenBucket.length < this.#bucketSize) {
        this.#tokenBucket.push(1);
      }
    }, this.#refillInterval);
  }
}
