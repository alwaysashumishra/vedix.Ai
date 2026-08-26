import React, { useEffect, useState } from "react";
import "./CricketScoreWidget.css";
import { fetchLiveMatches } from "../../config/cricket";
import { FaExternalLinkAlt, FaSync } from "react-icons/fa";

const CricketScoreWidget = ({ lang = "en", onSelectMatch }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadScores = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchLiveMatches(lang);
      if (data.success) {
        setMatches(data.matches || []);
      }
    } catch (err) {
      console.log("Cricket scores error:", err);
      setError("Unable to load live scorecards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScores();
    const interval = setInterval(loadScores, 45000);
    return () => clearInterval(interval);
  }, [lang]);

  const isHindi = lang === "hi";

  if (loading && matches.length === 0) {
    return (
      <div className="cricket-widget-skeleton">
        <div className="skeleton-pulse"></div>
      </div>
    );
  }

  if (error && matches.length === 0) {
    return null;
  }

  return (
    <div className="cricket-widget-container">
      <div className="cricket-header-row">
        <div className="cricket-title">
          <span className="live-dot"></span>
          <h4>{isHindi ? "लाइव क्रिकेट व स्पोर्ट्स स्कोर" : "Live Sports Scorecard"}</h4>
        </div>

        <button type="button" className="refresh-score-btn" onClick={loadScores} title="Refresh scores">
          <FaSync className={loading ? "spin" : ""} />
        </button>
      </div>

      <div className="cricket-cards-scroll">
        {matches.map((match) => {
          const isMatchLive = match.status === "LIVE";
          const team1Name = isHindi ? match.team1.nameHi || match.team1.name : match.team1.name;
          const team2Name = isHindi ? match.team2.nameHi || match.team2.name : match.team2.name;
          const statusDesc = isHindi ? match.statusTextHi || match.statusText : match.statusText;

          return (
            <div
              key={match.id}
              className="cricket-match-card"
              onClick={() => onSelectMatch && onSelectMatch(match)}
              title="Click to view full detailed scorecard"
            >
              <div className="match-card-top">
                <span className="series-name">{match.series}</span>
                <span className={`status-pill ${isMatchLive ? "live" : "result"}`}>
                  {isMatchLive ? (isHindi ? "🔴 लाइव" : "🔴 LIVE") : (isHindi ? "समाप्त" : "FINAL")}
                </span>
              </div>

              <div className="teams-row">
                <div className="team-item">
                  <div className="team-flag-name">
                    <span className="team-flag">{match.team1.flag}</span>
                    <span className="team-code">{match.team1.code}</span>
                  </div>
                  <div className="team-score">
                    <b>{match.team1.score}</b>
                    <small>({match.team1.overs} ov)</small>
                  </div>
                </div>

                <div className="match-vs">VS</div>

                <div className="team-item">
                  <div className="team-flag-name">
                    <span className="team-flag">{match.team2.flag}</span>
                    <span className="team-code">{match.team2.code}</span>
                  </div>
                  <div className="team-score">
                    <b>{match.team2.score}</b>
                    <small>({match.team2.overs} ov)</small>
                  </div>
                </div>
              </div>

              <div className="match-status-desc">
                <p>{statusDesc}</p>
                <span className="full-scorecard-link">
                  {isHindi ? "पूरा स्कोरकार्ड देखें" : "View Scorecard"} <FaExternalLinkAlt />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CricketScoreWidget;
