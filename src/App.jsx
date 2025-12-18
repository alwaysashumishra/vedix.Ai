import React, { useState, useEffect } from "react";

import Preloader from "./components/Preloader/Preloader";
import LoginPopUp from "./components/LoginPopUp/LoginPopUp";
import Router from "./Router";
import { useNavigate } from "react-router-dom";


const App = () => {
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [profile, setProfile] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500); // 2.5 sec
    return () => clearTimeout(timer);
  }, []);
 
  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <>
          {showLogin ? (
            <LoginPopUp setShowLogin={setShowLogin} setProfile={setProfile} />
          ) : (
            <></>
          )}
   
          <Router  showLogin={showLogin}
        setShowLogin={setShowLogin}
        profile={profile}/>
          
        </>
      )}
    </>
  );
};

export default App;
