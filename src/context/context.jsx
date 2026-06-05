
import {
  createContext,
  useState,
}
from "react";

import runChat
from "../config/gemini";



export const Context =
  createContext();




const ContextProvider =
(props) => {

  /* INPUT */
  const [input,
  setInput] =
    useState("");



  /* RECENT PROMPT */
  const [recentPrompt,
  setRecentPrompt] =
    useState("");



  /* RECENT CHATS */
  const [prevPrompts,
  setprevPrompts] =
    useState(

      JSON.parse(

        localStorage.getItem(
          "prevPrompts"
        )

      ) || []
    );



  /* RESULT */
  const [showResult,
  setShowResult] =
    useState(false);



  /* LOADING */
  const [loading,
  setLoading] =
    useState(false);



  /* RESULT DATA */
  const [resultData,
  setResultData] =
    useState("");






  /* TYPING EFFECT */
  const delayPara = (

    index,

    nextWord

  ) => {

    setTimeout(() => {

      setResultData(

        (prev) =>

        prev + nextWord
      );

    }, 12 * index);

  };








  /* SEND PROMPT */
  const onSent = async (

    prompt,

    image

  ) => {

    const finalPrompt =

      prompt || input;




    /* EMPTY CHECK */
    if(

      !finalPrompt?.trim()

      &&

      !image
    ){

      setResultData(

        "⚠ Please enter a prompt"
      );

      return;
    }






    try{

      setLoading(true);

      setShowResult(true);

      setResultData("");



      /* SET PROMPT */
      setRecentPrompt(
        finalPrompt
      );





      /* SAVE CHATS */
      const updatedPrompts = [

        ...prevPrompts,

        finalPrompt
      ];



      setprevPrompts(
        updatedPrompts
      );



      localStorage.setItem(

        "prevPrompts",

        JSON.stringify(
          updatedPrompts
        )
      );






      /* GEMINI */
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






      /* =========================
         MARKDOWN FORMAT
      ========================= */

      let formatted =
        response;



      /* BOLD */
      formatted = formatted.replace(

        /\*\*(.*?)\*\*/g,

        "<b>$1</b>"
      );



      /* CODE BLOCK */
      formatted = formatted.replace(

        /```([\s\S]*?)```/g,

        "<pre><code>$1</code></pre>"
      );



      /* INLINE CODE */
      formatted = formatted.replace(

        /`(.*?)`/g,

        "<code>$1</code>"
      );



      /* HEADINGS */
      formatted = formatted.replace(

        /^### (.*$)/gim,

        "<h3>$1</h3>"
      );



      formatted = formatted.replace(

        /^## (.*$)/gim,

        "<h2>$1</h2>"
      );



      formatted = formatted.replace(

        /^# (.*$)/gim,

        "<h1>$1</h1>"
      );



      /* LINE BREAK */
      formatted = formatted.replace(

        /\n/g,

        "<br/>"
      );







      /* TYPING */
      let words =
      formatted.split(" ");




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









  /* CONTEXT VALUE */
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
