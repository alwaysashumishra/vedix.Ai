import React, { useContext, useState } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/context";
import { MdOutlineExplore } from "react-icons/md";
import { NavLink } from "react-router-dom";
const Main = ({
  showLogin,
  setShowLogin,
  profile,
  setProfile,
}) => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
  } = useContext(Context);

  const [profilePic, setProfilePic] = useState(assets.user_icon); // default user icon

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // temporary preview
      setProfilePic(imageUrl);
    }
  };
const handleLogout = () => {

  localStorage.removeItem("user");

  localStorage.removeItem("token");

  setProfile(null);
};
  return (
    <div className="main">
      <div className="nav">
        <p>Vedix.Ai</p>

        {/* Profile picture with upload option */}

 <div className="nav-right-box">

  {/* ALWAYS SHOW EXPLORE */}
  <NavLink
    className="Nav-explore-btn"
    to="/explore"
  >
    <MdOutlineExplore />
    Explore
  </NavLink>


  {/* IF USER NOT LOGGED IN */}
  {!profile ? (

    <button
      onClick={() => setShowLogin(true)}
      className="Nav-login-btn"
    >
      Sign up/Login
    </button>

  ) : (

    <div className="profile-wrapper">

      <div className="profile-box">

        <span className="username">
          {profile.username}
        </span>

        <img
          src={profile.profilePic}
          alt="profile"
          className="profile-picture"
        />

      </div>

      <button
        onClick={handleLogout}
        className="logout-btn"
      >
        Logout
      </button>

    </div>
  )}

</div>
      </div>

      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, Human.</span>
              </p>
              <p>How can I help you today?</p>
            </div>
            <div className="cards">
              <div className="card">
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div className="card">
                <p>Breifly summarize this concept: urban planning</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div className="card">
                <p>Brainstrom team bonding activities for our work retreat</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div className="card">
                <p>Improve the readability of the following code</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={profilePic} alt="user" className="profile-pic-small" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              <img onClick={() => onSent()} src={assets.send_icon} alt="" />
            </div>
          </div>
          <p className="bottom-info">
            Lexi.AI may display inaccurate info, including about people, so
            double-check its response. Your privacy and lexi Apps
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
