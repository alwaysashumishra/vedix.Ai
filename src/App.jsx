import React, { useState, useEffect } from "react";

import Preloader from "./components/Preloader/Preloader";
import LoginPopUp from "./components/LoginPopUp/LoginPopUp";

import Router from "./Router";

const App = () => {

  const [loading, setLoading] =
    useState(true);

  const [showLogin, setShowLogin] =
    useState(false);


  // USER PROFILE
  const [profile, setProfile] =
    useState(
      JSON.parse(
        localStorage.getItem("user")
      ) || null
    );


  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);

  }, []);


  return (
    <>

      {loading ? (

        <Preloader />

      ) : (

        <>

          {showLogin && (

            <LoginPopUp
              setShowLogin={setShowLogin}
              setProfile={setProfile}
            />
          )}


          <Router
            showLogin={showLogin}
            setShowLogin={setShowLogin}
            profile={profile}
            setProfile={setProfile}
          />

        </>
      )}

    </>
  );
};

export default App;