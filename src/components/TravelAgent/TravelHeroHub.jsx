import React, { useState } from "react";
import {
  FaTrainSubway,
  FaPlane,
  FaBus,
  FaCar,
  FaRepeat,
  FaArrowRight,
  FaCalendarDays,
  FaUser,
  FaLocationDot,
  FaBolt,
  FaShieldHalved,
  FaClock,
  FaStar,
  FaChevronDown,
  FaEarthAsia,
  FaMagnifyingGlass,
  FaCircleCheck,
} from "react-icons/fa6";

import PlaceAutocomplete from "./PlaceAutocomplete";
import TravelDatePicker from "./TravelDatePicker";

import heroSceneryImg from "../../assets/hero_travel_scenery.jpg";

export const CATEGORY_CARDS = [
  {
    mode: "train",
    title: "Trains",
    tabLabel: "Train",
    subtitle: "IRCTC & all train options",
    icon: FaTrainSubway,
    iconBg: "#eff6ff",
    iconColor: "#2563eb",
    fromPlaceholder: "Boarding Station (e.g. NDLS / Delhi)",
    toPlaceholder: "Destination (e.g. JP / Jaipur)",
    ctaText: "Search Trains",
  },
  {
    mode: "flight",
    title: "Flights",
    tabLabel: "Flight",
    subtitle: "Compare top airlines",
    icon: FaPlane,
    iconBg: "#f5f3ff",
    iconColor: "#7c3aed",
    fromPlaceholder: "Departure Airport (e.g. DEL / Delhi)",
    toPlaceholder: "Arrival Airport (e.g. BOM / Mumbai)",
    ctaText: "Search Flights",
  },
  {
    mode: "bus",
    title: "Buses",
    tabLabel: "Bus",
    subtitle: "All major operators",
    icon: FaBus,
    iconBg: "#ecfdf5",
    iconColor: "#059669",
    fromPlaceholder: "Boarding Point (e.g. Kashmere Gate, Delhi)",
    toPlaceholder: "Drop City (e.g. Sindhi Camp, Jaipur)",
    ctaText: "Search Buses",
  },
  {
    mode: "cab",
    title: "Cabs",
    tabLabel: "Cab",
    subtitle: "Outstation & local rides",
    icon: FaCar,
    iconBg: "#fffbeb",
    iconColor: "#d97706",
    fromPlaceholder: "Pickup Location (e.g. Connaught Place)",
    toPlaceholder: "Drop City / Destination",
    ctaText: "Search Cabs",
  },
];

