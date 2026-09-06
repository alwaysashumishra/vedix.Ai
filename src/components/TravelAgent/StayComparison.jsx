import React, { useState } from "react";
import { FiStar, FiMapPin, FiCheckCircle, FiCheck, FiCoffee, FiWifi, FiAward } from "react-icons/fi";

const StayComparison = ({ stayOptions = [], selectedStay = null, onSelectStay }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Hotels", "Hostels", "Homestays", "Apartments", "Resorts"];

  const filtered = stayOptions.filter((item) => {
    if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="stay-comparison-card">
      <div className="stay-header">
        <div>
          <h3>Accommodation Search & Stays</h3>
          <p>Handpicked places to stay sorted by location, rating, amenities, and budget alignment.</p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="category-pills-row">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`pill-btn ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stays Grid */}
      <div className="stays-grid">
        {filtered.map((stay) => {
          const isSelected = selectedStay?.id === stay.id;
          return (
            <div key={stay.id} className={`stay-card-item ${isSelected ? "selected-stay" : ""}`}>
              {stay.badge && <div className="category-badge-ribbon">{stay.badge}</div>}

              <div className="stay-image-box">
                <img src={stay.image} alt={stay.name} />
                <span className="rating-tag"><FiStar /> {stay.rating} ({stay.reviewsCount})</span>
              </div>

              <div className="stay-card-content">
                <div className="category-tag">{stay.category}</div>
                <h4 className="stay-title">{stay.name}</h4>
                <p className="location-text"><FiMapPin /> {stay.location}</p>
                <p className="attraction-distance">📍 {stay.distanceFromAttractions}</p>

                <div className="amenities-chip-list">
                  {stay.amenities.slice(0, 4).map((amenity, i) => (
                    <span key={i} className="amenity-chip">✓ {amenity}</span>
                  ))}
                </div>

                <div className="stay-pricing-row">
                  <div>
                    <span className="price-night">₹{stay.pricePerNight.toLocaleString()}</span>
                    <span className="night-unit"> / night</span>
                    <div className="total-stay-price">Total: ₹{stay.totalPrice.toLocaleString()} ({stay.nights} nights)</div>
                  </div>
                  <button
                    className={`btn-select-stay ${isSelected ? "btn-selected" : ""}`}
                    onClick={() => onSelectStay(stay)}
                  >
                    {isSelected ? <><FiCheck /> Selected</> : "Select Stay"}
                  </button>
                </div>

                <div className="ai-stay-reason">
                  <p>🤖 {stay.whyRecommended}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StayComparison;
