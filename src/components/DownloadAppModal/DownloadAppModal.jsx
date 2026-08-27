import React, { useState, useEffect } from "react";
import {
  FiX,
  FiSmartphone,
  FiCopy,
  FiCheck,
  FiDownload,
  FiMessageCircle,
  FiMail,
} from "react-icons/fi";
import { RiAndroidFill, RiAppleFill } from "react-icons/ri";
import { assets } from "../../assets/assets";
import "./DownloadAppModal.css";

const DownloadAppModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  // App URL to embed in QR Code
  const appUrl = window.location.origin;

  // Clean, crisp QR Code API URL (Dark Charcoal / Indigo)
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    appUrl
  )}&format=png&margin=10&color=1e293b&bgcolor=ffffff`;

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
    setTimeout(() => setCopied(false), 2000);
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
        "To install Vedix.Ai on your device:\n\n1. On Mobile: Tap browser menu (⋮ or share) -> 'Add to Home Screen'.\n2. On Desktop: Click install icon in address bar."
      );
    }
  };

  const handleWhatsAppShare = () => {
    const text = `Try Vedix.Ai - AI Workspace & Assistant!\nOpen & Install: ${appUrl}`;
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const handleEmailShare = () => {
    const subject = "Install Vedix.Ai App";
    const body = `Hi,\n\nCheck out Vedix.Ai! Open or install it on your mobile device:\n\n${appUrl}`;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        body
      )}`,
      "_blank"
    );
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
            <h2>Get Vedix.Ai App</h2>
            <p>Scan QR code with your mobile camera to install on phone</p>
          </div>
        </div>

        {/* Simple & Decent QR Code Container */}
        <div className="qr-code-section">
          <div className="qr-image-wrapper">
            <img
              src={qrCodeApiUrl}
              alt="Scan QR Code to Download Vedix.Ai App"
              className="qr-code-img"
            />
            {/* Center Brand Overlay Icon */}
            <div className="qr-center-logo">
              <img src={assets.gemini_icon} alt="Vedix.Ai Logo" />
            </div>
            <div className="qr-badge">
              <FiSmartphone /> Scan to Open
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
              <RiAppleFill /> iPhone / iOS
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
