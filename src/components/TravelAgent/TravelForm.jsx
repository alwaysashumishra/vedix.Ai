import React, { useState } from "react";
import { FiNavigation, FiCalendar, FiUsers, FiDollarSign, FiCheck, FiFilter } from "react-icons/fi";

const TravelForm = ({ onSubmitForm, initialParams = {}, isLoading = false }) => {
  const [formData, setFormData] = useState({
    origin: initialParams.origin || "Ghaziabad",
    destination: initialParams.destination || "Jaipur",
    departureDate: initialParams.departureDate || new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0],
    returnDate: initialParams.returnDate || new Date(Date.now() + 86400000 * 8).toISOString().split("T")[0],
    travelers: initialParams.travelers || 3,
    adults: initialParams.adults || 3,
    children: initialParams.children || 0,
    travelType: initialParams.travelType || "Round trip",
    budget: initialParams.budget || 20000,
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
        <h3><FiNavigation className="icon-pulse" /> Structured Trip Search</h3>
        <p>Specify your travel requirements and let our multi-agent network handle the rest.</p>
      </div>

      <div className="form-grid-3">
        <div className="form-group">
          <label>Starting Point (Origin)</label>
          <input
            type="text"
            name="origin"
            placeholder="e.g. Ghaziabad, Delhi, Mumbai"
            value={formData.origin}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Destination</label>
          <input
            type="text"
            name="destination"
            placeholder="e.g. Jaipur, Manali, Goa"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Trip Type</label>
          <select name="travelType" value={formData.travelType} onChange={handleChange}>
            <option value="Round trip">Round trip</option>
            <option value="One-way">One-way</option>
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
          <input type="number" name="budget" step="500" min="2000" value={formData.budget} onChange={handleChange} />
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
                <option value="Sleeper">Sleeper Bed</option>
                <option value="Seater">Seater / Chair Car</option>
                <option value="Economy">Flight Economy</option>
              </select>
            </div>

            <div className="form-group">
              <label>Preferred Departure Window</label>
              <select name="preferredDepartureTime" value={formData.preferredDepartureTime} onChange={handleChange}>
                <option value="Anytime">Anytime</option>
                <option value="Morning">Morning (06:00 AM - 12:00 PM)</option>
                <option value="Afternoon">Afternoon (12:00 PM - 06:00 PM)</option>
                <option value="Evening/Night">Overnight (08:00 PM - 06:00 AM)</option>
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
