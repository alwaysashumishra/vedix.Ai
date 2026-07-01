import React from "react";

import Sidebar from "../../components/Sidebar/Sidebar";

import Main from "../../components/Main/Main";

import "./Home.css";


const Home = ({
  showLogin,
  setShowLogin,
  profile,
  setProfile,
}) => {

  return (
    <div className="home-layout">

      <Sidebar />

      <Main
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        profile={profile}
        setProfile={setProfile}
      />
    </div>
  );
};

export default Home;
