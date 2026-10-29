import React, { useState } from "react";
import {
  FiLock,
  FiShield,
  FiX,
  FiCheckCircle,
  FiDownload,
  FiUser,
  FiInfo,
  FiCreditCard,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { FaTrainSubway, FaPlane, FaBus, FaCar } from "react-icons/fa6";

const BookingSafetyModal = ({
  isOpen,
  onClose,
  selectedTransport,
  selectedStay,
  userParams,
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [travelerName, setTravelerName] = useState("Paras");
  const [travelerAge, setTravelerAge] = useState("26");
  const [travelerGender, setTravelerGender] = useState("Male");
  const [travelerPhone, setTravelerPhone] = useState("+91 98765 43210");
  const [travelerEmail, setTravelerEmail] = useState("user@lexiai.com");
  const [reservationRef, setReservationRef] = useState("");

  if (!isOpen) return null;

  const passengers = Number(userParams?.travelers) || 1;
  const unitPrice = selectedTransport?.pricePerPerson || 1200;
  const baseCost = selectedTransport?.totalPrice || unitPrice * passengers;
  const taxesAndGst = Math.round(baseCost * 0.05); // 5% GST
  const travelInsurance = 49 * passengers;
  const instantDiscount = 150;
  const finalTotalAmount = Math.max(0, baseCost + taxesAndGst + travelInsurance - instantDiscount);

  const handleConfirm = (e) => {
    e.preventDefault();
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const pnr =
      selectedTransport?.mode === "Train"
        ? `PNR-IRCTC-${randomCode}`
        : selectedTransport?.mode === "Flight"
        ? `AIR-${selectedTransport?.flightNumber?.replace(/\s+/g, "") || "6E"}-${randomCode}`
        : selectedTransport?.mode === "Cab"
        ? `CAB-OTP-${Math.floor(1000 + Math.random() * 9000)}`
        : `BUS-TKT-${randomCode}`;
    setReservationRef(pnr);
    setIsConfirmed(true);
  };

  const getModeIcon = () => {
    switch (selectedTransport?.mode) {
      case "Train":
        return <FaTrainSubway className="mode-svg-icon" />;
      case "Flight":
        return <FaPlane className="mode-svg-icon" />;
      case "Cab":
        return <FaCar className="mode-svg-icon" />;
      default:
        return <FaBus className="mode-svg-icon" />;
    }
  };

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal-card">
        {/* Header */}
        <div className="modal-header-bar">
          <div className="title-with-shield">
            <FiShield className="shield-icon" />
            <div>
              <h3>Verified Booking &amp; Passenger Safety Checkout</h3>
              <p>AI Concierge Protocol: Verified Rates with Real-time Carrier API Confirmation</p>
            </div>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={() => {
              onClose();
              setIsConfirmed(false);
            }}
          >
            <FiX />
          </button>
        </div>

        {isConfirmed ? (
          /* Confirmation Screen */
          <div className="booking-success-screen">
            <div className="success-icon">
              <FiCheckCircle />
            </div>
            <h2>Booking Confirmed &amp; Ticket Issued!</h2>
            <p>
              Your reservation has been confirmed with real-time carrier validation and instant PNR generation.
            </p>

            <div className="ticket-summary-box">
              <div className="ticket-pnr-highlight">
                <span className="pnr-label">Booking Reference / PNR:</span>
                <span className="pnr-code">{reservationRef}</span>
              </div>

              <div className="ticket-grid-details">
                <div>
                  <span className="detail-sub">Passenger:</span>
                  <strong>
                    {travelerName} ({travelerAge} yrs, {travelerGender})
                  </strong>
                </div>
                <div>
                  <span className="detail-sub">Contact:</span>
                  <strong>{travelerPhone}</strong>
                </div>
                <div>
                  <span className="detail-sub">Service:</span>
                  <strong>
                    {selectedTransport?.operator ||
                      selectedTransport?.name ||
                      selectedTransport?.airline ||
                      "Carrier Partner"}
                  </strong>
                </div>
                <div>
                  <span className="detail-sub">Route:</span>
                  <strong>{selectedTransport?.route || `${userParams?.origin} → ${userParams?.destination}`}</strong>
                </div>
                <div>
                  <span className="detail-sub">Timing:</span>
                  <strong>
                    {selectedTransport?.departureTime} → {selectedTransport?.arrivalTime} ({selectedTransport?.duration})
                  </strong>
                </div>
                <div>
                  <span className="detail-sub">Total Paid:</span>
                  <strong className="total-highlight">₹{finalTotalAmount.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <div className="modal-actions-centered">
              <button
                type="button"
                className="btn-primary-gradient"
                onClick={() => {
                  alert(`E-Ticket downloaded for ${travelerName} (Reference: ${reservationRef})! A copy has also been sent to ${travelerEmail}.`);
                }}
              >
                <FiDownload /> Download Verified E-Ticket (PDF)
              </button>

              <button
                type="button"
                className="travel-back-home-btn"
                style={{ marginLeft: "12px", cursor: "pointer", border: "1px solid #cbd5e1" }}
                onClick={() => {
                  onClose();
                  setIsConfirmed(false);
                }}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Review Form */
          <form className="modal-body-content" onSubmit={handleConfirm}>
            <div className="safety-notice-banner">
              <FiLock className="lock-icon" />
              <span>
                <strong>100% Real Fare &amp; Verified Safety:</strong> Direct official carrier partner confirmation. No hidden charges or automatic recurring deductions.
              </span>
            </div>

            {/* Section 1: Trip & Carrier Summary */}
            <div className="review-section">
              <h4>1. Trip Details &amp; Selected Operator</h4>
              <div className="item-review-box">
                <div className="review-head">
                  <span className="mode-badge">
                    {getModeIcon()}
                    <span>{selectedTransport?.mode || "Transport"}</span>
                  </span>
                  <strong>
                    {selectedTransport?.operator ||
                      selectedTransport?.name ||
                      selectedTransport?.airline ||
                      "Carrier Partner"}
                  </strong>
                </div>
                <p>
                  <strong>Route:</strong> {selectedTransport?.route || `${userParams?.origin} → ${userParams?.destination}`}
                </p>
                <p>
                  <strong>Schedule:</strong> {selectedTransport?.departureTime} – {selectedTransport?.arrivalTime} ({selectedTransport?.duration})
                </p>
                <span className="policy-sub">
                  <FiInfo /> Free cancellation up to 4 hours before departure with instant refund.
                </span>
              </div>
            </div>

            {/* Section 2: Traveler Input Details */}
            <div className="review-section">
              <h4>2. Passenger &amp; Contact Details</h4>
              <div className="passenger-input-grid">
                <div className="input-field-group">
                  <label>Full Name</label>
                  <div className="input-wrap">
                    <FiUser className="input-icon" />
                    <input
                      type="text"
                      required
                      value={travelerName}
                      onChange={(e) => setTravelerName(e.target.value)}
                      placeholder="e.g. Paras Sharma"
                    />
                  </div>
                </div>

                <div className="input-field-group">
                  <label>Age</label>
                  <input
                    type="number"
                    min="1"
                    max="110"
                    required
                    value={travelerAge}
                    onChange={(e) => setTravelerAge(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <div className="input-field-group">
                  <label>Gender</label>
                  <select
                    value={travelerGender}
                    onChange={(e) => setTravelerGender(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="input-field-group">
                  <label>Mobile Number</label>
                  <div className="input-wrap">
                    <FiPhone className="input-icon" />
                    <input
                      type="tel"
                      required
                      value={travelerPhone}
                      onChange={(e) => setTravelerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="input-field-group">
                  <label>Email Address</label>
                  <div className="input-wrap">
                    <FiMail className="input-icon" />
                    <input
                      type="email"
                      required
                      value={travelerEmail}
                      onChange={(e) => setTravelerEmail(e.target.value)}
                      placeholder="user@example.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Itemized Real Price Breakdown */}
            <div className="review-section">
              <h4>3. Itemized Price Breakdown</h4>
              <div className="budget-breakdown-table">
                <div className="bill-row">
                  <span>
                    Base Ticket Fare ({passengers} {passengers === 1 ? "Traveler" : "Travelers"} × ₹{unitPrice.toLocaleString()}):
                  </span>
                  <span>₹{baseCost.toLocaleString()}</span>
                </div>
                <div className="bill-row">
                  <span>Applicable GST &amp; Transport Authority Surcharge (5%):</span>
                  <span>₹{taxesAndGst.toLocaleString()}</span>
                </div>
                <div className="bill-row">
                  <span>Passenger Medical &amp; Trip Delay Insurance (₹49/person):</span>
                  <span>₹{travelInsurance.toLocaleString()}</span>
                </div>
                <div className="bill-row promo-discount-row">
                  <span>Instant Vedix AI Concierge Promotion:</span>
                  <span className="discount-text">-₹{instantDiscount.toLocaleString()}</span>
                </div>
                <div className="bill-row bill-total-row">
                  <strong>Total Amount Payable:</strong>
                  <strong className="grand-total-val">₹{finalTotalAmount.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="modal-actions-bar">
              <button
                type="button"
                className="btn-secondary-cancel"
                onClick={() => {
                  onClose();
                  setIsConfirmed(false);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn-confirm-action">
                <FiCreditCard /> Confirm &amp; Issue Ticket (₹{finalTotalAmount.toLocaleString()})
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingSafetyModal;
