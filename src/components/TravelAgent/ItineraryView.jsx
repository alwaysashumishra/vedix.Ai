import React from "react";
import { FiCalendar, FiClock, FiMapPin, FiNavigation, FiTag, FiCamera } from "react-icons/fi";

const ACTIVITY_IMAGES = [
  "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&auto=format&fit=crop", // Palace
  "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=500&auto=format&fit=crop", // Fort
  "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=500&auto=format&fit=crop", // Hawa Mahal
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop", // Shopping Bazaar
  "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&auto=format&fit=crop", // Sunset Fort
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop", // Hotel / Food
];

const ItineraryView = ({ itinerary = null }) => {
  if (!itinerary || !itinerary.itineraryDays) return null;

  return (
    <div className="itinerary-view-card">
      <div className="itinerary-header">
        <div>
          <h3><FiCalendar /> Complete Interactive Trip Itinerary</h3>
          <p>Day-by-day timestamped schedule for {itinerary.destination} ({itinerary.totalDays} Days) with realistic travel times & spot photos.</p>
        </div>
      </div>

      <div className="days-timeline-container">
        {itinerary.itineraryDays.map((day) => (
          <div key={day.dayNumber} className="day-block">
            <div className="day-title-ribbon">
              <h4>{day.dateTitle}</h4>
            </div>

            <div className="schedule-timeline">
              {day.schedule.map((item, idx) => {
                const activityImg = ACTIVITY_IMAGES[idx % ACTIVITY_IMAGES.length];
                return (
                  <div key={idx} className="timeline-item">
                    <div className="time-badge">
                      <FiClock /> {item.time}
                    </div>

                    <div className="timeline-card-wrapper">
                      {item.category !== "Stay" && item.category !== "Food" && (
                        <div className="activity-thumb-box">
                          <img src={activityImg} alt={item.activityTitle} />
                        </div>
                      )}

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
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryView;
