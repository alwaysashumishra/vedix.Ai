import React, { useState, useRef, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  FiArrowUpRight,
  FiArrowRight,
  FiZap,
  FiCpu,
  FiFileText,
  FiBookOpen,
  FiCompass,
  FiUsers,
  FiSend,
  FiCheckCircle,
  FiShield,
  FiGlobe,
  FiUser,
  FiLock,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiChevronLeft,
  FiChevronRight,
  FiBell,
  FiLayers,
  FiBarChart2,
  FiCreditCard,
  FiStar,
} from "react-icons/fi";
import { assets } from "../../assets/assets";
import { ThemeContext } from "../../context/ThemeContext";
import { getPublicConfig } from "../../config/publicConfig";
import PaymentModal from "../../components/PaymentModal/PaymentModal";
import aiAgentHero from "../../assets/ai_agent_hero.jpg";
import aiAgentPersona from "../../assets/ai_agent_persona.jpg";
import "./LandingPage.css";

gsap.registerPlugin(ScrollTrigger);

const QUICK_PROMPTS = [
  "Explain Quantum Computing simply",
  "How does ATS resume scanner work?",
  "How to structure a research paper?",
  "Plan a 3-day trip to Tokyo",
];

const TRUSTED_INNOVATORS = [
  { name: "redbus", tag: "redBus" },
  { name: "abhibus", tag: "AbhiBus" },
  { name: "irctc", tag: "IRCTC Trains" },
  { name: "gemini", tag: "Google Gemini 3.5" },
  { name: "makemytrip", tag: "MakeMyTrip" },
  { name: "uber", tag: "Uber Cabs" },
  { name: "ola", tag: "Ola" },
];

const TESTIMONIALS = [
  {
    name: "Aakash Verma",
    role: "Travel Consultant & Explorer",
    company: "Travel Community",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    quote: "Vedix's Autonomous Travel Agent compared bus fares across redBus and AbhiBus in real time, auto-filled my boarding point, and located my exact coach with zero effort. Saved 30% on my Delhi to Jaipur journey!",
  },
  {
    name: "Dr. Marcus Vance",
    role: "Lead Research Fellow at BioMatrix Labs",
    company: "BioMatrix",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    quote: "The Research Paper Analyzer in Vedix synthesized a 48-page technical paper into rigorous methodology notes and viva questions in under 15 seconds. For our post-doctoral research group, it has become an indispensable daily collaborator.",
  },
  {
    name: "Elena Rostova",
    role: "VP of People at TalentScale",
    company: "TalentScale",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
    quote: "Vedix's Resume ATS agent accurately highlighted missing technical skill strings across hundreds of candidate submissions. Our hiring turnaround dropped from weeks to hours with zero loss in vetting quality.",
  },
];

const VEDIX_SOLUTIONS = [
  {
    title: "Vedix 3.5 Pro Reasoning Chat",
    role: "Multi-Model Neural Synthesis",
    desc: "Seamlessly switch between Google Gemini Pro, Flash, and Thinking engines for deep mathematical proofs, code generation, and context-aware chat.",
    icon: <FiCpu />,
    tag: "Multi-Model 3.5",
  },
  {
    title: "Resume ATS Diagnostic Agent",
    role: "Smart ATS Matching & Score Engine",
    desc: "Parse PDF and DOCX resumes instantly. Identify missing industry keywords, extract scoring metrics, and unlock direct high-match job opportunities.",
    icon: <FiFileText />,
    tag: "ATS Algorithm",
  },
  {
    title: "Academic Paper Analyzer",
    role: "Literature Decomposition & Viva Notes",
    desc: "Upload complex peer-reviewed PDFs. Generate executive methodology summaries, extract mathematical formulas, and practice defense questions.",
    icon: <FiBookOpen />,
    tag: "Research Engine",
  },
  {
    title: "Real-Time News Telemetry",
    role: "24/7 Global Intelligence Stream",
    desc: "Track breaking tech trends, world category feeds, and real-time live cricket scorecards with multi-lingual instant summarization.",
    icon: <FiCompass />,
    tag: "Live Feed 24/7",
  },
  {
    title: "Autonomous Travel Agent",
    role: "Itinerary & Flight Budgeting",
    desc: "Draft multi-day custom itineraries, discover top-rated accommodations, and calculate real-time flight budget projections in seconds.",
    icon: <FiGlobe />,
    tag: "Travel AI",
  },
  {
    title: "Study Vault & Team Workspaces",
    role: "Collaborative Intelligence & Notes",
    desc: "Save important Q&As directly into your encrypted note vault, organize study groups, and export formatted insights directly to WhatsApp.",
    icon: <FiUsers />,
    tag: "Team Vault",
  },
];

