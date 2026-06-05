
import React from "react";

import {
  Routes,
  Route
}
from "react-router-dom";



/* PAGES */
import Home
from "./Pages/Home/Home";

import Explore
from "./Pages/Explore/Explore";

import ResumeAnalyzer
from "./Pages/ResumeAnalyzer/ResumeAnalyzer";

import PaperAnalyzer
from "./Pages/PaperAnalyzer/PaperAnalyzer";



const Router = ({

  showLogin,

  setShowLogin,

  profile,

  setProfile,

}) => {

  return (

    <Routes>



      {/* HOME */}
      <Route

        path="/"

        element={

          <Home

            showLogin={
              showLogin
            }

            setShowLogin={
              setShowLogin
            }

            profile={profile}

            setProfile={
              setProfile
            }
          />
        }
      />






      {/* EXPLORE */}
      <Route

        path="/explore"

        element={
          <Explore />
        }
      />







      {/* RESUME ANALYZER */}
      <Route

        path="/resume-analyzer"

        element={
          <ResumeAnalyzer />
        }
      />








      {/* RESEARCH PAPER */}
      <Route

        path="/paper-analyzer"

        element={
          <PaperAnalyzer />
        }
      />



    </Routes>
  );
};

export default Router;
