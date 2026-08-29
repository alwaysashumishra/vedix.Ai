import AdminConfig from "../models/AdminConfig.js";
import UsageEvent from "../models/UsageEvent.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import os from "os";
import { clearCache } from "../middleware/cache.js";

const CONFIG_KEY = "site-settings";

const defaultConfig = {
  siteNotice: "Welcome to Vedix.Ai",
  maintenanceMode: false,
  exploreHeadline: "Explore current news by category",
  resumeCta: "Analyze resume professionally using AI",
  researchCta: "Analyze research papers and summarize concepts",
  freeDailyLimit: 5,
  proPlanPrice: 199,
  premiumPlanPrice: 499,
  moduleSettings: {
    resumeAi: true,
    researchAi: true,
    liveNews: true,
    cricketScorecard: true,
    studyGroups: true,
  },
};

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const getDateKey = (date) => date.toISOString().slice(0, 10);

const getConfigDocument = async () => {
  const config = await AdminConfig.findOneAndUpdate(
    { key: CONFIG_KEY },
    { $setOnInsert: { value: defaultConfig } },
    { returnDocument: "after", upsert: true }
  );

  return {
    ...defaultConfig,
    ...(config.value || {}),
    updatedAt: config.updatedAt,
    updatedBy: config.updatedBy,
  };
};

export const getAdminSummary = async (_req, res) => {
  try {
    const now = new Date();
    const today = startOfDay(now);
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const [
      totalUsers,
      newUsersToday,
      totalEvents,
      todayEvents,
      uniqueActiveIpsToday,
      onlineUsers15m,
      freeUsersCount,
      proUsersCount,
      premiumUsersCount,
      blockedUsersCount,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: today } }),
      UsageEvent.countDocuments(),
      UsageEvent.countDocuments({ createdAt: { $gte: today } }),
      UsageEvent.distinct("ip", { createdAt: { $gte: today } }),
      UsageEvent.distinct("ip", { createdAt: { $gte: fifteenMinsAgo } }),
      User.countDocuments({ plan: "Free" }),
      User.countDocuments({ plan: "Pro" }),
      User.countDocuments({ plan: "Premium" }),
      User.countDocuments({ isBlocked: true }),
    ]);

    // 7-day Request Usage Trend
    const usageAggregate = await UsageEvent.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const usageMap = new Map(usageAggregate.map((item) => [item._id, item.count]));
    const usageLast7Days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + index);
      const key = getDateKey(date);
      return {
        date: key,
        count: usageMap.get(key) || 0,
      };
    });

    // 7-day User Registrations Trend
    const userRegAggregate = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const userRegMap = new Map(userRegAggregate.map((item) => [item._id, item.count]));
    const registrationsLast7Days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + index);
      const key = getDateKey(date);
      return {
        date: key,
        count: userRegMap.get(key) || 0,
      };
    });

    const recentEvents = await UsageEvent.find()
      .sort({ createdAt: -1 })
      .limit(30)
      .select("type path method statusCode ip durationMs createdAt");

    const topPaths = await UsageEvent.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: "$path", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    res.json({
      success: true,
      summary: {
        totalUsers,
        newUsersToday,
        activeToday: uniqueActiveIpsToday.length,
        onlineNow: onlineUsers15m.length || Math.min(totalUsers, Math.max(1, uniqueActiveIpsToday.length)),
        todayEvents,
        totalEvents,
        blockedUsers: blockedUsersCount,
        planBreakdown: {
          free: freeUsersCount,
          pro: proUsersCount,
          premium: premiumUsersCount,
        },
      },
      usageLast7Days,
      registrationsLast7Days,
      topPaths: topPaths.map((item) => ({ path: item._id, count: item.count })),
      recentEvents,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Unable to load admin summary" });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const { plan, status, search, limit = 100 } = req.query;

    const query = {};

    if (plan && ["Free", "Pro", "Premium"].includes(plan)) {
      query.plan = plan;
    }

    if (status === "blocked") {
      query.isBlocked = true;
    } else if (status === "active") {
      query.isBlocked = false;
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { username: searchRegex },
        { email: searchRegex },
        { name: searchRegex },
        { surname: searchRegex },
      ];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .select("username name surname email profilePic googleId plan credits isBlocked lastAdminNote createdAt updatedAt");

    res.json({ success: true, count: users.length, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Unable to load users" });
  }
};

export const deleteAdminUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: `User ${user.username} deleted permanently.` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to delete user account" });
  }
};

