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

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 40 * index);
  };

  const onSent = async (prompt) => {
    const finalPrompt = prompt || input;

    if (!finalPrompt.trim()) {
      setResultData("⚠ Please enter a prompt");
      return;
    }

    try {
      setResultData("");
      setLoading(true);
      setShowResult(true);

      setRecentPrompt(finalPrompt);
      setprevPrompts((prev) => [...prev, finalPrompt]);

      const response = await runChat(finalPrompt);

      if (!response || typeof response !== "string") {
        throw new Error("Empty response from Gemini");
      }

      // **bold** formatting
      let responseArray = response.split("**");
      let newResponse = "";

      for (let i = 0; i < responseArray.length; i++) {
        newResponse +=
          i % 2 === 0
            ? responseArray[i]
            : `<b>${responseArray[i]}</b>`;
      }

      // line breaks
      let formattedResponse = newResponse.replace(/\*/g, "<br />");
      let words = formattedResponse.split(" ");

      words.forEach((word, i) => {
        delayPara(i, word + " ");
      });

    } catch (error) {
      console.error("Context Error 👉", error.message);
      setResultData("⚠ Gemini API error. Check console.");
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
