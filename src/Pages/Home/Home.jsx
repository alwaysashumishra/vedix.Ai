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
    <>

      <Sidebar />

<Main
  showLogin={showLogin}
  setShowLogin={setShowLogin}
  profile={profile}
  setProfile={setProfile}
/>
    </>
  );
};

export default Home;