import React from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">

      {/* LEFT CONTENT */}
      <div className="nav-left">
        <h2 className="Lexi">Vedix.Ai</h2>

        <span className="nav-item active">Discover</span>
        <span className="nav-item">News</span>
        <span className="nav-item">Sports</span>
        <span className="nav-item">Money</span>
        <span className="nav-item">Weather</span>
      </div>

      {/* RIGHT CONTENT */}
      <div className="nav-right">
        <NavLink className="Nav-Home-btn" to="/">
              
                Home
              </NavLink>
        <button className="feed-btn">Feed Layout</button>
          
        <div className="profile-pic">
            
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
