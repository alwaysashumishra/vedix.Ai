import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { FiX, FiAlertCircle, FiUserCheck, FiInfo } from "react-icons/fi";
import { assets } from "../../assets/assets";
import {
  registerUser,
  loginUser,
  googleAuthUser,
  resetPasswordUser,
} from "../../config/auth";
import "./LoginPopUp.css";

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
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [profilePic, setProfilePic] = useState(assets.user_icon);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(true);

  const saveSession = (data) => {
    localStorage.setItem("token", data.token || "demo_token_123");
    localStorage.setItem("user", JSON.stringify(data.user));
    setProfile(data.user);
    setShowLogin(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const switchState = (newState) => {
    setcurrstate(newState);
    setErrorMsg("");
  };

  const handleDemoLogin = () => {
    const demoUser = {
      username: "Guest Explorer",
      name: "Guest",
      surname: "User",
      email: "guest@vedix.ai",
      plan: "free",
      profilePic: assets.user_icon,
    };
    saveSession({ token: "demo_token_guest_mode", user: demoUser });
  };

  const validatePassword = (pass) => {
    if (pass.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(pass)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[0-9]/.test(pass)) {
      return "Password must contain at least one number.";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass)) {
      return "Password must contain at least one special character (!@#$%^&* etc.).";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!termsAccepted) {
      setErrorMsg("Please agree to the Terms of Service & Privacy Policy.");
      return;
    }

    if (currstate === "signup") {
      const passError = validatePassword(password);
      if (passError) {
        setErrorMsg(passError);
        return;
      }
    }

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
      } else if (currstate === "forgot") {
        if (password !== confirmPassword) {
          setErrorMsg("Passwords do not match!");
          setLoading(false);
          return;
        }

        const data = await resetPasswordUser({
          email,
          newPassword: password,
        });

        alert(data.message || "Password reset successfully!");
        switchState("login");
        setpassword("");
        setConfirmPassword("");
      } else {
        const data = await loginUser({
          email,
          password,
        });
        saveSession(data);
      }
    } catch (error) {
      console.error("Auth submit error:", error);
      const serverMessage = error.response?.data?.message;
      const status = error.response?.status;

      let message = serverMessage;
      if (serverMessage === "Invalid Email" || serverMessage === "User not found") {
        message = "Account not found. Click 'Sign up here' below to create your account.";
      } else if (!message) {
        if (status === 405) {
          message = "Backend URL misconfigured (405). Check server deployment.";
        } else if (status === 404) {
          message = "Auth endpoint not found (404). Check backend route.";
        } else if (status === 400 || status === 401) {
          message = "Invalid email or password. Please check your credentials.";
        } else {
          message = error.message || "Network Error: Could not connect to backend. Ensure backend is running.";
        }
      }

      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    setLoading(true);
    setErrorMsg("");

    try {
      if (!response?.credential) {
        throw new Error("Google did not return credentials.");
      }

      const data = await googleAuthUser(response.credential);
      saveSession(data);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Google sign-in failed. Please try again.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container glass-card" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <div className="popup-brand">
            <div className="logo-circle-wrap sm">
              <img src={assets.gemini_icon} alt="Vedix.AI Logo" />
            </div>
            <h2>
              {currstate === "signup"
                ? "Create Account"
                : currstate === "forgot"
                ? "Reset Password"
                : "Welcome Back"}
            </h2>
          </div>

          <button
            type="button"
            className="close-login"
            onClick={() => setShowLogin(false)}
            aria-label="Close login"
          >
            <FiX />
          </button>
        </div>

        <p className="login-popup-subtitle">
          {currstate === "signup"
            ? "Enter your details to create a Vedix.AI workspace account."
            : currstate === "forgot"
            ? "Enter your registered email to set a new password."
            : "Sign in to access your saved notes, multi-modal chat & tools."}
        </p>

        {errorMsg && (
          <div className="login-error-banner">
            <FiAlertCircle className="error-icon" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="login-popup-inputs">
          {currstate === "signup" && (
            <div className="profile-container">
              <label htmlFor="profile-upload" title="Upload Profile Picture">
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
              placeholder="First Name"
              required
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
          )}

          {currstate === "signup" && (
            <input
              type="text"
              placeholder="Last Name"
              required
              value={surname}
              onChange={(e) => setsurname(e.target.value)}
            />
          )}

          {currstate === "signup" && (
            <div className="input-field-wrap">
              <label className="input-sublabel">Date of Birth</label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
          )}

          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />

          <div className="password-input-wrapper">
            <input
              type="password"
              placeholder={currstate === "forgot" ? "New Password" : "Password"}
              required
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
            {currstate === "signup" && (
              <button
                type="button"
                className={`password-info-btn ${showPasswordRules ? "active" : ""}`}
                onClick={() => setShowPasswordRules((prev) => !prev)}
                title="Click to view Password Rules"
                aria-label="Password Rules Info"
              >
                <FiInfo />
              </button>
            )}
          </div>

          {currstate === "signup" && showPasswordRules && (
            <div className="password-rules-box popover-box">
              <div className="password-rules-header">
                <p className="password-rules-title">Password Requirements:</p>
                <button
                  type="button"
                  className="close-rules-btn"
                  onClick={() => setShowPasswordRules(false)}
                  title="Close rules"
                >
                  <FiX />
                </button>
              </div>
              <ul className="password-rules-list">
                <li className={password.length >= 8 ? "valid" : "invalid"}>
                  {password.length >= 8 ? "✓" : "•"} At least 8 characters
                </li>
                <li className={/[A-Z]/.test(password) ? "valid" : "invalid"}>
                  {/[A-Z]/.test(password) ? "✓" : "•"} At least 1 uppercase letter (A-Z)
                </li>
                <li className={/[0-9]/.test(password) ? "valid" : "invalid"}>
                  {/[0-9]/.test(password) ? "✓" : "•"} At least 1 number (0-9)
                </li>
                <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? "valid" : "invalid"}>
                  {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? "✓" : "•"} At least 1 special character (!@#$%^&*)
                </li>
              </ul>
            </div>
          )}

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
              onClick={() => switchState("forgot")}
            >
              Forgot Password?
            </p>
          )}
        </div>

        <button type="submit" className="login-submit-btn" disabled={loading}>
          {loading
            ? "Please wait..."
            : currstate === "signup"
            ? "Create Account"
            : currstate === "forgot"
            ? "Reset Password"
            : "Sign In"}
        </button>

        {currstate === "login" && (
          <button
            type="button"
            className="demo-login-btn"
            onClick={handleDemoLogin}
          >
            <FiUserCheck />
            <span>Continue as Guest / Demo Mode</span>
          </button>
        )}

        {ENABLE_GOOGLE_AUTH && GOOGLE_CLIENT_ID && (
          <>
            <div className="login-divider">
              <span>or continue with Google</span>
            </div>

            <div className="google-login-wrap">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setErrorMsg("Google sign-in failed. Try manual login.")}
                width="320"
                theme="outline"
                shape="rectangular"
                text={currstate === "signup" ? "signup_with" : "signin_with"}
              />
            </div>
          </>
        )}

        <div className="login-popup-condition">
          <input
            type="checkbox"
            id="terms-check"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          <label htmlFor="terms-check">By continuing, I agree to the terms of service & privacy policy.</label>
        </div>

        <div className="login-switch-footer">
          {currstate === "login" && (
            <p>
              Don't have an account?{" "}
              <span onClick={() => switchState("signup")}>Sign up here</span>
            </p>
          )}
          {currstate === "signup" && (
            <p>
              Already have an account?{" "}
              <span onClick={() => switchState("login")}>Sign In</span>
            </p>
          )}
          {currstate === "forgot" && (
            <p>
              Remembered your password?{" "}
              <span onClick={() => switchState("login")}>Back to Sign In</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPopUp;
