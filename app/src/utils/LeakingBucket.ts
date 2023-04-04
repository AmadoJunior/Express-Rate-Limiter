import { AbstractRateLimiter } from "./AbstractRateLimitter";
import { Queue } from "./Queue";
import { Response, NextFunction } from "./interfaces";
import LRUCache from "lru-cache";
import { v4 as uuidv4 } from "uuid";

export interface ILeakingBucketOptions {
  queueSize: number;
  flowRate: number; //Req per interval
  interval: number;
  maxQueues: number;
}

export class LeakingBucket extends AbstractRateLimiter {
  #queueCache: LRUCache<string, any>;
  #queueSize: number;
  #flowRate: number;
  #interval: number;
  #timer: NodeJS.Timer;
  #uid: number;

  constructor(options: ILeakingBucketOptions) {
    super();
    this.#queueSize = options.queueSize;
    this.#flowRate = options.flowRate;
    this.#interval = options.interval;
    this.#queueCache = new LRUCache({
      max: options.maxQueues,
    });
    this.#uid = uuidv4();
    this.dequeueInterval();
  }
  async handler(
    res: Response,
    token: string,
    next: NextFunction
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      let queue = this.#queueCache.get(token);
      if (queue === undefined) {
        queue = new Queue();
        this.#queueCache.set(token, queue);
      }
      if (queue.length < this.#queueSize) {
        queue.enqueue(next);
        this.#queueCache.set(token, queue);
      }
      const currentUsage = queue.length;
      const isRateLimited = currentUsage >= this.#queueSize;
      res.append(`X-RateLimit-Limit`, `${this.#queueSize}`);
      res.append(
        `X-RateLimit-Remaining`,
        `${isRateLimited ? 0 : this.#queueSize - currentUsage}`
      );

      return isRateLimited ? reject() : resolve();
    });
  }

  dequeueInterval(): void {
    this.#timer = setInterval(() => {
      this.#queueCache.forEach((queue, key, cache) => {
        if (queue.length > 0) {
          console.log(
            `Dequeuing ${this.#flowRate} requests from ${key}: ${
              queue.length
            }...`
          );
          queue.dequeue();
        }

        this.#queueCache.set(key, queue);
      });
    }, this.#interval / this.#flowRate);
  }
}
