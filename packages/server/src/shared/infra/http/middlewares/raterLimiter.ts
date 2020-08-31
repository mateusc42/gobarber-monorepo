import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from 'redis';
import AppError from '@shared/errors/AppError';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rateLimit',
  points: 5,
  duration: 1,
});

export default async function raterLimiter(
  err: Error,
  request: Request,
  response: Response,
  _next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip);

    return _next();
  } catch (error) {
    throw new AppError('Too many requests', 429);
  }
}
