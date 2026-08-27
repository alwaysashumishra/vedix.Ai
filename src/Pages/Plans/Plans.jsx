import React, { useEffect, useMemo, useState } from "react";
import { FiCheck, FiClock, FiCreditCard, FiLock, FiStar, FiZap } from "react-icons/fi";
import axios from "axios";
import BackHomeButton from "../../components/BackHomeButton/BackHomeButton";
import PaymentModal from "../../components/PaymentModal/PaymentModal";
import { API_BASE } from "../../config/apiConfig";
import { getPublicConfig } from "../../config/publicConfig";
import "./Plans.css";

const PAYMENTS_API = `${API_BASE}/payments`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const buildPlans = (siteConfig = {}) => [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    badge: "Current starter",
    icon: FiLock,
    tone: "free",
    description: "For trying Vedix AI with basic daily limits.",
    features: [
      `${siteConfig.freeDailyLimit || 5} AI prompts per day`,
      "1 resume analysis per week",
      "Basic Explore news feed",
      "Limited image upload prompts",
      "Community-level speed",
    ],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: `₹${siteConfig.proPlanPrice || 199}`,
    period: "per month",
    badge: "Most useful",
    icon: FiZap,
    tone: "pro",
    description: "For students and job seekers who use AI every week.",
    features: [
      "100 AI prompts per day",
      "20 resume analyses per month",
      "Role-based job and internship links",
      "Research paper summaries",
      "Faster response priority",
    ],
    cta: "Upgrade via UPI QR",
    featured: true,
  },
  {
    name: "Premium",
    price: `₹${siteConfig.premiumPlanPrice || 499}`,
    period: "per month",
    badge: "Power plan",
    icon: FiStar,
    tone: "premium",
    description: "For serious career prep, research, and regular AI workflows.",
    features: [
      "Unlimited AI prompts",
      "Unlimited resume analyses",
      "Advanced career recommendations",
      "Priority AI processing",
      "Early access to new tools",
    ],
    cta: "Go Premium via UPI QR",
  },
];

const Plans = ({ profile, setShowLogin }) => {
  const [siteConfig, setSiteConfig] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userPayments, setUserPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  const activePlan = profile?.plan || "Free";

  useEffect(() => {
    getPublicConfig()
      .then(setSiteConfig)
      .catch(() => setSiteConfig({}));
  }, []);

  const fetchPayments = async () => {
    if (!profile) return;
    setLoadingPayments(true);
    try {
      const response = await axios.get(`${PAYMENTS_API}/my-payments`, {
        headers: getAuthHeaders(),
      });
      if (response.data.success) {
        setUserPayments(response.data.payments || []);
      }
    } catch (err) {
      console.error("Failed to load payments history", err);
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [profile]);

  const plans = useMemo(() => buildPlans(siteConfig), [siteConfig]);

  const handlePlanClick = (plan) => {
    if (!profile) {
      setShowLogin(true);
      return;
    }

    if (plan.name === "Free") {
      alert("Free plan is currently active on your account.");
      return;
    }

    if (activePlan === plan.name) {
      alert(`You are already subscribed to the ${plan.name} plan!`);
      return;
    }

    setSelectedPlan(plan);
  };

  const handlePaymentSubmitted = () => {
    fetchPayments();
  };

  return (
    <main className="plans-page">
      <BackHomeButton className="plans-home-link" />
      
      <section className="plans-hero">
        <span className="plans-kicker">Subscription & Payments</span>
        <h1>Choose the right Vedix AI plan</h1>
        <p>
          Start free with daily limits, or upgrade instantly via UPI QR code for high limits, priority AI processing, and advanced features.
        </p>

        {profile && (
          <div className="current-plan-banner">
            <span>Your Current Plan: <strong>{activePlan}</strong></span>
            {activePlan !== "Free" && <span className="active-badge">Active Plan</span>}
          </div>
        )}
      </section>

      <section className="plans-grid">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = activePlan === plan.name;

          return (
            <article
              key={plan.name}
              className={`plan-card ${plan.featured ? "featured" : ""} ${isCurrent ? "current" : ""}`}
            >
              <div className="plan-topline">
                <div className={`plan-icon ${plan.tone}`}>
                  <Icon />
                </div>
                <span>{isCurrent ? "Active Plan" : plan.badge}</span>
              </div>

              <div className="plan-heading">
                <h2>{plan.name}</h2>
                <p>{plan.description}</p>
              </div>

              <div className="plan-price">
                <strong>{plan.price}</strong>
                <span>{plan.period}</span>
              </div>

              <button
                type="button"
                className={`plan-cta ${isCurrent ? "btn-current" : ""}`}
                onClick={() => handlePlanClick(plan)}
                disabled={isCurrent}
              >
                {plan.name === "Free" ? (
                  <FiLock />
                ) : isCurrent ? (
                  <FiCheck />
                ) : (
                  <FiCreditCard />
                )}
                {isCurrent ? "Current Plan" : plan.cta}
              </button>

              <ul className="plan-features">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <FiCheck />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>

      {/* User Payments History Section */}
      {profile && userPayments.length > 0 && (
        <section className="user-payments-history">
          <h2><FiClock /> Payment Requests & History</h2>
          <div className="payments-history-table">
            <div className="table-header">
              <span>Plan</span>
              <span>Amount</span>
              <span>Transaction ID / UTR</span>
              <span>Date</span>
              <span>Status</span>
            </div>
            {userPayments.map((pmt) => (
              <div key={pmt._id} className="table-row">
                <strong className="pmt-plan">{pmt.plan} Plan</strong>
                <span>₹{pmt.amount}</span>
                <span className="pmt-txid">{pmt.transactionId}</span>
                <span>{new Date(pmt.createdAt).toLocaleDateString()}</span>
                <span className={`status-badge ${pmt.status}`}>
                  {pmt.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="plans-note">
        <h2>Instant UPI QR Payments</h2>
        <p>
          Pay securely using Google Pay, PhonePe, Paytm, BHIM, or any UPI app by scanning the payment QR code and submitting your 12-digit UTR transaction ID.
        </p>
      </section>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          profile={profile}
          siteConfig={siteConfig}
          onClose={() => setSelectedPlan(null)}
          onPaymentSubmitted={handlePaymentSubmitted}
        />
      )}
    </main>
  );
};

export default Plans;
