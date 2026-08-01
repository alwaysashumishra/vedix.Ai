import UsageEvent from "../models/UsageEvent.js";

const getRequestIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || "unknown";
};

export const trackUsage = (type = "api") => (req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    if (res.statusCode >= 500) return;

    UsageEvent.create({
      type,
      path: req.originalUrl,
      method: req.method,
      statusCode: res.statusCode,
      ip: getRequestIp(req),
      userAgent: req.headers["user-agent"] || "",
      durationMs: Date.now() - startedAt,
    }).catch(() => {});
  });

  next();
};
