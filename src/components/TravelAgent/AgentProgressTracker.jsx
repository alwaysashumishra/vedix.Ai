import React from "react";
import { FiCheckCircle, FiLoader } from "react-icons/fi";

const AgentProgressTracker = ({ agentLogs = [], isProcessing = false }) => {
  const steps = [
    { title: "Understanding requirements", icon: "🧠" },
    { title: "Searching transport", icon: "🚌" },
    { title: "Searching stays", icon: "🏨" },
    { title: "Finding attractions", icon: "🎟️" },
    { title: "Comparing options", icon: "📊" },
    { title: "Optimizing budget", icon: "💰" },
    { title: "Building itinerary", icon: "🗺️" },
  ];

  const getStepStatus = (stepTitle) => {
    if (!isProcessing && agentLogs.length > 0) return "completed";
    const found = agentLogs.find((l) => l.step.toLowerCase() === stepTitle.toLowerCase());
    if (found) return "completed";
    if (isProcessing && agentLogs.length > 0 && agentLogs[agentLogs.length - 1].step.toLowerCase() === stepTitle.toLowerCase()) {
      return "active";
    }
    return "pending";
  };

  return (
    <div className="agent-progress-card">
      <div className="progress-header">
        <span className="live-pulse"></span>
        <h4>Travel Orchestrator Agent Pipeline</h4>
      </div>
      <div className="progress-steps-row">
        {steps.map((step, idx) => {
          const status = getStepStatus(step.title);
          return (
            <div key={idx} className={`step-badge ${status}`}>
              <span className="step-icon">{step.icon}</span>
              <span className="step-name">{step.title}</span>
              {status === "completed" && <FiCheckCircle className="status-check" />}
              {status === "active" && <FiLoader className="status-spinner" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentProgressTracker;
