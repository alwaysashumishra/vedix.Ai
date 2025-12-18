import React, { useEffect, useState } from "react";
import "./Explore.css";
import Navbar from "../../components/NavBar/Navbar";


const sliderData = [
  {
    img: "https://picsum.photos/1200/800?random=101",
    title: "Justin Greaves creates history, becomes first player to break record",
  },
  {
    img: "https://picsum.photos/1200/800?random=102",
    title: "World economy shifting rapidly — Experts warn of major changes",
  },
  {
    img: "https://picsum.photos/1200/800?random=103",
    title: "AI breakthroughs in 2025: Shocking innovations",
  },
];

const Explore = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const auto = setInterval(() => {
      setIndex((prev) => (prev + 1) % sliderData.length);
    }, 4000);

    return () => clearInterval(auto);
  }, []);

  return (
    <>
    <div className="explores" >
      <Navbar />
      <div className="explore-container">

        {/* TOP GRID */}
        <div className="top-grid">

          {/* LEFT AUTO SLIDER */}
          <div className="big-card fade">
            <img src={sliderData[index].img} className="big-img" alt="" />

            <div className="big-overlay">
              <span className="source">Times Now • Trending</span>
              <h1 className="big-title">{sliderData[index].title}</h1>

              <div className="slider-dots">
                {sliderData.map((_, i) => (
                  <div key={i} className={`dot ${i === index ? "active" : ""}`} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="side-card">
            <img src="https://picsum.photos/600/400?random=20" className="side-img" />
            <h2 className="side-title">
              Putin sends strong message on India–Russia friendship
            </h2>
            <div className="side-actions">
              <span>❤️ 12</span>
              <span>💬 5</span>
              <span>🔁</span>
              <span className="follow">Following</span>
            </div>
          </div>

          {/* SCORE CARD */}
          <div className="score-card">
            <h3>ICC</h3>
            <div className="score-row"><span>AUS</span><span>511</span><span className="green">STUMPS</span><span>334</span><span>ENG</span></div>
            <div className="score-row"><span>IND</span><span>174/1</span><span className="green">LIVE</span><span>270</span><span>SA</span></div>
            <button className="see-more">See more →</button>
          </div>

        </div>

        {/* BOTTOM GRID (3 CARDS) */}
        <div className="bottom-grid">
          <div className="small-card">
            <img src="https://picsum.photos/600/400?random=30" alt="" />
            <h3>Think pro tools are too complex?</h3>
          </div>

          <div className="small-card">
            <img src="https://picsum.photos/600/400?random=31" alt="" />
            <h3>Not Shubman Gill or Jasprit Bumrah!</h3>
          </div>

          <div className="small-card">
            <img src="https://picsum.photos/600/400?random=32" alt="" />
            <h3>Top AI models changing 2025</h3>
          </div>
        </div>

      </div>
      </div>
    </>
  );
};

export default Explore;
