import React, { createContext, useEffect, useState, useMemo } from "react";
import { getFestivalForDate, getFestivalById } from "../config/festivalData";
import "../components/FestivalCalendarModal/festivalThemes.css";

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  // Standard Light / Dark theme
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  // Auto Festival Mode toggle
  const [autoFestivalMode, setAutoFestivalMode] = useState(
    localStorage.getItem("auto_festival_mode") !== "disabled"
  );

  // Festival Theme state ('none', 'raksha_bandhan', 'diwali', etc.)
  const [activeFestivalTheme, setActiveFestivalTheme] = useState(() => {
    const savedManualTheme = localStorage.getItem("festival_theme");
    if (savedManualTheme) {
      return savedManualTheme;
    }
    // Auto detect today's festival if auto-detect is enabled
    const todayFest = getFestivalForDate(new Date());
    return todayFest ? todayFest.id : "none";
  });

  // Calendar Modal Open state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Dismissed top banner state for current session
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Apply base theme class to document body
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Handle auto-detection on startup & date check
  useEffect(() => {
    if (autoFestivalMode && !localStorage.getItem("festival_theme_manual")) {
      const todayFest = getFestivalForDate(new Date());
      if (todayFest) {
        setActiveFestivalTheme(todayFest.id);
      } else {
        setActiveFestivalTheme("none");
      }
    }
  }, [autoFestivalMode]);

  // Apply festival theme attribute to document body
  useEffect(() => {
    if (activeFestivalTheme && activeFestivalTheme !== "none") {
      document.body.setAttribute("data-festival-theme", activeFestivalTheme);
      localStorage.setItem("festival_theme", activeFestivalTheme);
    } else {
      document.body.removeAttribute("data-festival-theme");
      localStorage.setItem("festival_theme", "none");
    }
  }, [activeFestivalTheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setFestivalTheme = (themeKey) => {
    setActiveFestivalTheme(themeKey);
    if (themeKey === "none") {
      localStorage.removeItem("festival_theme_manual");
      localStorage.setItem("festival_theme", "none");
    } else {
      localStorage.setItem("festival_theme_manual", "true");
      localStorage.setItem("festival_theme", themeKey);
    }
  };

  const toggleAutoFestivalMode = () => {
    const nextVal = !autoFestivalMode;
    setAutoFestivalMode(nextVal);
    localStorage.setItem("auto_festival_mode", nextVal ? "enabled" : "disabled");
    if (nextVal) {
      localStorage.removeItem("festival_theme_manual");
      const todayFest = getFestivalForDate(new Date());
      setActiveFestivalTheme(todayFest ? todayFest.id : "none");
    }
  };

  const openFestivalCalendar = () => setIsCalendarOpen(true);
  const closeFestivalCalendar = () => setIsCalendarOpen(false);
  const dismissBanner = () => setBannerDismissed(true);

  // Active festival data memo
  const activeFestivalData = useMemo(() => {
    if (!activeFestivalTheme || activeFestivalTheme === "none") return null;
    return getFestivalById(activeFestivalTheme);
  }, [activeFestivalTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        activeFestivalTheme,
        setFestivalTheme,
        autoFestivalMode,
        toggleAutoFestivalMode,
        isCalendarOpen,
        openFestivalCalendar,
        closeFestivalCalendar,
        activeFestivalData,
        bannerDismissed,
        dismissBanner,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
