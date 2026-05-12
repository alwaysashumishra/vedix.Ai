import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setprevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  // Typing animation
  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 20 * index);
  };

  const onSent = async (prompt) => {

    const finalPrompt = prompt || input;

    if (!finalPrompt.trim()) {
      setResultData("⚠ Please enter a prompt");
      return;
    }

    try {

      setLoading(true);
      setShowResult(true);
      setResultData("");

      setRecentPrompt(finalPrompt);

      setprevPrompts((prev) => [
        ...prev,
        finalPrompt,
      ]);

      // Gemini response
      const response = await runChat(finalPrompt);

      if (!response) {
        setResultData("⚠ No response from Gemini");
        return;
      }

      // Bold formatting (**text**)
      let responseArray = response.split("**");

      let newResponse = "";

      for (let i = 0; i < responseArray.length; i++) {

        if (i % 2 === 0) {
          newResponse += responseArray[i];
        } else {
          newResponse += `<b>${responseArray[i]}</b>`;
        }
      }

      // Line break formatting
      let formattedResponse = newResponse.replace(/\n/g, "<br/>");

      // Typing animation
      let words = formattedResponse.split(" ");

      for (let i = 0; i < words.length; i++) {
        delayPara(i, words[i] + " ");
      }

    } catch (error) {

      console.error("Context Error 👉", error);

      setResultData("⚠ Gemini API Error");

    } finally {

      setLoading(false);
      setInput("");
    }
  };

  const contextValue = {
    prevPrompts,
    setprevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;