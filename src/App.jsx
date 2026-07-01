import React, { useEffect, useState } from "react";
import Preloader from "./components/Preloader/Preloader";
import LoginPopUp from "./components/LoginPopUp/LoginPopUp";
import Router from "./Router";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [profile, setProfile] = useState(getStoredUser);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && !profile) {
      setShowLogin(true);
    }
  }, [loading, profile]);

  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <>
          {showLogin && (
            <LoginPopUp setShowLogin={setShowLogin} setProfile={setProfile} />
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
