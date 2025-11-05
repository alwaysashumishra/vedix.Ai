import React from "react";
import "./Preloader.css";

const Preloader = () => {
  return (
    <div className="preloader">
      <div className="ai-animation">
        <div className="circle"></div>
        <div className="circle delay1"></div>
        <div className="circle delay2"></div>
      </div>
      <h1 className="app-name">Lexi.AI</h1>
      <p className="tagline">Your Smart AI Companion</p>
    </div>
  );
};

export default Preloader;
