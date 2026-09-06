import React, { useState } from "react";
import { FiLock, FiShield, FiX, FiCheckCircle, FiExternalLink, FiUser, FiInfo } from "react-icons/fi";

const BookingSafetyModal = ({ isOpen, onClose, selectedTransport, selectedStay, userParams, budgetAnalysis }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen) return null;

  const transportCost = selectedTransport?.totalPrice || 0;
  const stayCost = selectedStay?.totalPrice || 0;
  const subtotal = transportCost + stayCost;
  const taxesAndFees = Math.round(subtotal * 0.05); // 5% taxes & fees
  const finalTotalAmount = subtotal + taxesAndFees;

  const handleConfirm = () => {
    setIsConfirmed(true);
  };

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal-card">
        <div className="modal-header-bar">
          <div className="title-with-shield">
            <FiShield className="shield-icon" />
            <div>
              <h3>Booking Safety & Review Confirmation</h3>
              <p>AI Travel Agent Safety Protocol: Explicit User Confirmation Required</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>

        {isConfirmed ? (
          <div className="booking-success-screen">
            <div className="success-icon"><FiCheckCircle /></div>
            <h2>Booking Review Confirmed!</h2>
            <p>Your travel itinerary and tickets have been reserved via verified partner adapters.</p>

            <div className="ticket-summary-box">
              <p><strong>Reservation Reference:</strong> LEXI-TRV-2026-98421</p>
              <p><strong>Transport:</strong> {selectedTransport?.operator || selectedTransport?.trainName || selectedTransport?.airline || "Selected Mode"}</p>
              <p><strong>Stay:</strong> {selectedStay?.name || "Selected Stay"}</p>
              <p><strong>Total Amount:</strong> ₹{finalTotalAmount.toLocaleString()}</p>
            </div>

            <div className="modal-actions-centered">
              <button
                className="btn-primary-gradient"
                onClick={() => {
                  alert("Redirecting securely to official booking partner gateway...");
                  onClose();
                  setIsConfirmed(false);
                }}
              >
                Proceed to Partner Booking Gateway <FiExternalLink />
              </button>
            </div>
          </div>
        ) : (
          <div className="modal-body-content">
            <div className="safety-notice-banner">
              <FiLock className="lock-icon" />
              <span>
                <strong>No Automatic Charges:</strong> The AI Agent will never purchase tickets or spend money without your explicit final confirmation.
              </span>
            </div>

            <div className="review-section">
              <h4>1. Trip Details & Passengers</h4>
              <div className="details-grid">
                <div><span>Route:</span> <strong>{userParams?.origin} → {userParams?.destination}</strong></div>
                <div><span>Dates:</span> <strong>{userParams?.departureDate} to {userParams?.returnDate || "N/A"}</strong></div>
                <div><span>Travelers:</span> <strong>{userParams?.travelers} Passengers ({userParams?.roomsCount || 1} Room)</strong></div>
              </div>
            </div>

            <div className="review-section">
              <h4>2. Selected Transportation</h4>
              {selectedTransport ? (
                <div className="item-review-box">
                  <div className="review-head">
                    <span className="mode-badge">{selectedTransport.mode}</span>
                    <strong>{selectedTransport.operator || selectedTransport.airline || selectedTransport.trainName || selectedTransport.provider || selectedTransport.vehicle}</strong>
                  </div>
                  <p>{selectedTransport.departureTime} - {selectedTransport.arrivalTime} ({selectedTransport.duration})</p>
                  <span className="policy-sub"><FiInfo /> {selectedTransport.cancellationPolicy}</span>
                  <div className="price-val">₹{selectedTransport.totalPrice.toLocaleString()}</div>
                </div>
              ) : (
                <p className="empty-sub">No transport selected.</p>
              )}
            </div>

            <div className="review-section">
              <h4>3. Selected Accommodation</h4>
              {selectedStay ? (
                <div className="item-review-box">
                  <div className="review-head">
                    <span className="mode-badge">{selectedStay.category}</span>
                    <strong>{selectedStay.name}</strong>
                  </div>
                  <p>{selectedStay.location} ({selectedStay.nights} nights)</p>
                  <span className="policy-sub"><FiInfo /> {selectedStay.cancellationPolicy}</span>
                  <div className="price-val">₹{selectedStay.totalPrice.toLocaleString()}</div>
                </div>
              ) : (
                <p className="empty-sub">No hotel selected.</p>
              )}
            </div>

            <div className="itemized-price-breakdown">
              <div className="price-row"><span>Transport Subtotal:</span> <span>₹{transportCost.toLocaleString()}</span></div>
              <div className="price-row"><span>Stay Subtotal:</span> <span>₹{stayCost.toLocaleString()}</span></div>
              <div className="price-row"><span>Estimated Taxes & Partner Convenience Fee (5%):</span> <span>₹{taxesAndFees.toLocaleString()}</span></div>
              <div className="price-row total-row"><span>Total Payable Amount:</span> <span>₹{finalTotalAmount.toLocaleString()}</span></div>
            </div>

            <div className="modal-actions-footer">
              <button className="btn-secondary" onClick={onClose}>Cancel / Modify Plan</button>
              <button className="btn-primary-gradient" onClick={handleConfirm}>
                Confirm & Continue to Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSafetyModal;
