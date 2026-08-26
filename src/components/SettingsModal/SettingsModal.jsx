import React, { useContext, useState } from "react";
import "./SettingsModal.css";
import { ThemeContext } from "../../context/ThemeContext";
import { assets } from "../../assets/assets";
import { updateProfileUser } from "../../config/auth";
import { FiCamera, FiCheck, FiSave, FiUser } from "react-icons/fi";

const SettingsModal = ({ setShowSettings, profile, setProfile }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const currentUser = profile || JSON.parse(localStorage.getItem("user")) || {};

  const [username, setUsername] = useState(currentUser.username || "");
  const [name, setName] = useState(currentUser.name || "");
  const [surname, setSurname] = useState(currentUser.surname || "");
  const [dob, setDob] = useState(currentUser.dob || "");
  const [profilePic, setProfilePic] = useState(currentUser.profilePic || assets.user_icon);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", isError: false });

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

  const clearChats = () => {
    localStorage.removeItem("prevPrompts");
    window.location.reload();
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    if (setProfile) {
      setProfile(null);
    }
    window.location.reload();
  };

  return (
    <div className="settings-modal" onClick={() => setShowSettings(false)}>
      <div className="settings-box" onClick={(e) => e.stopPropagation()}>
        <div className="close-settings" onClick={() => setShowSettings(false)}>
          ✕
        </div>

        <h2>Settings & Profile</h2>

        {/* PROFILE UPDATE SECTION */}
        {currentUser && currentUser.email ? (
          <form className="profile-edit-section" onSubmit={handleSaveProfile}>
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
              <span className="profile-email-badge">{currentUser.email}</span>
            </div>

            {msg.text && (
              <div className={`settings-msg-banner ${msg.isError ? "error" : "success"}`}>
                {msg.isError ? "⚠️ " : "✅ "}
                {msg.text}
              </div>
            )}

            <div className="form-grid">
              <div className="input-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
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

            <button type="submit" className="save-profile-btn" disabled={loading}>
              <FiSave />
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        ) : (
          <div className="login-prompt-banner">
            <p>Please Log in to manage your profile.</p>
          </div>
        )}

        <hr className="settings-divider" />

        {/* THEME MODE */}
        <div className="setting-item">
          <p>Theme Mode</p>
          <button type="button" onClick={toggleTheme}>
            {theme === "light" ? "Dark Mode 🌙" : "Light Mode ☀️"}
          </button>
        </div>

        {/* CLEAR CHATS */}
        <div className="setting-item">
          <p>Clear All Chats</p>
          <button type="button" onClick={clearChats}>
            Clear
          </button>
        </div>

        {/* LOGOUT */}
        {currentUser && currentUser.email && (
          <div className="setting-item">
            <p>Logout Account</p>
            <button type="button" className="danger-btn" onClick={logout}>
              Logout
            </button>
          </div>
        )}

        {/* ABOUT */}
        <div className="about-box">
          <h3>Vedix.Ai</h3>
          <p>Your premium AI assistant & live intelligence app.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;