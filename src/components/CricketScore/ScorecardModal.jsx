import React, { useState } from "react";
import "./ScorecardModal.css";
import { FiX, FiAward, FiMapPin, FiActivity } from "react-icons/fi";

const ScorecardModal = ({ match, onClose, lang = "en" }) => {
  const [activeTab, setActiveTab] = useState("team1");

  if (!match) return null;

  const isHindi = lang === "hi";

  const currentTeam = activeTab === "team1" ? match.team1 : match.team2;
  const team1Name = isHindi ? match.team1.nameHi || match.team1.name : match.team1.name;
  const team2Name = isHindi ? match.team2.nameHi || match.team2.name : match.team2.name;

  return (
    <div className="scorecard-modal-overlay" onClick={onClose}>
      <div className="scorecard-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="scorecard-modal-header">
          <div className="match-title-info">
            <span className="series-badge">{match.series}</span>
            <h3>{team1Name} vs {team2Name}</h3>
            <p className="venue-info">
              <FiMapPin /> {match.venue}
            </p>
          </div>

          <button type="button" className="close-modal-btn" onClick={onClose} aria-label="Close scorecard">
            <FiX />
          </button>
        </div>

        {/* Live Match Summary Strip */}
        <div className="match-summary-strip">
          <div className="team-summary-box">
            <span className="team-flag-code">{match.team1.flag} {match.team1.code}</span>
            <b className="team-score-big">{match.team1.score}</b>
            <small>({match.team1.overs} overs)</small>
          </div>

          <div className="summary-versus">
            <span className="status-badge-live">{match.status}</span>
          </div>

          <div className="team-summary-box">
            <span className="team-flag-code">{match.team2.flag} {match.team2.code}</span>
            <b className="team-score-big">{match.team2.score}</b>
            <small>({match.team2.overs} overs)</small>
          </div>
        </div>

        <div className="toss-result-bar">
          <FiAward className="toss-icon" />
          <span>{isHindi ? match.tossHi || match.toss : match.toss}</span>
        </div>

        {match.recentOvers && match.recentOvers.length > 0 && (
          <div className="recent-balls-bar">
            <span>{isHindi ? "हालिया ओवरบอล" : "Recent Balls"}:</span>
            <div className="balls-list">
              {match.recentOvers.map((ball, idx) => (
                <span key={idx} className={`ball-chip ${ball === "W" ? "wicket" : ball === "6" || ball === "4" ? "boundary" : ""}`}>
                  {ball}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Innings Tabs */}
        <div className="innings-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === "team1" ? "active" : ""}`}
            onClick={() => setActiveTab("team1")}
          >
            {team1Name} {isHindi ? "की पारी" : "Innings"} ({match.team1.score})
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === "team2" ? "active" : ""}`}
            onClick={() => setActiveTab("team2")}
          >
            {team2Name} {isHindi ? "की पारी" : "Innings"} ({match.team2.score})
          </button>
        </div>

        {/* Detailed Batting Scorecard Table */}
        <div className="scorecard-section">
          <h4>{isHindi ? "बल्लेबाजी (Batting)" : "Batting Scorecard"}</h4>
          <div className="table-wrapper">
            <table className="scorecard-table">
              <thead>
                <tr>
                  <th className="left-align">{isHindi ? "बल्लेबाज" : "Batter"}</th>
                  <th>{isHindi ? "स्थिति" : "Dismissal"}</th>
                  <th>R</th>
                  <th>B</th>
                  <th>4s</th>
                  <th>6s</th>
                  <th>SR</th>
                </tr>
              </thead>
              <tbody>
                {currentTeam.batting.map((player, idx) => (
                  <tr key={idx}>
                    <td className="left-align batter-name">
                      <b>{player.name}</b>
                    </td>
                    <td className="dismissal-info">{player.status}</td>
                    <td className="highlight-runs">{player.runs}</td>
                    <td>{player.balls}</td>
                    <td>{player.fours}</td>
                    <td>{player.sixes}</td>
                    <td className="sr-text">{player.sr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Bowling Scorecard Table */}
        <div className="scorecard-section">
          <h4>{isHindi ? "गेंदबाजी (Bowling)" : "Bowling Figures"}</h4>
          <div className="table-wrapper">
            <table className="scorecard-table">
              <thead>
                <tr>
                  <th className="left-align">{isHindi ? "गेंदबाज" : "Bowler"}</th>
                  <th>O</th>
                  <th>M</th>
                  <th>R</th>
                  <th>W</th>
                  <th>Econ</th>
                </tr>
              </thead>
              <tbody>
                {currentTeam.bowling.map((bowler, idx) => (
                  <tr key={idx}>
                    <td className="left-align bowler-name">
                      <b>{bowler.name}</b>
                    </td>
                    <td>{bowler.overs}</td>
                    <td>{bowler.maidens}</td>
                    <td>{bowler.runs}</td>
                    <td className="highlight-wickets">{bowler.wickets}</td>
                    <td className="econ-text">{bowler.econ}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScorecardModal;
