import { AbstractRateLimiter } from "./AbstractRateLimitter";
import { Response } from "./interfaces";

export interface ISlidingWindowLogOptions {
  reqPerWindow: number;
  windowLength: number;
}

export class SlidingWindowLog extends AbstractRateLimiter {
  //Properties
  #reqPerWindow: number;
  #windowLength: number;
  #cache: Map<string, number[]>;

  //Constructor
  constructor(options: ISlidingWindowLogOptions) {
    super();
    this.#reqPerWindow = options.reqPerWindow;
    this.#windowLength = options.windowLength;
    this.#cache = new Map();
  }

  //Methods
  async handler(res: Response, token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let log = this.#cache.get(token);
      if (log === undefined) {
        log = [];
        this.#cache.set(token, log);
      }
      const now = Date.now();
      if (log.length > 0) {
        log = log.filter((timestamp) => {
          return now - timestamp < this.#windowLength;
        });
        this.#cache.set(token, log);
      }
      if (log.length < this.#reqPerWindow) {
        log.push(now);
        this.#cache.set(token, log);
      }
      const currentUsage = log.length;
      const isRateLimited = currentUsage >= this.#reqPerWindow;
      res.append(`X-RateLimit-Limit`, `${this.#reqPerWindow}`);
      res.append(
        `X-RateLimit-Remaining`,
        `${isRateLimited ? 0 : this.#reqPerWindow - currentUsage}`
      );
      return isRateLimited ? reject() : resolve();
    });
  }
}