const TravelHeroHub = ({
  selectedMode = "train",
  onSelectMode,
  searchParams,
  onUpdateParams,
  onSearch,
  isLoading = false,
}) => {
  const [isSwapping, setIsSwapping] = useState(false);
  const [passengerDropdownOpen, setPassengerDropdownOpen] = useState(false);

  const activeConfig =
    CATEGORY_CARDS.find((c) => c.mode === selectedMode) || CATEGORY_CARDS[0];

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => setIsSwapping(false), 400);

    const currentOrigin = searchParams.origin || "";
    const currentDest = searchParams.destination || "";
    onUpdateParams({
      origin: currentDest,
      destination: currentOrigin,
    });
  };

  // Format date display
  const formatDateDisplay = (dateString) => {
    if (!dateString) return "Select Date";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="travel-hero-hub-wrapper">
      {/* Top Main Hero Showcase */}
      <section className="travel-hub-hero-card">
        {/* Background Scenery Image on Right */}
        <div className="hub-hero-scenery-pane">
          <img
            src={heroSceneryImg}
            alt="Travel Panoramas - Flights, Trains, Buses, Cabs"
            className="hub-scenery-img"
          />
          {/* Subtle gradient vignette blending into the white card */}
          <div className="hub-scenery-gradient-overlay" />
        </div>

        {/* Content Over Scenery (Left Side) */}
        <div className="hub-hero-content-col">
          {/* Top Platform Tag */}
          <div className="hub-tag-badge">
            <FaEarthAsia className="hub-tag-icon" />
            <span>All Your Travel Needs, One Platform</span>
          </div>

          {/* Hero Headlines */}
          <h1 className="hub-hero-main-title">
            <span className="hub-title-line-1">Plan. Compare. Book.</span>
            <span className="hub-title-line-2">
              Travel Smarter with <span className="vedix-brand-name">Vedix</span>
            </span>
          </h1>

          {/* Description */}
          <p className="hub-hero-subtitle">
            No more visiting multiple platforms. Get the best deals and real-time
            availability for Trains, Flights, Buses and Cabs — all in one place.
          </p>

          {/* Feature Badges Row */}
          <div className="hub-features-row">
            <div className="hub-feature-pill">
              <span className="feature-icon-circle icon-circle-rose">
                <FaBolt />
              </span>
              <span className="feature-label">Best Prices</span>
            </div>

            <div className="hub-feature-pill">
              <span className="feature-icon-circle icon-circle-emerald">
                <FaShieldHalved />
              </span>
              <span className="feature-label">Safe &amp; Trusted</span>
            </div>

            <div className="hub-feature-pill">
              <span className="feature-icon-circle icon-circle-violet">
                <FaClock />
              </span>
              <span className="feature-label">Real-time Availability</span>
            </div>

            <div className="hub-feature-pill">
              <span className="feature-icon-circle icon-circle-amber">
                <FaStar />
              </span>
              <span className="feature-label">Wide Options</span>
            </div>
          </div>

          {/* Interactive Unified Booking Widget */}
          <div className="hub-booking-widget-box">
            {/* Mode Switcher Tabs */}
            <div className="hub-mode-tabs-bar" role="tablist">
              {CATEGORY_CARDS.map((card) => {
                const Icon = card.icon;
                const isActive = selectedMode === card.mode;
                return (
                  <button
                    key={card.mode}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`hub-mode-tab-btn ${isActive ? "active-tab" : ""}`}
                    onClick={() => onSelectMode(card.mode)}
                  >
                    <Icon className="tab-mode-icon" />
                    <span>{card.tabLabel || card.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Input Fields Row */}
            <div className="hub-fields-grid-row">
              {/* FROM FIELD */}
              <div className="hub-input-field-card field-from">
                <PlaceAutocomplete
                  value={searchParams.origin || ""}
                  onChange={(val) => onUpdateParams({ origin: val })}
                  placeholder={activeConfig.fromPlaceholder}
                  label="From"
                  mode={selectedMode}
                  fieldRole="origin"
                />
              </div>

              {/* SWAP BUTTON */}
              <button
                type="button"
                className={`hub-swap-btn ${isSwapping ? "swapping-anim" : ""}`}
                onClick={handleSwap}
                title="Swap From and To"
                aria-label="Swap Locations"
              >
                <FaRepeat />
              </button>

              {/* TO FIELD */}
              <div className="hub-input-field-card field-to">
                <PlaceAutocomplete
                  value={searchParams.destination || ""}
                  onChange={(val) => onUpdateParams({ destination: val })}
                  placeholder={activeConfig.toPlaceholder}
                  label="To"
                  mode={selectedMode}
                  fieldRole="destination"
                />
              </div>

              {/* TRAVEL DATE FIELD */}
              <div className="hub-input-field-card field-date">
                <TravelDatePicker
                  selectedDate={searchParams.departureDate}
                  onDateChange={(newDate) =>
                    onUpdateParams({ departureDate: newDate })
                  }
                  label="Travel Date"
                />
              </div>

              {/* PASSENGERS FIELD */}
              <div
                className="hub-input-field-card field-passengers"
                onClick={() => setPassengerDropdownOpen(!passengerDropdownOpen)}
              >
                <div className="field-icon-wrap">
                  <FaUser className="field-icon" />
                </div>
                <div className="field-content-col">
                  <label className="field-label">Passengers</label>
                  <div className="field-dropdown-value">
                    <span>
                      {searchParams.passengers || 1}{" "}
                      {Number(searchParams.passengers) === 1
                        ? "Passenger"
                        : "Passengers"}
                    </span>
                    <FaChevronDown className="field-chevron-icon" />
                  </div>
                </div>

                {/* Dropdown Menu */}
                {passengerDropdownOpen && (
                  <div
                    className="passengers-popover"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        className={`passenger-option-btn ${
                          Number(searchParams.passengers) === num ? "selected" : ""
                        }`}
                        onClick={() => {
                          onUpdateParams({ passengers: num });
                          setPassengerDropdownOpen(false);
                        }}
                      >
                        <span>
                          {num} {num === 1 ? "Passenger" : "Passengers"}
                        </span>
                        {Number(searchParams.passengers) === num && (
                          <FaCircleCheck className="check-icon" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CTA Search Button */}
            <div className="hub-search-cta-row">
              <button
                type="button"
                className="hub-search-submit-btn"
                onClick={onSearch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="hub-spinner" />
                    <span>Searching Best {activeConfig.title}...</span>
                  </>
                ) : (
                  <>
                    <FaMagnifyingGlass className="cta-search-icon" />
                    <span>{activeConfig.ctaText}</span>
                    <FaArrowRight className="cta-arrow-icon" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TravelHeroHub;
