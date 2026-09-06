import React from "react";
import { FiDollarSign, FiAlertTriangle, FiCheck, FiTrendingDown, FiPieChart } from "react-icons/fi";

const BudgetOptimizerCard = ({ budgetAnalysis = null, onApplyAlternative }) => {
  if (!budgetAnalysis) return null;

  const { totalBudget, currentTotalCost, isOverBudget, overAmount, remainingBudget, allocatedBreakdown = [], savingsAlternatives = [] } = budgetAnalysis;

  const percentageUsed = Math.min(100, Math.round((currentTotalCost / totalBudget) * 100));

  return (
    <div className="budget-optimizer-card">
      <div className="budget-header-row">
        <div>
          <h3><FiPieChart /> Budget Optimization Agent</h3>
          <p>Automatic budget allocation & real-time cost tracking against your target of ₹{totalBudget.toLocaleString()}</p>
        </div>
        <div className={`budget-status-pill ${isOverBudget ? "over-budget" : "within-budget"}`}>
          {isOverBudget ? <><FiAlertTriangle /> Over Budget by ₹{overAmount.toLocaleString()}</> : <><FiCheck /> Within Budget (₹{remainingBudget.toLocaleString()} left)</>}
        </div>
      </div>

      {/* Main Budget Bar */}
      <div className="budget-progress-container">
        <div className="budget-metric-row">
          <span>Target Budget: <strong>₹{totalBudget.toLocaleString()}</strong></span>
          <span>Estimated Total Trip Cost: <strong className={isOverBudget ? "text-danger" : "text-success"}>₹{currentTotalCost.toLocaleString()}</strong> ({percentageUsed}%)</span>
        </div>
        <div className="progress-track">
          <div
            className={`progress-fill ${isOverBudget ? "fill-danger" : "fill-success"}`}
            style={{ width: `${percentageUsed}%` }}
          ></div>
        </div>
      </div>

      {/* Over Budget Alert & Alternatives */}
      {isOverBudget && (
        <div className="over-budget-warning-box">
          <div className="warning-banner">
            <FiAlertTriangle className="warn-icon" />
            <div>
              <h4>Your current travel plan is ₹{overAmount.toLocaleString()} over budget</h4>
              <p>Apply one of the AI Travel Agent's 1-click alternatives below to immediately bring your trip within budget:</p>
            </div>
          </div>

          <div className="alternatives-grid">
            {savingsAlternatives.map((alt) => (
              <div key={alt.id} className="alternative-card">
                <div className="alt-title-row">
                  <span className="alt-icon"><FiTrendingDown /></span>
                  <div>
                    <h5>{alt.title}</h5>
                    <p>{alt.description}</p>
                  </div>
                </div>
                <div className="alt-action-row">
                  <span className="savings-badge">Save ₹{alt.savingsAmount.toLocaleString()}</span>
                  <button className="btn-apply-alt" onClick={() => onApplyAlternative(alt)}>
                    {alt.actionLabel}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Breakdown Rows */}
      <div className="breakdown-section">
        <h4>Itemized Expense Allocation Breakdown</h4>
        <div className="breakdown-grid">
          {allocatedBreakdown.map((item, idx) => {
            const isHigh = item.actual > item.allocated;
            return (
              <div key={idx} className="breakdown-item-box">
                <div className="item-head">
                  <span className="cat-icon">{item.icon}</span>
                  <span className="cat-name">{item.category}</span>
                </div>
                <div className="item-costs">
                  <span className="cost-actual">₹{item.actual.toLocaleString()}</span>
                  <span className="cost-allocated">Allocated: ₹{item.allocated.toLocaleString()}</span>
                </div>
                {isHigh && <span className="allocated-warn">High allocation</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetOptimizerCard;
