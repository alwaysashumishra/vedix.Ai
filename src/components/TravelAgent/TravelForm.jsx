import React, { useState, useRef, useEffect } from "react";
import {
  FiNavigation,
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiCheck,
  FiFilter,
  FiMapPin,
  FiRepeat,
} from "react-icons/fi";

const POPULAR_LOCATIONS = [
  { city: "Pari Chowk", state: "Greater Noida, UP", category: "ISBT / Expressway Hub", icon: "🚌" },
  { city: "Kanpur", state: "Uttar Pradesh", category: "Central Junction", icon: "🚆" },
  { city: "Ghaziabad", state: "Delhi NCR, UP", category: "Major Railway Hub", icon: "🏙️" },
  { city: "Delhi / New Delhi", state: "Delhi NCR", category: "Capital Airport (DEL)", icon: "✈️" },
  { city: "Jaipur", state: "Rajasthan", category: "Pink City (JAI)", icon: "🏰" },
  { city: "Agra", state: "Uttar Pradesh", category: "Taj Heritage", icon: "🕌" },
  { city: "Lucknow", state: "Uttar Pradesh", category: "Charbagh Station", icon: "🚆" },
  { city: "Varanasi", state: "Uttar Pradesh", category: "Ghats & Heritage", icon: "🛕" },
  { city: "Mumbai", state: "Maharashtra", category: "Financial Hub (BOM)", icon: "✈️" },
  { city: "Pune", state: "Maharashtra", category: "Expressway Hub", icon: "🏙️" },
  { city: "Goa", state: "Goa", category: "Beach Resort (GOI)", icon: "🏖️" },
  { city: "Bangalore", state: "Karnataka", category: "Tech Capital (BLR)", icon: "✈️" },
  { city: "Hyderabad", state: "Telangana", category: "IT Hub (HYD)", icon: "✈️" },
  { city: "Manali", state: "Himachal Pradesh", category: "Hill Station", icon: "🏔️" },
  { city: "Shimla", state: "Himachal Pradesh", category: "Hill Station", icon: "⛰️" },
  { city: "Rishikesh", state: "Uttarakhand", category: "Adventure Hub", icon: "🌊" },
  { city: "Chandigarh", state: "Punjab / Haryana", category: "Tri-City Hub", icon: "🏙️" },
  { city: "Ahmedabad", state: "Gujarat", category: "Heritage City", icon: "🏙️" },
  { city: "Kolkata", state: "West Bengal", category: "Metro Hub (CCU)", icon: "✈️" },
  { city: "Chennai", state: "Tamil Nadu", category: "Coastal Hub (MAA)", icon: "✈️" },
  { city: "Kochi / Munnar", state: "Kerala", category: "Backwaters & Tea", icon: "🌴" },
  { city: "Udaipur", state: "Rajasthan", category: "City of Lakes", icon: "⛵" },
  { city: "Jodhpur", state: "Rajasthan", category: "Blue City", icon: "🏰" },
  { city: "Nainital", state: "Uttarakhand", category: "Lake Station", icon: "🏞️" },
  { city: "Amritsar", state: "Punjab", category: "Golden City", icon: "🛕" },
  { city: "Dehradun", state: "Uttarakhand", category: "Capital Station", icon: "⛰️" },
  { city: "Mathura / Vrindavan", state: "Uttar Pradesh", category: "Heritage Hub", icon: "🛕" },
  { city: "Noida", state: "Uttar Pradesh", category: "Delhi NCR", icon: "🏙️" },
];