export const getAdminConfig = async (_req, res) => {
  try {
    const config = await getConfigDocument();
    res.json({ success: true, config });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Unable to load settings" });
  }
};

export const updateAdminConfig = async (req, res) => {
  try {
    const allowedFields = Object.keys(defaultConfig);
    const nextValue = allowedFields.reduce((acc, field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        acc[field] = req.body[field];
      }
      return acc;
    }, {});

    const existing = await getConfigDocument();
    const mergedValue = {
      ...defaultConfig,
      ...existing,
      ...nextValue,
    };

    delete mergedValue.updatedAt;
    delete mergedValue.updatedBy;

    const config = await AdminConfig.findOneAndUpdate(
      { key: CONFIG_KEY },
      {
        value: mergedValue,
        updatedBy: req.adminUser?.email || "admin",
      },
      { returnDocument: "after", upsert: true }
    );

    res.json({
      success: true,
      config: {
        ...defaultConfig,
        ...(config.value || {}),
        updatedAt: config.updatedAt,
        updatedBy: config.updatedBy,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Unable to update settings" });
  }
};

export const getPublicConfig = async (_req, res) => {
  try {
    const config = await getConfigDocument();
    const {
      siteNotice,
      maintenanceMode,
      exploreHeadline,
      resumeCta,
      researchCta,
      freeDailyLimit,
      proPlanPrice,
      premiumPlanPrice,
      moduleSettings,
    } = config;

    res.json({
      success: true,
      config: {
        siteNotice,
        maintenanceMode,
        exploreHeadline,
        resumeCta,
        researchCta,
        freeDailyLimit,
        proPlanPrice,
        premiumPlanPrice,
        moduleSettings: moduleSettings || defaultConfig.moduleSettings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to load public settings" });
  }
};

export const updateAdminUser = async (req, res) => {
  try {
    const allowedPlans = ["Free", "Pro", "Premium"];
    const updates = {};

    if (Object.prototype.hasOwnProperty.call(req.body, "plan")) {
      if (!allowedPlans.includes(req.body.plan)) {
        return res.status(400).json({ success: false, message: "Invalid plan selected" });
      }
      updates.plan = req.body.plan;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "credits")) {
      updates.credits = Math.max(0, Number(req.body.credits) || 0);
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "isBlocked")) {
      updates.isBlocked = Boolean(req.body.isBlocked);
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "lastAdminNote")) {
      updates.lastAdminNote = String(req.body.lastAdminNote || "").slice(0, 280);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      returnDocument: "after",
      runValidators: true,
    }).select("username name surname email profilePic googleId plan credits isBlocked lastAdminNote createdAt updatedAt");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Unable to update user" });
  }
};

// Server Operations & Health Diagnostics
export const getServerStatus = async (_req, res) => {
  try {
    const memory = process.memoryUsage();
    const systemMemory = {
      freeMB: (os.freemem() / (1024 * 1024)).toFixed(1),
      totalMB: (os.totalmem() / (1024 * 1024)).toFixed(1),
    };

    const mongoState = mongoose.connection.readyState;
    const mongoStateMap = {
      0: "Disconnected",
      1: "Connected ✅",
      2: "Connecting...",
      3: "Disconnecting...",
    };

    res.json({
      success: true,
      server: {
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        uptimeSeconds: Math.floor(process.uptime()),
        memory: {
          rssMB: (memory.rss / (1024 * 1024)).toFixed(1),
          heapUsedMB: (memory.heapUsed / (1024 * 1024)).toFixed(1),
          heapTotalMB: (memory.heapTotal / (1024 * 1024)).toFixed(1),
        },
        systemMemory,
        databaseStatus: mongoStateMap[mongoState] || "Unknown",
        cpuCores: os.cpus().length,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Unable to load server status" });
  }
};

export const clearServerCache = async (_req, res) => {
  try {
    clearCache();
    res.json({ success: true, message: "In-memory RAM cache cleared successfully! ✨" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to clear RAM cache" });
  }
};

export const restartServer = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Server restart initiated. Process manager will reload workers in 1 second.",
    });

    setTimeout(() => {
      console.log(`[ADMIN ACTION] Controlled server restart triggered by ${req.adminUser?.email || "Admin"}`);
      process.exit(0);
    }, 1000);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to restart server" });
  }
};
