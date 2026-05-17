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
import HelpModal from "../HelpModel/HelpModal";

const Sidebar = () => {

  const [extended, setextended] =
    useState(false);

  const [showHelp, setShowHelp] =
    useState(false);


  const {
    onSent,
    prevPrompts,
    setRecentPrompt,
    setShowResult,
  } = useContext(Context);



  // LOAD OLD CHAT
  const loadPrompt = async (prompt) => {

    setRecentPrompt(prompt);

    await onSent(prompt);
  };



  // NEW CHAT
  const newChat = () => {

    setShowResult(false);
  };



  return (

    <>

      {/* HELP MODAL */}
      {
        showHelp && (

          <HelpModal
            setShowHelp={setShowHelp}
          />
        )
      }



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
              setextended(!extended)
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
              extended
                ? <p>New Chat</p>
                : null
            }

          </div>



          {/* RECENT CHATS */}
          {
            extended ? (

              <div className="recent">

                <p className="recent-title">
                  Recent
                </p>


                {
                  prevPrompts.map(
                    (item, index) => {

                      return (

                        <div
                          key={index}

                          onClick={() =>
                            loadPrompt(item)
                          }

                          className="recent-entry"
                        >

                          <img
                            src={
                              assets.message_icon
                            }
                            alt=""
                          />

                          <p>
                            {
                              item.slice(0,18)
                            }...
                          </p>

                        </div>
                      );
                    }
                  )
                }

              </div>

            ) : null
          }

        </div>



        {/* BOTTOM */}
        <div className="bottom">

          {/* HELP */}
          <div
            className="bottom-item recent-entry"

            onClick={() =>
              setShowHelp(true)
            }
          >

            <img
              src={assets.question_icon}
              alt=""
            />

            {
              extended
                ? <p>Help</p>
                : null
            }

          </div>



          {/* ACTIVITY */}
          <div
            className="bottom-item recent-entry"
          >

            <img
              src={assets.history_icon}
              alt=""
            />

            {
              extended
                ? <p>Activity</p>
                : null
            }

          </div>



          {/* SETTINGS */}
          <div
            className="bottom-item recent-entry"
          >

            <img
              src={assets.setting_icon}
              alt=""
            />

            {
              extended
                ? <p>Settings</p>
                : null
            }

          </div>

        </div>

      </div>

    </>
  );
};

export default Sidebar;