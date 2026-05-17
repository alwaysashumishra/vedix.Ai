import React, {
  useContext,
  useState,
} from "react";

import "./Main.css";

import { assets } from "../../assets/assets";

import { Context } from "../../context/context";

import { ThemeContext } from "../../context/ThemeContext";

import { MdOutlineExplore } from "react-icons/md";

import { MdDarkMode } from "react-icons/md";

import { MdLightMode } from "react-icons/md";

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


  // THEME CONTEXT
  const {
    theme,
    toggleTheme,
  } = useContext(ThemeContext);


  const [profilePic] = useState(
    assets.user_icon
  );

 const [selectedImage, setSelectedImage] = useState(null);
  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("user");

    localStorage.removeItem("token");

    setProfile(null);
  };
  const handleImageUpload = (e) => { const file = e.target.files[0]; if(file){ setSelectedImage(file); } };


  return (

    <div className="main">

      {/* NAVBAR */}
      <div className="nav">

        <p className="vedix-logo">
          Vedix.Ai
        </p>


        <div className="nav-right-box">

          {/* THEME BUTTON */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
          >
            {
              theme === "light"
                ? <MdDarkMode />
                : <MdLightMode />
            }
          </button>


          {/* EXPLORE */}
          <NavLink
            className="Nav-explore-btn"
            to="/explore"
          >
            <MdOutlineExplore />
            Explore
          </NavLink>


          {/* LOGIN */}
          {!profile ? (

            <button
              onClick={() =>
                setShowLogin(true)
              }
              className="Nav-login-btn"
            >
              Sign up/Login
            </button>

          ) : (

            <div className="profile-wrapper">

              {/* PROFILE */}
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


              {/* LOGOUT */}
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



      {/* MAIN CONTAINER */}
      <div className="main-container">

        {!showResult ? (

          <>
            <div className="greet">

              <p>
                <span>
                  Hello, Human.
                </span>
              </p>

              <p className="greet-greets">
                How can I help you today?
              </p>

            </div>


            {/* CARDS */}
            <div className="cards">

              <div className="card">
                <p>
                  Suggest beautiful places
                  to see on an upcoming
                  road trip
                </p>

                <img
                  src={assets.compass_icon}
                  alt=""
                />
              </div>


              <div className="card">
                <p>
                  Briefly summarize this
                  concept: urban planning
                </p>

                <img
                  src={assets.bulb_icon}
                  alt=""
                />
              </div>


              <div className="card">
                <p>
                  Brainstorm team bonding
                  activities for our work
                  retreat
                </p>

                <img
                  src={assets.message_icon}
                  alt=""
                />
              </div>


              <div className="card">
                <p>
                  Improve the readability
                  of the following code
                </p>

                <img
                  src={assets.code_icon}
                  alt=""
                />
              </div>

            </div>

          </>

        ) : (

          <div className="result">

            <div className="result-title">

              <img
                src={profile?.profilePic || profilePic}
                alt="user"
                className="profile-pic-small"
              />

              <p>{recentPrompt}</p>

            </div>


            <div className="result-data">

              <img
                src={assets.gemini_icon}
                alt=""
              />

              {loading ? (

                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>

              ) : (

                <p
                  dangerouslySetInnerHTML={{
                    __html: resultData,
                  }}
                ></p>

              )}

            </div>

          </div>
        )}



        {/* BOTTOM INPUT */}
        <div className="main-bottom">

          <div className="search-box">

            <input
              onChange={(e) =>
                setInput(e.target.value)
              }
              value={input}
              type="text"
              placeholder="Enter a prompt here"
            />


            <div>
    {
  selectedImage && (

    <div className="preview-container">

      <img

        src={URL.createObjectURL(
          selectedImage
        )}

        alt="preview"

        className="preview-image"
      />


      <button

        className="remove-preview"

        onClick={() =>
          setSelectedImage(null)
        }
      >
        ✕
      </button>

    </div>
  )
}


              <label htmlFor="imageUpload"> <img src={assets.gallery_icon} alt="" /> </label>
              <img
                src={assets.mic_icon}
                alt=""
              />
              <input type="file" id="imageUpload" hidden accept="image/*" onChange={handleImageUpload} />
<img

  onClick={async () => {

    await onSent(
      input,
      selectedImage
    );

    setSelectedImage(null);
  }}

  src={assets.send_icon}

  alt=""
/>

            </div>

          </div>


          <p className="bottom-info">

            Vedix.AI may display
            inaccurate info, including
            about people, so double-check
            its response.

          </p>

        </div>

      </div>

    </div>
  );
};

export default Main;