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

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <div style={{ visibility: loading ? "hidden" : "visible", height: loading ? "0" : "auto", overflow: loading ? "hidden" : "visible" }}>
        {showLogin && (
          <LoginPopUp setShowLogin={setShowLogin} setProfile={setProfile} />
        )}

        <Router
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          profile={profile}
          setProfile={setProfile}
        />
      </div>
    </>
  );
};

export default App;
