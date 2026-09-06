import React, { useState } from "react";
import { FiHelpCircle, FiZap, FiRefreshCw, FiArrowRight } from "react-icons/fi";

const WhatIfScenarioPanel = ({ onRunScenario, isLoading = false, scenarioExplanation = "" }) => {
  const [customQuery, setCustomQuery] = useState("");

  const presetScenarios = [
    { label: "What if budget becomes ₹25,000?", type: "budget", value: 25000 },
    { label: "What if there are 5 people instead of 3?", type: "travelers", value: 5 },
    { label: "What if I want to reach before 10 AM?", type: "arrivalTime", value: "10 AM" },
    { label: "What if I prefer comfort instead of cheapest?", type: "comfort", value: "comfort" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customQuery.trim() || isLoading) return;
    onRunScenario({ promptText: customQuery.trim() });
    setCustomQuery("");
  };

  return (
    <div className="what-if-panel-card">
      <div className="panel-header">
        <FiHelpCircle className="panel-icon" />
        <div>
          <h4>Interactive "What-If" Scenario Planner</h4>
          <p>Instantly recalculate transportation, stays, budget allocation, and schedules under different trip scenarios.</p>
        </div>
      </div>

      {/* Preset Quick Scenario Buttons */}
      <div className="preset-buttons-grid">
        {presetScenarios.map((sc, i) => (
          <button
            key={i}
            className="preset-sc-btn"
            disabled={isLoading}
            onClick={() => onRunScenario({ scenarioType: sc.type, scenarioValue: sc.value, promptText: sc.label })}
          >
            <FiZap className="zap-icon" /> {sc.label}
          </button>
        ))}
      </div>

      {/* Custom Natural Language Input */}
      <form className="scenario-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="e.g. 'What if I want a 5-star hotel?' or 'What if we travel by Train?'"
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" className="btn-run-scenario" disabled={!customQuery.trim() || isLoading}>
          {isLoading ? <FiRefreshCw className="spin-icon" /> : <>Recalculate <FiArrowRight /></>}
        </button>
      </form>

      {/* Explanation output if available */}
      {scenarioExplanation && (
        <div className="scenario-explanation-box">
          🤖 <strong>Scenario Result:</strong> {scenarioExplanation}
        </div>
      )}
    </div>
  );
};

export default WhatIfScenarioPanel;
