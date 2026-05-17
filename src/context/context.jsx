import {
  createContext,
  useState
}
from "react";

import runChat
from "../config/gemini";

export const Context =
  createContext();



const ContextProvider = (props) => {

  const [input, setInput] =
    useState("");

  const [recentPrompt,
  setRecentPrompt] =
    useState("");

  const [prevPrompts,
  setprevPrompts] =
    useState([]);

  const [showResult,
  setShowResult] =
    useState(false);

  const [loading,
  setLoading] =
    useState(false);

  const [resultData,
  setResultData] =
    useState("");




  // TYPING EFFECT
  const delayPara = (
    index,
    nextWord
  ) => {

    setTimeout(() => {

      setResultData(
        (prev) =>
        prev + nextWord
      );

    }, 20 * index);
  };




  // SEND PROMPT
  const onSent = async (

    prompt,
    image

  ) => {

    const finalPrompt =
      prompt || input;



    if (
      !finalPrompt?.trim() &&
      !image
    ) {

      setResultData(
        "⚠ Please enter a prompt"
      );

      return;
    }



    try {

      setLoading(true);

      setShowResult(true);

      setResultData("");



      setRecentPrompt(
        finalPrompt
      );



      setprevPrompts((prev) => [

        ...prev,

        finalPrompt,
      ]);




      // GEMINI RESPONSE
      const response =
        await runChat(

          finalPrompt,
          image
        );



      if(!response){

        setResultData(
          "⚠ No response from Gemini"
        );

        return;
      }




      // BOLD FORMAT
      let responseArray =
        response.split("**");

      let newResponse = "";



      for(
        let i = 0;
        i < responseArray.length;
        i++
      ){

        if(i % 2 === 0){

          newResponse +=
            responseArray[i];

        }

        else{

          newResponse +=

            `<b>${
              responseArray[i]
            }</b>`;
        }
      }




      // LINE BREAKS
      let formattedResponse =

        newResponse.replace(
          /\n/g,
          "<br/>"
        );




      // TYPING EFFECT
      let words =
        formattedResponse.split(" ");



      for(
        let i = 0;
        i < words.length;
        i++
      ){

        delayPara(
          i,
          words[i] + " "
        );
      }

    }

    catch(error){

      console.error(
        "Context Error 👉",
        error
      );

      setResultData(
        "⚠ Gemini API Error"
      );
    }

    finally{

      setLoading(false);

      setInput("");
    }
  };





  const contextValue = {

    prevPrompts,
    setprevPrompts,

    onSent,

    setRecentPrompt,

    setShowResult,

    recentPrompt,

    showResult,

    loading,

    resultData,

    input,

    setInput,
  };



  return (

    <Context.Provider
      value={contextValue}
    >

      {props.children}

    </Context.Provider>
  );
};

export default ContextProvider;