const LocationAutocomplete = ({ label, name, value, onChange, placeholder, required = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLocations = POPULAR_LOCATIONS.filter((loc) => {
    if (!query || query.trim() === "") return true;
    const q = query.toLowerCase().trim();
    return (
      loc.city.toLowerCase().includes(q) ||
      loc.state.toLowerCase().includes(q) ||
      loc.category.toLowerCase().includes(q)
    );
  });

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange({ target: { name, value: val } });
    setIsOpen(true);
  };

  const handleSelectLocation = (loc) => {
    setQuery(loc.city);
    onChange({ target: { name, value: loc.city } });
    setIsOpen(false);
  };

  return (
    <div className="form-group location-autocomplete-group" ref={wrapperRef}>
      <label>
        <FiMapPin className="map-icon" /> {label}
      </label>
      <div className="input-wrapper-relative">
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          required={required}
          autoComplete="off"
        />
        {isOpen && (
          <div className="autocomplete-dropdown-panel">
            <div className="dropdown-panel-title">
              {query ? `Matching Locations (${filteredLocations.length})` : "Popular Locations"}
            </div>
            <div className="suggestions-scroll-list">
              {filteredLocations.length === 0 ? (
                <div className="no-suggestions-item">
                  Use custom location: <strong>"{query}"</strong>
                </div>
              ) : (
                filteredLocations.map((loc, idx) => (
                  <div
                    key={idx}
                    className="suggestion-row-item"
                    onMouseDown={() => handleSelectLocation(loc)}
                  >
                    <span className="loc-icon">{loc.icon}</span>
                    <div className="loc-info">
                      <span className="loc-city">{loc.city}</span>
                      <span className="loc-sub">{loc.state}</span>
                    </div>
                    <span className="loc-category-tag">{loc.category}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TravelForm = ({ onSubmitForm, initialParams = {}, isLoading = false }) => {
  const [formData, setFormData] = useState({
    origin: initialParams.origin || "Pari Chowk",
    destination: initialParams.destination || "Kanpur",
    departureDate: initialParams.departureDate || new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0],
    returnDate: initialParams.returnDate || new Date(Date.now() + 86400000 * 8).toISOString().split("T")[0],
    travelers: initialParams.travelers || 1,
    adults: initialParams.adults || 1,
    children: initialParams.children || 0,
    travelType: initialParams.travelType || "One-way",
    budget: initialParams.budget || 500,
    preferredTransport: initialParams.preferredTransport || ["Bus", "Flight", "Train", "Cab", "Car Rental"],
    preferredDepartureTime: initialParams.preferredDepartureTime || "Anytime",
    maxDurationHours: initialParams.maxDurationHours || 24,
    seatPreference: initialParams.seatPreference || "Any",
    acPreference: initialParams.acPreference || "AC",
    directOnly: initialParams.directOnly || false,
    hotelPreference: initialParams.hotelPreference || "Hotel",
    minHotelRating: initialParams.minHotelRating || 4.0,
    roomsCount: initialParams.roomsCount || 1,
    foodPreference: initialParams.foodPreference || "Vegetarian / Non-Veg options",
    activities: initialParams.activities || ["Sightseeing", "Local Food", "Culture", "Relaxation"],
    accessibility: initialParams.accessibility || "None",
    otherPreferences: initialParams.otherPreferences || "",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSwapLocations = () => {
    setFormData((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  const handleTransportToggle = (mode) => {
    setFormData((prev) => {
      const exists = prev.preferredTransport.includes(mode);
      const updated = exists
        ? prev.preferredTransport.filter((m) => m !== mode)
        : [...prev.preferredTransport, mode];
      return { ...prev, preferredTransport: updated.length > 0 ? updated : [mode] };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitForm(formData);
  };

  return (
    <form className="travel-form-card" onSubmit={handleSubmit}>
      <div className="form-title-bar">
        <h3><FiNavigation className="icon-pulse" /> Structured Trip Search & City Finder</h3>
        <p>Type any city or select from auto-complete suggestions to find live transport & platform options.</p>
      </div>

      <div className="form-grid-location-row">
        <LocationAutocomplete
          label="Starting Point (Origin)"
          name="origin"
          placeholder="Type origin (e.g. Pari Chowk, Delhi, Ghaziabad)"
          value={formData.origin}
          onChange={handleChange}
          required
        />

        <button
          type="button"
          className="btn-swap-locations"
          onClick={handleSwapLocations}
          title="Swap Origin and Destination"
        >
          <FiRepeat />
        </button>

        <LocationAutocomplete
          label="Destination"
          name="destination"
          placeholder="Type destination (e.g. Kanpur, Jaipur, Goa)"
          value={formData.destination}
          onChange={handleChange}
          required
        />

        <div className="form-group">
          <label>Trip Type</label>
          <select name="travelType" value={formData.travelType} onChange={handleChange}>
            <option value="One-way">One-way</option>
            <option value="Round trip">Round trip</option>
          </select>
        </div>
      </div>

      <div className="form-grid-4">
        <div className="form-group">
          <label><FiCalendar /> Departure Date</label>
          <input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label><FiCalendar /> Return Date</label>
          <input type="date" name="returnDate" value={formData.returnDate} onChange={handleChange} disabled={formData.travelType === "One-way"} />
        </div>

        <div className="form-group">
          <label><FiUsers /> Total Travelers</label>
          <input type="number" name="travelers" min="1" max="20" value={formData.travelers} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label><FiDollarSign /> Total Budget (₹)</label>
          <input type="number" name="budget" step="50" min="200" value={formData.budget} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group transport-chips-group">
        <label>Preferred Transport Modes</label>
        <div className="transport-chip-list">
          {["Bus", "Flight", "Train", "Cab", "Car Rental"].map((mode) => {
            const selected = formData.preferredTransport.includes(mode);
            return (
              <button
                key={mode}
                type="button"
                className={`chip-btn ${selected ? "active" : ""}`}
                onClick={() => handleTransportToggle(mode)}
              >
                {selected && <FiCheck />} {mode}
              </button>
            );
          })}
        </div>
      </div>

      <div className="advanced-toggle-row">
        <button type="button" className="btn-text-link" onClick={() => setShowAdvanced(!showAdvanced)}>
          <FiFilter /> {showAdvanced ? "Hide Advanced Preferences" : "Show Advanced Preferences (AC, Hotel rating, Food, Seat...)"}
        </button>
      </div>

      {showAdvanced && (
        <div className="advanced-form-section">
          <div className="form-grid-3">
            <div className="form-group">
              <label>AC Preference</label>
              <select name="acPreference" value={formData.acPreference} onChange={handleChange}>
                <option value="AC">AC Only</option>
                <option value="Non-AC">Non-AC</option>
                <option value="Any">Any</option>
              </select>
            </div>

            <div className="form-group">
              <label>Seat / Class Preference</label>
              <select name="seatPreference" value={formData.seatPreference} onChange={handleChange}>
                <option value="Any">Any Seat Type</option>
                <option value="Seater">Seater / Chair Car</option>
                <option value="Sleeper">Sleeper Bed</option>
                <option value="Economy">Flight Economy</option>
              </select>
            </div>

            <div className="form-group">
              <label>Preferred Departure Window</label>
              <select name="preferredDepartureTime" value={formData.preferredDepartureTime} onChange={handleChange}>
                <option value="Anytime">Anytime</option>
                <option value="Night (9 PM - 6 AM)">Overnight / Night (08:00 PM - 06:00 AM)</option>
                <option value="Morning (6 AM - 12 PM)">Morning (06:00 AM - 12:00 PM)</option>
                <option value="Afternoon (12 PM - 6 PM)">Afternoon (12:00 PM - 06:00 PM)</option>
              </select>
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label>Min Hotel Rating</label>
              <select name="minHotelRating" value={formData.minHotelRating} onChange={handleChange}>
                <option value="4.5">4.5+ Stars (Luxury)</option>
                <option value="4.0">4.0+ Stars (Premium)</option>
                <option value="3.5">3.5+ Stars (Comfort)</option>
                <option value="3.0">3.0+ Stars (Budget)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Food Preference</label>
              <input
                type="text"
                name="foodPreference"
                placeholder="e.g. Pure Veg, Jain Food, Local Street Food"
                value={formData.foodPreference}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Accessibility / Special Notes</label>
              <input
                type="text"
                name="accessibility"
                placeholder="e.g. Wheelchair access, Ground floor room"
                value={formData.accessibility}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" name="directOnly" checked={formData.directOnly} onChange={handleChange} />
              <span>Only show direct journeys (No layovers or bus transfers)</span>
            </label>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn-primary-gradient" disabled={isLoading}>
          {isLoading ? "Agents Planning Trip..." : "🚀 Launch Travel Agent Search"}
        </button>
      </div>
    </form>
  );
};

export default TravelForm;
