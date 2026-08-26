import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import "./LoginPopUp.css";
import { assets } from "../../assets/assets";
import { GiCrossedBones } from "react-icons/gi";
import {
  registerUser,
  loginUser,
  googleAuthUser,
  resetPasswordUser,
} from "../../config/auth";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const ENABLE_GOOGLE_AUTH = false;

const LoginPopUp = ({ setShowLogin, setProfile }) => {
  const [currstate, setcurrstate] = useState("login");
  const [username, setUsername] = useState("");
  const [name, setname] = useState("");
  const [surname, setsurname] = useState("");
  const [dob, setDob] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
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
      } else if (currstate === "forgot") {
        if (password !== confirmPassword) {
          alert("Passwords do not match!");
          setLoading(false);
          return;
        }

        const data = await resetPasswordUser({
          email,
          newPassword: password,
        });

        alert(data.message || "Password reset successfully!");
        setcurrstate("login");
        setpassword("");
        setConfirmPassword("");
      } else {
        const data = await loginUser({
          email,
          password,
        });

        saveSession(data);
        alert(`Welcome ${data.user.username}`);
      }
    } catch (error) {
      console.error("Auth submit error:", error);
      const serverMessage = error.response?.data?.message;
      const status = error.response?.status;

      let message = serverMessage;
      if (!message) {
        if (status === 405) {
          message = "Backend server URL is misconfigured (returned 405 HTML). Please verify Railway backend service deployment.";
        } else if (status === 404) {
          message = "Backend auth endpoint not found (404). Check API_BASE configuration.";
        } else {
          message = error.message || "Network Error: Could not connect to backend server. Ensure VITE_API_BASE_URL is set in Vercel.";
        }
      }

      setGoogleError(message);
      alert(message);
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
          <h2>
            {currstate === "signup"
              ? "Create account"
              : currstate === "forgot"
              ? "Reset Password"
              : "Login"}
          </h2>

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
            placeholder={currstate === "forgot" ? "New Password" : "Password"}
            required
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />

          {currstate === "forgot" && (
            <input
              type="password"
              placeholder="Confirm New Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          {currstate === "login" && (
            <p
              className="forgot-password-link"
              onClick={() => {
                setcurrstate("forgot");
                setpassword("");
                setConfirmPassword("");
              }}
            >
              Forgot Password?
            </p>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : currstate === "signup"
            ? "Create Account"
            : currstate === "forgot"
            ? "Reset Password"
            : "Login"}
        </button>

        {ENABLE_GOOGLE_AUTH && GOOGLE_CLIENT_ID && (
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
                width="320"
                theme="outline"
                shape="rectangular"
                text={currstate === "signup" ? "signup_with" : "signin_with"}
                itp_support
              />
            </div>

            {googleError && <p className="google-mobile-error">{googleError}</p>}
          </>
        )}

        {ENABLE_GOOGLE_AUTH && !GOOGLE_CLIENT_ID && (
          <p className="google-config-note">
            Add <strong>VITE_GOOGLE_CLIENT_ID</strong> to enable Google sign-in.
          </p>
        )}

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms and privacy policy.</p>
        </div>

        {currstate === "login" && (
          <p>
            Create new account? <span onClick={() => setcurrstate("signup")}>Click here</span>
          </p>
        )}
        {currstate === "signup" && (
          <p>
            Already have account? <span onClick={() => setcurrstate("login")}>Login</span>
          </p>
        )}
        {currstate === "forgot" && (
          <p>
            Remembered your password? <span onClick={() => setcurrstate("login")}>Login</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopUp;
