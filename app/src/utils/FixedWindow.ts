import { AbstractRateLimiter } from "./AbstractRateLimitter";

export interface IFixedWindowOptions {}

export class FixedWindow extends AbstractRateLimiter {
  constructor(options: IFixedWindowOptions) {
    super();
  }
  handler() {}
}
