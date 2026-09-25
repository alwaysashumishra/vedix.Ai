import React, { useContext, useState, useEffect } from "react";
import "./SettingsModal.css";
import { ThemeContext } from "../../context/ThemeContext";
import { assets } from "../../assets/assets";
import { updateProfileUser, submitStudentVerificationUser } from "../../config/auth";
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
  FiCreditCard,
  FiAward,
  FiUpload,
} from "react-icons/fi";
import Plans from "../../Pages/Plans/Plans";

const SettingsModal = ({ setShowSettings, profile, setProfile, setShowLogin }) => {
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
  // Student Verification State
  const [collegeName, setCollegeName] = useState(currentUser.studentCollegeName || "");
  const [studentIdCard, setStudentIdCard] = useState(currentUser.studentIdCard || "");
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentMsg, setStudentMsg] = useState({ text: "", isError: false });

  const handleStudentCardUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setStudentMsg({ text: "ID card image should be less than 5MB", isError: true });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudentIdCard(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitStudentVerification = async (e) => {
    e.preventDefault();
    if (!collegeName.trim()) {
      setStudentMsg({ text: "Please enter your college/university name.", isError: true });
      return;
    }
    if (!studentIdCard) {
      setStudentMsg({ text: "Please upload a photo of your Student ID Card.", isError: true });
      return;
    }

    setStudentLoading(true);
    setStudentMsg({ text: "", isError: false });

    try {
      const data = await submitStudentVerificationUser({
        userId: currentUser._id,
        email: currentUser.email,
        collegeName: collegeName.trim(),
        studentIdCard,
      });

      if (data.success && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        if (setProfile) setProfile(data.user);
        setStudentMsg({
          text: "Student verification request submitted successfully! Pending admin verification. ✨",
          isError: false,
        });
      } else {
        setStudentMsg({ text: data.message || "Failed to submit request", isError: true });
      }
    } catch (error) {
      console.error(error);
      setStudentMsg({
        text: error.response?.data?.message || "Failed to submit request. Try again.",
        isError: true,
      });
    } finally {
      setStudentLoading(false);
    }
  };

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
              className={`nav-tab-btn ${activeTab === "plans" ? "active" : ""}`}
              onClick={() => setActiveTab("plans")}
            >
              <FiCreditCard className="tab-icon" />
              <span>Plans & Subscription</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === "student" ? "active" : ""}`}
              onClick={() => setActiveTab("student")}
            >
              <FiAward className="tab-icon" />
              <span>Student Verification 🎓</span>
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

            {/* ================= TAB: PLANS & SUBSCRIPTION ================= */}
            {activeTab === "plans" && (
              <div className="tab-content fade-in">
                <Plans profile={profile} setShowLogin={setShowLogin} isEmbedded={true} />
              </div>
            )}

            {/* ================= TAB: STUDENT VERIFICATION ================= */}
            {activeTab === "student" && (
              <div className="tab-content fade-in">
                <div className="tab-header">
                  <h3>Student Pro Discount 🎓</h3>
                  <p>Get 1 Year of Free Pro Access by verifying your student ID card.</p>
                </div>

                {!currentUser || !currentUser.email ? (
                  <div className="login-prompt-card">
                    <FiUser className="prompt-icon" />
                    <h4>Login Required</h4>
                    <p>Please log in or create an account to submit your student verification request.</p>
                  </div>
                ) : (
                  <div className="student-verification-container">
                    {/* Status Banners */}
                    {currentUser.studentVerificationStatus === "approved" && (
                      <div className="student-status-card approved">
                        <div className="status-card-header">
                          <FiCheckCircle className="status-icon" />
                          <div>
                            <h4>Student Verification Approved! 🎓</h4>
                            <p>You have been granted 1 Year of Free Pro Version Access.</p>
                          </div>
                        </div>
                        <div className="status-details-grid">
                          <div>
                            <span className="detail-lbl">College / University</span>
                            <span className="detail-val">{currentUser.studentCollegeName}</span>
                          </div>
                          <div>
                            <span className="detail-lbl">Pro Access Valid Until</span>
                            <span className="detail-val">
                              {currentUser.proAccessUntil
                                ? new Date(currentUser.proAccessUntil).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "1 Year From Approval Date"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentUser.studentVerificationStatus === "pending" && (
                      <div className="student-status-card pending">
                        <div className="status-card-header">
                          <FiRefreshCw className="status-icon spin-icon" />
                          <div>
                            <h4>Verification Under Review ⏳</h4>
                            <p>Your request has been submitted and is currently being verified by our Admin team.</p>
                          </div>
                        </div>
                        <div className="status-details-grid">
                          <div>
                            <span className="detail-lbl">College / University</span>
                            <span className="detail-val">{currentUser.studentCollegeName}</span>
                          </div>
                          <div>
                            <span className="detail-lbl">Status</span>
                            <span className="detail-val highlight-amber">Pending Admin Verification</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentUser.studentVerificationStatus === "rejected" && (
                      <div className="student-status-card rejected">
                        <div className="status-card-header">
                          <FiAlertTriangle className="status-icon" />
                          <div>
                            <h4>Request Declined</h4>
                            <p>{currentUser.studentRejectReason || "Your Student ID Card could not be verified."}</p>
                          </div>
                        </div>
                        <p className="resubmit-note">You may re-upload a clearer Student ID card photo below.</p>
                      </div>
                    )}

                    {/* Submission Form (only if none, rejected, or re-submitting) */}
                    {(currentUser.studentVerificationStatus !== "approved" &&
                      currentUser.studentVerificationStatus !== "pending") && (
                      <form className="student-submit-form" onSubmit={handleSubmitStudentVerification}>
                        {studentMsg.text && (
                          <div className={`settings-msg-banner ${studentMsg.isError ? "error" : "success"}`}>
                            {studentMsg.isError ? <FiAlertTriangle /> : <FiCheckCircle />}
                            <span>{studentMsg.text}</span>
                          </div>
                        )}

                        <div className="input-group">
                          <label>College / University Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Stanford University / IIT Delhi"
                            value={collegeName}
                            onChange={(e) => setCollegeName(e.target.value)}
                            required
                          />
                        </div>

                        <div className="input-group">
                          <label>Upload Student ID Card (Image)</label>
                          <div className="id-card-upload-box">
                            {studentIdCard ? (
                              <div className="id-card-preview">
                                <img src={studentIdCard} alt="Student ID Preview" />
                                <label htmlFor="id-card-upload-input" className="reupload-badge">
                                  Change Image
                                </label>
                              </div>
                            ) : (
                              <label htmlFor="id-card-upload-input" className="upload-placeholder-box">
                                <FiUpload className="upload-icon" />
                                <span>Click to upload Student ID Card (Max 5MB)</span>
                              </label>
                            )}
                            <input
                              id="id-card-upload-input"
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={handleStudentCardUpload}
                            />
                          </div>
                        </div>

                        <button type="submit" className="save-profile-btn" disabled={studentLoading}>
                          {studentLoading ? <FiRefreshCw className="spin-icon" /> : <FiAward />}
                          <span>{studentLoading ? "Submitting Request..." : "Submit to Admin for Approval"}</span>
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB 5: ABOUT ================= */}
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