import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
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
} from "react-icons/fi";
import { assets } from "../../assets/assets";
import ParticleCanvas from "./ParticleCanvas";
import "./LandingPage.css";

gsap.registerPlugin(ScrollTrigger);

const QUICK_PROMPTS = [
  "Explain Quantum Computing simply",
  "How does ATS resume scanner work?",
  "How to structure a research paper?",
  "Plan a 3-day trip to Tokyo",
];

const LandingPage = ({ setShowLogin }) => {
  // Lenis Smooth Scroll Setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // Spotlight mouse effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Active Nav Link State & IntersectionObserver scroll detection
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      const featuresEl = document.getElementById("features");
      const aboutEl = document.getElementById("about");
      const contactEl = document.getElementById("contact");

      if (contactEl && scrollPosition >= contactEl.offsetTop) {
        setActiveNav("contact");
      } else if (aboutEl && scrollPosition >= aboutEl.offsetTop) {
        setActiveNav("about");
      } else if (featuresEl && scrollPosition >= featuresEl.offsetTop) {
        setActiveNav("features");
      } else {
        setActiveNav("home");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mini Chat State inside Hero Header
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: "Welcome to Vedix.AI. Select a query below or type a prompt to test our AI model in real-time.",
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
        replyText = "Quantum computing uses superposition and entanglement of qubits to solve complex computational problems exponentially faster than classical supercomputers.";
      } else if (prompt.toLowerCase().includes("ats") || prompt.toLowerCase().includes("resume")) {
        replyText = "ATS (Applicant Tracking System) evaluates resumes for targeted keywords, structure, and legibility. Vedix.AI Resume Scanner provides instant ATS scores and job matching.";
      } else if (prompt.toLowerCase().includes("research")) {
        replyText = "A research paper includes Abstract, Introduction, Literature Review, Methodology, Experiments, and Discussion. Try Vedix Research AI for multi-page PDF reviews!";
      } else if (prompt.toLowerCase().includes("tokyo") || prompt.toLowerCase().includes("trip")) {
        replyText = "Day 1: Shinjuku & Shibuya. Day 2: Asakusa & Akihabara. Day 3: Mt. Fuji day excursion & Ginza dining. Use Vedix Travel Agent for custom itineraries!";
      } else {
        replyText = `Vedix.AI Intelligence: "${prompt}"\n\nVedix.AI synthesizes complex multi-step data. Click 'Get Started' to unlock full session history, multi-modal uploads, and team study spaces.`;
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

  return (
    <div className="landing-page" onMouseMove={handleMouseMove}>
      {/* Aceternity Style Mouse Spotlight */}
      <div
        className="aceternity-spotlight"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
        aria-hidden="true"
      />

      {/* Three.js 3D WebGL Particle Canvas */}
      <ParticleCanvas />

      {/* Glassmorphism Navbar */}
      <div className="landing-navbar-wrapper">
        <motion.nav
          className="landing-navbar"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="landing-nav-brand">
            <div className="logo-circle-wrap">
              <img
                src={assets.gemini_icon}
                alt="Vedix.AI Logo"
                className="vedix-nav-logo"
              />
            </div>
            <span className="brand-title">Vedix.AI</span>
          </div>

          <div className="landing-nav-links">
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
              className={activeNav === "about" ? "active" : ""}
              onClick={() => {
                setActiveNav("about");
                scrollToSection("about");
              }}
            >
              About Us
            </button>
            <button
              type="button"
              className={activeNav === "contact" ? "active" : ""}
              onClick={() => {
                setActiveNav("contact");
                scrollToSection("contact");
              }}
            >
              Contact Us
            </button>
          </div>

          <div className="landing-nav-actions">
            <button
              type="button"
              className="nav-signin-btn"
              onClick={() => setShowLogin(true)}
            >
              Sign In
            </button>
            <motion.button
              type="button"
              className="nav-getstarted-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowLogin(true)}
            >
              <span>Get Started</span>
              <FiArrowRight />
            </motion.button>
          </div>
        </motion.nav>
      </div>

      {/* Centered Clean Hero Header Section */}
      <motion.header
        className="landing-hero center-hero"
        initial={{ opacity: 0, scale: 0.88, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="hero-center-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title center-title">
            Ask me a question
          </h1>
          <p className="hero-subtitle center-subtitle">
            Instant multi-model reasoning, document inspection, and research intelligence.
          </p>

          {/* Central Prominent Input Bar */}
          <form
            className="hero-ask-bar glass-card"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMiniChat();
            }}
          >
            <input
              type="text"
              placeholder="Ask me a question or enter any prompt..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
            />
            <button
              type="submit"
              className="hero-ask-send-btn"
              disabled={!inputPrompt.trim() || chatLoading}
            >
              <span>Ask AI</span>
              <FiSend />
            </button>
          </form>

          {/* Quick Prompts Bar */}
          <div className="hero-prompts-row">
            {QUICK_PROMPTS.map((promptText, idx) => (
              <button
                key={idx}
                type="button"
                className="hero-prompt-chip"
                onClick={() => handleSendMiniChat(promptText)}
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Clean Small Chat Preview Box (No Scrollbar Design) */}
          <div className="center-mini-chat-box glass-card">
            <div className="mini-chat-top">
              <div className="mini-chat-brand">
                <div className="logo-circle-wrap sm">
                  <img src={assets.gemini_icon} alt="Vedix.AI" className="mini-chat-logo" />
                </div>
                <div>
                  <strong>Vedix.AI Live Preview</strong>
                  <span className="live-status">● Neural Model Active</span>
                </div>
              </div>
              <span className="guest-pill">Guest Mode</span>
            </div>

            <div className="mini-chat-body clean-no-scroll" ref={chatScrollRef}>
              <AnimatePresence>
                {chatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={`mini-msg ${msg.role === "user" ? "user" : "ai"}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mini-avatar">
                      {msg.role === "user" ? (
                        <FiUser />
                      ) : (
                        <div className="logo-circle-wrap xs">
                          <img src={assets.gemini_icon} alt="AI" />
                        </div>
                      )}
                    </div>
                    <div className="mini-text">
                      <p>{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {chatLoading && (
                <div className="mini-msg ai loading">
                  <div className="mini-avatar">
                    <div className="logo-circle-wrap xs">
                      <img src={assets.gemini_icon} alt="AI" />
                    </div>
                  </div>
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
            </div>

            <div className="mini-footnote">
              <FiLock />
              <span>Click <strong>Get Started</strong> to unlock full file uploads, history & team tools.</span>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* Aceternity Style Bento Grid Section */}
      <motion.section
        id="features"
        className="landing-section"
        initial={{ opacity: 0, scale: 0.78, y: 60 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, amount: 0.12 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="section-head center"
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="head-kicker">CORE CAPABILITIES</span>
          <h2>Designed for Precision & High Productivity</h2>
          <p>
            An integrated suite of neural tools tailored for academic, software, and enterprise workflows.
          </p>
        </motion.div>

        <div className="bento-grid">
          {/* Card 1 */}
          <div className="bento-card glass-card bento-wide">
            <div className="icon-container">
              <FiCpu />
            </div>
            <h3>Multi-Model AI Chat & Neural Reasoning</h3>
            <p>
              Switch between Vedix 3.5 Pro reasoning and fast-inference engines for deep logic, complex code synthesis, and mathematical proofs.
            </p>
            <div className="feature-tags">
              <span>Reasoning 3.5</span>
              <span>Code Synth</span>
              <span>Voice AI</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bento-card glass-card">
            <div className="icon-container">
              <FiFileText />
            </div>
            <h3>Resume ATS Scanner</h3>
            <p>
              Upload PDF or DOCX resumes to extract ATS scores, identify missing technical skills, and access job links.
            </p>
            <div className="feature-tags">
              <span>ATS Score</span>
              <span>Skill Gaps</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bento-card glass-card">
            <div className="icon-container">
              <FiBookOpen />
            </div>
            <h3>Research Paper Analyzer</h3>
            <p>
              Inspect complex academic papers. Extract methodology reviews, key findings, and viva notes.
            </p>
            <div className="feature-tags">
              <span>Methodology Audit</span>
              <span>Viva Notes</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bento-card glass-card">
            <div className="icon-container">
              <FiCompass />
            </div>
            <h3>Live News Intelligence</h3>
            <p>
              Access 24/7 global category feeds, tech trends, and real-time cricket scorecards in multi-lingual format.
            </p>
            <div className="feature-tags">
              <span>Live RSS</span>
              <span>Cricket Widget</span>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bento-card glass-card">
            <div className="icon-container">
              <FiUsers />
            </div>
            <h3>Smart Notes & Team Groups</h3>
            <p>
              Save AI Q&As directly to notes, export insights via WhatsApp, and collaborate in custom study groups.
            </p>
            <div className="feature-tags">
              <span>Note Vault</span>
              <span>Team Groups</span>
            </div>
          </div>

          {/* Card 6 */}
          <div className="bento-card glass-card">
            <div className="icon-container">
              <FiGlobe />
            </div>
            <h3>Autonomous Travel Agent</h3>
            <p>
              Plan complete travel itineraries, discover top accommodation matches, and calculate flight budget estimates.
            </p>
            <div className="feature-tags">
              <span>Itineraries</span>
              <span>Hotel Match</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* About Us Section */}
      <motion.section
        id="about"
        className="landing-section"
        initial={{ opacity: 0, scale: 0.78, y: 60 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, amount: 0.12 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="about-wrapper glass-card"
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="about-col-left"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="head-kicker">ABOUT VEDIX.AI</span>
            <h2>Architecting Intelligent Digital Systems</h2>
            <p>
              Vedix.AI was created to unify advanced artificial intelligence models into a singular, clean, and reliable workspace.
            </p>
            <p>
              We focus on speed, data privacy, and practical utility — providing professionals, researchers, and students with tools that deliver real outcomes.
            </p>

            <div className="about-highlights">
              <div className="highlight-item">
                <FiCheckCircle className="check-icon" />
                <span>Zero-data selling policy with enterprise-grade encryption.</span>
              </div>
              <div className="highlight-item">
                <FiCheckCircle className="check-icon" />
                <span>Multi-model redundancy for 99.9% uptime and low-latency responses.</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="about-col-right"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="trust-card">
              <FiShield className="trust-icon" />
              <div>
                <h4>Enterprise Standard</h4>
                <p>Built with robust security protocols and standard multi-region infrastructure.</p>
              </div>
            </div>

            <div className="metrics-box">
              <span className="metric-large">10M+</span>
              <p>Prompts & Academic Pages Processed</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Contact Us Section */}
      <motion.section
        id="contact"
        className="landing-section"
        initial={{ opacity: 0, scale: 0.78, y: 60 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, amount: 0.12 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="section-head center"
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="head-kicker">CONTACT US</span>
          <h2>Get in Touch with Our Team</h2>
          <p>Have questions, feedback, or enterprise inquiries? Send us a direct message below.</p>
        </motion.div>

        <motion.div
          className="contact-card glass-card"
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <div className="form-grid">
              <div className="field-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                />
              </div>

              <div className="field-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@domain.com"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                />
              </div>
            </div>

            <div className="field-group">
              <label>Subject</label>
              <input
                type="text"
                placeholder="Inquiry Subject"
                required
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
              />
            </div>

            <div className="field-group">
              <label>Message</label>
              <textarea
                rows="4"
                placeholder="Write your message here..."
                required
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="contact-btn">
              <span>Send Message</span>
              <FiSend />
            </button>

            {contactSent && (
              <div className="success-alert">
                <FiCheckCircle />
                <span>Thank you. Your message has been submitted. Our support team will get back to you shortly.</span>
              </div>
            )}
          </form>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-row">
              <div className="logo-circle-wrap">
                <img src={assets.gemini_icon} alt="Vedix.AI" className="footer-logo-img" />
              </div>
              <span className="footer-brand-title">Vedix.AI</span>
            </div>
            <p>Unified neural workspace for research, code, documents, and news intelligence.</p>
          </div>

          <div className="footer-col">
            <h4>Workspace Tools</h4>
            <a href="#features">AI Chat Reasoning</a>
            <a href="#features">Resume ATS Scanner</a>
            <a href="#features">Research Paper Review</a>
            <a href="#features">Live News Feed</a>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <a href="#about">About Us</a>
            <a href="#contact">Contact Support</a>
            <button type="button" className="footer-signin-btn" onClick={() => setShowLogin(true)}>
              Sign In / Register
            </button>
          </div>

          <div className="footer-col">
            <h4>Security & Performance</h4>
            <span className="footer-sec-item"><FiLock /> 256-Bit SSL Encryption</span>
            <span className="footer-sec-item"><FiShield /> Privacy-First Protocol</span>
            <span className="footer-sec-item"><FiZap /> 99.9% Uptime SLA</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Vedix.AI Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
