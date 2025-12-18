import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({ apiKey: "AIzaSyBaEMG4pWwWki9fBqQhnFToQ3Fvf4BKTzc"  });


export default async function runChat(prompt) {
  try {
   const response = await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: [{ role: "user", parts: [{ text: prompt }]}],
});


    // NEW RESPONSE FORMAT
    const text =
      response?.outputText ||
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "";

    return text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "⚠ Gemini API Error: " + error.message;
  }
}
