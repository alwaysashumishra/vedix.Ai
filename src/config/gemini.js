
const GEMINI_URL =
  import.meta.env.VITE_GEMINI_URL;

const API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY;



const runChat = async (
  prompt,
  image,
  history = []
) => {

  // EMPTY CHECK
  if (
    !prompt?.trim() &&
    !image
  ) {

    return "⚠ Please enter a prompt";
  }



  try {

    let parts = [];



    // TEXT
    if(prompt){

      parts.push({

        text: prompt,
      });
    }



    // IMAGE
    if(image){

      const imagePart =
        await fileToGenerativePart(
          image
        );

      parts.push(imagePart);
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
    const response =
      await fetch(

        `${GEMINI_URL}?key=${API_KEY}`,

        {
          method: "POST",

          headers: {

            "Content-Type":
            "application/json",
          },

          body: JSON.stringify({
            contents: contents,
          }),
        }
      );



    // RESPONSE
    const data =
      await response.json();

    console.log(
      "Gemini Response 👉",
      data
    );



    // ERROR
    if(data.error){

      return `⚠ ${data.error.message}`;
    }



    // RESPONSE TEXT
    const text =
      data?.candidates?.[0]
      ?.content?.parts?.[0]?.text;



    if(!text){

      return "⚠ No response received";
    }

    return text;

  }

  catch(error){

    console.error(
      "Gemini Fetch Error 👉",
      error
    );

    return "⚠ Gemini API Error";
  }
};





// IMAGE → BASE64
async function fileToGenerativePart(
  file
){

  const base64EncodedDataPromise =
    new Promise((resolve) => {

      const reader =
        new FileReader();

      reader.onloadend = () => {

        resolve(

          reader.result
          .split(",")[1]
        );
      };

      reader.readAsDataURL(file);
    });




  return {

    inline_data: {

      data:
      await base64EncodedDataPromise,

      mime_type:
      file.type,
    },
  };
}

export default runChat;
