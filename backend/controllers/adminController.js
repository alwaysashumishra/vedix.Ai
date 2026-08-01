import AdminConfig from "../models/AdminConfig.js";
import UsageEvent from "../models/UsageEvent.js";
import User from "../models/User.js";

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
  moduleSettings: {},
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
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const [totalUsers, newUsersToday, totalEvents, todayEvents, uniqueActiveIps] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: today } }),
      UsageEvent.countDocuments(),
      UsageEvent.countDocuments({ createdAt: { $gte: today } }),
      UsageEvent.distinct("ip", { createdAt: { $gte: today } }),
    ]);

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

    const recentEvents = await UsageEvent.find()
      .sort({ createdAt: -1 })
      .limit(25)
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
        activeToday: uniqueActiveIps.length,
        todayEvents,
        totalEvents,
      },
      usageLast7Days,
      topPaths: topPaths.map((item) => ({ path: item._id, count: item.count })),
      recentEvents,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Unable to load admin summary" });
  }
};

export const getAdminUsers = async (_req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select("username name surname email profilePic googleId plan credits isBlocked lastAdminNote createdAt updatedAt");

    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Unable to load users" });
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




