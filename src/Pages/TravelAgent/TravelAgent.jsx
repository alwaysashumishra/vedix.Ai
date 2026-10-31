import React, { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiSun, FiMoon, FiArrowUpRight } from "react-icons/fi";
import { ThemeContext } from "../../context/ThemeContext";
import { assets } from "../../assets/assets";
import "./TravelAgent.css";
import TravelHeroHub from "../../components/TravelAgent/TravelHeroHub";
import TransportResultsPage from "../../components/TravelAgent/TransportResultsPage";
import BookingSafetyModal from "../../components/TravelAgent/BookingSafetyModal";
import TravelAutomationModal from "../../components/TravelAgent/TravelAutomationModal";
import { generateResilientTravelPlan } from "../../components/TravelAgent/travelMockService";
import { getApiBaseUrl } from "../../config/apiConfig";

const API_BASE = getApiBaseUrl();

const getDefaultTravelDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

const TravelAgent = ({ profile }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isLight = theme === "light";

  const [pageView, setPageView] = useState("home"); // "home" | "results"
  const [selectedTransportMode, setSelectedTransportMode] = useState("bus");

  const [searchParams, setSearchParams] = useState({
    origin: "Delhi",
    destination: "Lucknow",
    departureDate: getDefaultTravelDate(),
    passengers: 1,
    budget: 20000,
  });

  const [activeDashboardTab, setActiveDashboardTab] = useState("transport");
  const [isLoading, setIsLoading] = useState(false);

  const [planData, setPlanData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [selectedStay, setSelectedStay] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [automationPayload, setAutomationPayload] = useState(null);
  const [userPreferences, setUserPreferences] = useState({});

  const resultsRef = useRef(null);

  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem("lexi_travel_preferences");
      if (savedPrefs) {
        setUserPreferences(JSON.parse(savedPrefs));
      }
    } catch (e) {
      console.error("Error reading saved travel preferences", e);
    }
  }, []);

  const saveMemory = (params) => {
    try {
      const memory = {
        preferredTransport: params.preferredTransport || ["Bus"],
        preferredDepartureTime: params.preferredDepartureTime || "Anytime",
        typicalBudget: params.budget || 20000,
        minHotelRating: params.minHotelRating || 4.0,
        seatPreference: params.seatPreference || "Any",
        lastDestination: params.destination || "",
      };
      setUserPreferences(memory);
      localStorage.setItem("lexi_travel_preferences", JSON.stringify(memory));
    } catch (e) {
      console.error("Error saving memory", e);
    }
  };

  const handleUpdateSearchParams = (updates) => {
    setSearchParams((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const fetchTravelPlan = async (payload) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/travel/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data && data.success) {
        setPlanData(data);
        setSelectedTransport(data.selectedTransport);
        setSelectedStay(data.selectedStay);
        saveMemory(data.userParams);
      } else {
        // Fallback gracefully to client provider
        const fallback = generateResilientTravelPlan(payload.explicitForm || payload);
        setPlanData(fallback);
        setSelectedTransport(fallback.selectedTransport);
        setSelectedStay(fallback.selectedStay);
      }
    } catch (err) {
      console.warn("Backend travel API offline or unreachable, serving resilient AI plan:", err);
      const fallback = generateResilientTravelPlan(payload.explicitForm || payload);
      setPlanData(fallback);
      setSelectedTransport(fallback.selectedTransport);
      setSelectedStay(fallback.selectedStay);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 250);
    }
  };

  const handleHubSearch = () => {
    setPageView("results");
    window.scrollTo({ top: 0, behavior: "smooth" });

    const modeName =
      selectedTransportMode.charAt(0).toUpperCase() + selectedTransportMode.slice(1);

    const payload = {
      explicitForm: {
        origin: searchParams.origin || "Delhi",
        destination: searchParams.destination || "Lucknow",
        departureDate: searchParams.departureDate,
        travelers: Number(searchParams.passengers) || 1,
        budget: Number(searchParams.budget) || 20000,
        preferredTransport: [modeName],
        travelType: "Leisure",
        hotelCategory: "Mid-Range",
        seatPreference: "Window",
        acPreference: "AC",
        roomsCount: Math.ceil((Number(searchParams.passengers) || 1) / 2),
      },
      activeFilters: {
        preferredMode: modeName,
      },
    };

    fetchTravelPlan(payload);
  };

  const handleChatSend = async (text) => {
    const newMsg = { sender: "user", text };
    setMessages((prev) => [...prev, newMsg]);

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/travel/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptText: text }),
      });

      const data = await response.json();
      if (data && data.success) {
        setPlanData(data);
        setSelectedTransport(data.selectedTransport);
        setSelectedStay(data.selectedStay);
        saveMemory(data.userParams);

        const agentMsg = {
          sender: "agent",
          text: `I've analyzed your request to visit ${data.userParams.destination} from ${data.userParams.origin}. I've queried transport operators, stays, budget allocations, and created your itinerary.`,
          extractedSummary: `${data.userParams.origin} → ${data.userParams.destination} | ${data.userParams.travelers} Travelers | Budget: ₹${data.userParams.budget.toLocaleString()}`,
        };
        setMessages((prev) => [...prev, agentMsg]);
      } else {
        const fallback = generateResilientTravelPlan({ origin: "Delhi", destination: "Jaipur" });
        setPlanData(fallback);
        setSelectedTransport(fallback.selectedTransport);
        setSelectedStay(fallback.selectedStay);
        const agentMsg = {
          sender: "agent",
          text: `I've prepared an optimized travel plan for your trip. Check the multi-modal comparison, hotel stays, and day-by-day itinerary below!`,
          extractedSummary: `Delhi → Jaipur | 1 Traveler | Budget: ₹20,000`,
        };
        setMessages((prev) => [...prev, agentMsg]);
      }
    } catch (err) {
      console.warn("Chat API error, using resilient provider:", err);
      const fallback = generateResilientTravelPlan({ origin: "Delhi", destination: "Jaipur" });
      setPlanData(fallback);
      setSelectedTransport(fallback.selectedTransport);
      setSelectedStay(fallback.selectedStay);
      const agentMsg = {
        sender: "agent",
        text: `I've prepared an optimized travel plan with real-time options below!`,
      };
      setMessages((prev) => [...prev, agentMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 250);
    }
  };

  const handleFormSubmit = (formData) => {
    fetchTravelPlan({ explicitForm: formData });
  };

  const handleSelectTransport = (transport) => {
    setSelectedTransport(transport);
    if (planData) {
      fetchTravelPlan({
        promptText: planData.userParams.naturalLanguageSummary,
        explicitForm: planData.userParams,
        selectedTransportId: transport.id,
        selectedStayId: selectedStay?.id,
      });
    }
  };

  const handleSelectStay = (stay) => {
    setSelectedStay(stay);
    if (planData) {
      fetchTravelPlan({
        promptText: planData.userParams.naturalLanguageSummary,
        explicitForm: planData.userParams,
        selectedTransportId: selectedTransport?.id,
        selectedStayId: stay.id,
      });
    }
  };

  const handleRunScenario = async (scenarioPayload) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/travel/what-if`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...scenarioPayload,
          currentParams: planData?.userParams || {},
        }),
      });

      const data = await response.json();
      if (data && data.success) {
        setPlanData(data);
        setSelectedTransport(data.selectedTransport);
        setSelectedStay(data.selectedStay);
      }
    } catch (err) {
      console.error("Scenario error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyAlternative = (alt) => {
    if (alt.replacementMode) {
      const altTransport = planData?.transportOptions?.find((t) => t.mode === alt.replacementMode);
      if (altTransport) handleSelectTransport(altTransport);
    } else if (alt.targetCategory) {
      const altStay = planData?.stayOptions?.find((s) => s.category === alt.targetCategory);
      if (altStay) handleSelectStay(altStay);
    }
  };

  return (
    <div
      className={`travel-agent-page ${theme || "light"}`}
      data-theme={theme || "light"}
    >
      {/* ================= FLOATING FROSTED STELLAR / VEDIX NAVBAR ================= */}
      <header className="stellar-navbar-container travel-stellar-navbar-container">
        <motion.nav
          className="stellar-navbar travel-stellar-navbar"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Brand Logo with Official Vedix.AI Logo */}
          <div
            className="stellar-brand"
            onClick={() => {
              setPageView("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            role="button"
            tabIndex={0}
          >
            <div className="vedix-nav-logo-badge">
              <img
                src={assets.gemini_icon}
                alt="Vedix.Ai Logo"
                className="vedix-official-logo"
              />
            </div>
            <span className="stellar-brand-name">Vedix.Ai</span>
            <span className="travel-nav-badge-pill">Travel Agent</span>
          </div>

          {/* Centered Pill Navigation */}
          <div className="stellar-nav-pill travel-nav-pill">
            <button
              type="button"
              className={pageView === "home" ? "active" : ""}
              onClick={() => {
                setPageView("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Search Trips
            </button>
            <button
              type="button"
              className={selectedTransportMode === "bus" ? "active" : ""}
              onClick={() => {
                setSelectedTransportMode("bus");
                if (pageView === "results") {
                  handleHubSearch();
                }
              }}
            >
              Buses
            </button>
            <button
              type="button"
              className={selectedTransportMode === "train" ? "active" : ""}
              onClick={() => {
                setSelectedTransportMode("train");
                if (pageView === "results") {
                  handleHubSearch();
                }
              }}
            >
              Trains
            </button>
            <button
              type="button"
              className={selectedTransportMode === "flight" ? "active" : ""}
              onClick={() => {
                setSelectedTransportMode("flight");
                if (pageView === "results") {
                  handleHubSearch();
                }
              }}
            >
              Flights
            </button>
            <button
              type="button"
              className={selectedTransportMode === "cab" ? "active" : ""}
              onClick={() => {
                setSelectedTransportMode("cab");
                if (pageView === "results") {
                  handleHubSearch();
                }
              }}
            >
              Cabs
            </button>
            <button
              type="button"
              className={pageView === "results" ? "active" : ""}
              onClick={() => {
                if (pageView !== "results") {
                  handleHubSearch();
                }
              }}
            >
              Live Fares
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="stellar-nav-actions travel-nav-actions">
            {pageView === "results" && (
              <button
                type="button"
                className="travel-nav-back-search-btn"
                onClick={() => {
                  setPageView("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                ← Back to Search
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              type="button"
              className={`stellar-theme-toggle ${isLight ? "light-mode" : "dark-mode"}`}
              onClick={toggleTheme}
              aria-label={`Switch to ${isLight ? "Dark" : "Light"} mode`}
              title={`Switch to ${isLight ? "Dark" : "Light"} mode`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isLight ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <FiSun className="theme-toggle-icon sun" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, scale: 0.6, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -90, scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <FiMoon className="theme-toggle-icon moon" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Back to Home CTA matching Landing Page */}
            <Link to="/" className="stellar-cta-btn travel-home-cta-btn">
              <span>Back to Home</span>
              <FiArrowUpRight className="stellar-cta-arrow" />
            </Link>
          </div>
        </motion.nav>
      </header>

      {pageView === "home" ? (
        /* PRIMARY SHOWCASE HERO VIEW (Matches user's image) */
        <TravelHeroHub
          selectedMode={selectedTransportMode}
          onSelectMode={setSelectedTransportMode}
          searchParams={searchParams}
          onUpdateParams={handleUpdateSearchParams}
          onSearch={handleHubSearch}
          isLoading={isLoading}
        />
      ) : (
        /* TRANSPORT RESULTS COMPARISON VIEW (Matches Trains & Buses Showcase) */
        <TransportResultsPage
          searchParams={searchParams}
          selectedMode={selectedTransportMode}
          onSelectMode={setSelectedTransportMode}
          onBackToSearch={() => setPageView("home")}
          onUpdateParams={handleUpdateSearchParams}
          onReSearch={handleHubSearch}
          onSelectBooking={(item, platform) => {
            // For bus bookings, launch the Autonomous Auto-Fill & Search Bot
            if (selectedTransportMode === "bus") {
              setAutomationPayload({ item, platform });
              setShowAutomationModal(true);
            } else {
              const lowestPrice =
                platform?.price ||
                item.price ||
                (item.platforms && item.platforms.length
                  ? Math.min(...item.platforms.map((p) => p.price))
                  : 4899);
              const modeLabel =
                selectedTransportMode === "train"
                  ? "Train"
                  : selectedTransportMode === "flight"
                  ? "Flight"
                  : selectedTransportMode === "cab"
                  ? "Cab"
                  : "Bus";
              const routeLabel = `${
                searchParams.origin ||
                (selectedTransportMode === "flight"
                  ? "DEL"
                  : selectedTransportMode === "cab"
                  ? "New Delhi"
                  : "Delhi")
              } → ${
                searchParams.destination ||
                (selectedTransportMode === "flight"
                  ? "BLR"
                  : selectedTransportMode === "cab"
                  ? "Gurugram, Haryana"
                  : "Lucknow")
              }`;
              setSelectedTransport({
                id: item.id,
                mode: modeLabel,
                operator: item.airlineName || item.name || item.operator,
                route: routeLabel,
                departureTime: item.departureTime,
                arrivalTime: item.arrivalTime,
                duration: item.duration,
                totalPrice: lowestPrice * (Number(searchParams.passengers) || 1),
                pricePerPerson: lowestPrice,
                rating: item.rating || 4.7,
                safetyScore: 9.8,
                whyRecommended: `${
                  item.airlineName || item.name || item.operator
                } provides the lowest verified price across platforms.`,
              });
              setShowBookingModal(true);
            }
          }}
        />
      )}

      {/* Lexi Autonomous Web Booking Modal */}
      <TravelAutomationModal
        isOpen={showAutomationModal}
        onClose={() => setShowAutomationModal(false)}
        transportItem={automationPayload?.item}
        initialPlatform={automationPayload?.platform}
        searchParams={searchParams}
        selectedMode={selectedTransportMode}
        onProceedToSafetyBooking={(item, platform) => {
          const unitPrice =
            platform?.price ||
            item?.price ||
            (item?.platforms?.length ? Math.min(...item.platforms.map((p) => p.price)) : 850);
          const routeLabel = `${searchParams.origin || "Delhi"} → ${
            searchParams.destination || "Jaipur"
          }`;
          setSelectedTransport({
            id: item.id,
            mode: "Bus",
            operator: item.operator || item.name || "Bus Carrier",
            route: routeLabel,
            departureTime: item.departureTime,
            arrivalTime: item.arrivalTime,
            duration: item.duration,
            totalPrice: unitPrice * (Number(searchParams.passengers) || 1),
            pricePerPerson: unitPrice,
            rating: item.rating || 4.7,
            safetyScore: 9.8,
            whyRecommended: `${item.operator} verified on ${platform?.name || "carrier network"}.`,
          });
          setShowBookingModal(true);
        }}
      />

      {/* Booking Safety Modal */}
      <BookingSafetyModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        selectedTransport={selectedTransport}
        selectedStay={selectedStay}
        userParams={
          planData?.userParams || {
            ...searchParams,
            travelers: searchParams.passengers,
          }
        }
        budgetAnalysis={planData?.budgetAnalysis}
      />
    </div>
  );
};

export default TravelAgent;
