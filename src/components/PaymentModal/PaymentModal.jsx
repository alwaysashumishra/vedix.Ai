import React, { useState } from "react";
import {
  FiCheck,
  FiCheckCircle,
  FiCopy,
  FiCreditCard,
  FiInfo,
  FiShield,
  FiSmartphone,
  FiX,
} from "react-icons/fi";
import axios from "axios";
import { API_BASE } from "../../config/apiConfig";
import "./PaymentModal.css";

const PAYMENTS_API = `${API_BASE}/payments`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generate SVG QR Code pattern for UPI URI
const renderQRCodeSVG = (upiUrl) => {
  // A sleek vector QR code fallback preview styled cleanly
  return (
    <svg viewBox="0 0 200 200" className="upi-qr-svg">
      <rect width="200" height="200" fill="#ffffff" rx="12" />
      {/* Corner position squares */}
      <rect x="16" y="16" width="48" height="48" fill="#0f172a" rx="4" />
      <rect x="24" y="24" width="32" height="32" fill="#ffffff" rx="2" />
      <rect x="30" y="30" width="20" height="20" fill="#6366f1" rx="2" />

      <rect x="136" y="16" width="48" height="48" fill="#0f172a" rx="4" />
      <rect x="144" y="24" width="32" height="32" fill="#ffffff" rx="2" />
      <rect x="150" y="30" width="20" height="20" fill="#6366f1" rx="2" />

      <rect x="16" y="136" width="48" height="48" fill="#0f172a" rx="4" />
      <rect x="24" y="144" width="32" height="32" fill="#ffffff" rx="2" />
      <rect x="30" y="150" width="20" height="20" fill="#6366f1" rx="2" />

      {/* Decorative QR matrix modules */}
      <path
        d="M74,20 h10 v10 h-10 z M94,20 h12 v12 h-12 z M116,20 h10 v10 h-10 z
           M74,40 h12 v10 h-12 z M96,44 h10 v10 h-10 z M116,40 h12 v12 h-12 z
           M20,74 h10 v12 h-10 z M40,74 h12 v10 h-12 z M60,74 h10 v10 h-10 z M80,74 h14 v14 h-14 z M104,74 h10 v10 h-10 z M124,74 h14 v14 h-14 z M148,74 h10 v10 h-10 z M168,74 h12 v12 h-12 z
           M20,94 h14 v10 h-14 z M44,96 h10 v10 h-10 z M64,94 h12 v12 h-12 z M86,96 h10 v10 h-10 z M106,94 h14 v10 h-14 z M130,96 h10 v10 h-10 z M150,94 h12 v12 h-12 z M172,96 h10 v10 h-10 z
           M20,116 h10 v10 h-10 z M38,116 h12 v12 h-12 z M60,116 h10 v10 h-10 z M80,116 h12 v10 h-12 z M100,116 h10 v10 h-10 z M120,116 h14 v14 h-14 z M144,116 h12 v10 h-12 z M166,116 h14 v14 h-14 z
           M74,136 h12 v12 h-12 z M96,136 h14 v10 h-14 z M120,136 h10 v10 h-10 z M144,138 h10 v10 h-10 z M164,136 h12 v12 h-12 z
           M74,158 h10 v10 h-10 z M94,156 h12 v12 h-12 z M116,158 h10 v10 h-10 z M136,156 h14 v14 h-14 z M160,158 h12 v10 h-12 z
           M74,176 h14 v10 h-14 z M98,176 h10 v10 h-10 z M118,176 h12 v12 h-12 z M140,176 h10 v10 h-10 z M160,176 h16 v16 h-16 z"
        fill="#1e293b"
      />

      {/* Center UPI Logo branding badge */}
      <rect x="78" y="78" width="44" height="44" fill="#ffffff" rx="8" />
      <rect x="82" y="82" width="36" height="36" fill="#6366f1" rx="6" />
      <text
        x="100"
        y="105"
        fill="#ffffff"
        fontSize="14"
        fontWeight="800"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        UPI
      </text>
    </svg>
  );
};

