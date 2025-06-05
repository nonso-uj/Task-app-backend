import { RateLimiterRedis } from "rate-limiter-flexible";
import redisClient from "./redisClient.js";

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: process.env.NODE_ENV === "production" ? 3 : 100,
  duration: 120,
  blockDuration: 60,
  useRedisPackage: true,
});

const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter
    .consume(req.user.userId)
    .then(() => {
      next();
    })
    .catch((rejRes) => {
      console.log("Redis Error= ", rejRes);
      if (rejRes instanceof Error) {
        res.status(429).json({
          error:
            "An error occured, please try again or contact support if error persists",
        });
      } else {
        const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
        res.set("Retry-After", String(secs));
        res.status(429).json({
          error: "Rate Limit Exceded, retry after " + secs + " seconds",
        });
      }
    });
};

export default rateLimiterMiddleware;
