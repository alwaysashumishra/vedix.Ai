import React, { useState, useEffect, useRef } from "react";
import {
  FaLocationDot,
  FaTrainSubway,
  FaPlane,
  FaBus,
  FaCar,
  FaXmark,
  FaMagnifyingGlass,
  FaCircleCheck,
  FaLandmark,
  FaMapLocationDot,
  FaCity,
} from "react-icons/fa6";
import { searchPlaces } from "./placesData";

const PlaceAutocomplete = ({
  value = "",
  onChange,
  onSelect,
  placeholder = "Search district, tehsil, city or station...",
  label = "Location",
  mode = "train",
  fieldRole = "origin", // "origin" | "destination"
  className = "",
  icon = FaLocationDot,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [activeCategory, setActiveCategory] = useState("all");
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const IconComponent = icon || FaLocationDot;

  // Reset category filter when mode changes
  useEffect(() => {
    setActiveCategory("all");
  }, [mode]);

  // Compute matched places based on query, mode, and category filter
  const results = searchPlaces(value, mode, activeCategory);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPlace = (place) => {
    // Generate clean display value
    let chosenText = place.name;
    if (place.type === "station" && place.code) {
      chosenText = `${place.name} (${place.code})`;
    } else if (place.type === "airport" && place.code) {
      chosenText = `${place.name} (${place.code})`;
    } else if (place.type === "bus") {
      chosenText = `${place.name}, ${place.district || place.city}`;
    } else if (place.type === "subdistrict") {
      chosenText = `${place.name}, ${place.district || place.city}`;
    } else if (place.type === "district") {
      chosenText = `${place.name}, ${place.state}`;
    } else if (place.type === "city") {
      chosenText = place.name;
    }

    onChange && onChange(chosenText);
    onSelect && onSelect(place, chosenText);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && results[highlightedIndex]) {
        handleSelectPlace(results[highlightedIndex]);
      } else if (results.length > 0) {
        handleSelectPlace(results[0]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const getItemIcon = (place) => {
    switch (place.type) {
      case "district":
        return <FaLandmark className="place-item-icon icon-district" />;
      case "subdistrict":
        return <FaMapLocationDot className="place-item-icon icon-subdistrict" />;
      case "station":
        return <FaTrainSubway className="place-item-icon icon-station" />;
      case "airport":
        return <FaPlane className="place-item-icon icon-airport" />;
      case "bus":
        return <FaBus className="place-item-icon icon-bus" />;
      case "cab":
        return <FaCar className="place-item-icon icon-cab" />;
      default:
        return <FaCity className="place-item-icon icon-city" />;
    }
  };

  // Helper to highlight matching text in search results
  const highlightMatch = (text = "", query = "") => {
    if (!text) return "";
    if (!query || !query.trim()) return text;
    const trimmed = query.trim();
    try {
      const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escaped})`, "gi");
      const parts = text.split(regex);
      return parts.map((part, i) =>
        part.toLowerCase() === trimmed.toLowerCase() ? (
          <mark key={i} className="place-query-match">
            {part}
          </mark>
        ) : (
          part
        )
      );
    } catch {
      return text;
    }
  };

  // Dynamic category tabs adapted to selected transport mode
  const getCategoryTabs = () => {
    if (mode === "bus") {
      return [
        { id: "all", label: "All" },
        { id: "bus", label: "🚌 Bus Stands & ISBTs" },
        { id: "district", label: "🏛 Districts" },
        { id: "subdistrict", label: "📍 Tehsils" },
      ];
    }
    if (mode === "train") {
      return [
        { id: "all", label: "All" },
        { id: "station", label: "🚆 Stations & Junctions" },
        { id: "district", label: "🏛 Districts" },
        { id: "subdistrict", label: "📍 Tehsils" },
      ];
    }
    if (mode === "flight") {
      return [
        { id: "all", label: "All" },
        { id: "airport", label: "✈️ Airports" },
        { id: "district", label: "🏛 Districts & Cities" },
      ];
    }
    // cab or fallback
    return [
      { id: "all", label: "All" },
      { id: "district", label: "🏛 Districts" },
      { id: "subdistrict", label: "📍 Tehsils" },
      { id: "transit", label: "🚉 Major Transit Hubs" },
    ];
  };

  const categoryTabs = getCategoryTabs();

  return (
    <div
      ref={wrapperRef}
      className={`place-autocomplete-container ${className} ${isOpen ? "dropdown-active" : ""}`}
    >
      <div className="field-icon-wrap" onClick={() => inputRef.current?.focus()}>
        <IconComponent className="field-icon" />
      </div>

      <div className="field-content-col" onClick={() => setIsOpen(true)}>
        {label && <label className="field-label">{label}</label>}
        <div className="place-input-row">
          <input
            ref={inputRef}
            type="text"
            className="field-text-input place-search-input"
            value={value}
            onChange={(e) => {
              onChange && onChange(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck="false"
          />
          {value && (
            <button
              type="button"
              className="place-clear-btn"
              onClick={(e) => {
                e.stopPropagation();
                onChange && onChange("");
                inputRef.current?.focus();
                setIsOpen(true);
              }}
              title="Clear text"
            >
              <FaXmark />
            </button>
          )}
        </div>
      </div>

      {/* AUTOCOMPLETE POPUP DROPDOWN */}
      {isOpen && (
        <div className="place-autocomplete-dropdown" role="listbox">
          {/* Header with Title, Match Count and Mobile Close Button */}
          <div className="dropdown-meta-header">
            <span className="dropdown-meta-title">
              {value.trim() ? (
                <>
                  <FaMagnifyingGlass className="meta-icon" /> Matching "
                  <strong>{value.trim()}</strong>"
                </>
              ) : mode === "bus" ? (
                <>🚌 Bus Stands, ISBTs &amp; Districts</>
              ) : mode === "train" ? (
                <>🚆 Railway Stations, Junctions &amp; Districts</>
              ) : mode === "flight" ? (
                <>✈️ Airports &amp; Major Cities</>
              ) : (
                <>⭐ Popular Districts, Tehsils &amp; Hubs</>
              )}
            </span>
            <div className="dropdown-meta-right">
              <span className="dropdown-meta-hint">{results.length} found</span>
              <button
                type="button"
                className="dropdown-mobile-close-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                <FaXmark />
              </button>
            </div>
          </div>

          {/* Mode-Aware Category Filter Pills Bar */}
          <div className="dropdown-category-pills-bar">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`cat-pill-btn ${activeCategory === tab.id ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveCategory(tab.id);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Scrollable Results List */}
          <div className="dropdown-options-scroll">
            {results.length > 0 ? (
              results.map((place, index) => {
                const isSelected =
                  value.toLowerCase().includes(place.name.toLowerCase()) ||
                  (place.code && value.toLowerCase().includes(place.code.toLowerCase()));
                const isHighlighted = highlightedIndex === index;

                return (
                  <div
                    key={place.id || index}
                    role="option"
                    aria-selected={isSelected}
                    className={`place-option-row ${isHighlighted ? "highlighted" : ""} ${
                      isSelected ? "selected-match" : ""
                    }`}
                    onClick={() => handleSelectPlace(place)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div className="place-icon-badge-col">{getItemIcon(place)}</div>

                    <div className="place-text-col">
                      <div className="place-name-line">
                        <span className="place-title-text">
                          {highlightMatch(place.name, value)}
                        </span>
                        {place.code && (
                          <span className="place-code-badge">{place.code}</span>
                        )}
                      </div>
                      <div className="place-subtext-line">
                        <span className="place-subtext-body">
                          {place.subText ? (
                            highlightMatch(place.subText, value)
                          ) : (
                            <>
                              {place.district ? `District: ${place.district}, ` : ""}
                              {place.state}
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="place-tag-col">
                      <span className={`place-type-pill pill-${place.type}`}>
                        {place.badge || place.type}
                      </span>
                      {isSelected && <FaCircleCheck className="place-check-active" />}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-places-found">
                <p>No locations matching "{value}"</p>
                <span>
                  {mode === "bus"
                    ? "Try searching another bus stand, district or tehsil name"
                    : mode === "train"
                    ? "Try searching station code (e.g. NDLS, JP) or city name"
                    : mode === "flight"
                    ? "Try searching airport code (e.g. DEL, BOM) or city name"
                    : "Try searching a nearby district, tehsil, or city name"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceAutocomplete;
