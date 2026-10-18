import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import {
  FiX,
  FiAlertCircle,
  FiUserCheck,
  FiInfo,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiCheck,
} from "react-icons/fi";
import { assets } from "../../assets/assets";
import {
  registerUser,
  loginUser,
  googleAuthUser,
  resetPasswordUser,
} from "../../config/auth";
import "./Login.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const ENABLE_GOOGLE_AUTH = false;

const Login = ({ setProfile, setShowLogin }) => {
  const navigate = useNavigate();
  const [currstate, setcurrstate] = useState("login");
  const [username, setUsername] = useState("");
  const [name, setname] = useState("");
  const [surname, setsurname] = useState("");
  const [dob, setDob] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [profilePic, setProfilePic] = useState(assets.user_icon);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(true);

  const saveSession = (data) => {
    localStorage.setItem("token", data.token || "demo_token_123");
    localStorage.setItem("user", JSON.stringify(data.user));
    if (setProfile) setProfile(data.user);
    if (setShowLogin) setShowLogin(false);
    navigate("/");
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
        message = "Account not found. Click 'Sign Up' below to create your account.";
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
    <div className="vertex-fullpage-auth">
      {/* ================= LEFT HALF: DEEP TEAL SHOWCASE ================= */}
      <div className="vertex-fp-left">
        {/* Top Header with Back to Landing & Brand */}
        <div className="vertex-fp-left-top">
          <button
            type="button"
            className="vertex-fp-back-btn"
            onClick={() => navigate("/landing")}
            title="Back to Landing Page"
          >
            <FiArrowLeft />
            <span>Back to Home</span>
          </button>

          <div className="vertex-fp-brand" onClick={() => navigate("/landing")}>
            <div className="vertex-fp-logo-ring">
              <img src={assets.gemini_icon} alt="Vedix.Ai Logo" />
            </div>
            <span className="vertex-fp-brand-title">Vedix.Ai</span>
          </div>
        </div>

        {/* Big Headline & Subtitle */}
        <div className="vertex-fp-copy">
          <h2>
            Unlock The Full Power<br />
            of Vedix.Ai
          </h2>
          <p>
            Just a few simple steps and you'll be ready to automate, optimize, and research like never before.
          </p>
        </div>

        {/* Central Angled Graphic Stage with Floating Orbit Badges */}
        <div className="vertex-fp-graphic-stage">
          {/* Orbit Badges (Matching Reference Design) */}
          <div className="orbit-pill pill-calendar">
            <span className="orbit-icon">📅</span>
            <span>Calendar</span>
          </div>

          <div className="orbit-pill pill-slack">
            <span className="orbit-icon">💬</span>
            <span>Slack</span>
          </div>

          <div className="orbit-pill pill-shopify">
            <span className="orbit-icon">🛍️</span>
            <span>Shopify</span>
          </div>

          <div className="orbit-pill pill-googleads">
            <span className="orbit-icon">📊</span>
            <span>Google Ads</span>
          </div>

          <div className="orbit-pill pill-zendesk">
            <span className="orbit-icon">🛡️</span>
            <span>Zendesk</span>
          </div>

          <div className="orbit-pill pill-robinhood">
            <span className="cursor-arrow-indicator">▲</span>
            <span>Robin hood</span>
          </div>

          {/* Central 3D Angled Performance Card */}
          <div className="vertex-fp-angled-card">
            <div className="angled-card-head">
              <div className="card-head-left">
                <span className="head-chart-icon">📈</span>
                <strong>Campaign Performance</strong>
              </div>
              <div className="card-head-right">
                <span className="mini-pill-btn">⌂</span>
              </div>
            </div>

            {/* Bar Chart Visualization */}
            <div className="angled-bar-chart">
              <div className="bar-group">
                <div className="bar bar-tall bar-dark" />
                <div className="bar bar-mid bar-cyan" />
                <span className="bar-label">Black Friday</span>
              </div>
              <div className="bar-group">
                <div className="bar bar-high bar-teal" />
                <div className="bar bar-short bar-dark" />
                <span className="bar-label">Holiday Promo</span>
              </div>
              <div className="bar-group">
                <div className="bar bar-tall bar-cyan" />
                <div className="bar bar-high bar-teal" />
                <span className="bar-label">Winter Sale</span>
              </div>
              <div className="bar-group">
                <div className="bar bar-short bar-dark" />
                <div className="bar bar-tall bar-cyan" />
                <span className="bar-label">Flash Sale</span>
              </div>
            </div>

            {/* Angled Tooltip Bubble */}
            <div className="angled-tooltip-bubble">
              <div className="tooltip-tag-head">
                <span className="avatar-mini-dot" />
                <span>Marc Alistair</span>
              </div>
              <div className="tooltip-stat-row">
                <span className="stat-dot dot-cyan" />
                <span className="stat-name">Open Rate</span>
                <span className="stat-val">45%</span>
              </div>
              <div className="tooltip-stat-row">
                <span className="stat-dot dot-teal" />
                <span className="stat-name">Click-Through</span>
                <span className="stat-val">82%</span>
              </div>
              <div className="tooltip-stat-row">
                <span className="stat-dot dot-dark" />
                <span className="stat-name">Conversion Rate</span>
                <span className="stat-val">68%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left Copyright */}
        <div className="vertex-fp-left-footer">
          <p>© Vedix {new Date().getFullYear()}. All Rights Reserved</p>
        </div>
      </div>

      {/* ================= RIGHT HALF: ARCHITECTURAL BLUEPRINT CANVAS WITH FLOATING CARD ================= */}
      <div className="vertex-fp-right">
        {/* Subtle Architectural Blueprint Grid Guides */}
        <div className="blueprint-grid-overlay" aria-hidden="true">
          <div className="blueprint-col" />
          <div className="blueprint-col" />
          <div className="blueprint-col" />
          <div className="blueprint-col" />
          <div className="blueprint-hatch top-hatch" />
          <div className="blueprint-hatch bottom-hatch" />
        </div>

        {/* Center Floating Card (Exact Match to Reference Image) */}
        <div className="vertex-fp-card-inner">
          {/* Corner Rivet Screws */}
          <span className="rivet-dot rivet-tl" />
          <span className="rivet-dot rivet-tr" />
          <span className="rivet-dot rivet-bl" />
          <span className="rivet-dot rivet-br" />

          {/* Centered Circular Logo Badge */}
          <div className="vertex-fp-card-logo">
            <div className="card-logo-badge">
              <img src={assets.gemini_icon} alt="Vedix.Ai Emblem" />
            </div>
          </div>

          {/* Titles */}
          <div className="vertex-fp-card-header">
            <h3>
              {currstate === "signup"
                ? "Sign Up to Vedix.Ai"
                : currstate === "forgot"
                ? "Reset Your Password"
                : "Login to Vedix.Ai"}
            </h3>
            <p>Drive growth with intelligent automation and effortless teamwork.</p>
          </div>

          {errorMsg && (
            <div className="vertex-error-alert">
              <FiAlertCircle />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="vertex-actual-form">
            {currstate === "signup" && (
              <div className="vertex-field-group">
                <div className="vertex-two-col-row">
                  <div className="field-half">
                    <label>First Name</label>
                    <input
                      type="text"
                      placeholder="John"
                      required
                      value={name}
                      onChange={(e) => setname(e.target.value)}
                    />
                  </div>
                  <div className="field-half">
                    <label>Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      required
                      value={surname}
                      onChange={(e) => setsurname(e.target.value)}
                    />
                  </div>
                </div>

                <div className="vertex-two-col-row">
                  <div className="field-half">
                    <label>Username</label>
                    <input
                      type="text"
                      placeholder="johndoe"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="field-half">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="vertex-form-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="vertex-form-field">
              <div className="field-label-split">
                <label>{currstate === "forgot" ? "New Password" : "Password"}</label>
                {currstate === "login" && (
                  <button
                    type="button"
                    className="forgot-pass-btn"
                    onClick={() => switchState("forgot")}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <div className="password-input-with-eye">
                <input
                  type={showPasswordText ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-eye-toggle"
                  onClick={() => setShowPasswordText(!showPasswordText)}
                  aria-label={showPasswordText ? "Hide password" : "Show password"}
                >
                  {showPasswordText ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password for Reset State */}
            {currstate === "forgot" && (
              <div className="vertex-form-field">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your new password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            {/* Password Checklist for Signup */}
            {currstate === "signup" && (
              <div className="vertex-password-checklist">
                <div className="checklist-items">
                  <span className={password.length >= 8 ? "checked" : ""}>
                    {password.length >= 8 ? "✓" : "•"} 8+ chars
                  </span>
                  <span className={/[A-Z]/.test(password) ? "checked" : ""}>
                    {/[A-Z]/.test(password) ? "✓" : "•"} 1 uppercase
                  </span>
                  <span className={/[0-9]/.test(password) ? "checked" : ""}>
                    {/[0-9]/.test(password) ? "✓" : "•"} 1 number
                  </span>
                  <span className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? "checked" : ""}>
                    {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? "✓" : "•"} 1 special
                  </span>
                </div>
              </div>
            )}

            {/* Primary Action Button (Black Pill Button) */}
            <button
              type="submit"
              className="vertex-submit-btn"
              disabled={loading}
            >
              <span>
                {loading
                  ? "Please wait..."
                  : currstate === "signup"
                  ? "Sign Up"
                  : currstate === "forgot"
                  ? "Reset Password"
                  : "Sign In"}
              </span>
            </button>

            {/* Social Buttons: Google and Guest Demo */}
            <div className="vertex-social-row">
              <button
                type="button"
                className="vertex-social-btn google-btn"
                onClick={handleDemoLogin}
                title="Sign in with Google"
              >
                <svg className="google-icon-svg" viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="vertex-social-btn guest-btn"
                onClick={handleDemoLogin}
                title="Instant access in Guest Mode"
              >
                <FiUserCheck className="guest-icon" />
                <span>Github</span>
              </button>
            </div>

            {/* Bottom Switch Pill: "Don't have an account? Sign Up >" */}
            <div className="vertex-bottom-switch">
              {currstate === "login" && (
                <button
                  type="button"
                  className="switch-link-btn"
                  onClick={() => switchState("signup")}
                >
                  <span>Don't have an account? <strong>Sign Up &gt;</strong></span>
                </button>
              )}
              {currstate === "signup" && (
                <button
                  type="button"
                  className="switch-link-btn"
                  onClick={() => switchState("login")}
                >
                  <span>Already have an account? <strong>Sign In &gt;</strong></span>
                </button>
              )}
              {currstate === "forgot" && (
                <button
                  type="button"
                  className="switch-link-btn"
                  onClick={() => switchState("login")}
                >
                  <span>Remembered your password? <strong>Back to Sign In &gt;</strong></span>
                </button>
              )}
            </div>
          </form>

          {/* Legal Terms Notice */}
          <div className="vertex-legal-disclaimer">
            <p>by signing up, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
