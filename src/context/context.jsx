
import {
  createContext,
  useState,
}
from "react";

import runChat
from "../config/gemini";



export const Context =
  createContext();




const ContextProvider = (props) => {
  /* INPUT */
  const [input, setInput] = useState("");

  /* RECENT PROMPT */
  const [recentPrompt, setRecentPrompt] = useState("");

  /* RECENT CHATS */
  const [prevPrompts, setprevPrompts] = useState(
    JSON.parse(localStorage.getItem("prevPrompts")) || []
  );

  /* RESULT & LOADING */
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  /* CONVERSATION HISTORY FOR GEMINI MULTI-TURN */
  const [chatHistory, setChatHistory] = useState([]);
  const [messages, setMessages] = useState([]);

  const formatMarkdown = (response) => {
    let formatted = response;
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    formatted = formatted.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
    formatted = formatted.replace(/`(.*?)`/g, "<code>$1</code>");
    formatted = formatted.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    formatted = formatted.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    formatted = formatted.replace(/^# (.*$)/gim, "<h1>$1</h1>");
    formatted = formatted.replace(/\n/g, "<br/>");
    return formatted;
  };

  /* NEW CHAT RESET */
  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setResultData("");
    setRecentPrompt("");
    setChatHistory([]);
    setMessages([]);
    setInput("");
  };

  /* SEND PROMPT */
  const onSent = async (prompt, images) => {
    const finalPrompt = prompt || input;

    // Normalize images to array
    let imagesList = [];
    if (Array.isArray(images)) {
      imagesList = images;
    } else if (images) {
      imagesList = [images];
    }

    if (!finalPrompt?.trim() && imagesList.length === 0) {
      setResultData("⚠ Please enter a prompt or select an image");
      return;
    }

    try {
      setLoading(true);
      setShowResult(true);
      setResultData("");
      setRecentPrompt(finalPrompt);

      /* SAVE PROMPT IN SIDEBAR RECENT */
      if (finalPrompt && !prevPrompts.includes(finalPrompt)) {
        const updatedPrompts = [...prevPrompts, finalPrompt];
        setprevPrompts(updatedPrompts);
        localStorage.setItem("prevPrompts", JSON.stringify(updatedPrompts));
      }

      /* CREATE USER MESSAGE IN UI THREAD */
      const userMsgId = Date.now();
      const imageUrls = imagesList.map((img) =>
        typeof img === "string" ? img : URL.createObjectURL(img)
      );

      const userMessage = {
        id: userMsgId,
        role: "user",
        text: finalPrompt,
        images: imageUrls,
        image: imageUrls.length > 0 ? imageUrls[0] : null,
      };

      setMessages((prev) => [...prev, userMessage]);

      /* CALL GEMINI WITH CONVERSATION HISTORY */
      const response = await runChat(finalPrompt, imagesList, chatHistory);

      if (!response) {
        setResultData("⚠ No response from Gemini");
        return;
      }

      const formatted = formatMarkdown(response);
      setResultData(formatted);

      /* CREATE MODEL MESSAGE IN UI THREAD */
      const aiMessage = {
        id: Date.now() + 1,
        role: "model",
        text: formatted,
        rawText: response,
      };

      setMessages((prev) => [...prev, aiMessage]);

      /* UPDATE MULTI-TURN HISTORY FOR GEMINI API */
      const userPart = { text: finalPrompt };
      const modelPart = { text: response };

      setChatHistory((prev) => [
        ...prev,
        { role: "user", parts: [userPart] },
        { role: "model", parts: [modelPart] },
      ]);
    } catch (error) {
      console.error("Context Error 👉", error);
      setResultData("⚠ Gemini API Error");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  /* NOTES */
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("lexi_notes");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Error loading notes from localStorage", err);
      return [];
    }
  });

  const saveNote = (noteData) => {
    const newNote = {
      id: noteData.id || `note_${Date.now()}`,
      title: noteData.title || "Untitled Note",
      content: noteData.content || "",
      question: noteData.question || "",
      answer: noteData.answer || "",
      type: noteData.type || "manual", // "chat" | "manual"
      tags: noteData.tags || (noteData.type === "chat" ? ["Chat Q&A"] : ["General"]),
      createdAt: noteData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotes((prev) => {
      const existingIndex = prev.findIndex((n) => n.id === newNote.id);
      let updated;
      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...newNote };
      } else {
        updated = [newNote, ...prev];
      }
      localStorage.setItem("lexi_notes", JSON.stringify(updated));
      return updated;
    });
    return newNote;
  };

  const deleteNote = (id) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      localStorage.setItem("lexi_notes", JSON.stringify(updated));
      return updated;
    });
  };

  const updateNote = (id, updatedFields) => {
    setNotes((prev) => {
      const updated = prev.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            ...updatedFields,
            updatedAt: new Date().toISOString(),
          };
        }
        return note;
      });
      localStorage.setItem("lexi_notes", JSON.stringify(updated));
      return updated;
    });
  };

  /* CONTEXT VALUE */
  const contextValue = {
    prevPrompts,
    setprevPrompts,
    onSent,
    newChat,
    setRecentPrompt,
    setShowResult,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    chatHistory,
    messages,
    notes,
    saveNote,
    deleteNote,
    updateNote,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
