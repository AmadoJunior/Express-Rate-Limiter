import { Response } from "./interfaces";
export abstract class AbstractRateLimiter {
  abstract handler(res: Response, token: string): Promise<void>;
}
