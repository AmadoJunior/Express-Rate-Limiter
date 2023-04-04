import { AbstractRateLimiter } from "./AbstractRateLimitter";
import { Response } from "./interfaces";

export interface IFixedWindowOptions {
  reqPerWindow: number;
  windowLength: number;
  maxUsers: number;
}

export class FixedWindow extends AbstractRateLimiter {
  //Properties
  #reqPerWindow: number;
  #windowLength: number;
  #maxUsers: number;
  #cache: Map<string, number>;

  //Constructor
  constructor(options: IFixedWindowOptions) {
    super();
    this.#reqPerWindow = options.reqPerWindow;
    this.#windowLength = options.windowLength;
    this.#maxUsers = options.maxUsers;
    this.#cache = new Map();
  }

  //Methods
  async handler(res: Response, token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let tokenCount = this.#cache.get(token);
      if (tokenCount === undefined) {
        tokenCount = 0;
        this.#cache.set(token, tokenCount);
        setTimeout(() => {
          console.log("Reseting Cache Window");
          this.#cache.delete(token);
        }, this.#windowLength);
      }

      if (tokenCount < this.#reqPerWindow) {
        tokenCount += 1;
        this.#cache.set(token, tokenCount);
      }

      const currentUsage = tokenCount;
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
