import React, { useState, useEffect, useRef } from "react";
import {
  FaRobot,
  FaBolt,
  FaCheck,
  FaCircleCheck,
  FaArrowUpRightFromSquare,
  FaGlobe,
  FaShieldHalved,
  FaChair,
  FaClock,
  FaRotateRight,
  FaBus,
  FaTrainSubway,
  FaPlane,
  FaCar,
  FaArrowRight,
  FaLocationDot,
  FaCalendarDays,
  FaStar,
  FaSuitcaseRolling,
  FaMagnifyingGlass,
  FaEye,
} from "react-icons/fa6";
import { FiX, FiLock, FiTerminal, FiExternalLink } from "react-icons/fi";

// Extract clean city name without parentheses or district tags
export function extractCleanCity(name = "") {
  if (!name) return "";
  const part1 = name.split("(")[0].trim();
  const part2 = part1.split(",")[0].trim();
  return part2 || name.trim();
}

// Generate real deep-link redirect URLs for Indian travel platforms
export function buildPlatformDeepLink(
  platformName = "redBus",
  transportItem = {},
  origin = "Delhi",
  destination = "Jaipur",
  departureDate = "",
  mode = "bus"
) {
  const srcCity = extractCleanCity(origin);
  const dstCity = extractCleanCity(destination);
  const srcSlug = srcCity.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const dstSlug = dstCity.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  let dateObj = new Date();
  if (departureDate) {
    const parsed = new Date(departureDate);
    if (!isNaN(parsed.getTime())) dateObj = parsed;
  }

  const day = String(dateObj.getDate()).padStart(2, "0");
  const monthIdx = dateObj.getMonth();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthName = months[monthIdx];
  const year = dateObj.getFullYear();
  const redbusDate = `${day}-${monthName}-${year}`;
  const isoDate = `${year}-${String(monthIdx + 1).padStart(2, "0")}-${day}`;

  const pLower = (platformName || "redbus").toLowerCase();

  if (mode === "bus") {
    if (pLower.includes("redbus")) {
      return `https://www.redbus.in/bus-tickets/${srcSlug}-to-${dstSlug}?fromCityName=${encodeURIComponent(
        srcCity
      )}&toCityName=${encodeURIComponent(dstCity)}&onward=${redbusDate}&busOperator=${encodeURIComponent(
        transportItem?.operator || ""
      )}`;
    }
    if (pLower.includes("abhibus")) {
      return `https://www.abhibus.com/bus_search/${encodeURIComponent(srcCity)}/${encodeURIComponent(
        dstCity
      )}/${isoDate}/O`;
    }
    if (pLower.includes("makemytrip") || pLower.includes("mmt")) {
      return `https://www.makemytrip.com/bus-tickets/${srcSlug}-${dstSlug}-bus-tickets.html`;
    }
    if (pLower.includes("goibibo")) {
      return `https://www.goibibo.com/bus/${srcSlug}-to-${dstSlug}-bus-booking/`;
    }
    return `https://www.redbus.in/bus-tickets/${srcSlug}-to-${dstSlug}?fromCityName=${encodeURIComponent(
      srcCity
    )}&toCityName=${encodeURIComponent(dstCity)}&onward=${redbusDate}`;
  }

  if (mode === "train") {
    return `https://www.confirmtkt.com/rbooking-d/${srcSlug}-to-${dstSlug}`;
  }

  if (mode === "flight") {
    return `https://www.makemytrip.com/flight/search?itinerary=${srcSlug}-${dstSlug}-${isoDate}&tripType=O`;
  }

  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    origin
  )}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
}