const buildPlans = (siteConfig = {}) => [
  {
    name: "Free",
    price: "₹0",
    priceNum: "0",
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
    priceNum: `${siteConfig.proPlanPrice || 199}`,
    period: "month",
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
    priceNum: `${siteConfig.premiumPlanPrice || 499}`,
    period: "month",
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

const LandingPage = ({ setShowLogin, setProfile, profile }) => {
  const navigate = useNavigate();
  const { theme = "light", toggleTheme } = useContext(ThemeContext) || {};
  const isLight = theme === "light";

  const [siteConfig, setSiteConfig] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);

  const activePlan = profile?.plan || "Free";
  const plans = useMemo(() => buildPlans(siteConfig), [siteConfig]);

  useEffect(() => {
    getPublicConfig()
      .then(setSiteConfig)
      .catch(() => setSiteConfig({}));
  }, []);

  const handlePlanClick = (plan) => {
    if (!profile) {
      navigate("/login");
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

  // Lenis Smooth Scroll Setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      infinite: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  // Active Nav Link State & Mobile Menu Toggle State
  const [activeNav, setActiveNav] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      const solutionsEl = document.getElementById("solutions");
      const featuresEl = document.getElementById("features");
      const personasEl = document.getElementById("personas");
      const testimonialsEl = document.getElementById("testimonials");
      const pricingEl = document.getElementById("pricing");
      const contactEl = document.getElementById("contact");

      if (contactEl && scrollPosition >= contactEl.offsetTop) {
        setActiveNav("contact");
      } else if (pricingEl && scrollPosition >= pricingEl.offsetTop) {
        setActiveNav("pricing");
      } else if (testimonialsEl && scrollPosition >= testimonialsEl.offsetTop) {
        setActiveNav("testimonials");
      } else if (personasEl && scrollPosition >= personasEl.offsetTop) {
        setActiveNav("personas");
      } else if (featuresEl && scrollPosition >= featuresEl.offsetTop) {
        setActiveNav("features");
      } else if (solutionsEl && scrollPosition >= solutionsEl.offsetTop) {
        setActiveNav("solutions");
      } else {
        setActiveNav("home");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mini Chat State inside Hero
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: "Hello! I am Vedix.AI Agent Core. Type a question or select a prompt below to see autonomous reasoning in real-time.",
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef(null);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, chatLoading]);

  const handleSendMiniChat = async (promptToSend) => {
    const prompt = (promptToSend || inputPrompt).trim();
    if (!prompt || chatLoading) return;

    const userMsgId = Date.now();
    setChatMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user", text: prompt },
    ]);

    if (!promptToSend) {
      setInputPrompt("");
    }
    setChatLoading(true);

    try {
      let replyText = "";
      if (prompt.toLowerCase().includes("quantum")) {
        replyText = "Vedix Reasoning: Quantum computing leverages superposition and entanglement to execute exponentially parallelized matrix states. Classical cryptosystems are directly surpassed by quantum Shor's and Grover's search algorithms.";
      } else if (prompt.toLowerCase().includes("ats") || prompt.toLowerCase().includes("resume")) {
        replyText = "Vedix ATS Agent: ATS engines index parsing hierarchies, exact skill strings, and bullet metrics. Vedix.AI Resume Agent scores formatting compliance, missing high-impact tech tags, and direct job relevance.";
      } else if (prompt.toLowerCase().includes("research")) {
        replyText = "Vedix Research Agent: A robust research paper requires formal Problem Formulation, Related Work Taxonomy, Empirical Benchmarks, and Threat-to-Validity analysis. Try Vedix Research Agent for instant multi-page PDF decomposition!";
      } else if (prompt.toLowerCase().includes("tokyo") || prompt.toLowerCase().includes("trip")) {
        replyText = "Vedix Travel Agent: Generated 3-Day Tokyo Itinerary: Day 1 (Shinjuku & Shibuya Crossing), Day 2 (Asakusa Senso-ji & Akihabara), Day 3 (Mt. Fuji express & Ginza culinary tour). Launch Travel Agent for live flight and hotel budgeting!";
      } else {
        replyText = `Vedix.AI Intelligence: "${prompt}"\n\nVedix.AI coordinates multi-model reasoning, document indexing, and enterprise workflows. Click 'Start Now' or 'Sign In' to unlock full unlimited sessions.`;
      }

      setChatMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", text: replyText },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: "Vedix.AI Neural Engine active. Click 'Get Started' to access full model selection and file uploads.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactForm({ name: "", email: "", subject: "", message: "" });
    }, 4000);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentTestimonial = TESTIMONIALS[testimonialIdx];

  const handleNextTestimonial = () => {
    setTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrevTestimonial = () => {
    setTestimonialIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <div
      className={`landing-page ${theme || "light"}`}
      data-theme={theme || "light"}
    >
      {/* ================= STELLAR / VEDIX MODERN NAVBAR WITH VEDIX LOGO ================= */}
      <header className="stellar-navbar-container">
        <motion.nav
          className="stellar-navbar"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Brand Logo with Official Vedix.AI Logo */}
          <div
            className="stellar-brand"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
          </div>

          {/* Centered Pill Navigation */}
          <div className="stellar-nav-pill">
            <button
              type="button"
              className={activeNav === "home" ? "active" : ""}
              onClick={() => {
                setActiveNav("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Home
            </button>
            <button
              type="button"
              className={activeNav === "solutions" ? "active" : ""}
              onClick={() => {
                setActiveNav("solutions");
                scrollToSection("solutions");
              }}
            >
              Solutions
            </button>
            <button
              type="button"
              className={activeNav === "features" ? "active" : ""}
              onClick={() => {
                setActiveNav("features");
                scrollToSection("features");
              }}
            >
              Features
            </button>
            <button
              type="button"
              className={activeNav === "personas" ? "active" : ""}
              onClick={() => {
                setActiveNav("personas");
                scrollToSection("personas");
              }}
            >
              Personas
            </button>
            <button
              type="button"
              className={activeNav === "pricing" ? "active" : ""}
              onClick={() => {
                setActiveNav("pricing");
                scrollToSection("pricing");
              }}
            >
              Pricing
            </button>
            <button
              type="button"
              className={activeNav === "contact" ? "active" : ""}
              onClick={() => {
                setActiveNav("contact");
                scrollToSection("contact");
              }}
            >
              Contact
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="stellar-nav-actions">
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

            {/* "Start Now / Get Started" Pill with Up-Right Arrow Icon */}
            <motion.button
              type="button"
              className="stellar-cta-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/login")}
            >
              <span>Start Now</span>
              <span className="stellar-cta-arrow">
                <FiArrowUpRight />
              </span>
            </motion.button>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              className="stellar-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </motion.nav>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="stellar-mobile-drawer"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <button
                type="button"
                className={activeNav === "home" ? "active" : ""}
                onClick={() => {
                  setActiveNav("home");
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Home
              </button>
              <button
                type="button"
                className={activeNav === "solutions" ? "active" : ""}
                onClick={() => {
                  setActiveNav("solutions");
                  setMobileMenuOpen(false);
                  scrollToSection("solutions");
                }}
              >
                Solutions
              </button>
              <button
                type="button"
                className={activeNav === "features" ? "active" : ""}
                onClick={() => {
                  setActiveNav("features");
                  setMobileMenuOpen(false);
                  scrollToSection("features");
                }}
              >
                Features
              </button>
              <button
                type="button"
                className={activeNav === "personas" ? "active" : ""}
                onClick={() => {
                  setActiveNav("personas");
                  setMobileMenuOpen(false);
                  scrollToSection("personas");
                }}
              >
                Personas
              </button>
              <button
                type="button"
                className={activeNav === "pricing" ? "active" : ""}
                onClick={() => {
                  setActiveNav("pricing");
                  setMobileMenuOpen(false);
                  scrollToSection("pricing");
                }}
              >
                Pricing
              </button>
              <button
                type="button"
                className={activeNav === "contact" ? "active" : ""}
                onClick={() => {
                  setActiveNav("contact");
                  setMobileMenuOpen(false);
                  scrollToSection("contact");
                }}
              >
                Contact
              </button>

              <hr className="drawer-divider" />

              <div className="drawer-theme-row">
                <span>Theme: <strong>{isLight ? "Light" : "Dark"}</strong></span>
                <button
                  type="button"
                  className="drawer-theme-btn"
                  onClick={toggleTheme}
                >
                  {isLight ? <FiSun /> : <FiMoon />}
                  <span>Switch</span>
                </button>
              </div>

              <button
                type="button"
                className="drawer-cta-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/login");
                }}
              >
                <span>Start Now</span>
                <FiArrowUpRight />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ================= HERO SECTION (MATCHING REFERENCE IMAGE 1) ================= */}
      <section className="stellar-hero-section">
        <div className="stellar-hero-layout">
          {/* Left Column: Headline & Sub-Action Button */}
          <motion.div
            className="hero-col-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="hero-main-title">
              Autonomous<br />
              Teams of<br />
              AI Agents
            </h1>

            <div className="hero-btn-wrap">
              <motion.button
                type="button"
                className="hero-explore-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSection("solutions")}
              >
                <span>Explore AI Agents</span>
                <span className="hero-circle-arrow">
                  <FiArrowUpRight />
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* Center Column: Futuristic Sci-Fi AI Agent Character Overlap */}
          <motion.div
            className="hero-col-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <div className="character-display-wrap">
              <div className="character-ambient-ring" aria-hidden="true" />
              <img
                src={aiAgentHero}
                alt="Vedix Autonomous AI Agent"
                className="stellar-character-img"
              />
            </div>
          </motion.div>

          {/* Right Column: User Avatars + 50K+ & Project-Matched Value Proposition */}
          <motion.div
            className="hero-col-right"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <div className="hero-metric-badge">
              <div className="avatar-overlap-group">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Member 1"
                  className="overlap-avatar"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Member 2"
                  className="overlap-avatar"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Member 3"
                  className="overlap-avatar"
                />
              </div>
              <span className="metric-large-text">50K+</span>
            </div>

            <p className="hero-paragraph-desc">
              Empower your journey and daily workflows with Vedix AI: book travel across redBus, AbhiBus &amp; IRCTC, scan resumes with instant ATS diagnostics, and decompose research papers — all in one unified platform.
            </p>
          </motion.div>
        </div>

        {/* ================= CURVED EMERALD LOWER CONTAINER ================= */}
        <div className="emerald-curved-container">
          {/* Subtle Atmospheric Watermark Text */}
          <div className="emerald-watermark-row" aria-hidden="true">
            <span className="emerald-watermark-text">Artificial Intelligence</span>
          </div>

          {/* Integrated with Leading Travel & AI Platforms */}
          <div className="trusted-innovators-block">
            <h3 className="trusted-title">Integrated with Leading Travel, AI &amp; Research Platforms</h3>

            <div className="innovators-logo-row">
              {TRUSTED_INNOVATORS.map((item, index) => (
                <div key={index} className="innovator-item">
                  <span className="innovator-logo-text">{item.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 1: PROACTIVE ALERTS & DYNAMIC AVAILABILITY (MATCHING IMAGE 2 TOP ROW) ================= */}
      <section id="features" className="vedix-bento-feature-section">
        <div className="section-header-centered">
          <span className="kicker-pill">INTELLIGENCE PLATFORM</span>
          <h2>Proactive Reasoning & Integrated Workflows</h2>
          <p>
            Stay ahead with automated research telemetry, multi-modal synthesis, and synchronized team workspace analytics.
          </p>
        </div>

        <div className="bento-two-col-grid">
          {/* Left Card: Proactive Alerts */}
          <div className="bento-feature-card proactive-card">
            <div className="bento-text-area">
              <h3>Proactive Alerts</h3>
              <p>
                Stay ahead with instant, context-aware notifications. Our agents anticipate your priorities and act before you do.
              </p>
            </div>

            {/* Embedded Mock Analytics Graphic */}
            <div className="mock-analytics-preview">
              <div className="mock-card-header">
                <span>Data Analysis</span>
                <div className="mock-legend-dots">
                  <span className="dot dot-pink">● Analysis</span>
                  <span className="dot dot-cyan">● Queries</span>
                  <span className="dot dot-green">● Uptime</span>
                </div>
              </div>
              <svg className="mock-curve-svg" viewBox="0 0 320 80" fill="none">
                <path
                  d="M10 55 C 60 20, 110 70, 160 35 C 210 10, 260 50, 310 25"
                  stroke="#ec4899"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M10 40 C 70 65, 130 15, 190 45 C 240 60, 280 20, 310 35"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M10 65 C 50 45, 120 55, 170 30 C 220 15, 270 40, 310 18"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="mock-alert-floating-note">
                <div className="note-icon-bullet"><FiCheckCircle /></div>
                <div>
                  <strong>ATS Optimization Complete</strong>
                  <span>Resume parsed with 98.4% relevance match.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Dynamic Availability */}
          <div className="bento-feature-card dynamic-card">
            <div className="bento-text-area">
              <h3>Dynamic Availability</h3>
              <p>
                Integrated with your existing tool stack. Seamlessly export notes to WhatsApp, trigger research from Slack, and deploy anywhere.
              </p>
            </div>

            <div className="mock-tools-badge-container">
              <div className="tools-icons-cluster">
                <span className="tool-circle tool-1"><FiCpu /></span>
                <span className="tool-circle tool-2"><FiFileText /></span>
                <span className="tool-circle tool-3"><FiGlobe /></span>
              </div>
              <div className="tools-count-info">
                <span className="tools-count-number">200+</span>
                <span className="tools-count-label">Tools Integrated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: MEET YOUR AI AGENT, TAILORED TO YOU (MATCHING IMAGE 2 MIDDLE ROW) ================= */}
      <section id="personas" className="meet-agent-split-section">
        <div className="meet-agent-layout">
          {/* Left Column: Heading, Subtitle & Action Button */}
          <div className="meet-agent-left">
            <h2 className="meet-agent-title">
              Meet Your AI Agent,<br />
              Tailored to You
            </h2>
            <p className="meet-agent-desc">
              Choose from intelligent assistants — designed to match your workflow and style.
            </p>
            <button
              type="button"
              className="hero-explore-btn"
              onClick={() => scrollToSection("solutions")}
            >
              <span>Explore AI Agents</span>
              <span className="hero-circle-arrow">
                <FiArrowUpRight />
              </span>
            </button>
          </div>

          {/* Right Column: Sleek Studio Persona Portrait (Matching User Reference Image) */}
          <div className="meet-agent-right">
            <div className="agent-portrait-card">
              <img
                src={aiAgentPersona}
                alt="Vedix Autonomous AI Agent"
                className="agent-portrait-img"
              />
              <div className="portrait-glass-tag">
                <span className="green-live-dot" />
                <div>
                  <strong>Autonomous Travel &amp; Research Agent</strong>
                  <span>redBus, IRCTC, ATS Resume &amp; Academic AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: WHAT CLIENTS SAY ABOUT US (MATCHING IMAGE 2 BOTTOM ROW) ================= */}
      <section id="testimonials" className="stellar-testimonials-section">
        <div className="section-header-centered">
          <h2>What Clients Say About us</h2>
          <p>
            From startups to enterprises, businesses are transforming their workflows, support, and growth with Vedix AI Agents.
          </p>
        </div>

        <div className="testimonial-feature-card">
          <div className="testimonial-card-left">
            <img
              src={currentTestimonial.avatar}
              alt={currentTestimonial.name}
              className="testimonial-author-avatar"
            />
            <div className="testimonial-author-info">
              <h4>{currentTestimonial.name}</h4>
              <span className="author-role">{currentTestimonial.role}</span>
            </div>
            <div className="company-logo-wrap">
              <span className="client-logo-weave">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
                <span>{currentTestimonial.company}</span>
              </span>
            </div>
          </div>

          <div className="testimonial-card-divider" />

          <div className="testimonial-card-right">
            <p className="testimonial-quote-text">
              "{currentTestimonial.quote}"
            </p>

            <div className="testimonial-navigation-row">
              <button
                type="button"
                className="testimonial-nav-arrow"
                onClick={handlePrevTestimonial}
                aria-label="Previous testimonial"
              >
                <FiChevronLeft />
              </button>
              <button
                type="button"
                className="testimonial-nav-arrow"
                onClick={handleNextTestimonial}
                aria-label="Next testimonial"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VEDIX.AI CORE SOLUTIONS ROSTER ================= */}
      <section id="solutions" className="stellar-solutions-section">
        <div className="section-header-centered">
          <span className="kicker-pill">VEDIX.AI SUITE</span>
          <h2>Intelligent Digital Capabilities</h2>
          <p>
            Everything you need for academic research, resume optimization, autonomous planning, and enterprise productivity.
          </p>
        </div>

        <div className="agents-roster-grid">
          {VEDIX_SOLUTIONS.map((item, idx) => (
            <motion.div
              key={idx}
              className="agent-card-item"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
            >
              <div className="agent-card-top">
                <div className="agent-icon-wrap">{item.icon}</div>
                <span className="agent-tag-pill">{item.tag}</span>
              </div>
              <h3>{item.title}</h3>
              <div className="agent-role-label">{item.role}</div>
              <p>{item.desc}</p>
              <div className="agent-card-footer">
                <button
                  type="button"
                  className="agent-launch-btn"
                  onClick={() => navigate("/login")}
                >
                  <span>Explore Feature</span>
                  <FiArrowUpRight />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= INTERACTIVE AGENT TERMINAL QUERY ================= */}
      <section className="live-preview-section">
        <div className="live-preview-container">
          <div className="preview-top-badge">
            <span className="pulse-indicator-dot" />
            <span>Autonomous Intelligence Orchestrator</span>
          </div>

          <h2 className="preview-headline">Test Vedix.AI Model in Real-Time</h2>
          <p className="preview-subheadline">
            Enter any prompt or test one of our pre-built scenarios below.
          </p>

          <form
            className="agent-ask-input-box"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMiniChat();
            }}
          >
            <input
              type="text"
              placeholder="Ask me anything or enter a research query..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
            />
            <button
              type="submit"
              className="agent-ask-btn"
              disabled={!inputPrompt.trim() || chatLoading}
            >
              <span>Ask AI</span>
              <FiSend />
            </button>
          </form>

          {/* Quick Scenario Chips */}
          <div className="prompt-scenarios-row">
            {QUICK_PROMPTS.map((pText, idx) => (
              <button
                key={idx}
                type="button"
                className="scenario-chip"
                onClick={() => handleSendMiniChat(pText)}
              >
                {pText}
              </button>
            ))}
          </div>

          {/* Mini Agent Response Terminal */}
          <div className="agent-terminal-card">
            <div className="terminal-header">
              <div className="terminal-brand-meta">
                <span className="terminal-star">✦</span>
                <strong>Vedix.AI Terminal</strong>
                <span className="terminal-tag">v3.5 Engine</span>
              </div>
              <span className="terminal-status-pill">● Model Active</span>
            </div>

            <div className="terminal-body" ref={chatScrollRef}>
              <AnimatePresence>
                {chatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={`terminal-msg ${msg.role === "user" ? "user-msg" : "ai-msg"}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="msg-badge">
                      {msg.role === "user" ? <FiUser /> : <span>✦</span>}
                    </div>
                    <div className="msg-content">
                      <p>{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {chatLoading && (
                <div className="terminal-msg ai-msg loading-state">
                  <div className="msg-badge">
                    <span>✦</span>
                  </div>
                  <div className="typing-indicator-wave">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}
            </div>

            <div className="terminal-footer">
              <FiLock />
              <span>Click <strong>Get Started</strong> to unlock full file uploads, document reviews & history.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRICING SECTION (FROM PLANS.JSX) ================= */}
      <section id="pricing" className="stellar-pricing-section">
        <div className="section-header-centered">
          <span className="kicker-pill">TRANSPARENT PLANS</span>
          <h2>Choose the Right Vedix AI Plan</h2>
          <p>
            Start free with daily limits, or upgrade instantly via UPI QR code for high limits, priority AI processing, and advanced features.
          </p>
          {profile && (
            <div className="landing-plan-status-pill">
              <span>Your Current Plan: <strong>{activePlan}</strong></span>
              {activePlan !== "Free" && <span className="active-tag">Active</span>}
            </div>
          )}
        </div>

        <div className="pricing-cards-grid">
          {plans.map((plan) => {
            const isCurrent = activePlan === plan.name;
            const isFeatured = plan.featured;

            return (
              <div
                key={plan.name}
                className={`pricing-card ${isFeatured ? "highlighted" : ""} ${isCurrent ? "current" : ""}`}
              >
                {isFeatured && <div className="popular-ribbon">{plan.badge}</div>}

                <div className="plan-topline-badge">
                  <span className="pricing-plan-name">{plan.name}</span>
                  <span className="plan-badge-tag">{isCurrent ? "Active Plan" : plan.badge}</span>
                </div>

                <div className="pricing-rate">
                  <span className="currency">₹</span>
                  <span className="price-num">{plan.priceNum}</span>
                  <span className="duration">/{plan.period}</span>
                </div>

                <p className="plan-pitch">{plan.description}</p>

                <ul className="plan-features-list">
                  {plan.features.map((feat, idx) => (
                    <li key={idx}>
                      <FiCheckCircle />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`plan-action-btn ${isFeatured ? "primary" : "secondary"} ${isCurrent ? "active-disabled" : ""}`}
                  onClick={() => handlePlanClick(plan)}
                >
                  {isCurrent ? (
                    <span>Current Active Plan</span>
                  ) : (
                    <>
                      <span>{plan.cta}</span>
                      <FiArrowUpRight />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* View Full Plans page link */}
        <div className="pricing-footer-hint">
          <p>
            Want to see your detailed payment history or direct UPI QR checkout?{" "}
            <button
              type="button"
              className="text-link-btn"
              onClick={() => navigate("/plans")}
            >
              Open Full Plans & Payment Dashboard →
            </button>
          </p>
        </div>
      </section>

      {/* ================= CONTACT / CONSULTATION FORM ================= */}
      <section id="contact" className="stellar-contact-section">
        <div className="contact-form-wrapper">
          <div className="contact-head">
            <span className="kicker-pill">GET IN TOUCH</span>
            <h2>Book a Consultation with Our Engineers</h2>
            <p>Ready to deploy Vedix into your workflow? Send us a message and our team will get back to you shortly.</p>
          </div>

          <form className="stellar-contact-form" onSubmit={handleContactSubmit}>
            <div className="form-fields-grid">
              <div className="form-field-item">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                />
              </div>

              <div className="form-field-item">
                <label>Work Email</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-field-item">
              <label>Subject / Interest</label>
              <input
                type="text"
                placeholder="Enterprise Deployment / Inquiries"
                required
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
              />
            </div>

            <div className="form-field-item">
              <label>How can Vedix.AI assist you?</label>
              <textarea
                rows="4"
                placeholder="Describe your research, workflow, or team requirements..."
                required
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              />
            </div>

            <button type="submit" className="contact-submit-btn">
              <span>Submit Inquiry</span>
              <FiArrowUpRight />
            </button>

            {contactSent && (
              <div className="contact-confirmation-badge">
                <FiCheckCircle />
                <span>Thank you! Your message has been received. Our solutions team will contact you shortly.</span>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* ================= STELLAR FOOTER ================= */}
      <footer className="stellar-footer">
        <div className="footer-content-inner">
          <div className="footer-col-brand">
            <div className="stellar-brand">
              <div className="vedix-nav-logo-badge sm">
                <img
                  src={assets.gemini_icon}
                  alt="Vedix.AI Logo"
                  className="vedix-official-logo"
                />
              </div>
              <span className="stellar-brand-name">Vedix.AI</span>
            </div>
            <p className="footer-tagline">
              Autonomous multi-agent intelligence engineered for high-velocity research, development, and enterprise operations.
            </p>
          </div>

          <div className="footer-links-col">
            <h4>Solutions</h4>
            <a href="#solutions">Reasoning Agent</a>
            <a href="#solutions">Resume ATS Scanner</a>
            <a href="#solutions">Research Paper Review</a>
            <a href="#solutions">Live News Telemetry</a>
          </div>

          <div className="footer-links-col">
            <h4>Company</h4>
            <a href="#personas">Personas</a>
            <a href="#pricing">Pricing Plans</a>
            <a href="#contact">Book a Demo</a>
            <button
              type="button"
              className="footer-login-link"
              onClick={() => navigate("/login")}
            >
              Sign In / Register
            </button>
          </div>

          <div className="footer-links-col">
            <h4>Security & Standards</h4>
            <span className="sec-badge-item"><FiLock /> 256-Bit TLS Encryption</span>
            <span className="sec-badge-item"><FiShield /> Privacy-First Protocol</span>
            <span className="sec-badge-item"><FiZap /> 99.9% Uptime Guarantee</span>
          </div>
        </div>

        <div className="footer-bottom-copyright">
          <p>© {new Date().getFullYear()} Vedix.AI Inc. All rights reserved. Designed for next-generation intelligence.</p>
        </div>
      </footer>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onPaymentSubmitted={() => {
            setSelectedPlan(null);
            alert("Payment proof submitted! Admin will verify and activate your plan shortly.");
          }}
        />
      )}
    </div>
  );
};

export default LandingPage;
