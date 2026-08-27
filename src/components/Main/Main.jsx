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
  FiLogOut,
  FiBookmark,
  FiCheck,
  FiShare2,
  FiUsers,
  FiMail,
  FiMessageCircle,
} from "react-icons/fi";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { RiArticleLine } from "react-icons/ri";
import { assets } from "../../assets/assets";
import { Context } from "../../context/context";
import { ThemeContext } from "../../context/ThemeContext";
import { getPublicConfig } from "../../config/publicConfig";
import FormattedResponse from "../FormattedResponse/FormattedResponse";
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
    messages,
    saveNote,
    groups,
    shareChatToGroup,
  } = useContext(Context);

  const { theme, toggleTheme } = useContext(ThemeContext);

  const [profilePic] = useState(assets.user_icon);
  const [selectedImages, setSelectedImages] = useState([]);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [siteConfig, setSiteConfig] = useState({});
  const [savedNoteIds, setSavedNoteIds] = useState({});
  const recognitionRef = useRef(null);
  const resultRef = useRef(null);

  const handleSaveToNotes = (question, answerHtml, msgId) => {
    const qText = question || recentPrompt || "Chat Q&A Note";
    const cleanAnswer = stripHtml(answerHtml);
    saveNote({
      id: `chat_note_${msgId || Date.now()}`,
      title: qText.length > 60 ? `${qText.slice(0, 60)}...` : qText,
      question: qText,
      answer: cleanAnswer,
      content: `Q: ${qText}\n\nA: ${cleanAnswer}`,
      type: "chat",
      tags: ["Chat Q&A"],
    });
    setSavedNoteIds((prev) => ({ ...prev, [msgId || "default"]: true }));
  };

  const [shareModalData, setShareModalData] = useState(null);
  const [sharedGroupSuccess, setSharedGroupSuccess] = useState(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const openShareModal = (question, answerHtml, msgId) => {
    const qText = question || recentPrompt || "Chat Q&A";
    const cleanAnswer = stripHtml(answerHtml);
    setShareModalData({
      id: msgId || Date.now(),
      question: qText,
      answer: cleanAnswer,
    });
    setSharedGroupSuccess(null);
    setCopiedShare(false);
  };

  const handleShareToGroup = (groupId) => {
    if (!shareModalData) return;
    shareChatToGroup(groupId, {
      title: shareModalData.question.slice(0, 60),
      question: shareModalData.question,
      answer: shareModalData.answer,
    });
    setSharedGroupSuccess(groupId);
    setTimeout(() => setSharedGroupSuccess(null), 2500);
  };

  const handleWhatsAppShare = () => {
    if (!shareModalData) return;
    const text = `*Q:* ${shareModalData.question}\n\n*A:* ${shareModalData.answer.slice(0, 400)}...\n\nShared via lexi.AI`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleEmailShare = () => {
    if (!shareModalData) return;
    const subject = `AI Q&A: ${shareModalData.question.slice(0, 50)}`;
    const body = `Question: ${shareModalData.question}\n\nAnswer:\n${shareModalData.answer}\n\nShared via lexi.AI`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
  };

  const handleCopyShare = () => {
    if (!shareModalData) return;
    const text = `Q: ${shareModalData.question}\n\nA: ${shareModalData.answer}`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  useEffect(() => {
    getPublicConfig()
      .then(setSiteConfig)
      .catch(() => setSiteConfig({}));
  }, []);

  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [messages, loading, resultData]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const getUserAvatar = () => {
    if (profile && profile.profilePic && typeof profile.profilePic === "string" && profile.profilePic.trim() !== "") {
      return profile.profilePic;
    }
    return assets.user_icon;
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setProfile(null);
    setShowLogin(true);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setSelectedImages((prev) => {
      const combined = [...prev, ...files];
      if (combined.length > 5) {
        setVoiceError("Maximum 5 images allowed at a time.");
        setTimeout(() => setVoiceError(""), 3500);
        return combined.slice(0, 5);
      }
      return combined;
    });

    event.target.value = "";
  };

  const removeImage = (indexToRemove) => {
    setSelectedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const sendMessage = async () => {
    if (!profile) {
      setShowLogin(true);
      return;
    }

    if (!input.trim() && selectedImages.length === 0) {
      return;
    }

    const imagesToSend = [...selectedImages];
    setSelectedImages([]);
    await onSent(input, imagesToSend);
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

  const toggleSpeech = (customText) => {
    if (!window.speechSynthesis) {
      setVoiceError("Voice playback is not supported in this browser.");
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const targetText = typeof customText === "string" ? customText : resultData;
    const text = stripHtml(targetText);

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

          <NavLink className="Nav-explore-btn" to="/explore" title="Explore Topics">
            <FiCompass className="nav-icon" />
            <span className="nav-btn-text">Explore</span>
          </NavLink>

          <NavLink to="/resume-analyzer" className="ai-nav-btn" title="Resume AI">
            <FiFileText className="nav-icon" />
            <span className="nav-btn-text">Resume AI</span>
          </NavLink>

          <NavLink to="/paper-analyzer" className="ai-nav-btn" title="Research AI">
            <RiArticleLine className="nav-icon" />
            <span className="nav-btn-text">Research AI</span>
          </NavLink>

          {!profile ? (
            <button onClick={() => setShowLogin(true)} className="Nav-login-btn">
              Sign up/Login
            </button>
          ) : (
            <div className="profile-wrapper">
              <div className="profile-box" title={profile.username}>
                <span className="username">{profile.username}</span>
                <img
                  src={profile.profilePic || assets.user_icon}
                  alt="profile"
                  className="profile-picture"
                  onError={(e) => {
                    e.target.src = assets.user_icon;
                  }}
                />
              </div>

              <button onClick={handleLogout} className="logout-btn" title="Logout">
                <FiLogOut className="logout-icon" />
                <span className="logout-text">Logout</span>
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
          <div className="result" ref={resultRef}>
            {messages && messages.length > 0 ? (
              messages.map((msg, msgIndex) => (
                <div key={msg.id} className="chat-thread-item" style={{ marginBottom: "24px" }}>
                  {msg.role === "user" ? (
                    <div className="result-title">
                      <img
                        src={getUserAvatar()}
                        alt="user"
                        className="profile-pic-small"
                        onError={(e) => {
                          e.currentTarget.src = assets.user_icon;
                        }}
                      />
                      <div>
                        {msg.images && msg.images.length > 0 ? (
                          <div className="chat-images-grid">
                            {msg.images.map((imgUrl, idx) => (
                              <img
                                key={idx}
                                src={imgUrl}
                                alt={`attached-${idx}`}
                                className="chat-attached-img"
                              />
                            ))}
                          </div>
                        ) : msg.image ? (
                          <img
                            src={msg.image}
                            alt="preview"
                            style={{ maxWidth: "220px", borderRadius: "12px", marginBottom: "8px" }}
                          />
                        ) : null}
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="result-data">
                      <img src={assets.gemini_icon} alt="" className="ai-logo" />

                      <div className="response-box">
                        <FormattedResponse content={msg.rawText || msg.text} />

                        <div className="response-actions">
                          <button
                            className="copy-btn"
                            onClick={() => {
                              navigator.clipboard.writeText(stripHtml(msg.text));
                            }}
                            title="Copy response"
                          >
                            <FiCopy />
                            Copy
                          </button>

                          <button
                            className={`voice-action-btn ${speaking ? "active" : ""}`}
                            onClick={() => toggleSpeech(msg.text)}
                            title={speaking ? "Stop speaking" : "Read response aloud"}
                          >
                            {speaking ? <FiVolumeX /> : <FiVolume2 />}
                            {speaking ? "Stop" : "Speak"}
                          </button>

                          <button
                            className={`save-note-btn ${savedNoteIds[msg.id] ? "saved" : ""}`}
                            onClick={() => {
                              const prevUserMsg = messages
                                .slice(0, msgIndex)
                                .reverse()
                                .find((m) => m.role === "user");
                              handleSaveToNotes(prevUserMsg?.text || recentPrompt, msg.text, msg.id);
                            }}
                            title={savedNoteIds[msg.id] ? "Saved to Notes" : "Save Q&A to Notes"}
                          >
                            {savedNoteIds[msg.id] ? <FiCheck /> : <FiBookmark />}
                            {savedNoteIds[msg.id] ? "Saved" : "Save Note"}
                          </button>

                          <button
                            className="share-action-btn"
                            onClick={() => {
                              const prevUserMsg = messages
                                .slice(0, msgIndex)
                                .reverse()
                                .find((m) => m.role === "user");
                              openShareModal(prevUserMsg?.text || recentPrompt, msg.text, msg.id);
                            }}
                            title="Share Chat / Send to Group"
                          >
                            <FiShare2 />
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <>
                <div className="result-title">
                  <img
                    src={getUserAvatar()}
                    alt="user"
                    className="profile-pic-small"
                    onError={(e) => {
                      e.currentTarget.src = assets.user_icon;
                    }}
                  />
                  <p>{recentPrompt}</p>
                </div>

                <div className="result-data">
                  <img src={assets.gemini_icon} alt="" className="ai-logo" />
                  <div className="response-box">
                    <FormattedResponse content={resultData} />

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
                        onClick={() => toggleSpeech(resultData)}
                        title={speaking ? "Stop speaking" : "Read response aloud"}
                      >
                        {speaking ? <FiVolumeX /> : <FiVolume2 />}
                        {speaking ? "Stop" : "Speak"}
                      </button>

                      <button
                        className={`save-note-btn ${savedNoteIds["single_res"] ? "saved" : ""}`}
                        onClick={() => handleSaveToNotes(recentPrompt, resultData, "single_res")}
                        title={savedNoteIds["single_res"] ? "Saved to Notes" : "Save Q&A to Notes"}
                      >
                        {savedNoteIds["single_res"] ? <FiCheck /> : <FiBookmark />}
                        {savedNoteIds["single_res"] ? "Saved" : "Save Note"}
                      </button>

                      <button
                        className="share-action-btn"
                        onClick={() => openShareModal(recentPrompt, resultData, "single_res")}
                        title="Share Chat / Send to Group"
                      >
                        <FiShare2 />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {loading && (
              <div className="result-data loading-data" style={{ marginTop: "16px" }}>
                <img src={assets.gemini_icon} alt="" className="ai-logo" />
                <div className="response-box">
                  <div className="loader">
                    <hr />
                    <hr />
                    <hr />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="main-bottom">
          {voiceError && <p className="voice-error">{voiceError}</p>}

          <div className={`search-box ${listening ? "is-listening" : ""}`}>
            {selectedImages && selectedImages.length > 0 && (
              <div className="multi-image-preview-bar">
                <div className="preview-thumbs-row">
                  {selectedImages.map((imgFile, index) => (
                    <div key={index} className="preview-thumb-item">
                      <img
                        src={URL.createObjectURL(imgFile)}
                        alt={`thumb-${index}`}
                        className="preview-thumb-img"
                      />
                      <button
                        type="button"
                        className="remove-thumb-btn"
                        onClick={() => removeImage(index)}
                        title="Remove image"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                  <span className="images-count-badge">({selectedImages.length}/5)</span>
                </div>
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
              <label htmlFor="imageUpload" className="chat-icon-btn" title="Upload images (Up to 5)">
                <FiImage />
              </label>

              <input
                type="file"
                id="imageUpload"
                hidden
                accept="image/*"
                multiple
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

      {/* SHARE CHAT MODAL */}
      {shareModalData && (
        <div className="share-modal-overlay" onClick={() => setShareModalData(null)}>
          <div className="share-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="share-modal-header">
              <h2>Share Conversation</h2>
              <button className="close-modal-btn" onClick={() => setShareModalData(null)}>
                <FiX />
              </button>
            </div>

            <div className="share-modal-body">
              <div className="share-preview-box">
                <strong>Q: {shareModalData.question.slice(0, 70)}...</strong>
              </div>

              {/* Option 1: Share to Team Group */}
              <div className="share-section">
                <h3><FiUsers /> Share to Team Group</h3>
                {groups && groups.length > 0 ? (
                  <div className="share-groups-list">
                    {groups.map((group) => (
                      <div key={group.id} className="share-group-item">
                        <div>
                          <strong>{group.name}</strong>
                          <p>{group.members?.length || 0} Members</p>
                        </div>
                        <button
                          className={`group-share-btn ${sharedGroupSuccess === group.id ? "success" : ""}`}
                          onClick={() => handleShareToGroup(group.id)}
                        >
                          {sharedGroupSuccess === group.id ? <FiCheck /> : <FiShare2 />}
                          {sharedGroupSuccess === group.id ? "Shared!" : "Share to Group"}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-groups-hint">No team groups created yet. Create a group on the Groups page!</p>
                )}
              </div>

              {/* Option 2: External Sharing (WhatsApp & Email & Copy) */}
              <div className="share-section">
                <h3>External Collaborators</h3>
                <div className="external-share-btns">
                  <button className="ext-share-btn whatsapp" onClick={handleWhatsAppShare}>
                    <FiMessageCircle /> WhatsApp
                  </button>
                  <button className="ext-share-btn email" onClick={handleEmailShare}>
                    <FiMail /> Email
                  </button>
                  <button className="ext-share-btn copy" onClick={handleCopyShare}>
                    {copiedShare ? <FiCheck /> : <FiCopy />}
                    {copiedShare ? "Copied!" : "Copy Text"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;








