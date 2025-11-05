import React, { useState, useEffect } from "react"; 
import Sidebar from "./components/Sidebar/Sidebar";
import Main from "./components/Main/Main";
import Preloader from "./components/Preloader/Preloader";
import LoginPopUp from "./components/LoginPopUp/LoginPopUp";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [showLogin,setShowLogin] =useState(true);
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
         {showLogin?<LoginPopUp setShowLogin={setShowLogin}/>:<></>}
          <Sidebar />
          <Main />
        </>
      )}
    </>
  );
};

export default App;
