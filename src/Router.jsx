import React from "react";

import Explore from "./Pages/Explore/Explore";

import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home/Home";


const Router = ({
  showLogin,
  setShowLogin,
  profile,
  setProfile,
}) => {

  return (

    <Routes>

      <Route
        path="/"
        element={
          <Home
            showLogin={showLogin}
            setShowLogin={setShowLogin}
            profile={profile}
            setProfile={setProfile}
          />
        }
      />

      <Route
        path="/explore"
        element={<Explore />}
      />

    </Routes>
  );
};

export default Router;