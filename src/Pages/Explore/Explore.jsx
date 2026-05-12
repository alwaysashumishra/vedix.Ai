import React, { useEffect, useState } from "react";
import "./Explore.css";
import Navbar from "../../components/NavBar/Navbar";

import {
  FaFire,
  FaRobot,
  FaBitcoin,
  FaChartLine,
  FaFutbol,
  FaSearch,
} from "react-icons/fa";

const sliderData = [
  {
    img: "https://picsum.photos/1400/800?random=101",
    title: "AI breakthroughs in 2026 are reshaping industries worldwide",
  },
  {
    img: "https://picsum.photos/1400/800?random=102",
    title: "Global markets rally as tech companies surge",
  },
  {
    img: "https://picsum.photos/1400/800?random=103",
    title: "Sports industry enters new digital transformation era",
  },
];

const Explore = ({ profile }) => {
  const [index, setIndex] = useState(0);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const auto = setInterval(() => {
      setIndex((prev) => (prev + 1) % sliderData.length);
    }, 4000);

    return () => clearInterval(auto);
  }, []);

  return (
    <div className="explores">
      <Navbar profile={profile} />

      <div className="explore-container">

        {/* SEARCH BAR */}

        <div className="search-wrapper">

          <div className="search-box">

            <FaSearch className="search-icon"  
             />

            <input
              type="text"
              placeholder="Search news, AI, crypto, sports..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>

        {/* HERO SECTION */}

        <div className="hero-section">
          <div className="big-card fade">
            <img
              src={sliderData[index].img}
              className="big-img"
              alt=""
            />

            <div className="big-overlay">
              <span className="source">
                Microsoft Feed • Trending
              </span>

              <h1 className="big-title">
                {sliderData[index].title}
              </h1>

              <div className="slider-dots">
                {sliderData.map((_, i) => (
                  <div
                    key={i}
                    className={`dot ${i === index ? "active" : ""}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TRENDING SECTION */}

        <div className="section-header">
          <h2>
            <FaFire />
            Trending Now
          </h2>
        </div>

        <div className="top-grid">

          {/* NEWS CARD */}

          <div className="side-card glass">
            <img
              src="https://picsum.photos/600/400?random=20"
              className="side-img"
              alt=""
            />

            <h2 className="side-title">
              Putin sends strong message on India–Russia friendship
            </h2>

            <div className="side-actions">
              <span>❤️ 12k</span>
              <span>💬 5k</span>
              <span>🔁 2k</span>
            </div>
          </div>

          {/* SCORE CARD */}

          <div className="score-card glass">
            <h3>Live Cricket</h3>

            <div className="score-row">
              <span>AUS</span>
              <span>511</span>
              <span className="green">STUMPS</span>
              <span>334</span>
              <span>ENG</span>
            </div>

            <div className="score-row">
              <span>IND</span>
              <span>174/1</span>
              <span className="green">LIVE</span>
              <span>270</span>
              <span>SA</span>
            </div>

            <button className="see-more">
              See more →
            </button>
          </div>

          {/* AI CARD */}

          <div className="premium-mini glass">
            <FaRobot className="mini-icon" />

            <h3>Artificial Intelligence</h3>

            <p>
              Open-source AI models are rapidly growing across industries.
            </p>
          </div>

          {/* CRYPTO */}

          <div className="premium-mini glass">
            <FaBitcoin className="mini-icon" />

            <h3>Crypto Market</h3>

            <p>
              Bitcoin surges after institutional buying pressure increases.
            </p>
          </div>

          {/* STOCK */}

          <div className="premium-mini glass">
            <FaChartLine className="mini-icon" />

            <h3>Stock Market</h3>

            <p>
              Nasdaq reaches all-time highs fueled by AI companies.
            </p>
          </div>

          {/* SPORTS */}

          <div className="premium-mini glass">
            <FaFutbol className="mini-icon" />

            <h3>Sports</h3>

            <p>
              Football clubs investing heavily into AI analytics systems.
            </p>
          </div>
        </div>

        {/* DISCOVER */}

        <div className="section-header">
          <h2>Discover More</h2>
        </div>

        <div className="bottom-grid">

          <div className="small-card glass">
            <img
              src="https://picsum.photos/600/400?random=30"
              alt=""
            />

            <h3>
              Think pro tools are too complex?
            </h3>
          </div>

          <div className="small-card glass">
            <img
              src="https://picsum.photos/600/400?random=31"
              alt=""
            />

            <h3>
              Not Shubman Gill or Jasprit Bumrah!
            </h3>
          </div>

          <div className="small-card glass">
            <img
              src="https://picsum.photos/600/400?random=32"
              alt=""
            />

            <h3>
              Top AI models changing 2026
            </h3>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Explore;