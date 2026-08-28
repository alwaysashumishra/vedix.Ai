import React, { useContext, useState, useEffect } from "react";
import "./FestivalCalendarModal.css";
import { ThemeContext } from "../../context/ThemeContext";
import { FESTIVALS, getFestivalForDate } from "../../config/festivalData";
import {
  FiCalendar,
  FiX,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiCheckCircle,
  FiToggleLeft,
  FiToggleRight,
  FiRotateCcw,
} from "react-icons/fi";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const FestivalCalendarModal = ({ isOpen, onClose }) => {
  const {
    activeFestivalTheme,
    setFestivalTheme,
    autoFestivalMode,
    toggleAutoFestivalMode,
  } = useContext(ThemeContext);

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11
  const [selectedDateObj, setSelectedDateObj] = useState(today);
  const [selectedFestival, setSelectedFestival] = useState(() => getFestivalForDate(today));
  const [activeTab, setActiveTab] = useState("calendar"); // 'calendar' | 'presets'

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Days in month calculation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    setSelectedDateObj(date);
    const fest = getFestivalForDate(date);
    setSelectedFestival(fest);
  };

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isSelectedDay = (day) => {
    return (
      day === selectedDateObj.getDate() &&
      currentMonth === selectedDateObj.getMonth() &&
      currentYear === selectedDateObj.getFullYear()
    );
  };

  // Find festival for a calendar day
  const getFestivalForCalendarDay = (day) => {
    const monthIndex = currentMonth + 1; // 1-12
    return FESTIVALS.find(
      (f) => f.dateMonth === monthIndex && f.dateDay === day
    );
  };

  return (
    <div className="festival-modal-overlay" onClick={onClose}>
      <div className="festival-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="festival-modal-header">
          <div className="festival-header-title">
            <div className="festival-icon-badge">
              <FiCalendar />
            </div>
            <div>
              <h2>Special Days & Festival Themes</h2>
              <p>Explore cultural events, holidays, and dynamic celebration themes</p>
            </div>
          </div>

          <button className="festival-close-btn" onClick={onClose} title="Close Calendar (Esc)">
            <FiX />
          </button>
        </div>

        {/* Top Controls Bar */}
        <div className="festival-top-controls">
          <div className="festival-auto-toggle" onClick={toggleAutoFestivalMode}>
            <span className="toggle-label-text">
              Auto-Detect Festival Themes:
            </span>
            {autoFestivalMode ? (
              <FiToggleRight className="toggle-icon active" />
            ) : (
              <FiToggleLeft className="toggle-icon" />
            )}
            <span className={`toggle-status-badge ${autoFestivalMode ? "on" : "off"}`}>
              {autoFestivalMode ? "ENABLED (Auto)" : "DISABLED (Manual)"}
            </span>
          </div>

          <div className="festival-tab-pills">
            <button
              className={`festival-tab-btn ${activeTab === "calendar" ? "active" : ""}`}
              onClick={() => setActiveTab("calendar")}
            >
              <FiCalendar /> Calendar View
            </button>
            <button
              className={`festival-tab-btn ${activeTab === "presets" ? "active" : ""}`}
              onClick={() => setActiveTab("presets")}
            >
              <FiStar /> All Festival Themes
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="festival-modal-body">
          {activeTab === "calendar" ? (
            <div className="festival-calendar-layout">
              {/* Left Column: Calendar Grid */}
              <div className="festival-calendar-grid-card">
                {/* Month Navigator Header */}
                <div className="calendar-month-nav">
                  <button className="month-nav-btn" onClick={handlePrevMonth} title="Previous Month">
                    <FiChevronLeft />
                  </button>
                  <span className="month-year-label">
                    {MONTH_NAMES[currentMonth]} {currentYear}
                  </span>
                  <button className="month-nav-btn" onClick={handleNextMonth} title="Next Month">
                    <FiChevronRight />
                  </button>
                </div>

                {/* Day Names Row */}
                <div className="calendar-days-header">
                  {DAY_NAMES.map((name) => (
                    <div key={name} className="day-name-cell">
                      {name}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="calendar-days-grid">
                  {/* Empty cells for offset */}
                  {Array.from({ length: firstDayOfWeek }).map((_, index) => (
                    <div key={`empty-${index}`} className="day-cell empty" />
                  ))}

                  {/* Month days */}
                  {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const day = idx + 1;
                    const festival = getFestivalForCalendarDay(day);
                    const todayCell = isToday(day);
                    const selectedCell = isSelectedDay(day);

                    return (
                      <div
                        key={day}
                        className={`day-cell ${todayCell ? "today" : ""} ${
                          selectedCell ? "selected" : ""
                        } ${festival ? "has-festival" : ""}`}
                        onClick={() => handleSelectDay(day)}
                      >
                        <span className="day-number">{day}</span>
                        {festival && (
                          <span className="calendar-fest-icon" title={festival.name}>
                            {festival.icon}
                          </span>
                        )}
                        {todayCell && <span className="today-dot" title="Today" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Selected Festival Info */}
              <div className="festival-info-card">
                {selectedFestival ? (
                  <div
                    className="festival-detail-box"
                    style={{
                      "--fest-primary": selectedFestival.primaryColor,
                      "--fest-accent": selectedFestival.accentColor,
                    }}
                  >
                    <div className="detail-banner" style={{ background: selectedFestival.gradient }}>
                      <span className="detail-hero-icon">{selectedFestival.icon}</span>
                      <div>
                        <h3>{selectedFestival.name}</h3>
                        <span className="hindi-badge">{selectedFestival.hindiName}</span>
                      </div>
                    </div>

                    <div className="detail-body">
                      <p className="detail-tagline">✨ "{selectedFestival.tagline}"</p>
                      <p className="detail-description">{selectedFestival.description}</p>
                      
                      <div className="detail-meta">
                        <span className="meta-pill">
                          <FiCalendar /> {MONTH_NAMES[selectedFestival.dateMonth - 1]} {selectedFestival.dateDay}
                        </span>
                        {activeFestivalTheme === selectedFestival.id && (
                          <span className="meta-pill active-pill">
                            <FiCheckCircle /> Active Theme
                          </span>
                        )}
                      </div>

                      <div className="detail-actions">
                        <button
                          type="button"
                          className="apply-theme-btn"
                          style={{ background: selectedFestival.gradient }}
                          onClick={() => setFestivalTheme(selectedFestival.id)}
                        >
                          <FiStar />
                          {activeFestivalTheme === selectedFestival.id
                            ? "Theme Active"
                            : `Apply ${selectedFestival.name} Theme`}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-festival-card">
                    <span className="no-fest-icon">🗓️</span>
                    <h4>
                      {selectedDateObj.getDate()} {MONTH_NAMES[selectedDateObj.getMonth()]}
                    </h4>
                    <p>No major festival registered for this specific date.</p>
                    <p className="sub-hint">Click on highlighted dates with festival icons (like 🧵 Raksha Bandhan) or select from preset themes tab!</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* PRESET FESTIVAL THEMES GRID */
            <div className="festival-presets-grid">
              {FESTIVALS.map((fest) => {
                const isActive = activeFestivalTheme === fest.id;
                return (
                  <div
                    key={fest.id}
                    className={`fest-preset-card ${isActive ? "active" : ""}`}
                    onClick={() => setFestivalTheme(fest.id)}
                  >
                    <div
                      className="preset-preview-header"
                      style={{ background: fest.gradient }}
                    >
                      <span className="preset-icon">{fest.icon}</span>
                      {isActive && <FiCheck className="active-check-icon" />}
                    </div>

                    <div className="preset-card-body">
                      <h4>{fest.name}</h4>
                      <span className="preset-date">
                        {MONTH_NAMES[fest.dateMonth - 1]} {fest.dateDay}
                      </span>
                      <p className="preset-tagline">{fest.tagline}</p>
                    </div>

                    <button
                      type="button"
                      className={`preset-apply-btn ${isActive ? "applied" : ""}`}
                    >
                      {isActive ? "Theme Active" : "Apply Theme"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="festival-modal-footer">
          <div className="active-theme-indicator">
            <span>Currently Active Special Theme: </span>
            <strong>
              {activeFestivalTheme && activeFestivalTheme !== "none"
                ? (FESTIVALS.find((f) => f.id === activeFestivalTheme)?.name || activeFestivalTheme)
                : "Standard Theme"}
            </strong>
          </div>

          <div className="footer-btn-group">
            {activeFestivalTheme && activeFestivalTheme !== "none" && (
              <button
                type="button"
                className="reset-theme-btn"
                onClick={() => setFestivalTheme("none")}
              >
                <FiRotateCcw /> Reset to Standard Theme
              </button>
            )}
            <button type="button" className="footer-close-btn" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FestivalCalendarModal;
