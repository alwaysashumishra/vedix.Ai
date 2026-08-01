import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiCopy,
  FiImage,
  FiMic,
  FiSend,
  FiVolume2,
  FiVolumeX,
  FiX,
  FiFileText,
  FiCompass,
} from "react-icons/fi";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { RiArticleLine } from "react-icons/ri";
import { assets } from "../../assets/assets";
import { Context } from "../../context/context";
import { ThemeContext } from "../../context/ThemeContext";
import { getPublicConfig } from "../../config/publicConfig";
import "./Main.css";

const stripHtml = (html) =>
  html.replace(/<br\/>/g, "\n").replace(/<[^>]*>?/gm, "");

const Main = ({ setShowLogin, profile, setProfile }) => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
  } = useContext(Context);

  const { theme, toggleTheme } = useContext(ThemeContext);

  const [profilePic] = useState(assets.user_icon);
  const [selectedImage, setSelectedImage] = useState(null);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [siteConfig, setSiteConfig] = useState({});
  const recognitionRef = useRef(null);

  useEffect(() => {
    getPublicConfig()
      .then(setSiteConfig)
      .catch(() => setSiteConfig({}));
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setProfile(null);
    setShowLogin(true);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedImage(file);
    }
  };

  const sendMessage = async () => {
    if (!profile) {
      setShowLogin(true);
      return;
    }

    await onSent(input, selectedImage);
    setSelectedImage(null);
  };

  const toggleListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Voice input is not supported in this browser.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setVoiceError("");
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join("");

      setInput(transcript);
    };

    recognition.onerror = () => {
      setVoiceError("Voice input stopped. Please try again.");
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const toggleSpeech = () => {
    if (!window.speechSynthesis) {
      setVoiceError("Voice playback is not supported in this browser.");
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const text = stripHtml(resultData);

    if (!text.trim()) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="main">
      <div className="nav">
        <p className="vedix-logo">Vedix.Ai</p>

        <div className="nav-right-box">
          <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle theme">
            {theme === "light" ? <MdDarkMode /> : <MdLightMode />}
          </button>

          <NavLink className="Nav-explore-btn" to="/explore">
            <FiCompass />
            Explore
          </NavLink>

          <NavLink to="/resume-analyzer" className="ai-nav-btn">
            <FiFileText />
            Resume AI
          </NavLink>

          <NavLink to="/paper-analyzer" className="ai-nav-btn">
            <RiArticleLine />
            Research AI
          </NavLink>{!profile ? (
            <button onClick={() => setShowLogin(true)} className="Nav-login-btn">
              Sign up/Login
            </button>
          ) : (
            <div className="profile-wrapper">
              <div className="profile-box">
                <span className="username">{profile.username}</span>
                <img
                  src={profile.profilePic || assets.user_icon}
                  alt="profile"
                  className="profile-picture"
                />
              </div>

              <button onClick={handleLogout} className="logout-btn">
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
              <p className="greetwelcome">
                <span>Hello, {profile?.username || "Human"}.</span>
              </p>
              <p className="greet-greets">How can I help you today?</p>
            </div>

            <div className="cards">
              <div className="card">
                <p>{siteConfig.resumeCta || "Analyze resume professionally using AI"}</p>
                <img src={assets.message_icon} alt="" />
              </div>

              <div className="card">
                <p>{siteConfig.researchCta || "Analyze research papers and summarize concepts"}</p>
                <img src={assets.bulb_icon} alt="" />
              </div>

              <div className="card">
                <p>Upload image and ask AI anything visually</p>
                <img src={assets.gallery_icon} alt="" />
              </div>

              <div className="card">
                <p>Improve readability of code instantly</p>
                <img src={assets.code_icon} alt="" />
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
              <img src={assets.gemini_icon} alt="" className="ai-logo" />

              <div className="response-box">
                {loading ? (
                  <div className="loader">
                    <hr />
                    <hr />
                    <hr />
                  </div>
                ) : (
                  <>
                    <div
                      className="formatted-response"
                      dangerouslySetInnerHTML={{
                        __html: resultData,
                      }}
                    ></div>

                    <div className="response-actions">
                      <button
                        className="copy-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(stripHtml(resultData));
                        }}
                        title="Copy response"
                      >
                        <FiCopy />
                        Copy
                      </button>

                      <button
                        className={`voice-action-btn ${speaking ? "active" : ""}`}
                        onClick={toggleSpeech}
                        title={speaking ? "Stop speaking" : "Read response aloud"}
                      >
                        {speaking ? <FiVolumeX /> : <FiVolume2 />}
                        {speaking ? "Stop" : "Speak"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="main-bottom">
          {voiceError && <p className="voice-error">{voiceError}</p>}

          <div className={`search-box ${listening ? "is-listening" : ""}`}>
            {selectedImage && (
              <div className="preview-container">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="preview"
                  className="preview-image"
                />

                <button
                  className="remove-preview"
                  onClick={() => setSelectedImage(null)}
                  title="Remove image"
                >
                  <FiX />
                </button>
              </div>
            )}

            <input
              onChange={(event) => setInput(event.target.value)}
              value={input}
              type="text"
              placeholder={listening ? "Listening..." : "Enter a prompt here"}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <div className="chat-actions">
              <label htmlFor="imageUpload" className="chat-icon-btn" title="Upload image">
                <FiImage />
              </label>

              <input
                type="file"
                id="imageUpload"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />

              <button
                type="button"
                className={`chat-icon-btn ${listening ? "active" : ""}`}
                onClick={toggleListening}
                title={listening ? "Stop listening" : "Start voice input"}
              >
                <FiMic />
              </button>

              <button
                type="button"
                className="chat-icon-btn send"
                onClick={sendMessage}
                title="Send prompt"
              >
                <FiSend />
              </button>
            </div>
          </div>

          <p className="bottom-info">
            Vedix.AI may display inaccurate info, including about people, so double-check its
            response.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;








