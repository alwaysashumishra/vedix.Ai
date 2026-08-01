import React, { useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiBarChart2,
  FiBell,
  FiBookOpen,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiCpu,
  FiCreditCard,
  FiDatabase,
  FiDollarSign,
  FiEdit3,
  FiFile,
  FiFileText,
  FiFlag,
  FiFolder,
  FiGrid,
  FiHeadphones,
  FiKey,
  FiLock,
  FiMessageSquare,
  FiRefreshCw,
  FiSearch,
  FiSave,
  FiSettings,
  FiShield,
  FiTrendingUp,
  FiUserCheck,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import BackHomeButton from "../../components/BackHomeButton/BackHomeButton";
import {
  getAdminConfig,
  getAdminSummary,
  getAdminUsers,
  updateAdminConfig,
  updateAdminUser,
} from "../../config/admin";
import "./Admin.css";

const initialConfig = {
  siteNotice: "",
  maintenanceMode: false,
  exploreHeadline: "",
  resumeCta: "",
  researchCta: "",
  freeDailyLimit: 5,
  proPlanPrice: 199,
  premiumPlanPrice: 499,
  moduleSettings: {},
};

const modules = [
  { id: "dashboard", label: "Dashboard", icon: FiGrid, status: "Live" },
  { id: "users", label: "Users", icon: FiUsers, status: "Live" },
  { id: "subscriptions", label: "Subscriptions", icon: FiCreditCard, status: "Planned" },
  { id: "payments", label: "Payments", icon: FiDollarSign, status: "Planned" },
  { id: "ai-models", label: "AI Models", icon: FiCpu, status: "Config" },
  { id: "prompt-studio", label: "Prompt Studio", icon: FiEdit3, status: "Draft" },
  { id: "knowledge-base", label: "Knowledge Base", icon: FiBookOpen, status: "Draft" },
  { id: "resume-analyzer", label: "Resume Analyzer", icon: FiFileText, status: "Live" },
  { id: "research-analyzer", label: "Research Analyzer", icon: FiDatabase, status: "Live" },
  { id: "documents", label: "Documents", icon: FiFolder, status: "Planned" },
  { id: "chats", label: "Chats", icon: FiMessageSquare, status: "Tracked" },
  { id: "integrations", label: "API & Integrations", icon: FiKey, status: "Secure" },
  { id: "credits", label: "Credits", icon: FiZap, status: "Planned" },
  { id: "analytics", label: "Analytics", icon: FiTrendingUp, status: "Live" },
  { id: "logs", label: "Logs", icon: FiFile, status: "Live" },
  { id: "notifications", label: "Notifications", icon: FiBell, status: "Planned" },
  { id: "cms", label: "CMS", icon: FiEdit3, status: "Live" },
  { id: "support", label: "Support", icon: FiHeadphones, status: "Planned" },
  { id: "security", label: "Security", icon: FiLock, status: "Live" },
  { id: "settings", label: "Settings", icon: FiSettings, status: "Live" },
  { id: "admins", label: "Admins", icon: FiUserCheck, status: "Secure" },
  { id: "cost-monitor", label: "AI Cost Monitor", icon: FiDollarSign, status: "Tracked" },
  { id: "feature-flags", label: "Feature Flags", icon: FiFlag, status: "Live" },
];

const moduleDetails = {
  subscriptions: {
    title: "Subscriptions",
    text: "Plan upgrades, free limits, paid tiers, and subscription lifecycle controls will live here.",
    bullets: ["Free, Pro, Premium plan view", "Upgrade/downgrade controls", "Renewal and expiry status"],
  },
  payments: {
    title: "Payments",
    text: "Connect Razorpay, Stripe, or another gateway to see transactions and failed payments here.",
    bullets: ["Payment history", "Refund tracking", "Invoice export"],
  },
  "ai-models": {
    title: "AI Models",
    text: "Manage default AI providers, model names, fallbacks, and temperature style from one place.",
    bullets: ["Primary model", "Fallback model", "Response quality presets"],
  },
  "prompt-studio": {
    title: "Prompt Studio",
    text: "A prompt library for resume, research, chat, code, and image workflows.",
    bullets: ["Versioned prompts", "Tool-specific instructions", "Test prompt output"],
  },
  "knowledge-base": {
    title: "Knowledge Base",
    text: "Upload docs, FAQs, policies, or notes that your AI tools can use later.",
    bullets: ["Source documents", "Searchable entries", "AI retrieval ready"],
  },
  documents: {
    title: "Documents",
    text: "Track uploaded resumes, papers, PDFs, and future generated files.",
    bullets: ["Document library", "Storage usage", "File actions"],
  },
  chats: {
    title: "Chats",
    text: "Monitor chat usage and popular prompts. API usage is already being tracked from backend routes.",
    bullets: ["Daily chat count", "Top prompt categories", "Response health"],
  },
  integrations: {
    title: "API & Integrations",
    text: "Keep third-party service status visible without exposing private keys in frontend.",
    bullets: ["Google OAuth", "News feed", "AI provider", "Payment gateway"],
  },
  credits: {
    title: "Credits",
    text: "Credit balance, usage deductions, and plan limits can be connected here.",
    bullets: ["Daily credits", "Paid credit packs", "Usage deductions"],
  },
  notifications: {
    title: "Notifications",
    text: "Create notices for users, product updates, and maintenance messages.",
    bullets: ["In-app banners", "Email announcements", "Admin alerts"],
  },
  support: {
    title: "Support",
    text: "A support desk for user tickets, bug reports, and feature requests.",
    bullets: ["Open tickets", "Priority labels", "User contact history"],
  },
  admins: {
    title: "Admins",
    text: "Admin access is currently controlled safely through Railway ADMIN_EMAILS.",
    bullets: ["Env protected", "Email allowlist", "JWT verified access"],
  },
  "cost-monitor": {
    title: "AI Cost Monitor",
    text: "Estimate AI usage cost by route and model once provider usage pricing is connected.",
    bullets: ["Token usage", "Model cost", "Tool-wise spend"],
  },
};

const Admin = () => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [summary, setSummary] = useState(null);
  const [usage, setUsage] = useState([]);
  const [topPaths, setTopPaths] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [config, setConfig] = useState(initialConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [savingUserId, setSavingUserId] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [moduleSearch, setModuleSearch] = useState("");

  const activeItem = modules.find((item) => item.id === activeModule) || modules[0];
  const maxUsage = useMemo(() => Math.max(1, ...usage.map((item) => item.count || 0)), [usage]);
  const latestUsers = users.slice(0, 8);
  const moduleConfig = config.moduleSettings?.[activeModule] || {};
  const moduleEnabled = moduleConfig.enabled ?? true;
  const filteredModules = useMemo(() => {
    const query = moduleSearch.trim().toLowerCase();
    if (!query) return modules;
    return modules.filter((item) =>
      `${item.label} ${item.status}`.toLowerCase().includes(query)
    );
  }, [moduleSearch]);

  const loadAdmin = async () => {
    setLoading(true);
    setError("");
    setSaved(false);

    try {
      const [summaryData, usersData, configData] = await Promise.all([
        getAdminSummary(),
        getAdminUsers(),
        getAdminConfig(),
      ]);

      setSummary(summaryData.summary);
      setUsage(summaryData.usageLast7Days || []);
      setTopPaths(summaryData.topPaths || []);
      setRecentEvents(summaryData.recentEvents || []);
      setUsers(usersData.users || []);
      setConfig({ ...initialConfig, ...(configData.config || {}) });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Admin panel load nahi ho paaya. Railway me ADMIN_EMAILS set hai ya nahi check karo."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmin();
  }, []);

  const handleConfigChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleModuleConfigChange = (field, value) => {
    setConfig((prev) => ({
      ...prev,
      moduleSettings: {
        ...(prev.moduleSettings || {}),
        [activeModule]: {
          ...((prev.moduleSettings || {})[activeModule] || {}),
          [field]: value,
        },
      },
    }));
    setSaved(false);
  };

  const saveModuleConfig = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const data = await updateAdminConfig(config);
      setConfig({ ...initialConfig, ...(data.config || {}) });
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || "Module settings save nahi ho paayi");
    } finally {
      setSaving(false);
    }
  };

  const saveConfig = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const data = await updateAdminConfig(config);
      setConfig({ ...initialConfig, ...(data.config || {}) });
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || "Settings save nahi ho paayi");
    } finally {
      setSaving(false);
    }
  };

  const updateUser = async (userId, updates) => {
    setSavingUserId(userId);
    setError("");

    try {
      const data = await updateAdminUser(userId, updates);
      setUsers((prev) => prev.map((user) => (user._id === userId ? data.user : user)));
    } catch (err) {
      setError(err.response?.data?.message || "User update nahi ho paaya");
    } finally {
      setSavingUserId("");
    }
  };
  const statCards = [
    { label: "Total users", value: summary?.totalUsers ?? 0, icon: FiUsers, tone: "green" },
    { label: "New today", value: summary?.newUsersToday ?? 0, icon: FiCheckCircle, tone: "blue" },
    { label: "Active today", value: summary?.activeToday ?? 0, icon: FiActivity, tone: "violet" },
    { label: "API hits today", value: summary?.todayEvents ?? 0, icon: FiBarChart2, tone: "dark" },
  ];

  const renderUsagePanel = () => (
    <section className="admin-panel usage-panel">
      <div className="admin-panel-head">
        <div>
          <p>Usage pulse</p>
          <h2>Last 7 days</h2>
        </div>
        <span>{summary?.totalEvents ?? 0} total tracked actions</span>
      </div>

      <div className="usage-bars">
        {usage.map((item) => (
          <div className="usage-day" key={item.date}>
            <div className="usage-bar-track">
              <span style={{ height: `${Math.max(8, (item.count / maxUsage) * 100)}%` }} />
            </div>
            <strong>{item.count}</strong>
            <p>{new Date(item.date).toLocaleDateString("en-IN", { weekday: "short" })}</p>
          </div>
        ))}
      </div>
    </section>
  );

  const renderUsersPanel = (full = false) => (
    <section className="admin-panel users-panel">
      <div className="admin-panel-head">
        <div>
          <p>Community</p>
          <h2>{full ? "All recent users" : "Latest users"}</h2>
        </div>
        <span>{users.length} shown</span>
      </div>

      <div className="admin-users-list">
        {(full ? users : latestUsers).map((user) => (
          <div className={`admin-user-row ${user.isBlocked ? "blocked" : ""}`} key={user._id}>
            <img src={user.profilePic || "https://api.dicebear.com/8.x/initials/svg?seed=Vedix"} alt="" />
            <div className="admin-user-main">
              <strong>{user.username || user.name || "Vedix user"}</strong>
              <p>{user.email}</p>
              <div className="admin-user-meta">
                <span>{new Date(user.createdAt).toLocaleDateString("en-IN")}</span>
                <b>{user.isBlocked ? "Blocked" : "Active"}</b>
              </div>
            </div>

            <div className="admin-user-controls">
              <select
                value={user.plan || "Free"}
                disabled={savingUserId === user._id}
                onChange={(event) => updateUser(user._id, { plan: event.target.value })}
              >
                <option value="Free">Free</option>
                <option value="Pro">Pro</option>
                <option value="Premium">Premium</option>
              </select>

              <input
                type="number"
                min="0"
                value={user.credits ?? 0}
                disabled={savingUserId === user._id}
                onChange={(event) => updateUser(user._id, { credits: Number(event.target.value) })}
                aria-label="User credits"
              />

              <button
                type="button"
                className={user.isBlocked ? "unblock" : "block"}
                disabled={savingUserId === user._id}
                onClick={() => updateUser(user._id, { isBlocked: !user.isBlocked })}
              >
                {savingUserId === user._id ? "Saving" : user.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>

            {full && (
              <input
                className="admin-note-input"
                value={user.lastAdminNote || ""}
                placeholder="Admin note"
                disabled={savingUserId === user._id}
                onChange={(event) =>
                  setUsers((prev) =>
                    prev.map((item) =>
                      item._id === user._id ? { ...item, lastAdminNote: event.target.value } : item
                    )
                  )
                }
                onBlur={(event) => updateUser(user._id, { lastAdminNote: event.target.value })}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );

  const renderSettingsForm = (compact = false) => (
    <form className={`admin-panel settings-panel ${compact ? "compact" : ""}`} onSubmit={saveConfig}>
      <div className="admin-panel-head">
        <div>
          <p><FiSettings /> Live settings</p>
          <h2>Change without code</h2>
        </div>
      </div>

      <label>
        Site notice
        <input
          value={config.siteNotice || ""}
          onChange={(e) => handleConfigChange("siteNotice", e.target.value)}
          placeholder="Short banner text"
        />
      </label>

      <label>
        Explore headline
        <input
          value={config.exploreHeadline || ""}
          onChange={(e) => handleConfigChange("exploreHeadline", e.target.value)}
        />
      </label>

      <label>
        Resume card text
        <textarea
          value={config.resumeCta || ""}
          onChange={(e) => handleConfigChange("resumeCta", e.target.value)}
          rows="3"
        />
      </label>

      <label>
        Research card text
        <textarea
          value={config.researchCta || ""}
          onChange={(e) => handleConfigChange("researchCta", e.target.value)}
          rows="3"
        />
      </label>

      <div className="admin-inline-fields">
        <label>
          Free limit
          <input
            type="number"
            min="0"
            value={config.freeDailyLimit ?? 0}
            onChange={(e) => handleConfigChange("freeDailyLimit", Number(e.target.value))}
          />
        </label>
        <label>
          Pro price
          <input
            type="number"
            min="0"
            value={config.proPlanPrice ?? 0}
            onChange={(e) => handleConfigChange("proPlanPrice", Number(e.target.value))}
          />
        </label>
      </div>

      <div className="admin-inline-fields">
        <label>
          Premium price
          <input
            type="number"
            min="0"
            value={config.premiumPlanPrice ?? 0}
            onChange={(e) => handleConfigChange("premiumPlanPrice", Number(e.target.value))}
          />
        </label>
        <label className="admin-toggle">
          <input
            type="checkbox"
            checked={Boolean(config.maintenanceMode)}
            onChange={(e) => handleConfigChange("maintenanceMode", e.target.checked)}
          />
          <span>Maintenance mode</span>
        </label>
      </div>

      <button type="submit" disabled={saving}>
        <FiSave /> {saving ? "Saving..." : "Save settings"}
      </button>

      {saved && <p className="admin-saved">Settings saved successfully.</p>}
    </form>
  );

  const renderActivityPanel = () => (
    <section className="admin-panel activity-panel">
      <div className="admin-panel-head">
        <div>
          <p>System logs</p>
          <h2>Recent activity</h2>
        </div>
        <span>{recentEvents.length} events</span>
      </div>

      <div className="activity-table">
        <div className="activity-row activity-head">
          <span>Method</span>
          <span>Route</span>
          <span>Status</span>
          <span>Time</span>
        </div>
        {recentEvents.length ? (
          recentEvents.map((event) => (
            <div className="activity-row" key={event._id}>
              <b>{event.method}</b>
              <span title={event.path}>{event.path}</span>
              <strong className={event.statusCode >= 400 ? "bad" : "ok"}>{event.statusCode}</strong>
              <small>{new Date(event.createdAt).toLocaleString("en-IN")}</small>
            </div>
          ))
        ) : (
          <p className="empty-state">Recent API activity yahan dikhegi.</p>
        )}
      </div>
    </section>
  );
  const renderTopRoutes = () => (
    <section className="admin-panel routes-panel">
      <div className="admin-panel-head">
        <div>
          <p>Popular APIs</p>
          <h2>Top routes</h2>
        </div>
      </div>

      {topPaths.length ? (
        topPaths.map((item) => (
          <div className="route-row" key={item.path}>
            <span>{item.path}</span>
            <strong>{item.count}</strong>
          </div>
        ))
      ) : (
        <p className="empty-state">Usage data deploy ke baad yahan dikhega.</p>
      )}
    </section>
  );

  const renderGenericModule = () => {
    const Icon = activeItem.icon;
    const detail = moduleDetails[activeModule] || {
      title: activeItem.label,
      text: "This module is connected to admin settings and ready for deeper backend integration.",
      bullets: ["Settings persist in database", "Admin can enable or pause", "Operational notes are saved"],
    };

    return (
      <section className="module-workspace">
        <div className="module-focus-card">
          <div className="module-focus-icon"><Icon /></div>
          <div>
            <p>{moduleConfig.status || activeItem.status}</p>
            <h2>{moduleConfig.publicTitle || detail.title}</h2>
            <span>{moduleConfig.description || detail.text}</span>
          </div>
        </div>

        <div className="module-control-grid">
          <article className={moduleEnabled ? "module-control-card live" : "module-control-card paused"}>
            <span>State</span>
            <strong>{moduleEnabled ? "Enabled" : "Paused"}</strong>
            <p>{moduleEnabled ? "Visible for admin operations" : "Paused from admin controls"}</p>
          </article>
          <article className="module-control-card">
            <span>Owner</span>
            <strong>{moduleConfig.owner || "Admin"}</strong>
            <p>Responsible person or team</p>
          </article>
          <article className="module-control-card">
            <span>Action</span>
            <strong>{moduleConfig.actionUrl ? "Linked" : "Not linked"}</strong>
            {moduleConfig.actionUrl ? (
              <a href={moduleConfig.actionUrl} target="_blank" rel="noreferrer">Open action</a>
            ) : (
              <p>Add URL or integration endpoint</p>
            )}
          </article>
        </div>

        <form className="admin-panel module-settings-panel" onSubmit={saveModuleConfig}>
          <div className="admin-panel-head">
            <div>
              <p><FiSettings /> Module control</p>
              <h2>{activeItem.label} settings</h2>
            </div>
            <span>{saved ? "Saved" : "Editable"}</span>
          </div>

          <label className="admin-toggle module-toggle">
            <input
              type="checkbox"
              checked={moduleEnabled}
              onChange={(event) => handleModuleConfigChange("enabled", event.target.checked)}
            />
            <span>Enable this module</span>
          </label>

          <div className="admin-inline-fields">
            <label>
              Module status
              <select
                value={moduleConfig.status || activeItem.status}
                onChange={(event) => handleModuleConfigChange("status", event.target.value)}
              >
                <option value="Live">Live</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Paused">Paused</option>
                <option value="Planned">Planned</option>
                <option value="Needs setup">Needs setup</option>
              </select>
            </label>

            <label>
              Owner
              <input
                value={moduleConfig.owner || ""}
                onChange={(event) => handleModuleConfigChange("owner", event.target.value)}
                placeholder="Admin / Team name"
              />
            </label>
          </div>

          <label>
            Public/admin title
            <input
              value={moduleConfig.publicTitle || ""}
              onChange={(event) => handleModuleConfigChange("publicTitle", event.target.value)}
              placeholder={detail.title}
            />
          </label>

          <label>
            Action URL / integration endpoint
            <input
              value={moduleConfig.actionUrl || ""}
              onChange={(event) => handleModuleConfigChange("actionUrl", event.target.value)}
              placeholder="https://..."
            />
          </label>

          <label>
            Description
            <textarea
              value={moduleConfig.description || ""}
              onChange={(event) => handleModuleConfigChange("description", event.target.value)}
              rows="3"
              placeholder={detail.text}
            />
          </label>

          <label>
            Admin notes
            <textarea
              value={moduleConfig.notes || ""}
              onChange={(event) => handleModuleConfigChange("notes", event.target.value)}
              rows="4"
              placeholder="What should be done next for this module?"
            />
          </label>

          <button type="submit" disabled={saving}>
            <FiSave /> {saving ? "Saving..." : "Save module"}
          </button>
        </form>

        <div className="module-checklist">
          {detail.bullets.map((item) => (
            <article key={item}>
              <FiCheckCircle />
              <span>{item}</span>
            </article>
          ))}
        </div>
      </section>
    );
  };
  const renderContent = () => {
    if (activeModule === "dashboard") {
      return (
        <>
          <div className="admin-stats">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <article className={`admin-stat ${card.tone}`} key={card.label}>
                  <span><Icon /></span>
                  <strong>{card.value}</strong>
                  <p>{card.label}</p>
                </article>
              );
            })}
          </div>
          {renderUsagePanel()}
          {renderUsersPanel()}
        </>
      );
    }

    if (activeModule === "users") return renderUsersPanel(true);
    if (activeModule === "analytics" || activeModule === "logs") return <>{renderUsagePanel()}{renderActivityPanel()}{renderTopRoutes()}</>;
    if (activeModule === "cms" || activeModule === "settings" || activeModule === "feature-flags") return renderSettingsForm();
    if (activeModule === "security") {
      return (
        <section className="module-workspace">
          <div className="module-focus-card security-card">
            <div className="module-focus-icon"><FiShield /></div>
            <div>
              <p>Protected</p>
              <h2>Security</h2>
              <span>Admin access checks JWT token and Railway ADMIN_EMAILS allowlist.</span>
            </div>
          </div>
          <div className="module-checklist">
            <article><FiCheckCircle /><span>Only logged-in allowed admin email can open data APIs.</span></article>
            <article><FiCheckCircle /><span>Private keys stay on Railway backend variables.</span></article>
            <article><FiCheckCircle /><span>Frontend route is protected, backend is the real lock.</span></article>
          </div>
        </section>
      );
    }

    if (activeModule === "resume-analyzer" || activeModule === "research-analyzer") {
      return (
        <>
          {renderGenericModule()}
          {renderSettingsForm(true)}
        </>
      );
    }

    return renderGenericModule();
  };

  return (
    <div className={`admin-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <aside className="admin-nav-panel">
        <div className="admin-brand">
          <span><FiShield /></span>
          <div>
            <strong>Vedix Admin</strong>
            <p>Owner console</p>
          </div>
          <button
            type="button"
            className="admin-sidebar-toggle"
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            aria-label={sidebarCollapsed ? "Expand admin sidebar" : "Collapse admin sidebar"}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        {!sidebarCollapsed && (
          <div className="admin-module-search">
            <FiSearch />
            <input
              value={moduleSearch}
              onChange={(event) => setModuleSearch(event.target.value)}
              placeholder="Search modules"
            />
          </div>
        )}

        <nav className="admin-module-nav" aria-label="Admin modules">
          {filteredModules.map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.id}
                title={item.label}
                className={activeModule === item.id ? "active" : ""}
                onClick={() => setActiveModule(item.id)}
              >
                <Icon />
                <span>{item.label}</span>
                <small>{item.status}</small>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="admin-page">
        <BackHomeButton />

        <header className="admin-hero">
          <div>
            <p className="admin-kicker"><FiShield /> Owner control room</p>
            <h1>{activeItem.label}</h1>
            <p>Manage Vedix.Ai users, content, AI tools, usage, security, and deployment controls from one place.</p>
          </div>

          <button className="admin-refresh" type="button" onClick={loadAdmin} disabled={loading}>
            <FiRefreshCw /> Refresh
          </button>
        </header>

        <section className="admin-command-strip" aria-label="Admin quick status">
          <div>
            <span>Module</span>
            <strong>{activeItem.status}</strong>
          </div>
          <div>
            <span>Control areas</span>
            <strong>{modules.length}</strong>
          </div>
          <div>
            <span>Active today</span>
            <strong>{summary?.activeToday ?? 0}</strong>
          </div>
          <div className={config.maintenanceMode ? "warning" : "healthy"}>
            <span>Website mode</span>
            <strong>{config.maintenanceMode ? "Maintenance" : "Live"}</strong>
          </div>
        </section>

        {error && <div className="admin-alert">{error}</div>}

        {loading ? (
          <div className="admin-loading">Loading admin dashboard...</div>
        ) : (
          <section className="admin-layout-grid">
            <div className="admin-main-column">{renderContent()}</div>
            <aside className="admin-inspector">
              {activeModule === "settings" || activeModule === "cms" || activeModule === "feature-flags"
                ? renderTopRoutes()
                : renderSettingsForm(true)}
              {activeModule !== "analytics" && activeModule !== "logs" && renderTopRoutes()}
            </aside>
          </section>
        )}
      </main>
    </div>
  );
};

export default Admin;








