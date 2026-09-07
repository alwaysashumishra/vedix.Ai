import React, { useState } from "react";
import {
  FiAward,
  FiClock,
  FiStar,
  FiShield,
  FiFilter,
  FiCheck,
  FiExternalLink,
  FiTrendingDown,
  FiCheckCircle,
  FiZap,
} from "react-icons/fi";
import { TRANSPORT_MODE_MEDIA } from "./travelMedia";

const TransportComparison = ({
  transportOptions = [],
  selectedTransport = null,
  onSelectTransport,
}) => {
  const [activeTabMode, setActiveTabMode] = useState("All");
  const [sortBy, setSortBy] = useState("aiScore");
  const [acOnly, setAcOnly] = useState(false);
  const [directOnly, setDirectOnly] = useState(false);
  const [showCheapestPlatformOnly, setShowCheapestPlatformOnly] = useState(false);

  const modes = ["All", "Bus", "Flight", "Train", "Cab", "Car Rental"];

  // Filter transport options based on user selections
  let filtered = transportOptions.filter((item) => {
    if (activeTabMode !== "All" && item.mode !== activeTabMode) return false;
    if (acOnly && !item.isAC) return false;
    if (directOnly && !item.isDirect) return false;
    return true;
  });

  // Sort logic
  filtered.sort((a, b) => {
    if (sortBy === "aiScore") return (b.aiScore || 0) - (a.aiScore || 0);
    if (sortBy === "priceAsc") return a.totalPrice - b.totalPrice;
    if (sortBy === "durationAsc") return a.durationMinutes - b.durationMinutes;
    if (sortBy === "ratingDesc") return b.rating - a.rating;
    return 0;
  });

  // Calculate count per mode for tab counters
  const getModeCount = (m) => {
    if (m === "All") return transportOptions.length;
    return transportOptions.filter((item) => item.mode === m).length;
  };

  return (
    <div className="transport-comparison-card">
      {/* Header Banner */}
      <div className="comparison-header">
        <div className="header-left">
          <div className="header-badge">
            <FiZap /> Live Multi-OTA & IRCTC Pricing Engine
          </div>
          <h3>Transport & Platform Comparison</h3>
          <p>
            Real-time price comparison across <strong>RedBus</strong>, <strong>AbhiBus</strong>, <strong>MakeMyTrip</strong>, and official <strong>IRCTC</strong> data.
          </p>
        </div>

        <div className="data-integrity-badge">
          <FiShield className="shield-icon" /> Live Data Status: <span>IRCTC & Multi-OTA Sync Active</span>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="mode-tabs-row">
        {modes.map((mode) => {
          const count = getModeCount(mode);
          return (
            <button
              key={mode}
              className={`mode-tab-btn ${activeTabMode === mode ? "active" : ""}`}
              onClick={() => setActiveTabMode(mode)}
            >
              <span className="mode-tab-icon">
                {mode === "Bus" && "🚌"}
                {mode === "Flight" && "✈️"}
                {mode === "Train" && "🚆"}
                {mode === "Cab" && "🚖"}
                {mode === "Car Rental" && "🚗"}
                {mode === "All" && "⚡"}
              </span>
              <span className="mode-tab-label">{mode}</span>
              <span className="mode-count-pill">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Toolbar for Filtering & Sorting */}
      <div className="toolbar-row">
        <div className="filter-group">
          <label className={`checkbox-filter-pill ${acOnly ? "active" : ""}`}>
            <input
              type="checkbox"
              checked={acOnly}
              onChange={(e) => setAcOnly(e.target.checked)}
            />
            <span>AC Only</span>
          </label>
          <label className={`checkbox-filter-pill ${directOnly ? "active" : ""}`}>
            <input
              type="checkbox"
              checked={directOnly}
              onChange={(e) => setDirectOnly(e.target.checked)}
            />
            <span>Direct Journey Only</span>
          </label>
          <label className={`checkbox-filter-pill ${showCheapestPlatformOnly ? "active" : ""}`}>
            <input
              type="checkbox"
              checked={showCheapestPlatformOnly}
              onChange={(e) => setShowCheapestPlatformOnly(e.target.checked)}
            />
            <span><FiTrendingDown /> Highlight Lowest Platform Rate</span>
          </label>
        </div>

        <div className="sort-group">
          <label htmlFor="sort-select"><FiFilter /> Sort By:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="aiScore">🤖 AI Match Score (Recommended)</option>
            <option value="priceAsc">💰 Price: Lowest First</option>
            <option value="durationAsc">⚡ Duration: Fastest First</option>
            <option value="ratingDesc">⭐ Rating: Highest First</option>
          </select>
        </div>
      </div>

      {/* Transport Cards List */}
      <div className="transport-cards-list">
        {filtered.length === 0 ? (
          <div className="empty-results-msg">
            No transport options match your filters. Try relaxing the AC or Direct filters.
          </div>
        ) : (
          filtered.map((item) => {
            const isSelected = selectedTransport?.id === item.id;
            const modeMedia = TRANSPORT_MODE_MEDIA[item.mode] || TRANSPORT_MODE_MEDIA.Bus;

            return (
              <div
                key={item.id}
                className={`transport-item-card ${isSelected ? "selected-card" : ""} ${
                  item.isTopRecommendation ? "top-recommendation" : ""
                }`}
              >
                {/* Top Recommendation Header Badge */}
                {item.isTopRecommendation && (
                  <div className="ai-top-badge">
                    <FiAward /> 🏆 AI TOP RECOMMENDATION ({item.aiScore || 88}/100 Match Score)
                  </div>
                )}

                <div className="card-main-grid">
                  {/* Left Column: Transport Image & Operator Details */}
                  <div className="operator-info-with-img">
                    <div className="mode-img-thumbnail">
                      <img src={modeMedia.image} alt={item.mode} />
                      <span className="mode-icon-floating">{modeMedia.icon}</span>
                    </div>

                    <div className="operator-details">
                      <div className="operator-pill-row">
                        <span
                          className="mode-pill"
                          style={{
                            background: `${modeMedia.badgeColor}18`,
                            color: modeMedia.badgeColor,
                            borderColor: modeMedia.badgeColor,
                          }}
                        >
                          {item.mode}
                        </span>
                        {item.seatType && (
                          <span className="seat-type-pill">{item.seatType}</span>
                        )}
                      </div>

                      <h4 className="operator-name">
                        {item.operator ||
                          item.airline ||
                          item.trainName ||
                          item.provider ||
                          item.vehicle}
                      </h4>
                      <p className="sub-detail">
                        {item.busType ||
                          item.classType ||
                          item.vehicleType ||
                          item.flightNumber ||
                          ""}
                      </p>
                      
                      <div className="rating-row">
                        <span className="star-badge">
                          <FiStar /> {item.rating}
                        </span>
                        <span className="reviews-count">({item.reviewsCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Route & Timings Column */}
                  <div className="route-timing-info">
                    <div className="timing-col departure">
                      <div className="time-val">{item.departureTime}</div>
                      <div className="station-val">
                        {item.departureStation ||
                          item.pickupPoint ||
                          item.departureAirport ||
                          "Departure Point"}
                      </div>
                    </div>

                    <div className="duration-col">
                      <span className="duration-val">
                        <FiClock className="clock-icon" /> {item.duration}
                      </span>
                      <div className="line-indicator">
                        <span className="dot"></span>
                        <span className="line"></span>
                        <span className="dot"></span>
                      </div>
                      <span className="direct-badge">
                        {item.isDirect ? "Direct Non-Stop" : `${item.transfers} Stop`}
                      </span>
                    </div>

                    <div className="timing-col arrival">
                      <div className="time-val">{item.arrivalTime}</div>
                      <div className="station-val">
                        {item.arrivalStation ||
                          item.dropPoint ||
                          item.arrivalAirport ||
                          "Arrival Point"}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Selection Column */}
                  <div className="pricing-col">
                    <div className="price-tag">
                      <span className="currency">₹</span>
                      <span className="amount">{item.totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="price-sub">₹{item.pricePerPerson.toLocaleString()} / person</div>

                    {item.cancellationPolicy && (
                      <div className="cancellation-sub">{item.cancellationPolicy}</div>
                    )}

                    <button
                      className={`btn-select-option ${isSelected ? "btn-selected" : ""}`}
                      onClick={() => onSelectTransport(item)}
                    >
                      {isSelected ? (
                        <>
                          <FiCheck /> Selected
                        </>
                      ) : (
                        "Select Transport"
                      )}
                    </button>
                  </div>
                </div>

                {/* IRCTC Live Data Verification Strip for Trains */}
                {item.mode === "Train" && item.irctcData && (
                  <div className="irctc-live-box">
                    <div className="irctc-header">
                      <span className="irctc-badge">
                        <FiCheckCircle /> IRCTC Live Verified
                      </span>
                      <span className="irctc-quota">{item.irctcData.quota}</span>
                    </div>
                    <div className="irctc-stats-grid">
                      <div className="irctc-stat-item">
                        <span className="stat-label">Confirmation Probability:</span>
                        <span className="stat-value text-green">{item.irctcData.pnrConfirmationProb}</span>
                      </div>
                      <div className="irctc-stat-item">
                        <span className="stat-label">IRCTC Status:</span>
                        <span className="stat-value">{item.irctcData.irctcSyncStatus}</span>
                      </div>
                      <div className="irctc-stat-item">
                        <span className="stat-label">Train Punctuality:</span>
                        <span className="stat-value">{item.irctcData.trainPunctuality}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Platform Price Comparisons (RedBus, AbhiBus, MMT, IRCTC, Ixigo, etc.) */}
                {item.platformComparisons && item.platformComparisons.length > 0 && (
                  <div className="platform-comparison-section">
                    <div className="platform-title">
                      <span>Compare Rates across Platforms:</span>
                      <span className="verified-ota-tag">Verified OTA Rates</span>
                    </div>

                    <div className="platform-chips-grid">
                      {item.platformComparisons.map((p, idx) => (
                        <div
                          key={idx}
                          className={`platform-price-chip ${
                            p.isCheapest ? "cheapest-chip" : ""
                          }`}
                        >
                          <div className="platform-chip-top">
                            <span className="platform-icon">{p.icon}</span>
                            <span className="platform-name">{p.platform}</span>
                            {p.badge && (
                              <span
                                className={`platform-badge ${
                                  p.isCheapest ? "badge-green" : "badge-blue"
                                }`}
                              >
                                {p.badge}
                              </span>
                            )}
                          </div>

                          <div className="platform-chip-bottom">
                            <div className="platform-price-val">
                              ₹{p.pricePerPerson.toLocaleString()} <span className="per-p">/person</span>
                            </div>
                            <a
                              href={p.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-link-platform"
                              title={`Book directly on ${p.platform}`}
                            >
                              Book <FiExternalLink className="ext-icon" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities Chips */}
                {item.amenities && item.amenities.length > 0 && (
                  <div className="transport-amenities-row">
                    {item.amenities.map((am, idx) => (
                      <span key={idx} className="transport-amenity-tag">
                        <FiCheck className="amenity-icon" /> {am}
                      </span>
                    ))}
                  </div>
                )}

                {/* AI Explanation Bar */}
                {item.whyRecommended && (
                  <div className="ai-reason-bar">
                    <div className="reason-label">🤖 Why this is recommended:</div>
                    <div className="reason-text">{item.whyRecommended}</div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransportComparison;
