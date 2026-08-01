import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Explore from "./Pages/Explore/Explore";
import ResumeAnalyzer from "./Pages/ResumeAnalyzer/ResumeAnalyzer";
import PaperAnalyzer from "./Pages/PaperAnalyzer/PaperAnalyzer";
import Plans from "./Pages/Plans/Plans";
import Admin from "./Pages/Admin/Admin";

const AccessGate = ({ setShowLogin }) => (
  <div className="access-gate">
    <div className="access-gate-card">
      <h1>Sign in to continue</h1>
      <p>Log in or create your account to use this section.</p>
      <button type="button" onClick={() => setShowLogin(true)}>
        Open login
      </button>
    </div>
  </div>
);

const ProtectedRoute = ({ profile, setShowLogin, children }) => {
  useEffect(() => {
    if (!profile) {
      setShowLogin(true);
    }
  }, [profile, setShowLogin]);

  if (!profile) {
    return <AccessGate setShowLogin={setShowLogin} />;
  }

  return children;
};

const Router = ({ showLogin, setShowLogin, profile, setProfile }) => {
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
        path="/plans"
        element={<Plans profile={profile} setShowLogin={setShowLogin} />}
      />

      <Route
        path="/explore"
        element={
          <ProtectedRoute profile={profile} setShowLogin={setShowLogin}>
            <Explore
              profile={profile}
              setProfile={setProfile}
              setShowLogin={setShowLogin}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume-analyzer"
        element={
          <ProtectedRoute profile={profile} setShowLogin={setShowLogin}>
            <ResumeAnalyzer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/paper-analyzer"
        element={
          <ProtectedRoute profile={profile} setShowLogin={setShowLogin}>
            <PaperAnalyzer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute profile={profile} setShowLogin={setShowLogin}>
            <Admin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default Router;