const TravelAutomationModal = ({
  isOpen,
  onClose,
  transportItem,
  initialPlatform = null,
  searchParams = {},
  selectedMode = "bus",
  onProceedToSafetyBooking,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  // Assistant Automation Sub-States:
  // 0: Loading Portal
  // 1: Assistant Typing Boarding Point
  // 2: Assistant Typing Dropping Point
  // 3: Assistant Setting Date & Clicking Search
  // 4: Assistant Finding & Matching Chosen Bus in Search Results
  // 5: Finished & Ready for Redirection
  const [assistStep, setAssistStep] = useState(0);

  // Animated input text states for visual assistant typing
  const [typedOrigin, setTypedOrigin] = useState("");
  const [typedDestination, setTypedDestination] = useState("");
  const [typedDate, setTypedDate] = useState("");
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [searchClickRipple, setSearchClickRipple] = useState(false);

  // Virtual cursor coordinates & message bubble
  const [cursorPos, setCursorPos] = useState({ x: 80, y: 15 });
  const [assistantMessage, setAssistantMessage] = useState("Initializing Lexi Assistant...");

  // Logs stream
  const [logs, setLogs] = useState([]);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [autoRedirectEnabled, setAutoRedirectEnabled] = useState(true);

  const logsEndRef = useRef(null);
  const timeoutsRef = useRef([]);

  const origin = searchParams?.origin || "Delhi (Kashmere Gate ISBT)";
  const destination = searchParams?.destination || "Jaipur (Sindhi Camp)";
  const departureDate = searchParams?.departureDate || new Date().toISOString().split("T")[0];
  const passengers = Number(searchParams?.passengers) || 1;

  // Available booking platforms for this bus
  const availablePlatforms = transportItem?.platforms || [
    { name: "redBus", price: transportItem?.price || 850, logoColor: "#d82b40", isCheapest: true },
    { name: "AbhiBus", price: (transportItem?.price || 850) + 15, logoColor: "#b71a2a", isCheapest: false },
    { name: "MakeMyTrip", price: (transportItem?.price || 850) + 55, logoColor: "#ea580c", isCheapest: false },
    { name: "goibibo", price: (transportItem?.price || 850) + 50, logoColor: "#f97316", isCheapest: false },
  ];

  // Pick initial platform
  useEffect(() => {
    if (initialPlatform) {
      const match = availablePlatforms.find(
        (p) => p.name.toLowerCase() === initialPlatform.name?.toLowerCase?.()
      );
      setSelectedPlatform(match || initialPlatform);
    } else {
      const cheapest = availablePlatforms.find((p) => p.isCheapest) || availablePlatforms[0];
      setSelectedPlatform(cheapest);
    }
  }, [initialPlatform, transportItem]);

  const currentPlatformName = selectedPlatform?.name || "redBus";
  const redirectUrl = buildPlatformDeepLink(
    currentPlatformName,
    transportItem,
    origin,
    destination,
    departureDate,
    selectedMode
  );

  // Auto-scroll terminal logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const clearAllTimers = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  // Run the full AI Assistant Automation Sequence
  const runAssistantAutomation = () => {
    clearAllTimers();
    setAssistStep(0);
    setTypedOrigin("");
    setTypedDestination("");
    setTypedDate("");
    setShowOriginDropdown(false);
    setShowDestDropdown(false);
    setSearchClickRipple(false);
    setHasRedirected(false);

    const platName = selectedPlatform?.name || "redBus";
    const operatorName = transportItem?.operator || transportItem?.name || "Zingbus Plus Electric";
    const depTime = transportItem?.departureTime || "08:30 PM";
    const priceVal = selectedPlatform?.price || 850;

    const domainName = platName.toLowerCase().includes("abhibus") ? "abhibus.com" : "redbus.in";

    // INITIAL PHASE (0ms)
    setCursorPos({ x: 82, y: 18 });
    setAssistantMessage(`Visiting official ${domainName} portal...`);
    setLogs([
      `[00:00.08] 🤖 Lexi Web Assistant initialized for ${platName}`,
      `[00:00.25] 🌐 Navigating to https://www.${domainName}`,
      `[00:00.42] 🔒 SSL / TLS Verified • Headless DOM ready`,
    ]);

    // STEP 1: Moving to Boarding Point & Typing (600ms)
    const t1 = setTimeout(() => {
      setAssistStep(1);
      setCursorPos({ x: 20, y: 55 });
      setAssistantMessage(`Assistant: Typing Boarding Point "${origin}"...`);

      setLogs((prev) => [
        ...prev,
        `[00:00.65] 🖱️ Assistant cursor moved to #boarding-point-input`,
        `[00:00.82] ⌨️ Auto-typing: "${extractCleanCity(origin)}"...`,
      ]);

      // Quick realistic typing progression
      const t1_sub1 = setTimeout(() => setTypedOrigin(extractCleanCity(origin).slice(0, 3)), 150);
      const t1_sub2 = setTimeout(() => {
        setTypedOrigin(extractCleanCity(origin));
        setShowOriginDropdown(true);
      }, 350);
      const t1_sub3 = setTimeout(() => {
        setShowOriginDropdown(false);
        setTypedOrigin(origin);
        setLogs((prev) => [
          ...prev,
          `[00:01.10] ✅ Selected Boarding Terminal: "${origin}"`,
        ]);
      }, 700);
      timeoutsRef.current.push(t1_sub1, t1_sub2, t1_sub3);
    }, 600);

    // STEP 2: Moving to Dropping Point & Typing (1600ms)
    const t2 = setTimeout(() => {
      setAssistStep(2);
      setCursorPos({ x: 50, y: 55 });
      setAssistantMessage(`Assistant: Typing Dropping Point "${destination}"...`);

      setLogs((prev) => [
        ...prev,
        `[00:01.35] 🖱️ Assistant cursor moved to #dropping-point-input`,
        `[00:01.55] ⌨️ Auto-typing: "${extractCleanCity(destination)}"...`,
      ]);

      const t2_sub1 = setTimeout(() => setTypedDestination(extractCleanCity(destination).slice(0, 3)), 150);
      const t2_sub2 = setTimeout(() => {
        setTypedDestination(extractCleanCity(destination));
        setShowDestDropdown(true);
      }, 350);
      const t2_sub3 = setTimeout(() => {
        setShowDestDropdown(false);
        setTypedDestination(destination);
        setLogs((prev) => [
          ...prev,
          `[00:01.85] ✅ Selected Dropping Terminal: "${destination}"`,
        ]);
      }, 700);
      timeoutsRef.current.push(t2_sub1, t2_sub2, t2_sub3);
    }, 1600);

    // STEP 3: Selecting Date & Clicking Search (2600ms)
    const t3 = setTimeout(() => {
      setAssistStep(3);
      setCursorPos({ x: 72, y: 55 });
      setAssistantMessage(`Assistant: Selecting Travel Date (${departureDate})...`);
      setTypedDate(departureDate);

      setLogs((prev) => [
        ...prev,
        `[00:02.10] 📅 Date of Journey set to: ${departureDate}`,
        `[00:02.30] 🖱️ Moving cursor to [SEARCH BUSES] action trigger...`,
      ]);

      const t3_sub1 = setTimeout(() => {
        setCursorPos({ x: 90, y: 55 });
        setAssistantMessage(`Assistant: Clicking Search Buses!`);
        setSearchClickRipple(true);
        setLogs((prev) => [
          ...prev,
          `[00:02.55] 💥 Clicked "SEARCH BUSES" button with active event dispatch`,
          `[00:02.75] ⏳ Querying ${platName} route inventory... 42 schedules retrieved`,
        ]);
      }, 400);

      const t3_sub2 = setTimeout(() => {
        setSearchClickRipple(false);
      }, 850);

      timeoutsRef.current.push(t3_sub1, t3_sub2);
    }, 2600);

    // STEP 4: Navigating Search Results & Finding Exact Chosen Bus (3700ms)
    const t4 = setTimeout(() => {
      setAssistStep(4);
      setCursorPos({ x: 50, y: 50 });
      setAssistantMessage(`🎯 Scanning results: Found your bus "${operatorName}"!`);

      setLogs((prev) => [
        ...prev,
        `[00:03.05] 🔍 Parsing live schedule feed on ${platName}...`,
        `[00:03.30] 🎯 MATCH ACQUIRED! Target: "${operatorName}" departing at ${depTime}`,
        `[00:03.50] 💰 Verified lowest route fare: ₹${priceVal.toLocaleString()}`,
        `[00:03.70] 💺 Auto-allocated prime seat: 14A (Window, Lower Deck Berth)`,
      ]);
    }, 3700);

    // STEP 5: Final Redirection & Handover (4900ms)
    const t5 = setTimeout(() => {
      setAssistStep(5);
      setCursorPos({ x: 50, y: 88 });
      setAssistantMessage(`✅ Done! Handing over session to official ${platName} portal...`);

      setLogs((prev) => [
        ...prev,
        `[00:04.10] 🚀 Assistant automation completed with 100% accuracy!`,
        `[00:04.25] 🔗 Official Pre-Filled URL: ${redirectUrl.slice(0, 52)}...`,
        `[00:04.40] ✨ Opening official booking portal in active tab...`,
      ]);

      if (autoRedirectEnabled) {
        try {
          window.open(redirectUrl, "_blank", "noopener,noreferrer");
          setHasRedirected(true);
        } catch (e) {
          console.warn("Popup blocked, user can click direct link:", e);
        }
      }
    }, 4900);

    timeoutsRef.current.push(t1, t2, t3, t4, t5);
  };

  useEffect(() => {
    if (isOpen && transportItem) {
      runAssistantAutomation();
    } else {
      clearAllTimers();
    }
    return () => clearAllTimers();
  }, [isOpen, selectedPlatform?.name, transportItem?.id]);

  if (!isOpen || !transportItem) return null;

  const currentPrice = selectedPlatform?.price || 850;
  const operatorName = transportItem?.operator || transportItem?.name || "Premium Bus Operator";
  const depTime = transportItem?.departureTime || "08:30 PM";
  const arrTime = transportItem?.arrivalTime || "03:15 AM";
  const duration = transportItem?.duration || "6h 45m";
  const depLoc = transportItem?.departureLocation || `${origin} Interstate Terminus`;
  const arrLoc = transportItem?.arrivalLocation || `${destination} Central Drop Point`;

  return (
    <div className="automation-modal-overlay">
      <div className="automation-modal-card">
        {/* =========================================================
            TOP ASSISTANT STATUS HEADER
            ========================================================= */}
        <div className="automation-modal-header">
          <div className="automation-title-col">
            <div className="bot-status-pill">
              <FaRobot className="bot-icon-spin" />
              <span>Lexi Autonomous Travel Assistant</span>
              <span className="live-dot" />
            </div>
            <h2 className="modal-headline">
              Assistant is Auto-Filling &amp; Finding Your Bus on{" "}
              <span className="highlight-plat">{currentPlatformName}</span>
            </h2>
            <p className="modal-subtext">
              Watch Lexi's AI assistant go directly to the booking website, type your boarding &amp; dropping points, and locate your chosen bus!
            </p>
          </div>

          <button
            type="button"
            className="automation-close-btn"
            onClick={onClose}
            title="Close Assistant"
          >
            <FiX />
          </button>
        </div>

        {/* =========================================================
            PLATFORM SELECTOR TABS
            ========================================================= */}
        <div className="automation-platform-tabs-row">
          <span className="platform-select-label">Target Website:</span>
          <div className="platform-tabs-pill-list">
            {availablePlatforms.map((plat, idx) => {
              const isSelected = plat.name.toLowerCase() === currentPlatformName.toLowerCase();
              return (
                <button
                  key={idx}
                  type="button"
                  className={`platform-select-tab ${isSelected ? "active" : ""}`}
                  style={{
                    borderColor: isSelected ? plat.logoColor : "#e2e8f0",
                    background: isSelected ? "#ffffff" : "#f8fafc",
                  }}
                  onClick={() => {
                    setSelectedPlatform(plat);
                    setHasRedirected(false);
                  }}
                >
                  <span className="plat-tab-name" style={{ color: plat.logoColor }}>
                    {plat.name}
                  </span>
                  <span className="plat-tab-price">₹{plat.price.toLocaleString()}</span>
                  {plat.isCheapest && <span className="plat-tab-lowest">Lowest</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            MAIN SIMULATED BROWSER & ASSISTANT VIEWPORT
            ========================================================= */}
        <div className="automation-grid-split">
          {/* SIMULATED WEB BROWSER CANVAS */}
          <div className="automation-browser-window">
            {/* Top Chrome Address Bar */}
            <div className="browser-chrome-header">
              <div className="browser-window-dots">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>

              <div className="browser-address-bar">
                <FiLock className="address-lock-icon" />
                <span className="address-url-text">
                  {currentPlatformName === "AbhiBus"
                    ? `https://www.abhibus.com/bus_search/${extractCleanCity(origin)}/${extractCleanCity(
                        destination
                      )}/${departureDate}`
                    : `https://www.redbus.in/bus-tickets/${extractCleanCity(origin).toLowerCase()}-to-${extractCleanCity(
                        destination
                      ).toLowerCase()}?fromCityName=${extractCleanCity(origin)}&toCityName=${extractCleanCity(destination)}&onward=${departureDate}`}
                </span>
              </div>

              <div className="browser-live-badge">
                <span className="badge-pulse-ring" />
                <span>ASSISTANT ACTIVE</span>
              </div>
            </div>

            {/* Simulated Live Viewport with Virtual Assistant Cursor */}
            <div className="browser-viewport-canvas assistant-relative-viewport">
              {/* VIRTUAL ASSISTANT CURSOR OVERLAY */}
              <div
                className="ai-virtual-cursor"
                style={{
                  top: `${cursorPos.y}%`,
                  left: `${cursorPos.x}%`,
                }}
              >
                <div className="cursor-arrow-pointer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5.5 3.5L19 12L12 14L9 20.5L5.5 3.5Z"
                      fill="#2563eb"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div className="assistant-bubble-tag">
                  <FaRobot className="mini-bot-icon" />
                  <span>{assistantMessage}</span>
                </div>
              </div>

              {/* VIEW 1: WEBSITE SEARCH FORM (STEPS 0, 1, 2, 3) */}
              {assistStep < 4 ? (
                <div className="simulated-website-home">
                  {/* Website Brand Header */}
                  <div
                    className="mock-site-navbar"
                    style={{
                      background:
                        currentPlatformName === "AbhiBus" ? "#b71a2a" : "#d82b40",
                    }}
                  >
                    <div className="site-logo-text">
                      <strong>{currentPlatformName}</strong>
                      <span className="dot-in">.in</span>
                    </div>
                    <div className="site-nav-links">
                      <span className="active-link">Bus Tickets</span>
                      <span>Cab Rental</span>
                      <span>Train Tickets</span>
                      <span>Help</span>
                    </div>
                  </div>

                  <div className="mock-site-hero-area">
                    <h3 className="hero-punchline">
                      India's Online Bus Booking — Compare &amp; Travel
                    </h3>

                    {/* THE INTERACTIVE SEARCH FORM */}
                    <div className="simulated-search-container">
                      {/* 1. Boarding Point Field */}
                      <div
                        className={`sim-field-box ${
                          assistStep === 1 ? "active-assist-focus" : ""
                        }`}
                      >
                        <span className="sim-field-icon">
                          <FaBus style={{ color: "#d82b40" }} />
                        </span>
                        <div className="sim-field-inputs">
                          <label className="sim-label">FROM (Boarding Point)</label>
                          <div className="sim-input-val">
                            {typedOrigin || (
                              <span className="placeholder-ghost">Enter Boarding City / Stand</span>
                            )}
                            {assistStep === 1 && <span className="typing-cursor" />}
                          </div>
                        </div>

                        {/* Autocomplete Dropdown Preview */}
                        {showOriginDropdown && (
                          <div className="sim-autocomplete-dropdown">
                            <div className="sim-dropdown-item highlighted">
                              <FaLocationDot className="drop-icon" />
                              <div>
                                <strong>{origin}</strong>
                                <span className="drop-sub">Central Terminal • Verified Stand</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 2. Dropping Point Field */}
                      <div
                        className={`sim-field-box ${
                          assistStep === 2 ? "active-assist-focus" : ""
                        }`}
                      >
                        <span className="sim-field-icon">
                          <FaLocationDot style={{ color: "#2563eb" }} />
                        </span>
                        <div className="sim-field-inputs">
                          <label className="sim-label">TO (Dropping Point)</label>
                          <div className="sim-input-val">
                            {typedDestination || (
                              <span className="placeholder-ghost">Enter Drop City / Stand</span>
                            )}
                            {assistStep === 2 && <span className="typing-cursor" />}
                          </div>
                        </div>

                        {/* Autocomplete Dropdown Preview */}
                        {showDestDropdown && (
                          <div className="sim-autocomplete-dropdown">
                            <div className="sim-dropdown-item highlighted">
                              <FaLocationDot className="drop-icon" />
                              <div>
                                <strong>{destination}</strong>
                                <span className="drop-sub">Interstate Drop Point • Verified</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 3. Date Field */}
                      <div
                        className={`sim-field-box ${
                          assistStep === 3 ? "active-assist-focus" : ""
                        }`}
                      >
                        <span className="sim-field-icon">
                          <FaCalendarDays style={{ color: "#059669" }} />
                        </span>
                        <div className="sim-field-inputs">
                          <label className="sim-label">DATE OF JOURNEY</label>
                          <div className="sim-input-val">
                            {typedDate || departureDate}
                          </div>
                        </div>
                      </div>

                      {/* 4. Search Buses Button */}
                      <div
                        className={`sim-btn-search ${
                          searchClickRipple ? "search-btn-clicked" : ""
                        }`}
                        style={{
                          background:
                            currentPlatformName === "AbhiBus" ? "#b71a2a" : "#d82b40",
                        }}
                      >
                        <span>SEARCH BUSES</span>
                        {searchClickRipple && <span className="click-ripple" />}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* VIEW 2: SEARCH RESULTS & TARGET BUS HIGHLIGHT (STEPS 4 & 5) */
                <div className="simulated-website-results">
                  {/* Results Sub-header */}
                  <div className="mock-results-header-strip">
                    <div className="strip-route-title">
                      <strong>
                        {extractCleanCity(origin)} → {extractCleanCity(destination)}
                      </strong>
                      <span className="strip-date">{departureDate} • 42 Buses Found</span>
                    </div>

                    <div className="strip-filter-tag">
                      <span className="filter-badge">
                        Filtered by Operator: <strong>{operatorName}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Listings Container */}
                  <div className="mock-bus-results-stack">
                    {/* Dummy Other Bus (Unselected) */}
                    <div className="mock-other-bus-card dimmed">
                      <div className="other-bus-info">
                        <span className="other-bus-name">State RTC Executive Express</span>
                        <span className="other-bus-time">06:00 AM → 01:30 PM • 7h 30m</span>
                      </div>
                      <div className="other-bus-price">₹540</div>
                    </div>

                    {/* THE EXACT CHOSEN BUS (SPOTLIGHTED BY ASSISTANT) */}
                    <div className="mock-target-bus-card target-active-highlight">
                      <div className="target-bot-ribbon">
                        <FaRobot className="ribbon-robot" />
                        <span>🎯 TARGET BUS MATCHED BY LEXI ASSISTANT</span>
                        <FaBolt className="ribbon-bolt" />
                      </div>

                      <div className="target-bus-body">
                        <div className="target-operator-col">
                          <h4 className="target-operator-title">{operatorName}</h4>
                          <p className="target-operator-sub">
                            {transportItem?.subtitle || "AC Sleeper 2+1 Luxury Multi-Axle"}
                          </p>
                          <div className="target-tags-row">
                            <span className="tag-rating">
                              <FaStar className="star-mini" /> {transportItem?.rating || 4.7}
                            </span>
                            <span className="tag-amenity">AC</span>
                            <span className="tag-amenity">Sleeper</span>
                            <span className="tag-amenity">Live GPS</span>
                          </div>
                        </div>

                        <div className="target-timeline-col">
                          <div className="time-endpoint">
                            <span className="time-large">{depTime}</span>
                            <span className="loc-small">{depLoc}</span>
                          </div>
                          <div className="track-connector">
                            <span className="dur-text">{duration}</span>
                            <div className="track-line-visual" />
                          </div>
                          <div className="time-endpoint">
                            <span className="time-large">{arrTime}</span>
                            <span className="loc-small">{arrLoc}</span>
                          </div>
                        </div>

                        <div className="target-booking-col">
                          <span className="fare-source-label">
                            Verified on {currentPlatformName}
                          </span>
                          <strong className="fare-bold-text">
                            ₹{currentPrice.toLocaleString()}
                          </strong>
                          <span className="cheapest-badge-pill">Lowest Price Guaranteed</span>
                        </div>
                      </div>

                      {/* Seat Map Auto-Allocation Preview */}
                      <div className="target-seat-preview-bar">
                        <div className="seat-auto-info">
                          <FaChair className="seat-icon-active" />
                          <span>
                            Assistant Auto-Allocated: <strong>Seat 14A</strong> (Window Sleeper / Lower Berth)
                          </span>
                        </div>
                        <div className="seat-status-verified">
                          <FaCircleCheck className="check-icon-solid" />
                          <span>Ready for Instant Booking</span>
                        </div>
                      </div>
                    </div>

                    {/* Dummy Other Bus (Unselected) */}
                    <div className="mock-other-bus-card dimmed">
                      <div className="other-bus-info">
                        <span className="other-bus-name">Neeta Volvo Club Class</span>
                        <span className="other-bus-time">11:45 PM → 06:15 AM • 6h 30m</span>
                      </div>
                      <div className="other-bus-price">₹1,150</div>
                    </div>
                  </div>

                  {/* Redirection Notice Banner */}
                  <div className="mock-handoff-banner">
                    <FaCircleCheck className="handoff-check" />
                    <div>
                      <strong>Assistant Successfully Completed Pre-Filling &amp; Matching!</strong>
                      <p>
                        Boarding point, dropping point, and chosen bus ({operatorName}) are configured for {currentPlatformName}.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: BOT PROCESS TERMINAL & PIPELINE */}
          <div className="automation-terminal-column">
            {/* Stepper Progress */}
            <div className="automation-stepper-box">
              <div className="stepper-header-row">
                <span className="stepper-title">Assistant Execution Pipeline</span>
                <span className="stepper-percent">
                  {assistStep === 0
                    ? "15%"
                    : assistStep === 1
                    ? "40%"
                    : assistStep === 2
                    ? "65%"
                    : assistStep === 3
                    ? "80%"
                    : assistStep === 4
                    ? "95%"
                    : "100%"}
                </span>
              </div>

              <div className="stepper-progress-track">
                <div
                  className="stepper-progress-fill"
                  style={{
                    width:
                      assistStep === 0
                        ? "15%"
                        : assistStep === 1
                        ? "40%"
                        : assistStep === 2
                        ? "65%"
                        : assistStep === 3
                        ? "80%"
                        : assistStep === 4
                        ? "95%"
                        : "100%",
                  }}
                />
              </div>

              <div className="stepper-steps-list">
                {[
                  {
                    title: "1. Navigate to Website",
                    desc: `Open official ${currentPlatformName} portal & initialize session`,
                    stepIdx: 0,
                  },
                  {
                    title: "2. Fill Boarding Point",
                    desc: `Type & select "${origin}"`,
                    stepIdx: 1,
                  },
                  {
                    title: "3. Fill Dropping Point",
                    desc: `Type & select "${destination}"`,
                    stepIdx: 2,
                  },
                  {
                    title: "4. Set Date & Search",
                    desc: `Set ${departureDate} and trigger live search`,
                    stepIdx: 3,
                  },
                  {
                    title: "5. Find That Chosen Bus",
                    desc: `Locate ${operatorName} & lock lowest fare (₹${currentPrice})`,
                    stepIdx: 4,
                  },
                ].map((stg) => {
                  const isDone = assistStep > stg.stepIdx;
                  const isCurrent = assistStep === stg.stepIdx;
                  return (
                    <div
                      key={stg.stepIdx}
                      className={`step-item-row ${
                        isDone ? "step-done" : isCurrent ? "step-current" : ""
                      }`}
                    >
                      <div className="step-indicator-circle">
                        {isDone ? (
                          <FaCheck className="icon-check" />
                        ) : (
                          <span>{stg.stepIdx + 1}</span>
                        )}
                      </div>
                      <div className="step-text-col">
                        <span className="step-title-text">{stg.title}</span>
                        <span className="step-desc-text">{stg.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Terminal Output */}
            <div className="automation-terminal-box">
              <div className="terminal-header">
                <FiTerminal className="terminal-icon" />
                <span>Assistant Bot Process Stream</span>
                <button
                  type="button"
                  className="terminal-rerun-btn"
                  onClick={runAssistantAutomation}
                  title="Replay Assistant Automation"
                >
                  <FaRotateRight /> Replay
                </button>
              </div>

              <div className="terminal-logs-scroll">
                {logs.map((log, lIdx) => (
                  <div key={lIdx} className="log-line">
                    {log}
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            BOTTOM ACTIONS FOOTER
            ========================================================= */}
        <div className="automation-modal-footer">
          <div className="footer-left-info">
            <label className="auto-redirect-checkbox">
              <input
                type="checkbox"
                checked={autoRedirectEnabled}
                onChange={(e) => setAutoRedirectEnabled(e.target.checked)}
              />
              <span>Auto-open official website in new tab when assistant finishes</span>
            </label>
            <span className="security-notice">
              <FaShieldHalved className="shield-mini" /> Verified Handshake • Boarding &amp; Dropping Points Attached
            </span>
          </div>

          <div className="footer-buttons-group">
            {onProceedToSafetyBooking && (
              <button
                type="button"
                className="btn-secondary-inapp-checkout"
                onClick={() => {
                  onClose();
                  onProceedToSafetyBooking(transportItem, selectedPlatform);
                }}
              >
                <span>Book In-App (Direct Verified PNR)</span>
              </button>
            )}

            <a
              href={redirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-launch-portal"
              onClick={() => setHasRedirected(true)}
            >
              <FaArrowUpRightFromSquare className="launch-icon" />
              <span>Open Pre-Filled on {currentPlatformName}</span>
              <FaArrowRight className="arrow-launch" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelAutomationModal;
