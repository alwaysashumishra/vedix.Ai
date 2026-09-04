// High-Throughput Token Bucket Rate Limiter Middleware

const hits = new Map();

/**
 * Express Rate Limiter Middleware Factory
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} maxRequests - Max requests allowed per window per IP
 */
export const rateLimiter = ({ windowMs = 60000, maxRequests = 100, message = "Too many requests, please slow down." } = {}) => {
  return (req, res, next) => {
    if (req.method === "OPTIONS") return next();
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "global";
    const now = Date.now();

    let record = hits.get(ip);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      hits.set(ip, record);
      return next();
    }

    record.count += 1;

    if (record.count > maxRequests) {
      res.setHeader("Retry-After", Math.ceil((record.resetTime - now) / 1000));
      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
      });
    }

    next();
  };
};

// Cleanup expired IP records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of hits.entries()) {
    if (now > record.resetTime) {
      hits.delete(ip);
    }
  }
}, 300000);
