const API_KEY = "AIzaSyBf32hR5PJIMMaxUE1J_LnPCVKnIM1y4Z4";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

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

    // ❌ Agar response nahi aaya
    if (!data.candidates || !data.candidates.length) {
      return "";
    }

    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("Gemini Fetch Error 👉", error);
    return "";
  }
}
