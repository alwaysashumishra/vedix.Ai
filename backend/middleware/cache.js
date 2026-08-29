// High-Performance In-Memory TTL Cache Engine for Vedix.AI Backend

const store = new Map();

/**
 * Get item from cache if not expired
 */
export const getCache = (key) => {
  const item = store.get(key);
  if (!item) return null;

  if (Date.now() > item.expiresAt) {
    store.delete(key);
    return null;
  }

  return item.value;
};

/**
 * Set item in cache with TTL in seconds
 */
export const setCache = (key, value, ttlSeconds = 60) => {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  store.set(key, { value, expiresAt });
};

/**
 * Clear specific key or flush all cache
 */
export const clearCache = (key = null) => {
  if (key) {
    store.delete(key);
  } else {
    store.clear();
  }
};

/**
 * Middleware factory for caching Express API routes
 */
export const cacheMiddleware = (ttlSeconds = 60) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") return next();

    const cacheKey = req.originalUrl || req.url;
    const cachedData = getCache(cacheKey);

    if (cachedData) {
      res.setHeader("X-Cache", "HIT");
      return res.status(200).json(cachedData);
    }

    res.setHeader("X-Cache", "MISS");

    // Intercept res.json to cache response
    const originalJson = res.json;
    res.json = function (body) {
      if (res.statusCode === 200 && body && body.success !== false) {
        setCache(cacheKey, body, ttlSeconds);
      }
      return originalJson.call(this, body);
    };

    next();
  };
};

// Periodic garbage collector to clean expired keys every 2 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, item] of store.entries()) {
    if (now > item.expiresAt) {
      store.delete(key);
    }
  }
}, 120000);
