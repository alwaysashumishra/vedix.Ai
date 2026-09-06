import React, { useState, useEffect } from "react";
import "./TravelAgent.css";
import TravelChat from "../../components/TravelAgent/TravelChat";
import TravelForm from "../../components/TravelAgent/TravelForm";
import AgentProgressTracker from "../../components/TravelAgent/AgentProgressTracker";
import TransportComparison from "../../components/TravelAgent/TransportComparison";
import StayComparison from "../../components/TravelAgent/StayComparison";
import BudgetOptimizerCard from "../../components/TravelAgent/BudgetOptimizerCard";
import ItineraryView from "../../components/TravelAgent/ItineraryView";
import WhatIfScenarioPanel from "../../components/TravelAgent/WhatIfScenarioPanel";
import BookingSafetyModal from "../../components/TravelAgent/BookingSafetyModal";
import BackHomeButton from "../../components/BackHomeButton/BackHomeButton";
import { DESTINATION_MEDIA } from "../../components/TravelAgent/travelMedia";
import { getApiBaseUrl } from "../../config/apiConfig";
import { FiNavigation, FiCompass, FiEdit3, FiPieChart, FiCalendar, FiCheckCircle, FiShield, FiHeart, FiFileText, FiMapPin, FiUsers, FiDollarSign } from "react-icons/fi";

const API_BASE = getApiBaseUrl();