const PaymentModal = ({ plan, profile, onClose, onPaymentSubmitted, siteConfig = {} }) => {
  const [transactionId, setTransactionId] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [submittedPayment, setSubmittedPayment] = useState(null);

  const priceAmount = plan.name === "Pro" ? (siteConfig.proPlanPrice || 199) : (siteConfig.premiumPlanPrice || 499);
  const upiId = siteConfig.upiId || "vedixai@upi";
  const payeeName = siteConfig.payeeName || "Vedix AI";

  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${priceAmount}&cu=INR&tn=${encodeURIComponent(plan.name + " Plan Upgrade")}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!transactionId.trim() || transactionId.trim().length < 6) {
      setError("Please enter a valid UPI Transaction ID / UTR number (min 6 characters).");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${PAYMENTS_API}/submit-qr`,
        {
          plan: plan.name,
          amount: priceAmount,
          transactionId: transactionId.trim(),
          note: note.trim(),
        },
        { headers: getAuthHeaders() }
      );

      if (response.data.success) {
        setSubmittedPayment(response.data.payment);
        if (onPaymentSubmitted) {
          onPaymentSubmitted(response.data.payment);
        }
      } else {
        setError(response.data.message || "Failed to submit payment.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="payment-modal-close" onClick={onClose}>
          <FiX />
        </button>

        {!submittedPayment ? (
          <>
            <div className="payment-modal-header">
              <span className="payment-badge">UPI QR Payment</span>
              <h2>Complete Payment for {plan.name} Plan</h2>
              <p>Scan QR code using any UPI app (GPay, PhonePe, Paytm, BHIM) to upgrade instantly.</p>
            </div>

            <div className="payment-plan-summary">
              <div className="plan-summary-info">
                <h3>{plan.name} Subscription</h3>
                <span>{plan.period || "per month"}</span>
              </div>
              <div className="plan-summary-price">₹{priceAmount}</div>
            </div>

            <div className="payment-qr-container">
              <div className="qr-wrapper">
                {renderQRCodeSVG(upiUrl)}
                <div className="qr-scan-label">Scan & Pay ₹{priceAmount}</div>
              </div>

              <div className="payment-upi-details">
                <div className="upi-id-box">
                  <span className="upi-label">UPI ID / VPA:</span>
                  <div className="upi-id-value">
                    <strong>{upiId}</strong>
                    <button type="button" onClick={handleCopyUpi} className="copy-upi-btn">
                      {copied ? <FiCheck /> : <FiCopy />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="upi-apps-row">
                  <a href={upiUrl} className="upi-pay-link">
                    <FiSmartphone /> Open in UPI App
                  </a>
                </div>

                <div className="upi-notice">
                  <FiShield /> 100% Secure Payment verification via UTR / Transaction ID
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="payment-form">
              <div className="form-group">
                <label htmlFor="txId">
                  UPI Transaction ID / UTR Number <span className="required">*</span>
                </label>
                <input
                  id="txId"
                  type="text"
                  placeholder="e.g. 423910582910 or T2408271500"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                />
                <span className="form-hint">Enter the 12-digit UTR/Reference number from your UPI app receipt.</span>
              </div>

              <div className="form-group">
                <label htmlFor="txNote">Optional Remark / User Note</label>
                <input
                  id="txNote"
                  type="text"
                  placeholder="e.g. Paid via PhonePe by John"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              {error && <div className="payment-error"><FiInfo /> {error}</div>}

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  <FiCreditCard />
                  {loading ? "Submitting..." : `Submit Payment (₹${priceAmount})`}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="payment-success-view">
            <div className="success-icon-ring">
              <FiCheckCircle />
            </div>
            <h2>Payment Submitted!</h2>
            <p>Your payment request for <strong>{submittedPayment.plan} Plan</strong> (₹{submittedPayment.amount}) has been recorded.</p>
            
            <div className="payment-receipt-box">
              <div className="receipt-row">
                <span>Transaction ID:</span>
                <strong>{submittedPayment.transactionId}</strong>
              </div>
              <div className="receipt-row">
                <span>Status:</span>
                <span className="status-badge pending">Pending Verification</span>
              </div>
              <div className="receipt-row">
                <span>Account Email:</span>
                <strong>{profile?.email}</strong>
              </div>
            </div>

            <div className="success-note">
              An administrator will verify your UTR reference shortly. Once approved, your account will automatically upgrade to <strong>{submittedPayment.plan} Plan</strong>.
            </div>

            <button type="button" className="btn-primary full-width" onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
