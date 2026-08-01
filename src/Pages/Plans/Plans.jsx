import React, { useEffect, useMemo, useState } from "react";
import { FiCheck, FiCreditCard, FiLock, FiStar, FiZap } from "react-icons/fi";
import BackHomeButton from "../../components/BackHomeButton/BackHomeButton";
import "./Plans.css";
import { getPublicConfig } from "../../config/publicConfig";

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
    cta: "Upgrade to Pro",
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
    cta: "Go Premium",
  },
];

const Plans = ({ profile, setShowLogin }) => {
  const [siteConfig, setSiteConfig] = useState({});

  useEffect(() => {
    getPublicConfig()
      .then(setSiteConfig)
      .catch(() => setSiteConfig({}));
  }, []);

  const plans = useMemo(() => buildPlans(siteConfig), [siteConfig]);
  const handlePlanClick = (plan) => {
    if (!profile) {
      setShowLogin(true);
      return;
    }

    if (plan.name === "Free") {
      alert("Free plan is active for your account.");
      return;
    }

    alert(`${plan.name} checkout will be connected here.`);
  };

  return (
    <main className="plans-page">
      <BackHomeButton className="plans-home-link" />
      <section className="plans-hero">
        <span className="plans-kicker">Subscription plans</span>
        <h1>Choose the right Vedix AI plan</h1>
        <p>
          Start free with limited features, then upgrade when you need more AI prompts,
          resume analysis, research tools, and career recommendations.
        </p>
      </section>

      <section className="plans-grid">
        {plans.map((plan) => {
          const Icon = plan.icon;

          return (
            <article
              key={plan.name}
              className={`plan-card ${plan.featured ? "featured" : ""}`}
            >
              <div className="plan-topline">
                <div className={`plan-icon ${plan.tone}`}>
                  <Icon />
                </div>
                <span>{plan.badge}</span>
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
                className="plan-cta"
                onClick={() => handlePlanClick(plan)}
              >
                <FiCreditCard />
                {plan.cta}
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

      <section className="plans-note">
        <h2>Free users get started instantly</h2>
        <p>
          Paid checkout is ready to connect with Razorpay, Stripe, or any payment gateway
          when you want to enable real purchases.
        </p>
      </section>
    </main>
  );
};

export default Plans;



