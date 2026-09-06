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
import { getApiBaseUrl } from "../../config/apiConfig";
import { FiNavigation, FiCompass, FiEdit3, FiPieChart, FiCalendar, FiCheckCircle, FiShield, FiHeart, FiFileText } from "react-icons/fi";

const API_BASE = getApiBaseUrl();

const TravelAgent = ({ profile }) => {
  const [activeInputMode, setActiveInputMode] = useState("chat"); // 'chat' or 'form'
  const [activeDashboardTab, setActiveDashboardTab] = useState("transport"); // 'transport', 'stay', 'itinerary', 'budget', 'activities', 'summary'
  const [isLoading, setIsLoading] = useState(false);

  // Core Travel Plan State
  const [planData, setPlanData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [selectedStay, setSelectedStay] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [userPreferences, setUserPreferences] = useState({});

  // Load User Preferences Memory on Mount
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

  // Save Travel Memory
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

  // API Call Handler
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
      // Fallback offline mock plan generator if backend server is offline
      generateOfflineFallbackPlan(payload.promptText || payload.explicitForm?.destination);
    } finally {
      setIsLoading(false);
    }
  };

  const generateOfflineFallbackPlan = (queryStr) => {
    alert("Notice: Connected via local offline agent simulator.");
    // Emergency offline plan fallback
  };

  // Chat message submit
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

  // Form submit
  const handleFormSubmit = (formData) => {
    fetchTravelPlan({ explicitForm: formData });
  };

  // Transport choice change
  const handleSelectTransport = (transport) => {
    setSelectedTransport(transport);
    if (planData) {
      // Recalculate budget optimization with new choice
      fetchTravelPlan({
        promptText: planData.userParams.naturalLanguageSummary,
        explicitForm: planData.userParams,
        selectedTransportId: transport.id,
        selectedStayId: selectedStay?.id,
      });
    }
  };

  // Stay choice change
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

  // What-if scenario execution
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

  // 1-Click Budget Alternative Applier
  const handleApplyAlternative = (alt) => {
    if (alt.replacementMode) {
      const altTransport = planData.transportOptions.find((t) => t.mode === alt.replacementMode);
      if (altTransport) handleSelectTransport(altTransport);
    } else if (alt.targetCategory) {
      const altStay = planData.stayOptions.find((s) => s.category === alt.targetCategory);
      if (altStay) handleSelectStay(altStay);
    }
  };

  return (
    <div className="travel-agent-page">
      {/* Page Title & Navigation Header */}
      <header className="page-header-banner">
        <div className="title-left">
          <div className="brand-badge-row">
            <span className="brand-pill"><FiNavigation /> lexi.AI Platform</span>
            <span className="agent-pill">Autonomous Orchestrator</span>
          </div>
          <h1>AI Travel Agent & Comparison Engine</h1>
          <p>Describe your trip once. Our multi-agent network searches, compares, optimizes, and plans your entire journey.</p>
        </div>

        {/* User Preferences Memory Indicator */}
        {userPreferences.preferredTransport && (
          <div className="memory-badge-card">
            <span className="memory-title"><FiHeart /> Personal Memory Active</span>
            <p>User prefers: {userPreferences.preferredTransport.join(", ")} • Min {userPreferences.minHotelRating}★ Hotels • Budget ~₹{userPreferences.typicalBudget?.toLocaleString()}</p>
          </div>
        )}
      </header>

      {/* Main Input Mode Selector (Conversational Chat vs Structured Form) */}
      <div className="input-mode-switcher-bar">
        <button
          className={`mode-btn ${activeInputMode === "chat" ? "active" : ""}`}
          onClick={() => setActiveInputMode("chat")}
        >
          <FiCompass /> Conversational AI Assistant
        </button>
        <button
          className={`mode-btn ${activeInputMode === "form" ? "active" : ""}`}
          onClick={() => setActiveInputMode("form")}
        >
          <FiEdit3 /> Structured Search Form
        </button>
      </div>

      {/* Input Section */}
      <div className="input-section-container">
        {activeInputMode === "chat" ? (
          <TravelChat onSendMessage={handleChatSend} messages={messages} isLoading={isLoading} />
        ) : (
          <TravelForm onSubmitForm={handleFormSubmit} initialParams={planData?.userParams || {}} isLoading={isLoading} />
        )}
      </div>

      {/* Execution Progress Visualizer */}
      <div className="progress-section-container">
        <AgentProgressTracker agentLogs={planData?.agentLogs || []} isProcessing={isLoading} />
      </div>

      {/* Main Dashboard & Results (Rendered when plan data exists) */}
      {planData && (
        <div className="plan-results-dashboard">
          {/* Trip Summary Top Banner */}
          <div className="trip-overview-banner">
            <div className="overview-route-info">
              <h2>📍 {planData.userParams.origin} → {planData.userParams.destination}</h2>
              <p>📅 {planData.userParams.departureDate} to {planData.userParams.returnDate || "N/A"} • 👥 {planData.userParams.travelers} Travelers</p>
            </div>
            <div className="overview-budget-info">
              <div className="stat-label">Allocated Budget</div>
              <div className="stat-value">₹{planData.userParams.budget.toLocaleString()}</div>
              <div className="stat-sub">Est Cost: ₹{planData.budgetAnalysis.currentTotalCost.toLocaleString()}</div>
            </div>
            <div className="overview-action">
              <button className="btn-confirm-booking-hero" onClick={() => setShowBookingModal(true)}>
                <FiShield /> Confirm & Proceed to Booking
              </button>
            </div>
          </div>

          {/* Interactive What-If Scenario Panel */}
          <WhatIfScenarioPanel
            onRunScenario={handleRunScenario}
            isLoading={isLoading}
            scenarioExplanation={planData.scenarioExplanation}
          />

          {/* Dashboard Navigation Tabs */}
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
