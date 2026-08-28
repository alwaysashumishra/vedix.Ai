import React, { useContext } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { FaGlobe } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { ThemeContext } from "../../context/ThemeContext";

const Navbar = ({
  profile,
  setProfile,
  setShowLogin,
  lang = "en",
  setLang,
  activeCategory = "All",
  onCategorySelect,
  categories = [],
}) => {
  const { activeFestivalData, openFestivalCalendar } = useContext(ThemeContext);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setProfile(null);
    setShowLogin(true);
  };

  const isHindi = lang === "hi";

  const defaultCategories = isHindi
    ? [
        { label: "सब" },
        { label: "प्रमुख समाचार" },
        { label: "तकनिकी" },
        { label: "बिजनेस" },
        { label: "खेल" },
        { label: "विज्ञान" },
        { label: "स्वास्थ्य" },
      ]
    : [
        { label: "All" },
        { label: "Top Stories" },
        { label: "Technology" },
        { label: "Business" },
        { label: "Sports" },
        { label: "Science" },
        { label: "Health" },
      ];

  const catList = categories.length > 0 ? [{ label: isHindi ? "सब" : "All" }, ...categories] : defaultCategories;

  return (
    <nav className="navbar">
      <div className="nav-top-row">
        <div className="nav-brand">
          <h2 className="Lexi">Vedix.Ai</h2>
          <span className="news-badge">Live News</span>
        </div>

        <div className="nav-right">
          <button
            type="button"
            className="lang-toggle-btn"
            onClick={openFestivalCalendar}
            style={{ background: "linear-gradient(135deg, #dc2626, #f59e0b)", color: "#fff", border: "none" }}
            title="Special Day Festival Calendar"
          >
            <FiCalendar />
            <span>{activeFestivalData ? `${activeFestivalData.icon} ${activeFestivalData.name}` : "Events Calendar"}</span>
          </button>

          {setLang && (
            <button
              type="button"
              className="lang-toggle-btn"
              onClick={() => setLang(isHindi ? "en" : "hi")}
              title={isHindi ? "Switch to English News" : "हिंदी में समाचार पढ़ें"}
            >
              <FaGlobe />
              <span>{isHindi ? "EN" : "हिंदी"}</span>
            </button>
          )}

          <NavLink className="Nav-Home-btn" to="/">
            Home
          </NavLink>

          {profile ? (
            <div className="explore-profile-box">
              <img
                src={profile.profilePic || assets.user_icon}
                alt={profile.username}
                className="explore-profile-pic"
                onError={(e) => {
                  e.target.src = assets.user_icon;
                }}
              />
              <span className="nav-username">{profile.username}</span>
              <button type="button" className="feed-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button type="button" className="feed-btn" onClick={() => setShowLogin(true)}>
              Login
            </button>
          )}
        </div>
      </div>

      {onCategorySelect && (
        <div className="nav-categories-scroll">
          {catList.map((cat) => (
            <button
              key={cat.label}
              type="button"
              className={`nav-category-chip ${
                (activeCategory === cat.label || (activeCategory === "All" && (cat.label === "All" || cat.label === "सब")))
                  ? "active"
                  : ""
              }`}
              onClick={() => onCategorySelect(cat.label === "सब" ? "All" : cat.label)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
