import React, { useState } from "react";
import "./LoginPopUp.css";

import { assets } from "../../assets/assets";

import { GiCrossedBones } from "react-icons/gi";

import {
  registerUser,
  loginUser,
} from "../../config/auth";

const LoginPopUp = ({
  setShowLogin,
  setProfile,
}) => {

  const [currstate, setcurrstate] =
    useState("login");

  const [username, setUsername] =
    useState("");

  const [name, setname] =
    useState("");

  const [surname, setsurname] =
    useState("");

  const [dob, setDob] =
    useState("");

  const [email, setemail] =
    useState("");

  const [password, setpassword] =
    useState("");

  const [profilePic, setProfilePic] =
    useState(assets.user_icon);



  // IMAGE UPLOAD
  const handleImageUpload = (event) => {

    const file = event.target.files[0];

    if (file) {

      const imageUrl =
        URL.createObjectURL(file);

      setProfilePic(imageUrl);
    }
  };



  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      // SIGNUP
      if (currstate === "signup") {

        const data =
          await registerUser({
            username,
            name,
            surname,
            dob,
            email,
            password,
            profilePic,
          });

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        alert("Account Created ✅");

        setProfile(data.user);

        setShowLogin(false);
      }


      // LOGIN
      else {

        const data =
          await loginUser({
            email,
            password,
          });

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        alert(
          `Welcome ${data.user.username}`
        );

        setProfile(data.user);

        setShowLogin(false);
      }

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  };



  return (
    <div className="login-popup">

      <form
        className="login-popup-container"
        onSubmit={handleSubmit}
      >

        <div className="login-popup-title">

          <h2>{currstate}</h2>

          <div
            onClick={() =>
              setShowLogin(false)
            }
          >
            <GiCrossedBones />
          </div>

        </div>



        <div className="login-popup-inputs">

          {/* PROFILE IMAGE */}
          {currstate === "signup" && (

            <div className="profile-container">

              <label htmlFor="profile-upload">

                <img
                  src={profilePic}
                  alt="profile"
                  className="profile-pic"
                />

              </label>

              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />

            </div>
          )}



          {/* USERNAME */}
          {currstate === "signup" && (

            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />
          )}



          {/* NAME */}
          {currstate === "signup" && (

            <input
              type="text"
              placeholder="Name"
              required
              value={name}
              onChange={(e) =>
                setname(e.target.value)
              }
            />
          )}



          {/* SURNAME */}
          {currstate === "signup" && (

            <input
              type="text"
              placeholder="Surname"
              required
              value={surname}
              onChange={(e) =>
                setsurname(e.target.value)
              }
            />
          )}



          {/* DOB */}
          {currstate === "signup" && (

            <input
              type="date"
              required
              value={dob}
              onChange={(e) =>
                setDob(e.target.value)
              }
            />
          )}



          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) =>
              setemail(e.target.value)
            }
          />



          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) =>
              setpassword(e.target.value)
            }
          />

        </div>



        <button type="submit">

          {currstate === "signup"
            ? "Create Account"
            : "Login"}

        </button>



        <div className="login-popup-condition">

          <input type="checkbox" required />

          <p>
            By continuing, I agree
            to the terms and privacy
            policy.
          </p>

        </div>



        {currstate === "login" ? (

          <p>
            Create new account?{" "}

            <span
              onClick={() =>
                setcurrstate("signup")
              }
            >
              Click here
            </span>

          </p>

        ) : (

          <p>
            Already have account?{" "}

            <span
              onClick={() =>
                setcurrstate("login")
              }
            >
              Login
            </span>

          </p>
        )}

      </form>
    </div>
  );
};

export default LoginPopUp;