const GEMINI_URL = import.meta.env.VITE_GEMINI_URL;
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default async function runChat(prompt) {
  if (!prompt || !prompt.trim()) {
    return "";
  }

  try {
    const response = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("Gemini Response 👉", data);

    if (!data.candidates || !data.candidates.length) {
      return "";
    }

    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("Gemini Fetch Error 👉", error);
    return "";
  }
}