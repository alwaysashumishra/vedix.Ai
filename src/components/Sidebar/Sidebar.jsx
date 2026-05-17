
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



const Sidebar = () => {

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

    prevPrompts,

    setprevPrompts,

    setRecentPrompt,

    setShowResult,

  } = useContext(Context);




  // LOAD OLD CHAT
  const loadPrompt =
  async (prompt) => {

    setRecentPrompt(prompt);

    await onSent(prompt);

    // MOBILE AUTO CLOSE
    if(
      window.innerWidth < 768
    ){
      setextended(false);
    }
  };




  // NEW CHAT
  const newChat = () => {

    setShowResult(false);

    if(
      window.innerWidth < 768
    ){
      setextended(false);
    }
  };




  // DELETE SINGLE CHAT
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

      {/* HELP MODAL */}
      {
        showHelp && (

          <HelpModal
            setShowHelp={
              setShowHelp
            }
          />
        )
      }



      {/* SETTINGS MODAL */}
      {
        showSettings && (

          <SettingsModal
            setShowSettings={
              setShowSettings
            }
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

            className="menu"

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
              <p>New Chat</p>
            }

          </div>





          {/* RECENT */}
          {
            extended && (

              <div className="recent">

                <p className="recent-title">
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

                          {/* LOAD CHAT */}
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
                            ✕
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
        <div className="bottom">


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
              <p>Help</p>
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
              <p>Activity</p>
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
              <p>Settings</p>
            }

          </div>

        </div>

      </div>

    </>
  );
};

export default Sidebar;
