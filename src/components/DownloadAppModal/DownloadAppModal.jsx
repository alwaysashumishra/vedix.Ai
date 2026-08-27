import React, { useState, useEffect } from "react";
import {
  FiX,
  FiSmartphone,
  FiCopy,
  FiCheck,
  FiDownload,
  FiMessageCircle,
  FiMail,
  FiZap,
} from "react-icons/fi";
import { RiQrCodeLine, RiAndroidFill, RiAppleFill } from "react-icons/ri";
import { assets } from "../../assets/assets";
import "./DownloadAppModal.css";

const DownloadAppModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [qrColor, setQrColor] = useState("4f46e5"); // default indigo
  const [activeTheme, setActiveTheme] = useState("indigo");

  // App URL to embed in QR Code
  const appUrl = window.location.origin;

  // Dynamic QR Code Image API URL
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
    appUrl
  )}&format=png&margin=12&color=${qrColor}&bgcolor=ffffff`;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        "To install Vedix.Ai on your device:\n\n1. On Mobile: Tap your browser menu (⋮ or share) -> 'Add to Home Screen'.\n2. On Desktop: Click the install icon in your browser address bar."
      );
    }
  };

  const handleWhatsAppShare = () => {
    const text = `✨ Try Vedix.Ai - Next-Gen AI Workspace & Smart Assistant!\nOpen & Install App: ${appUrl}`;
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const handleEmailShare = () => {
    const subject = "Install Vedix.Ai - AI Workspace App";
    const body = `Hi,\n\nCheck out Vedix.Ai! You can use it on web or scan & install it on your mobile phone:\n\n${appUrl}`;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        body
      )}`,
      "_blank"
    );
  };

  const handleThemeChange = (themeName, hexColor) => {
    setActiveTheme(themeName);
    setQrColor(hexColor);
  };

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="qr-close-btn" onClick={onClose} title="Close modal">
          <FiX />
        </button>

        {/* Modal Header */}
        <div className="qr-modal-header">
          <div className="qr-header-icon-box">
            <img src={assets.gemini_icon} alt="Vedix.Ai" className="qr-brand-logo" />
          </div>
          <div>
            <div className="qr-title-row">
              <h2>Get Vedix.Ai App</h2>
              <span className="sparkle-pill">✨ Official</span>
            </div>
            <p>Scan QR code with your mobile camera to install Vedix.Ai instantly!</p>
          </div>
        </div>

        {/* Color Theme Selector Pills */}
        <div className="qr-theme-picker">
          <span className="picker-label">QR Style:</span>
          <button
            className={`theme-pill indigo ${activeTheme === "indigo" ? "active" : ""}`}
            onClick={() => handleThemeChange("indigo", "4f46e5")}
            title="Indigo Neon"
          >
            💜 Indigo
          </button>
          <button
            className={`theme-pill pink ${activeTheme === "pink" ? "active" : ""}`}
            onClick={() => handleThemeChange("pink", "ec4899")}
            title="Cyber Pink"
          >
            💖 Pink
          </button>
          <button
            className={`theme-pill emerald ${activeTheme === "emerald" ? "active" : ""}`}
            onClick={() => handleThemeChange("emerald", "10b981")}
            title="Emerald Spark"
          >
            💚 Emerald
          </button>
          <button
            className={`theme-pill dark ${activeTheme === "dark" ? "active" : ""}`}
            onClick={() => handleThemeChange("dark", "0f172a")}
            title="Midnight Dark"
          >
            🖤 Dark
          </button>
        </div>

        {/* Stunning Animated QR Code Container */}
        <div className="qr-code-section">
          <div className={`qr-image-wrapper theme-${activeTheme}`}>
            <img
              src={qrCodeApiUrl}
              alt="Scan QR Code to Download Vedix.Ai App"
              className="qr-code-img"
            />
            {/* Center Brand Overlay Icon */}
            <div className="qr-center-logo">
              <img src={assets.gemini_icon} alt="Vedix.Ai Logo" />
            </div>

            {/* Live Laser Scanner Line Animation */}
            <div className="qr-scan-line"></div>

            <div className="qr-badge">
              <FiSmartphone /> Scan with Phone
            </div>
          </div>

          <p className="qr-instructions">
            Point your smartphone camera at the QR code to open & install <strong>Vedix.Ai</strong>.
          </p>

          {/* Platform Badges */}
          <div className="platform-badges">
            <span className="plat-badge android">
              <RiAndroidFill /> Android
            </span>
            <span className="plat-badge ios">
              <RiAppleFill /> iPhone & iPad
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="qr-modal-actions">
          {/* PWA Install Button */}
          <button
            className={`pwa-install-btn ${installed ? "installed" : ""}`}
            onClick={handleInstallPWA}
          >
            <FiDownload />
            {installed ? "Vedix.Ai Installed ✓" : "Install Web App (PWA)"}
          </button>

          {/* Copy Link Row */}
          <div className="copy-link-box">
            <input type="text" value={appUrl} readOnly />
            <button onClick={handleCopyLink}>
              {copied ? <FiCheck className="copied-icon" /> : <FiCopy />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>

          {/* Toast Notification on Copy */}
          {copied && (
            <div className="copy-toast">
              ✨ Vedix.Ai link copied to clipboard! 🎉
            </div>
          )}

          {/* External Share Row */}
          <div className="qr-share-row">
            <span>Share App:</span>
            <div className="qr-share-btns">
              <button
                className="qr-share-btn whatsapp"
                onClick={handleWhatsAppShare}
                title="Share via WhatsApp"
              >
                <FiMessageCircle /> WhatsApp
              </button>
              <button
                className="qr-share-btn email"
                onClick={handleEmailShare}
                title="Share via Email"
              >
                <FiMail /> Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadAppModal;
