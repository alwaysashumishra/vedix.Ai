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
} from "react-icons/fa6";
import { searchPlaces } from "./placesData";

const PlaceAutocomplete = ({
  value = "",
  onChange,
  onSelect,
  placeholder = "Search city, station, or airport...",
  label = "Location",
  mode = "train",
  fieldRole = "origin", // "origin" | "destination"
  className = "",
  icon = FaLocationDot,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const IconComponent = icon || FaLocationDot;

  // Compute matched places
  const results = searchPlaces(value, mode);

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
      chosenText = `${place.city} (${place.code})`;
    } else if (place.type === "airport" && place.code) {
      chosenText = `${place.city} (${place.code})`;
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
      case "station":
        return <FaTrainSubway className="place-item-icon icon-station" />;
      case "airport":
        return <FaPlane className="place-item-icon icon-airport" />;
      case "bus":
        return <FaBus className="place-item-icon icon-bus" />;
      case "cab":
        return <FaCar className="place-item-icon icon-cab" />;
      default:
        return <FaLocationDot className="place-item-icon icon-city" />;
    }
  };

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
          <div className="dropdown-meta-header">
            <span className="dropdown-meta-title">
              {value.trim() ? (
                <>
                  <FaMagnifyingGlass className="meta-icon" /> Locations matching "
                  <strong>{value.trim()}</strong>"
                </>
              ) : (
                <>⭐ Popular {mode ? `${mode.toUpperCase()} Hubs` : "Destinations"}</>
              )}
            </span>
            <span className="dropdown-meta-hint">Click or press Enter</span>
          </div>

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
                        <span className="place-title-text">{place.name}</span>
                        {place.code && (
                          <span className="place-code-badge">{place.code}</span>
                        )}
                      </div>
                      <div className="place-subtext-line">
                        <span>{place.subText || `${place.city}, ${place.state}`}</span>
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
                <span>Use custom text or pick a popular city</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceAutocomplete;

