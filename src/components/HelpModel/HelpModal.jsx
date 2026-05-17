import React,
{
  useState
}
from "react";

import "./HelpModal.css";

import emailjs
from "@emailjs/browser";



const SERVICE_ID =
  import.meta.env
  .VITE_EMAIL_SERVICE_ID;

const TEMPLATE_ID =
  import.meta.env
  .VITE_EMAIL_TEMPLATE_ID;

const PUBLIC_KEY =
  import.meta.env
  .VITE_EMAIL_PUBLIC_KEY;



const HelpModal = ({
  setShowHelp
}) => {

  const [formData, setFormData] =
    useState({

      name: "",

      email: "",

      message: "",
    });



  // HANDLE INPUT CHANGE
  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value,
    });
  };



  // SEND EMAIL
  const sendEmail = async (e) => {

    e.preventDefault();

    try {

      await emailjs.send(

        SERVICE_ID,

        TEMPLATE_ID,

        formData,

        PUBLIC_KEY
      );


      alert(
        "Message Sent Successfully ✅"
      );

      setShowHelp(false);

    }

    catch (error) {

      console.log(error);

      alert(
        "Failed To Send Message ❌"
      );
    }
  };



  return (

    <div className="help-modal">

      <form
        className="help-form"
        onSubmit={sendEmail}
      >

        {/* CLOSE BUTTON */}
        <div
          className="close-btn"

          onClick={() =>
            setShowHelp(false)
          }
        >
          ✕
        </div>



        <h2>
          Contact Support
        </h2>


        <p className="help-subtitle">
          Need help with Vedix.Ai?
          Send us your query.
        </p>



        {/* NAME */}
        <input
          type="text"

          name="name"

          placeholder="Your Name"

          value={formData.name}

          onChange={handleChange}

          required
        />



        {/* EMAIL */}
        <input
          type="email"

          name="email"

          placeholder="Your Email"

          value={formData.email}

          onChange={handleChange}

          required
        />



        {/* MESSAGE */}
        <textarea

          name="message"

          placeholder="Write your message..."

          value={formData.message}

          onChange={handleChange}

          required

        ></textarea>



        {/* SUBMIT */}
        <button type="submit">

          Send Message

        </button>

      </form>

    </div>
  );
};

export default HelpModal;