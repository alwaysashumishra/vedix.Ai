import React,
{
  useContext
}
from "react";

import "./SettingsModal.css";

import {
  ThemeContext
}
from "../../context/ThemeContext";

const SettingsModal = ({
  setShowSettings,
  setProfile,
}) => {

  const {
    theme,
    toggleTheme,
  } = useContext(ThemeContext);



  // CLEAR CHATS
  const clearChats = () => {

    localStorage.removeItem(
      "prevPrompts"
    );

    window.location.reload();
  };



  // LOGOUT
  const logout = () => {

    localStorage.removeItem(
      "user"
    );

    setProfile(null);

    window.location.reload();
  };



  return (

    <div className="settings-modal">

      <div className="settings-box">

        {/* CLOSE */}
        <div
          className="close-settings"

          onClick={() =>
            setShowSettings(false)
          }
        >
          ✕
        </div>



        <h2>
          Settings
        </h2>



        {/* THEME */}
        <div className="setting-item">

          <p>
            Theme Mode
          </p>

          <button
            onClick={toggleTheme}
          >
            {
              theme === "light"
                ? "Dark Mode"
                : "Light Mode"
            }
          </button>

        </div>



        {/* CLEAR CHAT */}
        <div className="setting-item">

          <p>
            Clear All Chats
          </p>

          <button
            onClick={clearChats}
          >
            Clear
          </button>

        </div>



        {/* LOGOUT */}
        <div className="setting-item">

          <p>
            Logout Account
          </p>

          <button
            onClick={logout}
          >
            Logout
          </button>

        </div>



        {/* ABOUT */}
        <div className="about-box">

          <h3>
            Vedix.Ai
          </h3>

          <p>
            Your premium AI assistant
            built with React, Node.js,
            MongoDB & Gemini API.
          </p>

        </div>

      </div>

    </div>
  );
};

export default SettingsModal;