const TravelAgent = ({ profile }) => {
  const [activeInputMode, setActiveInputMode] = useState("chat");
  const [activeDashboardTab, setActiveDashboardTab] = useState("transport");
  const [isLoading, setIsLoading] = useState(false);

  const [planData, setPlanData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [selectedStay, setSelectedStay] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [userPreferences, setUserPreferences] = useState({});

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

  const fetchTravelPlan = async (payload) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/travel/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        setPlanData(data);
        setSelectedTransport(data.selectedTransport);
        setSelectedStay(data.selectedStay);
        saveMemory(data.userParams);
      } else {
        alert(data.message || "Failed to generate travel plan");
      }
    } catch (err) {
      console.error("Error calling travel API:", err);
    } finally {
      setIsLoading(false);
    }
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
      if (data.success) {
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
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
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
      if (data.success) {
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
      const altTransport = planData.transportOptions.find((t) => t.mode === alt.replacementMode);
      if (altTransport) handleSelectTransport(altTransport);
    } else if (alt.targetCategory) {
      const altStay = planData.stayOptions.find((s) => s.category === alt.targetCategory);
      if (altStay) handleSelectStay(altStay);
    }
  };

  const destKey = (planData?.userParams?.destination || "").toLowerCase().trim();
  const media = DESTINATION_MEDIA[destKey] || DESTINATION_MEDIA.default;

  return (
    <div className="travel-agent-page">
      {/* Top Bar with Navigation & Memory */}
      <div className="travel-top-bar">
        <BackHomeButton label="Back to Home" className="travel-back-home-btn" />
        
        <div className="top-bar-right">
          {userPreferences.preferredTransport && (
            <div className="user-memory-pill" title="Travel Memory Saved">
              <FiHeart className="heart-icon" />
              <span>{userPreferences.preferredTransport.join(", ")} • Min {userPreferences.minHotelRating}★ Hotels</span>
            </div>
          )}
          <span className="concierge-status-pill">
            <FiShield className="shield-icon" /> AI Travel Concierge Active
          </span>
        </div>
      </div>

      {/* Hero Concierge Banner */}
      <div className="concierge-hero-card">
        <div className="hero-badge">
          <FiNavigation /> Vedix AI Concierge
        </div>
        <h1>AI Travel Assistant & Comparison Hub</h1>
        <p>Compare buses, flights, trains, cabs, stays, and budget plans in one unified AI workspace.</p>
      </div>

      {/* Input Mode Selector Bar */}
      <div className="input-mode-switcher-bar">
        <button
          className={`mode-btn ${activeInputMode === "chat" ? "active" : ""}`}
          onClick={() => setActiveInputMode("chat")}
        >
          <FiCompass /> 💬 Conversational AI Concierge
        </button>
        <button
          className={`mode-btn ${activeInputMode === "form" ? "active" : ""}`}
          onClick={() => setActiveInputMode("form")}
        >
          <FiEdit3 /> ⚡ Instant Finder Form
        </button>
      </div>

      {/* Input Section */}
      <div className="input-section-container">
        {activeInputMode === "chat" ? (
          <TravelChat
            onSendMessage={handleChatSend}
            messages={messages}
            isLoading={isLoading}
            onQuickDestinationSelect={(dest) => handleChatSend(dest.query)}
          />
        ) : (
          <TravelForm onSubmitForm={handleFormSubmit} initialParams={planData?.userParams || {}} isLoading={isLoading} />
        )}
      </div>

      {/* Pipeline Progress Indicator */}
      <div className="progress-section-container">
        <AgentProgressTracker agentLogs={planData?.agentLogs || []} isProcessing={isLoading} />
      </div>

      {/* Results Dashboard */}
      {planData && (
        <div className="plan-results-dashboard">
          {/* Destination Hero Card */}
          <div
            className="destination-visual-hero"
            style={{ backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.95) 100%), url(${media.heroImage})` }}
          >
            <div className="hero-top-badges">
              <span className="dest-weather-chip">☀️ {media.weather}</span>
              <span className="dest-time-chip">🗓️ Best Time: {media.bestTime}</span>
            </div>

            <div className="hero-main-content">
              <div className="hero-title-box">
                <span className="hero-subtitle">📍 {planData.userParams.origin} → {planData.userParams.destination}</span>
                <h2>{media.name || planData.userParams.destination}</h2>
                <p>{media.tagline}</p>
              </div>

              <div className="hero-stats-row">
                <div className="hero-stat-card">
                  <span className="stat-num">{planData.userParams.travelers}</span>
                  <span className="stat-desc">Travelers ({planData.userParams.roomsCount} Room)</span>
                </div>
                <div className="hero-stat-card">
                  <span className="stat-num">₹{planData.userParams.budget.toLocaleString()}</span>
                  <span className="stat-desc">Target Budget</span>
                </div>
                <div className="hero-stat-card">
                  <span className="stat-num">₹{planData.budgetAnalysis.currentTotalCost.toLocaleString()}</span>
                  <span className="stat-desc">Est Total Cost</span>
                </div>
              </div>

              <div className="hero-action-box">
                <button className="btn-confirm-booking-hero" onClick={() => setShowBookingModal(true)}>
                  <FiShield /> Confirm & Proceed to Booking
                </button>
              </div>
            </div>
          </div>

          {/* Scenario Planner */}
          <WhatIfScenarioPanel
            onRunScenario={handleRunScenario}
            isLoading={isLoading}
            scenarioExplanation={planData.scenarioExplanation}
          />

          {/* Navigation Tabs */}
          <div className="dashboard-tabs-bar">
            <button
              className={`tab-item ${activeDashboardTab === "transport" ? "active" : ""}`}
              onClick={() => setActiveDashboardTab("transport")}
            >
              🚌 Transport Options ({planData.transportOptions.length})
            </button>
            <button
              className={`tab-item ${activeDashboardTab === "stay" ? "active" : ""}`}
              onClick={() => setActiveDashboardTab("stay")}
            >
              🏨 Stays ({planData.stayOptions.length})
            </button>
            <button
              className={`tab-item ${activeDashboardTab === "itinerary" ? "active" : ""}`}
              onClick={() => setActiveDashboardTab("itinerary")}
            >
              🗺️ Day-by-Day Itinerary
            </button>
            <button
              className={`tab-item ${activeDashboardTab === "budget" ? "active" : ""}`}
              onClick={() => setActiveDashboardTab("budget")}
            >
              💰 Budget Optimizer {planData.budgetAnalysis.isOverBudget && <span className="tab-warn">!</span>}
            </button>
            <button
              className={`tab-item ${activeDashboardTab === "summary" ? "active" : ""}`}
              onClick={() => setActiveDashboardTab("summary")}
            >
              📄 AI Trip Summary
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="dashboard-content-body">
            {activeDashboardTab === "transport" && (
              <TransportComparison
                transportOptions={planData.transportOptions}
                selectedTransport={selectedTransport}
                onSelectTransport={handleSelectTransport}
              />
            )}

            {activeDashboardTab === "stay" && (
              <StayComparison
                stayOptions={planData.stayOptions}
                selectedStay={selectedStay}
                onSelectStay={handleSelectStay}
              />
            )}

            {activeDashboardTab === "itinerary" && (
              <ItineraryView itinerary={planData.itinerary} />
            )}

            {activeDashboardTab === "budget" && (
              <BudgetOptimizerCard
                budgetAnalysis={planData.budgetAnalysis}
                onApplyAlternative={handleApplyAlternative}
              />
            )}

            {activeDashboardTab === "summary" && (
              <div className="trip-summary-document-card">
                <div className="doc-header">
                  <h3><FiFileText /> Complete AI Travel Plan Summary</h3>
                  <p>Generated by lexi.AI Travel Manager Agent on {new Date().toLocaleDateString()}</p>
                </div>

                <div className="summary-grid-2">
                  <div className="summary-section">
                    <h4>📍 Trip Overview</h4>
                    <p><strong>Origin:</strong> {planData.userParams.origin}</p>
                    <p><strong>Destination:</strong> {planData.userParams.destination}</p>
                    <p><strong>Departure:</strong> {planData.userParams.departureDate}</p>
                    <p><strong>Travelers:</strong> {planData.userParams.travelers} Persons ({planData.userParams.roomsCount} Room)</p>
                    <p><strong>Target Budget:</strong> ₹{planData.userParams.budget.toLocaleString()}</p>
                  </div>

                  <div className="summary-section">
                    <h4>🚌 Recommended Transport</h4>
                    {selectedTransport ? (
                      <div>
                        <p><strong>{selectedTransport.mode}:</strong> {selectedTransport.operator || selectedTransport.airline || selectedTransport.trainName || selectedTransport.provider}</p>
                        <p><strong>Timing:</strong> {selectedTransport.departureTime} - {selectedTransport.arrivalTime} ({selectedTransport.duration})</p>
                        <p><strong>Price:</strong> ₹{selectedTransport.totalPrice.toLocaleString()}</p>
                        <p className="reason-text"><strong>Why:</strong> {selectedTransport.whyRecommended}</p>
                      </div>
                    ) : <p>No transport selected</p>}
                  </div>
                </div>

                <div className="summary-grid-2">
                  <div className="summary-section">
                    <h4>🏨 Recommended Stay</h4>
                    {selectedStay ? (
                      <div>
                        <p><strong>Name:</strong> {selectedStay.name} ({selectedStay.badge || selectedStay.category})</p>
                        <p><strong>Rating:</strong> ⭐ {selectedStay.rating} / 5</p>
                        <p><strong>Location:</strong> {selectedStay.location}</p>
                        <p><strong>Price:</strong> ₹{selectedStay.totalPrice.toLocaleString()} ({selectedStay.nights} nights)</p>
                      </div>
                    ) : <p>No stay selected</p>}
                  </div>

                  <div className="summary-section">
                    <h4>💰 Budget Summary</h4>
                    <p><strong>Target Budget:</strong> ₹{planData.budgetAnalysis.totalBudget.toLocaleString()}</p>
                    <p><strong>Total Estimated Cost:</strong> ₹{planData.budgetAnalysis.currentTotalCost.toLocaleString()}</p>
                    <p><strong>Status:</strong> {planData.budgetAnalysis.isOverBudget ? `Over budget by ₹${planData.budgetAnalysis.overAmount.toLocaleString()}` : `Within budget with ₹${planData.budgetAnalysis.remainingBudget.toLocaleString()} buffer`}</p>
                  </div>
                </div>

                <div className="summary-footer-actions">
                  <button className="btn-primary-gradient" onClick={() => setShowBookingModal(true)}>
                    Confirm & Proceed to Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Safety Modal */}
      <BookingSafetyModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        selectedTransport={selectedTransport}
        selectedStay={selectedStay}
        userParams={planData?.userParams}
        budgetAnalysis={planData?.budgetAnalysis}
      />
    </div>
  );
};

export default TravelAgent;
