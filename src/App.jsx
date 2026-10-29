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
  const [loading, setLoading] = useState(() => {
    try {
      // Don't re-run preloader if already seen in current session
      if (sessionStorage.getItem("lexi_preloader_seen") === "true") {
        return false;
      }
    } catch {}
    return true;
  });

  const [showLogin, setShowLogin] = useState(false);
  const [profile, setProfile] = useState(getStoredUser);

  // Safety fallback to guarantee content always appears even if preloader is skipped or delayed
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setLoading(false);
    }, 2200);
    return () => clearTimeout(fallbackTimer);
  }, []);

  const handlePreloaderComplete = () => {
    try {
      sessionStorage.setItem("lexi_preloader_seen", "true");
    } catch {}
    setLoading(false);
  };

  return (
    <>
      {loading && <Preloader onComplete={handlePreloaderComplete} />}
      <div
        style={{
          visibility: loading ? "hidden" : "visible",
          height: loading ? "0" : "auto",
          overflow: loading ? "hidden" : "visible",
        }}
      >
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
