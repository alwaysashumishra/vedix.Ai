import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Main from '../../components/Main/Main'
import "./Home.css"
const Home = ({showLogin,setShowLogin,profile}) => {
  return (
    <>
      <Sidebar />
      <Main
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        profile={profile}
      />
    </>
  )
}

export default Home;