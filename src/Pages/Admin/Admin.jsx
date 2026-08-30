import React, { useEffect, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "../../components/NavBar/Navbar";
import {
  getAdminSummary,
  getAdminUsers,
  getAdminConfig,
  updateAdminConfig,
  updateAdminUser,
  deleteAdminUser,
  getServerStatus,
  clearServerCache,
  restartServer,
} from "../../config/admin";
import {
  FiUsers,
  FiActivity,
  FiZap,
  FiCpu,
  FiShield,
  FiRefreshCw,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiAlertTriangle,
  FiLock,
  FiUnlock,
  FiTrendingUp,
  FiPieChart,
  FiServer,
  FiPower,
  FiHardDrive,
  FiSave,
  FiHome,
  FiSliders,
  FiList,
  FiGlobe,
  FiMessageSquare,
  FiMic,
  FiDollarSign,
  FiUserCheck,
  FiTool,
  FiFileText,
  FiAward,
} from "react-icons/fi";
import "./Admin.css";

const Admin = ({ profile, setProfile, setShowLogin }) => {
  // Tabs: 'overview' | 'users' | 'ai' | 'features' | 'pricing' | 'server' | 'logs'
  const [activeTab, setActiveTab] = useState("overview");

  // Summary & Stats Data
  const [summaryData, setSummaryData] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  // Users Management Data
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [userUpdatingId, setUserUpdatingId] = useState(null);

  // User Action Modals
  const [userToDelete, setUserToDelete] = useState(null);
  const [editingCreditsUser, setEditingCreditsUser] = useState(null);
  const [newCreditsVal, setNewCreditsVal] = useState(25);

  // Config Data
  const [config, setConfig] = useState(null);
  const [savingConfig, setSavingConfig] = useState(false);

  // Server Status Data
  const [serverData, setServerData] = useState(null);
  const [loadingServer, setLoadingServer] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [restartingServer, setRestartingServer] = useState(false);

  // Toast notification
  const [toastMsg, setToastMsg] = useState({ text: "", isError: false });

  const showToast = (text, isError = false) => {
    setToastMsg({ text, isError });
    setTimeout(() => setToastMsg({ text: "", isError: false }), 4000);
  };

  // Load All Admin Data
  const loadAllData = async () => {
    setLoadingSummary(true);
    setLoadingUsers(true);

    try {
      const [sumRes, usersRes, configRes, serverRes] = await Promise.all([
        getAdminSummary().catch(() => null),
        getAdminUsers().catch(() => null),
        getAdminConfig().catch(() => null),
        getServerStatus().catch(() => null),
      ]);

      if (sumRes && sumRes.success) setSummaryData(sumRes);
      if (usersRes && usersRes.success) setUsers(usersRes.users || []);
      if (configRes && configRes.success) setConfig(configRes.config || {});
      if (serverRes && serverRes.success) setServerData(serverRes.server || null);
    } catch (err) {
      console.error("Admin Load Error:", err);
      showToast("Error loading admin dashboard data.", true);
    } finally {
      setLoadingSummary(false);
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Fetch Server Health
  const handleFetchServerStatus = async () => {
    setLoadingServer(true);
    try {
      const data = await getServerStatus();
      if (data && data.success) {
        setServerData(data.server);
        showToast("Server health updated! ✅");
      }
    } catch (err) {
      showToast("Failed to fetch server status", true);
    } finally {
      setLoadingServer(false);
    }
  };

  // User Actions
  const handlePlanChange = async (userId, newPlan) => {
    setUserUpdatingId(userId);
    try {
      const data = await updateAdminUser(userId, { plan: newPlan });
      if (data.success) {
        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, plan: newPlan } : u)));
        showToast(`User plan updated to ${newPlan} ✨`);
      } else {
        showToast(data.message || "Failed to update plan", true);
      }
    } catch (err) {
      showToast("Error updating user plan", true);
    } finally {
      setUserUpdatingId(null);
    }
  };

  const handleToggleBlock = async (user) => {
    setUserUpdatingId(user._id);
    const nextStatus = !user.isBlocked;
    try {
      const data = await updateAdminUser(user._id, { isBlocked: nextStatus });
      if (data.success) {
        setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, isBlocked: nextStatus } : u)));
        showToast(`User ${nextStatus ? "Blocked 🚫" : "Unblocked ✅"}`);
      }
    } catch (err) {
      showToast("Error updating user status", true);
    } finally {
      setUserUpdatingId(null);
    }
  };

  const handleToggleAdminRole = async (user) => {
    setUserUpdatingId(user._id);
    const nextAdmin = !user.isAdmin;
    try {
      const data = await updateAdminUser(user._id, { isAdmin: nextAdmin });
      if (data.success) {
        setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, isAdmin: nextAdmin } : u)));
        showToast(`Admin rights ${nextAdmin ? "granted 👑" : "revoked"}`);
      }
    } catch (err) {
      showToast("Error updating admin role", true);
    } finally {
      setUserUpdatingId(null);
    }
  };

  const handleSaveCredits = async () => {
    if (!editingCreditsUser) return;
    setUserUpdatingId(editingCreditsUser._id);
    try {
      const data = await updateAdminUser(editingCreditsUser._id, { credits: Number(newCreditsVal) });
      if (data.success) {
        setUsers((prev) => prev.map((u) => (u._id === editingCreditsUser._id ? { ...u, credits: Number(newCreditsVal) } : u)));
        showToast(`Updated credits to ${newCreditsVal} ✨`);
        setEditingCreditsUser(null);
      }
    } catch (err) {
      showToast("Failed to update credits", true);
    } finally {
      setUserUpdatingId(null);
    }
  };

  const handleDeleteUserConfirm = async () => {
    if (!userToDelete) return;
    setUserUpdatingId(userToDelete._id);
    try {
      const data = await deleteAdminUser(userToDelete._id);
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
        showToast(`User ${userToDelete.username} deleted permanently.`);
        setUserToDelete(null);
      } else {
        showToast(data.message || "Failed to delete user", true);
      }
    } catch (err) {
      showToast("Error deleting user account", true);
    } finally {
      setUserUpdatingId(null);
    }
  };

  // Save Site Config Form
  const handleSaveConfig = async (e) => {
    if (e) e.preventDefault();
    setSavingConfig(true);
    try {
      const data = await updateAdminConfig(config);
      if (data.success) {
        setConfig(data.config);
        showToast("Application settings updated live! 🚀");
      } else {
        showToast(data.message || "Failed to save configuration", true);
      }
    } catch (err) {
      showToast("Error saving site config", true);
    } finally {
      setSavingConfig(false);
    }
  };

  // Clear Server RAM Cache
  const handleFlushCache = async () => {
    try {
      const data = await clearServerCache();
      if (data.success) {
        showToast("RAM Cache flushed successfully! ⚡");
      }
    } catch (err) {
      showToast("Error clearing RAM cache", true);
    }
  };

  // Restart Server
  const handleExecuteRestart = async () => {
    setRestartingServer(true);
    try {
      const data = await restartServer();
      if (data.success) {
        showToast("Server restart requested! Process reloading in 1 second...", false);
        setShowRestartModal(false);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (err) {
      showToast("Server restart signal sent! Reloading page...", false);
      setTimeout(() => window.location.reload(), 2500);
    } finally {
      setRestartingServer(false);
    }
  };

  // Filtered Users Memo
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !userSearch.trim() ||
        u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.name?.toLowerCase().includes(userSearch.toLowerCase());

      const matchPlan = planFilter === "All" || u.plan === planFilter;
      const matchStatus =
        statusFilter === "All" ||
        (statusFilter === "Blocked" && u.isBlocked) ||
        (statusFilter === "Active" && !u.isBlocked);

      return matchSearch && matchPlan && matchStatus;
    });
  }, [users, userSearch, planFilter, statusFilter]);

  const summary = summaryData?.summary || {};
  const usageTrend = summaryData?.usageLast7Days || [];
  const userRegTrend = summaryData?.registrationsLast7Days || [];
  const planBreakdown = summary.planBreakdown || { free: 0, pro: 0, premium: 0 };
  const maxUsageVal = Math.max(...usageTrend.map((d) => d.count), 10);
  const maxRegVal = Math.max(...userRegTrend.map((d) => d.count), 5);

  return (
    <div className="admin-page-wrapper">
      <Navbar profile={profile} setProfile={setProfile} setShowLogin={setShowLogin} />

      {/* Global Toast */}
      {toastMsg.text && (
        <div className={`admin-toast ${toastMsg.isError ? "error" : "success"}`}>
          {toastMsg.isError ? <FiAlertTriangle /> : <FiCheckCircle />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      <div className="admin-container">
        {/* Admin Header */}
        <div className="admin-hero-header">
          <div className="admin-title-group">
            <div className="admin-badge-icon">
              <FiShield />
            </div>
            <div>
              <div className="title-row-flex">
                <h1>Vedix.AI Master Admin Suite</h1>
                <span className="admin-live-status-pill">
                  <span className="live-dot" /> LIVE CONTROL CENTER
                </span>
              </div>
              <p className="admin-subtitle">
                Configure AI prompts, control module toggles, manage users & pricing, and run server operations.
              </p>
            </div>
          </div>

          <div className="admin-header-actions">
            <button className="admin-action-btn secondary" onClick={loadAllData} title="Refresh All Data">
              <FiRefreshCw className={loadingSummary ? "spin-icon" : ""} /> Refresh Data
            </button>
            <NavLink to="/" className="admin-action-btn primary">
              <FiHome /> Return to App
            </NavLink>
          </div>
        </div>

        {/* Top Analytics Metric Cards */}
        <div className="admin-metrics-grid">
          <div className="metric-card-glass">
            <div className="metric-card-header">
              <span className="metric-label">Total Registered Users</span>
              <div className="metric-icon-box blue">
                <FiUsers />
              </div>
            </div>
            <div className="metric-value-row">
              <span className="metric-number">{summary.totalUsers || 0}</span>
              {summary.newUsersToday > 0 && (
                <span className="metric-trend-badge success">
                  <FiTrendingUp /> +{summary.newUsersToday} Today
                </span>
              )}
            </div>
            <span className="metric-subtext">Accounts registered on Vedix.AI</span>
          </div>

          <div className="metric-card-glass">
            <div className="metric-card-header">
              <span className="metric-label">Currently Online (15m)</span>
              <div className="metric-icon-box green">
                <FiActivity />
              </div>
            </div>
            <div className="metric-value-row">
              <span className="metric-number">{summary.onlineNow || summary.activeToday || 0}</span>
              <span className="metric-trend-badge live-pulsing">
                <span className="live-dot-small" /> Live Active
              </span>
            </div>
            <span className="metric-subtext">Active sessions in last 15 minutes</span>
          </div>

          <div className="metric-card-glass">
            <div className="metric-card-header">
              <span className="metric-label">Daily Active Users (DAU)</span>
              <div className="metric-icon-box amber">
                <FiZap />
              </div>
            </div>
            <div className="metric-value-row">
              <span className="metric-number">{summary.activeToday || 0}</span>
              <span className="metric-subtext-pill">Today's Traffic</span>
            </div>
            <span className="metric-subtext">Unique user IPs active today</span>
          </div>

          <div className="metric-card-glass">
            <div className="metric-card-header">
              <span className="metric-label">Plans Distribution</span>
              <div className="metric-icon-box purple">
                <FiPieChart />
              </div>
            </div>
            <div className="metric-plans-mini-grid">
              <div className="plan-chip free">
                <span className="plan-chip-lbl">Free</span>
                <span className="plan-chip-val">{planBreakdown.free}</span>
              </div>
              <div className="plan-chip pro">
                <span className="plan-chip-lbl">Pro</span>
                <span className="plan-chip-val">{planBreakdown.pro}</span>
              </div>
              <div className="plan-chip premium">
                <span className="plan-chip-lbl">Premium</span>
                <span className="plan-chip-val">{planBreakdown.premium}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Master Tabs Navigation */}
        <div className="admin-nav-tabs">
          <button
            className={`admin-tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <FiTrendingUp className="tab-btn-icon" /> Overview & Charts
          </button>

          <button
            className={`admin-tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <FiUsers className="tab-btn-icon" /> Users & Roles ({users.length})
          </button>

          <button
            className={`admin-tab-btn ${activeTab === "ai" ? "active" : ""}`}
            onClick={() => setActiveTab("ai")}
          >
            <FiCpu className="tab-btn-icon" /> AI Persona & Prompts
          </button>

          <button
            className={`admin-tab-btn ${activeTab === "features" ? "active" : ""}`}
            onClick={() => setActiveTab("features")}
          >
            <FiSliders className="tab-btn-icon" /> App Modules & Notices
          </button>

          <button
            className={`admin-tab-btn ${activeTab === "pricing" ? "active" : ""}`}
            onClick={() => setActiveTab("pricing")}
          >
            <FiDollarSign className="tab-btn-icon" /> Plans & Limits
          </button>

          <button
            className={`admin-tab-btn ${activeTab === "server" ? "active" : ""}`}
            onClick={() => setActiveTab("server")}
          >
            <FiServer className="tab-btn-icon" /> Server Operations
          </button>

          <button
            className={`admin-tab-btn ${activeTab === "logs" ? "active" : ""}`}
            onClick={() => setActiveTab("logs")}
          >
            <FiList className="tab-btn-icon" /> Request Audit Logs
          </button>
        </div>

        {/* ================= TAB 1: OVERVIEW & ANALYTICS CHARTS ================= */}
        {activeTab === "overview" && (
          <div className="admin-tab-panel fade-in">
            <div className="charts-grid-container">
              {/* Chart 1: 7-Day API Traffic Line/Bar Chart */}
              <div className="chart-card-box">
                <div className="chart-card-header">
                  <div>
                    <h3>7-Day Request Activity Trend</h3>
                    <p>Total API endpoints and AI prompt queries executed per day</p>
                  </div>
                  <span className="chart-badge-tag">Requests / Day</span>
                </div>

                <div className="svg-chart-container">
                  <svg className="analytics-svg" viewBox="0 0 700 220" preserveAspectRatio="none">
                    {[0.2, 0.5, 0.8].map((ratio, i) => (
                      <line
                        key={i}
                        x1="40"
                        y1={200 * ratio}
                        x2="680"
                        y2={200 * ratio}
                        stroke="rgba(148, 163, 184, 0.2)"
                        strokeDasharray="4 4"
                      />
                    ))}

                    {usageTrend.map((item, idx) => {
                      const barWidth = 40;
                      const x = 70 + idx * 85;
                      const height = Math.max(12, (item.count / maxUsageVal) * 150);
                      const y = 180 - height;

                      return (
                        <g key={item.date} className="chart-bar-group">
                          <rect x={x} y={y} width={barWidth} height={height} rx="8" className="chart-bar-rect" />
                          <text x={x + barWidth / 2} y={y - 8} className="chart-text-val" textAnchor="middle">
                            {item.count}
                          </text>
                          <text x={x + barWidth / 2} y="200" className="chart-text-lbl" textAnchor="middle">
                            {item.date.slice(5)}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Chart 2: 7-Day User Registration Trend */}
              <div className="chart-card-box">
                <div className="chart-card-header">
                  <div>
                    <h3>User Registration Growth</h3>
                    <p>New user accounts created daily over the last 7 days</p>
                  </div>
                  <span className="chart-badge-tag green">New Users / Day</span>
                </div>

                <div className="svg-chart-container">
                  <svg className="analytics-svg" viewBox="0 0 700 220" preserveAspectRatio="none">
                    {userRegTrend.map((item, idx) => {
                      const barWidth = 40;
                      const x = 70 + idx * 85;
                      const height = Math.max(8, (item.count / maxRegVal) * 150);
                      const y = 180 - height;

                      return (
                        <g key={item.date} className="chart-bar-group">
                          <rect x={x} y={y} width={barWidth} height={height} rx="8" className="chart-bar-rect green-bar" />
                          <text x={x + barWidth / 2} y={y - 8} className="chart-text-val" textAnchor="middle">
                            +{item.count}
                          </text>
                          <text x={x + barWidth / 2} y="200" className="chart-text-lbl" textAnchor="middle">
                            {item.date.slice(5)}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>

            {/* Top API Endpoints Table */}
            <div className="admin-table-card margin-top">
              <div className="table-card-header">
                <h3>Top Executed API Routes (7 Days)</h3>
                <p>Most frequently invoked backend endpoints across all users</p>
              </div>
              <div className="table-responsive">
                <table className="admin-custom-table">
                  <thead>
                    <tr>
                      <th>Endpoint Path</th>
                      <th>Total Invocations</th>
                      <th>Traffic Distribution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(summaryData?.topPaths || []).map((pathItem, idx) => {
                      const totalTopCount = (summaryData?.topPaths || []).reduce((acc, p) => acc + p.count, 0) || 1;
                      const pct = Math.round((pathItem.count / totalTopCount) * 100);
                      return (
                        <tr key={idx}>
                          <td>
                            <code className="path-code">{pathItem.path}</code>
                          </td>
                          <td>
                            <strong>{pathItem.count} requests</strong>
                          </td>
                          <td>
                            <div className="progress-bar-wrapper">
                              <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                              <span className="progress-pct">{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: USER MANAGEMENT & ROLES ================= */}
        {activeTab === "users" && (
          <div className="admin-tab-panel fade-in">
            <div className="users-filter-bar">
              <div className="search-input-box">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by username, email, or name..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
                {userSearch && (
                  <button className="clear-search-btn" onClick={() => setUserSearch("")}>
                    ✕
                  </button>
                )}
              </div>

              <div className="filter-select-group">
                <label>Plan:</label>
                <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
                  <option value="All">All Plans</option>
                  <option value="Free">Free</option>
                  <option value="Pro">Pro</option>
                  <option value="Premium">Premium</option>
                </select>

                <label>Status:</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Users</option>
                  <option value="Active">Active Only</option>
                  <option value="Blocked">Blocked Only</option>
                </select>
              </div>
            </div>

            <div className="admin-table-card">
              <div className="table-card-header">
                <h3>User Accounts & Role Privileges ({filteredUsers.length})</h3>
                <p>Manage subscription plans, edit AI credits, grant admin rights, block abuse, or delete accounts.</p>
              </div>

              <div className="table-responsive">
                <table className="admin-custom-table">
                  <thead>
                    <tr>
                      <th>User Info</th>
                      <th>Plan Type</th>
                      <th>AI Credits</th>
                      <th>Role & Status</th>
                      <th>Registered</th>
                      <th>Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((u) => {
                        const isUpdating = userUpdatingId === u._id;
                        const isSystemAdmin = u.email === "ashutoshmmishra15@gmail.com" || u.isAdmin;
                        return (
                          <tr key={u._id} className={u.isBlocked ? "row-blocked" : ""}>
                            <td>
                              <div className="user-table-profile">
                                <img
                                  src={u.profilePic || "/user_icon.png"}
                                  alt="Avatar"
                                  className="user-table-avatar"
                                  onError={(e) => (e.target.src = "/user_icon.png")}
                                />
                                <div>
                                  <div className="username-row-badge">
                                    <span className="user-table-username">{u.username}</span>
                                    {isSystemAdmin && <span className="admin-role-badge">ADMIN 👑</span>}
                                  </div>
                                  <span className="user-table-email">{u.email}</span>
                                </div>
                              </div>
                            </td>

                            <td>
                              <select
                                className={`plan-badge-select ${u.plan?.toLowerCase()}`}
                                value={u.plan || "Free"}
                                disabled={isUpdating}
                                onChange={(e) => handlePlanChange(u._id, e.target.value)}
                              >
                                <option value="Free">Free Plan</option>
                                <option value="Pro">Pro Plan ⭐</option>
                                <option value="Premium">Premium 👑</option>
                              </select>
                            </td>

                            <td>
                              <div className="credits-badge-group">
                                <span className="credits-number">{u.credits ?? 25}</span>
                                <button
                                  className="edit-credits-btn"
                                  title="Edit Credits"
                                  onClick={() => {
                                    setEditingCreditsUser(u);
                                    setNewCreditsVal(u.credits ?? 25);
                                  }}
                                >
                                  <FiEdit />
                                </button>
                              </div>
                            </td>

                            <td>
                              <div className="status-badges-column">
                                {u.isBlocked ? (
                                  <span className="status-badge blocked">
                                    <FiLock /> Blocked
                                  </span>
                                ) : (
                                  <span className="status-badge active">
                                    <FiCheckCircle /> Active
                                  </span>
                                )}
                              </div>
                            </td>

                            <td>
                              <span className="date-text">{new Date(u.createdAt).toLocaleDateString()}</span>
                            </td>

                            <td>
                              <div className="action-buttons-cell">
                                <button
                                  className={`btn-action-sm ${u.isAdmin ? "revoke-admin" : "grant-admin"}`}
                                  disabled={isUpdating || u.email === "ashutoshmmishra15@gmail.com"}
                                  onClick={() => handleToggleAdminRole(u)}
                                  title={u.isAdmin ? "Revoke Admin Role" : "Make Admin"}
                                >
                                  <FiUserCheck />
                                  <span>{u.isAdmin ? "Revoke Admin" : "Make Admin"}</span>
                                </button>

                                <button
                                  className={`btn-action-sm ${u.isBlocked ? "unblock" : "block"}`}
                                  disabled={isUpdating}
                                  onClick={() => handleToggleBlock(u)}
                                >
                                  {u.isBlocked ? <FiUnlock /> : <FiLock />}
                                  <span>{u.isBlocked ? "Unblock" : "Block"}</span>
                                </button>

                                <button
                                  className="btn-action-sm delete"
                                  disabled={isUpdating || u.email === "ashutoshmmishra15@gmail.com"}
                                  onClick={() => setUserToDelete(u)}
                                  title="Delete Account"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="no-data-cell">
                          No users found matching current search/filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: AI MODEL & PERSONA CONTROLS ================= */}
        {activeTab === "ai" && config && (
          <div className="admin-tab-panel fade-in">
            <form onSubmit={handleSaveConfig} className="config-form-layout">
              <div className="config-card">
                <div className="card-header-icon-title">
                  <FiCpu className="card-header-icon" />
                  <div>
                    <h3>AI System Instruction & Model Persona</h3>
                    <p>Customize the master system prompt given to Gemini for all chat responses</p>
                  </div>
                </div>

                <div className="form-group-block margin-top">
                  <label>Global System Instruction / Persona</label>
                  <textarea
                    rows={4}
                    value={config.aiSystemPrompt || ""}
                    onChange={(e) => setConfig({ ...config, aiSystemPrompt: e.target.value })}
                    placeholder="e.g. You are Vedix.AI, a helpful AI built by Vedix Systems..."
                    className="admin-textarea"
                  />
                  <span className="input-hint">
                    This master instruction defines the personality and baseline rules for all AI model completions.
                  </span>
                </div>

                <div className="form-grid-3 margin-top">
                  <div className="form-group-block">
                    <label>Default Response Style</label>
                    <select
                      value={config.defaultAiStyle || "balanced"}
                      onChange={(e) => setConfig({ ...config, defaultAiStyle: e.target.value })}
                      className="admin-select"
                    >
                      <option value="balanced">Balanced (Recommended)</option>
                      <option value="concise">Concise & Direct</option>
                      <option value="creative">Creative & Detailed</option>
                      <option value="code">Software Developer / Code First</option>
                    </select>
                  </div>

                  <div className="form-group-block">
                    <label>Temperature (Creativity: {config.temperature || 0.7})</label>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={config.temperature || 0.7}
                      onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div className="form-group-block">
                    <label>Max Response Tokens</label>
                    <select
                      value={config.maxResponseTokens || 2048}
                      onChange={(e) => setConfig({ ...config, maxResponseTokens: Number(e.target.value) })}
                      className="admin-select"
                    >
                      <option value={1024}>1,024 Tokens (~750 words)</option>
                      <option value={2048}>2,048 Tokens (~1,500 words)</option>
                      <option value={4096}>4,096 Tokens (~3,000 words)</option>
                      <option value={8192}>8,192 Tokens (~6,000 words)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Features & Modality Toggles */}
              <div className="config-card">
                <div className="card-header-icon-title">
                  <FiMic className="card-header-icon green" />
                  <div>
                    <h3>AI Modality & Input Controls</h3>
                    <p>Enable or disable voice recognition, text-to-speech, and vision uploads</p>
                  </div>
                </div>

                <div className="module-toggles-grid margin-top">
                  <div className="module-toggle-card">
                    <div>
                      <span className="module-title">Microphone Speech Input</span>
                      <span className="module-desc">Speech-to-Text dictation in prompt input box</span>
                    </div>
                    <button
                      type="button"
                      className={`toggle-switch ${config.enableVoiceInput !== false ? "on" : ""}`}
                      onClick={() => setConfig({ ...config, enableVoiceInput: !config.enableVoiceInput })}
                    >
                      <span className="switch-thumb" />
                    </button>
                  </div>

                  <div className="module-toggle-card">
                    <div>
                      <span className="module-title">Text-to-Speech Playback</span>
                      <span className="module-desc">Audio playback button on AI responses</span>
                    </div>
                    <button
                      type="button"
                      className={`toggle-switch ${config.enableVoicePlayback !== false ? "on" : ""}`}
                      onClick={() => setConfig({ ...config, enableVoicePlayback: !config.enableVoicePlayback })}
                    >
                      <span className="switch-thumb" />
                    </button>
                  </div>

                  <div className="module-toggle-card">
                    <div>
                      <span className="module-title">Vision / Image Attachment Uploads</span>
                      <span className="module-desc">Upload images for multimodal analysis</span>
                    </div>
                    <button
                      type="button"
                      className={`toggle-switch ${config.enableVisionUploads !== false ? "on" : ""}`}
                      onClick={() => setConfig({ ...config, enableVisionUploads: !config.enableVisionUploads })}
                    >
                      <span className="switch-thumb" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="config-save-bar">
                <button type="submit" className="save-config-btn" disabled={savingConfig}>
                  <FiSave />
                  <span>{savingConfig ? "Saving Changes..." : "Save AI Persona Settings"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB 4: APP MODULES & NOTICES ================= */}
        {activeTab === "features" && config && (
          <div className="admin-tab-panel fade-in">
            <form onSubmit={handleSaveConfig} className="config-form-layout">
              {/* Announcement & Maintenance */}
              <div className="config-card">
                <h3>Global Announcement & Maintenance Engine</h3>
                <p>Broadcast alert banners or toggle application maintenance mode</p>

                <div className="form-grid-3 margin-top">
                  <div className="form-group-block span-2">
                    <label>Global Announcement Text</label>
                    <input
                      type="text"
                      value={config.siteNotice || ""}
                      onChange={(e) => setConfig({ ...config, siteNotice: e.target.value })}
                      placeholder="e.g. Welcome to Vedix.AI Pro!"
                    />
                  </div>

                  <div className="form-group-block">
                    <label>Notice Alert Style</label>
                    <select
                      value={config.noticeType || "info"}
                      onChange={(e) => setConfig({ ...config, noticeType: e.target.value })}
                      className="admin-select"
                    >
                      <option value="info">Info (Blue)</option>
                      <option value="promo">Promo (Purple)</option>
                      <option value="success">Success (Green)</option>
                      <option value="warning">Warning (Amber)</option>
                    </select>
                  </div>
                </div>

                <div className="toggle-setting-row margin-top">
                  <div>
                    <span className="setting-title">Maintenance Mode</span>
                    <span className="setting-desc">Redirect public traffic to maintenance message during backend updates.</span>
                  </div>
                  <button
                    type="button"
                    className={`toggle-switch ${config.maintenanceMode ? "on" : ""}`}
                    onClick={() => setConfig({ ...config, maintenanceMode: !config.maintenanceMode })}
                  >
                    <span className="switch-thumb" />
                  </button>
                </div>

                {config.maintenanceMode && (
                  <div className="form-group-block margin-top">
                    <label>Custom Maintenance Message</label>
                    <input
                      type="text"
                      value={config.maintenanceMessage || ""}
                      onChange={(e) => setConfig({ ...config, maintenanceMessage: e.target.value })}
                      placeholder="Vedix.AI is under maintenance..."
                    />
                  </div>
                )}
              </div>

              {/* All 9 Feature Module Toggles */}
              <div className="config-card">
                <h3>All 9 Feature Module Toggles</h3>
                <p>Enable or disable specific features dynamically across the hosted application</p>

                <div className="module-toggles-grid margin-top">
                  {[
                    { key: "resumeAi", title: "Resume AI Analyzer", desc: "CV scoring & ATS analysis" },
                    { key: "researchAi", title: "Research AI Analyzer", desc: "PDF & paper summarization" },
                    { key: "liveNews", title: "Bilingual Live News", desc: "English & Hindi news feed" },
                    { key: "cricketScorecard", title: "Live Cricket Scorecards", desc: "Live match scorecard widget" },
                    { key: "studyGroups", title: "AI Study Groups", desc: "Collaborative prompt sharing" },
                    { key: "notesManager", title: "AI Notes Manager", desc: "PDF export & saved notes" },
                    { key: "festivalCalendar", title: "Festival & Event Calendar", desc: "Dynamic festival theme engine" },
                    { key: "pdfExport", title: "PDF & Document Export", desc: "1-click response export" },
                    { key: "mobileQrDownload", title: "Mobile App QR Download", desc: "Mobile APK download modal" },
                  ].map((mod) => {
                    const currentMods = config.moduleSettings || {};
                    const isEnabled = currentMods[mod.key] !== false;
                    return (
                      <div key={mod.key} className="module-toggle-card">
                        <div>
                          <span className="module-title">{mod.title}</span>
                          <span className="module-desc">{mod.desc}</span>
                        </div>
                        <button
                          type="button"
                          className={`toggle-switch ${isEnabled ? "on" : ""}`}
                          onClick={() =>
                            setConfig({
                              ...config,
                              moduleSettings: {
                                ...currentMods,
                                [mod.key]: !isEnabled,
                              },
                            })
                          }
                        >
                          <span className="switch-thumb" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Feature Headlines & CTA Text */}
              <div className="config-card">
                <h3>Feature Headlines & CTA Copy</h3>
                <p>Customize banner headlines for Explore, Resume AI, and Research AI</p>

                <div className="form-grid-3 margin-top">
                  <div className="form-group-block">
                    <label>Explore Page Headline</label>
                    <input
                      type="text"
                      value={config.exploreHeadline || ""}
                      onChange={(e) => setConfig({ ...config, exploreHeadline: e.target.value })}
                    />
                  </div>

                  <div className="form-group-block">
                    <label>Resume AI CTA</label>
                    <input
                      type="text"
                      value={config.resumeCta || ""}
                      onChange={(e) => setConfig({ ...config, resumeCta: e.target.value })}
                    />
                  </div>

                  <div className="form-group-block">
                    <label>Research AI CTA</label>
                    <input
                      type="text"
                      value={config.researchCta || ""}
                      onChange={(e) => setConfig({ ...config, researchCta: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="config-save-bar">
                <button type="submit" className="save-config-btn" disabled={savingConfig}>
                  <FiSave />
                  <span>{savingConfig ? "Saving Changes..." : "Save Feature Module Settings"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB 5: PLANS, CREDITS & PRICING ================= */}
        {activeTab === "pricing" && config && (
          <div className="admin-tab-panel fade-in">
            <form onSubmit={handleSaveConfig} className="config-form-layout">
              <div className="config-card">
                <div className="card-header-icon-title">
                  <FiDollarSign className="card-header-icon amber" />
                  <div>
                    <h3>Membership Tier Pricing & Credit Limits Engine</h3>
                    <p>Set signup credits, free daily limits, and monthly plan prices & quotas</p>
                  </div>
                </div>

                <div className="form-grid-3 margin-top">
                  <div className="form-group-block">
                    <label>Default Signup Credits</label>
                    <input
                      type="number"
                      value={config.defaultSignupCredits ?? 25}
                      onChange={(e) => setConfig({ ...config, defaultSignupCredits: Number(e.target.value) })}
                    />
                    <span className="input-hint">Credits granted to new registered accounts</span>
                  </div>

                  <div className="form-group-block">
                    <label>Free Daily Credit Replenish Limit</label>
                    <input
                      type="number"
                      value={config.freeDailyLimit ?? 5}
                      onChange={(e) => setConfig({ ...config, freeDailyLimit: Number(e.target.value) })}
                    />
                    <span className="input-hint">Daily free prompt allowance for Free tier</span>
                  </div>

                  <div className="form-group-block">
                    <label>Pro Plan Monthly Price (₹)</label>
                    <input
                      type="number"
                      value={config.proPlanPrice ?? 199}
                      onChange={(e) => setConfig({ ...config, proPlanPrice: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group-block">
                    <label>Pro Plan Credits / Month</label>
                    <input
                      type="number"
                      value={config.proPlanCredits ?? 500}
                      onChange={(e) => setConfig({ ...config, proPlanCredits: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group-block">
                    <label>Premium Plan Monthly Price (₹)</label>
                    <input
                      type="number"
                      value={config.premiumPlanPrice ?? 499}
                      onChange={(e) => setConfig({ ...config, premiumPlanPrice: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group-block">
                    <label>Premium Plan Credits / Month</label>
                    <input
                      type="number"
                      value={config.premiumPlanCredits ?? 2000}
                      onChange={(e) => setConfig({ ...config, premiumPlanCredits: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div className="config-save-bar">
                <button type="submit" className="save-config-btn" disabled={savingConfig}>
                  <FiSave />
                  <span>{savingConfig ? "Saving Changes..." : "Save Pricing & Limits Engine"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB 6: SERVER OPERATIONS & DIAGNOSTICS ================= */}
        {activeTab === "server" && (
          <div className="admin-tab-panel fade-in">
            <div className="server-status-grid">
              <div className="server-card">
                <div className="server-card-header">
                  <div className="server-title-group">
                    <FiServer className="server-hero-icon" />
                    <div>
                      <h3>Live Node.js Cluster Health</h3>
                      <p>Active worker process health, CPU specs & memory footprint</p>
                    </div>
                  </div>

                  <button
                    className="admin-action-btn secondary sm"
                    onClick={handleFetchServerStatus}
                    disabled={loadingServer}
                  >
                    <FiRefreshCw className={loadingServer ? "spin-icon" : ""} /> Refresh Status
                  </button>
                </div>

                {serverData ? (
                  <div className="server-metrics-list margin-top">
                    <div className="server-metric-item">
                      <span className="lbl">Process ID (PID)</span>
                      <span className="val badge-pid">{serverData.pid}</span>
                    </div>

                    <div className="server-metric-item">
                      <span className="lbl">Node.js Version</span>
                      <span className="val">{serverData.nodeVersion} ({serverData.platform})</span>
                    </div>

                    <div className="server-metric-item">
                      <span className="lbl">Server Uptime</span>
                      <span className="val">
                        {Math.floor(serverData.uptimeSeconds / 3600)}h {Math.floor((serverData.uptimeSeconds % 3600) / 60)}m {serverData.uptimeSeconds % 60}s
                      </span>
                    </div>

                    <div className="server-metric-item">
                      <span className="lbl">MongoDB Connection</span>
                      <span className="val success">{serverData.databaseStatus}</span>
                    </div>

                    <div className="server-metric-item">
                      <span className="lbl">Process RAM Memory (RSS)</span>
                      <span className="val">{serverData.memory?.rssMB} MB</span>
                    </div>

                    <div className="server-metric-item">
                      <span className="lbl">Heap Memory Used</span>
                      <span className="val">{serverData.memory?.heapUsedMB} MB / {serverData.memory?.heapTotalMB} MB</span>
                    </div>

                    <div className="server-metric-item">
                      <span className="lbl">CPU Core Workers</span>
                      <span className="val">{serverData.cpuCores} CPU Cores Active</span>
                    </div>
                  </div>
                ) : (
                  <p className="no-data-text margin-top">Loading server status...</p>
                )}
              </div>

              <div className="server-card">
                <div className="server-card-header">
                  <div>
                    <h3>Server Operations & Control</h3>
                    <p>Trigger cluster worker restarts, flush RAM caches, or test database latency</p>
                  </div>
                </div>

                <div className="server-controls-stack margin-top">
                  <div className="operation-box danger-box">
                    <div>
                      <span className="op-title">Restart Server Process</span>
                      <span className="op-desc">Issues a process restart signal. Worker processes will gracefully reload.</span>
                    </div>
                    <button
                      type="button"
                      className="op-btn danger"
                      onClick={() => setShowRestartModal(true)}
                    >
                      <FiPower /> Restart Server
                    </button>
                  </div>

                  <div className="operation-box">
                    <div>
                      <span className="op-title">Flush In-Memory RAM Cache</span>
                      <span className="op-desc">Clears all cached news feeds, cricket scorecards & admin metrics.</span>
                    </div>
                    <button
                      type="button"
                      className="op-btn secondary"
                      onClick={handleFlushCache}
                    >
                      <FiZap /> Flush RAM Cache
                    </button>
                  </div>

                  <div className="operation-box">
                    <div>
                      <span className="op-title">Database Ping Diagnostic</span>
                      <span className="op-desc">Ping MongoDB Atlas cluster to test read/write latency.</span>
                    </div>
                    <button
                      type="button"
                      className="op-btn secondary"
                      onClick={handleFetchServerStatus}
                    >
                      <FiHardDrive /> Ping Database
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 7: REQUEST AUDIT LOGS ================= */}
        {activeTab === "logs" && (
          <div className="admin-tab-panel fade-in">
            <div className="admin-table-card">
              <div className="table-card-header">
                <h3>Recent System HTTP Invocations</h3>
                <p>Live stream of incoming requests, response status codes, and execution latency</p>
              </div>

              <div className="table-responsive">
                <table className="admin-custom-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Method</th>
                      <th>Path</th>
                      <th>Status Code</th>
                      <th>Latency</th>
                      <th>IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(summaryData?.recentEvents || []).map((ev) => (
                      <tr key={ev._id}>
                        <td>{new Date(ev.createdAt).toLocaleTimeString()}</td>
                        <td>
                          <span className={`method-badge ${ev.method?.toLowerCase()}`}>{ev.method}</span>
                        </td>
                        <td>
                          <code className="path-code">{ev.path}</code>
                        </td>
                        <td>
                          <span className={`status-code-badge ${ev.statusCode < 400 ? "ok" : "err"}`}>
                            {ev.statusCode}
                          </span>
                        </td>
                        <td>{ev.durationMs} ms</td>
                        <td>{ev.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Credits Modal */}
      {editingCreditsUser && (
        <div className="admin-modal-overlay" onClick={() => setEditingCreditsUser(null)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Edit AI Credits for {editingCreditsUser.username}</h3>
            <p>Set remaining AI execution credits for this user account.</p>

            <div className="form-group-block margin-top">
              <label>AI Credits Amount</label>
              <input
                type="number"
                min="0"
                value={newCreditsVal}
                onChange={(e) => setNewCreditsVal(e.target.value)}
              />
            </div>

            <div className="admin-modal-actions margin-top">
              <button className="admin-action-btn primary" onClick={handleSaveCredits}>
                Save Credits
              </button>
              <button className="admin-action-btn secondary" onClick={() => setEditingCreditsUser(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {userToDelete && (
        <div className="admin-modal-overlay" onClick={() => setUserToDelete(null)}>
          <div className="admin-modal-box danger-modal" onClick={(e) => e.stopPropagation()}>
            <FiAlertTriangle className="danger-modal-icon" />
            <h3>Delete Account: {userToDelete.username}?</h3>
            <p>This action is permanent and will remove all user data from Vedix.AI.</p>

            <div className="admin-modal-actions margin-top">
              <button className="admin-action-btn danger" onClick={handleDeleteUserConfirm}>
                Confirm Delete
              </button>
              <button className="admin-action-btn secondary" onClick={() => setUserToDelete(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Server Restart Modal */}
      {showRestartModal && (
        <div className="admin-modal-overlay" onClick={() => setShowRestartModal(false)}>
          <div className="admin-modal-box danger-modal" onClick={(e) => e.stopPropagation()}>
            <FiPower className="danger-modal-icon" />
            <h3>Restart Server Process?</h3>
            <p>This will issue a process exit signal to reload Node.js workers across CPU cores.</p>

            <div className="admin-modal-actions margin-top">
              <button
                className="admin-action-btn danger"
                onClick={handleExecuteRestart}
                disabled={restartingServer}
              >
                {restartingServer ? "Restarting..." : "Confirm Restart Server"}
              </button>
              <button className="admin-action-btn secondary" onClick={() => setShowRestartModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
