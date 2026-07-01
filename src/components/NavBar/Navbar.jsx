import React from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";

const Navbar = ({ profile, setProfile, setShowLogin }) => {
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setProfile(null);
    setShowLogin(true);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2 className="Lexi">Vedix.Ai</h2>
        <span className="nav-item active">Discover</span>
        <span className="nav-item">Technology</span>
        <span className="nav-item">Business</span>
        <span className="nav-item">Sports</span>
        <span className="nav-item">Science</span>
      </div>

      <div className="nav-right">
        <NavLink className="Nav-Home-btn" to="/">
          Home
        </NavLink>

        {profile ? (
          <div className="explore-profile-box">
            <img
              src={profile.profilePic || assets.user_icon}
              alt={profile.username}
              className="explore-profile-pic"
            />
            <span>{profile.username}</span>
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
    </nav>
  );
};

export default Navbar;
