import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import "./LoginPopUp.css";
import { assets } from "../../assets/assets";
import { GiCrossedBones } from "react-icons/gi";
import {
  registerUser,
  loginUser,
  googleAuthUser,
} from "../../config/auth";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const LoginPopUp = ({ setShowLogin, setProfile }) => {
  const [currstate, setcurrstate] = useState("login");
  const [username, setUsername] = useState("");
  const [name, setname] = useState("");
  const [surname, setsurname] = useState("");
  const [dob, setDob] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [profilePic, setProfilePic] = useState(assets.user_icon);
  const [loading, setLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const saveSession = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setProfile(data.user);
    setShowLogin(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currstate === "signup") {
        const data = await registerUser({
          username,
          name,
          surname,
          dob,
          email,
          password,
          profilePic,
        });

        saveSession(data);
        alert("Account created successfully");
      } else {
        const data = await loginUser({
          email,
          password,
        });

        saveSession(data);
        alert(`Welcome ${data.user.username}`);
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    setLoading(true);
    setGoogleError("");

    try {
      if (!response?.credential) {
        throw new Error("Google did not return a credential. Open the site in Chrome and try again.");
      }

      const data = await googleAuthUser(response.credential);
      saveSession(data);
      alert(`Welcome ${data.user.username}`);
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Google sign-in failed. Open this site in Chrome, not an in-app browser, and try again.";
      setGoogleError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currstate === "signup" ? "Create account" : "Login"}</h2>

          <button
            type="button"
            className="close-login"
            onClick={() => setShowLogin(false)}
            aria-label="Close login"
          >
            <GiCrossedBones />
          </button>
        </div>

        <div className="login-popup-inputs">
          {currstate === "signup" && (
            <div className="profile-container">
              <label htmlFor="profile-upload">
                <img src={profilePic} alt="profile" className="profile-pic" />
              </label>

              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </div>
          )}

          {currstate === "signup" && (
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}

          {currstate === "signup" && (
            <input
              type="text"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
          )}

          {currstate === "signup" && (
            <input
              type="text"
              placeholder="Surname"
              required
              value={surname}
              onChange={(e) => setsurname(e.target.value)}
            />
          )}

          {currstate === "signup" && (
            <input
              type="date"
              required
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : currstate === "signup" ? "Create Account" : "Login"}
        </button>

        {GOOGLE_CLIENT_ID && (
          <>
            <div className="login-divider">
              <span>or continue with Google</span>
            </div>

            <div className="google-login-wrap">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={(err) => {
                  console.error("Google Sign-In component error:", err);
                  const message =
                    "Google sign-in failed. Please check browser console (F12) for details and ensure popups/cookies are allowed.";
                  setGoogleError(message);
                  alert(message);
                }}
                promptMomentNotification={(notification) => {
                  if (notification.isNotDisplayed?.()) {
                    console.log("Google prompt not displayed:", notification.getNotDisplayedReason?.());
                  }
                  if (notification.isSkippedMoment?.()) {
                    console.log("Google prompt skipped:", notification.getSkippedReason?.());
                  }
                  if (notification.isDismissedMoment?.()) {
                    console.log("Google prompt dismissed:", notification.getDismissedReason?.());
                  }
                }}
                width="100%"
                theme="outline"
                shape="rectangular"
                text={currstate === "signup" ? "signup_with" : "signin_with"}
                itp_support
              />
            </div>

            {googleError && <p className="google-mobile-error">{googleError}</p>}
          </>
        )}

        {!GOOGLE_CLIENT_ID && (
          <p className="google-config-note">
            Add <strong>VITE_GOOGLE_CLIENT_ID</strong> to enable Google sign-in.
          </p>
        )}

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms and privacy policy.</p>
        </div>

        {currstate === "login" ? (
          <p>
            Create new account? <span onClick={() => setcurrstate("signup")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have account? <span onClick={() => setcurrstate("login")}>Login</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopUp;

