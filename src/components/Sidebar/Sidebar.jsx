
import React,
{
  useContext,
  useState
}
from "react";

import "./Sidebar.css";

import { assets }
from "../../assets/assets";

import { Context }
from "../../context/context";

import HelpModal
from "../HelpModel/HelpModal";

import SettingsModal
from "../SettingsModal/SettingsModal";

import { FiCompass, FiCreditCard, FiFileText, FiShield, FiBookmark } from "react-icons/fi";

import { MdOutlineArticle } from "react-icons/md";

import {
  NavLink,
  useLocation
}
from "react-router-dom";



const Sidebar = ({ profile, setProfile }) => {

  const location = useLocation();
  const isNotesPage = location.pathname === "/notes";

  const [extended,
  setextended] =
    useState(false);

  const [showHelp,
  setShowHelp] =
    useState(false);

  const [showSettings,
  setShowSettings] =
    useState(false);




  const {
    onSent,
    newChat: contextNewChat,
    prevPrompts,
    setprevPrompts,
    setRecentPrompt,
    setShowResult,
  } = useContext(Context);

  const isAdminUser = () => {
    if (!profile || !profile.email) return false;
    const email = profile.email.trim().toLowerCase().replace("..com", ".com");
    return email === "ashutoshmmishra15@gmail.com" || profile.isAdmin === true;
  };

  /* LOAD OLD CHAT */
  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);

    // MOBILE AUTO CLOSE
    if (window.innerWidth < 768) {
      setextended(false);
    }
  };

  /* NEW CHAT */
  const newChat = () => {
    if (contextNewChat) {
      contextNewChat();
    } else {
      setShowResult(false);
    }

    if (window.innerWidth < 768) {
      setextended(false);
    }
  };





  /* DELETE CHAT */
  const deleteChat = (
    indexToDelete
  ) => {

    const updatedChats =

      prevPrompts.filter(

        (_, index) =>

        index !== indexToDelete
      );



    setprevPrompts(
      updatedChats
    );



    localStorage.setItem(

      "prevPrompts",

      JSON.stringify(
        updatedChats
      )
    );
  };







  return (

    <>

      {/* HELP */}
      {
        showHelp && (

          <HelpModal
            setShowHelp={
              setShowHelp
            }
          />
        )
      }





      {/* SETTINGS */}
      {
        showSettings && (
          <SettingsModal
            setShowSettings={setShowSettings}
            profile={profile}
            setProfile={setProfile}
          />
        )
      }







      {/* SIDEBAR */}
      <div
        className={`sidebar ${
          extended ? "active" : ""
        }`}
      >




        {/* TOP */}
        <div className="top">



          {/* MENU */}
          <img

            className={`menu ${isNotesPage && !extended ? "hide-mobile-menu" : ""}`}

            onClick={() =>
              setextended(
                !extended
              )
            }

            src={assets.menu_icon}

            alt=""
          />






          {/* NEW CHAT */}
          <div

            className="new-chat"

            onClick={newChat}
          >

            <img
              src={assets.plus_icon}
              alt=""
            />

            {
              extended &&
              <p>
                New Chat
              </p>
            }

          </div>







          {/* AI TOOLS */}
          {
            extended && (

              <div className="
              ai-tools
              ">

                <p className="
                recent-title
                ">

                  AI Tools

                </p>


                {/* EXPLORE */}
                <NavLink

                  to="/explore"

                  className="
                  recent-entry
                  ai-tool-link
                  "
                >

                  <FiCompass />

                  <p>
                    Explore
                  </p>

                </NavLink>

                {/* NOTES */}
                <NavLink

                  to="/notes"

                  className="
                  recent-entry
                  ai-tool-link
                  "
                >

                  <FiBookmark />

                  <p>
                    Notes
                  </p>

                </NavLink>








                {/* RESUME */}
                <NavLink

                  to="/resume-analyzer"

                  className="
                  recent-entry
                  ai-tool-link
                  "
                >

                  <FiFileText />

                  <p>
                    Resume AI
                  </p>

                </NavLink>






                {/* RESEARCH */}
                <NavLink

                  to="/paper-analyzer"

                  className="
                  recent-entry
                  ai-tool-link
                  "
                >

                  <MdOutlineArticle />

                  <p>
                    Research AI
                  </p>

                </NavLink>




                {/* PLANS */}
                <NavLink

                  to="/plans"

                  className="
                  recent-entry
                  ai-tool-link
                  "
                >

                  <FiCreditCard />

                  <p>
                    Plans
                  </p>

                </NavLink>


                {/* ADMIN */}
                {isAdminUser() && (
                  <NavLink

                    to="/admin"

                    className="
                    recent-entry
                    ai-tool-link
                    "
                  >

                    <FiShield />

                    <p>
                      Admin
                    </p>

                  </NavLink>
                )}

              </div>
            )
          }








          {/* RECENT */}
          {
            extended && (

              <div className="
              recent
              ">

                <p className="
                recent-title
                ">

                  Recent

                </p>





                {
                  prevPrompts.map(

                    (
                      item,
                      index
                    ) => {

                      return (

                        <div

                          key={index}

                          className="
                          recent-entry
                          recent-chat
                          "
                        >




                          {/* LOAD */}
                          <div

                            className="
                            recent-left
                            "

                            onClick={() =>
                              loadPrompt(item)
                            }
                          >

                            <img

                              src={
                                assets.message_icon
                              }

                              alt=""
                            />

                            <p>

                              {
                                item.slice(
                                  0,
                                  18
                                )
                              }...

                            </p>

                          </div>






                          {/* DELETE */}
                          <span

                            className="
                            delete-chat
                            "

                            onClick={() =>
                              deleteChat(
                                index
                              )
                            }
                          >

                            âœ•

                          </span>

                        </div>
                      );
                    }
                  )
                }

              </div>
            )
          }

        </div>








        {/* BOTTOM */}
        <div className="
        bottom
        ">




          {/* HELP */}
          <div

            className="
            bottom-item
            recent-entry
            "

            onClick={() =>
              setShowHelp(true)
            }
          >

            <img
              src={assets.question_icon}
              alt=""
            />

            {
              extended &&
              <p>
                Help
              </p>
            }

          </div>






          {/* ACTIVITY */}
          <div
            className="
            bottom-item
            recent-entry
            "
          >

            <img
              src={assets.history_icon}
              alt=""
            />

            {
              extended &&
              <p>
                Activity
              </p>
            }

          </div>






          {/* SETTINGS */}
          <div

            className="
            bottom-item
            recent-entry
            "

            onClick={() =>
              setShowSettings(true)
            }
          >

            <img
              src={assets.setting_icon}
              alt=""
            />

            {
              extended &&
              <p>
                Settings
              </p>
            }

          </div>

        </div>

      </div>

    </>
  );
};

export default Sidebar;





