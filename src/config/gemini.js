const GEMINI_URL = import.meta.env.VITE_GEMINI_URL;
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const runChat = async (prompt, images, history = []) => {
  // Normalize images parameter to array
  let imagesList = [];
  if (Array.isArray(images)) {
    imagesList = images;
  } else if (images) {
    imagesList = [images];
  }

  // EMPTY CHECK
  if (!prompt?.trim() && imagesList.length === 0) {
    return "⚠ Please enter a prompt or attach an image";
  }

  try {
    let parts = [];

    // TEXT PART
    if (prompt && prompt.trim()) {
      parts.push({
        text: prompt,
      });
    }

    // MULTIPLE IMAGES PARTS (up to 5 images)
    for (const img of imagesList) {
      if (img) {
        const imagePart = await fileToGenerativePart(img);
        parts.push(imagePart);
      }
    }

    // MULTI-TURN CONVERSATION CONTENTS
    const contents = [
      ...history,
      {
        role: "user",
        parts: parts,
      },
    ];

    // GEMINI API CALL
    const response = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: contents,
      }),
    });

    const data = await response.json();
    console.log("Gemini Response 👉", data);

    if (data.error) {
      return `⚠ ${data.error.message}`;
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return "⚠ No response received";
    }

    return text;
  } catch (error) {
    console.error("Gemini Fetch Error 👉", error);
    return "⚠ Gemini API Error";
  }
};

// IMAGE → BASE64 CONVERTER
async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result.split(",")[1]);
    };

    reader.readAsDataURL(file);
  });

  return {
    inline_data: {
      data: await base64EncodedDataPromise,
      mime_type: file.type || "image/jpeg",
    },
  };
}

export default runChat;
