import React from "react";
import { FiCalendar, FiClock, FiMapPin, FiNavigation, FiTag } from "react-icons/fi";

const ItineraryView = ({ itinerary = null }) => {
  if (!itinerary || !itinerary.itineraryDays) return null;

  return (
    <div className="itinerary-view-card">
      <div className="itinerary-header">
        <div>
          <h3><FiCalendar /> Complete Trip Itinerary</h3>
          <p>Day-by-day timestamped schedule for {itinerary.destination} ({itinerary.totalDays} Days) with realistic travel times between spots.</p>
        </div>
      </div>

      <div className="days-timeline-container">
        {itinerary.itineraryDays.map((day) => (
          <div key={day.dayNumber} className="day-block">
            <div className="day-title-ribbon">
              <h4>{day.dateTitle}</h4>
            </div>

            <div className="schedule-timeline">
              {day.schedule.map((item, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="time-badge">
                    <FiClock /> {item.time}
                  </div>

                  <div className="timeline-content">
                    <div className="title-row">
                      <h5>{item.activityTitle}</h5>
                      <span className={`cat-badge cat-${item.category.toLowerCase().replace(/\s+/g, "-")}`}>
                        {item.category}
                      </span>
                    </div>

                    <p className="activity-desc">{item.description}</p>

                    <div className="meta-details-row">
                      <span><FiClock /> Duration: <strong>{item.estimatedDuration}</strong></span>
                      <span><FiMapPin /> Distance: <strong>{item.distance}</strong></span>
                      <span><FiNavigation /> Mode: <strong>{item.suggestedTransport}</strong></span>
                      {item.estimatedCost > 0 && (
                        <span><FiTag /> Cost: <strong>₹{item.estimatedCost}</strong></span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryView;
