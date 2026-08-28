import React, { useContext, useState, useEffect } from "react";
import "./SettingsModal.css";
import { ThemeContext } from "../../context/ThemeContext";
import { assets } from "../../assets/assets";
import { updateProfileUser } from "../../config/auth";
import {
  FiUser,
  FiDroplet,
  FiSliders,
  FiShield,
  FiInfo,
  FiCamera,
  FiCheck,
  FiSave,
  FiTrash2,
  FiDownload,
  FiLogOut,
  FiMoon,
  FiSun,
  FiX,
  FiZap,
  FiCpu,
  FiHardDrive,
  FiCheckCircle,
  FiAlertTriangle,
  FiRefreshCw,
  FiVolume2,
  FiVolumeX,
  FiCalendar,
} from "react-icons/fi";

const SettingsModal = ({ setShowSettings, profile, setProfile }) => {
  const {
    theme,
    toggleTheme,
    openFestivalCalendar,
    activeFestivalData,
    autoFestivalMode,
    toggleAutoFestivalMode,
    setFestivalTheme,
  } = useContext(ThemeContext);

  const currentUser = profile || JSON.parse(localStorage.getItem("user")) || {};

  // Active Tab state: 'profile' | 'appearance' | 'ai' | 'privacy' | 'about'
  const [activeTab, setActiveTab] = useState("profile");

  // Profile Form state
  const [username, setUsername] = useState(currentUser.username || "");
  const [name, setName] = useState(currentUser.name || "");
  const [surname, setSurname] = useState(currentUser.surname || "");
  const [dob, setDob] = useState(currentUser.dob || "");
  const [profilePic, setProfilePic] = useState(currentUser.profilePic || assets.user_icon);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", isError: false });

  // Custom Preferences state
  const [accentColor, setAccentColor] = useState(
    localStorage.getItem("vedix_accent") || "blue"
  );
  const [responseStyle, setResponseStyle] = useState(
    localStorage.getItem("vedix_ai_style") || "balanced"
  );
  const [soundEffects, setSoundEffects] = useState(
    localStorage.getItem("vedix_sound_fx") !== "disabled"
  );
  const [autoSave, setAutoSave] = useState(
    localStorage.getItem("vedix_auto_save") !== "disabled"
  );
  const [fontSize, setFontSize] = useState(
    localStorage.getItem("vedix_font_size") || "medium"
  );

  // Confirm dialogs state
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState("");

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowSettings(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setShowSettings]);

  // Apply accent color to document root attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accentColor);
    localStorage.setItem("vedix_accent", accentColor);
  }, [accentColor]);

  // Handle image upload with validation
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMsg({ text: "Image size should be less than 5MB", isError: true });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile details to database & local storage
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", isError: false });

    try {
      const data = await updateProfileUser({
        userId: currentUser._id,
        email: currentUser.email,
        username,
        name,
        surname,
        dob,
        profilePic,
      });

      if (data.success && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        if (setProfile) {
          setProfile(data.user);
        }
        setMsg({ text: "Profile updated successfully! ✨", isError: false });
      } else {
        setMsg({ text: data.message || "Failed to update profile", isError: true });
      }
    } catch (error) {
      console.error(error);
      setMsg({
        text: error.response?.data?.message || "Error updating profile. Please try again.",
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // AI & Appearance preference toggles
  const handleAiStyleChange = (style) => {
    setResponseStyle(style);
    localStorage.setItem("vedix_ai_style", style);
    showToast("AI Response style set to " + style);
  };

  const handleSoundToggle = () => {
    const nextVal = !soundEffects;
    setSoundEffects(nextVal);
    localStorage.setItem("vedix_sound_fx", nextVal ? "enabled" : "disabled");
    showToast(`Sound FX ${nextVal ? "Enabled" : "Disabled"}`);
  };

  const handleAutoSaveToggle = () => {
    const nextVal = !autoSave;
    setAutoSave(nextVal);
    localStorage.setItem("vedix_auto_save", nextVal ? "enabled" : "disabled");
    showToast(`Auto-save ${nextVal ? "Enabled" : "Disabled"}`);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    localStorage.setItem("vedix_font_size", size);
    document.documentElement.setAttribute("data-font-size", size);
    showToast(`Font size set to ${size}`);
  };

  // Export conversations data
  const handleExportData = () => {
    const chats = localStorage.getItem("prevPrompts") || "[]";
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(chats);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vedix_ai_chats_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Chat backup exported successfully!");
  };

  // Clear chats execution
  const executeClearChats = () => {
    localStorage.removeItem("prevPrompts");
    setShowClearConfirm(false);
    showToast("All chat history cleared successfully!");
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  // Logout execution
  const executeLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    if (setProfile) {
      setProfile(null);
    }
    window.location.reload();
  };

  const showToast = (message) => {
    setActionSuccessMsg(message);
    setTimeout(() => {
      setActionSuccessMsg("");
    }, 3000);
  };

  // Storage usage calculator
  const getStorageUsage = () => {
    try {
      const bytes = JSON.stringify(localStorage).length;
      return (bytes / 1024).toFixed(1) + " KB";
    } catch {
      return "0 KB";
    }
  };

  return (
    <div className="settings-modal" onClick={() => setShowSettings(false)}>
      <div className="settings-box" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="settings-header">
          <div className="settings-title-group">
            <div className="settings-icon-badge">
              <FiSliders />
            </div>
            <div>
              <h2>Settings & Preferences</h2>
              <p className="settings-subtitle">Customize your Vedix.AI experience</p>
            </div>
          </div>
          <button className="close-settings" onClick={() => setShowSettings(false)} title="Close Settings (Esc)">
            <FiX />
          </button>
        </div>

        {/* Global Toast Notification */}
        {actionSuccessMsg && (
          <div className="settings-toast-notification">
            <FiCheckCircle /> {actionSuccessMsg}
          </div>
        )}

        {/* Settings Container with Sidebar Tabs & Main Content */}
        <div className="settings-body">
          {/* Left Navigation Tabs */}
          <div className="settings-nav-sidebar">
            <button
              className={`nav-tab-btn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <FiUser className="tab-icon" />
              <span>Profile & Account</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === "appearance" ? "active" : ""}`}
              onClick={() => setActiveTab("appearance")}
            >
              <FiDroplet className="tab-icon" />
              <span>Appearance</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === "ai" ? "active" : ""}`}
              onClick={() => setActiveTab("ai")}
            >
              <FiCpu className="tab-icon" />
              <span>AI Preferences</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === "privacy" ? "active" : ""}`}
              onClick={() => setActiveTab("privacy")}
            >
              <FiShield className="tab-icon" />
              <span>Privacy & Data</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === "about" ? "active" : ""}`}
              onClick={() => setActiveTab("about")}
            >
              <FiInfo className="tab-icon" />
              <span>About & System</span>
            </button>
          </div>

          {/* Right Tab Content */}
          <div className="settings-content-area">
            {/* ================= TAB 1: PROFILE ================= */}
            {activeTab === "profile" && (
              <div className="tab-content fade-in">
                <div className="tab-header">
                  <h3>Profile Information</h3>
                  <p>Manage your account personal details and avatar.</p>
                </div>

                {currentUser && currentUser.email ? (
                  <form className="profile-edit-form" onSubmit={handleSaveProfile}>
                    <div className="profile-upload-wrapper">
                      <div className="avatar-preview-box">
                        <img
                          src={profilePic || assets.user_icon}
                          alt="Avatar"
                          className="avatar-img"
                          onError={(e) => {
                            e.target.src = assets.user_icon;
                          }}
                        />
                        <label htmlFor="settings-profile-upload" className="camera-badge" title="Change Profile Picture">
                          <FiCamera />
                        </label>
                      </div>

                      <input
                        id="settings-profile-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                      />
                      <div className="profile-user-badge">
                        <span className="profile-email">{currentUser.email}</span>
                        <span className="status-pill active-pill">Pro Member</span>
                      </div>
                    </div>

                    {msg.text && (
                      <div className={`settings-msg-banner ${msg.isError ? "error" : "success"}`}>
                        {msg.isError ? <FiAlertTriangle /> : <FiCheckCircle />}
                        <span>{msg.text}</span>
                      </div>
                    )}

                    <div className="form-grid">
                      <div className="input-group">
                        <label>Username</label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="e.g. alex_vedix"
                          required
                        />
                      </div>

                      <div className="input-group">
                        <label>First Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="First Name"
                        />
                      </div>

                      <div className="input-group">
                        <label>Last Name</label>
                        <input
                          type="text"
                          value={surname}
                          onChange={(e) => setSurname(e.target.value)}
                          placeholder="Last Name"
                        />
                      </div>

                      <div className="input-group">
                        <label>Date of Birth</label>
                        <input
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="save-profile-btn" disabled={loading}>
                        {loading ? <FiRefreshCw className="spin-icon" /> : <FiSave />}
                        <span>{loading ? "Saving Changes..." : "Save Profile"}</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="login-prompt-card">
                    <FiUser className="prompt-icon" />
                    <h4>Guest Mode Active</h4>
                    <p>Log in or sign up to personalize your profile and sync your chats across devices.</p>
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB 2: APPEARANCE ================= */}
            {activeTab === "appearance" && (
              <div className="tab-content fade-in">
                <div className="tab-header">
                  <h3>Appearance & Theme</h3>
                  <p>Customize visual themes, color accents, and text layout.</p>
                </div>

                {/* Theme Cards Selection */}
                <div className="section-block">
                  <label className="section-label">Color Theme Mode</label>
                  <div className="theme-cards-grid">
                    <div
                      className={`theme-card ${theme === "light" ? "selected" : ""}`}
                      onClick={() => theme !== "light" && toggleTheme()}
                    >
                      <div className="theme-preview light-preview">
                        <FiSun />
                      </div>
                      <div className="theme-card-info">
                        <span className="theme-name">Light Mode</span>
                        <span className="theme-desc">Clean & bright view</span>
                      </div>
                      {theme === "light" && <FiCheck className="check-badge" />}
                    </div>

                    <div
                      className={`theme-card ${theme === "dark" ? "selected" : ""}`}
                      onClick={() => theme !== "dark" && toggleTheme()}
                    >
                      <div className="theme-preview dark-preview">
                        <FiMoon />
                      </div>
                      <div className="theme-card-info">
                        <span className="theme-name">Dark Mode</span>
                        <span className="theme-desc">Sleek, low-light aesthetic</span>
                      </div>
                      {theme === "dark" && <FiCheck className="check-badge" />}
                    </div>
                  </div>
                </div>

                {/* Dynamic Special Day & Festival Themes Block */}
                <div className="section-block">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <label className="section-label" style={{ margin: 0 }}>Special Day & Festival Themes</label>
                    <button
                      type="button"
                      className="pill-btn active"
                      style={{ background: "linear-gradient(135deg, #dc2626, #f59e0b)", color: "#fff", border: "none" }}
                      onClick={() => {
                        setShowSettings(false);
                        openFestivalCalendar();
                      }}
                    >
                      <FiCalendar /> Open Event Calendar
                    </button>
                  </div>

                  <div className="action-card" style={{ marginTop: "8px" }}>
                    <div className="action-card-info">
                      <div className="action-card-icon" style={{ background: "linear-gradient(135deg, #ef4444, #f59e0b)", color: "#fff" }}>
                        <FiCalendar />
                      </div>
                      <div>
                        <span className="action-card-title">
                          {activeFestivalData ? `${activeFestivalData.icon} ${activeFestivalData.name} Theme Active` : "Auto Special Day Themes"}
                        </span>
                        <span className="action-card-desc">
                          Automatically switch themes on special calendar days like Raksha Bandhan, Diwali, Independence Day, Christmas & more.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`toggle-switch ${autoFestivalMode ? "on" : ""}`}
                      onClick={toggleAutoFestivalMode}
                      title="Toggle Auto-Detect Festival Themes"
                    >
                      <span className="switch-thumb" />
                    </button>
                  </div>
                </div>

                {/* Accent Color Palette Selector */}
                <div className="section-block">
                  <label className="section-label">Accent Color</label>
                  <div className="accent-picker-grid">
                    {[
                      { id: "blue", label: "Electric Blue", color: "#2563eb" },
                      { id: "purple", label: "Violet Glow", color: "#8b5cf6" },
                      { id: "emerald", label: "Emerald Pulse", color: "#10b981" },
                      { id: "crimson", label: "Crimson Flare", color: "#f43f5e" },
                      { id: "amber", label: "Sunset Amber", color: "#f59e0b" },
                    ].map((accent) => (
                      <button
                        key={accent.id}
                        type="button"
                        className={`accent-btn ${accentColor === accent.id ? "active" : ""}`}
                        style={{ "--accent-hex": accent.color }}
                        onClick={() => setAccentColor(accent.id)}
                        title={accent.label}
                      >
                        <span className="accent-dot" style={{ backgroundColor: accent.color }}></span>
                        <span className="accent-name">{accent.label}</span>
                        {accentColor === accent.id && <FiCheck className="accent-check" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography / Font Density */}
                <div className="section-block">
                  <label className="section-label">Font Density</label>
                  <div className="pill-selector">
                    {["small", "medium", "large"].map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={`pill-btn ${fontSize === size ? "active" : ""}`}
                        onClick={() => handleFontSizeChange(size)}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 3: AI PREFERENCES ================= */}
            {activeTab === "ai" && (
              <div className="tab-content fade-in">
                <div className="tab-header">
                  <h3>AI Preferences</h3>
                  <p>Fine-tune AI response tone, interaction speed, and audio feedback.</p>
                </div>

                {/* Response Style */}
                <div className="section-block">
                  <label className="section-label">Response Style & Tone</label>
                  <div className="options-stacked-list">
                    {[
                      { id: "balanced", title: "Balanced (Recommended)", desc: "Well-rounded, informative, and natural responses." },
                      { id: "concise", title: "Concise & Fast", desc: "Short, direct bullet points with minimal preamble." },
                      { id: "creative", title: "Creative & Detailed", desc: "Deeply exploratory, expressive, and detailed reasoning." },
                      { id: "code", title: "Code & Dev Focused", desc: "Optimized for clean snippets, syntax efficiency, and technical precision." },
                    ].map((option) => (
                      <div
                        key={option.id}
                        className={`stacked-option-card ${responseStyle === option.id ? "active" : ""}`}
                        onClick={() => handleAiStyleChange(option.id)}
                      >
                        <div className="option-radio">
                          {responseStyle === option.id && <div className="radio-inner" />}
                        </div>
                        <div className="option-text">
                          <span className="option-title">{option.title}</span>
                          <span className="option-desc">{option.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Toggles */}
                <div className="section-block">
                  <label className="section-label">System Behavior</label>
                  <div className="toggle-list-group">
                    <div className="toggle-item">
                      <div className="toggle-label">
                        <div className="toggle-icon">
                          {soundEffects ? <FiVolume2 /> : <FiVolumeX />}
                        </div>
                        <div>
                          <span className="toggle-title">Sound Effects</span>
                          <span className="toggle-desc">Play subtle micro-audio cues on actions</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`toggle-switch ${soundEffects ? "on" : ""}`}
                        onClick={handleSoundToggle}
                      >
                        <span className="switch-thumb" />
                      </button>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-label">
                        <div className="toggle-icon">
                          <FiZap />
                        </div>
                        <div>
                          <span className="toggle-title">Auto-Save Prompt History</span>
                          <span className="toggle-desc">Automatically persist chat sessions locally</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`toggle-switch ${autoSave ? "on" : ""}`}
                        onClick={handleAutoSaveToggle}
                      >
                        <span className="switch-thumb" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 4: PRIVACY & DATA ================= */}
            {activeTab === "privacy" && (
              <div className="tab-content fade-in">
                <div className="tab-header">
                  <h3>Privacy & Data Control</h3>
                  <p>Manage local data backup, history cleanup, and session control.</p>
                </div>

                {/* Export Backup */}
                <div className="action-card">
                  <div className="action-card-info">
                    <div className="action-card-icon">
                      <FiDownload />
                    </div>
                    <div>
                      <span className="action-card-title">Export Chat Backup</span>
                      <span className="action-card-desc">Download a complete JSON file of your prompts and local data.</span>
                    </div>
                  </div>
                  <button type="button" className="action-btn" onClick={handleExportData}>
                    Export Data
                  </button>
                </div>

                {/* Clear All Chats */}
                <div className="action-card danger-card">
                  <div className="action-card-info">
                    <div className="action-card-icon danger-icon">
                      <FiTrash2 />
                    </div>
                    <div>
                      <span className="action-card-title">Clear All Local Chats</span>
                      <span className="action-card-desc">Permanently remove all previous prompt history from this browser.</span>
                    </div>
                  </div>
                  {showClearConfirm ? (
                    <div className="confirm-btn-group">
                      <button type="button" className="confirm-btn danger" onClick={executeClearChats}>
                        Confirm Clear
                      </button>
                      <button type="button" className="cancel-btn" onClick={() => setShowClearConfirm(false)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button type="button" className="action-btn danger-btn" onClick={() => setShowClearConfirm(true)}>
                      Clear History
                    </button>
                  )}
                </div>

                {/* Account Logout */}
                {currentUser && currentUser.email && (
                  <div className="action-card danger-card">
                    <div className="action-card-info">
                      <div className="action-card-icon danger-icon">
                        <FiLogOut />
                      </div>
                      <div>
                        <span className="action-card-title">Logout Account</span>
                        <span className="action-card-desc">Sign out of {currentUser.email} on this device.</span>
                      </div>
                    </div>
                    {showLogoutConfirm ? (
                      <div className="confirm-btn-group">
                        <button type="button" className="confirm-btn danger" onClick={executeLogout}>
                          Confirm Logout
                        </button>
                        <button type="button" className="cancel-btn" onClick={() => setShowLogoutConfirm(false)}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button type="button" className="action-btn danger-btn" onClick={() => setShowLogoutConfirm(true)}>
                        Logout
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB 5: ABOUT & SYSTEM ================= */}
            {activeTab === "about" && (
              <div className="tab-content fade-in">
                <div className="about-hero-card">
                  <div className="hero-logo-box">
                    <span className="hero-logo-icon">✨</span>
                  </div>
                  <h4>Vedix.AI Platform</h4>
                  <span className="version-pill">v2.5.0 Pro</span>
                  <p className="hero-description">
                    Next-generation AI Assistant & Live Intelligence Engine powered by Google Gemini and advanced contextual modules.
                  </p>
                </div>

                <div className="system-metrics-grid">
                  <div className="metric-card">
                    <FiHardDrive className="metric-icon" />
                    <div className="metric-data">
                      <span className="metric-val">{getStorageUsage()}</span>
                      <span className="metric-lbl">Local Storage</span>
                    </div>
                  </div>

                  <div className="metric-card">
                    <FiCheckCircle className="metric-icon success-icon" />
                    <div className="metric-data">
                      <span className="metric-val">Operational</span>
                      <span className="metric-lbl">API Health</span>
                    </div>
                  </div>

                  <div className="metric-card">
                    <FiCpu className="metric-icon" />
                    <div className="metric-data">
                      <span className="metric-val">Gemini 2.5/3.6</span>
                      <span className="metric-lbl">Active Core</span>
                    </div>
                  </div>
                </div>

                <div className="about-footer-info">
                  <p>© 2026 Vedix.AI Systems. All rights reserved.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;