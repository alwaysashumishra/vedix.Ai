import React, { useState } from "react";
import { FiAward, FiClock, FiStar, FiCheckCircle, FiShield, FiFilter, FiCheck, FiWifi, FiCoffee, FiZap } from "react-icons/fi";
import { TRANSPORT_MODE_MEDIA } from "./travelMedia";

const TransportComparison = ({ transportOptions = [], selectedTransport = null, onSelectTransport }) => {
  const [activeTabMode, setActiveTabMode] = useState("All");
  const [sortBy, setSortBy] = useState("aiScore");
  const [acOnly, setAcOnly] = useState(false);
  const [directOnly, setDirectOnly] = useState(false);

  const modes = ["All", "Bus", "Flight", "Train", "Cab", "Car Rental"];

  let filtered = transportOptions.filter((item) => {
    if (activeTabMode !== "All" && item.mode !== activeTabMode) return false;
    if (acOnly && !item.isAC) return false;
    if (directOnly && !item.isDirect) return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (sortBy === "aiScore") return b.aiScore - a.aiScore;
    if (sortBy === "priceAsc") return a.totalPrice - b.totalPrice;
    if (sortBy === "durationAsc") return a.durationMinutes - b.durationMinutes;
    if (sortBy === "ratingDesc") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="transport-comparison-card">
      <div className="comparison-header">
        <div>
          <h3>Transport Comparison Engine</h3>
          <p>Search & compare verified options across Buses, Flights, Trains, Cabs, and Rentals.</p>
        </div>
        <div className="data-integrity-badge">
          <FiShield /> Live Data Status: <span>Verified Demo Adapters</span>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="mode-tabs-row">
        {modes.map((mode) => (
          <button
            key={mode}
            className={`mode-tab-btn ${activeTabMode === mode ? "active" : ""}`}
            onClick={() => setActiveTabMode(mode)}
          >
            {mode === "Bus" && "🚌 "}
            {mode === "Flight" && "✈️ "}
            {mode === "Train" && "🚆 "}
            {mode === "Cab" && "🚖 "}
            {mode === "Car Rental" && "🚗 "}
            {mode}
          </button>
        ))}
      </div>

      {/* Filter & Sort Toolbar */}
      <div className="toolbar-row">
        <div className="filter-group">
          <label className="checkbox-filter">
            <input type="checkbox" checked={acOnly} onChange={(e) => setAcOnly(e.target.checked)} />
            <span>AC Only</span>
          </label>
          <label className="checkbox-filter">
            <input type="checkbox" checked={directOnly} onChange={(e) => setDirectOnly(e.target.checked)} />
            <span>Direct Journey Only</span>
          </label>
        </div>

        <div className="sort-group">
          <label><FiFilter /> Sort By:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="aiScore">🤖 AI Score (Best Match)</option>
            <option value="priceAsc">💰 Price: Low to High</option>
            <option value="durationAsc">⚡ Duration: Fastest First</option>
            <option value="ratingDesc">⭐ Rating: High to Low</option>
          </select>
        </div>
      </div>

      {/* Options List */}
      <div className="transport-cards-list">
        {filtered.length === 0 ? (
          <div className="empty-results-msg">No transport options matching the selected filters. Try unchecking AC or Direct filters.</div>
        ) : (
          filtered.map((item) => {
            const isSelected = selectedTransport?.id === item.id;
            const modeMedia = TRANSPORT_MODE_MEDIA[item.mode] || TRANSPORT_MODE_MEDIA.Bus;

            return (
              <div key={item.id} className={`transport-item-card ${isSelected ? "selected-card" : ""} ${item.isTopRecommendation ? "top-recommendation" : ""}`}>
                {item.isTopRecommendation && (
                  <div className="ai-top-badge">
                    <FiAward /> 🏆 AI TOP RECOMMENDATION ({item.aiScore}/100 Match Score)
                  </div>
                )}

                <div className="card-main-grid">
                  {/* Left Column with Mode Image */}
                  <div className="operator-info-with-img">
                    <div className="mode-img-thumbnail">
                      <img src={modeMedia.image} alt={item.mode} />
                      <span className="mode-icon-floating">{modeMedia.icon}</span>
                    </div>

                    <div className="operator-details">
                      <span className="mode-pill" style={{ background: `${modeMedia.badgeColor}22`, color: modeMedia.badgeColor, borderColor: modeMedia.badgeColor }}>
                        {item.mode}
                      </span>
                      <h4 className="operator-name">{item.operator || item.airline || item.trainName || item.provider || item.vehicle}</h4>
                      <p className="sub-detail">{item.busType || item.classType || item.vehicleType || item.flightNumber || ""}</p>
                      <div className="rating-row">
                        <span className="star-badge"><FiStar /> {item.rating}</span>
                        <span className="reviews-count">({item.reviewsCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Route & Timings Column */}
                  <div className="route-timing-info">
                    <div className="timing-col">
                      <span className="time-val">{item.departureTime}</span>
                      <span className="station-val">{item.departureStation || item.pickupPoint || item.departureAirport || "Departure Point"}</span>
                    </div>
                    <div className="duration-col">
                      <span className="duration-val"><FiClock /> {item.duration}</span>
                      <div className="line-indicator">
                        <span className="dot"></span>
                        <span className="line"></span>
                        <span className="dot"></span>
                      </div>
                      <span className="direct-badge">{item.isDirect ? "Direct Non-Stop" : `${item.transfers} Stop`}</span>
                    </div>
                    <div className="timing-col">
                      <span className="time-val">{item.arrivalTime}</span>
                      <span className="station-val">{item.arrivalStation || item.dropPoint || item.arrivalAirport || "Arrival Point"}</span>
                    </div>
                  </div>

                  {/* Pricing & Selection Column */}
                  <div className="pricing-col">
                    <div className="price-tag">
                      <span className="currency">₹</span>
                      <span className="amount">{item.totalPrice.toLocaleString()}</span>
                    </div>
                    <span className="price-sub">₹{item.pricePerPerson} / person</span>
                    <span className="cancellation-sub">{item.cancellationPolicy}</span>
                    <button
                      className={`btn-select-option ${isSelected ? "btn-selected" : ""}`}
                      onClick={() => onSelectTransport(item)}
                    >
                      {isSelected ? <><FiCheck /> Selected</> : "Select Transport"}
                    </button>
                  </div>
                </div>

                {/* Amenities Chips */}
                {item.amenities && item.amenities.length > 0 && (
                  <div className="transport-amenities-row">
                    {item.amenities.map((am, idx) => (
                      <span key={idx} className="transport-amenity-tag">✓ {am}</span>
                    ))}
                  </div>
                )}

                {/* AI Explanation Bar */}
                <div className="ai-reason-bar">
                  <span className="reason-label">🤖 Why this is recommended:</span>
                  <p>{item.whyRecommended}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransportComparison;
