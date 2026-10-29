import React, { useState, useEffect, useRef } from "react";
import {
  FaCalendarDays,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaBolt,
} from "react-icons/fa6";

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

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const TravelDatePicker = ({
  selectedDate, // "YYYY-MM-DD"
  onDateChange,
  label = "Travel Date",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const nativeInputRef = useRef(null);

  // Parse currently selected date
  const parsedDate = selectedDate ? new Date(selectedDate) : new Date();
  const validParsed = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

  // Calendar month/year navigation state
  const [viewYear, setViewYear] = useState(validParsed.getFullYear());
  const [viewMonth, setViewMonth] = useState(validParsed.getMonth());

  // Today reference
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Sync view when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      const d = new Date(selectedDate);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [selectedDate]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format date display
  const formatDateDisplay = (dateString) => {
    if (!dateString) return "Select Date";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleSelectDay = (dayNumber) => {
    const yearStr = viewYear;
    const monthStr = String(viewMonth + 1).padStart(2, "0");
    const dayStr = String(dayNumber).padStart(2, "0");
    const dateFormatted = `${yearStr}-${monthStr}-${dayStr}`;

    onDateChange && onDateChange(dateFormatted);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Quick preset dates
  const handleQuickPreset = (presetType) => {
    const target = new Date();
    target.setHours(0, 0, 0, 0);

    if (presetType === "today") {
      // today
    } else if (presetType === "tomorrow") {
      target.setDate(target.getDate() + 1);
    } else if (presetType === "weekend") {
      // upcoming Saturday
      const day = target.getDay();
      const diff = day === 6 ? 7 : (6 - day + 7) % 7 || 7;
      target.setDate(target.getDate() + diff);
    } else if (presetType === "nextweek") {
      target.setDate(target.getDate() + 7);
    }

    const yearStr = target.getFullYear();
    const monthStr = String(target.getMonth() + 1).padStart(2, "0");
    const dayStr = String(target.getDate()).padStart(2, "0");
    const dateFormatted = `${yearStr}-${monthStr}-${dayStr}`;

    onDateChange && onDateChange(dateFormatted);
    setViewYear(target.getFullYear());
    setViewMonth(target.getMonth());
    setIsOpen(false);
  };

  // Calendar matrix calculation
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const isCurrentMonthOrPast =
    viewYear < today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth <= today.getMonth());

  return (
    <div
      ref={wrapperRef}
      className={`travel-date-picker-wrap ${className} ${isOpen ? "picker-active" : ""}`}
    >
      <div
        className="date-picker-card-trigger"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className="field-icon-wrap">
          <FaCalendarDays className="field-icon" />
        </div>

        <div className="field-content-col">
          {label && <label className="field-label">{label}</label>}
          <div className="field-date-display-wrap">
            <span className="field-date-text">{formatDateDisplay(selectedDate)}</span>
            <FaChevronDown
              className={`field-chevron-icon ${isOpen ? "chevron-rotated" : ""}`}
            />
          </div>
        </div>
      </div>

      {/* INTERACTIVE CALENDAR POPOVER */}
      {isOpen && (
        <div className="travel-calendar-popover" role="dialog" aria-modal="true">
          {/* Quick Preset Buttons */}
          <div className="calendar-quick-presets-row">
            <button
              type="button"
              className="quick-chip-btn"
              onClick={() => handleQuickPreset("today")}
            >
              <FaBolt className="chip-bolt-icon" /> Today
            </button>
            <button
              type="button"
              className="quick-chip-btn"
              onClick={() => handleQuickPreset("tomorrow")}
            >
              Tomorrow
            </button>
            <button
              type="button"
              className="quick-chip-btn"
              onClick={() => handleQuickPreset("weekend")}
            >
              This Weekend
            </button>
            <button
              type="button"
              className="quick-chip-btn"
              onClick={() => handleQuickPreset("nextweek")}
            >
              +1 Week
            </button>
          </div>

          {/* Month & Year Navigation Header */}
          <div className="calendar-month-nav-row">
            <button
              type="button"
              className="calendar-nav-arrow-btn"
              onClick={handlePrevMonth}
              disabled={isCurrentMonthOrPast}
              title="Previous Month"
            >
              <FaChevronLeft />
            </button>

            <span className="calendar-month-title">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              className="calendar-nav-arrow-btn"
              onClick={handleNextMonth}
              title="Next Month"
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Day of Week Headers */}
          <div className="calendar-weekdays-grid">
            {DAYS_OF_WEEK.map((d) => (
              <span key={d} className="calendar-weekday-col">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="calendar-days-grid">
            {/* Blank offset days */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <span key={`blank-${i}`} className="calendar-day-cell blank" />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const cellDate = new Date(viewYear, viewMonth, day);
              cellDate.setHours(0, 0, 0, 0);

              const isPast = cellDate < today;
              const isToday = cellDate.getTime() === today.getTime();

              const cellDateStr = `${viewYear}-${String(viewMonth + 1).padStart(
                2,
                "0"
              )}-${String(day).padStart(2, "0")}`;
              const isSelected = selectedDate === cellDateStr;

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  disabled={isPast}
                  className={`calendar-day-cell ${isPast ? "is-past-disabled" : ""} ${
                    isToday ? "is-today" : ""
                  } ${isSelected ? "is-selected" : ""}`}
                  onClick={() => handleSelectDay(day)}
                >
                  <span className="day-number-text">{day}</span>
                  {isToday && !isSelected && <span className="today-dot-indicator" />}
                </button>
              );
            })}
          </div>

          <div className="calendar-footer-note">
            <span>Instant booking available up to 120 days in advance</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelDatePicker;

