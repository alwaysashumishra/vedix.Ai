import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import "./BackHomeButton.css";

const BackHomeButton = ({ className = "", label = "Home" }) => {
  return (
    <Link to="/" className={`back-home-btn ${className}`.trim()}>
      <FiArrowLeft className="back-home-arrow" />
      <FiHome className="back-home-icon" />
      <span>{label}</span>
    </Link>
  );
};

export default BackHomeButton;
