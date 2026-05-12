// src/config/gemini.js

const GEMINI_URL = import.meta.env.VITE_GEMINI_URL;
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const runChat = async (prompt) => {

  // Empty input check
  if (!prompt || !prompt.trim()) {
    return "⚠ Please enter a prompt";
  }

  try {

    // Debug env values
    console.log("Gemini URL 👉", GEMINI_URL);
    console.log("API KEY 👉", API_KEY);

    // Check env variables
    if (!GEMINI_URL || !API_KEY) {
      return "⚠ Environment variables missing";
    }

    // API request
    const response = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    // Convert response to JSON
    const data = await response.json();

    console.log("Gemini Response 👉", data);

    // Handle Gemini API errors
    if (data.error) {
      return `⚠ ${data.error.message}`;
    }

    // Extract response text safely
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    // No response case
    if (!text) {
      return "⚠ No response received from Gemini";
    }

    return text;

  } catch (error) {

    console.error("Gemini Fetch Error 👉", error);

    return "⚠ Something went wrong while fetching response";
  }
};

export default runChat;